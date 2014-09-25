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
   
    describe('setter/getter', function(){

        describe('url()', function(){

            it('should be a function', function(){
                expect(aja().url).to.be.a('function');
            });
            it('should chain', function(){
                var a = aja();
                expect(a.url('http://www.example.com')).to.be.an('object');
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
                expect(aja().sync).to.be.a('function');
            });
            it('should chain', function(){
                var a = aja();
                expect(a.sync(true)).to.be.an('object');
                expect(a.sync(true)).to.equals(a);
            });
            it('should get the set value', function(){
                expect(aja().sync(true).sync()).to.equals(true);
                expect(aja().sync(1).sync()).to.equals(true);
                expect(aja().sync(false).sync()).to.equals(false);
                expect(aja().sync(0).sync()).to.equals(false);
            });
        });
            
        describe('cache()', function(){

            it('should be a function', function(){
                expect(aja().cache).to.be.a('function');
            });
            it('should chain', function(){
                var a = aja();
                expect(a.cache(true)).to.be.an('object');
                expect(a.cache(true)).to.equals(a);
            });
            it('should get / set value', function(){
                expect(aja().cache(true).cache()).to.equals(true);
                expect(aja().cache(1).cache()).to.equals(true);
                expect(aja().cache(false).cache()).to.equals(false);
                expect(aja().cache(0).cache()).to.equals(false);
            });
        });

        describe('type()', function(){

            it('should be a function', function(){
                expect(aja().type).to.be.a('function');
            });
            it('should chain', function(){
                var a = aja();
                expect(a.type('json')).to.be.an('object');
                expect(a.type('json')).to.equals(a);
            });
            
            it('should accept only defined values', function(){

                expect(function(){ aja().type(false); }).to.throw(TypeError);
                expect(function(){ aja().type('toto'); }).to.throw(TypeError);
                expect(function(){ aja().type(12); }).to.throw(TypeError);
                expect(function(){ aja().type('text'); }).to.throw(TypeError);

                expect(function(){ aja().type('json'); }).to.not.throw();
                expect(function(){ aja().type('html'); }).to.not.throw();
                expect(function(){ aja().type('script'); }).to.not.throw();
                expect(function(){ aja().type('style'); }).to.not.throw();
                expect(function(){ aja().type('jsonp'); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().type('json').type()).to.equals('json');
                expect(aja().type('html').type()).to.equals('html');
            });
        });

        describe('method()', function(){

            it('should be a function', function(){
                expect(aja().method).to.be.a('function');
            });
            it('should chain', function(){
                var a = aja();
                expect(a.method('get')).to.be.an('object');
                expect(a.method('get')).to.equals(a);
            });
            
            it('should accept only defined values', function(){

                expect(function(){ aja().method(false); }).to.throw(TypeError);
                expect(function(){ aja().method('toto'); }).to.throw(TypeError);
                expect(function(){ aja().method(12); }).to.throw(TypeError);
                expect(function(){ aja().method('got'); }).to.throw(TypeError);

                expect(function(){ aja().method('get'); }).to.not.throw();
                expect(function(){ aja().method('POST'); }).to.not.throw();
                expect(function(){ aja().method('head'); }).to.not.throw();
                expect(function(){ aja().method('DELETE'); }).to.not.throw();
                expect(function(){ aja().method('Put'); }).to.not.throw();
                expect(function(){ aja().method('options'); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().method('get').method()).to.equals('get');
                expect(aja().method('post').method()).to.equals('post');
            });
        });
    });
});
