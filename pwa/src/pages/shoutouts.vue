<template>
  <f7-page>
    <f7-navbar title="Shoutouts" back-link="Back"></f7-navbar>
    <f7-page
      ptr
      @ptr:refresh="populateList"
      infinite
      :infinite-distance="50"
      :infinite-preloader="showPreloader"
      @infinite="loadMore"
    >
      <f7-card class="demo-card-header-pic"
        v-for="shoutout in shoutouts" :key="shoutout.id" :deleted="shoutout.deleted">
        <f7-card-header
          class="no-border"
          valign="bottom"
          :style="'background-color: ' + colors[shoutout.type] + '; color: white;'"
        >{{ shoutout.type }} - {{ shoutout.identifier }}</f7-card-header>
        <f7-card-content>
          {{ shoutout.display }}
        </f7-card-content>
        <f7-card-footer v-if="$f7.data.loggedIn === true">
          <f7-link v-on:click="deleteShoutout(shoutout)" v-if="!shoutout.deleted">Delete</f7-link>
          <p v-if="shoutout.deleted === true" style="color: red;">DELETED</p>
        </f7-card-footer>
      </f7-card>
    </f7-page>
  </f7-page>
</template>

<script>
import api from '../js/api.js'

export default {
  data () {
    return {
      shoutouts: [],
      allowInfinite: true,
      showPreloader: false,
      page: 2,
      colors: {
        shoutout: '#041e30',
        twitter: '#1DA1F2'
      },
      ws: null
    }
  },

  created () {
    this.populateList()
    this.ws = require('socket.io-client')('http://localhost:3000')
    this.ws.on('connect', () => {
      console.log('connected')
    })

    this.ws.on('shoutout', shoutout => {
      let shoutouts = this.formatShoutouts([shoutout]).concat(this.shoutouts)
      this.shoutouts = shoutouts
    })
  },

  methods: {
    formatShoutouts (shoutouts) {
      for (let shoutout of shoutouts) {
        switch (shoutout.type) {
          case 'twitter':
            shoutout.display = JSON.parse(shoutout.body).text
            break
          default:
            shoutout.display = shoutout.body
        }
      }

      return shoutouts
    },

    loadMore (event, done) {
      if (!this.allowInfinite) {
        return
      }

      this.showPreloader = true
      this.allowInfinite = false

      api.getShoutoutsPage(this.page)
        .then(shoutouts => {
          this.showPreloader = false
          if (shoutouts.length === 0) {
            console.log('no more to infinite scroll')
            console.log(this.shoutouts.length)

            if (done) {
              done()
            }

            return
          }

          shoutouts = this.formatShoutouts(shoutouts)

          this.shoutouts = this.shoutouts.concat(shoutouts)

          this.page++
          this.allowInfinite = true
          console.log(this.shoutouts)

          if (done) {
            done()
          }
        })
    },

    populateList (event, done) {
      this.page = 1
      this.shoutouts = []

      return this.loadMore(event, done)
    },

    deleteShoutout (shoutout) {
      api.deleteShoutout(shoutout)
        .then(() => {
          this.$f7.toast.create({
            // icon: '<i class="icon icon-f7"></i>',
            title: 'Shoutout!',
            titleRightText: 'now',
            // subtitle: 'This is a subtitle',
            text: 'Shoutout has been removed from display',
            closeTimeout: 3000
          }).open()

          shoutout.deleted = true
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$f7.dialog.alert('Sorry, you must be logged in to do that!')
        })
    }
  }
}
</script>
