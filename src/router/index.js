import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('../views/Members.vue')
  },
  {
    path: '/formation',
    name: 'Formation',
    component: () => import('../views/Formation.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router