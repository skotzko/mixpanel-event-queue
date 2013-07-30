mixpanel-event-queue (MEQ)
====================
Contributors: [skotzko](https://github.com/skotzko)

Version: 0.1.0

Tags: mixpanel, analytics, events, queue, javascript

Mixpanel Event Queue (MEQ) is a native JavaScript wrapper for the [Mixpanel JS API](https://mixpanel.com/docs/integration-libraries/javascript-full-api) that adds support for event queueing.

## Description
Provides an event-queueing wrapper for the Mixpanel JS API to ensure tracking calls are safe regardless of when they happen in relation to page / external JS library loading.

### Why use this?
The minified Mixpanel library is ~25.5kb gzipped and can take up to a few seconds after browser `startFetch` to be fully loaded and available for handling event / tracking calls. 

Many analytics services (e.g. Google Analytics, KISSmetrics) stub out an array which acts as a queue while the tracking library is loaded. The Mixpanel JS API does not natively provide this functionality, and I wanted it to ensure that my tracking calls would not (a) lose data and (b) throw JS errors if the library was not yet loaded.

This wrapper aims to extend the Mixpanel JS library with this functionality.

## Overview
If one doesn't already exist, MEQ creates an event queue and pushes events into this queue if the Mixpanel API is not yet fully loaded. 

Mixpanel provides a callback hook when the library is laoded, which you need to set up to call `_meq.flush()`. This will flush the event queue to the underlying Mixpanel library in same order the events came into the queue.

After the Mixpanel library is loaded, any calls into MEQ will bypass the queue flow straight into Mixpanel's own API.

## Installation
1. Clone this repo
2. Get Mixpanel up and running, [per their docs](https://mixpanel.com/docs/getting-started/step-by-step-integration-tutorial)
3. Load MEQ into the head of your template: `<script type="text/javascript" src="<path_to_MEQ_file.js>"></script>`. You probably want to source MEQ in the head of your template right after sourcing Google Analytics. MEQ is 1.5K unminified.
4. In your [Mixpanel init config](https://mixpanel.com/docs/integration-libraries/javascript-full-api#init), set the `loaded` parameter to call to `_meq.flush()`. While installing, you may want to set `debug: true` so that you can view Mixpanel API request logs in your JS console. **You should still use the native `mixpanel.init()` function to initialize the Mixpanel library.**
5. Update your `mixpanel.*` tracking calls to call to `_meq.mixpanel()` with the appropriate params. 


## Typical usage
MEQ provides two functions: `_meq.mixpanel()` and `_meq.flush()`. The first is the core wrapper of the Mixpanel API. The second is a 

This wraps the Mixpanel library and replaces all calls to `mixpanel.<function name>`.

MEQ supports the full range of API calls that the native Mixpanel library does. This usually means calls `track`, `identify`, and `people` (as well as nested `people` calls i.e. `people.set`, `people.set_once`, `people.append`), but can include `register`, `alias`, etc.

The first parameter passed to `_meq` is the full name of the native Mixpanel function you want to call, i.e. `track`, `people.set_once`, `people.append`. It would be everything after 'mixpanel.' in the native API call.

The second parameter to `_meq` is an array of the arguments you would pass to the native Mixpanel call. This could be `['eventName', {eventProperty1: value1}]` in the case of a `track` call, or would just be `[{property1: value1}]` in a `people` call. 

### Examples
#### `track()` call
`mixpanel.track('event_name', {'property1': 'value1', 'property2': 'value2'})` ==> `_meq.mixpanel('track', ['event_name', {'property1': 'value1', 'property2': 'value2'}])`


#### `people()` calls
`mixpanel.people.set({'likes_ice_cream': true})` ==> `_meq.mixpanel('people.set', [])`
`mixpanel.people.set_once({'user_uuid': 'abcd-1234-abcd-1234-abcd'})` ==> `_meq.mixpanel('people.set_once', [{'user_uuid': 'abcd-1234-abcd-1234-abcd'}])`
`mixpanel.people.increment('purchases')` ==> `_meq.mixpanel('people.increment', ['purchases'])`
`mixpanel.people.increment({'purchases': 5})`==> `_meq.mixpanel('people.increment', [{'purchases': 5}])`
`mixpanel.people.append({'listName': valueToAppend})` ==> `_meq.mixpanel('people.append', [{'listName': valueToAppend}])`


#### `identify()` call
`mixpanel.identify('username@example.com')` ==> `_meq.mixpanel('identify', ['username@example.com'])`


#### `register()` call
`mixpanel.register({prop1: value1, prop2: value2})` ==> `_meq.mixpanel('register', [{prop1: value1, prop2: value2}])`
`mixpanel.register_once({prop1: value1, prop2: value2})` ==> `_meq.mixpanel('register_once', [{prop1: value1, prop2: value2}])`


#### `alias()` call
`mixpanel.alias('new_identitifier')` ==> `_meq.mixpanel('alias', ['new_identifier'])`


## Browser compatibility
This has been tested in production on all major browser and back through IE8. I have not tested it on IE <= 7, but the entire wrapper is written in native JavaScript so it should have fairly good backwards compatibility.

## Changelog
* v0.1.0, 7/30/13 -- Initial release