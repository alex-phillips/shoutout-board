<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>Shoutout!</f7-nav-title>
      <f7-nav-title-large sliding>Shoutout!</f7-nav-title-large>
    </f7-navbar>
    <!-- Toolbar-->

    <f7-list no-hairlines form>
      <f7-list-input
        type="textarea"
        placeholder="Give someone a shoutout!"
        resizable
        :value="body"
        @input="body = $event.target.value"
      ></f7-list-input>

      <f7-icon icon="icon-images"></f7-icon>{{ filename }}

      <f7-list-input
        hidden
        type="file"
        @change="filesChange($event.target.name, $event.target.files)"
      ></f7-list-input>
    </f7-list>

    <f7-block strong no-hairlines>
      <f7-row tag="p">
        <f7-col>
          <f7-button fill raised @click="submit">Submit</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>

     <f7-block-footer v-if="$f7.data.loggedIn === false" style="text-align: center; width: 95%; position: absolute; bottom: 0;">
      <f7-link href='/login/'>Login</f7-link>
    </f7-block-footer>
  </f7-page>
</template>

<script>
import api from '../js/api.js'

export default {
  data () {
    return {
      body: ''
    }
  },

  methods: {
    submit () {
      if (!this.body) {
        this.$f7.dialog.alert("You didn't type anything!")
        return
      }

      api.submitShoutout({
        type: 'shoutout',
        identifier: 'app',
        body: this.body
      })
        .then(() => {
          this.$f7.notification.create({
            // icon: '<i class="icon icon-f7"></i>',
            title: 'Shoutout!',
            titleRightText: 'now',
            // subtitle: 'This is a subtitle',
            text: 'Thanks for your shoutout!',
            closeTimeout: 3000
          }).open()
          this.body = ''
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$f7.dialog.alert('There seems to be a problem. Please try again later.')
        })
    }
  }
}
</script>
