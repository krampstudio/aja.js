/**
 * Aja.js
 * Ajax without XML : Asynchronous Javascript and JavaScript/JSON(P)
 *
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 */
export default {

    /**
     * supported request types.
     */
    types : ['html', 'json', 'jsonp', 'script'],

    /**
     * supported http methods
     */
    methods : [
        'connect',
        'delete',
        'get',
        'head',
        'options',
        'patch',
        'post',
        'put',
        'trace'
    ];
};
