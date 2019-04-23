<template>
  <f7-page>
    <f7-navbar title="Settings" back-link="Back"></f7-navbar>
    <f7-page>
      <f7-list>
        <f7-list-input
          label="MOTD Header"
          type="select"
          defaultValue="MESSAGE OF THE DAY"
          placeholder="Please choose..."
          @change="motd_header = $event.target.value"
        >
          <option value="MESSAGE OF THE DAY">MESSAGE OF THE DAY</option>
          <option value="QUOTE OF THE DAY">QUOTE OF THE DAY</option>
        </f7-list-input>
        <f7-list-input
          type="textarea"
          placeholder="Message of the day"
          resizable
          :value="motd_body"
          @input="motd_body = $event.target.value"
        ></f7-list-input>
      </f7-list>
      <f7-block strong no-hairlines>
        <f7-row tag="p">
          <f7-col>
            <f7-button fill raised @click="updateMOTD">Update</f7-button>
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-page>
  </f7-page>
</template>

<script>
import api from '../js/api.js'

export default {
  data () {
    return {
      motd_header: 'MESSAGE OF THE DAY',
      motd_body: ''
    }
  },

  methods: {
    updateMOTD () {
      api.updateMOTD(this.motd_header, this.motd_body)
        .then(data => {
          this.$f7router.back()
          this.$f7.toast.create({
            // icon: '<i class="icon icon-f7"></i>',
            title: 'Shoutout!',
            titleRightText: 'now',
            // subtitle: 'This is a subtitle',
            text: 'Message of the day has been updated!',
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
