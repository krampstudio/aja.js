
export default {

    /**
     * Check whether the data must be set in the body instead of the queryString
     * @returns {Boolean} true id data goes to the body
     */
    dataInBody(method) {
        return ['delete', 'patch', 'post', 'put'].indexOf(method) > -1;
    },


    /**
    * Append some parameters to an URL
    * @param {String} url - the URL to append the parameters
    * @param {Object} params - key/value
    * @returns {String} the new URL
    */
    appendQueryString(url, params) {
        var key;
        url = url || '';
        if (params) {
            if (url.indexOf('?') === -1) {
                url += '?';
            }
            if (typeof params === 'string') {
                url += params;
            } else if (typeof params === 'object') {
                for (key in params) {
                    if ( ! /[?&]$/.test(url)) {
                        url += '&';
                    }
                    url += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                }
            }
        }

        return url;
    }
};
