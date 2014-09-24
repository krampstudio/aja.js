/* jshint expr:true */
/* global describe, it, expect */

var aja = window.aja;

describe('aja()', function(){

    //test basic module behavior
    it('should be a function', function(){
        expect(aja).to.be.a.function;
    });
    
    it('should return an object', function(){
        expect(aja()).to.be.an.object;
        aja().url();
    });
   
    describe('method', function(){

        describe('on()', function(){

            it('to be a function', function(){
                expect(aja().on).to.be.a.function;
            });

        });
    });
});
