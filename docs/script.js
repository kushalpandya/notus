/**
 * notus v0.3.0
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 19 August, 2016
 *
 * Notus Interactive Demo Script.
 */

(function() {
    var btnNotify = document.getElementById('btnNotify'),
        sourceEl = document.getElementById('example-source'),
        cbAnimate = document.querySelector('input[type="checkbox"][name="animate"]'),
        cbActionable = document.querySelector('input[type="checkbox"][name="actionable"]'),
        rdNotusType = document.querySelectorAll('input[type="radio"][name="notusType"]'),
        rdNotusPosition = document.querySelectorAll('input[type="radio"][name="notusPosition"]'),
        rdAlertType = document.querySelectorAll('input[type="radio"][name="alertType"]'),
        rdAnimationType = document.querySelectorAll('input[type="radio"][name="animationType"]'),
        myNotus = notus(),
        notusType = "popup",
        notusPosition = "top-left",
        alertType = "none",
        animationType = "slide",
        count = 1,
        sourceConfig,
        fnExtend,
        fnRemoveDefaultConfig,
        fnGetSource,
        i;

    fnExtend = function() {
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
    };

    fnRemoveDefaultConfig = function(config) {
        var key,
            defaultConfig = {
            notusType: 'popup',
            notusPosition: 'top-right',
            alertType: 'none',
            htmlString: false,
            closable: true,
            autoClose: true,
            autoCloseDuration: 3000,
            actionable: false,
            animate: true,
            animationType: 'slide',
            animationDuration: 300,
            animationFunction: 'ease-out',
            animationClass: {
                fixed: '',
                entry: '',
                exit: ''
            },
            themeClass: 'notus-material-light'
        };

        for (key in defaultConfig)
        {
            if (defaultConfig.hasOwnProperty(key) &&
                defaultConfig[key] === config[key])
            {
                delete config[key];
                if (key === "actionable")
                {
                    delete config["primaryAction"];
                    delete config["secondaryAction"];
                }
            }
        }
    };

    fnGetSource = function(config) {
        var copyConfig = fnExtend({}, config),
            sourceConfig,
            primaryActionHandler = '',
            secondaryActionHandler = '',
            key;

        for (key in copyConfig)
        {
            if (copyConfig.hasOwnProperty(key) &&
                key === "actionable" &&
                copyConfig.actionable)
            {
                if (copyConfig.primaryAction)
                {
                    primaryActionHandler += String(copyConfig.primaryAction.actionHandler);
                    copyConfig.primaryAction.actionHandler = primaryActionHandler;
                }

                if (copyConfig.secondaryAction)
                {
                    secondaryActionHandler += String(copyConfig.secondaryAction.actionHandler);
                    copyConfig.secondaryAction.actionHandler = secondaryActionHandler;
                }
            }
        }

        sourceConfig = JSON.stringify(copyConfig, null, 4)      // Stringify with 4 space indentation
                           .replace(/"(\w+)"\s*:/g, '$1:')      // Remove quotes enclosing key names
                           .replace(/\"\\/g, '"')               // Replace escaped forward slash
                           //.replace(/\\\"/g, '"')               // Replace escaped quotes
                           .replace(/\"function/g, "function")  // Remove quotes preceding `function`
                           .replace(/}\"/g, "}")                // Remove quotes following `}`
                           .replace(/\\r\\n/g, "")              // Remove new-line characters `\r\n`
                           .replace(/</g, "&lt;")               // Escape tag brackets.
                           .replace(/>/g, "&gt;");

        return js_beautify(sourceConfig);
    };

    for (i = 0; i < rdNotusType.length; i++)
    {
        rdNotusType[i].onchange = function(e) {
            var supportPositions,
                j;

            if (this.checked)
                notusType = this.value;

            supportPositions = document.querySelectorAll('input[type="radio"][data-supported]');

            for (j = 0; j < supportPositions.length; j++)
            {
                if (notusType == 'popup')
                {
                    supportPositions[j].disabled = (supportPositions[j].dataset.supported === 'ts');
                    document.querySelectorAll('input[type="radio"][data-supported="p"]')[0].checked = true;
                    notusPosition = 'top-left';
                }
                else
                {
                    supportPositions[j].disabled = (supportPositions[j].dataset.supported === 'p');
                    document.querySelectorAll('input[type="radio"][data-supported="ts"]')[(notusType === 'snackbar') ? 1 : 0].checked = true;
                    notusPosition = (notusType === 'snackbar') ? 'bottom' : 'top';
                }
            }

            document.getElementById('notusTitle').disabled = (notusType === 'snackbar');
        };
    }

    for (i = 0; i < rdNotusPosition.length; i++)
    {
        rdNotusPosition[i].onchange = function(e) {
            if (this.checked)
                notusPosition = this.value;
        }
    }

    for (i = 0; i < rdAlertType.length; i++)
    {
        rdAlertType[i].onchange = function(e) {
            if (this.checked)
                alertType = this.value;
        }
    }

    for (i = 0; i < rdAnimationType.length; i++)
    {
        rdAnimationType[i].onchange = function(e) {
            if (this.checked)
                animationType = this.value;
        };
    }

    cbAnimate.onchange = function(e) {
        for (i = 0; i < rdAnimationType.length; i++)
        {
            rdAnimationType[i].checked = false;
            rdAnimationType[i].disabled = !this.checked;
        }

        if (this.checked)
        {
            rdAnimationType[0].checked = true;
            animationType = "slide";
        }
    };

    btnNotify.onclick = function(e) {
        var myNotusConfig;

        e.preventDefault();

        myNotusConfig = {
            title: document.getElementById('notusTitle').value,
            message: document.getElementById('notusMessage').value,
            closable: document.querySelector('input[type="checkbox"][name="closable"]').checked,
            autoClose: document.querySelector('input[type="checkbox"][name="autoClose"]').checked,
            autoCloseDuration: 5000,
            notusType: notusType,
            notusPosition: notusPosition,
            alertType: alertType,
            animate: document.querySelector('input[type="checkbox"][name="animate"]').checked,
            animationType: animationType,
            animationDuration: 300,
            htmlString: true
        };

        myNotusConfig['actionable'] = cbActionable.checked;
        myNotusConfig['primaryAction'] = {
            'text': "<span class='glyphicon glyphicon-share-alt'></span> Reply",
            'actionHandler': function(e) {
                alert('Primary action clicked!');
            }
        };

        myNotusConfig['secondaryAction'] = {
            'text': "<span class='glyphicon glyphicon-time'></span> Snooze",
            'actionHandler': function(e) {
                alert('Secondary action clicked!');
                return true;
            }
        };

        if (notusType === 'snackbar')
        {
            delete myNotusConfig.title;

            myNotusConfig['primaryAction'].text = 'CONFIRM';
            myNotusConfig['secondaryAction'].text = 'UNDO';
        }

        if (animationType === 'custom')
        {
            myNotusConfig['animationClass'] = {
                fixed: 'animated',
                entry: 'flipInX',
                exit: 'flipOutX'
            };
        }

        fnRemoveDefaultConfig(myNotusConfig);
        sourceEl.innerHTML = fnGetSource(myNotusConfig);

        myNotus.send(myNotusConfig);

        Prism.highlightElement(sourceEl);
    };
})();
