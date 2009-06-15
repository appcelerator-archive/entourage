//Define "App" namespace, if need be
var App = (typeof App == "undefined")?{}:App;

//Define convenience macros for publish, subscribe, and register
var $MQ = null;
var $MQL = null;
var $MQR = null;
var $MQI = null;

(function() {
	var MQ_INTERVAL = 0; //The current queue scan interval
	var MESSAGE_QUEUE = []; //this array represents the current message queue
	var INTERCEPTORS = []; //this array holds interceptors - first in gets priority, and can cancel others
	var LISTENERS = []; //this array represents the message listeners
	
	//Deliver the messages in the queue - runs on an interval initiated when the plugin is loaded
	function deliver() {
	  var hadMessages = false;
		while (MESSAGE_QUEUE.length > 0) {
		  hadMessages = true;
			var message = MESSAGE_QUEUE.shift();
			//Allow interceptors to filter (or squash) messages
			var send_message = true;
			for(interceptor_index in INTERCEPTORS) {
				var interceptor = INTERCEPTORS[interceptor_index];
				if (message.scope === interceptor.scope) {
					if ((interceptor.type_or_regex.test && interceptor.type_or_regex.test(message.name)) ||
					 	(interceptor.type_or_regex == message.name )) {
						var result = interceptor.callback.call(this, message);
						if (result != null && !result) {
	                        send_message = false;
	                        break;
	                    }
					}
				}
			}
			//If the message was not squashed by an interceptor, let the listeners process it
			if (send_message) {
				for(listener_index in LISTENERS) {
					var listener = LISTENERS[listener_index];
					if (message.scope === listener.scope) {
						if ((listener.type_or_regex.test && listener.type_or_regex.test(message.name)) ||
						 	(listener.type_or_regex == message.name )) {
							listener.callback.call(this, message, listener.element);
						}
					}
				}
			}
		}
		//determine next queue scan time
		if (MQ_INTERVAL == 0) {
		  MQ_INTERVAL = App.mq.config.min_scan_interval;
		}
		else {
		  if (hadMessages) {
		    if (MQ_INTERVAL - App.mq.config.step_size > App.mq.config.min_scan_interval) {
		      MQ_INTERVAL = MQ_INTERVAL - App.mq.config.step_size;
		    }
		    else {
		      MQ_INTERVAL = App.mq.config.min_scan_interval;
		    }
		  }
		  else {
		    if (MQ_INTERVAL + App.mq.config.step_size < App.mq.config.max_scan_interval) {
		      MQ_INTERVAL = MQ_INTERVAL + App.mq.config.step_size;
		    }
		    else {
		      MQ_INTERVAL = App.mq.config.max_scan_interval;
		    }
		  }
		}
		setTimeout(deliver, MQ_INTERVAL);
	};
	
	//PUBLIC API:
	//-----------
	//Adding static utility methods and config to the "app" namespace
	App.mq = {
		
		//Plug-In Configuration
		config: {
		  min_scan_interval: 100,
		  max_scan_interval: 150,
		  step_size: 10
		},
		
		//Publish a message to the message queue
		publish: function(_msg_name_or_msg_object,data) {
			var message = {}; //Message object to be queued
			if (typeof _msg_name_or_msg_object == 'string') {
				message = {
					name: _msg_name_or_msg_object,
					payload: (data)?data:{},
					scope: 'appcelerator'
				};
			}
			else {
				message = swiss.extend({
					name: null,
					payload: {},
					scope: 'appcelerator'
				},_msg_name_or_msg_object||{});
				if (message.name == null) {
					throw "Messages must have an associated name"; 
				}
			}

			//Push the message onto the queue
			MESSAGE_QUEUE.push(message);
		},
		
		//Subscribe to a message
		subscribe: function(_type_or_regex, _callback, _args) {			
			// look for regex
			var listener = swiss.extend({
				type_or_regex: _type_or_regex,
				callback: _callback,
				scope: 'appcelerator',
				handle: null
			},_args||{});

			//Add the listener to the array of listeners
			LISTENERS.push(listener);
		},
		
		//remove a listener with the given handle from the list of listeners
		unsubscribe: function(_handle) {
			for(listener_index in LISTENERS) {
				var listener = LISTENERS[listener_index];
				if (_handle === listener.handle) {
					LISTENERS.splice(listener_index,1);
				}
			}
		},
		
		//Intercept any messages matching the regex and filter the message
		//returns true or false based on whether the rest of the filters should
		//execute
		intercept: function(_type_or_regex, _callback, _args) {			
			// Provide default args
			var interceptor = swiss.extend({
				type_or_regex: _type_or_regex,
				callback: _callback,
				scope: 'appcelerator',
				handle: null
			},_args||{});

			//Add the interceptor to the array of interceptors
			INTERCEPTORS.push(interceptor);
		},
		
		//Remove an interceptor with the given handle from the list of interceptors
		unintercept: function(_handle) {
			for(interceptor_index in INTERCEPTORS) {
				var interceptor = INTERCEPTORS[interceptor_index];
				if (_handle === interceptor.handle) {
					INTERCEPTORS.splice(interceptor_index,1);
				}
			}
		},
		
		//Register a URL pattern to have request/response messages mapped to it
		register: function(_request_msg_name, _response_msg_name, _url, _args) {			
			// Provide default args
			var args = swiss.extend({
				method: 'GET',
				scope: 'appcelerator'
			},_args||{});
			
			//Add a listener for the given ajax call
			App.mq.subscribe(_request_msg_name, function(msg) {
				//Determine value of URL for Ajax call
				var callUrl = _url;
				for (var property in msg.payload) {
				   var value = msg.payload[property];
				   callUrl = callUrl.replace(new RegExp("#{"+property+"}"),value);
				}
				
				//Make an ajax call to the given url, publishing messages based on the results
				swiss.ajax({
					method: args.method,
					data: swiss.toJSON(msg.payload),
					url: callUrl,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					success: function(data){
						App.mq.publish({
							name: _response_msg_name, 
							payload:swiss.evalJSON(data), 
							scope: args.scope 
						});
					},
					error: function(xhr) {
						//TODO: Other useful info to add to the payload on a request error?
						App.mq.publish({
							name: "registered.remote.service.error",
							payload: swiss.unfilterJSON(xhr.responseText) 
						});
					}
				});
				
			}, { scope: args.scope });
		}
	};
	
	//Create an event handler for every matched element in the selector
	if (jQuery) {
	  $.fn.subscribe = function(_pattern, _callback, _args) {
  	  return this.each(function() {
  	    args = swiss.extend({
  	      element: this
  	    },_args||{});
  	    App.mq.subscribe(_pattern, _callback, args);
  	  });
  	};
	}
	
	//start the queue scan process
	swiss.onload(function() {
	  deliver();
	});
	
	//Map convenience macros to API in the App.mq namespace
	$MQ = function(_msg_name_or_msg_object, data) {
		App.mq.publish(_msg_name_or_msg_object,data);
	};
	$MQI = function(_type_or_regex, _callback, _args) {
		App.mq.intercept(_type_or_regex, _callback, _args);
	};
	$MQL = function(_type_or_regex, _callback, _args) {
		App.mq.subscribe(_type_or_regex, _callback, _args);
	};
	$MQR = function(_request_msg_name, _response_msg_name, _url, _args) {
		App.mq.register(_request_msg_name, _response_msg_name, _url, _args);
	};
})();