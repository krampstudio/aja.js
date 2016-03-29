/**
 * Aja.js
 * Ajax without XML : Asynchronous Javascript and JavaScript/JSON(P)
 *
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 */

import validators from './validator.js';
import http from './util/http.js';

/**
 * API entry point.
 * It creates an new {@link Aja} object.
 *
 * @example aja().url('page.html').into('#selector').go();
 *
 * @exports aja
 * @namespace aja
 * @returns {Aja} the {@link Aja} object ready to create your request.
 */
const ajaFactory = function ajaFactory() {

    //contains all the values from the setter for this context.
    var data = {};

    //contains the bound events.
    var events = {};

    /**
     * The Aja object is your context, it provides your getter/setter
     * as well as methods the fluent way.
     * @typedef {Object} Aja
     */

    /**
     * @type {Aja}
     * @lends aja
     */
    const aja = {

        /**
         * URL getter/setter: where your request goes.
         * All URL formats are supported: <pre>[protocol:][//][user[:passwd]@][host.tld]/path[?query][#hash]</pre>.
         *
         * @example aja().url('bestlib?pattern=aja');
         *
         * @throws TypeError
         * @param {String} [url] - the url to set
         * @returns {Aja|String} chains or get the URL
         */
        url(url) {
            return _chain.call(this, 'url', url, validators.string);
        },

        /**
         * Is the request synchronous (async by default) ?
         *
         * @example aja().sync(true);
         *
         * @param {Boolean|*} [sync] - true means sync (other types than booleans are casted)
         * @returns {Aja|Boolean} chains or get the sync value
         */
        sync(sync) {
            return _chain.call(this, 'sync', sync, validators.bool);
        },

        /**
         * Should we force to disable browser caching (true by default) ?
         * By setting this to false, then a buster will be added to the requests.
         *
         * @example aja().cache(false);
         *
         * @param {Boolean|*} [cache] - false means no cache  (other types than booleans are casted)
         * @returns {Aja|Boolean} chains or get cache value
         */
        cache(cache) {
            return _chain.call(this, 'cache', cache, validators.bool);
        },

        /**
         * Type getter/setter: one of the predefined request type.
         * The supported types are : <pre>['html', 'json', 'jsonp', 'script', 'style']</pre>.
         * If not set, the default type is deduced regarding the context, but goes to json otherwise.
         *
         * @example aja().type('json');
         *
         * @throws TypeError if an unknown type is set
         * @param {String} [type] - the type to set
         * @returns {Aja|String} chains or get the type
         */
        type(type) {
            return _chain.call(this, 'type', type, validators.type);
        },

        /**
         * HTTP Request Header getter/setter.
         *
         * @example aja().header('Content-Type', 'application/json');
         *
         * @throws TypeError
         * @param {String} name - the name of the header to get/set
         * @param {String} [value] - the value of the header to set
         * @returns {Aja|String} chains or get the header from the given name
         */
        header(name, value) {
            data.headers = data.headers || {};

            validators.string(name);
            if (typeof value !== 'undefined') {
                validators.string(value);

                data.headers[name] = value;

                return this;
            }

            return data.headers[name];
        },

        /**
         * <strong>Setter only</strong> to add authentication credentials to the request.
         *
         * @throws TypeError
         * @param {String} user - the user name
         * @param {String} passwd - the password value
         * @returns {Aja} chains
         */
        auth(user, passwd) {
            //setter only

            validators.string(user);
            validators.string(passwd);
            data.auth = {
                user: user,
                passwd: passwd
            };

            return this;
        },

        /**
         * Sets a timeout (expressed in ms) after which it will halt the request and the 'timeout' event will be fired.
         *
         * @example aja().timeout(1000); // Terminate the request and fire the 'timeout' event after 1s
         *
         * @throws TypeError
         * @param {Number} [ms] - timeout in ms to set. It has to be an integer > 0.
         * @returns {Aja|String} chains or get the params
         */
        timeout(ms) {
            return _chain.call(this, 'timeout', ms, validators.positiveInteger);
        },

        /**
         * HTTP method getter/setter.
         *
         * @example aja().method('post');
         *
         * @throws TypeError if an unknown method is set
         * @param {String} [method] - the method to set
         * @returns {Aja|String} chains or get the method
         */
        method(method) {
            return _chain.call(this, 'method', method, validators.method);
        },

        /**
         * URL's queryString getter/setter. The parameters are ALWAYS appended to the URL.
         *
         * @example aja().queryString({ user : '12' }); //  ?user=12
         *
         * @throws TypeError
         * @param {Object|String} [params] - key/values POJO or URL queryString directly to set
         * @returns {Aja|String} chains or get the params
         */
        queryString(params) {
            return _chain.call(this, 'queryString', params, validators.queryString);
        },

        /**
         * URL's queryString getter/setter.
         * Regarding the HTTP method the data goes to the queryString or the body.
         *
         * @example aja().data({ user : '12' });
         *
         * @throws TypeError
         * @param {Object} [params] - key/values POJO to set
         * @returns {Aja|String} chains or get the params
         */
        data(params) {
            return _chain.call(this, 'data', params, validators.plainObject);
        },

        /**
         * Request Body getter/setter.
         * Objects and arrays are stringified (except FormData instances)
         *
         * @example aja().body(new FormData());
         *
         * @throws TypeError
         * @param {String|Object|Array|Boolean|Number|FormData} [content] - the content value to set
         * @returns {Aja|String|FormData} chains or get the body content
         */
        body(content) {
            return _chain.call(this, 'body', content, null, function(content) {
                if (typeof content === 'object') {
                    //support FormData to be sent direclty
                    if (!(content instanceof FormData)) {
                        //otherwise encode the object/array to a string
                        try {
                            content = JSON.stringify(content);
                        } catch (e) {
                            throw new TypeError('Unable to stringify body\'s content : ' + e.name);
                        }
                        this.header('Content-Type', 'application/json');
                    }
                } else {
                    content = content + ''; //cast
                }
                return content;
            });
        },

        /**
         * Into selector getter/setter. When you want an Element to contain the response.
         *
         * @example aja().into('div > .container');
         *
         * @throws TypeError
         * @param {String|HTMLElement|NodeList} [selector] - the dom query selector or directly the Element
         * @returns {Aja|Array} chains or get the list of found elements
         */
        into(selector) {
            return _chain.call(this, 'into', selector, validators.selector, function(selector) {
                if (typeof selector === 'string') {
                    return document.querySelectorAll(selector);
                }
                if (selector instanceof HTMLElement) {
                    return [selector];
                }
                if (selector instanceof NodeList){
                    return selector;
                }
            });
        },

        /**
         * Padding name getter/setter, ie. the callback's PARAMETER name in your JSONP query.
         *
         * @example aja().jsonPaddingName('callback');
         *
         * @throws TypeError
         * @param {String} [paramName] - a valid parameter name
         * @returns {Aja|String} chains or get the parameter name
         */
        jsonPaddingName(paramName) {
            return _chain.call(this, 'jsonPaddingName', paramName, validators.string);
        },

        /**
         * Padding value  getter/setter, ie. the callback's name in your JSONP query.
         *
         * @example aja().jsonPadding('someFunction');
         *
         * @throws TypeError
         * @param {String} [padding] - a valid function name
         * @returns {Aja|String} chains or get the padding name
         */
        jsonPadding(padding) {
            return _chain.call(this, 'jsonPadding', padding, validators.func);
        },

        /**
         * Attach an handler to an event.
         * Calling `on` with the same eventName multiple times add callbacks: they
         * will all be executed.
         *
         * @example aja().on('success', function(res){ console.log('Cool', res);  });
         *
         * @param {String} name - the name of the event to listen
         * @param {Function} cb - the callback to run once the event is triggered
         * @returns {Aja} chains
         */
        on(name, cb) {
            if (typeof cb === 'function') {
                events[name] = events[name] || [];
                events[name].push(cb);
            }
            return this;
        },

        /**
         * Remove ALL handlers for an event.
         *
         * @example aja().off('success');
         *
         * @param {String} name - the name of the event
         * @returns {Aja} chains
         */
        off(name) {
            events[name] = [];
            return this;
        },

        /**
         * Trigger an event.
         * This method will be called hardly ever outside Aja itself,
         * but there is edge cases where it can be useful.
         *
         * @example aja().trigger('error', new Error('Emergency alert'));
         *
         * @param {String} name - the name of the event to trigger

         * @param {*} data - arguments given to the handlers
         * @returns {Aja} chains
         */
        trigger(name = '', data) {

            const statusPattern = /^([0-9])([0-9x])([0-9x])$/i;
            const eventCalls = (name, data) => {
                if (events[name] && events[name].length) {
                    events[name].forEach( event => event.call(this, data) );
                }
            };
            if (typeof name !== 'undefined') {
                name = name + '';

                let triggerStatus = name.match(statusPattern);

                //HTTP status pattern
                if (triggerStatus && triggerStatus.length > 3) {
                    Object.keys(events).forEach( eventName => {
                        var listenerStatus = eventName.match(statusPattern);
                        //check for wildcards or x in the eventName
                        if (listenerStatus && listenerStatus.length > 3 &&
                            triggerStatus[1] === listenerStatus[1] &&
                            (listenerStatus[2] === 'x' || triggerStatus[2] === listenerStatus[2]) &&
                            (listenerStatus[3] === 'x' || triggerStatus[3] === listenerStatus[3])) {

                            eventCalls(eventName, data);
                        }
                    });
                    //or exact matching
                } else if (events[name]) {
                    eventCalls(name, data);
                }
            }
            return this;
        },

        /**
         * Trigger the call.
         * This is the end of your chain loop.
         *
         * @example aja()
         *           .url('data.json')
         *           .on('200', function(res){
         *               //Yeah !
         *            })
         *           .go();
         */
        go() {

            var type = data.type || (data.into ? 'html' : 'json');
            var url = _buildQuery();

            //delegates to ajaGo
            if (typeof ajaGo[type] === 'function') {
                return ajaGo[type].call(this, url);
            }
        }
    };

    /**
     * Contains the different communication methods.
     * Used as provider by {@link Aja.go}
     *
     * @type {Object}
     * @private
     * @memberof aja
     */
    var ajaGo = {

        /**
         * XHR call to url to retrieve JSON
         * @param {String} url - the url
         */
        json(url) {
            ajaGo._xhr.call(this, url, res => {
                if (res) {
                    try {
                        res = JSON.parse(res);
                    } catch (e) {
                        this.trigger('error', e);
                        return null;
                    }
                } else {
                    res = null;
                }
                return res;
            });
        },

        /**
         * XHR call to url to retrieve HTML and add it to a container if set.
         * @param {String} url - the url
         */
        html(url) {
            ajaGo._xhr.call(this, url, res => {
                if (data.into && data.into.length) {
                    [].forEach.call(data.into, function(elt) {
                        elt.innerHTML = res;
                    });
                }
                return res;
            });
        },

        /**
         * Create and send an XHR query.
         * @param {String} url - the url
         * @param {Function} processRes - to modify / process the response before sent to events.
         */
        _xhr(url, processRes) {
            var self = this;

            //iterators
            var key, header;

            var method = data.method || 'get';
            var async = data.sync !== true;
            var request = new XMLHttpRequest();
            var _data = data.data;
            var body = data.body;
            var useBody = http.dataInBody(method);
            var contentType = this.header('Content-Type');
            var timeout = data.timeout;
            var timeoutId;
            var isUrlEncoded;
            var openParams;

            //guess content type
            if (!contentType && _data && useBody) {
                this.header('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                contentType = this.header('Content-Type');
            }

            //if data is used in body, it needs some modifications regarding the content type
            if (_data && useBody) {
                if (typeof body !== 'string') {
                    body = '';
                }

                if (contentType.indexOf('json') > -1) {
                    try {
                        body = JSON.stringify(_data);
                    } catch (e) {
                        throw new TypeError('Unable to stringify body\'s content : ' + e.name);
                    }
                } else {
                    isUrlEncoded = contentType && contentType.indexOf('x-www-form-urlencoded') > 1;
                    for (key in _data) {
                        if (isUrlEncoded) {
                            body += encodeURIComponent(key) + '=' + encodeURIComponent(_data[key]) + '&';
                        } else {
                            body += key + '=' + _data[key] + '\n\r';
                        }
                    }
                }
            }

            //open the XHR request
            openParams = [method, url, async];
            if (data.auth) {
                openParams.push(data.auth.user);
                openParams.push(data.auth.passwd);
            }
            request.open.apply(request, openParams);

            //set the headers
            for (header in data.headers) {
                request.setRequestHeader(header, data.headers[header]);
            }

            //bind events
            request.onprogress = e => {
                if (e.lengthComputable) {
                    this.trigger('progress', e.loaded / e.total);
                }
            };

            request.onload = function onRequestLoad() {
                var response = request.responseText;

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (this.status >= 200 && this.status < 300) {
                    if (typeof processRes === 'function') {
                        response = processRes(response);
                    }
                    self.trigger('success', response);
                }

                self.trigger(this.status, response);

                self.trigger('end', response);
            };

            request.onerror = function onRequestError(err) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                self.trigger('error', err, arguments);
            };

            //sets the timeout
            if (timeout) {
                timeoutId = setTimeout(function() {
                    self.trigger('timeout', {
                        type: 'timeout',
                        expiredAfter: timeout
                    }, request, arguments);
                    request.abort();
                }, timeout);
            }

            //send the request
            request.send(body);
        },

        /**
         * @this {Aja} call bound to the Aja context
         * @param {String} url - the url
         */
        jsonp(url) {
            var script;
            var self = this;
            var head = document.querySelector('head');
            var async = data.sync !== true;
            var jsonPaddingName = data.jsonPaddingName || 'callback';
            var jsonPadding = data.jsonPadding || ('_padd' + new Date().getTime() + Math.floor(Math.random() * 10000));
            var paddingQuery = {};

            if (aja[jsonPadding]) {
                throw new Error('Padding ' + jsonPadding + '  already exists. It must be unique.');
            }
            if ( ! /^ajajsonp_/.test(jsonPadding)) {
                jsonPadding = 'ajajsonp_' + jsonPadding;
            }

            //window.ajajsonp = window.ajajsonp || {};
            window[jsonPadding] = function padding(response) {
                self.trigger('success', response);
                head.removeChild(script);
                window[jsonPadding] = undefined;
            };

            paddingQuery[jsonPaddingName] = jsonPadding;

            url = http.appendQueryString(url, paddingQuery);

            script = document.createElement('script');
            script.async = async;
            script.src = url;
            script.onerror = function() {
                self.trigger('error', arguments);
                head.removeChild(script);
                window[jsonPadding] = undefined;
            };
            head.appendChild(script);
        },

        /**
         * Loads a script.
         *
         * This kind of ugly script loading is sometimes used by 3rd part libraries to load
         * a configured script. For example, to embed google analytics or a twitter button.
         *
         * @this {Aja} call bound to the Aja context
         * @param {String} url - the url
         */
        script(url) {

            var self = this;
            var head = document.querySelector('head') || document.querySelector('body');
            var async = data.sync !== true;
            var script;

            if (!head) {
                throw new Error('Ok, wait a second, you want to load a script, but you don\'t have at least a head or body tag...');
            }

            script = document.createElement('script');
            script.async = async;
            script.src = url;
            script.onerror = function onScriptError() {
                self.trigger('error', arguments);
                head.removeChild(script);
            };
            script.onload = function onScriptLoad() {
                self.trigger('success', arguments);
            };

            head.appendChild(script);
        }
    };

    /**
     * Helps you to chain getter/setters.
     * @private
     * @memberof aja
     * @this {Aja} bound to the current context
     * @param {String} name - the property name
     * @param {*} [value] - the property value if we are in a setter
     * @param {Function} [validator] - to validate/transform the value if needed
     * @param {Function} [update] - when there is more to do with the setter
     * @returns {Aja|*} either the current context (setter) or the requested value (getter)
     * @throws TypeError
     */
    var _chain = function _chain(name, value, validator, update) {
        if (typeof value !== 'undefined') {
            if (typeof validator === 'function') {
                try {
                    value = validator.call(validators, value);
                } catch (e) {
                    throw new TypeError('Failed to set ' + name + ' : ' + e.message);
                }
            }
            if (typeof update === 'function') {
                data[name] = update.call(this, value);
            } else {
                data[name] = value;
            }
            return this;
        }
        return data[name] === 'undefined' ? null : data[name];
    };

    /**
     * Build the URL to run the request against.
     * @private
     * @memberof aja
     * @returns {String} the URL
     */
    var _buildQuery = function _buildQuery() {

        var url = data.url;
        var cache = typeof data.cache !== 'undefined' ? !!data.cache : true;
        var queryString = data.queryString || '';
        var _data = data.data;

        //add a cache buster
        if (cache === false) {
            queryString += '&ajabuster=' + Date.now();
        }

        url = http.appendQueryString(url, queryString);

        if (_data && !http.dataInBody(data.method)) {
            url = http.appendQueryString(url, _data);
        }
        return url;
    };

    return aja;
};

export default ajaFactory;
