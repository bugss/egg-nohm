# egg-nohm

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-nohm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-nohm
[travis-image]: https://img.shields.io/travis/bugss/egg-nohm.svg?style=flat-square
[travis-url]: https://travis-ci.org/bugss/egg-nohm
[codecov-image]: https://img.shields.io/codecov/c/github/bugss/egg-nohm.svg?style=flat-square
[codecov-url]: https://codecov.io/github/bugss/egg-nohm?branch=master
[david-image]: https://img.shields.io/david/bugss/egg-nohm.svg?style=flat-square
[david-url]: https://david-dm.org/bugss/egg-nohm
[snyk-image]: https://snyk.io/test/npm/egg-nohm/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-nohm
[download-image]: https://img.shields.io/npm/dm/egg-nohm.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-nohm

<!--
Description here.
-->
## 为什么有这个插件

- 让 nohm 支持ioredis,egg官方提供的是ioredis,更容易集成.
- 让 nohm 的api promise化

## Install

```bash
$ npm i egg-nohm --save
```

## Usage

nohm 详细请看https://github.com/maritz/nohm

```js
// 模型定义,app/nohm/model目录下的文件会自动加载
// app/nohm/model/ObjModel.js
const nohm = require('nohm').Nohm;
// 别忘记了module.exports =.   
module.exports = nohm.model('ObjectModel', {
  properties: {
    nickName: {
      type: 'string',
    },
    currentSong: {
      type: 'json',
    },
    currentListType: {
      type: 'string',
      defaultValue: 'local',
    },
    localList: {
      type: 'json',
      defaultValue: { items: [] },
    },
    playList: {
      type: 'json',
      defaultValue: { items: [] },
    },
  },
});

//也可以
// app/nohm/model/PlayingSong.js
const nohm = require('nohm').Nohm;

module.exports = app => {
  const PlayingSong = nohm.model('PlayingSong', {
    properties: {
      nickName: {
        type: 'string',
      },
      currentSong: {
        type: 'json',
      },
      currentListType: {
        type: 'string',
        defaultValue: 'local',
      },
      localList: {
        type: 'json',
        defaultValue: { items: [] },
      },
      playList: {
        type: 'json',
        defaultValue: { items: [] },
      },
    },
  });
  return PlayingSong;
};

```



```js
// 所有app/nohm/model下的文件会加载到app.nohmModel
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
```

```js
// {app_root}/config/plugin.js
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.nohm = {
  enable: true,
  package: 'egg-nohm',
};
```

egg-redis 插件依赖不是必须的,如果你使用node-redis,可以用下面的方式配置
```js
const redis = require('redis')
const client = redis.createClient()
exports.nohm = {
  redis: client
}
```

## promise

nohm中的方法$结尾的都promisify了.
如原方法save, 会另外增加一个save$返回promise

## Configuration

```js
// {app_root}/config/config.default.js
exports.redis = {
  client: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: '0',
  },
};
exports.nohm = {
};
```

## save  id分配的问题

如果你期望下面的代码
```js
var model=new SomeNohmModel()  
model.id='abcd'
model.save()
```
不管这里的id存在还是不存在,都以这个id保存到redis中.
如果存在id='abcd'的,就更新.
如果不存在新插入对象的id还是等于'abcd'.请加下面的配置.

```js
idGenerator (cb) {
      cb(this.id)
    }
```

因为nohm默认的行为是
-  如果id不填,自动生成一个不重复的
-  如果id有值,会进一步的到数据库中验证这个值存在不,不存在他还是会自动生成一个新值代替你填入的id的

## nohm load$方法报错问题
nohm通过id找不到数据会报错,自行处理一下
```js
let user = yield ConnectUser.load$(openId).catch((err) => null)
```

### 配置项目请看
see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
