(function(window){
    'use strict';

    var supportedtypes = ['html', 'json', 'jsonp', 'script', 'style'];

    
    var validator = {

        bool : function(value){
            return !!value;    
        },

        string : function(string){
            if(typeof string !== 'string'){
                throw new TypeError("a string is expected");
            }
            return string; 
        },

        url  : function(url){
            url = this.string(url);
            return url; 
        },

        type : function(type){
            type = this.type(type);
            if(!~supportedtypes.indexOf(type)){
                throw new TypeError("a type in [" + supportedtypes.join(', ') + "] is expected ");
            }
            return type;
        }
    };

    var aja = function aja(){
        var data = {};

        var _chain = function _chain(name, value, validator){
            if(typeof value !== 'undefined'){
                if(typeof validator === 'function'){
                    try{
                        value = validator(value);
                    } catch(e){
                        throw new TypeError(name + " " + e.message);
                    }
                }
                data[name] = value;
                return this;
            }
            return data[name] || null;
        };

        return {
            url : function(url){
               return _chain.call(this, 'url', url, validator.string);
            },
            sync : function(sync){
               return _chain.call(this, 'sync', sync, validator.bool);
            },
            cache : function(cache){
               return _chain.call(this, 'cache', cache, validator.bool);
            },
            type : function(type){
               return _chain.call(this, 'type', type);
            },

            into : function(selector){
                //trigger send
            },
            

            on : function(name, cb){

            },

            off : function(name, cb){

            },

            trigger : function(name, data){

            },

            done : function(cb){
                
            },

            err : function(cb){

            },

            go : function(){

            }
        };
    };

    //TODO UMD ?

    window.aja = window.aja || aja; 
    //aja().load('url').nocache.to('selector');


}(window));
