import VueRouter from 'vue-router'

import { PostDetail, PostForm, PostList } from './entities'
import Home from './components/Home'

const routes = [
  { path: '/', component: Home },
  { name: 'PostDetail', path: '/movies/:id', component: PostDetail },
  { name: 'PostCreate', path: '/movies/new', component: PostForm },
  { name: 'PostUpdate', path: '/movies/:id/edit', component: PostForm },
  { name: 'PostList', path: '/movies', component: PostList }
]

export default new VueRouter({
  routes
})
