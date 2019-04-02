const Twit = require('twit')
const { Shoutout } = require('../config/db')
const socket = require('../socket')

class Twitter {
  constructor (identifier, credentials) {
    this.identifier = identifier
    this.client = new Twit(credentials)
  }

  stream (params) {
    let stream = this.client.stream('statuses/filter', params)
    stream.on('tweet', tweet => {
      console.log(tweet)
      Shoutout.create({
        type: 'twitter',
        identifier: this.identifier,
        body: JSON.stringify(tweet)
      })
        .then(shoutout => {
          socket.emit('shoutout', shoutout)
        })
    })
  }
}

module.exports = Twitter
