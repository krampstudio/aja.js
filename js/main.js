(function(Prism){
    'use strict';

    //highlight code
    var pres;
    if(document.querySelectorAll){
        pres = document.querySelectorAll('pre');
        for(var i  = 0; i < pres.length; i++){
            Prism.highlightElement(pres[i], false);
        }
    }
})(window.Prism);
