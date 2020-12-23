import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/viz01',
    name: 'viz01',
    component: () => import('../views/EscherGallery/index')
  }
]

const router = new VueRouter({
  routes
})

export default router
