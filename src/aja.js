/**
 * Aja.js
 * Ajax without XML : Asynchronous Javascript and JavaScript/JSON(P)
 * 
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 */
(function(window){
    'use strict';

    /**
     * supported request types.
     */
    var types = ['html', 'json', 'jsonp', 'script', 'style'];

    /**
     * supported http methods
     */ 
    var methods = ['get', 'post', 'delete', 'head', 'put', 'options'];

    /**
     * API entry point.
     * It creates an new {@link Aja} object.
     * 
     * @exports aja
     * @namespace aja
     * @returns {Aja} the {@link Aja} object ready to create your request.
     */
    var aja = function aja(){

        //contains all the values from the setter for this context.
        var data = {};

        //contains the bound events.
        var events = {};

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
        var _chain = function _chain(name, value, validator, update){
            if(typeof value !== 'undefined'){
                if(typeof validator === 'function'){
                    try{
                        value = validator.call(validators, value);
                    } catch(e){
                        throw new TypeError(name + " " + e.message);
                    }
                }
                data[name] = value;
                if(typeof update === 'function'){
                    update.call(this, value);
                }
                return this;
            }
            return data[name] === 'undefined' ? null : data[name];
        };

        /**
         * The Aja object is your context, it provides your getter/setter 
         * as well as methods the fluent way.
         * @typedef {Object} Aja
         */

        /**
         * @type {Aja}
         * @lends aja
         */
        var Aja = {

            /**
             * URL getter/setter: where your request goes. 
             * All URL formats are supported: <pre>[protocol:][//][user[:passwd]@][host.tld]/path[?query][#hash]</pre>.
             * @throws TypeError  
             * @param {String} [url] - the url to set
             * @returns {Aja|String} chains or get the URL
             */
            url : function(url){
               return _chain.call(this, 'url', url, validators.string);
            },

            /**
             * Is the request synchronous (async by default) ?
             * @param {Boolean|*} [sync] - true means sync (other types than booleans are casted)
             * @returns {Aja|Boolean} chains or get the sync value
             */
            sync : function(sync){
               return _chain.call(this, 'sync', sync, validators.bool);
            },

            /**
             * Should we force to disable browser caching (true by default) ?
             * By setting this to false, then a buster will be added to the requests.
             *
             * @param {Boolean|*} [sync] - false means no cache  (other types than booleans are casted)
             * @returns {Aja|Boolean} chains or get cache value
             */
            cache : function(cache){
               return _chain.call(this, 'cache', cache, validators.bool);
            },

            /**
             * Type getter/setter: one of the predefined request type. 
             * The supported types are : <pre><'html', 'json', 'jsonp', 'script', 'style'</pre>.
             * If not set, the default type is deduced regarding the context, but goes to json otherwise.
             * @throws TypeError if an unkown type is set
             * @param {String} [type] - the type to set
             * @returns {Aja|String} chains or get the type
             */
            type : function(type){
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
            header : function(name, value){
                data.headers = data.headers || {};

                validators.string(name);
                if(typeof value !== 'undefined'){
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
            auth : function(user, passwd){
                //setter only
    
                validators.string(user);
                validators.string(passwd);
                data.auth = {
                   user : user,
                   passwd : passwd 
                };

                return this;
            },

            /**
             * HTTP method getter/setter.
             *
             * @throws TypeError if an unkown method is set
             * @param {String} [method] - the method to set
             * @returns {Aja|String} chains or get the method
             */
            method : function(method){
               return _chain.call(this, 'method', method, validators.method, function(value){
                    if(value.toLowerCase() === 'post'){
                        this.header('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                    }
               });
            },

            
            params : function(params){
               return _chain.call(this, 'params', params, validators.object);
            },
        
            data : function(data){

            },
            
            body : function(content){

            },
            
            into : function(selector){
                //trigger send
            },
            
            on : function(name, cb){
                events[name] = cb;
                return this;
            },

            off : function(name, cb){
                events[name] = null;
                return this;
            },

            trigger : function(name, data){
                if(typeof events[name] === 'function'){
                    events[name].call(this, data);
                }
                return this;
            },

            go : function(){
                var self    = this;
                
                var url     = data.url;
                var type    = data.type || (data.into ? 'html' : 'json');
                var method  = data.method || 'get';
                var async   = data.sync !== true;
                var request = new XMLHttpRequest();

                if(!url){
                    throw new Error('Please set an url, at least.');
                }

                request.open(method, url, async);
                if(data.headers){
                    for(var header in data.headers){
                        request.setRequestHeader(header, data.headers[header]);
                    }
                }
                request.onprogress = function(e){
                    if (e.lengthComputable) {
                        self.trigger('progress', e.loaded / e.total);
                    }
                };
        
                request.onload = function(){
                    var data = request.responseText;
                    if(type === 'json'){
                        try {
                            data = JSON.parse(data);
                        } catch(e){
                            return self.trigger('error', e);
                        }
                    }

                    self.trigger(this.status, data);

                    if(this.status >= 200 && this.status < 300){
                        self.trigger('success', data);
                    }
                    self.trigger('end', data);
                };
                request.onerror = function(err){
                    self.trigger('error', err);
                };
                request.send();
            }
        };
        return Aja;
    };

    var validators = {

        bool : function(value){
            return !!value;    
        },

        string : function(string){
            if(typeof string !== 'string'){
                throw new TypeError("a string is expected");
            }
            return string; 
        },

        plainObject : function(object){
            if(typeof object !== 'object' || object.constructor !== Object){
                throw new TypeError("an object is expected");
            }
            return object; 
        },

        type : function(type){
            type = this.string(type);
            if(types.indexOf(type.toLowerCase()) < 0){
                throw new TypeError("a type in [" + types.join(', ') + "] is expected ");
            }
            return type;
        },

        method : function(method){
            method = this.string(method);
            if(methods.indexOf(method.toLowerCase()) < 0){
                throw new TypeError("a method in [" + methods.join(', ') + "] is expected ");
            }
            return method;
        },

    };

    //TODO UMD ?

    window.aja = window.aja || aja; 
    //aja().load('url').nocache.to('selector');


}(window));
