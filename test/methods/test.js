/* global describe, it, expect */

var aja = window.aja;

describe('aja()', function(){

    //test basic module behavior
    it('should be a function', function(){
        expect(aja).to.be.a('function');
    });
    
    it('should return an object', function(){
        expect(aja()).to.be.an('object');
        aja().url();
    });
   
    describe('method', function(){

        describe('on/off/trigger()', function(){

            it('to be functions', function(){
                expect(aja().on).to.be.a('function');
                expect(aja().off).to.be.a('function');
                expect(aja().trigger).to.be.a('function');
            });

        });
    });
});
