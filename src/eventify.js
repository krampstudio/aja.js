/**
 * Aja.js - 2016
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 */

/**
 * Eventify an object.
 * @module eventify
 */

/**
 * The API itself is just a placeholder, all methods will be delegated to a target.
 */
const api = {

    /**
     * Attach an handler to an event.
     * Calling `on` with the same eventName multiple times add callbacks: they
     * will all be executed.
     *
     * @example target.on('foo', bar => console.log('Cool ' + bar) );
     *
     * @this the target
     * @param {String} name - the name of the event to listen
     * @param {Function} handler - the callback to run once the event is triggered
     * @returns {Object} the target object
     */
    on (name, handler) {
        if(typeof handler === 'function'){
            this._events[name] = this._events[name] || [];
            this._events[name].push(handler);
        }
        return this;
    },

    /**
     * Remove ALL handlers for an event.
     *
     * @example target.off('foo');
     *
     * @this the target
     * @param {String} name - the name of the event
     * @returns {Object} the target object
     */
    off (name) {
        this._events[name] = [];
        return this;
    },

    /**
     * Trigger an event.
     *
     * @example target.trigger('foo', 'Awesome');
     *
     * @this the target
     * @param {String} name - the name of the event to trigger
     * @param {*} data - arguments given to the handlers
     * @returns {Object} the target object
     */
    trigger (name, ...data) {
        if(this._events[name] && Array.isArray(this._events[name])){
            this._events[name].forEach(event =>  event.call(this, ...data));
        }
        return this;
    },

    /**
     * Get the registered handlers.
     *
     * @example target.events('foo').length;
     *
     * @this the target
     * @param {String} [name] - the name of the event
     * @returns {Array} the handlers
     */
    events (name) {
        if(typeof name !== 'undefined'){
            return this._events[name];
        }
        return this._events;
    }
};

/**
 * Makes the target an event emitter by delegating calls to the event API.
 * @param {Object} target - the target object
 * @returns {Object} the target for conveniance
 */
export default function eventify(target = {}){

    target._events = {};

    Object
        .keys(api)
        .filter( prop => typeof api[prop] === 'function')
        .forEach( method => {
            target[method] = (...args) => api[method].apply(target, args);
        });
    return target;
}
