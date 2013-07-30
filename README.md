mixpanel-event-queue
====================
Contributors: [skotzko](https://github.com/skotzko), [mviamari](https://github.com/mviamari)
Version: 0.1.0
Tags: mixpanel, analytics, events, queue

Mixpanel Event Queue (MEQ) is a native JavaScript wrapper for the [Mixpanel JS API](https://mixpanel.com/docs/integration-libraries/javascript-full-api) that adds support for event queueing.

## Description

Provides an event-queueing wrapper for the Mixpanel JS API to ensure tracking calls are safe regardless of when they happen in relation to page / external JS library loading.

The minified Mixpanel library is ~25.5kb gzipped and can take up to a few seconds after startFetch to be fully loaded and available for handling event / tracking calls. 

Despite the option to wrap Mixpanel tracking calls in dojo.addOnLoad / jQuery .ready(), or to put them in a template block that is parsed after other JavaScript blocks, there are edge cases where calls may happen too soon (or a developer may forget to adequately delay the calls in one piece of a complex codebase). When this occurs, data is lost and JS errors occur.

I was dealing with this exact problem and was frustrated that Mixpanel didn't offer a queueing structure similar to what Google Analytics, KISSmetrics, and other analytics companies provide. As I understand them, the intention of those queuing mechanism is to allow for tracking calls to queue up while the library loads, and then to have the library clean those calls up as if they were synchronous.

This wrapper aims to extend the Mixpanel JS library with 


## Typical usage


## Installation
1. Clone this repo
2. Get Mixpanel up and running, [per their docs](https://mixpanel.com/docs/getting-started/step-by-step-integration-tutorial)
3. Integrate this wrapper into your core JS library, and update function calls to however you namespace the wrapper.


## Changelog
* v0.1.0, 7/30/13 -- Initial release