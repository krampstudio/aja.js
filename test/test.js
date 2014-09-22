
var aja = window.aja;

describe('aja()', function(){

    it('should be a function', function(){
        expect(aja).to.be.a.function;
    });
    
    it('should return an object', function(){
        expect(aja()).to.be.an.object;
        aja().url();
    });

    describe('url()', function(){

        it('should be a function', function(){
            expect(aja().url).to.be.a.function;
        });
        it('should accept an url and chain', function(){
            var a = aja();
            expect(a.url('http://www.example.com')).to.be.an.object;
            expect(a.url('http://www.example.com')).to.equals(a);
        });
        it('should not accept invalid urls', function(){
            expect(function(){ aja().url(false); }).to.throw();
        });
    });
});
