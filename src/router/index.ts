import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    // 重定向到主页的路由配置
    { path: '/home', redirect: '/' },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/components/Setting.vue'),
    },
    {
        path: '/video/:bvid',
        name: 'Video',
        component: () => import('@/components/Video.vue'),
    },
    {
        path: '/search/:zone',
        name: 'Search',
        component: () => import('@/components/Search.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/components/Login.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
