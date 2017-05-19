const nohm = require('nohm').Nohm;

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

