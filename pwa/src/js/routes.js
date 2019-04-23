
import HomePage from '../pages/home.vue'
import LoginPage from '../pages/login.vue'
import ShoutoutsPage from '../pages/shoutouts.vue'
import SettingsPage from '../pages/settings.vue'

import NotFoundPage from '../pages/404.vue'

var routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/login/',
    component: LoginPage,
    beforeEnter: function (routeTo, routeFrom, resolve, reject) {
      if (this.app.data.loggedIn === true) {
        this.app.dialog.alert('You are already logged in!')
        return reject()
      }

      return resolve()
    }
  },
  {
    path: '/shoutouts/',
    component: ShoutoutsPage
  },
  {
    path: '/settings/',
    component: SettingsPage,
    beforeEnter: function (routeTo, routeFrom, resolve, reject) {
      if (this.app.data.loggedIn === false) {
        this.app.dialog.alert('You must be logged in to do that!')
        return reject()
      }

      return resolve()
    }
  },
  {
    path: '/logout/',
    redirect: function (route, resolve, reject) {
      localStorage.clear()
      this.app.data.loggedIn = true
      resolve('/')
      location.reload()
    }
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]

export default routes
