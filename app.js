'use strict';

const path = require('path');
const nohm = require('nohm').Nohm;
const Promise = require('bluebird');

module.exports = app => {
  const config = app.config.nohm;
  let useRedis;
  const { redis } = config;
  if (redis) {
    if (typeof redis === 'function') {
      useRedis = redis(app);
    } else {
      useRedis = redis;
    }
  } else {
    useRedis = app.redis;
  }
  if (!useRedis || typeof useRedis.on !== 'function') {
    throw new Error('redis client must not be null please confirm you config the redis plugin');
  }

  // waiting until the app is ready .
  app.beforeStart(() => new Promise(resolve => {
    if (useRedis.connected === true) {
      nohm.setClient(useRedis);
      resolve();
      return;
    }
    useRedis.on('connect', () => {
      // hack  ioredis check this field but ioredis not set
      useRedis.connected = true;
      nohm.setClient(useRedis);
      resolve();
    });
  }));

  const suffix = config.suffix;
  Promise.promisifyAll(nohm.prototype, {
    suffix,
  });
  const name = 'nohmModel';
  const directory = path.join(app.config.baseDir, config.modelPath);
  app.loader.loadToApp(directory, name, {
    call: false,
    initializer(model, opt) {
      let returnModel;
      if (typeof model === 'function') {
        if (model.prototype instanceof nohm) {
          returnModel = model;
        } else {
          returnModel = model(app);
        }
      }
      if (!returnModel) {
        app.coreLogger.info(`[egg-nohm] ignore null file:${opt.path}`);
        return null;
      }
      // model static method promise
      Promise.promisifyAll(returnModel, {
        suffix,
      });
      return returnModel;
    },
  });
};
