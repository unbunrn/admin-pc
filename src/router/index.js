import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 保存原始 push 方法
const originalPush = VueRouter.prototype.push

// 重写 push 方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    // 判断是否是重复导航错误
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

const routes = [
  {//重定向到首页
    path: '/',
    redirect: '/home'
  },
  {// 登录
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {// 首页
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: '/findPerson',
    children: [
      {
        path: '/findGoods',
        name: 'FindGoods',
        component: () => import('../views/FindGoods.vue')
      },
      {
        path: '/findPerson',
        name: 'FindPerson',
        component: () => import('../views/FindPerson.vue')
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/Admin.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
