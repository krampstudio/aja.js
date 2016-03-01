import QUnit from 'qunitjs';
import aja from '../../src/aja.js';
import jsonData from '../samples/data.json';


QUnit.module('JSON');



QUnit.module('HTML');

QUnit.test('load html into an element', assert => {
    QUnit.expect(7);
    const done = assert.async();
    const req = aja();

    const elt1 = document.querySelector('#qunit-fixture .container');
    assert.ok(elt1 instanceof HTMLElement, 'The target container exists');
    assert.equal(elt1.children.length, 0, 'The target container is empty');

    req
        .url('/test/samples/data.html')
        .into(elt1)
        .on('error', err => {
            assert.ok(false, err);
            done();
        })
        .on('success', function(data){
            assert.equal(typeof data, 'string', 'The received data is a string');
            assert.equal(data.trim(), '<h1>Django</h1><p>Unchained</p>', 'The received data matches');
            assert.equal(elt1.children.length, 2, 'The container has now 2 children');
            assert.equal(elt1.children[0].tagName, 'H1', 'The first child is a heading');
            assert.equal(elt1.children[1].tagName, 'P', 'The second is a paragraph');
            done();
        })
        .go();
});

QUnit.test('load html into a selector', assert => {
    QUnit.expect(7);
    const done = assert.async();
    const req = aja();

    const selector = '#qunit-fixture .container';
    const elt1 = document.querySelector(selector);
    assert.ok(elt1 instanceof HTMLElement, 'The target container exists');
    assert.equal(elt1.children.length, 0, 'The target container is empty');

    req
        .url('/test/samples/data.html')
        .into(selector)
        .on('error', err => {
            assert.ok(false, err);
            done();
        })
        .on('success', function(data){
            assert.equal(typeof data, 'string', 'The received data is a string');
            assert.equal(data.trim(), '<h1>Django</h1><p>Unchained</p>', 'The received data matches');
            assert.equal(elt1.children.length, 2, 'The container has now 2 children');
            assert.equal(elt1.children[0].tagName, 'H1', 'The first child is a heading');
            assert.equal(elt1.children[1].tagName, 'P', 'The second is a paragraph');
            done();
        })
        .go();
});

QUnit.module('REST');

QUnit.test('load json data', assert => {
    QUnit.expect(3);
    const done = assert.async();
    const req = aja();

    req
        .url('/test/samples/data.json')
        .on('error', err => {
            assert.ok(false, err);
            done();
        })
        .on('success', function(data){
            assert.deepEqual(this, req, 'The callback is executed in the instance context');
            assert.equal(typeof data, 'object', 'The request sends an object');
            assert.deepEqual(data, jsonData, 'The receive data matches');
            done();
        })
        .go();
});

QUnit.test('should get with a queryString', assert => {
    QUnit.expect(2);
    const done = assert.async();
    const req = aja();
    const query = { kill: 'bill' };

    req
        .url('/mirror')
        .queryString(query)
        .on('success', function(data){
            assert.equal(typeof data, 'object', 'We have received data');
            assert.deepEqual(data.queryString, query, 'The sent data matches');
            done();
        })
        .go();
});

    //it('should post urlencoded data', function(done){
        //aja()
            //.url('/mirror')
            //.method('post')
            //.data({ kill: 'bill'})
            //.on('success', function(data){
                //expect(data).to.be.an('object');
                //expect(data.body).to.be.an('object');
                //expect(data.body).to.contain.keys(['kill']);
                //done();
            //})
            //.go();
    //});

    //it('should put urlencoded data', function(done){
        //aja()
            //.url('/mirror')
            //.method('put')
            //.data({ kill: 'bill'})
            //.on('success', function(data){
                //expect(data).to.be.an('object');
                //expect(data.body).to.be.an('object');
                //expect(data.body).to.contain.keys(['kill']);
                //done();
            //})
            //.go();
    //});

    //it('should load the json sample and trigger a 200', function(done){
        //aja()
            //.url('/test/samples/data.json')
            //.on('200', function(data){
                //expect(data).to.be.an('object');
                //expect(data).to.contain.keys(['kill']);
                //expect(data.kill).to.equal('bill');
                //done();
            //})
            //.go();
    //});

    //it('should load the json sample and trigger a 20x like', function(done){
        //aja()
            //.url('/test/samples/data.json')
            //.on('20x', function(data){
                //expect(data).to.be.an('object');
                //expect(data).to.contain.keys(['kill']);
                //expect(data.kill).to.equal('bill');
                //done();
            //})
            //.go();
    //});

    //it('should trigger a 404 on wrong URL', function(done){
        //aja()
            //.url('/test/zamples/zaza.json')
            //.on('404', function(data){
                //expect(data).to.be.an('string');
                //done();
            //})
            //.go();
    //});

    //it('should trigger an error on network failure', function(done){
        //aja()
            //.url('http://notallowed.example')
            //.on('error', function(data){
                //expect(data).to.contain.keys(['target', 'srcElement']);
                //expect(data.type).to.equal('error');
                //done();
            //})
            //.go();
    //});

    //it('should trigger an error on network failure, even if there is a timeout', function(done){
        //aja()
            //.url('http://notallowed.example')
            //.timeout(1000)
            //.on('error', function(data){
                //expect(data).to.contain.keys(['target', 'srcElement']);
                //expect(data.type).to.equal('error');
                //done();
            //})
            //.go();
    //});

    //it('should trigger timeout event after timeout threshold is reached', function(done){
        //aja()
            //.url('/beinglate')
            //.timeout(300)
            //.on('success', function(err) {
                //expect.fail('Thou shalt not execute the success callback.');
            //})
            //.on('error', function(err) {
                //expect.fail('Thou shalt not execute the error callback.');
            //})
            //.on('timeout', function(err){
                //expect(err).to.deep.equal({
                    //type: 'timeout',
                    //expiredAfter: 300
                //});
                //done();
            //})
            //.go();
    //});

    //it('should trigger the success callback on retry after a timeout', function(done){
        //aja()
            //.url('/beinglate-retry')
            //.timeout(250)
            //.on('success', function(err) {
                //expect.fail('Thou shalt not execute the success callback.');
            //})
            //.on('error', function(err) {
                //expect.fail('Thou shalt not execute the error callback.');
            //})
            //.on('timeout', function(err){
                //aja()
                    //.url('/beinglate-retry')
                    //.timeout(1000)
                    //.on('success', function(err){
                        //done();
                    //})
                    //.on('error', function(err) {
                        //console.log('beinglate-second error?', err);
                        //expect.fail('Thou shalt not execute the error callback on retry.');
                    //})
                    //.on('timeout', function(err){
                        //console.log('beinglate-second timeout?', JSON.stringify(err));
                        //expect.fail('Thou shalt not execute the timeout callback on retry.');
                    //})

                    //.go();
            //})
            //.go();
    //});

    //it('should not trigger timeout event if the call succeeds', function(done){
        //aja()
            //.url('/beinglate-no-to')
            //.timeout(1000)
            //.on('success', function(err) {
                //done();
            //})
            //.on('error', function(err) {
                //expect.fail('Thou shalt not execute the success callback.');
            //})
            //.on('timeout', function(err){
                //expect.fail('Thou shalt not execute the timeout callback.');
            //})
            //.go();
    //});

    //it('should bust cache', function(done){
        //aja()
            //.url('/time')
            //.on('success', function(data){
                //expect(data).to.be.an('object');
                //expect(data.ts).to.be.a('number');
                //expect(data.ts).to.be.above(0);
                //var ts = data.ts;
                //aja()
                    //.url('/time')
                    //.cache(false)
                    //.on('success', function(data){
                        //expect(data).to.be.an('object');
                        //expect(data.ts).to.be.a('number');
                        //expect(data.ts).to.be.above(0);
                        //expect(data.ts).to.be.not.equal(ts);
                        //done();
                    //})
                    //.go();
            //})
            //.go();

    //});

    //it('should not trigger error when the response is empty', function(done){
        //aja()
            //.url('/empty')
            //.method('post')
            //.type('json')
            //.data({ kill: 'bill'})
            //.on('204', function(data){
                //expect(data).to.be.empty;
                //done();
            //})
            //.on('error', function() {
                //expect.fail('Should NOT trigger an error.');
            //})
            //.go();
    //});

    //it('should handle jsonp', function(done){
        //aja()
            //.url('/test/samples/data.json')
            //.type('jsonp')
            //.on('success', function(data){
                //expect(data).to.be.an('object');
                //expect(data).to.contain.keys(['kill']);
                //expect(data.kill).to.equal('bill');
                //done();
            //})
            //.go();
    //});

    //it('should load a remote script', function(done){
        //expect(window).to.not.contain.key('awesomeLib');
        //aja()
            //.url('/test/samples/lib.js')
            //.type('script')
            //.on('success', function(){
                //expect(window).to.contain.key('awesomeLib');
                //expect(window.awesomeLib).to.be.an('object');
                //expect(window.awesomeLib).to.contain.keys(['doSomethingCrazy']);
                //done();
            //})
            //.go();
    //});
//});
