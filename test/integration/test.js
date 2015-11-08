/* global describe, it, expect */

var aja = window.aja;

describe('aja()', function(){

    this.timeout(2000);

    this.afterEach(function() {
        var element = document.getElementById('into1');
        if(element){
            element.innerHTML = '';
        }
    });

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

    it('should load an html sample into an element', function(done){
        var element = document.getElementById('into1');
        expect(element).to.not.equal(null);
        aja()
            .url('/test/samples/data.html')
            .into(element)
            .on('success', function(){
                expect(element.children.length).to.equal(2);
                expect(element.children[0].tagName).to.equal('H1');
                expect(element.children[1].tagName).to.equal('P');
                done();
            })
            .go();
    });

    it('should load an html sample into a selector', function(done){
        var element = document.getElementById('into1');
        expect(element).to.not.equal(null);
        expect(element.children.length).to.equal(0);

        aja()
            .url('/test/samples/data.html')
            .into('#into1')
            .on('success', function(){
                expect(element.children.length).to.equal(2);
                expect(element.children[0].tagName).to.equal('H1');
                expect(element.children[1].tagName).to.equal('P');
                done();
            })
            .go();
    });

    it('should post urlencoded data', function(done){
        aja()
            .url('/mirror')
            .method('post')
            .data({ kill: 'bill'})
            .on('success', function(data){
                expect(data).to.be.an('object');
                expect(data.body).to.be.an('object');
                expect(data.body).to.contain.keys(['kill']);
                done();
            })
            .go();
    });

    it('should put urlencoded data', function(done){
        aja()
            .url('/mirror')
            .method('put')
            .data({ kill: 'bill'})
            .on('success', function(data){
                expect(data).to.be.an('object');
                expect(data.body).to.be.an('object');
                expect(data.body).to.contain.keys(['kill']);
                done();
            })
            .go();
    });

    it('should load the json sample and trigger a 200', function(done){
        aja()
            .url('/test/samples/data.json')
            .on('200', function(data){
                expect(data).to.be.an('object');
                expect(data).to.contain.keys(['kill']);
                expect(data.kill).to.equal('bill');
                done();
            })
            .go();
    });

    it('should load the json sample and trigger a 20x like', function(done){
        aja()
            .url('/test/samples/data.json')
            .on('20x', function(data){
                expect(data).to.be.an('object');
                expect(data).to.contain.keys(['kill']);
                expect(data.kill).to.equal('bill');
                done();
            })
            .go();
    });

    it('should trigger a 404 on wrong URL', function(done){
        aja()
            .url('/test/zamples/zaza.json')
            .on('404', function(data){
                expect(data).to.be.an('string');
                done();
            })
            .go();
    });

    it('should trigger an error on network failure', function(done){
        aja()
            .url('http://notallowed.example')
            .on('error', function(data){
                expect(data).to.contain.keys(['target', 'srcElement']);
                expect(data.type).to.equal('error');
                done();
            })
            .go();
    });

    it('should trigger an error on network failure, even if there is a timeout', function(done){
        aja()
            .url('http://notallowed.example')
            .timeout(1000)
            .on('error', function(data){
                expect(data).to.contain.keys(['target', 'srcElement']);
                expect(data.type).to.equal('error');
                done();
            })
            .go();
    });

    it('should trigger timeout event after timeout threshold is reached', function(done){
        aja()
            .url('/beinglate')
            .timeout(300)
            .on('success', function(err) {
                expect.fail('Thou shalt not execute the success callback.');
            })
            .on('error', function(err) {
                expect.fail('Thou shalt not execute the error callback.');
            })
            .on('timeout', function(err){
                expect(err).to.deep.equal({
                    type: 'timeout',
                    expiredAfter: 300
                });
                done();
            })
            .go();
    });

    it('should trigger the success callback on retry after a timeout', function(done){
        aja()
            .url('/beinglate-retry')
            .timeout(250)
            .on('success', function(err) {
                expect.fail('Thou shalt not execute the success callback.');
            })
            .on('error', function(err) {
                expect.fail('Thou shalt not execute the error callback.');
            })
            .on('timeout', function(err){
                aja()
                    .url('/beinglate-retry')
                    .timeout(1000)
                    .on('success', function(err){
                        done();
                    })
                    .on('error', function(err) {
                        console.log('beinglate-second error?', err);
                        expect.fail('Thou shalt not execute the error callback on retry.');
                    })
                    .on('timeout', function(err){
                        console.log('beinglate-second timeout?', JSON.stringify(err));
                        expect.fail('Thou shalt not execute the timeout callback on retry.');
                    })

                    .go();
            })
            .go();
    });

    it('should not trigger timeout event if the call succeeds', function(done){
        aja()
            .url('/beinglate-no-to')
            .timeout(1000)
            .on('success', function(err) {
                done();
            })
            .on('error', function(err) {
                expect.fail('Thou shalt not execute the success callback.');
            })
            .on('timeout', function(err){
                expect.fail('Thou shalt not execute the timeout callback.');
            })
            .go();
    });

    it('should bust cache', function(done){
        aja()
            .url('/time')
            .on('success', function(data){
                expect(data).to.be.an('object');
                expect(data.ts).to.be.a('number');
                expect(data.ts).to.be.above(0);
                var ts = data.ts;
                aja()
                    .url('/time')
                    .cache(false)
                    .on('success', function(data){
                        expect(data).to.be.an('object');
                        expect(data.ts).to.be.a('number');
                        expect(data.ts).to.be.above(0);
                        expect(data.ts).to.be.not.equal(ts);
                        done();
                    })
                    .go();
            })
            .go();

    });

    it('should not trigger error when the response is empty', function(done){
        aja()
            .url('/empty')
            .method('post')
            .type('json')
            .data({ kill: 'bill'})
            .on('204', function(data){
                expect(data).to.be.empty;
                done();
            })
            .on('error', function() {
                expect.fail('Should NOT trigger an error.');
            })
            .go();
    });

    it('should handle jsonp', function(done){
        aja()
            .url('/test/samples/data.json')
            .type('jsonp')
            .on('success', function(data){
                expect(data).to.be.an('object');
                expect(data).to.contain.keys(['kill']);
                expect(data.kill).to.equal('bill');
                done();
            })
            .go();
    });

    it('should load a remote script', function(done){
        expect(window).to.not.contain.key('awesomeLib');
        aja()
            .url('/test/samples/lib.js')
            .type('script')
            .on('success', function(){
                expect(window).to.contain.key('awesomeLib');
                expect(window.awesomeLib).to.be.an('object');
                expect(window.awesomeLib).to.contain.keys(['doSomethingCrazy']);
                done();
            })
            .go();
    });
});
