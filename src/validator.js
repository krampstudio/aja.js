/**
 * Aja.js
 * Ajax without XML : Asynchronous Javascript and JavaScript/JSON(P)
 *
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 */

import {types, methods} from './config.js';

/**
 * Validation/reparation rules for aja's types
 */
const validators = {

    /**
     * cast to boolean
     * @param {*} value
     * @returns {Boolean} casted value
     */
    bool (value) {
        return !!value;
    },

    /**
     * Check whether the given parameter is a string
     * @param {String} string
     * @returns {String} value
     * @throws {TypeError} for non strings
     */
    string (string) {
        if (typeof string !== 'string') {
            throw new TypeError(`a string is expected, but ${string} [${typeof string}] given`);
        }
        return string;
    },

    /**
     * Check whether the given parameter is a positive integer > 0
     * @param {Number} integer
     * @returns {Number} value
     * @throws {TypeError} for non strings
     */
    positiveInteger (integer) {
        if (parseInt(integer) !== integer || integer <= 0) {
            throw new TypeError(`an integer is expected, but ${integer} [${typeof integer}] given`);
        }
        return integer;
    },

    /**
     * Check whether the given parameter is a plain object (array and functions aren't accepted)
     * @param {Object} object
     * @returns {Object} object
     * @throws {TypeError} for non object
     */
    plainObject(object) {
        if (typeof object !== 'object' || object.constructor !== Object) {
            throw new TypeError(`an object is expected, but ${object}  [${typeof object}] given`);
        }
        return object;
    },

    /**
     * Check whether the given parameter is a type supported by Aja.
     * The list of supported types is set above, in the {@link types} variable.
     * @param {String} type
     * @returns {String} type
     * @throws {TypeError} if the type isn't supported
     */
    type(type) {
        type = this.string(type);
        if (types.indexOf(type.toLowerCase()) < 0) {
            throw new TypeError('a type in [' + types.join(', ') + '] is expected, but ' + type + ' given');
        }
        return type.toLowerCase();
    },

    /**
     * Check whether the given HTTP method is supported.
     * The list of supported methods is set above, in the {@link methods} variable.
     * @param {String} method
     * @returns {String} method (but to lower case)
     * @throws {TypeError} if the method isn't supported
     */
    method(method) {
        method = this.string(method);
        if (methods.indexOf(method.toLowerCase()) < 0) {
            throw new TypeError('a method in [' + methods.join(', ') + '] is expected, but ' + method + ' given');
        }
        return method.toLowerCase();
    },

    /**
     * Check the queryString, and create an object if a string is given.
     *
     * @param {String|Object} params
     * @returns {Object} key/value based queryString
     * @throws {TypeError} if wrong params type or if the string isn't parseable
     */
    queryString(params) {
        var object = {};
        if (typeof params === 'string') {

            params.replace('?', '').split('&').forEach(  kv => {
                const pair = kv.split('=');
                if (pair.length === 2) {
                    object[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                }
            });
        } else {
            object = params;
        }
        return this.plainObject(object);
    },

    /**
     * Check if the parameter enables us to select a DOM Element.
     *
     * @param {String|HTMLElement} selector - CSS selector or the element ref
     * @returns {String|HTMLElement} same as input if valid
     * @throws {TypeError} check it's a string or an HTMLElement
     */
    selector(selector) {
        if (typeof selector !== 'string' && !(selector instanceof HTMLElement)) {
            throw new TypeError(`a selector or an HTMLElement is expected, ${selector} [${typeof selector}] given`);
        }
        return selector;
    },

    /**
     * Check if the parameter is a valid JavaScript function name.
     *
     * @param {String} functionName
     * @returns {String} same as input if valid
     * @throws {TypeError} check it's a string and a valid name against the pattern inside.
     */
    func(functionName) {
        functionName = this.string(functionName);
        if (! /^([a-zA-Z_])([a-zA-Z0-9_\-])+$/.test(functionName)) {
            throw new TypeError(`a valid function name is expected, ${functionName} [${typeof functionName}] given`);
        }
        return functionName;
    }
};

export default validators;
