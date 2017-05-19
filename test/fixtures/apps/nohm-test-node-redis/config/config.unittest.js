'use strict'

const redis = require('redis')
const client = redis.createClient()

exports.keys = '123456'


exports.nohm = {
  redis: client
}
