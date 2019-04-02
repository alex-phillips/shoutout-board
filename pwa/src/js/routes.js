
import HomePage from '../pages/home.vue'
import LoginPage from '../pages/login.vue'
import ShoutoutsPage from '../pages/shoutouts.vue'

import DynamicRoutePage from '../pages/dynamic-route.vue'
import RequestAndLoad from '../pages/request-and-load.vue'
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
    path: '(.*)',
    component: NotFoundPage
  }
]

export default routes
