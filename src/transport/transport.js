import xhr from './xhr.js';
import fetch from './fetch.js';
import link from './link.js';
import script from './script.js';

const hasFetch = typeof window.fetch === 'function';

const transportTypes = {
    html  : hasFetch ? fetch : xhr,
    json  : hasFetch ? fetch : xhr,
    txt   : hasFetch ? fetch : xhr,
    jsonp : hasFetch ? fetch : xhr,
    css   : link,
    script
};

const transport = function transport(type, request){

    return new Promise( (resolve, reject) => {

        const transporter = transportTypes[type];

        if(typeof transporter !== 'function'){
            return reject(new TypeError(`Unable to find a valid transport for ${type}`));
        }

        return transporter(request);
    });
};

export default transport;
