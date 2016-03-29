import QUnit from 'qunitjs';
import aja from '../../src/aja.js';
import jsonData from '../samples/data.json';


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

QUnit.test('GET with a queryString', assert => {
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

QUnit.test('POST urlencoded data', assert => {
    QUnit.expect(2);
    const done = assert.async();
    const req = aja();
    const data = { kill: 'bill' };

    req
        .url('/mirror')
        .method('post')
        .data(data)
        .on('success', function(received){
            assert.equal(typeof received, 'object', 'We have received data');
            assert.deepEqual(received.body, data, 'The sent data matches');
            done();
        })
        .go();
});

QUnit.test('PUT urlencoded data', assert => {
    QUnit.expect(2);
    const done = assert.async();
    const req = aja();
    const data = { kill: 'bill' };

    req
        .url('/mirror')
        .method('put')
        .data(data)
        .on('success', function(received){
            assert.equal(typeof received, 'object', 'We have received data');
            assert.deepEqual(received.body, data, 'The sent data matches');
            done();
        })
        .go();
});

QUnit.test('GET a 200 like event on valid URLs', assert => {
    QUnit.expect(4);
    const done1 = assert.async();
    const done2 = assert.async();
    const req = aja();

    req
        .url('/test/samples/data.json')
        .on('200', function(received){
            assert.equal(typeof received, 'object', 'We have received data');
            assert.deepEqual(received, jsonData, 'The sent data matches');
            done1();
        })
        .on('20x', function(received){
            assert.equal(typeof received, 'object', 'We have received data');
            assert.deepEqual(received, jsonData, 'The sent data matches');
            done2();
        })
        .go();
});

QUnit.module('errors');

QUnit.test('GET a 404 event on not found URLs', assert => {
    QUnit.expect(4);
    const done1 = assert.async();
    const done2 = assert.async();
    const url   = '/zamples/zaza.json';
    const msg   = `Cannot GET ${url}`;
    const req = aja();

    req
        .url(url)
        .on('404', function(received){
            assert.equal(typeof received, 'string', 'We have received data');
            assert.equal(received.trim(), msg, 'The received message matches');
            done1();
        })
        .on('4xx', function(received){
            assert.equal(typeof received, 'string', 'We have received data');
            assert.equal(received.trim(), msg, 'The received message matches');
            done2();
        })
        .go();
});

QUnit.test('network failure', assert => {
    QUnit.expect(2);
    const done1 = assert.async();
    const req = aja();

    req
        .url('http://notallowed.example')
        .timeout(1000)
        .on('error', received => {
            assert.equal(typeof received, 'object', 'We have received data');
            assert.equal(received.type, 'error', 'We have received an error event');
            done1();
        })
        .go();
});

QUnit.test('network failure, even if there is a timeout', assert => {
    QUnit.expect(2);
    const done1 = assert.async();
    const req = aja();

    req
        .url('http://notallowed.example')
        .timeout(500)
        .on('error', received => {
            setTimeout( () => {
                assert.equal(typeof received, 'object', 'We have received data');
                assert.equal(received.type, 'error', 'We have received an error event');
                done1();
            }, 1000);
        })
        .on('timeout', () => assert.ok(false, 'Timeout called') )
        .go();
});

QUnit.test('timeout', assert => {
    QUnit.expect(1);
    const done1 = assert.async();
    const req = aja();

    req
        .url('/beinglate')
        .timeout(300)
        .on('success', () => assert.ok(false, 'Thou shalt not execute the success callback.'))
        .on('error', err => assert.ok(false, 'Thou shalt not execute the error callback: ' + err))
        .on('timeout', err => {
            setTimeout( () => {
                assert.deepEqual(err, { type: 'timeout', expiredAfter: 300}, 'The timeout data is correct');
                done1();
            }, 10);
        })
        .go();
});

QUnit.test('empty response', assert => {
    QUnit.expect(1);
    const done = assert.async();
    const req = aja();
    req.url('/empty')
       .method('post')
       .type('json')
       .data({ kill: 'bill'})
       .on('204', function(data){
           assert.equal(data, null, 'The response is empty');
           done();
       })
       .on('error', function() {
           assert.ok(false, 'Should NOT trigger an error.');
       })
       .go();
});

QUnit.module('jsonp');

QUnit.test('load json', assert => {
    QUnit.expect(2);
    const done1 = assert.async();
    const req = aja();

    req
        .url('/test/samples/data.json')
        .type('jsonp')
        .on('error', err => assert.ok(false, 'jsonp should succeed : ' + err))
        .on('success', received => {
            assert.equal(typeof received, 'object', 'We have received some data');
            assert.deepEqual(received, jsonData, 'We have received the right data');
            done1();
        })
        .go();
});

QUnit.module('script');

QUnit.test('load a remote script', assert => {
    QUnit.expect(3);
    const done1 = assert.async();
    const req = aja();

    assert.equal(typeof window.awesomeLib, 'undefined', 'window does not contain the library');

    req
        .url('/test/samples/lib.js')
        .type('script')
        .on('error', err => assert.ok(false, 'script loading should succeed : ' + err))
        .on('success', () => {
            assert.equal(typeof window.awesomeLib, 'object', 'The library is loaded');
            assert.equal(typeof window.awesomeLib.doSomethingCrazy, 'function', 'The library is loaded and expose the functions');
            done1();
        })
        .go();
});
