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
    if (!useRedis) {
      throw new Error('redis client must not be null');
    }
  } else {
    useRedis = app.redis;
  }

  // waiting until the app is ready .
  app.beforeStart(() => new Promise(resolve => {
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
    initializer(model) {
      let returnModel;
      if (typeof model === 'function') {
        if (model.prototype instanceof nohm) {
          returnModel = model;
        } else {
          returnModel = model(app);
        }
      } else {
        throw new Error('model must be a constructor function, make sure you set module.exports');
      }
      // model static method promise
      Promise.promisifyAll(returnModel, {
        suffix,
      });
      return returnModel;
    },
  });
};
