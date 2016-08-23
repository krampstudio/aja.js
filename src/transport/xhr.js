import eventify from '../eventify.js';

const xhr = function({ method = 'GET', url = '', headers = {}, body, async = true, credentials, timeout = 0 } = {}){

    return eventify({
        go(){
            return new Promise( (resolve, reject) => {

                const xhRequest = new XMLHttpRequest();

                if(credentials && credentials.user && credentials.password){
                    xhRequest.open(method, url, async, credentials.user, credentials.password);
                } else {
                    xhRequest.open(method, url, async);
                }

                headers.forEach( (value, name) => xhRequest.setRequestHeader(name, value) );

                if(timeout && timeout > 0) {
                    xhRequest.timeout = timeout;
                }

                xhRequest.addEventListener('loadstart', () => this.trigger('start'));
                xhRequest.addEventListener('loadend',   () => this.trigger('end'));
                xhRequest.addEventListener('progress', e => {
                    if (e.lengthComputable) {
                        this.trigger('progress', e.loaded / e.total);
                    }
                });

                xhRequest.addEventListener('load', () => {
                    resolve({
                        status:   xhRequest.status,
                        type:     xhRequest.responseType,
                        response: xhRequest.responseText,
                        raw:      xhRequest.response,
                        headers:  xhRequest.getAllResponseHeaders()
                    });
                });

                xhRequest.onerror = err => reject({
                    type  : 'error',
                    error : err
                });

                xhRequest.ontimeout = () => reject({ type  : 'timeout' });
                xhRequest.onabort   = () => reject({ type  : 'abort' });

                //send the request
                xhRequest.send(body);
            });
        }
    });
};

export default xhr;
