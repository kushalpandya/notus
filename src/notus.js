/**
 * notus v0.1.0
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 12 February, 2016
 *
 * Main Notus Script.
 */

(function() {
    "use strict";

    var self = this,
        hasRequire = (typeof require !== 'undefined'),
        old_notus = self.notus,
        _n = {},
        notus;

    var htmlEntityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        },
        notusTypeMap = {
            'popup': 'popup',
            'toast': 'toast',
            'snackbar': 'snackbar'
        },
        positionShorts = {
            'top-left': 'tl',
            'top-right': 'tr',
            'bottom-left': 'bl',
            'bottom-right': 'br',
            'top': 'top',
            'bottom': 'bottom',
            'tl': 'tl',
            'tr': 'tr',
            'bl': 'bl',
            'br': 'br',
            't': 'top',
            'b': 'bottom'
        },
        positionForType = {
            'popup': ['tl', 'tr', 'bl', 'br'],
            'toast': ['top', 'bottom'],
            'snackbar': ['top', 'bottom'],
        },
        alertTypeMap = {
            'success': 'success',
            'failure': 'failure',
            'warning': 'warning',
            'custom': 'custom',
            'none': ''
        };

    var fnValidateConfig,
        fnGetParentClassList,
        fnCreateNotusContainer,
        fnGetEntryAnimatorStyle,
        fnGetExitAnimatorStyle,
        fnBindCloseHandler,
        fnBindCloseListener,
        fnBindActionHandler,
        fnCreateNotusEl;

    /**
     * Local Utility API.
     */
    _n = {
        /**
         * Generate timestamp based unique ID.
         */
        genId: function() {
            return 'notus-' + Math.floor(Math.random() * 10000000000000001);
        },

        /**
         * Simple Object extender (similar to jQuery's $.extend()).
         * courtesy; SO < http://stackoverflow.com/a/11197343/414749 >
         */
        extend: function() {
            var key, i;

            for (i = 1; i < arguments.length; i++)
            {
                for (key in arguments[i])
                {
                    if (arguments[i].hasOwnProperty(key))
                        arguments[0][key] = arguments[i][key];
                }
            }

            return arguments[0];
        },

        /**
         * String formatter.
         * Accepts first param as target string, and following params as strings to
         * replace placeholders (eg; {0}).
         * courtesy: SO <http://stackoverflow.com/a/1038930/414749>
         */
        format: function() {
            var str = arguments[0],
                reg,
                i;

            for (i = 0; i < arguments.length - 1; i++) {
                reg = new RegExp("\\{" + i + "\\}", "gm");
                str = str.replace(reg, arguments[i + 1]);
            }

            return str;
        },

        /**
         * Escapes HTML tags present in the string.
         * courtesy: Mustache.js < https://github.com/janl/mustache.js >
         */
        escapeHtml: function(string) {
            return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
                return htmlEntityMap[s];
            });
        },

        /**
         * Removes an Element from the DOM.
         * This method uses el.remove() internally in supported browsers
         * except for IE11, where it is using el.parent.removeChild().
         * courtesy: MDN < https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove >
         */
        removeEl: function(el) {
            if (typeof el.remove === 'function')
                el.remove();
            else if (el.parentElement)
                el.parentElement.removeChild(el);
        }
    };

    /** Helpers Begin **/

    /**
     * Validate user configuration and throw Errors accordingly.
     */
    fnValidateConfig = function(config) {
        var type = config.notusType,
            position = config.notusPosition;

        if (notusTypeMap[type] === undefined)
            throw new Error('Unknown value for notusType');

        if (positionShorts[position] === undefined)
            throw new Error('Unknown value for notusPosition');

        if (alertTypeMap[config.alertType] === undefined)
            throw new Error('Unknown value for alertType');

        if (positionForType[type].indexOf(positionShorts[position]) < 0)
            throw new Error('Unsupported position "' + position + '" for notusType "' + type + '"');

        if (config.closeHandler &&
            typeof config.closeHandler !== "function")
            throw new Error("closeHandler is not a function");

        if (config.notusType === 'snackbar' &&
            config.actionable &&
            typeof config.actionHandler !== "function")
            throw new Error("actionHandler is not a function");
    };

    /**
     * Creates list of CSS classes which are to be applied main Notus element based on config.
     */
    fnGetParentClassList = function(config) {
        var classList = [],
            type = config.notusType,
            alertType = config.alertType;

        classList.push('notus');

        classList.push('notus-type-' + notusTypeMap[type]);

        if (alertTypeMap[alertType])
            classList.push('notus-alert-' + alertTypeMap[alertType]);

        if (config.themeClass)
            classList.push(config.themeClass);

        return classList;
    };

    /**
     * Creates new (or returns existing) Notus container elements to house Notus for a particular position.
     * Note that it creates containers for all position types that Notus supports, and it will return
     * reference to an existing container if it was previously created.
     */
    fnCreateNotusContainer = function(config) {
        var type = config.notusType,
            position = config.notusPosition,
            containerCls = ['notus-container'],
            containerEl;

        containerCls.push('notus-position-' + positionShorts[position]);

        if (type !== 'popup')
            containerCls.push((type === 'toast') ? 'notus-container-toast' : 'notus-container-snackbar');

        containerEl = document.querySelector('.' + containerCls.join('.'));

        if (!containerEl)
        {
            containerEl = document.createElement('div');
            containerEl.setAttribute('class', containerCls.join(' '));
            document.body.appendChild(containerEl);
        }

        return containerEl;
    };

    /**
     * Binds Timer event on each Notus that has autoClose set to true.
     * the timer waits for autoCloseDuration to finish before closing & destroying Notus.
     */
    fnBindCloseListener = function(config, notusEl) {
        var type = config.notusType,
            animationType = config.animationType;

        setTimeout(function() {
            notusEl.setAttribute('style', fnGetExitAnimatorStyle(config).join(';'));

            if (animationType === 'slide')
            {
                notusEl.classList.remove('notus-slide-in');
                notusEl.classList.add('notus-slide-out');
            }
            else
            {
                notusEl.classList.remove('notus-fade-in');
                notusEl.classList.add('notus-fade-out');
            }

            setTimeout(function() {
                _n.removeEl(notusEl);
            }, config.animationDuration);

        }, config.autoCloseDuration);
    };

    /**
     * Binds Mouse Click event handler on Close element of Notus.
     * it optionally supports closeHandler function that gets called before Notus is destroyed.
     * if closeHandler returns false (boolean false), Notus will be prevented from destroying.
     */
    fnBindCloseHandler = function(config, notusEl) {
        var closeEl = notusEl.querySelector('.notus-close');

        closeEl.onclick = function(e) {
            var doRemove = false,
                handlerReturnVal;

            if (config.closeHandler)
            {
                handlerReturnVal = config.closeHandler.apply(this, arguments);
                doRemove = (typeof handlerReturnVal === 'boolean') ? handlerReturnVal : true;
            }
            else
                doRemove = true;

            if (doRemove)
                _n.removeEl(notusEl);
        };
    };

    /**
     * Binds Mouse Click event handler on action element of Notus type Snackbar.
     */
    fnBindActionHandler = function(config, notusEl) {
        var actionEl = notusEl.querySelector('.notus-action');

        actionEl.onclick = function(e) {
            config.actionHandler.apply(this, arguments);
            _n.removeEl(notusEl);
        };
    };

    /**
     * Updates and applies Entry Animation CSS styles and Classes of Notus Element based on config.
     */
    fnGetEntryAnimatorStyle = function(config) {
        var type = config.notusType,
            animationType = config.animationType,
            animationFunction = config.animationFunction,
            animationDuration = config.animationDuration / 1000,
            isSlide = animationType === 'slide',
            animators = [];

        if (type === 'popup')
            animators.push(isSlide ? 'transform: translateX(0%)' : 'opacity: 1');
        else
            animators.push(isSlide ? 'transform: translateY(0%)' : 'opacity: 1');

        if (animationDuration > 0)
            animators.push(_n.format('animation-duration: {0}s', animationDuration));

        if (animationFunction)
            animators.push(_n.format('animation-timing-function: {0}', animationFunction));

        return animators;
    };

    /**
     * Updates and applies Exit Animation CSS styles and Classes of Notus Element based on config.
     */
    fnGetExitAnimatorStyle = function(config) {
        var type = config.notusType,
            position = config.notusPosition,
            animationType = config.animationType,
            animationFunction = config.animationFunction,
            animationDuration = config.animationDuration / 1000,
            isSlide = animationType === 'slide',
            animators = [];

        if (type === 'popup')
        {
            if (positionShorts[position].indexOf('l') > -1)
                animators.push(isSlide ? 'transform: translateX(-110%)' : 'opacity: 0');
            else
                animators.push(isSlide ? 'transform: translateX(110%)' : 'opacity: 0');
        }
        else
        {
            if (positionShorts[position] === 'top')
                animators.push(isSlide ? 'transform: translateY(-110%)' : 'opacity: 0');
            else
                animators.push(isSlide ? 'transform: translateY(110%)' : 'opacity: 0');
        }

        if (animationDuration > 0)
            animators.push(_n.format('animation-duration: {0}s', animationDuration));

        if (animationFunction)
            animators.push(_n.format('animation-timing-function: {0}', animationFunction));

        return animators;
    };

    /**
     * Creates main Notus DOM Element based with provided config.
     */
    fnCreateNotusEl = function(config) {
        var parentDiv = document.createElement('div'),
            isSlide = config.animationType === 'slide',
            htmlStringSupported = config.htmlString,
            classList = [],
            notusElTpl = '',
            notusTitleElTpl = '',
            actionElTpl = '',
            closeElTpl = '';

        classList = fnGetParentClassList(config);

        if (config.animate)
        {
            classList.push(isSlide ? 'notus-slide' : 'notus-fade');
            classList.push(isSlide ? 'notus-slide-in' : 'notus-fade-in');

            parentDiv.setAttribute('style', fnGetEntryAnimatorStyle(config).join(';'));
        }

        parentDiv.setAttribute('id', _n.genId());
        parentDiv.setAttribute('class', classList.join(' '));

        if (config.closable)
        {
            closeElTpl = [
                '<div class="notus-body-item notus-close">',
                    '<span class="icon-close">&times;</span>',
                '</div>'
            ].join('');
        }

        if (config.notusType === 'snackbar')
        {
            if (config.actionable) // actionable is only supported for Snackbar Notus.
            {
                actionElTpl = [
                    '<div class="notus-body-item notus-action">',
                        '<span class="icon-action">{2}</span>',
                    '</div>'
                ].join('');
            }
        }
        else
            notusTitleElTpl = '<div class="notus-content-title">{0}</div>';

        notusElTpl = [
            '<div class="notus-body-item notus-content">',
                notusTitleElTpl,
                '<div class="notus-content-body">',
                    '{1}',
                '</div>',
            '</div>',
            closeElTpl,
            actionElTpl
        ].join('');

        parentDiv.innerHTML = _n.format(notusElTpl,
                                    htmlStringSupported ? config.title : _n.escapeHtml(config.title),
                                    htmlStringSupported ? config.message : _n.escapeHtml(config.message),
                                    htmlStringSupported ? config.actionText : _n.escapeHtml(config.actionText)
                                );

        return parentDiv;
    };

    /** Helpers End **/

    /** Main Notus Object Begin **/

    notus = self.notus = function(userConfig) {
        var bodyEL = document.body,
            defaultConfig = {},
            thisNotus = {};

        /** Default Config options that Notus provides **/
        defaultConfig = {
            notusType: 'popup',                     /* Type can be anything from; 'popup', 'toast' or 'snackbar' */

            notusPosition: 'top-right',             /* Available positions for different notus types;
                                                       'popup'              => 'top-left' ('tl'), 'bottom-left' ('bl'),
                                                                               'top-right' ('tr') or 'bottom-right' ('br')
                                                       'toast' & 'snackbar' => 'top' ('t') or 'bottom' ('b') */

            alertType: 'none',                      /* Alert type can be; 'none', 'success', 'failure' or 'warning' */

            htmlString: false,                      /* Enable HTML support in strings provided for 'title' & 'message',
                                                       this is unsafe and hence, it is false by default */

            closable: true,                         /* Show close button to close Notus */

            autoClose: true,                        /* Automatically close Notus once autoCloseDuration completes */

            autoCloseDuration: 3000,                /* Milliseconds to wait before closing  */

            animate: true,                          /* Animate while showing/hiding Notus */

            animationType: 'slide',                 /* Animation Type while showing/hiding Notus; it can be 'slide' or 'fade' */

            animationDuration: 300,                 /* Animation Duration to apply while showing/hiding Notus,
                                                       it supports values in milliseconds.
                                                       which is then passed to CSS animation-duration */

            animationFunction: 'ease-out',          /* Animation Timing Function to use while showing/hiding Notus,
                                                       it supports any value that CSS animation-timing-function supports,
                                                       including cubic-bezier() & steps()
                                                       value is then passed to CSS animation-timing-function */

            themeClass: 'notus-material-light'      /* Provide custom CSS class that you want to apply on Parent element of Notus */
        };

        userConfig = _n.extend(defaultConfig, userConfig);

        /** Notus API begin **/

        /**
         * Resolve instance conflict in case module is loaded more than once.
         */
        thisNotus.noConflict = function() {
            self.notus = old_notus;
            return notus;
        };

        /**
         * Main Notus send() method to send supported type of notus Notifications.
         */
        thisNotus.send = function(config) {
            var containerEl,
                notusEl;

            config = _n.extend({}, userConfig, config);

            fnValidateConfig(config);

            containerEl = fnCreateNotusContainer(config);

            notusEl = fnCreateNotusEl(config);

            if (config.closable)
                fnBindCloseHandler(config, notusEl);

            if (config.notusType === 'snackbar' &&
                config.actionable)
                fnBindActionHandler(config, notusEl);

            if (config.notusPosition.indexOf('bottom') > -1)
                containerEl.insertBefore(notusEl, containerEl.firstChild);
            else
                containerEl.appendChild(notusEl);

            if (config.autoClose)
                fnBindCloseListener(config, notusEl);

            return notusEl.getAttribute('id');
        };
        /** Notus API end **/

        return thisNotus;
    };

    // UMD Definition < https://github.com/umdjs/umd >.
    if (typeof exports !== 'undefined')
    {
        if (typeof module !== 'undefined' &&
            module.exports)
        {
            exports = module.exports = notus;
        }
        exports.notus = notus;
    }
    else
    {
        self.notus = notus;
    }
}).call(this);
