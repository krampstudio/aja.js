/* global describe, it, expect */

var aja = window.aja;

describe('aja()', function(){

    //test basic module behavior
    it('should be a function', function(){
        expect(aja).to.be.a('function');
    });
    
    it('should return an object', function(){
        expect(aja()).to.be.an('object');
    });
  
    it('should load the json sample', function(done){
        aja()
            .url('/test/samples/data.json')
            .on('success', function(data){
                expect(data).to.be.an('object');
                expect(data).to.contain.keys(['kill']);
                expect(data.kill).to.equal('bill');
                done();
            })
            .go();
    }); 
});
