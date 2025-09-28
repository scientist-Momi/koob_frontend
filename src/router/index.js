import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const DefaultLayout = () => import('@/layouts/DefaultLayout.vue')
const AuthLayout = () => import('@/layouts/AuthLayout.vue')
const Login = () => import('@/views/AuthenticationPage.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
// const Book = () => import('@/views/book/BooksearchPage.vue')
const Book = () => import('@/views/book/BookView.vue')
const Settings = () => import('@/views/SettingsPage.vue')
const NewLibrary = () => import('@/views/library/NewLibraryView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AuthLayout,
      children: [{ path: '', component: Login }],
    },
    {
      path: '/app',
      component: DefaultLayout,
      children: [
        {
          path: 'dashboard',
          component: Dashboard,
          name: 'Dashboard',
          meta: { requiresAuth: true },
        },
        // {
        //   path: 'book',
        //   component: Book,
        //   meta: { requiresAuth: true },
        // },
        {
          path: 'books/:id',
          component: Book,
          name: 'BookView',
          meta: { requiresAuth: true },
        },
        {
          path: 'settings',
          component: Settings,
          name: 'Settings',
          meta: { requiresAuth: true },
        },
        {
          path: 'new-library',
          component: NewLibrary,
          name: 'new-library',
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (!userStore.user && !userStore.loading) {
    await userStore.fetchUser()
  }
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
