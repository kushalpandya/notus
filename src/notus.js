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

        createNotusEl: function(config) {
            var parentDiv = document.createElement('div'),
                notusElTpl;

            parentDiv.setAttribute('id', this.genId());
            parentDiv.setAttribute('class', 'notus notus-float');

            notusElTpl = [
                '<div class="notus-body-item notus-text">',
                    '{0}',
                '</div>',
                '<div class="notus-body-item notus-close">',
                    '<span class="icon-close">&times;</span>',
                '</div>'
            ].join('');

            parentDiv.innerHTML = this.format(notusElTpl, config.message);

            return parentDiv;
        }
    };

    notus = self.notus = function(defaultConfig) {
        var bodyEL = document.body,
            thisNotus = {};

        /** Notus API begin **/

        /**
         * Resolve instance conflict in case module is loaded more than once.
         */
        thisNotus.noConflict = function() {
            self.notus = old_notus;
            return notus;
        };


        thisNotus.send = function(config) {
            var notusEl;

            notusEl = _n.createNotusEl({
                message: config.message
            });

            bodyEL.appendChild(notusEl);

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
