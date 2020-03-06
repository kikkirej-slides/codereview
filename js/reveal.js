import Playback from './components/playback.js'

/**
 * reveal.js
 * http://revealjs.com
 * MIT licensed
 *
 * Copyright (C) 2020 Hakim El Hattab, http://hakim.se
 */
export default function() {

	'use strict';

	let Reveal;

	// The reveal.js version
	const VERSION = '4.0.0-dev';

	const SLIDES_SELECTOR = '.slides section';
	const HORIZONTAL_SLIDES_SELECTOR = '.slides>section';
	const VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section';
	const HOME_SLIDE_SELECTOR = '.slides>section:first-of-type';

	const UA = navigator.userAgent;

	// Methods that may not be invoked via the postMessage API
	const POST_MESSAGE_METHOD_BLACKLIST = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener/;

	// Configuration defaults, can be overridden at initialization time
	let config = {

			// The "normal" size of the presentation, aspect ratio will be preserved
			// when the presentation is scaled to fit different resolutions
			width: 960,
			height: 700,

			// Factor of the display size that should remain empty around the content
			margin: 0.04,

			// Bounds for smallest/largest possible scale to apply to content
			minScale: 0.2,
			maxScale: 2.0,

			// Display presentation control arrows
			controls: true,

			// Help the user learn the controls by providing hints, for example by
			// bouncing the down arrow when they first encounter a vertical slide
			controlsTutorial: true,

			// Determines where controls appear, "edges" or "bottom-right"
			controlsLayout: 'bottom-right',

			// Visibility rule for backwards navigation arrows; "faded", "hidden"
			// or "visible"
			controlsBackArrows: 'faded',

			// Display a presentation progress bar
			progress: true,

			// Display the page number of the current slide
			// - true:    Show slide number
			// - false:   Hide slide number
			//
			// Can optionally be set as a string that specifies the number formatting:
			// - "h.v":	  Horizontal . vertical slide number (default)
			// - "h/v":	  Horizontal / vertical slide number
			// - "c":	  Flattened slide number
			// - "c/t":	  Flattened slide number / total slides
			//
			// Alternatively, you can provide a function that returns the slide
			// number for the current slide. The function should take in a slide
			// object and return an array with one string [slideNumber] or
			// three strings [n1,delimiter,n2]. See #formatSlideNumber().
			slideNumber: false,

			// Can be used to limit the contexts in which the slide number appears
			// - "all":      Always show the slide number
			// - "print":    Only when printing to PDF
			// - "speaker":  Only in the speaker view
			showSlideNumber: 'all',

			// Use 1 based indexing for # links to match slide number (default is zero
			// based)
			hashOneBasedIndex: false,

			// Add the current slide number to the URL hash so that reloading the
			// page/copying the URL will return you to the same slide
			hash: false,

			// Push each slide change to the browser history.  Implies `hash: true`
			history: false,

			// Enable keyboard shortcuts for navigation
			keyboard: true,

			// Optional function that blocks keyboard events when retuning false
			keyboardCondition: null,

			// Enable the slide overview mode
			overview: true,

			// Disables the default reveal.js slide layout so that you can use
			// custom CSS layout
			disableLayout: false,

			// Vertical centering of slides
			center: true,

			// Enables touch navigation on devices with touch input
			touch: true,

			// Loop the presentation
			loop: false,

			// Change the presentation direction to be RTL
			rtl: false,

			// Changes the behavior of our navigation directions.
			//
			// "default"
			// Left/right arrow keys step between horizontal slides, up/down
			// arrow keys step between vertical slides. Space key steps through
			// all slides (both horizontal and vertical).
			//
			// "linear"
			// Removes the up/down arrows. Left/right arrows step through all
			// slides (both horizontal and vertical).
			//
			// "grid"
			// When this is enabled, stepping left/right from a vertical stack
			// to an adjacent vertical stack will land you at the same vertical
			// index.
			//
			// Consider a deck with six slides ordered in two vertical stacks:
			// 1.1    2.1
			// 1.2    2.2
			// 1.3    2.3
			//
			// If you're on slide 1.3 and navigate right, you will normally move
			// from 1.3 -> 2.1. If "grid" is used, the same navigation takes you
			// from 1.3 -> 2.3.
			navigationMode: 'default',

			// Randomizes the order of slides each time the presentation loads
			shuffle: false,

			// Turns fragments on and off globally
			fragments: true,

			// Flags whether to include the current fragment in the URL,
			// so that reloading brings you to the same fragment position
			fragmentInURL: false,

			// Flags if the presentation is running in an embedded mode,
			// i.e. contained within a limited portion of the screen
			embedded: false,

			// Flags if we should show a help overlay when the question-mark
			// key is pressed
			help: true,

			// Flags if it should be possible to pause the presentation (blackout)
			pause: true,

			// Flags if speaker notes should be visible to all viewers
			showNotes: false,

			// Global override for autolaying embedded media (video/audio/iframe)
			// - null:   Media will only autoplay if data-autoplay is present
			// - true:   All media will autoplay, regardless of individual setting
			// - false:  No media will autoplay, regardless of individual setting
			autoPlayMedia: null,

			// Global override for preloading lazy-loaded iframes
			// - null:   Iframes with data-src AND data-preload will be loaded when within
			//           the viewDistance, iframes with only data-src will be loaded when visible
			// - true:   All iframes with data-src will be loaded when within the viewDistance
			// - false:  All iframes with data-src will be loaded only when visible
			preloadIframes: null,

			// Can be used to globally disable auto-animation
			autoAnimate: true,

			// Optionally provide a custom element matcher that will be
			// used to dictate which elements we can animate between.
			autoAnimateMatcher: null,

			// Default settings for our auto-animate transitions, can be
			// overridden per-slide or per-element via data arguments
			autoAnimateEasing: 'ease',
			autoAnimateDuration: 1.0,
			autoAnimateUnmatched: true,

			// CSS properties that can be auto-animated. Position & scale
			// is matched separately so there's no need to include styles
			// like top/right/bottom/left, width/height or margin.
			autoAnimateStyles: [
				'opacity',
				'color',
				'background-color',
				'padding',
				'font-size',
				'line-height',
				'letter-spacing',
				'border-width',
				'border-color',
				'border-radius',
				'outline',
				'outline-offset'
			],

			// Controls automatic progression to the next slide
			// - 0:      Auto-sliding only happens if the data-autoslide HTML attribute
			//           is present on the current slide or fragment
			// - 1+:     All slides will progress automatically at the given interval
			// - false:  No auto-sliding, even if data-autoslide is present
			autoSlide: 0,

			// Stop auto-sliding after user input
			autoSlideStoppable: true,

			// Use this method for navigation when auto-sliding (defaults to navigateNext)
			autoSlideMethod: null,

			// Specify the average time in seconds that you think you will spend
			// presenting each slide. This is used to show a pacing timer in the
			// speaker view
			defaultTiming: null,

			// Enable slide navigation via mouse wheel
			mouseWheel: false,

			// Opens links in an iframe preview overlay
			// Add `data-preview-link` and `data-preview-link="false"` to customise each link
			// individually
			previewLinks: false,

			// Exposes the reveal.js API through window.postMessage
			postMessage: true,

			// Dispatches all reveal.js events to the parent window through postMessage
			postMessageEvents: false,

			// Focuses body when page changes visibility to ensure keyboard shortcuts work
			focusBodyOnPageVisibilityChange: true,

			// Transition style
			transition: 'slide', // none/fade/slide/convex/concave/zoom

			// Transition speed
			transitionSpeed: 'default', // default/fast/slow

			// Transition style for full page slide backgrounds
			backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

			// Parallax background image
			parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

			// Parallax background size
			parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

			// Parallax background repeat
			parallaxBackgroundRepeat: '', // repeat/repeat-x/repeat-y/no-repeat/initial/inherit

			// Parallax background position
			parallaxBackgroundPosition: '', // CSS syntax, e.g. "top left"

			// Amount of pixels to move the parallax background per slide step
			parallaxBackgroundHorizontal: null,
			parallaxBackgroundVertical: null,

			// The maximum number of pages a single slide can expand onto when printing
			// to PDF, unlimited by default
			pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,

			// Prints each fragment on a separate slide
			pdfSeparateFragments: true,

			// Offset used to reduce the height of content within exported PDF pages.
			// This exists to account for environment differences based on how you
			// print to PDF. CLI printing options, like phantomjs and wkpdf, can end
			// on precisely the total height of the document whereas in-browser
			// printing has to end one pixel before.
			pdfPageHeightOffset: -1,

			// Number of slides away from the current that are visible
			viewDistance: 3,

			// Number of slides away from the current that are visible on mobile
			// devices. It is advisable to set this to a lower number than
			// viewDistance in order to save resources.
			mobileViewDistance: 2,

			// The display mode that will be used to show slides
			display: 'block',

			// Hide cursor if inactive
			hideInactiveCursor: true,

			// Time before the cursor is hidden (in ms)
			hideCursorTime: 5000,

			// Script dependencies to load
			dependencies: []

		},

		// Flags if Reveal.initialize() has been called
		initialized = false,

		// Flags if reveal.js is loaded (has dispatched the 'ready' event)
		loaded = false,

		// Flags if the overview mode is currently active
		overview = false,

		// Holds the dimensions of our overview slides, including margins
		overviewSlideWidth = null,
		overviewSlideHeight = null,

		// The horizontal and vertical index of the currently active slide
		indexh,
		indexv,

		// The previous and current slide HTML elements
		previousSlide,
		currentSlide,

		previousBackground,

		// Remember which directions that the user has navigated towards
		hasNavigatedHorizontally = false,
		hasNavigatedVertically = false,

		// Slides may hold a data-state attribute which we pick up and apply
		// as a class to the body. This list contains the combined state of
		// all current slides.
		state = [],

		// The current scale of the presentation (see width/height config)
		scale = 1,

		// CSS transform that is currently applied to the slides container,
		// split into two groups
		slidesTransform = { layout: '', overview: '' },

		// Cached references to DOM elements
		dom = {},

		// A list of registered reveal.js plugins
		plugins = {},

		// List of asynchronously loaded reveal.js dependencies
		asyncDependencies = [],

		// Features supported by the browser, see #checkCapabilities()
		features = {},

		// Client is a mobile device, see #checkCapabilities()
		isMobileDevice,

		// Client is a desktop Chrome, see #checkCapabilities()
		isChrome,

		// Throttles mouse wheel navigation
		lastMouseWheelStep = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0,

		// Is the mouse pointer currently hidden from view
		cursorHidden = false,

		// Timeout used to determine when the cursor is inactive
		cursorInactiveTimeout = 0,

		// Flags if the interaction event listeners are bound
		eventsAreBound = false,

		// <style> element used to apply auto-animations
		autoAnimateStyleSheet,

		// Counter used to generate unique IDs for auto-animated elements
		autoAnimateCounter = 0,

		// The current auto-slide duration
		autoSlide = 0,

		// Auto slide properties
		autoSlidePlayer,
		autoSlideTimeout = 0,
		autoSlideStartTime = -1,
		autoSlidePaused = false,

		// Holds information about the currently ongoing touch input
		touch = {
			startX: 0,
			startY: 0,
			startCount: 0,
			captured: false,
			threshold: 40
		},

		// A key:value map of shortcut keyboard keys and descriptions of
		// the actions they trigger, generated in #configure()
		keyboardShortcuts = {},

		// Holds custom key code mappings
		registeredKeyBindings = {};

	/**
	 * Starts up the presentation if the client is capable.
	 */
	function initialize( options ) {

		// Make sure we only initialize once
		if( initialized === true ) return;

		initialized = true;

		checkCapabilities();

		// Cache references to key DOM elements
		dom.wrapper = document.querySelector( '.reveal' );
		dom.slides = document.querySelector( '.reveal .slides' );

		// Force a layout when the whole page, incl fonts, has loaded
		window.addEventListener( 'load', layout, false );

		let query = Reveal.getQueryHash();

		// Do not accept new dependencies via query config to avoid
		// the potential of malicious script injection
		if( typeof query['dependencies'] !== 'undefined' ) delete query['dependencies'];

		// Copy options over to our config object
		extend( config, options );
		extend( config, query );

		// Loads dependencies and continues to #start() once done
		load();

	}

	/**
	 * Inspect the client to see what it's capable of, this
	 * should only happens once per runtime.
	 */
	function checkCapabilities() {

		isMobileDevice = /(iphone|ipod|ipad|android)/gi.test( UA ) ||
							( navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 ); // iPadOS
		isChrome = /chrome/i.test( UA ) && !/edge/i.test( UA );

		let testElement = document.createElement( 'div' );

		// Flags if we should use zoom instead of transform to scale
		// up slides. Zoom produces crisper results but has a lot of
		// xbrowser quirks so we only use it in whitelsited browsers.
		features.zoom = 'zoom' in testElement.style && !isMobileDevice &&
						( isChrome || /Version\/[\d\.]+.*Safari/.test( UA ) );

	}

	/**
	 * Loads the dependencies of reveal.js. Dependencies are
	 * defined via the configuration option 'dependencies'
	 * and will be loaded prior to starting/binding reveal.js.
	 * Some dependencies may have an 'async' flag, if so they
	 * will load after reveal.js has been started up.
	 */
	function load() {

		var scripts = [],
			scriptsToLoad = 0;

		config.dependencies.forEach( s => {
			// Load if there's no condition or the condition is truthy
			if( !s.condition || s.condition() ) {
				if( s.async ) {
					asyncDependencies.push( s );
				}
				else {
					scripts.push( s );
				}
			}
		} );

		if( scripts.length ) {
			scriptsToLoad = scripts.length;

			// Load synchronous scripts
			scripts.forEach( s => {
				loadScript( s.src, function() {

					if( typeof s.callback === 'function' ) s.callback();

					if( --scriptsToLoad === 0 ) {
						initPlugins();
					}

				} );
			} );
		}
		else {
			initPlugins();
		}

	}

	/**
	 * Initializes our plugins and waits for them to be ready
	 * before proceeding.
	 */
	function initPlugins() {

		let pluginsToInitialize = Object.keys( plugins ).length;

		// If there are no plugins, skip this step
		if( pluginsToInitialize === 0 ) {
			loadAsyncDependencies();
		}
		// ... otherwise initialize plugins
		else {

			let afterPlugInitialized = () => {
				if( --pluginsToInitialize === 0 ) {
					loadAsyncDependencies();
				}
			};

			for( let i in plugins ) {

				let plugin = plugins[i];

				// If the plugin has an 'init' method, invoke it
				if( typeof plugin.init === 'function' ) {
					let callback = plugin.init();

					// If the plugin returned a Promise, wait for it
					if( callback && typeof callback.then === 'function' ) {
						callback.then( afterPlugInitialized );
					}
					else {
						afterPlugInitialized();
					}
				}
				else {
					afterPlugInitialized();
				}

			}

		}

	}

	/**
	 * Loads all async reveal.js dependencies.
	 */
	function loadAsyncDependencies() {

		if( asyncDependencies.length ) {
			asyncDependencies.forEach( s => {
				loadScript( s.src, s.callback );
			} );
		}

		start();

	}

	/**
	 * Loads a JavaScript file from the given URL and executes it.
	 *
	 * @param {string} url Address of the .js file to load
	 * @param {function} callback Method to invoke when the script
	 * has loaded and executed
	 */
	function loadScript( url, callback ) {

		const script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.async = false;
		script.defer = false;
		script.src = url;

		if( callback ) {

			// Success callback
			script.onload = script.onreadystatechange = event => {
				if( event.type === 'load' || /loaded|complete/.test( script.readyState ) ) {

					// Kill event listeners
					script.onload = script.onreadystatechange = script.onerror = null;

					callback();

				}
			};

			// Error callback
			script.onerror = err => {

				// Kill event listeners
				script.onload = script.onreadystatechange = script.onerror = null;

				callback( new Error( 'Failed loading script: ' + script.src + '\n' + err ) );

			};

		}

		// Append the script at the end of <head>
		const head = document.querySelector( 'head' );
		head.insertBefore( script, head.lastChild );

	}

	/**
	 * Starts up reveal.js by binding input events and navigating
	 * to the current URL deeplink if there is one.
	 */
	function start() {

		loaded = true;

		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Listen to messages posted to this window
		setupPostMessage();

		// Prevent the slides from being scrolled out of view
		setupScrollPrevention();

		// Resets all vertical slides so that only the first is visible
		resetVerticalSlides();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Update all backgrounds
		updateBackground( true );

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout( () => {
			// Enable transitions now that we're loaded
			dom.slides.classList.remove( 'no-transition' );

			dom.wrapper.classList.add( 'ready' );

			dispatchEvent( 'ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );
		}, 1 );

		// Special setup and config is required when printing to PDF
		if( isPrintingPDF() ) {
			removeEventListeners();

			// The document needs to have loaded for the PDF layout
			// measurements to be accurate
			if( document.readyState === 'complete' ) {
				setupPDF();
			}
			else {
				window.addEventListener( 'load', setupPDF );
			}
		}

	}

	/**
	 * Finds and stores references to DOM elements which are
	 * required by the presentation. If a required element is
	 * not found, it is created.
	 */
	function setupDOM() {

		// Prevent transitions while we're loading
		dom.slides.classList.add( 'no-transition' );

		if( isMobileDevice ) {
			dom.wrapper.classList.add( 'no-hover' );
		}
		else {
			dom.wrapper.classList.remove( 'no-hover' );
		}

		if( /iphone/gi.test( UA ) ) {
			dom.wrapper.classList.add( 'ua-iphone' );
		}
		else {
			dom.wrapper.classList.remove( 'ua-iphone' );
		}

		// Background element
		dom.background = createSingletonNode( dom.wrapper, 'div', 'backgrounds', null );

		// Progress bar
		dom.progress = createSingletonNode( dom.wrapper, 'div', 'progress', '<span></span>' );
		dom.progressbar = dom.progress.querySelector( 'span' );

		// Arrow controls
		dom.controls = createSingletonNode( dom.wrapper, 'aside', 'controls',
			`<button class="navigate-left" aria-label="${ config.rtl ? 'next slide' : 'previous slide' }"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="${ config.rtl ? 'previous slide' : 'next slide' }"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>` );

		// Slide number
		dom.slideNumber = createSingletonNode( dom.wrapper, 'div', 'slide-number', '' );

		// Element containing notes that are visible to the audience
		dom.speakerNotes = createSingletonNode( dom.wrapper, 'div', 'speaker-notes', null );
		dom.speakerNotes.setAttribute( 'data-prevent-swipe', '' );
		dom.speakerNotes.setAttribute( 'tabindex', '0' );

		// Overlay graphic which is displayed during the paused mode
		dom.pauseOverlay = createSingletonNode( dom.wrapper, 'div', 'pause-overlay', config.controls ? '<button class="resume-button">Resume presentation</button>' : null );

		dom.wrapper.setAttribute( 'role', 'application' );

		// There can be multiple instances of controls throughout the page
		dom.controlsLeft = toArray( document.querySelectorAll( '.navigate-left' ) );
		dom.controlsRight = toArray( document.querySelectorAll( '.navigate-right' ) );
		dom.controlsUp = toArray( document.querySelectorAll( '.navigate-up' ) );
		dom.controlsDown = toArray( document.querySelectorAll( '.navigate-down' ) );
		dom.controlsPrev = toArray( document.querySelectorAll( '.navigate-prev' ) );
		dom.controlsNext = toArray( document.querySelectorAll( '.navigate-next' ) );

		// The left, right and down arrows in the standard reveal.js controls
		dom.controlsRightArrow = dom.controls.querySelector( '.navigate-right' );
		dom.controlsLeftArrow = dom.controls.querySelector( '.navigate-left' );
		dom.controlsDownArrow = dom.controls.querySelector( '.navigate-down' );

		dom.statusDiv = createStatusDiv();
	}

	/**
	 * Creates a hidden div with role aria-live to announce the
	 * current slide content. Hide the div off-screen to make it
	 * available only to Assistive Technologies.
	 *
	 * @return {HTMLElement}
	 */
	function createStatusDiv() {

		let statusDiv = document.getElementById( 'aria-status-div' );
		if( !statusDiv ) {
			statusDiv = document.createElement( 'div' );
			statusDiv.style.position = 'absolute';
			statusDiv.style.height = '1px';
			statusDiv.style.width = '1px';
			statusDiv.style.overflow = 'hidden';
			statusDiv.style.clip = 'rect( 1px, 1px, 1px, 1px )';
			statusDiv.setAttribute( 'id', 'aria-status-div' );
			statusDiv.setAttribute( 'aria-live', 'polite' );
			statusDiv.setAttribute( 'aria-atomic','true' );
			dom.wrapper.appendChild( statusDiv );
		}
		return statusDiv;

	}

	/**
	 * Converts the given HTML element into a string of text
	 * that can be announced to a screen reader. Hidden
	 * elements are excluded.
	 */
	function getStatusText( node ) {

		let text = '';

		// Text node
		if( node.nodeType === 3 ) {
			text += node.textContent;
		}
		// Element node
		else if( node.nodeType === 1 ) {

			let isAriaHidden = node.getAttribute( 'aria-hidden' );
			let isDisplayHidden = window.getComputedStyle( node )['display'] === 'none';
			if( isAriaHidden !== 'true' && !isDisplayHidden ) {

				toArray( node.childNodes ).forEach( child => {
					text += getStatusText( child );
				} );

			}

		}

		return text.trim();

	}

	/**
	 * Configures the presentation for printing to a static
	 * PDF.
	 */
	function setupPDF() {

		var slideSize = getComputedSlideSize( window.innerWidth, window.innerHeight );

		// Dimensions of the PDF pages
		var pageWidth = Math.floor( slideSize.width * ( 1 + config.margin ) ),
			pageHeight = Math.floor( slideSize.height * ( 1 + config.margin ) );

		// Dimensions of slides within the pages
		var slideWidth = slideSize.width,
			slideHeight = slideSize.height;

		// Let the browser know what page size we want to print
		injectStyleSheet( '@page{size:'+ pageWidth +'px '+ pageHeight +'px; margin: 0px;}' );

		// Limit the size of certain elements to the dimensions of the slide
		injectStyleSheet( '.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: '+ slideWidth +'px; max-height:'+ slideHeight +'px}' );

		document.body.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Make sure stretch elements fit on slide
		layoutSlideContents( slideWidth, slideHeight );

		// Compute slide numbers now, before we start duplicating slides
		var doingSlideNumbers = config.slideNumber && /all|print/i.test( config.showSlideNumber );
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
			slide.setAttribute( 'data-slide-number', getSlideNumber( slide ) );
		} );

		// Slide and slide background layout
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Center the slide inside of the page, giving the slide some margin
				var left = ( pageWidth - slideWidth ) / 2,
					top = ( pageHeight - slideHeight ) / 2;

				var contentHeight = slide.scrollHeight;
				var numberOfPages = Math.max( Math.ceil( contentHeight / pageHeight ), 1 );

				// Adhere to configured pages per slide limit
				numberOfPages = Math.min( numberOfPages, config.pdfMaxPagesPerSlide );

				// Center slides vertically
				if( numberOfPages === 1 && config.center || slide.classList.contains( 'center' ) ) {
					top = Math.max( ( pageHeight - contentHeight ) / 2, 0 );
				}

				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				var page = document.createElement( 'div' );
				page.className = 'pdf-page';
				page.style.height = ( ( pageHeight + config.pdfPageHeightOffset ) * numberOfPages ) + 'px';
				slide.parentNode.insertBefore( page, slide );
				page.appendChild( slide );

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				if( slide.slideBackgroundElement ) {
					page.insertBefore( slide.slideBackgroundElement, slide );
				}

				// Inject notes if `showNotes` is enabled
				if( config.showNotes ) {

					// Are there notes for this slide?
					var notes = getSlideNotes( slide );
					if( notes ) {

						var notesSpacing = 8;
						var notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
						var notesElement = document.createElement( 'div' );
						notesElement.classList.add( 'speaker-notes' );
						notesElement.classList.add( 'speaker-notes-pdf' );
						notesElement.setAttribute( 'data-layout', notesLayout );
						notesElement.innerHTML = notes;

						if( notesLayout === 'separate-page' ) {
							page.parentNode.insertBefore( notesElement, page.nextSibling );
						}
						else {
							notesElement.style.left = notesSpacing + 'px';
							notesElement.style.bottom = notesSpacing + 'px';
							notesElement.style.width = ( pageWidth - notesSpacing*2 ) + 'px';
							page.appendChild( notesElement );
						}

					}

				}

				// Inject slide numbers if `slideNumbers` are enabled
				if( doingSlideNumbers ) {
					var numberElement = document.createElement( 'div' );
					numberElement.classList.add( 'slide-number' );
					numberElement.classList.add( 'slide-number-pdf' );
					numberElement.innerHTML = slide.getAttribute( 'data-slide-number' );
					page.appendChild( numberElement );
				}

				// Copy page and show fragments one after another
				if( config.pdfSeparateFragments ) {

					// Each fragment 'group' is an array containing one or more
					// fragments. Multiple fragments that appear at the same time
					// are part of the same group.
					var fragmentGroups = sortFragments( page.querySelectorAll( '.fragment' ), true );

					var previousFragmentStep;
					var previousPage;

					fragmentGroups.forEach( function( fragments ) {

						// Remove 'current-fragment' from the previous group
						if( previousFragmentStep ) {
							previousFragmentStep.forEach( function( fragment ) {
								fragment.classList.remove( 'current-fragment' );
							} );
						}

						// Show the fragments for the current index
						fragments.forEach( function( fragment ) {
							fragment.classList.add( 'visible', 'current-fragment' );
						} );

						// Create a separate page for the current fragment state
						var clonedPage = page.cloneNode( true );
						page.parentNode.insertBefore( clonedPage, ( previousPage || page ).nextSibling );

						previousFragmentStep = fragments;
						previousPage = clonedPage;

					} );

					// Reset the first/original page so that all fragments are hidden
					fragmentGroups.forEach( function( fragments ) {
						fragments.forEach( function( fragment ) {
							fragment.classList.remove( 'visible', 'current-fragment' );
						} );
					} );

				}
				// Show all fragments
				else {
					toArray( page.querySelectorAll( '.fragment:not(.fade-out)' ) ).forEach( function( fragment ) {
						fragment.classList.add( 'visible' );
					} );
				}

			}

		} );

		// Notify subscribers that the PDF layout is good to go
		dispatchEvent( 'pdf-ready' );

	}

	/**
	 * This is an unfortunate necessity. Some actions – such as
	 * an input field being focused in an iframe or using the
	 * keyboard to expand text selection beyond the bounds of
	 * a slide – can trigger our content to be pushed out of view.
	 * This scrolling can not be prevented by hiding overflow in
	 * CSS (we already do) so we have to resort to repeatedly
	 * checking if the slides have been offset :(
	 */
	function setupScrollPrevention() {

		setInterval( () => {
			if( dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0 ) {
				dom.wrapper.scrollTop = 0;
				dom.wrapper.scrollLeft = 0;
			}
		}, 1000 );

	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 * If the element already exists the existing instance will
	 * be returned.
	 *
	 * @param {HTMLElement} container
	 * @param {string} tagname
	 * @param {string} classname
	 * @param {string} innerHTML
	 *
	 * @return {HTMLElement}
	 */
	function createSingletonNode( container, tagname, classname, innerHTML='' ) {

		// Find all nodes matching the description
		let nodes = container.querySelectorAll( '.' + classname );

		// Check all matches to find one which is a direct child of
		// the specified container
		for( let i = 0; i < nodes.length; i++ ) {
			let testNode = nodes[i];
			if( testNode.parentNode === container ) {
				return testNode;
			}
		}

		// If no node was found, create it now
		let node = document.createElement( tagname );
		node.className = classname;
		node.innerHTML = innerHTML;
		container.appendChild( node );

		return node;

	}

	/**
	 * Creates the slide background elements and appends them
	 * to the background container. One element is created per
	 * slide no matter if the given slide has visible background.
	 */
	function createBackgrounds() {

		let printMode = isPrintingPDF();

		// Clear prior backgrounds
		dom.background.innerHTML = '';
		dom.background.classList.add( 'no-transition' );

		// Iterate over all horizontal slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( slideh => {

			let backgroundStack = createBackground( slideh, dom.background );

			// Iterate over all vertical slides
			toArray( slideh.querySelectorAll( 'section' ) ).forEach( slidev => {

				createBackground( slidev, backgroundStack );

				backgroundStack.classList.add( 'stack' );

			} );

		} );

		// Add parallax background if specified
		if( config.parallaxBackgroundImage ) {

			dom.background.style.backgroundImage = 'url("' + config.parallaxBackgroundImage + '")';
			dom.background.style.backgroundSize = config.parallaxBackgroundSize;
			dom.background.style.backgroundRepeat = config.parallaxBackgroundRepeat;
			dom.background.style.backgroundPosition = config.parallaxBackgroundPosition;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout( () => {
				dom.wrapper.classList.add( 'has-parallax-background' );
			}, 1 );

		}
		else {

			dom.background.style.backgroundImage = '';
			dom.wrapper.classList.remove( 'has-parallax-background' );

		}

	}

	/**
	 * Creates a background for the given slide.
	 *
	 * @param {HTMLElement} slide
	 * @param {HTMLElement} container The element that the background
	 * should be appended to
	 * @return {HTMLElement} New background div
	 */
	function createBackground( slide, container ) {

		// Main slide background element
		let element = document.createElement( 'div' );
		element.className = 'slide-background ' + slide.className.replace( /present|past|future/, '' );

		// Inner background element that wraps images/videos/iframes
		let contentElement = document.createElement( 'div' );
		contentElement.className = 'slide-background-content';

		element.appendChild( contentElement );
		container.appendChild( element );

		slide.slideBackgroundElement = element;
		slide.slideBackgroundContentElement = contentElement;

		// Syncs the background to reflect all current background settings
		syncBackground( slide );

		return element;

	}

	/**
	 * Renders all of the visual properties of a slide background
	 * based on the various background attributes.
	 *
	 * @param {HTMLElement} slide
	 */
	function syncBackground( slide ) {

		let element = slide.slideBackgroundElement,
			contentElement = slide.slideBackgroundContentElement;

		// Reset the prior background state in case this is not the
		// initial sync
		slide.classList.remove( 'has-dark-background' );
		slide.classList.remove( 'has-light-background' );

		element.removeAttribute( 'data-loaded' );
		element.removeAttribute( 'data-background-hash' );
		element.removeAttribute( 'data-background-size' );
		element.removeAttribute( 'data-background-transition' );
		element.style.backgroundColor = '';

		contentElement.style.backgroundSize = '';
		contentElement.style.backgroundRepeat = '';
		contentElement.style.backgroundPosition = '';
		contentElement.style.backgroundImage = '';
		contentElement.style.opacity = '';
		contentElement.innerHTML = '';

		let data = {
			background: slide.getAttribute( 'data-background' ),
			backgroundSize: slide.getAttribute( 'data-background-size' ),
			backgroundImage: slide.getAttribute( 'data-background-image' ),
			backgroundVideo: slide.getAttribute( 'data-background-video' ),
			backgroundIframe: slide.getAttribute( 'data-background-iframe' ),
			backgroundColor: slide.getAttribute( 'data-background-color' ),
			backgroundRepeat: slide.getAttribute( 'data-background-repeat' ),
			backgroundPosition: slide.getAttribute( 'data-background-position' ),
			backgroundTransition: slide.getAttribute( 'data-background-transition' ),
			backgroundOpacity: slide.getAttribute( 'data-background-opacity' )
		};

		if( data.background ) {
			// Auto-wrap image urls in url(...)
			if( /^(http|file|\/\/)/gi.test( data.background ) || /\.(svg|png|jpg|jpeg|gif|bmp)([?#\s]|$)/gi.test( data.background ) ) {
				slide.setAttribute( 'data-background-image', data.background );
			}
			else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if( data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe ) {
			element.setAttribute( 'data-background-hash', data.background +
															data.backgroundSize +
															data.backgroundImage +
															data.backgroundVideo +
															data.backgroundIframe +
															data.backgroundColor +
															data.backgroundRepeat +
															data.backgroundPosition +
															data.backgroundTransition +
															data.backgroundOpacity );
		}

		// Additional and optional background properties
		if( data.backgroundSize ) element.setAttribute( 'data-background-size', data.backgroundSize );
		if( data.backgroundColor ) element.style.backgroundColor = data.backgroundColor;
		if( data.backgroundTransition ) element.setAttribute( 'data-background-transition', data.backgroundTransition );

		if( slide.hasAttribute( 'data-preload' ) ) element.setAttribute( 'data-preload', '' );

		// Background image options are set on the content wrapper
		if( data.backgroundSize ) contentElement.style.backgroundSize = data.backgroundSize;
		if( data.backgroundRepeat ) contentElement.style.backgroundRepeat = data.backgroundRepeat;
		if( data.backgroundPosition ) contentElement.style.backgroundPosition = data.backgroundPosition;
		if( data.backgroundOpacity ) contentElement.style.opacity = data.backgroundOpacity;

		// If this slide has a background color, we add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be added
		let contrastColor = data.backgroundColor;

		// If no bg color was found, check the computed background
		if( !contrastColor ) {
			let computedBackgroundStyle = window.getComputedStyle( element );
			if( computedBackgroundStyle && computedBackgroundStyle.backgroundColor ) {
				contrastColor = computedBackgroundStyle.backgroundColor;
			}
		}

		if( contrastColor ) {
			let rgb = colorToRgb( contrastColor );

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if( rgb && rgb.a !== 0 ) {
				if( colorBrightness( contrastColor ) < 128 ) {
					slide.classList.add( 'has-dark-background' );
				}
				else {
					slide.classList.add( 'has-light-background' );
				}
			}
		}

	}

	/**
	 * Registers a listener to postMessage events, this makes it
	 * possible to call all reveal.js API methods from another
	 * window. For example:
	 *
	 * revealWindow.postMessage( JSON.stringify({
	 *   method: 'slide',
	 *   args: [ 2 ]
	 * }), '*' );
	 */
	function setupPostMessage() {

		if( config.postMessage ) {
			window.addEventListener( 'message', event => {
				const data = event.data;

				// Make sure we're dealing with JSON
				if( typeof data === 'string' && data.charAt( 0 ) === '{' && data.charAt( data.length - 1 ) === '}' ) {
					data = JSON.parse( data );

					// Check if the requested method can be found
					if( data.method && typeof Reveal[data.method] === 'function' ) {

						if( POST_MESSAGE_METHOD_BLACKLIST.test( data.method ) === false ) {

							var result = Reveal[data.method].apply( Reveal, data.args );

							// Dispatch a postMessage event with the returned value from
							// our method invocation for getter functions
							dispatchPostMessage( 'callback', { method: data.method, result: result } );

						}
						else {
							console.warn( 'reveal.js: "'+ data.method +'" is is blacklisted from the postMessage API' );
						}

					}
				}
			}, false );
		}

	}

	/**
	 * Applies the configuration settings from the config
	 * object. May be called multiple times.
	 *
	 * @param {object} options
	 */
	function configure( options ) {

		const oldTransition = config.transition;

		// New config options may be passed when this method
		// is invoked through the API after initialization
		if( typeof options === 'object' ) extend( config, options );

		// Abort if reveal.js hasn't finished loading, config
		// changes will be applied automatically once loading
		// finishes
		if( loaded === false ) return;

		const numberOfSlides = dom.wrapper.querySelectorAll( SLIDES_SELECTOR ).length;

		// Remove the previously configured transition class
		dom.wrapper.classList.remove( oldTransition );

		dom.wrapper.classList.add( config.transition );

		dom.wrapper.setAttribute( 'data-transition-speed', config.transitionSpeed );
		dom.wrapper.setAttribute( 'data-background-transition', config.backgroundTransition );

		dom.controls.style.display = config.controls ? 'block' : 'none';
		dom.progress.style.display = config.progress ? 'block' : 'none';

		dom.controls.setAttribute( 'data-controls-layout', config.controlsLayout );
		dom.controls.setAttribute( 'data-controls-back-arrows', config.controlsBackArrows );

		if( config.shuffle ) {
			shuffle();
		}

		if( config.rtl ) {
			dom.wrapper.classList.add( 'rtl' );
		}
		else {
			dom.wrapper.classList.remove( 'rtl' );
		}

		if( config.center ) {
			dom.wrapper.classList.add( 'center' );
		}
		else {
			dom.wrapper.classList.remove( 'center' );
		}

		// Exit the paused mode if it was configured off
		if( config.pause === false ) {
			resume();
		}

		if( config.showNotes ) {
			dom.speakerNotes.setAttribute( 'data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline' );
		}

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}
		else {
			document.removeEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.removeEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}

		// Auto-hide the mouse pointer when its inactive
		if( config.hideInactiveCursor ) {
			document.addEventListener( 'mousemove', onDocumentCursorActive, false );
			document.addEventListener( 'mousedown', onDocumentCursorActive, false );
		}
		else {
			showCursor();

			document.removeEventListener( 'mousemove', onDocumentCursorActive, false );
			document.removeEventListener( 'mousedown', onDocumentCursorActive, false );
		}

		// Iframe link previews
		if( config.previewLinks ) {
			enablePreviewLinks();
			disablePreviewLinks( '[data-preview-link=false]' );
		}
		else {
			disablePreviewLinks();
			enablePreviewLinks( '[data-preview-link]:not([data-preview-link=false])' );
		}

		// Reset all auto animated elements
		toArray( dom.slides.querySelectorAll( '[data-auto-animate]:not([data-auto-animate=""])' ) ).forEach( function( element ) {
			element.dataset.autoAnimate = '';
		} );

		removeEphemeralAutoAnimateAttributes();

		if( autoAnimateStyleSheet && autoAnimateStyleSheet.parentNode ) {
			autoAnimateStyleSheet.parentNode.removeChild( autoAnimateStyleSheet );
			autoAnimateStyleSheet = null;
		}

		// Remove existing auto-slide controls
		if( autoSlidePlayer ) {
			autoSlidePlayer.destroy();
			autoSlidePlayer = null;
		}

		// Generate auto-slide controls if needed
		if( numberOfSlides > 1 && config.autoSlide && config.autoSlideStoppable ) {
			autoSlidePlayer = new Playback( dom.wrapper, () => {
				return Math.min( Math.max( ( Date.now() - autoSlideStartTime ) / autoSlide, 0 ), 1 );
			} );

			autoSlidePlayer.on( 'click', onAutoSlidePlayerClick );
			autoSlidePaused = false;
		}

		// When fragments are turned off they should be visible
		if( config.fragments === false ) {
			toArray( dom.slides.querySelectorAll( '.fragment' ) ).forEach( element => {
				element.classList.add( 'visible' );
				element.classList.remove( 'current-fragment' );
			} );
		}

		// Slide numbers
		let slideNumberDisplay = 'none';
		if( config.slideNumber && !isPrintingPDF() ) {
			if( config.showSlideNumber === 'all' ) {
				slideNumberDisplay = 'block';
			}
			else if( config.showSlideNumber === 'speaker' && isSpeakerNotes() ) {
				slideNumberDisplay = 'block';
			}
		}

		dom.slideNumber.style.display = slideNumberDisplay;

		// Add the navigation mode to the DOM so we can adjust styling
		if( config.navigationMode !== 'default' ) {
			dom.wrapper.setAttribute( 'data-navigation-mode', config.navigationMode );
		}
		else {
			dom.wrapper.removeAttribute( 'data-navigation-mode' );
		}

		// Define our contextual list of keyboard shortcuts
		if( config.navigationMode === 'linear' ) {
			keyboardShortcuts['&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J'] = 'Next slide';
			keyboardShortcuts['&#8592;  ,  &#8593;  ,  P  ,  H  ,  K']           = 'Previous slide';
		}
		else {
			keyboardShortcuts['N  ,  SPACE']   = 'Next slide';
			keyboardShortcuts['P']             = 'Previous slide';
			keyboardShortcuts['&#8592;  ,  H'] = 'Navigate left';
			keyboardShortcuts['&#8594;  ,  L'] = 'Navigate right';
			keyboardShortcuts['&#8593;  ,  K'] = 'Navigate up';
			keyboardShortcuts['&#8595;  ,  J'] = 'Navigate down';
		}

		keyboardShortcuts['Home  ,  Shift &#8592;']        = 'First slide';
		keyboardShortcuts['End  ,  Shift &#8594;']         = 'Last slide';
		keyboardShortcuts['B  ,  .']                       = 'Pause';
		keyboardShortcuts['F']                             = 'Fullscreen';
		keyboardShortcuts['ESC, O']                        = 'Slide overview';

		sync();

	}

	/**
	 * Binds all event listeners.
	 */
	function addEventListeners() {

		eventsAreBound = true;

		window.addEventListener( 'hashchange', onWindowHashChange, false );
		window.addEventListener( 'resize', onWindowResize, false );

		if( config.touch ) {
			if( 'onpointerdown' in window ) {
				// Use W3C pointer events
				dom.wrapper.addEventListener( 'pointerdown', onPointerDown, false );
				dom.wrapper.addEventListener( 'pointermove', onPointerMove, false );
				dom.wrapper.addEventListener( 'pointerup', onPointerUp, false );
			}
			else if( window.navigator.msPointerEnabled ) {
				// IE 10 uses prefixed version of pointer events
				dom.wrapper.addEventListener( 'MSPointerDown', onPointerDown, false );
				dom.wrapper.addEventListener( 'MSPointerMove', onPointerMove, false );
				dom.wrapper.addEventListener( 'MSPointerUp', onPointerUp, false );
			}
			else {
				// Fall back to touch events
				dom.wrapper.addEventListener( 'touchstart', onTouchStart, false );
				dom.wrapper.addEventListener( 'touchmove', onTouchMove, false );
				dom.wrapper.addEventListener( 'touchend', onTouchEnd, false );
			}
		}

		if( config.keyboard ) {
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
			document.addEventListener( 'keypress', onDocumentKeyPress, false );
		}

		if( config.progress && dom.progress ) {
			dom.progress.addEventListener( 'click', onProgressClicked, false );
		}

		dom.pauseOverlay.addEventListener( 'click', resume, false );

		if( config.focusBodyOnPageVisibilityChange ) {
			document.addEventListener( 'visibilitychange', onPageVisibilityChange, false );
		}

		// Listen to both touch and click events, in case the device
		// supports both
		let pointerEvents = [ 'touchstart', 'click' ];

		// Only support touch for Android, fixes double navigations in
		// stock browser
		if( UA.match( /android/gi ) ) {
			pointerEvents = [ 'touchstart' ];
		}

		pointerEvents.forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.addEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.addEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.addEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.addEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.addEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.addEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Unbinds all event listeners.
	 */
	function removeEventListeners() {

		eventsAreBound = false;

		document.removeEventListener( 'keydown', onDocumentKeyDown, false );
		document.removeEventListener( 'keypress', onDocumentKeyPress, false );
		window.removeEventListener( 'hashchange', onWindowHashChange, false );
		window.removeEventListener( 'resize', onWindowResize, false );

		dom.wrapper.removeEventListener( 'pointerdown', onPointerDown, false );
		dom.wrapper.removeEventListener( 'pointermove', onPointerMove, false );
		dom.wrapper.removeEventListener( 'pointerup', onPointerUp, false );

		dom.wrapper.removeEventListener( 'MSPointerDown', onPointerDown, false );
		dom.wrapper.removeEventListener( 'MSPointerMove', onPointerMove, false );
		dom.wrapper.removeEventListener( 'MSPointerUp', onPointerUp, false );

		dom.wrapper.removeEventListener( 'touchstart', onTouchStart, false );
		dom.wrapper.removeEventListener( 'touchmove', onTouchMove, false );
		dom.wrapper.removeEventListener( 'touchend', onTouchEnd, false );

		dom.pauseOverlay.removeEventListener( 'click', resume, false );

		if ( config.progress && dom.progress ) {
			dom.progress.removeEventListener( 'click', onProgressClicked, false );
		}

		[ 'touchstart', 'click' ].forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.removeEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.removeEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.removeEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.removeEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.removeEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.removeEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Registers a new plugin with this reveal.js instance.
	 *
	 * reveal.js waits for all regisered plugins to initialize
	 * before considering itself ready, as long as the plugin
	 * is registered before calling `Reveal.initialize()`.
	 */
	function registerPlugin( id, plugin ) {

		if( plugins[id] === undefined ) {
			plugins[id] = plugin;

			// If a plugin is registered after reveal.js is loaded,
			// initialize it right away
			if( loaded && typeof plugin.init === 'function' ) {
				plugin.init();
			}
		}
		else {
			console.warn( 'reveal.js: "'+ id +'" plugin has already been registered' );
		}

	}

	/**
	 * Checks if a specific plugin has been registered.
	 *
	 * @param {String} id Unique plugin identifier
	 */
	function hasPlugin( id ) {

		return !!plugins[id];

	}

	/**
	 * Returns the specific plugin instance, if a plugin
	 * with the given ID has been registered.
	 *
	 * @param {String} id Unique plugin identifier
	 */
	function getPlugin( id ) {

		return plugins[id];

	}

	/**
	 * Add a custom key binding with optional description to
	 * be added to the help screen.
	 */
	function addKeyBinding( binding, callback ) {

		if( typeof binding === 'object' && binding.keyCode ) {
			registeredKeyBindings[binding.keyCode] = {
				callback: callback,
				key: binding.key,
				description: binding.description
			};
		}
		else {
			registeredKeyBindings[binding] = {
				callback: callback,
				key: null,
				description: null
			};
		}

	}

	/**
	 * Removes the specified custom key binding.
	 */
	function removeKeyBinding( keyCode ) {

		delete registeredKeyBindings[keyCode];

	}

	/**
	 * Extend object a with the properties of object b.
	 * If there's a conflict, object b takes precedence.
	 *
	 * @param {object} a
	 * @param {object} b
	 */
	function extend( a, b ) {

		for( var i in b ) {
			a[ i ] = b[ i ];
		}

		return a;

	}

	/**
	 * Converts the target object to an array.
	 *
	 * @param {object} o
	 * @return {object[]}
	 */
	function toArray( o ) {

		return Array.prototype.slice.call( o );

	}

	/**
	 * Utility for deserializing a value.
	 *
	 * @param {*} value
	 * @return {*}
	 */
	function deserialize( value ) {

		if( typeof value === 'string' ) {
			if( value === 'null' ) return null;
			else if( value === 'true' ) return true;
			else if( value === 'false' ) return false;
			else if( value.match( /^-?[\d\.]+$/ ) ) return parseFloat( value );
		}

		return value;

	}

	/**
	 * Measures the distance in pixels between point a
	 * and point b.
	 *
	 * @param {object} a point with x/y properties
	 * @param {object} b point with x/y properties
	 *
	 * @return {number}
	 */
	function distanceBetween( a, b ) {

		var dx = a.x - b.x,
			dy = a.y - b.y;

		return Math.sqrt( dx*dx + dy*dy );

	}

	/**
	 * Applies a CSS transform to the target element.
	 *
	 * @param {HTMLElement} element
	 * @param {string} transform
	 */
	function transformElement( element, transform ) {

		element.style.transform = transform;

	}

	/**
	 * Applies CSS transforms to the slides container. The container
	 * is transformed from two separate sources: layout and the overview
	 * mode.
	 *
	 * @param {object} transforms
	 */
	function transformSlides( transforms ) {

		// Pick up new transforms from arguments
		if( typeof transforms.layout === 'string' ) slidesTransform.layout = transforms.layout;
		if( typeof transforms.overview === 'string' ) slidesTransform.overview = transforms.overview;

		// Apply the transforms to the slides container
		if( slidesTransform.layout ) {
			transformElement( dom.slides, slidesTransform.layout + ' ' + slidesTransform.overview );
		}
		else {
			transformElement( dom.slides, slidesTransform.overview );
		}

	}

	/**
	 * Injects the given CSS styles into the DOM.
	 *
	 * @param {string} value
	 */
	function injectStyleSheet( value ) {

		let tag = document.createElement( 'style' );
		tag.type = 'text/css';
		if( tag.styleSheet ) {
			tag.styleSheet.cssText = value;
		}
		else {
			tag.appendChild( document.createTextNode( value ) );
		}
		document.getElementsByTagName( 'head' )[0].appendChild( tag );

	}

	/**
	 * Find the closest parent that matches the given
	 * selector.
	 *
	 * @param {HTMLElement} target The child element
	 * @param {String} selector The CSS selector to match
	 * the parents against
	 *
	 * @return {HTMLElement} The matched parent or null
	 * if no matching parent was found
	 */
	function closestParent( target, selector ) {

		let parent = target.parentNode;

		while( parent ) {

			// There's some overhead doing this each time, we don't
			// want to rewrite the element prototype but should still
			// be enough to feature detect once at startup...
			let matchesMethod = parent.matches || parent.matchesSelector || parent.msMatchesSelector;

			// If we find a match, we're all set
			if( matchesMethod && matchesMethod.call( parent, selector ) ) {
				return parent;
			}

			// Keep searching
			parent = parent.parentNode;

		}

		return null;

	}

	/**
	 * Converts various color input formats to an {r:0,g:0,b:0} object.
	 *
	 * @param {string} color The string representation of a color
	 * @example
	 * colorToRgb('#000');
	 * @example
	 * colorToRgb('#000000');
	 * @example
	 * colorToRgb('rgb(0,0,0)');
	 * @example
	 * colorToRgb('rgba(0,0,0)');
	 *
	 * @return {{r: number, g: number, b: number, [a]: number}|null}
	 */
	function colorToRgb( color ) {

		let hex3 = color.match( /^#([0-9a-f]{3})$/i );
		if( hex3 && hex3[1] ) {
			hex3 = hex3[1];
			return {
				r: parseInt( hex3.charAt( 0 ), 16 ) * 0x11,
				g: parseInt( hex3.charAt( 1 ), 16 ) * 0x11,
				b: parseInt( hex3.charAt( 2 ), 16 ) * 0x11
			};
		}

		let hex6 = color.match( /^#([0-9a-f]{6})$/i );
		if( hex6 && hex6[1] ) {
			hex6 = hex6[1];
			return {
				r: parseInt( hex6.substr( 0, 2 ), 16 ),
				g: parseInt( hex6.substr( 2, 2 ), 16 ),
				b: parseInt( hex6.substr( 4, 2 ), 16 )
			};
		}

		let rgb = color.match( /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i );
		if( rgb ) {
			return {
				r: parseInt( rgb[1], 10 ),
				g: parseInt( rgb[2], 10 ),
				b: parseInt( rgb[3], 10 )
			};
		}

		let rgba = color.match( /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i );
		if( rgba ) {
			return {
				r: parseInt( rgba[1], 10 ),
				g: parseInt( rgba[2], 10 ),
				b: parseInt( rgba[3], 10 ),
				a: parseFloat( rgba[4] )
			};
		}

		return null;

	}

	/**
	 * Calculates brightness on a scale of 0-255.
	 *
	 * @param {string} color See colorToRgb for supported formats.
	 * @see {@link colorToRgb}
	 */
	function colorBrightness( color ) {

		if( typeof color === 'string' ) color = colorToRgb( color );

		if( color ) {
			return ( color.r * 299 + color.g * 587 + color.b * 114 ) / 1000;
		}

		return null;

	}

	/**
	 * Returns the remaining height within the parent of the
	 * target element.
	 *
	 * remaining height = [ configured parent height ] - [ current parent height ]
	 *
	 * @param {HTMLElement} element
	 * @param {number} [height]
	 */
	function getRemainingHeight( element, height = 0 ) {

		if( element ) {
			let newHeight, oldHeight = element.style.height;

			// Change the .stretch element height to 0 in order find the height of all
			// the other elements
			element.style.height = '0px';

			// In Overview mode, the parent (.slide) height is set of 700px.
			// Restore it temporarily to its natural height.
			element.parentNode.style.height = 'auto';

			newHeight = height - element.parentNode.offsetHeight;

			// Restore the old height, just in case
			element.style.height = oldHeight + 'px';

			// Clear the parent (.slide) height. .removeProperty works in IE9+
			element.parentNode.style.removeProperty('height');

			return newHeight;
		}

		return height;

	}

	/**
	 * Checks if this instance is being used to print a PDF.
	 */
	function isPrintingPDF() {

		return ( /print-pdf/gi ).test( window.location.search );

	}

	/**
	 * Dispatches an event of the specified type from the
	 * reveal DOM element.
	 */
	function dispatchEvent( type, args ) {

		let event = document.createEvent( 'HTMLEvents', 1, 2 );
		event.initEvent( type, true, true );
		extend( event, args );
		dom.wrapper.dispatchEvent( event );

		// If we're in an iframe, post each reveal.js event to the
		// parent window. Used by the notes plugin
		dispatchPostMessage( type );

	}

	/**
	 * Dispatched a postMessage of the given type from our window.
	 */
	function dispatchPostMessage( type, data ) {

		if( config.postMessageEvents && window.parent !== window.self ) {
			let message = {
				namespace: 'reveal',
				eventName: type,
				state: getState()
			};

			extend( message, data );

			window.parent.postMessage( JSON.stringify( message ), '*' );
		}

	}

	/**
	 * Bind preview frame links.
	 *
	 * @param {string} [selector=a] - selector for anchors
	 */
	function enablePreviewLinks( selector = 'a' ) {

		toArray( document.querySelectorAll( selector ) ).forEach( element => {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.addEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Unbind preview frame links.
	 */
	function disablePreviewLinks( selector = 'a' ) {

		toArray( document.querySelectorAll( selector ) ).forEach( element => {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.removeEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Opens a preview window for the target URL.
	 *
	 * @param {string} url - url for preview iframe src
	 */
	function showPreview( url ) {

		closeOverlay();

		dom.overlay = document.createElement( 'div' );
		dom.overlay.classList.add( 'overlay' );
		dom.overlay.classList.add( 'overlay-preview' );
		dom.wrapper.appendChild( dom.overlay );

		dom.overlay.innerHTML =
			`<header>
				<a class="close" href="#"><span class="icon"></span></a>
				<a class="external" href="${url}" target="_blank"><span class="icon"></span></a>
			</header>
			<div class="spinner"></div>
			<div class="viewport">
				<iframe src="${url}"></iframe>
				<small class="viewport-inner">
					<span class="x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`;

		dom.overlay.querySelector( 'iframe' ).addEventListener( 'load', event => {
			dom.overlay.classList.add( 'loaded' );
		}, false );

		dom.overlay.querySelector( '.close' ).addEventListener( 'click', event => {
			closeOverlay();
			event.preventDefault();
		}, false );

		dom.overlay.querySelector( '.external' ).addEventListener( 'click', event => {
			closeOverlay();
		}, false );

	}

	/**
	 * Open or close help overlay window.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * help is open, false means it's closed.
	 */
	function toggleHelp( override ){

		if( typeof override === 'boolean' ) {
			override ? showHelp() : closeOverlay();
		}
		else {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				showHelp();
			}
		}
	}

	/**
	 * Opens an overlay window with help material.
	 */
	function showHelp() {

		if( config.help ) {

			closeOverlay();

			dom.overlay = document.createElement( 'div' );
			dom.overlay.classList.add( 'overlay' );
			dom.overlay.classList.add( 'overlay-help' );
			dom.wrapper.appendChild( dom.overlay );

			let html = '<p class="title">Keyboard Shortcuts</p><br/>';

			html += '<table><th>KEY</th><th>ACTION</th>';
			for( var key in keyboardShortcuts ) {
				html += `<tr><td>${key}</td><td>${keyboardShortcuts[ key ]}</td></tr>`;
			}

			// Add custom key bindings that have associated descriptions
			for( var binding in registeredKeyBindings ) {
				if( registeredKeyBindings[binding].key && registeredKeyBindings[binding].description ) {
					html += `<tr><td>${registeredKeyBindings[binding].key}</td><td>${registeredKeyBindings[binding].description}</td></tr>`;
				}
			}

			html += '</table>';

			dom.overlay.innerHTML = `
				<header>
					<a class="close" href="#"><span class="icon"></span></a>
				</header>
				<div class="viewport">
					<div class="viewport-inner">${html}</div>
				</div>
			`;

			dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
				closeOverlay();
				event.preventDefault();
			}, false );

		}

	}

	/**
	 * Closes any currently open overlay.
	 */
	function closeOverlay() {

		if( dom.overlay ) {
			dom.overlay.parentNode.removeChild( dom.overlay );
			dom.overlay = null;
		}

	}

	/**
	 * Applies JavaScript-controlled layout rules to the
	 * presentation.
	 */
	function layout() {

		if( dom.wrapper && !isPrintingPDF() ) {

			if( !config.disableLayout ) {

				// On some mobile devices '100vh' is taller than the visible
				// viewport which leads to part of the presentation being
				// cut off. To work around this we define our own '--vh' custom
				// property where 100x adds up to the correct height.
				//
				// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
				if( isMobileDevice ) {
					document.documentElement.style.setProperty( '--vh', ( window.innerHeight * 0.01 ) + 'px' );
				}

				const size = getComputedSlideSize();

				const oldScale = scale;

				// Layout the contents of the slides
				layoutSlideContents( config.width, config.height );

				dom.slides.style.width = size.width + 'px';
				dom.slides.style.height = size.height + 'px';

				// Determine scale of content to fit within available space
				scale = Math.min( size.presentationWidth / size.width, size.presentationHeight / size.height );

				// Respect max/min scale settings
				scale = Math.max( scale, config.minScale );
				scale = Math.min( scale, config.maxScale );

				// Don't apply any scaling styles if scale is 1
				if( scale === 1 ) {
					dom.slides.style.zoom = '';
					dom.slides.style.left = '';
					dom.slides.style.top = '';
					dom.slides.style.bottom = '';
					dom.slides.style.right = '';
					transformSlides( { layout: '' } );
				}
				else {
					// Zoom Scaling
					// Content remains crisp no matter how much we scale. Side
					// effects are minor differences in text layout and iframe
					// viewports changing size. A 200x200 iframe viewport in a
					// 2x zoomed presentation ends up having a 400x400 viewport.
					if( scale > 1 && features.zoom && window.devicePixelRatio < 2 ) {
						dom.slides.style.zoom = scale;
						dom.slides.style.left = '';
						dom.slides.style.top = '';
						dom.slides.style.bottom = '';
						dom.slides.style.right = '';
						transformSlides( { layout: '' } );
					}
					// Transform Scaling
					// Content layout remains the exact same when scaled up.
					// Side effect is content becoming blurred, especially with
					// high scale values on ldpi screens.
					else {
						dom.slides.style.zoom = '';
						dom.slides.style.left = '50%';
						dom.slides.style.top = '50%';
						dom.slides.style.bottom = 'auto';
						dom.slides.style.right = 'auto';
						transformSlides( { layout: 'translate(-50%, -50%) scale('+ scale +')' } );
					}
				}

				// Select all slides, vertical and horizontal
				const slides = toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) );

				for( var i = 0, len = slides.length; i < len; i++ ) {
					const slide = slides[ i ];

					// Don't bother updating invisible slides
					if( slide.style.display === 'none' ) {
						continue;
					}

					if( config.center || slide.classList.contains( 'center' ) ) {
						// Vertical stacks are not centred since their section
						// children will be
						if( slide.classList.contains( 'stack' ) ) {
							slide.style.top = 0;
						}
						else {
							slide.style.top = Math.max( ( size.height - slide.scrollHeight ) / 2, 0 ) + 'px';
						}
					}
					else {
						slide.style.top = '';
					}

				}

				if( oldScale !== scale ) {
					dispatchEvent( 'resize', {
						'oldScale': oldScale,
						'scale': scale,
						'size': size
					} );
				}
			}

			updateProgress();
			updateParallax();

			if( isOverview() ) {
				updateOverview();
			}

		}

	}

	/**
	 * Applies layout logic to the contents of all slides in
	 * the presentation.
	 *
	 * @param {string|number} width
	 * @param {string|number} height
	 */
	function layoutSlideContents( width, height ) {

		// Handle sizing of elements with the 'stretch' class
		toArray( dom.slides.querySelectorAll( 'section > .stretch' ) ).forEach( element => {

			// Determine how much vertical space we can use
			var remainingHeight = getRemainingHeight( element, height );

			// Consider the aspect ratio of media elements
			if( /(img|video)/gi.test( element.nodeName ) ) {
				const nw = element.naturalWidth || element.videoWidth,
					  nh = element.naturalHeight || element.videoHeight;

				const es = Math.min( width / nw, remainingHeight / nh );

				element.style.width = ( nw * es ) + 'px';
				element.style.height = ( nh * es ) + 'px';

			}
			else {
				element.style.width = width + 'px';
				element.style.height = remainingHeight + 'px';
			}

		} );

	}

	/**
	 * Calculates the computed pixel size of our slides. These
	 * values are based on the width and height configuration
	 * options.
	 *
	 * @param {number} [presentationWidth=dom.wrapper.offsetWidth]
	 * @param {number} [presentationHeight=dom.wrapper.offsetHeight]
	 */
	function getComputedSlideSize( presentationWidth, presentationHeight ) {

		const size = {
			// Slide size
			width: config.width,
			height: config.height,

			// Presentation size
			presentationWidth: presentationWidth || dom.wrapper.offsetWidth,
			presentationHeight: presentationHeight || dom.wrapper.offsetHeight
		};

		// Reduce available space by margin
		size.presentationWidth -= ( size.presentationWidth * config.margin );
		size.presentationHeight -= ( size.presentationHeight * config.margin );

		// Slide width may be a percentage of available width
		if( typeof size.width === 'string' && /%$/.test( size.width ) ) {
			size.width = parseInt( size.width, 10 ) / 100 * size.presentationWidth;
		}

		// Slide height may be a percentage of available height
		if( typeof size.height === 'string' && /%$/.test( size.height ) ) {
			size.height = parseInt( size.height, 10 ) / 100 * size.presentationHeight;
		}

		return size;

	}

	/**
	 * Stores the vertical index of a stack so that the same
	 * vertical slide can be selected when navigating to and
	 * from the stack.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 * @param {string|number} [v=0] Index to memorize
	 */
	function setPreviousVerticalIndex( stack, v ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' ) {
			stack.setAttribute( 'data-previous-indexv', v || 0 );
		}

	}

	/**
	 * Retrieves the vertical index which was stored using
	 * #setPreviousVerticalIndex() or 0 if no previous index
	 * exists.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 */
	function getPreviousVerticalIndex( stack ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains( 'stack' ) ) {
			// Prefer manually defined start-indexv
			const attributeName = stack.hasAttribute( 'data-start-indexv' ) ? 'data-start-indexv' : 'data-previous-indexv';

			return parseInt( stack.getAttribute( attributeName ) || 0, 10 );
		}

		return 0;

	}

	/**
	 * Displays the overview of slides (quick nav) by scaling
	 * down and arranging all slide elements.
	 */
	function activateOverview() {

		// Only proceed if enabled in config
		if( config.overview && !isOverview() ) {

			overview = true;

			dom.wrapper.classList.add( 'overview' );

			// Don't auto-slide while in overview mode
			cancelAutoSlide();

			// Move the backgrounds element into the slide container to
			// that the same scaling is applied
			dom.slides.appendChild( dom.background );

			// Clicking on an overview slide navigates to it
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( slide => {
				if( !slide.classList.contains( 'stack' ) ) {
					slide.addEventListener( 'click', onOverviewSlideClicked, true );
				}
			} );

			// Calculate slide sizes
			const margin = 70;
			const slideSize = getComputedSlideSize();
			overviewSlideWidth = slideSize.width + margin;
			overviewSlideHeight = slideSize.height + margin;

			// Reverse in RTL mode
			if( config.rtl ) {
				overviewSlideWidth = -overviewSlideWidth;
			}

			updateSlidesVisibility();
			layoutOverview();
			updateOverview();

			layout();

			// Notify observers of the overview showing
			dispatchEvent( 'overviewshown', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}

	}

	/**
	 * Uses CSS transforms to position all slides in a grid for
	 * display inside of the overview mode.
	 */
	function layoutOverview() {

		// Layout slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( ( hslide, h ) => {
			hslide.setAttribute( 'data-index-h', h );
			transformElement( hslide, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			if( hslide.classList.contains( 'stack' ) ) {

				toArray( hslide.querySelectorAll( 'section' ) ).forEach( ( vslide, v ) => {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );

					transformElement( vslide, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
				} );

			}
		} );

		// Layout slide backgrounds
		toArray( dom.background.childNodes ).forEach( ( hbackground, h ) => {
			transformElement( hbackground, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			toArray( hbackground.querySelectorAll( '.slide-background' ) ).forEach( ( vbackground, v ) => {
				transformElement( vbackground, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
			} );
		} );

	}

	/**
	 * Moves the overview viewport to the current slides.
	 * Called each time the current slide changes.
	 */
	function updateOverview() {

		const vmin = Math.min( window.innerWidth, window.innerHeight );
		const scale = Math.max( vmin / 5, 150 ) / vmin;

		transformSlides( {
			overview: [
				'scale('+ scale +')',
				'translateX('+ ( -indexh * overviewSlideWidth ) +'px)',
				'translateY('+ ( -indexv * overviewSlideHeight ) +'px)'
			].join( ' ' )
		} );

	}

	/**
	 * Exits the slide overview and enters the currently
	 * active slide.
	 */
	function deactivateOverview() {

		// Only proceed if enabled in config
		if( config.overview ) {

			overview = false;

			dom.wrapper.classList.remove( 'overview' );

			// Temporarily add a class so that transitions can do different things
			// depending on whether they are exiting/entering overview, or just
			// moving from slide to slide
			dom.wrapper.classList.add( 'overview-deactivating' );

			setTimeout( () => {
				dom.wrapper.classList.remove( 'overview-deactivating' );
			}, 1 );

			// Move the background element back out
			dom.wrapper.appendChild( dom.background );

			// Clean up changes made to slides
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( slide => {
				transformElement( slide, '' );

				slide.removeEventListener( 'click', onOverviewSlideClicked, true );
			} );

			// Clean up changes made to backgrounds
			toArray( dom.background.querySelectorAll( '.slide-background' ) ).forEach( background => {
				transformElement( background, '' );
			} );

			transformSlides( { overview: '' } );

			slide( indexh, indexv );

			layout();

			cueAutoSlide();

			// Notify observers of the overview hiding
			dispatchEvent( 'overviewhidden', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}
	}

	/**
	 * Toggles the slide overview mode on and off.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * overview is open, false means it's closed.
	 */
	function toggleOverview( override ) {

		if( typeof override === 'boolean' ) {
			override ? activateOverview() : deactivateOverview();
		}
		else {
			isOverview() ? deactivateOverview() : activateOverview();
		}

	}

	/**
	 * Checks if the overview is currently active.
	 *
	 * @return {Boolean} true if the overview is active,
	 * false otherwise
	 */
	function isOverview() {

		return overview;

	}

	/**
	 * Return a hash URL that will resolve to the given slide location.
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to link to
	 */
	function locationHash( slide ) {

		let url = '/';

		// Attempt to create a named link based on the slide's ID
		let s = slide || currentSlide;
		let id = s ? s.getAttribute( 'id' ) : null;
		if( id ) {
			id = encodeURIComponent( id );
		}

		let index = getIndices( slide );
		if( !config.fragmentInURL ) {
			index.f = undefined;
		}

		// If the current slide has an ID, use that as a named link,
		// but we don't support named links with a fragment index
		if( typeof id === 'string' && id.length && index.f === undefined ) {
			url = '/' + id;
		}
		// Otherwise use the /h/v index
		else {
			let hashIndexBase = config.hashOneBasedIndex ? 1 : 0;
			if( index.h > 0 || index.v > 0 || index.f !== undefined ) url += index.h + hashIndexBase;
			if( index.v > 0 || index.f !== undefined ) url += '/' + (index.v + hashIndexBase );
			if( index.f !== undefined ) url += '/' + index.f;
		}

		return url;

	}

	/**
	 * Checks if the current or specified slide is vertical
	 * (nested within another slide).
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to check
	 * orientation of
	 * @return {Boolean}
	 */
	function isVerticalSlide( slide = currentSlide ) {

		return slide && slide.parentNode && !!slide.parentNode.nodeName.match( /section/i );

	}

	/**
	 * Handling the fullscreen functionality via the fullscreen API
	 *
	 * @see http://fullscreen.spec.whatwg.org/
	 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
	 */
	function enterFullscreen() {

		let element = document.documentElement;

		// Check which implementation is available
		let requestMethod = element.requestFullscreen ||
							element.webkitRequestFullscreen ||
							element.webkitRequestFullScreen ||
							element.mozRequestFullScreen ||
							element.msRequestFullscreen;

		if( requestMethod ) {
			requestMethod.apply( element );
		}

	}

	/**
	 * Shows the mouse pointer after it has been hidden with
	 * #hideCursor.
	 */
	function showCursor() {

		if( cursorHidden ) {
			cursorHidden = false;
			dom.wrapper.style.cursor = '';
		}

	}

	/**
	 * Hides the mouse pointer when it's on top of the .reveal
	 * container.
	 */
	function hideCursor() {

		if( cursorHidden === false ) {
			cursorHidden = true;
			dom.wrapper.style.cursor = 'none';
		}

	}

	/**
	 * Enters the paused mode which fades everything on screen to
	 * black.
	 */
	function pause() {

		if( config.pause ) {
			const wasPaused = dom.wrapper.classList.contains( 'paused' );

			cancelAutoSlide();
			dom.wrapper.classList.add( 'paused' );

			if( wasPaused === false ) {
				dispatchEvent( 'paused' );
			}
		}

	}

	/**
	 * Exits from the paused mode.
	 */
	function resume() {

		const wasPaused = dom.wrapper.classList.contains( 'paused' );
		dom.wrapper.classList.remove( 'paused' );

		cueAutoSlide();

		if( wasPaused ) {
			dispatchEvent( 'resumed' );
		}

	}

	/**
	 * Toggles the paused mode on and off.
	 */
	function togglePause( override ) {

		if( typeof override === 'boolean' ) {
			override ? pause() : resume();
		}
		else {
			isPaused() ? resume() : pause();
		}

	}

	/**
	 * Checks if we are currently in the paused mode.
	 *
	 * @return {Boolean}
	 */
	function isPaused() {

		return dom.wrapper.classList.contains( 'paused' );

	}

	/**
	 * Toggles the auto slide mode on and off.
	 *
	 * @param {Boolean} [override] Flag which sets the desired state.
	 * True means autoplay starts, false means it stops.
	 */

	function toggleAutoSlide( override ) {

		if( typeof override === 'boolean' ) {
			override ? resumeAutoSlide() : pauseAutoSlide();
		}

		else {
			autoSlidePaused ? resumeAutoSlide() : pauseAutoSlide();
		}

	}

	/**
	 * Checks if the auto slide mode is currently on.
	 *
	 * @return {Boolean}
	 */
	function isAutoSliding() {

		return !!( autoSlide && !autoSlidePaused );

	}

	/**
	 * Steps from the current point in the presentation to the
	 * slide which matches the specified horizontal and vertical
	 * indices.
	 *
	 * @param {number} [h=indexh] Horizontal index of the target slide
	 * @param {number} [v=indexv] Vertical index of the target slide
	 * @param {number} [f] Index of a fragment within the
	 * target slide to activate
	 * @param {number} [o] Origin for use in multimaster environments
	 */
	function slide( h, v, f, o ) {

		// Remember where we were at before
		previousSlide = currentSlide;

		// Query all horizontal slides in the deck
		const horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

		// Abort if there are no slides
		if( horizontalSlides.length === 0 ) return;

		// If no vertical index is specified and the upcoming slide is a
		// stack, resume at its previous vertical index
		if( v === undefined && !isOverview() ) {
			v = getPreviousVerticalIndex( horizontalSlides[ h ] );
		}

		// If we were on a vertical stack, remember what vertical index
		// it was on so we can resume at the same position when returning
		if( previousSlide && previousSlide.parentNode && previousSlide.parentNode.classList.contains( 'stack' ) ) {
			setPreviousVerticalIndex( previousSlide.parentNode, indexv );
		}

		// Remember the state before this slide
		const stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		let indexhBefore = indexh || 0,
			indexvBefore = indexv || 0;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v );

		// Update the visibility of slides now that the indices have changed
		updateSlidesVisibility();

		layout();

		// Update the overview if it's currently active
		if( isOverview() ) {
			updateOverview();
		}

		// Find the current horizontal slide and any possible vertical slides
		// within it
		let currentHorizontalSlide = horizontalSlides[ indexh ],
			currentVerticalSlides = currentHorizontalSlide.querySelectorAll( 'section' );

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[ indexv ] || currentHorizontalSlide;

		// Show fragment, if specified
		if( typeof f !== 'undefined' ) {
			navigateFragment( f );
		}

		// Dispatch an event if the slide changed
		let slideChanged = ( indexh !== indexhBefore || indexv !== indexvBefore );
		if (!slideChanged) {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the
		// 'present' class when navigating between adjacent vertical
		// stacks
		if( previousSlide && previousSlide !== currentSlide ) {
			previousSlide.classList.remove( 'present' );
			previousSlide.setAttribute( 'aria-hidden', 'true' );

			// Reset all slides upon navigate to home
			if( Reveal.isFirstSlide() ) {
				// Launch async task
				setTimeout( () => {
					getVerticalStacks().forEach( slide => {
						setPreviousVerticalIndex( slide, 0 );
					} );
				}, 0 );
			}
		}

		// Apply the new state
		stateLoop: for( let i = 0, len = state.length; i < len; i++ ) {
			// Check if this state existed on the previous slide. If it
			// did, we will avoid adding it repeatedly
			for( let j = 0; j < stateBefore.length; j++ ) {
				if( stateBefore[j] === state[i] ) {
					stateBefore.splice( j, 1 );
					continue stateLoop;
				}
			}

			document.documentElement.classList.add( state[i] );

			// Dispatch custom event matching the state's name
			dispatchEvent( state[i] );
		}

		// Clean up the remains of the previous state
		while( stateBefore.length ) {
			document.documentElement.classList.remove( stateBefore.pop() );
		}

		if( slideChanged ) {
			dispatchEvent( 'slidechanged', {
				'indexh': indexh,
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide,
				'origin': o
			} );
		}

		// Handle embedded content
		if( slideChanged || !previousSlide ) {
			stopEmbeddedContent( previousSlide );
			startEmbeddedContent( currentSlide );
		}

		// Announce the current slide contents, for screen readers
		dom.statusDiv.textContent = getStatusText( currentSlide );

		updateControls();
		updateProgress();
		updateBackground();
		updateParallax();
		updateSlideNumber();
		updateNotes();
		updateFragments();

		// Update the URL hash
		writeURL();

		cueAutoSlide();

		// Auto-animation
		if( slideChanged && previousSlide && currentSlide && !isOverview() ) {

			// Skip the slide transition between our two slides
			// when auto-animating individual elements
			if( previousSlide.hasAttribute( 'data-auto-animate' ) && currentSlide.hasAttribute( 'data-auto-animate' ) ) {
				dom.slides.classList.add( 'disable-slide-transitions' );

				setTimeout( () => {
					dom.slides.classList.remove( 'disable-slide-transitions' );
				}, 0 );

				if( config.autoAnimate ) {
					// Run the auto-animation between our slides
					autoAnimate( previousSlide, currentSlide );
				}
			}

		}

	}

	/**
	 * Syncs the presentation with the current DOM. Useful
	 * when new slides or control elements are added or when
	 * the configuration has changed.
	 */
	function sync() {

		// Subscribe to input
		removeEventListeners();
		addEventListeners();

		// Force a layout to make sure the current config is accounted for
		layout();

		// Reflect the current autoSlide value
		autoSlide = config.autoSlide;

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Re-create the slide backgrounds
		createBackgrounds();

		// Write the current hash to the URL
		writeURL();

		sortAllFragments();

		updateControls();
		updateProgress();
		updateSlideNumber();
		updateSlidesVisibility();
		updateBackground( true );
		updateNotesVisibility();
		updateNotes();

		formatEmbeddedContent();

		// Start or stop embedded content depending on global config
		if( config.autoPlayMedia === false ) {
			stopEmbeddedContent( currentSlide, { unloadIframes: false } );
		}
		else {
			startEmbeddedContent( currentSlide );
		}

		if( isOverview() ) {
			layoutOverview();
		}

	}

	/**
	 * Updates reveal.js to keep in sync with new slide attributes. For
	 * example, if you add a new `data-background-image` you can call
	 * this to have reveal.js render the new background image.
	 *
	 * Similar to #sync() but more efficient when you only need to
	 * refresh a specific slide.
	 *
	 * @param {HTMLElement} slide
	 */
	function syncSlide( slide = currentSlide ) {

		syncBackground( slide );
		syncFragments( slide );

		loadSlide( slide );

		updateBackground();
		updateNotes();

	}

	/**
	 * Formats the fragments on the given slide so that they have
	 * valid indices. Call this if fragments are changed in the DOM
	 * after reveal.js has already initialized.
	 *
	 * @param {HTMLElement} slide
	 * @return {Array} a list of the HTML fragments that were synced
	 */
	function syncFragments( slide = currentSlide ) {

		return sortFragments( slide.querySelectorAll( '.fragment' ) );

	}

	/**
	 * Resets all vertical slides so that only the first
	 * is visible.
	 */
	function resetVerticalSlides() {

		getHorizontalSlides().forEach( function( horizontalSlide ) {

			toArray( horizontalSlide.querySelectorAll( 'section' ) ).forEach( ( verticalSlide, y ) => {

				if( y > 0 ) {
					verticalSlide.classList.remove( 'present' );
					verticalSlide.classList.remove( 'past' );
					verticalSlide.classList.add( 'future' );
					verticalSlide.setAttribute( 'aria-hidden', 'true' );
				}

			} );

		} );

	}

	/**
	 * Sorts and formats all of fragments in the
	 * presentation.
	 */
	function sortAllFragments() {

		getHorizontalSlides().forEach( horizontalSlide => {

			let verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( ( verticalSlide, y ) => {

				sortFragments( verticalSlide.querySelectorAll( '.fragment' ) );

			} );

			if( verticalSlides.length === 0 ) sortFragments( horizontalSlide.querySelectorAll( '.fragment' ) );

		} );

	}

	/**
	 * Randomly shuffles all slides in the deck.
	 */
	function shuffle() {

		getHorizontalSlides().forEach( ( slide, i, slides ) => {

			// Insert this slide next to another random slide. This may
			// cause the slide to insert before itself but that's fine.
			dom.slides.insertBefore( slide, slides[ Math.floor( Math.random() * slides.length ) ] );

		} );

	}

	/**
	 * Updates one dimension of slides by showing the slide
	 * with the specified index.
	 *
	 * @param {string} selector A CSS selector that will fetch
	 * the group of slides we are working with
	 * @param {number} index The index of the slide that should be
	 * shown
	 *
	 * @return {number} The index of the slide that is now shown,
	 * might differ from the passed in index if it was out of
	 * bounds.
	 */
	function updateSlides( selector, index ) {

		// Select all slides and convert the NodeList result to
		// an array
		let slides = toArray( dom.wrapper.querySelectorAll( selector ) ),
			slidesLength = slides.length;

		let printMode = isPrintingPDF();

		if( slidesLength ) {

			// Should the index loop?
			if( config.loop ) {
				index %= slidesLength;

				if( index < 0 ) {
					index = slidesLength + index;
				}
			}

			// Enforce max and minimum index bounds
			index = Math.max( Math.min( index, slidesLength - 1 ), 0 );

			for( let i = 0; i < slidesLength; i++ ) {
				let element = slides[i];

				let reverse = config.rtl && !isVerticalSlide( element );

				element.classList.remove( 'past', 'present', 'future' );

				// http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
				element.setAttribute( 'hidden', '' );
				element.setAttribute( 'aria-hidden', 'true' );

				// If this element contains vertical slides
				if( element.querySelector( 'section' ) ) {
					element.classList.add( 'stack' );
				}

				// If we're printing static slides, all slides are "present"
				if( printMode ) {
					element.classList.add( 'present' );
					continue;
				}

				if( i < index ) {
					// Any element previous to index is given the 'past' class
					element.classList.add( reverse ? 'future' : 'past' );

					if( config.fragments ) {
						// Show all fragments in prior slides
						toArray( element.querySelectorAll( '.fragment' ) ).forEach( fragment => {
							fragment.classList.add( 'visible' );
							fragment.classList.remove( 'current-fragment' );
						} );
					}
				}
				else if( i > index ) {
					// Any element subsequent to index is given the 'future' class
					element.classList.add( reverse ? 'past' : 'future' );

					if( config.fragments ) {
						// Hide all fragments in future slides
						toArray( element.querySelectorAll( '.fragment.visible' ) ).forEach( fragment => {
							fragment.classList.remove( 'visible', 'current-fragment' );
						} );
					}
				}
			}

			// Mark the current slide as present
			slides[index].classList.add( 'present' );
			slides[index].removeAttribute( 'hidden' );
			slides[index].removeAttribute( 'aria-hidden' );

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			let slideState = slides[index].getAttribute( 'data-state' );
			if( slideState ) {
				state = state.concat( slideState.split( ' ' ) );
			}

		}
		else {
			// Since there are no slides we can't be anywhere beyond the
			// zeroth index
			index = 0;
		}

		return index;

	}

	/**
	 * Optimization method; hide all slides that are far away
	 * from the present slide.
	 */
	function updateSlidesVisibility() {

		// Select all slides and convert the NodeList result to
		// an array
		let horizontalSlides = getHorizontalSlides(),
			horizontalSlidesLength = horizontalSlides.length,
			distanceX,
			distanceY;

		if( horizontalSlidesLength && typeof indexh !== 'undefined' ) {

			// The number of steps away from the present slide that will
			// be visible
			let viewDistance = isOverview() ? 10 : config.viewDistance;

			// Shorten the view distance on devices that typically have
			// less resources
			if( isMobileDevice ) {
				viewDistance = isOverview() ? 6 : config.mobileViewDistance;
			}

			// All slides need to be visible when exporting to PDF
			if( isPrintingPDF() ) {
				viewDistance = Number.MAX_VALUE;
			}

			for( let x = 0; x < horizontalSlidesLength; x++ ) {
				let horizontalSlide = horizontalSlides[x];

				let verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) ),
					verticalSlidesLength = verticalSlides.length;

				// Determine how far away this slide is from the present
				distanceX = Math.abs( ( indexh || 0 ) - x ) || 0;

				// If the presentation is looped, distance should measure
				// 1 between the first and last slides
				if( config.loop ) {
					distanceX = Math.abs( ( ( indexh || 0 ) - x ) % ( horizontalSlidesLength - viewDistance ) ) || 0;
				}

				// Show the horizontal slide if it's within the view distance
				if( distanceX < viewDistance ) {
					loadSlide( horizontalSlide );
				}
				else {
					unloadSlide( horizontalSlide );
				}

				if( verticalSlidesLength ) {

					let oy = getPreviousVerticalIndex( horizontalSlide );

					for( let y = 0; y < verticalSlidesLength; y++ ) {
						let verticalSlide = verticalSlides[y];

						distanceY = x === ( indexh || 0 ) ? Math.abs( ( indexv || 0 ) - y ) : Math.abs( y - oy );

						if( distanceX + distanceY < viewDistance ) {
							loadSlide( verticalSlide );
						}
						else {
							unloadSlide( verticalSlide );
						}
					}

				}
			}

			// Flag if there are ANY vertical slides, anywhere in the deck
			if( hasVerticalSlides() ) {
				dom.wrapper.classList.add( 'has-vertical-slides' );
			}
			else {
				dom.wrapper.classList.remove( 'has-vertical-slides' );
			}

			// Flag if there are ANY horizontal slides, anywhere in the deck
			if( hasHorizontalSlides() ) {
				dom.wrapper.classList.add( 'has-horizontal-slides' );
			}
			else {
				dom.wrapper.classList.remove( 'has-horizontal-slides' );
			}

		}

	}

	/**
	 * Pick up notes from the current slide and display them
	 * to the viewer.
	 *
	 * @see {@link config.showNotes}
	 */
	function updateNotes() {

		if( config.showNotes && dom.speakerNotes && currentSlide && !isPrintingPDF() ) {

			dom.speakerNotes.innerHTML = getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>';

		}

	}

	/**
	 * Updates the visibility of the speaker notes sidebar that
	 * is used to share annotated slides. The notes sidebar is
	 * only visible if showNotes is true and there are notes on
	 * one or more slides in the deck.
	 */
	function updateNotesVisibility() {

		if( config.showNotes && hasNotes() ) {
			dom.wrapper.classList.add( 'show-notes' );
		}
		else {
			dom.wrapper.classList.remove( 'show-notes' );
		}

	}

	/**
	 * Checks if there are speaker notes for ANY slide in the
	 * presentation.
	 */
	function hasNotes() {

		return dom.slides.querySelectorAll( '[data-notes], aside.notes' ).length > 0;

	}

	/**
	 * Updates the progress bar to reflect the current slide.
	 */
	function updateProgress() {

		// Update progress if enabled
		if( config.progress && dom.progressbar ) {

			dom.progressbar.style.width = getProgress() * dom.wrapper.offsetWidth + 'px';

		}

	}


	/**
	 * Updates the slide number to match the current slide.
	 */
	function updateSlideNumber() {

		// Update slide number if enabled
		if( config.slideNumber && dom.slideNumber ) {
			dom.slideNumber.innerHTML = getSlideNumber();
		}

	}

	/**
	 * Returns the HTML string corresponding to the current slide number,
	 * including formatting.
	 */
	function getSlideNumber( slide = currentSlide ) {

		let value;
		let format = 'h.v';

		if ( typeof config.slideNumber === 'function' ) {
			value = config.slideNumber( slide );
		} else {
			// Check if a custom number format is available
			if( typeof config.slideNumber === 'string' ) {
				format = config.slideNumber;
			}

			// If there are ONLY vertical slides in this deck, always use
			// a flattened slide number
			if( !/c/.test( format ) && dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ).length === 1 ) {
				format = 'c';
			}

			value = [];
			switch( format ) {
				case 'c':
					value.push( getSlidePastCount( slide ) + 1 );
					break;
				case 'c/t':
					value.push( getSlidePastCount( slide ) + 1, '/', getTotalSlides() );
					break;
				default:
					let indices = getIndices( slide );
					value.push( indices.h + 1 );
					let sep = format === 'h/v' ? '/' : '.';
					if( isVerticalSlide( slide ) ) value.push( sep, indices.v + 1 );
			}
		}

		let url = '#' + locationHash( slide );
		return formatSlideNumber( value[0], value[1], value[2], url );

	}

	/**
	 * Applies HTML formatting to a slide number before it's
	 * written to the DOM.
	 *
	 * @param {number} a Current slide
	 * @param {string} delimiter Character to separate slide numbers
	 * @param {(number|*)} b Total slides
	 * @param {HTMLElement} [url='#'+locationHash()] The url to link to
	 * @return {string} HTML string fragment
	 */
	function formatSlideNumber( a, delimiter, b, url = '#' + locationHash() ) {

		if( typeof b === 'number' && !isNaN( b ) ) {
			return  `<a href="${url}">
					<span class="slide-number-a">${a}</span>
					<span class="slide-number-delimiter">${delimiter}</span>
					<span class="slide-number-b">${b}</span>
					</a>`;
		}
		else {
			return `<a href="${url}">
					<span class="slide-number-a">${a}</span>
					</a>`;
		}

	}

	/**
	 * Updates the state of all control/navigation arrows.
	 */
	function updateControls() {

		let routes = availableRoutes();
		let fragments = availableFragments();

		// Remove the 'enabled' class from all directions
		[...dom.controlsLeft, ...dom.controlsRight, ...dom.controlsUp, ...dom.controlsDown, ...dom.controlsPrev, ...dom.controlsNext].forEach( node => {
			node.classList.remove( 'enabled', 'fragmented' );

			// Set 'disabled' attribute on all directions
			node.setAttribute( 'disabled', 'disabled' );
		} );

		// Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
		if( routes.left ) dom.controlsLeft.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right ) dom.controlsRight.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.up ) dom.controlsUp.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.down ) dom.controlsDown.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Prev/next buttons
		if( routes.left || routes.up ) dom.controlsPrev.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right || routes.down ) dom.controlsNext.forEach( el => { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Highlight fragment directions
		if( currentSlide ) {

			// Always apply fragment decorator to prev/next buttons
			if( fragments.prev ) dom.controlsPrev.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			if( fragments.next ) dom.controlsNext.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );

			// Apply fragment decorators to directional buttons based on
			// what slide axis they are in
			if( isVerticalSlide( currentSlide ) ) {
				if( fragments.prev ) dom.controlsUp.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsDown.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}
			else {
				if( fragments.prev ) dom.controlsLeft.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsRight.forEach( el => { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}

		}


		if( config.controlsTutorial ) {

			// Highlight control arrows with an animation to ensure
			// that the viewer knows how to navigate
			if( !hasNavigatedVertically && routes.down ) {
				dom.controlsDownArrow.classList.add( 'highlight' );
			}
			else {
				dom.controlsDownArrow.classList.remove( 'highlight' );

				if( config.rtl ) {

					if( !hasNavigatedHorizontally && routes.left && indexv === 0 ) {
						dom.controlsLeftArrow.classList.add( 'highlight' );
					}
					else {
						dom.controlsLeftArrow.classList.remove( 'highlight' );
					}

				} else {

					if( !hasNavigatedHorizontally && routes.right && indexv === 0 ) {
						dom.controlsRightArrow.classList.add( 'highlight' );
					}
					else {
						dom.controlsRightArrow.classList.remove( 'highlight' );
					}
				}
			}
		}
	}

	/**
	 * Updates the background elements to reflect the current
	 * slide.
	 *
	 * @param {boolean} includeAll If true, the backgrounds of
	 * all vertical slides (not just the present) will be updated.
	 */
	function updateBackground( includeAll = false ) {

		let currentBackground = null;

		// Reverse past/future classes when in RTL mode
		let horizontalPast = config.rtl ? 'future' : 'past',
			horizontalFuture = config.rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		toArray( dom.background.childNodes ).forEach( ( backgroundh, h ) => {

			backgroundh.classList.remove( 'past', 'present', 'future' );

			if( h < indexh ) {
				backgroundh.classList.add( horizontalPast );
			}
			else if ( h > indexh ) {
				backgroundh.classList.add( horizontalFuture );
			}
			else {
				backgroundh.classList.add( 'present' );

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if( includeAll || h === indexh ) {
				toArray( backgroundh.querySelectorAll( '.slide-background' ) ).forEach( ( backgroundv, v ) => {

					backgroundv.classList.remove( 'past', 'present', 'future' );

					if( v < indexv ) {
						backgroundv.classList.add( 'past' );
					}
					else if ( v > indexv ) {
						backgroundv.classList.add( 'future' );
					}
					else {
						backgroundv.classList.add( 'present' );

						// Only if this is the present horizontal and vertical slide
						if( h === indexh ) currentBackground = backgroundv;
					}

				} );
			}

		} );

		// Stop content inside of previous backgrounds
		if( previousBackground ) {

			stopEmbeddedContent( previousBackground, { unloadIframes: !shouldPreload( previousBackground ) } );

		}

		// Start content in the current background
		if( currentBackground ) {

			startEmbeddedContent( currentBackground );

			let currentBackgroundContent = currentBackground.querySelector( '.slide-background-content' );
			if( currentBackgroundContent ) {

				let backgroundImageURL = currentBackgroundContent.style.backgroundImage || '';

				// Restart GIFs (doesn't work in Firefox)
				if( /\.gif/i.test( backgroundImageURL ) ) {
					currentBackgroundContent.style.backgroundImage = '';
					window.getComputedStyle( currentBackgroundContent ).opacity;
					currentBackgroundContent.style.backgroundImage = backgroundImageURL;
				}

			}

			// Don't transition between identical backgrounds. This
			// prevents unwanted flicker.
			let previousBackgroundHash = previousBackground ? previousBackground.getAttribute( 'data-background-hash' ) : null;
			let currentBackgroundHash = currentBackground.getAttribute( 'data-background-hash' );
			if( currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== previousBackground ) {
				dom.background.classList.add( 'no-transition' );
			}

			previousBackground = currentBackground;

		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if( currentSlide ) {
			[ 'has-light-background', 'has-dark-background' ].forEach( classToBubble => {
				if( currentSlide.classList.contains( classToBubble ) ) {
					dom.wrapper.classList.add( classToBubble );
				}
				else {
					dom.wrapper.classList.remove( classToBubble );
				}
			} );
		}

		// Allow the first background to apply without transition
		setTimeout( () => {
			dom.background.classList.remove( 'no-transition' );
		}, 1 );

	}

	/**
	 * Updates the position of the parallax background based
	 * on the current slide index.
	 */
	function updateParallax() {

		if( config.parallaxBackgroundImage ) {

			let horizontalSlides = getHorizontalSlides(),
				verticalSlides = getVerticalSlides();

			let backgroundSize = dom.background.style.backgroundSize.split( ' ' ),
				backgroundWidth, backgroundHeight;

			if( backgroundSize.length === 1 ) {
				backgroundWidth = backgroundHeight = parseInt( backgroundSize[0], 10 );
			}
			else {
				backgroundWidth = parseInt( backgroundSize[0], 10 );
				backgroundHeight = parseInt( backgroundSize[1], 10 );
			}

			let slideWidth = dom.background.offsetWidth,
				horizontalSlideCount = horizontalSlides.length,
				horizontalOffsetMultiplier,
				horizontalOffset;

			if( typeof config.parallaxBackgroundHorizontal === 'number' ) {
				horizontalOffsetMultiplier = config.parallaxBackgroundHorizontal;
			}
			else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? ( backgroundWidth - slideWidth ) / ( horizontalSlideCount-1 ) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indexh * -1;

			let slideHeight = dom.background.offsetHeight,
				verticalSlideCount = verticalSlides.length,
				verticalOffsetMultiplier,
				verticalOffset;

			if( typeof config.parallaxBackgroundVertical === 'number' ) {
				verticalOffsetMultiplier = config.parallaxBackgroundVertical;
			}
			else {
				verticalOffsetMultiplier = ( backgroundHeight - slideHeight ) / ( verticalSlideCount-1 );
			}

			verticalOffset = verticalSlideCount > 0 ?  verticalOffsetMultiplier * indexv : 0;

			dom.background.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';

		}

	}

	/**
	 * Runs an auto-animation between the given slides.
	 *
	 * @param  {HTMLElement} fromSlide
	 * @param  {HTMLElement} toSlide
	 */
	function autoAnimate( fromSlide, toSlide ) {

		// Clean up after prior animations
		removeEphemeralAutoAnimateAttributes();

		if( autoAnimateStyleSheet && autoAnimateStyleSheet.parentNode ) {
			autoAnimateStyleSheet.parentNode.removeChild( autoAnimateStyleSheet );
			autoAnimateStyleSheet = null;
		}

		// Ensure that both slides are auto-animate targets
		if( fromSlide.hasAttribute( 'data-auto-animate' ) && toSlide.hasAttribute( 'data-auto-animate' ) ) {

			// Create a new auto-animate sheet
			autoAnimateStyleSheet = autoAnimateStyleSheet || document.createElement( 'style' );
			autoAnimateStyleSheet.type = 'text/css';
			document.head.appendChild( autoAnimateStyleSheet );

			let animationOptions = getAutoAnimateOptions( toSlide );

			// Set our starting state
			fromSlide.dataset.autoAnimate = 'pending';
			toSlide.dataset.autoAnimate = 'pending';

			// Inject our auto-animate styles for this transition
			let css = getAutoAnimatableElements( fromSlide, toSlide ).map( function( elements ) {
				return getAutoAnimateCSS( elements.from, elements.to, elements.options || {}, animationOptions, autoAnimateCounter++ );
			} );

			// Animate unmatched elements, if enabled
			if( toSlide.dataset.autoAnimateUnmatched !== 'false' && config.autoAnimateUnmatched === true ) {
				getUnmatchedAutoAnimateElements( toSlide ).forEach( function( unmatchedElement ) {
					unmatchedElement.dataset.autoAnimateTarget = 'unmatched';
				} );

				css.push( `[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${animationOptions.duration*0.8}s ease ${animationOptions.duration*0.2}s; }` );
			}

			// Setting the whole chunk of CSS at once is the most
			// efficient way to do this. Using sheet.insertRule
			// is multiple factors slower.
			autoAnimateStyleSheet.innerHTML = css.join( '' );

			// Start the animation next cycle
			requestAnimationFrame( () => {
				if( autoAnimateStyleSheet ) {
					// This forces our newly injected styles to be applied in Firefox
					getComputedStyle( autoAnimateStyleSheet ).fontWeight;

					toSlide.dataset.autoAnimate = 'running';
				}
			} );

			dispatchEvent( 'autoanimate', { fromSlide: fromSlide, toSlide: toSlide, sheet: autoAnimateStyleSheet } );

		}

	}

	/**
	 * Removes all attributes that we temporarily add to slide
	 * elements in order to carry out auto-animation.
	 */
	function removeEphemeralAutoAnimateAttributes() {

		toArray( dom.wrapper.querySelectorAll( '[data-auto-animate-target]' ) ).forEach( element => {
			delete element.dataset.autoAnimateTarget;
		} );

	}

	/**
	 * Auto-animates the properties of an element from their original
	 * values to their new state.
	 *
	 * @param {HTMLElement} from
	 * @param {HTMLElement} to
	 * @param {Object} elementOptions Options for this element pair
	 * @param {Object} animationOptions Options set at the slide level
	 * @param {String} id Unique ID that we can use to identify this
	 * auto-animate element in the DOM
	 */
	function getAutoAnimateCSS( from, to, elementOptions, animationOptions, id ) {

		// 'from' elements are given a data-auto-animate-target with no value,
		// 'to' elements are are given a data-auto-animate-target with an ID
		from.dataset.autoAnimateTarget = '';
		to.dataset.autoAnimateTarget = id;

		// Each element may override any of the auto-animate options
		// like transition easing, duration and delay via data-attributes
		let options = getAutoAnimateOptions( to, animationOptions );

		// If we're using a custom element matcher the element options
		// may contain additional transition overrides
		if( typeof elementOptions.delay !== 'undefined' ) options.delay = elementOptions.delay;
		if( typeof elementOptions.duration !== 'undefined' ) options.duration = elementOptions.duration;
		if( typeof elementOptions.easing !== 'undefined' ) options.easing = elementOptions.easing;

		let fromProps = getAutoAnimatableProperties( 'from', from, elementOptions ),
			toProps = getAutoAnimatableProperties( 'to', to, elementOptions );

		// If translation and/or scaling are enabled, css transform
		// the 'to' element so that it matches the position and size
		// of the 'from' element
		if( elementOptions.translate !== false || elementOptions.scale !== false ) {

			let presentationScale = Reveal.getScale();

			let delta = {
				x: ( fromProps.x - toProps.x ) / presentationScale,
				y: ( fromProps.y - toProps.y ) / presentationScale,
				scaleX: fromProps.width / toProps.width,
				scaleY: fromProps.height / toProps.height
			};

			// Limit decimal points to avoid 0.0001px blur and stutter
			delta.x = Math.round( delta.x * 1000 ) / 1000;
			delta.y = Math.round( delta.y * 1000 ) / 1000;
			delta.scaleX = Math.round( delta.scaleX * 1000 ) / 1000;
			delta.scaleX = Math.round( delta.scaleX * 1000 ) / 1000;

			let translate = elementOptions.translate !== false && ( delta.x !== 0 || delta.y !== 0 ),
				scale = elementOptions.scale !== false && ( delta.scaleX !== 0 || delta.scaleY !== 0 );

			// No need to transform if nothing's changed
			if( translate || scale ) {

				let transform = [];

				if( translate ) transform.push( `translate(${delta.x}px, ${delta.y}px)` );
				if( scale ) transform.push( `scale(${delta.scaleX}, ${delta.scaleY})` );

				fromProps.styles['transform'] = transform.join( ' ' );
				fromProps.styles['transform-origin'] = 'top left';

				toProps.styles['transform'] = 'none';

			}

		}

		// Delete all unchanged 'to' styles
		for( let propertyName in toProps.styles ) {
			const toValue = toProps.styles[propertyName];
			const fromValue = fromProps.styles[propertyName];

			if( toValue === fromValue ) {
				delete toProps.styles[propertyName];
			}
			else {
				// If these property values were set via a custom matcher providing
				// an explicit 'from' and/or 'to' value, we always inject those values.
				if( toValue.explicitValue === true ) {
					toProps.styles[propertyName] = toValue.value;
				}

				if( fromValue.explicitValue === true ) {
					fromProps.styles[propertyName] = fromValue.value;
				}
			}
		}

		let css = '';

		let toStyleProperties = Object.keys( toProps.styles );

		// Only create animate this element IF at least one style
		// property has changed
		if( toStyleProperties.length > 0 ) {

			// Instantly move to the 'from' state
			fromProps.styles['transition'] = 'none';

			// Animate towards the 'to' state
			toProps.styles['transition'] = `all ${options.duration}s ${options.easing} ${options.delay}s`;
			toProps.styles['transition-property'] = toStyleProperties.join( ', ' );
			toProps.styles['will-change'] = toStyleProperties.join( ', ' );

			// Build up our custom CSS. We need to override inline styles
			// so we need to make our styles vErY IMPORTANT!1!!
			let fromCSS = Object.keys( fromProps.styles ).map( function( propertyName ) {
				return propertyName + ': ' + fromProps.styles[propertyName] + ' !important;';
			} ).join( '' );

			let toCSS = Object.keys( toProps.styles ).map( function( propertyName ) {
				return propertyName + ': ' + toProps.styles[propertyName] + ' !important;';
			} ).join( '' );

			css = 	'[data-auto-animate-target="'+ id +'"] {'+ fromCSS +'}' +
					'[data-auto-animate="running"] [data-auto-animate-target="'+ id +'"] {'+ toCSS +'}';

		}

		return css;

	}

	/**
	 * Returns the auto-animate options for the given element.
	 *
	 * @param {HTMLElement} element Element to pick up options
	 * from, either a slide or an animation target
	 * @param {Object} [inheritedOptions] Optional set of existing
	 * options
	 */
	function getAutoAnimateOptions( element, inheritedOptions ) {

		let options = {
			easing: config.autoAnimateEasing,
			duration: config.autoAnimateDuration,
			delay: 0
		};

		options = extend( options, inheritedOptions );

		// Inherit options from parent elements
		if( element.closest && element.parentNode ) {
			let autoAnimatedParent = element.parentNode.closest( '[data-auto-animate-target]' );
			if( autoAnimatedParent ) {
				options = getAutoAnimateOptions( autoAnimatedParent, options );
			}
		}

		if( element.dataset.autoAnimateEasing ) {
			options.easing = element.dataset.autoAnimateEasing;
		}

		if( element.dataset.autoAnimateDuration ) {
			options.duration = parseFloat( element.dataset.autoAnimateDuration );
		}

		if( element.dataset.autoAnimateDelay ) {
			options.delay = parseFloat( element.dataset.autoAnimateDelay );
		}

		return options;

	}

	/**
	 * Returns an object containing all of the properties
	 * that can be auto-animated for the given element and
	 * their current computed values.
	 *
	 * @param {String} direction 'from' or 'to'
	 */
	function getAutoAnimatableProperties( direction, element, elementOptions ) {

		let properties = { styles: [] };

		// Position and size
		if( elementOptions.translate !== false || elementOptions.scale !== false ) {
			let bounds;

			// Custom auto-animate may optionally return a custom tailored
			// measurement function
			if( typeof elementOptions.measure === 'function' ) {
				bounds = elementOptions.measure( element );
			}
			else {
				bounds = element.getBoundingClientRect();
			}

			properties.x = bounds.x;
			properties.y = bounds.y;
			properties.width = bounds.width;
			properties.height = bounds.height;
		}

		const computedStyles = getComputedStyle( element );

		// CSS styles
		( elementOptions.styles || config.autoAnimateStyles ).forEach( style => {
			let value;

			// `style` is either the property name directly, or an object
			// definition of a style property
			if( typeof style === 'string' ) style = { property: style };

			if( typeof style.from !== 'undefined' && direction === 'from' ) {
				value = { value: style.from, explicitValue: true };
			}
			else if( typeof style.to !== 'undefined' && direction === 'to' ) {
				value = { value: style.to, explicitValue: true };
			}
			else {
				value = computedStyles[style.property];
			}

			if( value !== '' ) {
				properties.styles[style.property] = value;
			}
		} );

		return properties;

	}

	/**
	 * Get a list of all element pairs that we can animate
	 * between the given slides.
	 *
	 * @param {HTMLElement} fromSlide
	 * @param {HTMLElement} toSlide
	 *
	 * @return {Array} Each value is an array where [0] is
	 * the element we're animating from and [1] is the
	 * element we're animating to
	 */
	function getAutoAnimatableElements( fromSlide, toSlide ) {

		let matcher = typeof config.autoAnimateMatcher === 'function' ? config.autoAnimateMatcher : getAutoAnimatePairs;

		let pairs = matcher( fromSlide, toSlide );

		let reserved = [];

		// Remove duplicate pairs
		return pairs.filter( ( pair, index ) => {
			if( reserved.indexOf( pair.to ) === -1 ) {
				reserved.push( pair.to );
				return true;
			}
		} );

	}

	/**
	 * Identifies matching elements between slides.
	 *
	 * You can specify a custom matcher function by using
	 * the `autoAnimateMatcher` config option.
	 */
	function getAutoAnimatePairs( fromSlide, toSlide ) {

		let pairs = [];

		const codeNodes = 'pre';
		const textNodes = 'h1, h2, h3, h4, h5, h6, p, li';
		const mediaNodes = 'img, video, iframe';

		// Eplicit matches via data-id
		findAutoAnimateMatches( pairs, fromSlide, toSlide, '[data-id]', node => {
			return node.nodeName + ':::' + node.getAttribute( 'data-id' );
		} );

		// Text
		findAutoAnimateMatches( pairs, fromSlide, toSlide, textNodes, node => {
			return node.nodeName + ':::' + node.innerText;
		} );

		// Media
		findAutoAnimateMatches( pairs, fromSlide, toSlide, mediaNodes, node => {
			return node.nodeName + ':::' + ( node.getAttribute( 'src' ) || node.getAttribute( 'data-src' ) );
		} );

		// Code
		findAutoAnimateMatches( pairs, fromSlide, toSlide, codeNodes, node => {
			return node.nodeName + ':::' + node.innerText;
		} );

		pairs.forEach( pair => {

			// Disable scale transformations on text nodes, we transiition
			// each individual text property instead
			if( pair.from.matches( textNodes ) ) {
				pair.options = { scale: false };
			}
			// Animate individual lines of code
			else if( pair.from.matches( codeNodes ) ) {

				// Transition the code block's width and height instead of scaling
				// to prevent its content from being squished
				pair.options = { scale: false, styles: [ 'width', 'height' ] };

				// Lines of code
				findAutoAnimateMatches( pairs, pair.from, pair.to, '.hljs .hljs-ln-code', node => {
					return node.textContent;
				}, {
					scale: false,
					styles: [],
					measure: getLocalBoundingBox
				} );

				// Line numbers
				findAutoAnimateMatches( pairs, pair.from, pair.to, '.hljs .hljs-ln-line[data-line-number]', node => {
					return node.getAttribute( 'data-line-number' );
				}, {
					scale: false,
					styles: [ 'width' ],
					measure: getLocalBoundingBox
				} );

			}

		} );

		return pairs;

	}

	/**
	 * Helper method which returns a bounding box based on
	 * the given elements offset coordinates.
	 *
	 * @param {HTMLElement} element
	 * @return {Object} x, y, width, height
	 */
	function getLocalBoundingBox( element ) {

		const presentationScale = Reveal.getScale();

		return {
			x: Math.round( ( element.offsetLeft * presentationScale ) * 100 ) / 100,
			y: Math.round( ( element.offsetTop * presentationScale ) * 100 ) / 100,
			width: Math.round( ( element.offsetWidth * presentationScale ) * 100 ) / 100,
			height: Math.round( ( element.offsetHeight * presentationScale ) * 100 ) / 100
		};

	}

	/**
	 * Finds matching elements between two slides.
	 *
	 * @param {Array} pairs            	List of pairs to push matches to
	 * @param {HTMLElement} fromScope   Scope within the from element exists
	 * @param {HTMLElement} toScope     Scope within the to element exists
	 * @param {String} selector         CSS selector of the element to match
	 * @param {Function} serializer     A function that accepts an element and returns
	 *                                  a stringified ID based on its contents
	 * @param {Object} animationOptions Optional config options for this pair
	 */
	function findAutoAnimateMatches( pairs, fromScope, toScope, selector, serializer, animationOptions ) {

		let fromMatches = {};
		let toMatches = {};

		[].slice.call( fromScope.querySelectorAll( selector ) ).forEach( ( element, i ) => {
			const key = serializer( element );
			if( typeof key === 'string' && key.length ) {
				fromMatches[key] = fromMatches[key] || [];
				fromMatches[key].push( element );
			}
		} );

		[].slice.call( toScope.querySelectorAll( selector ) ).forEach( ( element, i ) => {
			const key = serializer( element );
			toMatches[key] = toMatches[key] || [];
			toMatches[key].push( element );

			let fromElement;

			// Retrieve the 'from' element
			if( fromMatches[key] ) {
				const pimaryIndex = toMatches[key].length - 1;
				const secondaryIndex = fromMatches[key].length - 1;

				// If there are multiple identical from elements, retrieve
				// the one at the same index as our to-element.
				if( fromMatches[key][ pimaryIndex ] ) {
					fromElement = fromMatches[key][ pimaryIndex ];
					fromMatches[key][ pimaryIndex ] = null;
				}
				// If there are no matching from-elements at the same index,
				// use the last one.
				else if( fromMatches[key][ secondaryIndex ] ) {
					fromElement = fromMatches[key][ secondaryIndex ];
					fromMatches[key][ secondaryIndex ] = null;
				}
			}

			// If we've got a matching pair, push it to the list of pairs
			if( fromElement ) {
				pairs.push({
					from: fromElement,
					to: element,
					options: animationOptions
				});
			}
		} );

	}

	/**
	 * Returns a all elements within the given scope that should
	 * be considered unmatched in an auto-animate transition. If
	 * fading of unmatched elements is turned on, these elements
	 * will fade when going between auto-animate slides.
	 *
	 * Note that parents of auto-animate targets are NOT considerd
	 * unmatched since fading them would break the auto-animation.
	 *
	 * @param {HTMLElement} rootElement
	 * @return {Array}
	 */
	function getUnmatchedAutoAnimateElements( rootElement ) {

		return [].slice.call( rootElement.children ).reduce( ( result, element ) => {

			const containsAnimatedElements = element.querySelector( '[data-auto-animate-target]' );

			// The element is unmatched if
			// - It is not an auto-animate target
			// - It does not contain any auto-animate targets
			if( !element.hasAttribute( 'data-auto-animate-target' ) && !containsAnimatedElements ) {
				result.push( element );
			}

			if( element.querySelector( '[data-auto-animate-target]' ) ) {
				result = result.concat( getUnmatchedAutoAnimateElements( element ) );
			}

			return result;

		}, [] );

	}

	/**
	 * Should the given element be preloaded?
	 * Decides based on local element attributes and global config.
	 *
	 * @param {HTMLElement} element
	 */
	function shouldPreload( element ) {

		// Prefer an explicit global preload setting
		let preload = config.preloadIframes;

		// If no global setting is available, fall back on the element's
		// own preload setting
		if( typeof preload !== 'boolean' ) {
			preload = element.hasAttribute( 'data-preload' );
		}

		return preload;
	}

	/**
	 * Called when the given slide is within the configured view
	 * distance. Shows the slide element and loads any content
	 * that is set to load lazily (data-src).
	 *
	 * @param {HTMLElement} slide Slide to show
	 */
	function loadSlide( slide, options = {} ) {

		// Show the slide element
		slide.style.display = config.display;

		// Media elements with data-src attributes
		toArray( slide.querySelectorAll( 'img[data-src], video[data-src], audio[data-src], iframe[data-src]' ) ).forEach( element => {
			if( element.tagName !== 'IFRAME' || shouldPreload( element ) ) {
				element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
				element.setAttribute( 'data-lazy-loaded', '' );
				element.removeAttribute( 'data-src' );
			}
		} );

		// Media elements with <source> children
		toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( media => {
			var sources = 0;

			toArray( media.querySelectorAll( 'source[data-src]' ) ).forEach( source => {
				source.setAttribute( 'src', source.getAttribute( 'data-src' ) );
				source.removeAttribute( 'data-src' );
				source.setAttribute( 'data-lazy-loaded', '' );
				sources += 1;
			} );

			// If we rewrote sources for this video/audio element, we need
			// to manually tell it to load from its new origin
			if( sources > 0 ) {
				media.load();
			}
		} );


		// Show the corresponding background element
		let background = slide.slideBackgroundElement;
		if( background ) {
			background.style.display = 'block';

			let backgroundContent = slide.slideBackgroundContentElement;
			let backgroundIframe = slide.getAttribute( 'data-background-iframe' );

			// If the background contains media, load it
			if( background.hasAttribute( 'data-loaded' ) === false ) {
				background.setAttribute( 'data-loaded', 'true' );

				let backgroundImage = slide.getAttribute( 'data-background-image' ),
					backgroundVideo = slide.getAttribute( 'data-background-video' ),
					backgroundVideoLoop = slide.hasAttribute( 'data-background-video-loop' ),
					backgroundVideoMuted = slide.hasAttribute( 'data-background-video-muted' );

				// Images
				if( backgroundImage ) {
					backgroundContent.style.backgroundImage = 'url('+ encodeURI( backgroundImage ) +')';
				}
				// Videos
				else if ( backgroundVideo && !isSpeakerNotes() ) {
					let video = document.createElement( 'video' );

					if( backgroundVideoLoop ) {
						video.setAttribute( 'loop', '' );
					}

					if( backgroundVideoMuted ) {
						video.muted = true;
					}

					// Inline video playback works (at least in Mobile Safari) as
					// long as the video is muted and the `playsinline` attribute is
					// present
					if( isMobileDevice ) {
						video.muted = true;
						video.autoplay = true;
						video.setAttribute( 'playsinline', '' );
					}

					// Support comma separated lists of video sources
					backgroundVideo.split( ',' ).forEach( source => {
						video.innerHTML += '<source src="'+ source +'">';
					} );

					backgroundContent.appendChild( video );
				}
				// Iframes
				else if( backgroundIframe && options.excludeIframes !== true ) {
					let iframe = document.createElement( 'iframe' );
					iframe.setAttribute( 'allowfullscreen', '' );
					iframe.setAttribute( 'mozallowfullscreen', '' );
					iframe.setAttribute( 'webkitallowfullscreen', '' );
					iframe.setAttribute( 'allow', 'autoplay' );

					iframe.setAttribute( 'data-src', backgroundIframe );

					iframe.style.width  = '100%';
					iframe.style.height = '100%';
					iframe.style.maxHeight = '100%';
					iframe.style.maxWidth = '100%';

					backgroundContent.appendChild( iframe );
				}
			}

			// Start loading preloadable iframes
			let backgroundIframeElement = backgroundContent.querySelector( 'iframe[data-src]' );
			if( backgroundIframeElement ) {

				// Check if this iframe is eligible to be preloaded
				if( shouldPreload( background ) && !/autoplay=(1|true|yes)/gi.test( backgroundIframe ) ) {
					if( backgroundIframeElement.getAttribute( 'src' ) !== backgroundIframe ) {
						backgroundIframeElement.setAttribute( 'src', backgroundIframe );
					}
				}

			}

		}

	}

	/**
	 * Unloads and hides the given slide. This is called when the
	 * slide is moved outside of the configured view distance.
	 *
	 * @param {HTMLElement} slide
	 */
	function unloadSlide( slide ) {

		// Hide the slide element
		slide.style.display = 'none';

		// Hide the corresponding background element
		let background = getSlideBackground( slide );
		if( background ) {
			background.style.display = 'none';

			// Unload any background iframes
			toArray( background.querySelectorAll( 'iframe[src]' ) ).forEach( element => {
				element.removeAttribute( 'src' );
			} );
		}

		// Reset lazy-loaded media elements with src attributes
		toArray( slide.querySelectorAll( 'video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]' ) ).forEach( element => {
			element.setAttribute( 'data-src', element.getAttribute( 'src' ) );
			element.removeAttribute( 'src' );
		} );

		// Reset lazy-loaded media elements with <source> children
		toArray( slide.querySelectorAll( 'video[data-lazy-loaded] source[src], audio source[src]' ) ).forEach( source => {
			source.setAttribute( 'data-src', source.getAttribute( 'src' ) );
			source.removeAttribute( 'src' );
		} );

	}

	/**
	 * Determine what available routes there are for navigation.
	 *
	 * @return {{left: boolean, right: boolean, up: boolean, down: boolean}}
	 */
	function availableRoutes() {

		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
			verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

		let routes = {
			left: indexh > 0,
			right: indexh < horizontalSlides.length - 1,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};

		// Looped presentations can always be navigated as long as
		// there are slides available
		if( config.loop ) {
			if( horizontalSlides.length > 1 ) {
				routes.left = true;
				routes.right = true;
			}

			if( verticalSlides.length > 1 ) {
				routes.up = true;
				routes.down = true;
			}
		}

		// Reverse horizontal controls for rtl
		if( config.rtl ) {
			let left = routes.left;
			routes.left = routes.right;
			routes.right = left;
		}

		return routes;

	}

	/**
	 * Returns an object describing the available fragment
	 * directions.
	 *
	 * @return {{prev: boolean, next: boolean}}
	 */
	function availableFragments() {

		if( currentSlide && config.fragments ) {
			let fragments = currentSlide.querySelectorAll( '.fragment' );
			let hiddenFragments = currentSlide.querySelectorAll( '.fragment:not(.visible)' );

			return {
				prev: fragments.length - hiddenFragments.length > 0,
				next: !!hiddenFragments.length
			};
		}
		else {
			return { prev: false, next: false };
		}

	}

	/**
	 * Enforces origin-specific format rules for embedded media.
	 */
	function formatEmbeddedContent() {

		let _appendParamToIframeSource = ( sourceAttribute, sourceURL, param ) => {
			toArray( dom.slides.querySelectorAll( 'iframe['+ sourceAttribute +'*="'+ sourceURL +'"]' ) ).forEach( el => {
				var src = el.getAttribute( sourceAttribute );
				if( src && src.indexOf( param ) === -1 ) {
					el.setAttribute( sourceAttribute, src + ( !/\?/.test( src ) ? '?' : '&' ) + param );
				}
			});
		};

		// YouTube frames must include "?enablejsapi=1"
		_appendParamToIframeSource( 'src', 'youtube.com/embed/', 'enablejsapi=1' );
		_appendParamToIframeSource( 'data-src', 'youtube.com/embed/', 'enablejsapi=1' );

		// Vimeo frames must include "?api=1"
		_appendParamToIframeSource( 'src', 'player.vimeo.com/', 'api=1' );
		_appendParamToIframeSource( 'data-src', 'player.vimeo.com/', 'api=1' );

	}

	/**
	 * Start playback of any embedded content inside of
	 * the given element.
	 *
	 * @param {HTMLElement} element
	 */
	function startEmbeddedContent( element ) {

		if( element && !isSpeakerNotes() ) {

			// Restart GIFs
			toArray( element.querySelectorAll( 'img[src$=".gif"]' ) ).forEach( el => {
				// Setting the same unchanged source like this was confirmed
				// to work in Chrome, FF & Safari
				el.setAttribute( 'src', el.getAttribute( 'src' ) );
			} );

			// HTML5 media elements
			toArray( element.querySelectorAll( 'video, audio' ) ).forEach( el => {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				// Prefer an explicit global autoplay setting
				let autoplay = config.autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if( typeof autoplay !== 'boolean' ) {
					autoplay = el.hasAttribute( 'data-autoplay' ) || !!closestParent( el, '.slide-background' );
				}

				if( autoplay && typeof el.play === 'function' ) {

					// If the media is ready, start playback
					if( el.readyState > 1 ) {
						startEmbeddedMedia( { target: el } );
					}
					// Mobile devices never fire a loaded event so instead
					// of waiting, we initiate playback
					else if( isMobileDevice ) {
						let promise = el.play();

						// If autoplay does not work, ensure that the controls are visible so
						// that the viewer can start the media on their own
						if( promise && typeof promise.catch === 'function' && el.controls === false ) {
							promise.catch( function() {
								el.controls = true;

								// Once the video does start playing, hide the controls again
								el.addEventListener( 'play', () => {
									el.controls = false;
								} );
							} );
						}
					}
					// If the media isn't loaded, wait before playing
					else {
						el.removeEventListener( 'loadeddata', startEmbeddedMedia ); // remove first to avoid dupes
						el.addEventListener( 'loadeddata', startEmbeddedMedia );
					}

				}
			} );

			// Normal iframes
			toArray( element.querySelectorAll( 'iframe[src]' ) ).forEach( el => {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				startEmbeddedIframe( { target: el } );
			} );

			// Lazy loading iframes
			toArray( element.querySelectorAll( 'iframe[data-src]' ) ).forEach( el => {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				if( el.getAttribute( 'src' ) !== el.getAttribute( 'data-src' ) ) {
					el.removeEventListener( 'load', startEmbeddedIframe ); // remove first to avoid dupes
					el.addEventListener( 'load', startEmbeddedIframe );
					el.setAttribute( 'src', el.getAttribute( 'data-src' ) );
				}
			} );

		}

	}

	/**
	 * Starts playing an embedded video/audio element after
	 * it has finished loading.
	 *
	 * @param {object} event
	 */
	function startEmbeddedMedia( event ) {

		let isAttachedToDOM = !!closestParent( event.target, 'html' ),
			isVisible  		= !!closestParent( event.target, '.present' );

		if( isAttachedToDOM && isVisible ) {
			event.target.currentTime = 0;
			event.target.play();
		}

		event.target.removeEventListener( 'loadeddata', startEmbeddedMedia );

	}

	/**
	 * "Starts" the content of an embedded iframe using the
	 * postMessage API.
	 *
	 * @param {object} event
	 */
	function startEmbeddedIframe( event ) {

		let iframe = event.target;

		if( iframe && iframe.contentWindow ) {

			let isAttachedToDOM = !!closestParent( event.target, 'html' ),
				isVisible  		= !!closestParent( event.target, '.present' );

			if( isAttachedToDOM && isVisible ) {

				// Prefer an explicit global autoplay setting
				let autoplay = config.autoPlayMedia;

				// If no global setting is available, fall back on the element's
				// own autoplay setting
				if( typeof autoplay !== 'boolean' ) {
					autoplay = iframe.hasAttribute( 'data-autoplay' ) || !!closestParent( iframe, '.slide-background' );
				}

				// YouTube postMessage API
				if( /youtube\.com\/embed\//.test( iframe.getAttribute( 'src' ) ) && autoplay ) {
					iframe.contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
				}
				// Vimeo postMessage API
				else if( /player\.vimeo\.com\//.test( iframe.getAttribute( 'src' ) ) && autoplay ) {
					iframe.contentWindow.postMessage( '{"method":"play"}', '*' );
				}
				// Generic postMessage API
				else {
					iframe.contentWindow.postMessage( 'slide:start', '*' );
				}

			}

		}

	}

	/**
	 * Stop playback of any embedded content inside of
	 * the targeted slide.
	 *
	 * @param {HTMLElement} element
	 */
	function stopEmbeddedContent( element, options = {} ) {

		options = extend( {
			// Defaults
			unloadIframes: true
		}, options );

		if( element && element.parentNode ) {
			// HTML5 media elements
			toArray( element.querySelectorAll( 'video, audio' ) ).forEach( el => {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.pause === 'function' ) {
					el.setAttribute('data-paused-by-reveal', '');
					el.pause();
				}
			} );

			// Generic postMessage API for non-lazy loaded iframes
			toArray( element.querySelectorAll( 'iframe' ) ).forEach( el => {
				if( el.contentWindow ) el.contentWindow.postMessage( 'slide:stop', '*' );
				el.removeEventListener( 'load', startEmbeddedIframe );
			});

			// YouTube postMessage API
			toArray( element.querySelectorAll( 'iframe[src*="youtube.com/embed/"]' ) ).forEach( el => {
				if( !el.hasAttribute( 'data-ignore' ) && el.contentWindow && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				}
			});

			// Vimeo postMessage API
			toArray( element.querySelectorAll( 'iframe[src*="player.vimeo.com/"]' ) ).forEach( el => {
				if( !el.hasAttribute( 'data-ignore' ) && el.contentWindow && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			});

			if( options.unloadIframes === true ) {
				// Unload lazy-loaded iframes
				toArray( element.querySelectorAll( 'iframe[data-src]' ) ).forEach( el => {
					// Only removing the src doesn't actually unload the frame
					// in all browsers (Firefox) so we set it to blank first
					el.setAttribute( 'src', 'about:blank' );
					el.removeAttribute( 'src' );
				} );
			}
		}

	}

	/**
	 * Returns the number of past slides. This can be used as a global
	 * flattened index for slides.
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide we're counting before
	 *
	 * @return {number} Past slide count
	 */
	function getSlidePastCount( slide = currentSlide ) {

		let horizontalSlides = getHorizontalSlides();

		// The number of past slides
		let pastCount = 0;

		// Step through all slides and count the past ones
		mainLoop: for( let i = 0; i < horizontalSlides.length; i++ ) {

			let horizontalSlide = horizontalSlides[i];
			let verticalSlides = horizontalSlide.querySelectorAll( 'section' );

			for( let j = 0; j < verticalSlides.length; j++ ) {

				// Stop as soon as we arrive at the present
				if( verticalSlides[j] === slide ) {
					break mainLoop;
				}

				// Don't count slides with the "uncounted" class
				if( verticalSlides[j].dataset.visibility !== 'uncounted' ) {
					pastCount++;
				}

			}

			// Stop as soon as we arrive at the present
			if( horizontalSlide === slide ) {
				break;
			}

			// Don't count the wrapping section for vertical slides and
			// slides marked as uncounted
			if( horizontalSlide.classList.contains( 'stack' ) === false && !horizontalSlide.dataset.visibility !== 'uncounted' ) {
				pastCount++;
			}

		}

		return pastCount;

	}

	/**
	 * Returns a value ranging from 0-1 that represents
	 * how far into the presentation we have navigated.
	 *
	 * @return {number}
	 */
	function getProgress() {

		// The number of past and total slides
		let totalCount = getTotalSlides();
		let pastCount = getSlidePastCount();

		if( currentSlide ) {

			let allFragments = currentSlide.querySelectorAll( '.fragment' );

			// If there are fragments in the current slide those should be
			// accounted for in the progress.
			if( allFragments.length > 0 ) {
				let visibleFragments = currentSlide.querySelectorAll( '.fragment.visible' );

				// This value represents how big a portion of the slide progress
				// that is made up by its fragments (0-1)
				let fragmentWeight = 0.9;

				// Add fragment progress to the past slide count
				pastCount += ( visibleFragments.length / allFragments.length ) * fragmentWeight;
			}

		}

		return Math.min( pastCount / ( totalCount - 1 ), 1 );

	}

	/**
	 * Checks if this presentation is running inside of the
	 * speaker notes window.
	 *
	 * @return {boolean}
	 */
	function isSpeakerNotes() {

		return !!window.location.search.match( /receiver/gi );

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL() {

		let hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		let bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#|\//gi, '' );

		// If the first bit is not fully numeric and there is a name we
		// can assume that this is a named link
		if( !/^[0-9]*$/.test( bits[0] ) && name.length ) {
			let element;

			// Ensure the named link is a valid HTML ID attribute
			try {
				element = document.getElementById( decodeURIComponent( name ) );
			}
			catch ( error ) { }

			// Ensure that we're not already on a slide with the same name
			let isSameNameAsCurrentSlide = currentSlide ? currentSlide.getAttribute( 'id' ) === name : false;

			if( element ) {
				// If the slide exists and is not the current slide...
				if ( !isSameNameAsCurrentSlide ) {
					// ...find the position of the named slide and navigate to it
					let indices = Reveal.getIndices(element);
					slide(indices.h, indices.v);
				}
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				slide( indexh || 0, indexv || 0 );
			}
		}
		else {
			let hashIndexBase = config.hashOneBasedIndex ? 1 : 0;

			// Read the index components of the hash
			let h = ( parseInt( bits[0], 10 ) - hashIndexBase ) || 0,
				v = ( parseInt( bits[1], 10 ) - hashIndexBase ) || 0,
				f;

			if( config.fragmentInURL ) {
				f = parseInt( bits[2], 10 );
				if( isNaN( f ) ) {
					f = undefined;
				}
			}

			if( h !== indexh || v !== indexv || f !== undefined ) {
				slide( h, v, f );
			}
		}

	}

	/**
	 * Updates the page URL (hash) to reflect the current
	 * state.
	 *
	 * @param {number} delay The time in ms to wait before
	 * writing the hash
	 */
	function writeURL( delay ) {

		// Make sure there's never more than one timeout running
		clearTimeout( writeURLTimeout );

		// If a delay is specified, timeout this call
		if( typeof delay === 'number' ) {
			writeURLTimeout = setTimeout( writeURL, delay );
		}
		else if( currentSlide ) {
			// If we're configured to push to history OR the history
			// API is not avaialble.
			if( config.history || !window.history ) {
				window.location.hash = locationHash();
			}
			// If we're configured to reflect the current slide in the
			// URL without pushing to history.
			else if( config.hash ) {
				window.history.replaceState( null, null, '#' + locationHash() );
			}
			// If history and hash are both disabled, a hash may still
			// be added to the URL by clicking on a href with a hash
			// target. Counter this by always removing the hash.
			else {
				window.history.replaceState( null, null, window.location.pathname + window.location.search );
			}
		}

	}
	/**
	 * Retrieves the h/v location and fragment of the current,
	 * or specified, slide.
	 *
	 * @param {HTMLElement} [slide] If specified, the returned
	 * index will be for this slide rather than the currently
	 * active one
	 *
	 * @return {{h: number, v: number, f: number}}
	 */
	function getIndices( slide ) {

		// By default, return the current indices
		let h = indexh,
			v = indexv,
			f;

		// If a slide is specified, return the indices of that slide
		if( slide ) {
			let isVertical = isVerticalSlide( slide );
			let slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			let horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

			// Now that we know which the horizontal slide is, get its index
			h = Math.max( horizontalSlides.indexOf( slideh ), 0 );

			// Assume we're not vertical
			v = undefined;

			// If this is a vertical slide, grab the vertical index
			if( isVertical ) {
				v = Math.max( toArray( slide.parentNode.querySelectorAll( 'section' ) ).indexOf( slide ), 0 );
			}
		}

		if( !slide && currentSlide ) {
			let hasFragments = currentSlide.querySelectorAll( '.fragment' ).length > 0;
			if( hasFragments ) {
				let currentFragment = currentSlide.querySelector( '.current-fragment' );
				if( currentFragment && currentFragment.hasAttribute( 'data-fragment-index' ) ) {
					f = parseInt( currentFragment.getAttribute( 'data-fragment-index' ), 10 );
				}
				else {
					f = currentSlide.querySelectorAll( '.fragment.visible' ).length - 1;
				}
			}
		}

		return { h, v, f };

	}

	/**
	 * Retrieves all slides in this presentation.
	 */
	function getSlides() {

		return toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ':not(.stack):not([data-visibility="uncounted"])' ) );

	}

	/**
	 * Returns a list of all horizontal slides in the deck. Each
	 * vertical stack is included as one horizontal slide in the
	 * resulting array.
	 */
	function getHorizontalSlides() {

		return toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

	}

	/**
	 * Returns all vertical slides that exist within this deck.
	 */
	function getVerticalSlides() {

		return toArray( dom.wrapper.querySelectorAll( '.slides>section>section' ) );

	}

	/**
	 * Returns all vertical stacks (each stack can contain multiple slides).
	 */
	function getVerticalStacks() {

		return toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.stack') );

	}

	/**
	 * Returns true if there are at least two horizontal slides.
	 */
	function hasHorizontalSlides() {

		return getHorizontalSlides().length > 1;
	}

	/**
	 * Returns true if there are at least two vertical slides.
	 */
	function hasVerticalSlides() {

		return getVerticalSlides().length > 1;

	}

	/**
	 * Returns an array of objects where each object represents the
	 * attributes on its respective slide.
	 */
	function getSlidesAttributes() {

		return getSlides().map( function( slide ) {

			let attributes = {};
			for( let i = 0; i < slide.attributes.length; i++ ) {
				let attribute = slide.attributes[ i ];
				attributes[ attribute.name ] = attribute.value;
			}
			return attributes;

		} );

	}

	/**
	 * Retrieves the total number of slides in this presentation.
	 *
	 * @return {number}
	 */
	function getTotalSlides() {

		return getSlides().length;

	}

	/**
	 * Returns the slide element matching the specified index.
	 *
	 * @return {HTMLElement}
	 */
	function getSlide( x, y ) {

		let horizontalSlide = getHorizontalSlides()[ x ];
		let verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll( 'section' );

		if( verticalSlides && verticalSlides.length && typeof y === 'number' ) {
			return verticalSlides ? verticalSlides[ y ] : undefined;
		}

		return horizontalSlide;

	}

	/**
	 * Returns the background element for the given slide.
	 * All slides, even the ones with no background properties
	 * defined, have a background element so as long as the
	 * index is valid an element will be returned.
	 *
	 * @param {mixed} x Horizontal background index OR a slide
	 * HTML element
	 * @param {number} y Vertical background index
	 * @return {(HTMLElement[]|*)}
	 */
	function getSlideBackground( x, y ) {

		let slide = typeof x === 'number' ? getSlide( x, y ) : x;
		if( slide ) {
			return slide.slideBackgroundElement;
		}

		return undefined;

	}

	/**
	 * Retrieves the speaker notes from a slide. Notes can be
	 * defined in two ways:
	 * 1. As a data-notes attribute on the slide <section>
	 * 2. As an <aside class="notes"> inside of the slide
	 *
	 * @param {HTMLElement} [slide=currentSlide]
	 * @return {(string|null)}
	 */
	function getSlideNotes( slide = currentSlide ) {

		// Notes can be specified via the data-notes attribute...
		if( slide.hasAttribute( 'data-notes' ) ) {
			return slide.getAttribute( 'data-notes' );
		}

		// ... or using an <aside class="notes"> element
		let notesElement = slide.querySelector( 'aside.notes' );
		if( notesElement ) {
			return notesElement.innerHTML;
		}

		return null;

	}

	/**
	 * Retrieves the current state of the presentation as
	 * an object. This state can then be restored at any
	 * time.
	 *
	 * @return {{indexh: number, indexv: number, indexf: number, paused: boolean, overview: boolean}}
	 */
	function getState() {

		let indices = getIndices();

		return {
			indexh: indices.h,
			indexv: indices.v,
			indexf: indices.f,
			paused: isPaused(),
			overview: isOverview()
		};

	}

	/**
	 * Restores the presentation to the given state.
	 *
	 * @param {object} state As generated by getState()
	 * @see {@link getState} generates the parameter `state`
	 */
	function setState( state ) {

		if( typeof state === 'object' ) {
			slide( deserialize( state.indexh ), deserialize( state.indexv ), deserialize( state.indexf ) );

			var pausedFlag = deserialize( state.paused ),
				overviewFlag = deserialize( state.overview );

			if( typeof pausedFlag === 'boolean' && pausedFlag !== isPaused() ) {
				togglePause( pausedFlag );
			}

			if( typeof overviewFlag === 'boolean' && overviewFlag !== isOverview() ) {
				toggleOverview( overviewFlag );
			}
		}

	}

	/**
	 * Return a sorted fragments list, ordered by an increasing
	 * "data-fragment-index" attribute.
	 *
	 * Fragments will be revealed in the order that they are returned by
	 * this function, so you can use the index attributes to control the
	 * order of fragment appearance.
	 *
	 * To maintain a sensible default fragment order, fragments are presumed
	 * to be passed in document order. This function adds a "fragment-index"
	 * attribute to each node if such an attribute is not already present,
	 * and sets that attribute to an integer value which is the position of
	 * the fragment within the fragments list.
	 *
	 * @param {object[]|*} fragments
	 * @param {boolean} grouped If true the returned array will contain
	 * nested arrays for all fragments with the same index
	 * @return {object[]} sorted Sorted array of fragments
	 */
	function sortFragments( fragments, grouped = false ) {

		fragments = toArray( fragments );

		let ordered = [],
			unordered = [],
			sorted = [];

		// Group ordered and unordered elements
		fragments.forEach( fragment => {
			if( fragment.hasAttribute( 'data-fragment-index' ) ) {
				let index = parseInt( fragment.getAttribute( 'data-fragment-index' ), 10 );

				if( !ordered[index] ) {
					ordered[index] = [];
				}

				ordered[index].push( fragment );
			}
			else {
				unordered.push( [ fragment ] );
			}
		} );

		// Append fragments without explicit indices in their
		// DOM order
		ordered = ordered.concat( unordered );

		// Manually count the index up per group to ensure there
		// are no gaps
		let index = 0;

		// Push all fragments in their sorted order to an array,
		// this flattens the groups
		ordered.forEach( group => {
			group.forEach( fragment => {
				sorted.push( fragment );
				fragment.setAttribute( 'data-fragment-index', index );
			} );

			index ++;
		} );

		return grouped === true ? ordered : sorted;

	}

	/**
	 * Refreshes the fragments on the current slide so that they
	 * have the appropriate classes (.visible + .current-fragment).
	 *
	 * @param {number} [index] The index of the current fragment
	 * @param {array} [fragments] Array containing all fragments
	 * in the current slide
	 *
	 * @return {{shown: array, hidden: array}}
	 */
	function updateFragments( index, fragments ) {

		let changedFragments = {
			shown: [],
			hidden: []
		};

		if( currentSlide && config.fragments ) {

			fragments = fragments || sortFragments( currentSlide.querySelectorAll( '.fragment' ) );

			if( fragments.length ) {

				let maxIndex = 0;

				if( typeof index !== 'number' ) {
					let currentFragment = sortFragments( currentSlide.querySelectorAll( '.fragment.visible' ) ).pop();
					if( currentFragment ) {
						index = parseInt( currentFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
				}

				toArray( fragments ).forEach( ( el, i ) => {

					if( el.hasAttribute( 'data-fragment-index' ) ) {
						i = parseInt( el.getAttribute( 'data-fragment-index' ), 10 );
					}

					maxIndex = Math.max( maxIndex, i );

					// Visible fragments
					if( i <= index ) {
						if( !el.classList.contains( 'visible' ) ) changedFragments.shown.push( el );
						el.classList.add( 'visible' );
						el.classList.remove( 'current-fragment' );

						// Announce the fragments one by one to the Screen Reader
						dom.statusDiv.textContent = getStatusText( el );

						if( i === index ) {
							el.classList.add( 'current-fragment' );
							startEmbeddedContent( el );
						}
					}
					// Hidden fragments
					else {
						if( el.classList.contains( 'visible' ) ) changedFragments.hidden.push( el );
						el.classList.remove( 'visible' );
						el.classList.remove( 'current-fragment' );
					}

				} );

				// Write the current fragment index to the slide <section>.
				// This can be used by end users to apply styles based on
				// the current fragment index.
				index = typeof index === 'number' ? index : -1;
				index = Math.max( Math.min( index, maxIndex ), -1 );
				currentSlide.setAttribute( 'data-fragment', index );

			}

		}

		return changedFragments;

	}

	/**
	 * Navigate to the specified slide fragment.
	 *
	 * @param {?number} index The index of the fragment that
	 * should be shown, -1 means all are invisible
	 * @param {number} offset Integer offset to apply to the
	 * fragment index
	 *
	 * @return {boolean} true if a change was made in any
	 * fragments visibility as part of this call
	 */
	function navigateFragment( index, offset = 0 ) {

		if( currentSlide && config.fragments ) {

			let fragments = sortFragments( currentSlide.querySelectorAll( '.fragment' ) );
			if( fragments.length ) {

				// If no index is specified, find the current
				if( typeof index !== 'number' ) {
					let lastVisibleFragment = sortFragments( currentSlide.querySelectorAll( '.fragment.visible' ) ).pop();

					if( lastVisibleFragment ) {
						index = parseInt( lastVisibleFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
					else {
						index = -1;
					}
				}

				// Apply the offset if there is one
				index += offset;

				let changedFragments = updateFragments( index, fragments );

				if( changedFragments.hidden.length ) {
					dispatchEvent( 'fragmenthidden', { fragment: changedFragments.hidden[0], fragments: changedFragments.hidden } );
				}

				if( changedFragments.shown.length ) {
					dispatchEvent( 'fragmentshown', { fragment: changedFragments.shown[0], fragments: changedFragments.shown } );
				}

				updateControls();
				updateProgress();

				if( config.fragmentInURL ) {
					writeURL();
				}

				return !!( changedFragments.shown.length || changedFragments.hidden.length );

			}

		}

		return false;

	}

	/**
	 * Navigate to the next slide fragment.
	 *
	 * @return {boolean} true if there was a next fragment,
	 * false otherwise
	 */
	function nextFragment() {

		return navigateFragment( null, 1 );

	}

	/**
	 * Navigate to the previous slide fragment.
	 *
	 * @return {boolean} true if there was a previous fragment,
	 * false otherwise
	 */
	function prevFragment() {

		return navigateFragment( null, -1 );

	}

	/**
	 * Cues a new automated slide if enabled in the config.
	 */
	function cueAutoSlide() {

		cancelAutoSlide();

		if( currentSlide && config.autoSlide !== false ) {

			let fragment = currentSlide.querySelector( '.current-fragment' );

			// When the slide first appears there is no "current" fragment so
			// we look for a data-autoslide timing on the first fragment
			if( !fragment ) fragment = currentSlide.querySelector( '.fragment' );

			let fragmentAutoSlide = fragment ? fragment.getAttribute( 'data-autoslide' ) : null;
			let parentAutoSlide = currentSlide.parentNode ? currentSlide.parentNode.getAttribute( 'data-autoslide' ) : null;
			let slideAutoSlide = currentSlide.getAttribute( 'data-autoslide' );

			// Pick value in the following priority order:
			// 1. Current fragment's data-autoslide
			// 2. Current slide's data-autoslide
			// 3. Parent slide's data-autoslide
			// 4. Global autoSlide setting
			if( fragmentAutoSlide ) {
				autoSlide = parseInt( fragmentAutoSlide, 10 );
			}
			else if( slideAutoSlide ) {
				autoSlide = parseInt( slideAutoSlide, 10 );
			}
			else if( parentAutoSlide ) {
				autoSlide = parseInt( parentAutoSlide, 10 );
			}
			else {
				autoSlide = config.autoSlide;
			}

			// If there are media elements with data-autoplay,
			// automatically set the autoSlide duration to the
			// length of that media. Not applicable if the slide
			// is divided up into fragments.
			// playbackRate is accounted for in the duration.
			if( currentSlide.querySelectorAll( '.fragment' ).length === 0 ) {
				toArray( currentSlide.querySelectorAll( 'video, audio' ) ).forEach( el => {
					if( el.hasAttribute( 'data-autoplay' ) ) {
						if( autoSlide && (el.duration * 1000 / el.playbackRate ) > autoSlide ) {
							autoSlide = ( el.duration * 1000 / el.playbackRate ) + 1000;
						}
					}
				} );
			}

			// Cue the next auto-slide if:
			// - There is an autoSlide value
			// - Auto-sliding isn't paused by the user
			// - The presentation isn't paused
			// - The overview isn't active
			// - The presentation isn't over
			if( autoSlide && !autoSlidePaused && !isPaused() && !isOverview() && ( !Reveal.isLastSlide() || availableFragments().next || config.loop === true ) ) {
				autoSlideTimeout = setTimeout( () => {
					if( typeof config.autoSlideMethod === 'function' ) {
						config.autoSlideMethod()
					}
					else {
						navigateNext();
					}
					cueAutoSlide();
				}, autoSlide );
				autoSlideStartTime = Date.now();
			}

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( autoSlideTimeout !== -1 );
			}

		}

	}

	/**
	 * Cancels any ongoing request to auto-slide.
	 */
	function cancelAutoSlide() {

		clearTimeout( autoSlideTimeout );
		autoSlideTimeout = -1;

	}

	function pauseAutoSlide() {

		if( autoSlide && !autoSlidePaused ) {
			autoSlidePaused = true;
			dispatchEvent( 'autoslidepaused' );
			clearTimeout( autoSlideTimeout );

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( false );
			}
		}

	}

	function resumeAutoSlide() {

		if( autoSlide && autoSlidePaused ) {
			autoSlidePaused = false;
			dispatchEvent( 'autoslideresumed' );
			cueAutoSlide();
		}

	}

	function navigateLeft() {

		hasNavigatedHorizontally = true;

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || nextFragment() === false ) && availableRoutes().left ) {
				slide( indexh + 1, config.navigationMode === 'grid' ? indexv : undefined );
			}
		}
		// Normal navigation
		else if( ( isOverview() || prevFragment() === false ) && availableRoutes().left ) {
			slide( indexh - 1, config.navigationMode === 'grid' ? indexv : undefined );
		}

	}

	function navigateRight() {

		hasNavigatedHorizontally = true;

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || prevFragment() === false ) && availableRoutes().right ) {
				slide( indexh - 1, config.navigationMode === 'grid' ? indexv : undefined );
			}
		}
		// Normal navigation
		else if( ( isOverview() || nextFragment() === false ) && availableRoutes().right ) {
			slide( indexh + 1, config.navigationMode === 'grid' ? indexv : undefined );
		}

	}

	function navigateUp() {

		// Prioritize hiding fragments
		if( ( isOverview() || prevFragment() === false ) && availableRoutes().up ) {
			slide( indexh, indexv - 1 );
		}

	}

	function navigateDown() {

		hasNavigatedVertically = true;

		// Prioritize revealing fragments
		if( ( isOverview() || nextFragment() === false ) && availableRoutes().down ) {
			slide( indexh, indexv + 1 );
		}

	}

	/**
	 * Navigates backwards, prioritized in the following order:
	 * 1) Previous fragment
	 * 2) Previous vertical slide
	 * 3) Previous horizontal slide
	 */
	function navigatePrev() {

		// Prioritize revealing fragments
		if( prevFragment() === false ) {
			if( availableRoutes().up ) {
				navigateUp();
			}
			else {
				// Fetch the previous horizontal slide, if there is one
				let previousSlide;

				if( config.rtl ) {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.future' ) ).pop();
				}
				else {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.past' ) ).pop();
				}

				if( previousSlide ) {
					let v = ( previousSlide.querySelectorAll( 'section' ).length - 1 ) || undefined;
					let h = indexh - 1;
					slide( h, v );
				}
			}
		}

	}

	/**
	 * The reverse of #navigatePrev().
	 */
	function navigateNext() {

		hasNavigatedHorizontally = true;
		hasNavigatedVertically = true;

		// Prioritize revealing fragments
		if( nextFragment() === false ) {

			let routes = availableRoutes();

			// When looping is enabled `routes.down` is always available
			// so we need a separate check for when we've reached the
			// end of a stack and should move horizontally
			if( routes.down && routes.right && config.loop && Reveal.isLastVerticalSlide( currentSlide ) ) {
				routes.down = false;
			}

			if( routes.down ) {
				navigateDown();
			}
			else if( config.rtl ) {
				navigateLeft();
			}
			else {
				navigateRight();
			}
		}

	}

	/**
	 * Checks if the target element prevents the triggering of
	 * swipe navigation.
	 */
	function isSwipePrevented( target ) {

		while( target && typeof target.hasAttribute === 'function' ) {
			if( target.hasAttribute( 'data-prevent-swipe' ) ) return true;
			target = target.parentNode;
		}

		return false;

	}


	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//

	/**
	 * Called by all event handlers that are based on user
	 * input.
	 *
	 * @param {object} [event]
	 */
	function onUserInput( event ) {

		if( config.autoSlideStoppable ) {
			pauseAutoSlide();
		}

	}

	/**
	 * Called whenever there is mouse input at the document level
	 * to determine if the cursor is active or not.
	 *
	 * @param {object} event
	 */
	function onDocumentCursorActive( event ) {

		showCursor();

		clearTimeout( cursorInactiveTimeout );

		cursorInactiveTimeout = setTimeout( hideCursor, config.hideCursorTime );

	}

	/**
	 * Handler for the document level 'keypress' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyPress( event ) {

		// Check if the pressed key is question mark
		if( event.shiftKey && event.charCode === 63 ) {
			toggleHelp();
		}

	}

	/**
	 * Handler for the document level 'keydown' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyDown( event ) {

		// If there's a condition specified and it returns false,
		// ignore this event
		if( typeof config.keyboardCondition === 'function' && config.keyboardCondition(event) === false ) {
			return true;
		}

		// Shorthand
		let keyCode = event.keyCode;

		// Remember if auto-sliding was paused so we can toggle it
		let autoSlideWasPaused = autoSlidePaused;

		onUserInput( event );

		// Is there a focused element that could be using the keyboard?
		let activeElementIsCE = document.activeElement && document.activeElement.contentEditable !== 'inherit';
		let activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test( document.activeElement.tagName );
		let activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test( document.activeElement.className);

		// Whitelist specific modified + keycode combinations
		let prevSlideShortcut = event.shiftKey && event.keyCode === 32;
		let firstSlideShortcut = event.shiftKey && keyCode === 37;
		let lastSlideShortcut = event.shiftKey && keyCode === 39;

		// Prevent all other events when a modifier is pressed
		let unusedModifier = 	!prevSlideShortcut && !firstSlideShortcut && !lastSlideShortcut &&
								( event.shiftKey || event.altKey || event.ctrlKey || event.metaKey );

		// Disregard the event if there's a focused element or a
		// keyboard modifier key is present
		if( activeElementIsCE || activeElementIsInput || activeElementIsNotes || unusedModifier ) return;

		// While paused only allow resume keyboard events; 'b', 'v', '.'
		let resumeKeyCodes = [66,86,190,191];
		let key;

		// Custom key bindings for togglePause should be able to resume
		if( typeof config.keyboard === 'object' ) {
			for( key in config.keyboard ) {
				if( config.keyboard[key] === 'togglePause' ) {
					resumeKeyCodes.push( parseInt( key, 10 ) );
				}
			}
		}

		if( isPaused() && resumeKeyCodes.indexOf( keyCode ) === -1 ) {
			return false;
		}

		// Use linear navigation if we're configured to OR if
		// the presentation is one-dimensional
		let useLinearMode = config.navigationMode === 'linear' || !hasHorizontalSlides() || !hasVerticalSlides();

		let triggered = false;

		// 1. User defined key bindings
		if( typeof config.keyboard === 'object' ) {

			for( key in config.keyboard ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === keyCode ) {

					var value = config.keyboard[ key ];

					// Callback function
					if( typeof value === 'function' ) {
						value.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof value === 'string' && typeof Reveal[ value ] === 'function' ) {
						Reveal[ value ].call();
					}

					triggered = true;

				}

			}

		}

		// 2. Registered custom key bindings
		if( triggered === false ) {

			for( key in registeredKeyBindings ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === keyCode ) {

					let action = registeredKeyBindings[ key ].callback;

					// Callback function
					if( typeof action === 'function' ) {
						action.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof action === 'string' && typeof Reveal[ action ] === 'function' ) {
						Reveal[ action ].call();
					}

					triggered = true;
				}
			}
		}

		// 3. System defined key bindings
		if( triggered === false ) {

			// Assume true and try to prove false
			triggered = true;

			// P, PAGE UP
			if( keyCode === 80 || keyCode === 33 ) {
				navigatePrev();
			}
			// N, PAGE DOWN
			else if( keyCode === 78 || keyCode === 34 ) {
				navigateNext();
			}
			// H, LEFT
			else if( keyCode === 72 || keyCode === 37 ) {
				if( firstSlideShortcut ) {
					slide( 0 );
				}
				else if( !isOverview() && useLinearMode ) {
					navigatePrev();
				}
				else {
					navigateLeft();
				}
			}
			// L, RIGHT
			else if( keyCode === 76 || keyCode === 39 ) {
				if( lastSlideShortcut ) {
					slide( Number.MAX_VALUE );
				}
				else if( !isOverview() && useLinearMode ) {
					navigateNext();
				}
				else {
					navigateRight();
				}
			}
			// K, UP
			else if( keyCode === 75 || keyCode === 38 ) {
				if( !isOverview() && useLinearMode ) {
					navigatePrev();
				}
				else {
					navigateUp();
				}
			}
			// J, DOWN
			else if( keyCode === 74 || keyCode === 40 ) {
				if( !isOverview() && useLinearMode ) {
					navigateNext();
				}
				else {
					navigateDown();
				}
			}
			// HOME
			else if( keyCode === 36 ) {
				slide( 0 );
			}
			// END
			else if( keyCode === 35 ) {
				slide( Number.MAX_VALUE );
			}
			// SPACE
			else if( keyCode === 32 ) {
				if( isOverview() ) {
					deactivateOverview();
				}
				if( event.shiftKey ) {
					navigatePrev();
				}
				else {
					navigateNext();
				}
			}
			// TWO-SPOT, SEMICOLON, B, V, PERIOD, LOGITECH PRESENTER TOOLS "BLACK SCREEN" BUTTON
			else if( keyCode === 58 || keyCode === 59 || keyCode === 66 || keyCode === 86 || keyCode === 190 || keyCode === 191 ) {
				togglePause();
			}
			// F
			else if( keyCode === 70 ) {
				enterFullscreen();
			}
			// A
			else if( keyCode === 65 ) {
				if ( config.autoSlideStoppable ) {
					toggleAutoSlide( autoSlideWasPaused );
				}
			}
			else {
				triggered = false;
			}

		}

		// If the input resulted in a triggered action we should prevent
		// the browsers default behavior
		if( triggered ) {
			event.preventDefault && event.preventDefault();
		}
		// ESC or O key
		else if( keyCode === 27 || keyCode === 79 ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				toggleOverview();
			}

			event.preventDefault && event.preventDefault();
		}

		// If auto-sliding is enabled we need to cue up
		// another timeout
		cueAutoSlide();

	}

	/**
	 * Handler for the 'touchstart' event, enables support for
	 * swipe and pinch gestures.
	 *
	 * @param {object} event
	 */
	function onTouchStart( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

	}

	/**
	 * Handler for the 'touchmove' event.
	 *
	 * @param {object} event
	 */
	function onTouchMove( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		// Each touch should only trigger one action
		if( !touch.captured ) {
			onUserInput( event );

			let currentX = event.touches[0].clientX;
			let currentY = event.touches[0].clientY;

			// There was only one touch point, look for a swipe
			if( event.touches.length === 1 && touch.startCount !== 2 ) {

				let deltaX = currentX - touch.startX,
					deltaY = currentY - touch.startY;

				if( deltaX > touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						if( config.rtl ) {
							navigateNext();
						}
						else {
							navigatePrev();
						}
					}
					else {
						navigateLeft();
					}
				}
				else if( deltaX < -touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						if( config.rtl ) {
							navigatePrev();
						}
						else {
							navigateNext();
						}
					}
					else {
						navigateRight();
					}
				}
				else if( deltaY > touch.threshold ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						navigatePrev();
					}
					else {
						navigateUp();
					}
				}
				else if( deltaY < -touch.threshold ) {
					touch.captured = true;
					if( config.navigationMode === 'linear' ) {
						navigateNext();
					}
					else {
						navigateDown();
					}
				}

				// If we're embedded, only block touch events if they have
				// triggered an action
				if( config.embedded ) {
					if( touch.captured || isVerticalSlide( currentSlide ) ) {
						event.preventDefault();
					}
				}
				// Not embedded? Block them all to avoid needless tossing
				// around of the viewport in iOS
				else {
					event.preventDefault();
				}

			}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if( UA.match( /android/gi ) ) {
			event.preventDefault();
		}

	}

	/**
	 * Handler for the 'touchend' event.
	 *
	 * @param {object} event
	 */
	function onTouchEnd( event ) {

		touch.captured = false;

	}

	/**
	 * Convert pointer down to touch start.
	 *
	 * @param {object} event
	 */
	function onPointerDown( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" ) {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchStart( event );
		}

	}

	/**
	 * Convert pointer move to touch move.
	 *
	 * @param {object} event
	 */
	function onPointerMove( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchMove( event );
		}

	}

	/**
	 * Convert pointer up to touch end.
	 *
	 * @param {object} event
	 */
	function onPointerUp( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchEnd( event );
		}

	}

	/**
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
	 *
	 * @param {object} event
	 */
	function onDocumentMouseScroll( event ) {

		if( Date.now() - lastMouseWheelStep > 600 ) {

			lastMouseWheelStep = Date.now();

			let delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				navigateNext();
			}
			else if( delta < 0 ) {
				navigatePrev();
			}

		}

	}

	/**
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 *
	 * @param {object} event
	 */
	function onProgressClicked( event ) {

		onUserInput( event );

		event.preventDefault();

		let slidesTotal = getHorizontalSlides().length;
		let slideIndex = Math.floor( ( event.clientX / dom.wrapper.offsetWidth ) * slidesTotal );

		if( config.rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		slide( slideIndex );

	}

	/**
	 * Event handler for navigation control buttons.
	 */
	function onNavigateLeftClicked( event ) { event.preventDefault(); onUserInput(); config.navigationMode === 'linear' ? navigatePrev() : navigateLeft(); }
	function onNavigateRightClicked( event ) { event.preventDefault(); onUserInput(); config.navigationMode === 'linear' ? navigateNext() : navigateRight(); }
	function onNavigateUpClicked( event ) { event.preventDefault(); onUserInput(); navigateUp(); }
	function onNavigateDownClicked( event ) { event.preventDefault(); onUserInput(); navigateDown(); }
	function onNavigatePrevClicked( event ) { event.preventDefault(); onUserInput(); navigatePrev(); }
	function onNavigateNextClicked( event ) { event.preventDefault(); onUserInput(); navigateNext(); }

	/**
	 * Handler for the window level 'hashchange' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowHashChange( event ) {

		readURL();

	}

	/**
	 * Handler for the window level 'resize' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowResize( event ) {

		layout();

	}

	/**
	 * Handle for the window level 'visibilitychange' event.
	 *
	 * @param {object} [event]
	 */
	function onPageVisibilityChange( event ) {

		// If, after clicking a link or similar and we're coming back,
		// focus the document.body to ensure we can use keyboard shortcuts
		if( document.hidden === false && document.activeElement !== document.body ) {
			// Not all elements support .blur() - SVGs among them.
			if( typeof document.activeElement.blur === 'function' ) {
				document.activeElement.blur();
			}
			document.body.focus();
		}

	}

	/**
	 * Invoked when a slide is and we're in the overview.
	 *
	 * @param {object} event
	 */
	function onOverviewSlideClicked( event ) {

		// TODO There's a bug here where the event listeners are not
		// removed after deactivating the overview.
		if( eventsAreBound && isOverview() ) {
			event.preventDefault();

			let element = event.target;

			while( element && !element.nodeName.match( /section/gi ) ) {
				element = element.parentNode;
			}

			if( element && !element.classList.contains( 'disabled' ) ) {

				deactivateOverview();

				if( element.nodeName.match( /section/gi ) ) {
					var h = parseInt( element.getAttribute( 'data-index-h' ), 10 ),
						v = parseInt( element.getAttribute( 'data-index-v' ), 10 );

					slide( h, v );
				}

			}
		}

	}

	/**
	 * Handles clicks on links that are set to preview in the
	 * iframe overlay.
	 *
	 * @param {object} event
	 */
	function onPreviewLinkClicked( event ) {

		if( event.currentTarget && event.currentTarget.hasAttribute( 'href' ) ) {
			let url = event.currentTarget.getAttribute( 'href' );
			if( url ) {
				showPreview( url );
				event.preventDefault();
			}
		}

	}

	/**
	 * Handles click on the auto-sliding controls element.
	 *
	 * @param {object} [event]
	 */
	function onAutoSlidePlayerClick( event ) {

		// Replay
		if( Reveal.isLastSlide() && config.loop === false ) {
			slide( 0, 0 );
			resumeAutoSlide();
		}
		// Resume
		else if( autoSlidePaused ) {
			resumeAutoSlide();
		}
		// Pause
		else {
			pauseAutoSlide();
		}

	}


	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	Reveal = {
		VERSION: VERSION,

		initialize,
		configure,

		sync,
		syncSlide,
		syncFragments,

		// Navigation methods
		slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Fragment methods
		navigateFragment,
		prevFragment,
		nextFragment,

		// Forces an update in slide layout
		layout,

		// Randomizes the order of slides
		shuffle,

		// Returns an object with the available routes as booleans (left/right/top/bottom)
		availableRoutes,

		// Returns an object with the available fragments as booleans (prev/next)
		availableFragments,

		// Toggles a help overlay with keyboard shortcuts
		toggleHelp,

		// Toggles the overview mode on/off
		toggleOverview,

		// Toggles the "black screen" mode on/off
		togglePause,

		// Toggles the auto slide mode on/off
		toggleAutoSlide,

		// State checks
		isOverview,
		isPaused,
		isAutoSliding,
		isSpeakerNotes,

		// Slide preloading
		loadSlide,
		unloadSlide,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners,
		removeEventListeners,

		// Facility for persisting and restoring the presentation state
		getState,
		setState,

		// Presentation progress
		getSlidePastCount,

		// Presentation progress on range of 0-1
		getProgress,

		// Returns the indices of the current, or specified, slide
		getIndices,

		// Returns an Array of all slides
		getSlides,

		// Returns an Array of objects representing the attributes on
		// the slides
		getSlidesAttributes,

		// Returns the total number of slides
		getTotalSlides,

		// Returns the slide element at the specified index
		getSlide,

		// Returns the slide background element at the specified index
		getSlideBackground,

		// Returns the speaker notes string for a slide, or null
		getSlideNotes,

		// Returns an array with all horizontal/vertical slides in the deck
		getHorizontalSlides,
		getVerticalSlides,

		// Checks if the presentation contains two or more
		// horizontal/vertical slides
		hasHorizontalSlides,
		hasVerticalSlides,

		// Adds/removes a custom key binding
		addKeyBinding,
		removeKeyBinding,

		// API for registering and retrieving plugins
		registerPlugin,
		hasPlugin,
		getPlugin,

		getComputedSlideSize,

		// Returns the previous slide element, may be null
		getPreviousSlide: () => {
			return previousSlide;
		},

		// Returns the current slide element
		getCurrentSlide: () => {
			return currentSlide;
		},

		// Returns the current scale of the presentation content
		getScale: () => {
			return scale;
		},

		// Returns the current configuration object
		getConfig: () => {
			return config;
		},

		// Helper method, retrieves query string as a key/value hash
		getQueryHash: () => {
			let query = {};

			location.search.replace( /[A-Z0-9]+?=([\w\.%-]*)/gi, a => {
				query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
			} );

			// Basic deserialization
			for( let i in query ) {
				let value = query[ i ];

				query[ i ] = deserialize( unescape( value ) );
			}

			return query;
		},

		// Returns the top-level DOM element
		getRevealElement: () => {
			return dom.wrapper || document.querySelector( '.reveal' );
		},

		// Returns a hash with all registered plugins
		getPlugins: () => {
			return plugins;
		},

		// Returns true if we're currently on the first slide
		isFirstSlide: () => {
			return indexh === 0 && indexv === 0;
		},

		// Returns true if we're currently on the last slide
		isLastSlide: () => {
			if( currentSlide ) {
				// Does this slide have a next sibling?
				if( currentSlide.nextElementSibling ) return false;

				// If it's vertical, does its parent have a next sibling?
				if( isVerticalSlide( currentSlide ) && currentSlide.parentNode.nextElementSibling ) return false;

				return true;
			}

			return false;
		},

		// Returns true if we're on the last slide in the current
		// vertical stack
		isLastVerticalSlide: () => {
			if( currentSlide && isVerticalSlide( currentSlide ) ) {
				// Does this slide have a next sibling?
				if( currentSlide.nextElementSibling ) return false;

				return true;
			}

			return false;
		},

		// Checks if reveal.js has been loaded and is ready for use
		isReady: () => {
			return loaded;
		},

		// Forward event binding to the reveal DOM element
		addEventListener: ( type, listener, useCapture ) => {
			if( 'addEventListener' in window ) {
				Reveal.getRevealElement().addEventListener( type, listener, useCapture );
			}
		},
		removeEventListener: ( type, listener, useCapture ) => {
			if( 'addEventListener' in window ) {
				Reveal.getRevealElement().removeEventListener( type, listener, useCapture );
			}
		},

		// Programmatically triggers a keyboard event
		triggerKey: keyCode => {
			onDocumentKeyDown( { keyCode } );
		},

		// Registers a new shortcut to include in the help overlay
		registerKeyboardShortcut: ( key, value ) => {
			keyboardShortcuts[key] = value;
		}
	};

	return Reveal;

};