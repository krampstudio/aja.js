
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
        it('should chain', function(){
            var a = aja();
            expect(a.url('http://www.example.com')).to.be.an.object;
            expect(a.url('http://www.example.com')).to.equals(a);
        });
        it('should accept only strings', function(){
            expect(function(){ aja().url(false); }).to.throw(TypeError);
            expect(function(){ aja().url('http://www.example.com'); }).to.not.throw();
        });
        it('should get the set url', function(){
            expect(aja().url('http://www.example.com').url()).to.equals('http://www.example.com');
        });
    });

    describe('sync()', function(){

        it('should be a function', function(){
            expect(aja().sync).to.be.a.function;
        });
        it('should chain', function(){
            var a = aja();
            expect(a.sync(true)).to.be.an.object;
            expect(a.sync(true)).to.equals(a);
        });
        it('should get the set value', function(){
            expect(aja().sync(true).sync()).to.equals(true);
            expect(aja().sync(1).sync()).to.equals(true);
            expect(aja().sync(false).sync()).to.equals(false);
            expect(aja().sync(0).sync()).to.equals(false);
        });
    });
});
