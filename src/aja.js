(function(window){
    'use strict';

    var types = ['html', 'json', 'jsonp', 'script', 'style']; 
    var methods = ['get', 'post', 'delete', 'head', 'put', 'options'];

    var aja = function aja(){

        var data = {};

        var events = {};

        var _chain = function _chain(name, value, validator){
            if(typeof value !== 'undefined'){
                if(typeof validator === 'function'){
                    try{
                        value = validator.call(validators, value);
                    } catch(e){
                        throw new TypeError(name + " " + e.message);
                    }
                }
                data[name] = value;
                return this;
            }
            return data[name] === 'undefined' ? null : data[name];
        };

        return {

            url : function(url){
               return _chain.call(this, 'url', url, validators.string);
            },

            sync : function(sync){
               return _chain.call(this, 'sync', sync, validators.bool);
            },

            cache : function(cache){
               return _chain.call(this, 'cache', cache, validators.bool);
            },

            type : function(type){
               return _chain.call(this, 'type', type, validators.type);
            },

            method : function(method){
               return _chain.call(this, 'method', method, validators.method);
            },

            into : function(selector){
                //trigger send
            },
            
            on : function(name, cb){
                events[name] = cb;
            },

            off : function(name, cb){
                events[name] = null;
            },

            trigger : function(name, data){
                if(typeof events[name] === 'function'){
                    events[name].call(this, data);
                }
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
        }        
    };

    //TODO UMD ?

    window.aja = window.aja || aja; 
    //aja().load('url').nocache.to('selector');


}(window));
