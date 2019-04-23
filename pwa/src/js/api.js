import Framework7 from 'framework7'

let BASE_URL = 'http://192.168.53.251:3000'
// let BASE_URL = 'http://127.0.0.1:3000'

export default {
  setToken (token) {
    localStorage.setItem('jwt', token)
  },

  getToken () {
    return localStorage.getItem('jwt')
  },

  login (username, password) {
    return Framework7.request.promise.post(
      `${BASE_URL}/users/login`,
      {
        username: username,
        password: password
      },
      'json'
    )
      .then(data => {
        this.setToken(data.user.token)

        return data
      })
  },

  ping () {
    return Framework7.request.promise({
      url: `${BASE_URL}/ping`,
      headers: this._getHeaders()
    })
  },

  submitShoutout (shoutout) {
    return Framework7.request.promise({
      url: `${BASE_URL}/shoutouts`,
      headers: this._getHeaders(),
      method: 'POST',
      dataType: 'json',
      data: shoutout
    })
  },

  getShoutouts () {
    return Framework7.request.promise({
      url: `${BASE_URL}/shoutouts`,
      headers: this._getHeaders(),
      method: 'GET',
      dataType: 'json'
    })
  },

  getShoutoutsPage (page) {
    return Framework7.request.promise({
      url: `${BASE_URL}/shoutouts/page/${page}`,
      headers: this._getHeaders(),
      method: 'GET',
      dataType: 'json'
    })
  },

  deleteShoutout (shoutout) {
    return Framework7.request.promise({
      url: `${BASE_URL}/shoutouts/${shoutout.type}/${shoutout.identifier}/${shoutout.id}`,
      headers: this._getHeaders(),
      method: 'DELETE',
      dataType: 'json'
    })
  },

  updateMOTD (header, body) {
    return Framework7.request.promise({
      url: `${BASE_URL}/settings`,
      headers: this._getHeaders(),
      method: 'PUT',
      dataType: 'json',
      data: {
        identifier: 'motd_header',
        value: header
      }
    })
      .then(() => {
        return Framework7.request.promise({
          url: `${BASE_URL}/settings`,
          headers: this._getHeaders(),
          method: 'PUT',
          dataType: 'json',
          data: {
            identifier: 'motd_body',
            value: body
          }
        })
      })
  },

  _getHeaders () {
    let headers = {}
    if (this.getToken()) {
      headers.Authorization = `Token ${this.getToken()}`
    }

    return headers
  }
}
