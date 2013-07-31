mixpanel-event-queue (MEQ)
====================
Contributors: [skotzko](https://github.com/skotzko)

Version: 0.1.2

Tags: mixpanel, analytics, events, queue, javascript

Mixpanel Event Queue (MEQ) is a native JavaScript wrapper for the [Mixpanel JS API](https://mixpanel.com/docs/integration-libraries/javascript-full-api) that adds support for event queuing to aid in optimizing page loads sequences.

## Description
Provides an event-queuing wrapper for the Mixpanel JS API to (a) help optimize page loading sequence and (b) ensure tracking calls are safe regardless of when they happen in relation to page / external JS library loading.

## Who is this for / not for?

**MEQ is for you if:**

* you are using Mixpanel, and
* you are trying to optimize your page load sequences / timing (e.g. site with content/JavaScript heavy pages)

**MEQ is not for you if**:

* you aren't using Mixpanel, or
* you don't have heavy pages, and/or
* you are not trying to optimize your page load sequences / timing


## Why use this?
The minified Mixpanel library is ~25.5K gzipped and can take several seconds after browser `startFetch` to be fully loaded and available for handling event / tracking calls. There is lag and risk of fetch failures with any external resource.

Many analytics services (e.g. Google Analytics, KISSmetrics) stub out an array which acts as a queue while the tracking library loads. Contrary to what I first believed, it turns out that the Mixpanel library *does* support this functionality (sort of), but it is neither documented nor clear when reading their code.

So why do I continue to use this, anyway?

Because the Mixpanel snippet has tightly coupled instantiation / fetching of the library with the queuing function. If at all possible, we do not want any browser resources working on 3rd-party assets (even if they are fetched async) early in the page load, so we prefer to create a queue early on, and then instantiate the 3rd-party library to process said queue and take over normal operations later in the page load sequence.

The MEQ wrapper aims to extend the core Mixpanel JS library with this functionality while keeping the API calls very similar to those of the native library.

## Overview
MEQ creates an event queue (if one does not already exist) and pushes events into this queue while the Mixpanel API is not yet fully loaded. 

Mixpanel provides a callback hook when the library is loaded, which you need to set up to call `_meq.flush()`. This will flush the event queue to the underlying Mixpanel library in same order the events came into the queue.

After the Mixpanel library is loaded, any calls into MEQ will bypass the queue and flow straight into Mixpanel's own API.

## Installation
1. Clone this repo
2. Get Mixpanel up and running, [per their docs](https://mixpanel.com/docs/getting-started/step-by-step-integration-tutorial)
3. Load MEQ into the head of your template: `<script type="text/javascript" src="<path_to_MEQ_file.js>"></script>`. You probably want to source MEQ in the head of your template right after sourcing Google Analytics. MEQ is 1.1K minified (version provided), 1.5K when unminified but gzipped, and 3.3K raw.
4. In your [Mixpanel init config](https://mixpanel.com/docs/integration-libraries/javascript-full-api#init), set the `loaded` parameter to call to `_meq.flush()`. While installing, you may want to set `debug: true` so that you can view Mixpanel API request logs in your JS console. **You should still use the native `mixpanel.init()` function to initialize the Mixpanel library.**
5. Update your `mixpanel.*` tracking calls to call to `_meq.mixpanel()` with the appropriate params. 


## Typical usage
MEQ provides two functions: `_meq.mixpanel()` and `_meq.flush()`. The first is the core wrapper of the Mixpanel API. The second is a function to flush the queue as the callback when the core Mixpanel library finishes loading.

This wraps the Mixpanel library and replaces all calls to `mixpanel.<function name>`.

MEQ supports the full range of API calls that the native Mixpanel library does. This usually means calls `track`, `identify`, and `people` (as well as nested `people` calls i.e. `people.set`, `people.set_once`, `people.append`), but can include `register`, `alias`, etc.

The first parameter passed to `_meq` is the full name of the native Mixpanel function you want to call, i.e. `track`, `people.set_once`, `people.append`. It would be everything after 'mixpanel.' in the native API call.

The second / third parameters to `_meq` are the event name (if using a `track` call) and an optional `properties` object. **These parametrs are passed/formatted exactly as they are when you are calling into the native Mixpanel JS fuctions.**

### Examples
#### `track()` call
`mixpanel.track('event_name', {'property1': 'value1', 'property2': 'value2'})` ==> `_meq.mixpanel('track', 'event_name', {'property1': 'value1', 'property2': 'value2'})`


#### `people()` calls
`mixpanel.people.set({'likes_ice_cream': true})` ==> `_meq.mixpanel('people.set', {'likes_ice_cream': true})`
`mixpanel.people.set_once({'user_uuid': 'abcd-1234-abcd-1234-abcd'})` ==> `_meq.mixpanel('people.set_once', {'user_uuid': 'abcd-1234-abcd-1234-abcd'})`
`mixpanel.people.increment('purchases')` ==> `_meq.mixpanel('people.increment', 'purchases')`
`mixpanel.people.increment({'purchases': 5})`==> `_meq.mixpanel('people.increment', {'purchases': 5})`
`mixpanel.people.append({'listName': valueToAppend})` ==> `_meq.mixpanel('people.append', {'listName': valueToAppend})`


#### `identify()` call
`mixpanel.identify('username@example.com')` ==> `_meq.mixpanel('identify', 'username@example.com'])`


#### `register()` call
`mixpanel.register({prop1: value1, prop2: value2})` ==> `_meq.mixpanel('register', {prop1: value1, prop2: value2})`
`mixpanel.register_once({prop1: value1, prop2: value2})` ==> `_meq.mixpanel('register_once', {prop1: value1, prop2: value2})`


#### `alias()` call
`mixpanel.alias('new_identitifier')` ==> `_meq.mixpanel('alias', 'new_identifier')`


## Browser compatibility
This has been tested in production on Chrome, Safari, Firefox, and IE 8-10.

I have not tested MEQ on IE <= 7, but the entire wrapper is written in native JavaScript so it should have fairly good backwards compatibility.

## Changelog
* v0.1.2, 7/31/13 -- Provide minified version of MEQ.
* v0.1.1, 7/30/13 -- Change `_meq.mixpanel()` to use magic `arguments` array and allow for much cleaner calls into MEQ.
* v0.1.0, 7/30/13 -- Initial release