(function(Prism){
    var pres = document.querySelectorAll('pre');
    for(var i  = 0; i < pres.length; i++){
        Prism.highlightElement(pres[i], false);
    }

    var navs = document.querySelectorAll('nav a');
    
})(window.Prism);
