<template>
  <f7-page>
    <f7-navbar title="Login" back-link="Back"></f7-navbar>
    <f7-page login-screen>
      <f7-list form>
        <f7-list-input
          type="text"
          name="username"
          placeholder="Your username"
          :value="username"
          @input="username = $event.target.value"
        ></f7-list-input>
        <f7-list-input
          type="password"
          name="password"
          placeholder="Your password"
          :value="password"
          @input="password = $event.target.value"
        ></f7-list-input>
      </f7-list>
      <f7-list>
        <f7-list-button title="Sign In" login-screen-close @click="submitLogin"></f7-list-button>
      </f7-list>
    </f7-page>
  </f7-page>
</template>

<script>
import api from '../js/api.js'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },

  methods: {
    submitLogin () {
      api.login(this.username, this.password)
        .then(data => {
          this.$f7.data.loggedIn = true
          this.$f7router.back()
          this.$f7.notification.create({
            // icon: '<i class="icon icon-f7"></i>',
            title: 'Shoutout!',
            titleRightText: 'now',
            // subtitle: 'This is a subtitle',
            text: 'Successfully logged in!',
            closeTimeout: 3000
          }).open()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
