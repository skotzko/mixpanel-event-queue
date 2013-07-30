/*!
############################
### Mixpanel Event Queue ###
############################
VERSION: 0.1.0
LICENSE: Apache 2.0
DESCRIPTION: Event queuing wrapper for the official Mixpanel JavaScript library. For docs & examples, see README or http://github.com/skotzko/mixpanel-event-queue
WRITTEN BY: Andrew Skotzko (http://github.com/skotzko)

**NOTE**: This wrapper assumes you will be loading the standard Mixpanel JS library into the window.mixpanel namespace.
*/

var _meq = (function(){
    var wrapper = {
        QUEUE_NAME: '_ch_mp_queue',

        mixpanel: function(/* string */ functionName, /* array of args for Mixpanel */ mixpanelArgs) { 
            if (!functionName) {
                console.error('Must provide a function name to call.')
                return;
            }

            if (!mixpanelArgs || (Object.prototype.toString.call(mixpanelArgs) === '[object Array]') !== true) {
                console.error('Must provide an array of args to pass on to Mixpanel, in order desired by their API calls.')
                return;
            }

            if (typeof(window[_meq.QUEUE_NAME]) == 'undefined') {
                window[_meq.QUEUE_NAME] = [];
            }

            var queue = window[_meq.QUEUE_NAME];
            var mixpanel = window.mixpanel;

            // once mixpanel is loaded and has tracking functions available, we hand off to it
            if (mixpanel && mixpanel.__loaded && functionName) {
                // convert event name string into namespacing array
                var funcNamespace = functionName.split('.')

                // loop through funcNamespace to get final tracking function
                // e.g. ['people', 'set'] === mixpanel.people.set
                var trackingFunc = mixpanel;
                var trackingFuncContext = mixpanel;
                var length = funcNamespace.length
                for (var i=0; i<length; i++) {
                    if (i == length - 1) {
                        // context in which the function is executed is the direct parent object
                        // of the final call (i.e. on a call to mixpanel.people.set, "this" == mixpanel.people)
                        trackingFuncContext = trackingFunc;
                    }
                    trackingFunc = trackingFunc[funcNamespace[i]];
                }

                // hand off to Mixpanel
                trackingFunc.apply(trackingFuncContext, mixpanelArgs);

            } else if (queue) {
                // if mixpanel does not exist, queue up events
                queue.push(arguments);
            }
        },

        flush: function() {
            // once mixpanel is loaded, it calls back to here to flush any queued events

            // iterate over queue and flush events to their system
            var queue = window[_meq.QUEUE_NAME];

            // loop over and clean out event queue
            // use .apply so we can invoke w/ args as an array, which is how they're stored
            if (queue && queue.length > 0) {
                for (var i in queue){
                    _meq.mixpanel.apply(window.mixpanel, queue[i]);
                }
            }
            window[_meq.QUEUE_NAME] = [];
        }
    }
    return wrapper;
})();