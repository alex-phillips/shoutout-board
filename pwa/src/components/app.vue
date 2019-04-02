<template>
<f7-app :params="f7params">
  <!-- Status bar overlay for fullscreen mode-->
  <f7-statusbar></f7-statusbar>

  <!-- Left panel with cover effect-->
  <f7-panel left cover theme-dark>
    <f7-page>
      <f7-list>
        <f7-list-item
          link="/shoutouts/"
          title="Shoutouts"
          class="panel-close"></f7-list-item>
          </f7-list>
      </f7-list>
    </f7-page>
  </f7-panel>

  <!-- Your main view, should have "view-main" class -->
  <f7-view main class="safe-areas" url="/" :push-state="true"></f7-view>
</f7-app>
</template>
<script>
import routes from '../js/routes.js'
import api from '../js/api.js'

export default {
  data () {
    return {
      // Framework7 Parameters
      f7params: {
        name: 'Shoutout!', // App name
        theme: 'auto', // Automatic theme detection
        // App root data
        data: function () {
          return {
            loggedIn: false
          }
        },

        // App routes
        routes: routes,

        // Register service worker
        serviceWorker: {
          path: '/service-worker.js'
        }
      },

      // Login screen data
      username: '',
      password: ''
    }
  },
  mounted () {
    this.$f7ready((f7) => {
      api.ping()
        .then(data => {
          this.$f7.data.loggedIn = true
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {

        })
    })
  }
}
</script>
