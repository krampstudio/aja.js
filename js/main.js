(function(Prism){
    var pres = document.querySelectorAll('pre');
    for(var i  = 0; i < pres.length; i++){
        console.log(pres[i]);
        Prism.highlightElement(pres[i], false);
    }
})(window.Prism);
