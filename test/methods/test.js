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

        describe('on/off/trigger', function(){

            it('should be methods', function(){
                expect(aja().on).to.be.a('function');
                expect(aja().off).to.be.a('function');
                expect(aja().trigger).to.be.a('function');
            });

            it('should register an handler', function(done){
                aja().on('foo', function(){
                    done();
                }).trigger('foo');
            });

            it('should register multiple handlers', function(done){
                var counter = 0;
                aja()
                .on('foo', function(){
                    counter++;
                })
                .on('foo', function(){
                    counter++;
                })
                .on('foo', function(){
                    expect(counter).to.equal(2);
                    done();
                })
                .trigger('foo');
            });

            it('should register multiple handlers', function(done){
                var counter = 0;
                aja()
                .on('foo', function(){
                    counter++;
                })
                .off('foo')
                .trigger('foo');
                setTimeout(function(){
                    expect(counter).to.equal(0);
                    done();
                }, 10);
            });

            it('should send parameters', function(done){
                aja()
                .on('foo', function(bar){
                    expect(bar).to.equal('bar');
                    done();
                })
                .trigger('foo', 'bar');
            });

        });


    });
});
