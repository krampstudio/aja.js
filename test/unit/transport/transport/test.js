import QUnit from 'qunitjs';
import transport from '../../../../src/transport/transport.js';

QUnit.module('transport module');

QUnit.test('API', assert => {
    QUnit.expect(1);

    assert.equal(typeof transport, 'function', 'The module exposes a function');
});

QUnit.module('Transport call');

QUnit.test('without a type', assert => {
    const done = assert.async();

    QUnit.expect(2);

    let p = transport();

    assert.ok(p instanceof Promise, 'The transport function returns a Promise');
    p.then( () => {
        assert.ok(false, 'The promise should not resolve without a type');
        done();
    }).catch( err => {
        assert.ok(err instanceof TypeError, 'The promise rejects with a TypeError without a type');
        done();
    });
});

QUnit.test('without a wrong type', assert => {
    const done = assert.async();

    QUnit.expect(2);

    let p = transport('foo');

    assert.ok(p instanceof Promise, 'The transport function returns a Promise');
    p.then( () => {
        assert.ok(false, 'The promise should not resolve with a wrong type');
        done();
    }).catch( err => {
        assert.ok(err instanceof TypeError, 'The promise rejects with a TypeError with a wrong type');
        done();
    });
});
