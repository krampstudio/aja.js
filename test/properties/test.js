/* global describe, it, expect */

var aja = window.aja;

describe('aja()', function(){

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

            it('should accept only strings', function(){
                expect(function(){ aja().url(false); }).to.throw(TypeError);
                expect(function(){ aja().url('http://www.example.com'); }).to.not.throw();
            });

            it('should get the set url', function(){
                expect(aja().url('http://www.example.com').url()).to.equals('http://www.example.com');
            });

            it('should chain', function(){
                var a = aja();
                expect(a.url('http://www.example.com')).to.be.an('object');
                expect(a.url('http://www.example.com')).to.equals(a);
            });
        });

        describe('sync()', function(){

            it('should be a function', function(){
                expect(aja().sync).to.be.a('function');
            });

            it('should get the set value', function(){
                expect(aja().sync(true).sync()).to.equals(true);
                expect(aja().sync(1).sync()).to.equals(true);
                expect(aja().sync(false).sync()).to.equals(false);
                expect(aja().sync(0).sync()).to.equals(false);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.sync(true)).to.be.an('object');
                expect(a.sync(true)).to.equals(a);
            });
        });

        describe('cache()', function(){

            it('should be a function', function(){
                expect(aja().cache).to.be.a('function');
            });

            it('should get / set value', function(){
                expect(aja().cache(true).cache()).to.equals(true);
                expect(aja().cache(1).cache()).to.equals(true);
                expect(aja().cache(false).cache()).to.equals(false);
                expect(aja().cache(0).cache()).to.equals(false);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.cache(true)).to.be.an('object');
                expect(a.cache(true)).to.equals(a);
            });
        });

        describe('type()', function(){

            it('should be a function', function(){
                expect(aja().type).to.be.a('function');
            });

            it('should accept only defined values', function(){

                expect(function(){ aja().type(false); }).to.throw(TypeError);
                expect(function(){ aja().type('toto'); }).to.throw(TypeError);
                expect(function(){ aja().type(12); }).to.throw(TypeError);
                expect(function(){ aja().type('text'); }).to.throw(TypeError);

                expect(function(){ aja().type('json'); }).to.not.throw();
                expect(function(){ aja().type('html'); }).to.not.throw();
                expect(function(){ aja().type('jsonp'); }).to.not.throw();
                expect(function(){ aja().type('script'); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().type('json').type()).to.equals('json');
                expect(aja().type('html').type()).to.equals('html');
            });

            it('should chain', function(){
                var a = aja();
                expect(a.type('json')).to.be.an('object');
                expect(a.type('json')).to.equals(a);
            });
        });

        describe('method()', function(){

            it('should be a function', function(){
                expect(aja().method).to.be.a('function');
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
                expect(function(){ aja().method('patch'); }).to.not.throw();
                expect(function(){ aja().method('options'); }).to.not.throw();
                expect(function(){ aja().method('connect'); }).to.not.throw();
                expect(function(){ aja().method('Trace'); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().method('get').method()).to.equals('get');
                expect(aja().method('post').method()).to.equals('post');
                expect(aja().method('patch').method()).to.equals('patch');
            });

            it('should chain', function(){
                var a = aja();
                expect(a.method('get')).to.be.an('object');
                expect(a.method('get')).to.equals(a);
            });
        });

        describe('header()', function(){
            var header = 'Content-Type';
            var values = {
                json : 'application/json',
                post : 'application/x-www-form-urlencoded;charset=utf-8'
            };

            it('should be a function', function(){
                expect(aja().header).to.be.a('function');
            });

            it('should accept only strings', function(){

                expect(function(){ aja().header(false); }).to.throw(TypeError);
                expect(function(){ aja().header(header, 1); }).to.throw(TypeError);
                expect(function(){ aja().header(12, values.json); }).to.throw(TypeError);

                expect(function(){ aja().header(header, values.json); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().header(header, values.json).header(header)).to.equal(values.json);
                expect(aja().header(header, values.post).header(header)).to.equal(values.post);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.header(header, values.json)).to.be.an('object');
                expect(a.header(header, values.json)).to.equals(a);
            });
        });

        describe('auth()', function(){
            var user = 'admin';
            var passwd = 'admin123';

            it('should be a function', function(){
                expect(aja().auth).to.be.a('function');
            });

            it('should accept only strings', function(){

                expect(function(){ aja().auth(false); }).to.throw(TypeError);
                expect(function(){ aja().auth(user, 123); }).to.throw(TypeError);
                expect(function(){ aja().auth([], passwd); }).to.throw(TypeError);

                expect(function(){ aja().auth(user, passwd); }).to.not.throw();
            });

            it('should set value (only)', function(){
                expect(function(){ aja().auth(user, passwd); }).to.not.throw();
                expect(function(){ aja().auth(user, passwd).auth(user); }).to.throw(TypeError);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.auth(user, passwd)).to.be.an('object');
                expect(a.auth(user, passwd)).to.equals(a);
            });
        });

        describe('queryString()', function(){
            var data = {foo : 'bar'};
            var qs  = '?foo=bar&';

            it('should be a function', function(){
                expect(aja().queryString).to.be.a('function');
            });

            it('should accept plain object or strings', function(){

                expect(function(){ aja().queryString(false); }).to.throw(TypeError);
                expect(function(){ aja().queryString([]); }).to.throw(TypeError);

                expect(function(){ aja().queryString("foo=bar"); }).to.not.throw();
                expect(function(){ aja().queryString(data); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().queryString(data).queryString()).to.equal(data);
                expect(aja().queryString(qs).queryString()).to.deep.equal(data);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.queryString(data)).to.be.an('object');
                expect(a.queryString(data)).to.equals(a);
            });
        });

        describe('data()', function(){
            var data = {foo : 'bar'};
            it('should be a function', function(){
                expect(aja().data).to.be.a('function');
            });

            it('should accept plain objects', function(){

                expect(function(){ aja().data(false); }).to.throw(TypeError);
                expect(function(){ aja().data("foo=bar"); }).to.throw(TypeError);
                expect(function(){ aja().data([]); }).to.throw(TypeError);

                expect(function(){ aja().data(data); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().data(data).data()).to.equal(data);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.data(data)).to.be.an('object');
                expect(a.data(data)).to.equals(a);
            });
        });

        describe('body()', function(){

            it('should be a function', function(){
                expect(aja().body).to.be.a('function');
            });

            it('should accept any value', function(){

                expect(function(){ aja().body(false); }).to.not.throw();
                expect(function(){ aja().body("foo=bar"); }).to.not.throw();
                expect(function(){ aja().body(['foo', 'bar']); }).to.not.throw();
                expect(function(){ aja().body({foo : 'bar'}); }).to.not.throw();
                expect(function(){ aja().body(new FormData()); }).to.not.throw();
            });

            it('should get / set value', function(){

                expect(aja().body(false).body()).to.equal('false');
                expect(aja().body('foo=bar').body()).to.equal('foo=bar');

                var arr = ['foo', 'bar'];
                expect(aja().body(arr).body()).to.equal(JSON.stringify(arr));

                var obj = {foo: 'bar'};
                expect(aja().body(obj).body()).to.equal(JSON.stringify(obj));

                var fdata = new FormData();
                expect(aja().body(fdata).body()).to.equal(fdata);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.body('a')).to.be.an('object');
                expect(a.body('b')).to.equals(a);
            });
        });

        describe('into()', function(){

            it('should be a function', function(){
                expect(aja().into).to.be.a('function');
            });

            it('should accept only selectors and HTMLElement', function(){

                expect(function(){ aja().into('#foo-container'); }).to.not.throw();
                expect(function(){ aja().into('#fixtures > .bar'); }).to.not.throw();
                expect(function(){ aja().into(document.getElementById('foo-container')); }).to.not.throw();
                expect(function(){ aja().into(false); }).to.throw(TypeError);
                expect(function(){ aja().into(new Date()); }).to.throw(TypeError);
                expect(function(){ aja().into([]); }).to.throw(TypeError);

            });

            it('should get / set value', function(){
                var elt = document.getElementById('foo-container');
                expect(aja().into(elt).into()).to.be.an('array');
                expect(aja().into(elt).into()[0]).to.be.an.instanceOf(HTMLElement);
                expect(aja().into('#foo-container').into()[0]).to.be.an.instanceof(HTMLElement);
                expect(aja().into(elt).into()[0].id).to.equal(elt.id);
                expect(aja().into('#foo-container').into()[0].id).to.equal(elt.id);

            });

            it('should chain', function(){
                var a = aja();
                expect(a.into('#foo-container')).to.be.an('object');
                expect(a.into('#foo-container')).to.equals(a);
            });
        });

        describe('jsonPaddingName()', function(){

            it('should be a function', function(){
                expect(aja().jsonPaddingName).to.be.a('function');
            });

            it('should accept only strings', function(){

                expect(function(){ aja().jsonPaddingName(false); }).to.throw(TypeError);
                expect(function(){ aja().jsonPaddingName([]); }).to.throw(TypeError);

                expect(function(){ aja().jsonPaddingName("cb"); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().jsonPaddingName('cb').jsonPaddingName()).to.equal('cb');
                expect(aja().jsonPaddingName('callback').jsonPaddingName()).to.equal('callback');

            });

            it('should chain', function(){
                var a = aja();
                expect(a.jsonPaddingName('cb')).to.be.an('object');
                expect(a.jsonPaddingName('cb')).to.equals(a);
            });
        });

        describe('jsonPadding()', function(){

            it('should be a function', function(){
                expect(aja().jsonPadding).to.be.a('function');
            });

            it('should accept only valid function names', function(){

                expect(function(){ aja().jsonPadding(false); }).to.throw(TypeError);
                expect(function(){ aja().jsonPadding([]); }).to.throw(TypeError);
                expect(function(){ aja().jsonPadding("1globalfn"); }).to.throw(TypeError);
                expect(function(){ aja().jsonPadding("[globalfn"); }).to.throw(TypeError);
                expect(function(){ aja().jsonPadding("églobalfn"); }).to.throw(TypeError);

                expect(function(){ aja().jsonPadding("globalfn"); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().jsonPadding('cb').jsonPadding()).to.equal('cb');
                expect(aja().jsonPadding('callback').jsonPadding()).to.equal('callback');

            });

            it('should chain', function(){
                var a = aja();
                expect(a.jsonPadding('cb')).to.be.an('object');
                expect(a.jsonPadding('cb')).to.equals(a);
            });
        });


        describe('timeout()', function(){

            it('should be a function', function(){
                expect(aja().timeout).to.be.a('function');
            });

            it('should accept only an integer', function(){
                expect(function(){ aja().timeout(false); }).to.throw(TypeError);
                expect(function(){ aja().timeout([]); }).to.throw(TypeError);
                expect(function(){ aja().timeout(['invalid']); }).to.throw(TypeError);
                expect(function(){ aja().timeout([1000, 'invalid']); }).to.throw(TypeError);
                expect(function(){ aja().timeout('anystring'); }).to.throw(TypeError);
                expect(function(){ aja().timeout({}); }).to.throw(TypeError);
                expect(function(){ aja().timeout(0); }).to.throw(TypeError);
                expect(function(){ aja().timeout(-42); }).to.throw(TypeError);

                expect(function(){ aja().timeout(1000); }).to.not.throw();
            });

            it('should get / set value', function(){
                expect(aja().timeout(1000).timeout()).to.equal(1000);
            });

            it('should chain', function(){
                var a = aja();
                expect(a.timeout(1000)).to.be.an('object');
                expect(a.timeout(1000)).to.equals(a);
            });
        });
    });
});
