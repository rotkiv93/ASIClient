import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import moment from 'moment'
import VueMoment from 'vue-moment'
Vue.use(VueMoment, moment)

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import 'vue-instant/dist/vue-instant.css'
import VueInstant from 'vue-instant/dist/vue-instant.common'
Vue.use(VueInstant)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faMinusSquare, faArrowLeft, faPlusSquare, faTh, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Notifications from 'vue-notification'
import ToggleButton from 'vue-js-toggle-button'
import StarRating from 'vue-star-rating'


Vue.use(Notifications)
library.add(faSearch)
library.add(faMinusSquare)
library.add(faArrowLeft)
library.add(faPlusSquare)
library.add(faTh)
library.add(faList)
Vue.use(ToggleButton)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('star-rating', StarRating)

import App from './app/App'
import router from './app/AppRouter'

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
