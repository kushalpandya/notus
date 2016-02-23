Notus
======================

Yet another non-blocking, pop-up notification library for the web, strictly without jQuery (or any other dependencies).

###Why?
I wanted simple notification JS library at my day-job which can be used to show popup/toast notifications with variety of configurations, and does it with one strict requirement; **NO external dependencies**. I came across several great libraries which allow to show popup notifications but either they depend on jQuery, or they are not so minimal. Not that they are bad, but it is not wise to include a library to accomplish small task, in a huge project with a large codebase, that carries lot of additional weight with it.

###How Notus is different?
Notus is small, it doesn't rely on any external framework or library, its implementation is rather very simple to understand (and tweak). It relies on modern web standards from core logic to the animations.

See the [project page](https://doublslash.com/notus/) for demo.

###Usage
---
Download the tarball and extract it, include `notus.js` and `notus.css` in your page `<head>`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<title>Awesome Notifications</title>
	...
	...
	<link rel="stylesheet" href="src/notus.css" media="screen" title="Notus Stylesheet" charset="utf-8">
	<script type="text/javascript" src="src/notus.js"></script>
</head>
```

If you're in Node environment, you can install latest Notus release using using `npm`
```javascript
npm install notus --save
```


###Use
---

- **Initialize:**
Get instance of Notus using global `notus(config)` which returns reference to `notus` singleton. Configuration map passed during initialization is considered as default and will be used during creating notifications.

```html
<script type="text/javascript">
	var myNotus = notus();
</script>
```

- **Call:**
Notus provides a single method `send()` which optionally accepts `config` map to provide certain options. Note that this `config` will override any options that you passed during initialization of Notus.

```javascript
<script type="text/javascript">
	myNotus.send({
		notusType: 'popup',
		notusPosition: 'top-left',
		title: 'Notus Popup',
		message: 'Hello from Notus!!'
	});
</script>
```
 - **Options:**
Notus supports following options.

	 - `notusType`: Type of notification you want to show, it can be `popup` (default), `toast` or `snackbar` (inspired from Android's [Snackbar](http://www.getmdl.io/components/index.html#snackbar-section) notifications).
	 - `notusPosition`: Location on viewport where you want to show notification. Popup notification supports `top-left`, `top-right`, `bottom-left` & `bottom-right` positions, while Toast & Snackbar support only `top` & `bottom` positions.
	 - `alertType`: Alert type determines whether notification is relating to `success`, `failure`, `warning` or `none` (i.e. Neutral).
	 - `title`: Title of notification to be shown, not available for `snackbar`.
	 - `message`: Message text to be shown in notification.
	 - `closable`: Whether to show close button to close notification.
	 - `closeHandler`: Callback method for when close button is clicked, if this method returns `false` as a value (not a _flasy_ value but boolean `false`), notification will be prevented from closing.
	 - `actionable`: Snackbar supports action button to perform something when button is clicked (like having an "undo" button), by default, snackbar has `actionable` set to `true`.
	 - `actionText`: Text for action button on Snackbar.
	 - `actionHandler`: Callback method to call when action button is clicked by user, once method is executed, snackbar is closed automatically regardless of the return value of the function.
	 - `htmlString`:  By default, Notus prevents value of `title`, `message` and `actionText` to have  HTML markup for safety reasons. Set this to `true` to allow notification texts to support HTML markup.
	 - `autoClose`: Whether to close notification automatically after certain duration. Default is `true`.
	 - `autoCloseDuration`: Duration (in milliseconds) to wait before automatically closing the notification. Default is `3000`.
	 - `animate`: Whether to show/hide notification with animation. Default is `true`.
	 - `animationType`: Animation type to use while performing show/hide animation. Supported types are `slide` (default) and `fade`.
	 - `animationDuration`: Speed of animation in milliseconds. Default is `300`.
	 - `animationFunction`: Value to pass to CSS `animation-timing-function` property. Value can be any valid value that original CSS property supports (including `cubic-bezier()` & `steps()`). Default is `ease-out`. See [MDN article](https://developer.mozilla.org/en/docs/Web/CSS/animation-timing-function) on this CSS property.
	 - `themeClass`: CSS class to add to main notification element to apply custom styling. Default is `notus-material-light` which is built-in theme and is part of `notus.css` stylesheet. Note that providing value to this option will replace `notus-material-light` with your value instead of adding a new class.

### Known Issues
---

 For simplicity in implementation, Notus uses unprefixed versions of CSS properties for animations, so animations will not work on any browser which supports only vendor-prefixed version of CSS properties for `@keyframe` animations.

###Version Information
---
* 0.1.0 - First Release.

###Author
---
[Kushal Pandya](https://doublslash.com)
