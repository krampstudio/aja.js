/*
 * grunt-contrib-qunit
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

/* eslint-disable no-alert */
/* global QUnit: true, define : true, __coverage__ : true */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        require(['qunit'], factory);
    } else {
        factory(QUnit);
    }
}(function(QUnit) {
    'use strict';

    // Don't re-order tests.
    QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    QUnit.config.autorun = false;

    // Send messages to the parent PhantomJS process via alert! Good times!!
    function sendMessage() {
        var args = [].slice.call(arguments);
        alert(JSON.stringify(args));
    }

    // These methods connect QUnit to PhantomJS.
    QUnit.log(function(obj) {
        // What is this I don’t even
        if (obj.message === '[object Object], undefined:undefined') {
            return;
        }

        // Parse some stuff before sending it.
        var actual, expected, dump;
        if (!obj.result) {
            // In order to maintain backwards compatibility with `QUnit <1.15.0`
            // Older versions of QUnit (`<1.15.0`) use `QUnit.jsDump`, but this poperty was
            // deprecated and moved to `QUnit.dump` and will be removed in `QUnit 2.0`.
            dump = QUnit.dump || QUnit.jsDump;

            // Dumping large objects can be very slow, and the dump isn't used for
            // passing tests, so only dump if the test failed.
            actual = dump.parse(obj.actual);
            expected = dump.parse(obj.expected);
        }
        // Send it.
        sendMessage('qunit.log', obj.result, actual, expected, obj.message, obj.source);
    });

    QUnit.testStart(function(obj) {
        sendMessage('qunit.testStart', obj.name);
    });

    QUnit.testDone(function(obj) {
        sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total, obj.duration);
    });

    QUnit.moduleStart(function(obj) {
        sendMessage('qunit.moduleStart', obj.name);
    });

    QUnit.moduleDone(function(obj) {
        sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total);
    });

    QUnit.begin(function() {
        sendMessage('qunit.begin');
    });

    QUnit.done(function(obj) {

        sendMessage('qunit.coverage', __coverage__);
        sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime);

    });

}));

