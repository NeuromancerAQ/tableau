import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/viz01',
    name: 'viz01',
    component: () => import('../views/EscherGallery/index')
  },
  {
    path: '/viz02',
    name: 'viz02',
    component: () => import('../views/HomonymousCities/index')
  }
]

const router = new VueRouter({
  routes
})

export default router
