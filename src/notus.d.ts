/**
 * notus v0.3.1
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 27 September, 2016
 *
 * Notus Type Definitions.
 */

declare namespace notus {

    /**
     * Notus Configuration Shape
     */
    interface NotusConfig {
        /*
         * Type can be anything from; 'popup', 'toast' or 'snackbar'
         */
        notusType?: string;

        /*
         * Available positions for different notus types;
         * 'popup'              =>  'top-left' ('tl'), 'bottom-left' ('bl'),
         *                          'top-right' ('tr') or 'bottom-right' ('br')
         *
         * 'toast' & 'snackbar' =>  'top' ('t') or 'bottom' ('b')
         */
        notusPosition?: string;

        /*
         * Alert type can be; 'none', 'success', 'failure' or 'warning'
         */
        alertType?: string;

        /*
         * Title of notification to be shown, not available for notusType 'snackbar'.
         */
        title?: string;

        /*
         * Message text to be shown in notification.
         */
        message: string;

        /*
         * Show close button to close Notus
         */
        closable?: boolean;

        /*
         * Callback method to call when close button is clicked.
         * By default, notification will be dismissed after callback is called and executed,
         * but you can prevent notification from dismissing by returning true (or a truthy value) from the callback.
         */
        closeHandler?: Function;

        /*
         * Notus supports actions on all notification types (starting v0.3.0 to perform something when an action is clicked).
         * Notus currently supports only two actions; primary & secondary.
         * Default value for actionable is false. In case this property is set to true,
         * you need to provide at least one of the available action types; primaryAction and/or secondaryAction.
         */
        actionable?: boolean;

        /*
         * Primary Action on Notus appears first in Notus bubble.
         */
        primaryAction?: Action;

        /*
         * Secondary Action on Notus appears after Primary action on Notus bubble.
         */
        secondaryAction?: Action;

        /*
         * Enable HTML support in strings provided for 'title', 'message' & 'text' within actions
         * this is unsafe and hence, it is false by default
         */
        htmlString?: boolean;

        /*
         * Automatically close Notus once autoCloseDuration completes
         */
        autoClose?: boolean;

        /*
         * Milliseconds to wait before closing
         */
        autoCloseDuration?: number;

        /*
         * Animate while showing/hiding Notus
         */
        animate?: boolean;

        /*
         * Animation Type while showing/hiding Notus; it can be 'slide', 'fade' or 'custom'
         * Using 'custom' exposes an additional config animationClass which can be used
         * to provide animations using animate.css < https://github.com/daneden/animate.css >
         */
        animationType?: string;

        /*
         * Animation Duration to apply while showing/hiding Notus,
         * it supports values in milliseconds.
         * which is then passed to CSS animation-duration
         */
        animationDuration?: number;

        /*
         * Animation Timing Function to use while showing/hiding Notus,
         * it supports any value that CSS animation-timing-function supports,
         * including cubic-bezier() & steps()
         * value is then passed to CSS animation-timing-function
         */
        animationFunction?: string;

        /*
         * This config is only applicable if animationType is 'custom'
         */
        animationClass?: AnimationClass;

        /*
         * Provide custom CSS class that you want to apply on Parent element of Notus
         */
        themeClass?: string;
    }

    /*
     * Custom Animation CSS Class for Notus
     *
     * provide custom 'extry' & 'exit' classes to control animations,
     * exit animation only occurs if Notus auto-closes itself
     * while providing 'fixed' (that stays applied always) class to control your overrides,
     * you can also use external library like animate.css
     */
    interface AnimationClass {
        fixed: string;
        entry: string;
        exit: string;
    }

    /**
     * Action Handler
     */
    interface Action {
        /*
         * Title of action, it supports markup in case 'htmlString' of NotusConfig is set to true.
         */
        text: string;

        /*
         * Callback function to invoke when action is clicked by user.
         * By default, notification will be dismissed after callback is called and executed,
         * but you can prevent notification from dismissing by returning true (or a truthy value) from the callback.
         */
        actionHandler: Function;
    }

    /**
     * Main Notus Interface
     */
    interface Notus {
        /*
         * Primary API method to show Notus notification.
         * @param notusConfig should be a valid NotusConfig Object
         */
        send(notusConfig: NotusConfig): any;

        /*
         * Gets reference to previously initialized global notus instance.
         */
        noConflict(): Notus;
    }

    /**
     * Reference to global notus object
     */
    interface NotusRef {
        notus(defaultConfig?: NotusConfig): Notus;
    }
}

declare function notus(): notus.Notus;
declare function notus(defaultConfig: notus.NotusConfig): notus.Notus;

export = notus;
