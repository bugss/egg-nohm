'use strict';
const NOHM = Symbol('Application#nohm');
const nohm = require('nohm').Nohm;
module.exports = {
  get nohm() {
    if (!this[NOHM]) {
      this[NOHM] = nohm;
    }
    return this[NOHM];
  },
};

