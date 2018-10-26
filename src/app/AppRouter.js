import VueRouter from 'vue-router'

import { MovieDetail, MovieForm, MovieList, DirectorForm, DirectorList , DirectorDetail} from './entities'
import Home from './components/Home'

const routes = [
  { path: '/', component: Home },
  { name: 'MovieDetail', path: '/movies/:id', component: MovieDetail },
  { name: 'MovieCreate', path: '/movies/new', component: MovieForm },
  { name: 'MovieUpdate', path: '/movies/:id/edit', component: MovieForm },
  { name: 'MovieList', path: '/movies', component: MovieList },
  { name: 'DirectorDetail', path: '/directors/:id', component: DirectorDetail },
  { name: 'DirectorCreate', path: '/directors/new', component: DirectorForm },
  { name: 'DirectorUpdate', path: '/directors/:id/edit', component: DirectorForm },
  { name: 'DirectorList', path: '/directors', component: DirectorList }


]

export default new VueRouter({
  routes
})
