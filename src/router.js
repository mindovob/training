import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sample1',
      name: 'sample1',
      component: () => import(/* webpackChunkName: "about" */ './views/Sample1.vue')
    },
    {
      path: '/sample2',
      name: 'sample2',
      component: () => import(/* webpackChunkName: "about" */ './views/Sample2.vue')
    },
    {
      path: '/sample3',
      name: 'sample3',
      component: () => import(/* webpackChunkName: "about" */ './views/Sample3.vue')
    },
  ]
})
