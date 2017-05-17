'use strict';


const mm = require('egg-mock');
const assert = require('assert');

describe('test/nohm.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/nohm-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should nohm add to the app', () => {
    assert(app.nohm != null);
    assert(app.nohmModel != null);
    assert(app.nohmModel.PlayingSong != null);
    assert(app.nohmModel.ObjModel != null);

  });

  it('should promise work', () => {
    const ps = new app.nohmModel.PlayingSong();
    const shortFormFuncs = [ 'load', 'find', 'findAndLoad', 'save', 'sort', 'subscribe', 'subscribeOnce', 'unsubscribe' ];
    shortFormFuncs.forEach(function(fun) {
      assert(typeof app.nohmModel.PlayingSong[fun + '$'] === 'function');
    });
    assert(typeof ps.remove$ === 'function');

    assert(typeof ps.save$ === 'function');

  });

  it('should save and remove ok', function* () {
    const PlayingSong = app.nohmModel.PlayingSong;
    const ps = new PlayingSong();
    ps.id = 'abc';
    const nickName = 'who am i ';
    ps.p({
      nickName,
    });
    yield ps.save$();
    const data = yield PlayingSong.load$(ps.id);
    assert(data.nickName === nickName);
    yield PlayingSong.remove$(ps.id);
  });

  it('should ok when not config redis ', function* () {
    const app = mm.app({
      baseDir: 'apps/nohm-not-config-redis',
    });
    yield app.ready();
    assert(app.nohm != null);
    assert(app.nohmModel != null);
    yield app.close();
  });

  it('should throw error when config redis function return  null', function(done) {

    mm.app({
      baseDir: 'apps/nohm-config-redis-return-null',
    }).on('error', function() {
      done();
    });

  });

});
