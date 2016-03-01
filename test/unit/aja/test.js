import QUnit from 'qunitjs';
import aja from '../../../src/aja.js';

QUnit.module('Module');

QUnit.test('aja()', assert => {
    QUnit.expect(3);

    assert.equal(typeof aja, 'function', 'The module exposes a function');
    assert.equal(typeof aja(), 'object', 'The aja function is a factory');
    assert.notDeepEqual(aja(), aja(), 'The aja factory creates a new object');
});

QUnit.module('Accessors');

QUnit.test('aja.url()', assert => {
    QUnit.expect(6);

    const req = aja();
    const url = 'http://www.example.com';

    assert.equal(typeof aja().url, 'function', 'url is a function');

    assert.throws( () => {  aja().url(false); }, TypeError, 'url accepts only strings');
    assert.throws( () => {  aja().url(12); }, TypeError, 'url accepts only strings');
    assert.throws( () => {  aja().url(['a']); }, TypeError, 'url accepts only strings');

    assert.deepEqual(req.url(url), req, 'The method chains');
    assert.equal(req.url(), url, 'get what was set');
});

QUnit.test('aja.sync()', assert => {
    QUnit.expect(6);

    const req = aja();

    assert.equal(typeof aja().sync, 'function', 'sync is a function');

    assert.deepEqual(req.sync(true), req, 'The method chains');
    assert.equal(req.sync(), true, 'get what was set');

    req.sync(false);
    assert.equal(req.sync(), false, 'get what was set');

    req.sync(0);
    assert.equal(req.sync(), false, 'get what was set');

    req.sync(1);
    assert.equal(req.sync(), true, 'get what was set');
});

QUnit.test('aja.cache()', assert => {
    QUnit.expect(6);

    const req = aja();

    assert.equal(typeof aja().cache, 'function', 'cache is a function');

    assert.deepEqual(req.cache(true), req, 'The method chains');
    assert.equal(req.cache(), true, 'get what was set');

    req.cache(false);
    assert.equal(req.cache(), false, 'get what was set');

    req.cache(0);
    assert.equal(req.cache(), false, 'get what was set');

    req.cache(1);
    assert.equal(req.cache(), true, 'get what was set');
});


QUnit.test('aja.type()', assert => {
    QUnit.expect(11);

    const req = aja();

    assert.equal(typeof aja().type, 'function', 'type is a function');

    assert.throws( () => {  aja().type(false); }, TypeError, 'type accepts only defined values');
    assert.throws( () => {  aja().type(12); }, TypeError, 'type accepts only defined values');
    assert.throws( () => {  aja().type(null); }, TypeError, 'type accepts only defined values');
    assert.throws( () => {  aja().type(['a']); }, TypeError, 'type accepts only defined values');
    assert.throws( () => {  aja().type('foo'); }, TypeError, 'type accepts only defined values');

    assert.deepEqual(req.type('html'), req, 'The method chains');
    assert.equal(req.type(), 'html', 'get what was set');

    req.type('json');
    assert.equal(req.type(), 'json', 'get what was set');

    req.type('jsonp');
    assert.equal(req.type(), 'jsonp', 'get what was set');

    req.type('script');
    assert.equal(req.type(), 'script', 'get what was set');

});

QUnit.test('aja.method()', assert => {
    QUnit.expect(17);

    const req = aja();

    assert.equal(typeof aja().method, 'function', 'method is a function');

    assert.throws( () => {  aja().method(false); }, TypeError, 'method accepts only defined values');
    assert.throws( () => {  aja().method(12); }, TypeError, 'method accepts only defined values');
    assert.throws( () => {  aja().method(null); }, TypeError, 'method accepts only defined values');
    assert.throws( () => {  aja().method(['a']); }, TypeError, 'method accepts only defined values');
    assert.throws( () => {  aja().method('foo'); }, TypeError, 'method accepts only defined values');

    assert.deepEqual(req.method('get'), req, 'The method chains');
    assert.equal(req.method(), 'get', 'get what was set');

    req.method('GET');
    assert.equal(req.method(), 'get', 'The method is always lower cased');

    req.method('connect');
    assert.equal(req.method(), 'connect', 'get what was set');

    req.method('delete');
    assert.equal(req.method(), 'delete', 'get what was set');

    req.method('head');
    assert.equal(req.method(), 'head', 'get what was set');

    req.method('options');
    assert.equal(req.method(), 'options', 'get what was set');

    req.method('patch');
    assert.equal(req.method(), 'patch', 'get what was set');

    req.method('post');
    assert.equal(req.method(), 'post', 'get what was set');

    req.method('put');
    assert.equal(req.method(), 'put', 'get what was set');

    req.method('trace');
    assert.equal(req.method(), 'trace', 'get what was set');

});

QUnit.test('aja.header()', assert => {
    QUnit.expect(11);

    const req = aja();
    const name = 'Content-Type';
    const values = {
        json : 'application/json',
        post : 'application/x-www-form-urlencoded;charset=utf-8'
    };

    assert.equal(typeof aja().header, 'function', 'header is a function');

    assert.throws( () => {  aja().header(); }, TypeError, 'header needs a name even as a getter');
    assert.throws( () => {  aja().header(false); }, TypeError, 'header accepts only strings as name');
    assert.throws( () => {  aja().header(12); }, TypeError, 'header accepts only strings as name');
    assert.throws( () => {  aja().header(['a']); }, TypeError, 'header accepts only strings as name');

    assert.throws( () => {  aja().header(name, false); }, TypeError, 'header accepts only strings as value');
    assert.throws( () => {  aja().header(name, 12); }, TypeError, 'header accepts only strings as value');
    assert.throws( () => {  aja().header(name, ['a']); }, TypeError, 'header accepts only strings as value');

    assert.deepEqual(req.header(name, values.json), req, 'The method chains');
    assert.equal(req.header(name), values.json, 'get what was set');

    req.header(name, values.post);
    assert.equal(req.header(name), values.post, 'get what was set');
});

QUnit.test('aja.auth()', assert => {
    QUnit.expect(10);

    const req = aja();
    const user = 'admin';
    const passwd = 'admin123';

    assert.equal(typeof aja().auth, 'function', 'auth is a function');

    assert.throws( () => {  aja().auth(false); }, TypeError, 'auth accepts only strings as user');
    assert.throws( () => {  aja().auth(12); }, TypeError, 'auth accepts only strings as user');
    assert.throws( () => {  aja().auth(['a']); }, TypeError, 'auth accepts only strings as user');

    assert.throws( () => {  aja().auth(user, false); }, TypeError, 'auth accepts only strings as password');
    assert.throws( () => {  aja().auth(user, 12); }, TypeError, 'auth accepts only strings as password');
    assert.throws( () => {  aja().auth(user, ['a']); }, TypeError, 'auth accepts only strings as password');

    assert.throws( () => {  aja().auth(); }, TypeError, 'auth works only as setter');
    assert.throws( () => {  aja().auth(user); }, TypeError, 'auth works only as setter');

    assert.deepEqual(req.auth(user, passwd), req, 'The method chains');
});

QUnit.test('aja.queryString()', assert => {
    QUnit.expect(8);

    const req = aja();
    const data = {foo : 'bar'};
    const data2 = { moo : false };
    const qs  = '?foo=bar&';

    assert.equal(typeof aja().queryString, 'function', 'queryString is a function');

    assert.throws( () => {  aja().queryString(false); }, TypeError, 'queryString accepts only strings or objects');
    assert.throws( () => {  aja().queryString(12); }, TypeError, 'queryString accepts only strings or objects');
    assert.throws( () => {  aja().queryString(['a']); }, TypeError, 'queryString accepts only strings or objects');
    assert.throws( () => {  aja().queryString(new Date()); }, TypeError, 'queryString accepts only strings or objects');

    assert.deepEqual(req.queryString(qs), req, 'The method chains');
    assert.deepEqual(req.queryString(), data, 'Get the data set as string');

    req.queryString(data2);
    assert.deepEqual(req.queryString(), data2, 'Get the data set as string');
});

QUnit.test('aja.data()', assert => {
    QUnit.expect(9);

    const req = aja();
    const data = {foo : 'bar'};
    const data2 = { moo : false, norz : 12 };

    assert.equal(typeof aja().data, 'function', 'data is a function');

    assert.throws( () => {  aja().data(false); }, TypeError, 'data accepts only plain objects');
    assert.throws( () => {  aja().data(12); }, TypeError, 'data accepts only plain objects');
    assert.throws( () => {  aja().data(['a']); }, TypeError, 'data accepts only plain objects');
    assert.throws( () => {  aja().data('a'); }, TypeError, 'data accepts only plain objects');
    assert.throws( () => {  aja().data(new Date()); }, TypeError, 'data accepts only plain objects');

    assert.deepEqual(req.data(data), req, 'The method chains');
    assert.deepEqual(req.data(), data, 'Get the data set as string');

    req.data(data2);
    assert.deepEqual(req.data(), data2, 'Get the data set as string');
});

QUnit.test('aja.body()', assert => {
    QUnit.expect(7);

    const req = aja();
    const values = {
        bool : true,
        string : 'foo',
        qs : 'foo=bar',
        plain : { moo: { foo : 'bar' } },
        arr : ['a', 'b']
    };

    assert.equal(typeof aja().body, 'function', 'body is a function');

    assert.deepEqual(req.body(values.bool), req, 'The method chains');
    assert.equal(req.body(), JSON.stringify(values.bool) , 'Get the data set as string');

    req.body(values.string);
    assert.equal(req.body(), values.string, 'Get the data set as string');

    req.body(values.qs);
    assert.equal(req.body(), values.qs, 'Get the data set as string');

    req.body(values.plain);
    assert.deepEqual(req.body(), JSON.stringify(values.plain), 'Get the data set as string');

    req.body(values.arr);
    assert.deepEqual(req.body(), JSON.stringify(values.arr), 'Get the data set as string');
});

QUnit.test('aja.into()', assert => {
    QUnit.expect(8);

    const req = aja();
    const selector1 = '#foo-container';
    const container1 = document.querySelectorAll(selector1);
    const container2 = document.querySelectorAll('.bar');

    assert.equal(typeof aja().into, 'function', 'into is a function');

    assert.throws( () => {  aja().into(false); }, TypeError, 'into accepts only selectors or HTMLElements');
    assert.throws( () => {  aja().into(12); }, TypeError, 'into accepts only selectors or HTMLElements');
    assert.throws( () => {  aja().into(['a']); }, TypeError, 'into accepts only selectors or HTMLELements');
    assert.throws( () => {  aja().into(new Date()); }, TypeError, 'into accepts only selectors or HTMLElements');

    assert.deepEqual(req.into(selector1), req, 'The method chains');
    assert.deepEqual(req.into(), container1, 'Get the element from the selector ');

    req.into(container2);
    assert.deepEqual(req.into(), container2, 'Get the set element');
});

QUnit.test('aja.jsonPaddingName()', assert => {
    QUnit.expect(8);

    const req = aja();
    const name = 'cb';
    const name2 = 'callback';

    assert.equal(typeof aja().jsonPaddingName, 'function', 'jsonPaddingName is a function');

    assert.throws( () => {  aja().jsonPaddingName(false); }, TypeError, 'jsonPaddingName accepts only strings');
    assert.throws( () => {  aja().jsonPaddingName(12); }, TypeError, 'jsonPaddingName accepts only strings');
    assert.throws( () => {  aja().jsonPaddingName(['a']); }, TypeError, 'jsonPaddingName accepts only string');
    assert.throws( () => {  aja().jsonPaddingName(new Date()); }, TypeError, 'jsonPaddingName accepts only string');

    assert.deepEqual(req.jsonPaddingName(name), req, 'The method chains');
    assert.deepEqual(req.jsonPaddingName(), name, 'Get the data set as string');

    req.jsonPaddingName(name2);
    assert.deepEqual(req.jsonPaddingName(), name2, 'Get the data set as string');
});

QUnit.test('aja.jsonPadding()', assert => {
    QUnit.expect(12);

    const req = aja();
    const name = 'cb';
    const name2 = 'callback';

    assert.equal(typeof aja().jsonPadding, 'function', 'jsonPadding is a function');

    assert.throws( () => {  aja().jsonPadding(false); }, TypeError, 'jsonPadding accepts only function name');
    assert.throws( () => {  aja().jsonPadding(12); }, TypeError, 'jsonPadding accepts only function name');
    assert.throws( () => {  aja().jsonPadding(['a']); }, TypeError, 'jsonPadding accepts only function name');
    assert.throws( () => {  aja().jsonPadding(new Date()); }, TypeError, 'jsonPadding accepts only function name');
    assert.throws( () => {  aja().jsonPadding('1globalfn'); }, TypeError, 'jsonPadding accepts only function name');
    assert.throws( () => {  aja().jsonPadding('[globalfn'); }, TypeError, 'jsonPadding accepts only function name');
    assert.throws( () => {  aja().jsonPadding('global fn'); }, TypeError, 'jsonPadding accepts only function name');
    assert.throws( () => {  aja().jsonPadding('glöbàl fn'); }, TypeError, 'jsonPadding accepts only function name');

    assert.deepEqual(req.jsonPadding(name), req, 'The method chains');
    assert.deepEqual(req.jsonPadding(), name, 'Get the data set as string');

    req.jsonPadding(name2);
    assert.deepEqual(req.jsonPadding(), name2, 'Get the data set as string');
});

QUnit.test('aja.timeout()', assert => {
    QUnit.expect(9);

    const req = aja();
    const value = 10000;
    const value2 = 1.5 * 1000;

    assert.equal(typeof aja().timeout, 'function', 'timeout is a function');

    assert.throws( () => {  aja().timeout(false); }, TypeError, 'timeout accepts only integers');
    assert.throws( () => {  aja().timeout([1000]); }, TypeError, 'timeout accepts only integers');
    assert.throws( () => {  aja().timeout(0.25); }, TypeError, 'timeout accepts only integers');
    assert.throws( () => {  aja().timeout(new Date()); }, TypeError, 'timeout accepts only integers');
    assert.throws( () => {  aja().timeout('12'); }, TypeError, 'timeout accepts only integers');

    assert.deepEqual(req.timeout(value), req, 'The method chains');
    assert.deepEqual(req.timeout(), value, 'Get the data set');

    req.timeout(value2);
    assert.deepEqual(req.timeout(), value2, 'Get the data set');
});

QUnit.module('Events');

QUnit.test('api', assert => {
    QUnit.expect(3);

    assert.equal(typeof aja().on, 'function', 'The function on is exposed');
    assert.equal(typeof aja().off, 'function', 'The function off is exposed');
    assert.equal(typeof aja().trigger, 'function', 'The function trigger is exposed');
});

QUnit.test('register a handler', assert => {
    QUnit.expect(3);

    const req = aja();
    const done = assert.async();
    const cb = function (){
        assert.ok(true, 'The event callback is executed');
        assert.deepEqual(this, req, 'The callback is executed within the aja instance context');
        done();
    };

    assert.equal(req.on('foo', cb), req, 'The on method chains');
    req.trigger('foo');
});

QUnit.test('register multiple handlers', assert => {
    QUnit.expect(2);

    const req = aja();
    const done1 = assert.async();
    const done2 = assert.async();

    const cb1 = function (){
        assert.ok(true, 'The event callback is executed');
        done1();
    };

    const cb2 = function (){
        assert.ok(true, 'The event callback is executed');
        done2();
    };

    req.on('foo', cb1)
       .on('foo', cb2)
       .trigger('foo');
});

QUnit.test('remove a handler', assert => {
    QUnit.expect(2);

    const req = aja();
    const done = assert.async();
    const cb = () => assert.ok(false, 'The event callback should not be executed');

    req.on('foo', cb);

    assert.equal(req.off('foo'), req, 'The on method chains');
    assert.equal(req.trigger('foo'), req, 'The on method chains');

    setTimeout( done, 50);
});
/*
        describe('on/off/trigger', function(){


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
*/
