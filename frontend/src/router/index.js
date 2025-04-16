import { createRouter, createWebHistory } from 'vue-router'
import Profile from '../components/profile.vue'
import EditProfile from '../components/EditeProfile.vue'
import Discussion from '../components/Discussion.vue'
import Setting from '../components/Setting.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/profil/:id',
      name: 'profile',
      component: Profile, // Correction de la casse
    },
    { 
      path: '/edit/:id', 
      name: 'editProfile', 
      component: EditProfile // Correction du nom du fichier
    },
    {
      path: '/',
      name: 'discussion',
      component: Discussion
    },
    {
      path: '/settings',
      name: 'settings',
      component: Setting
    }
  ],
})

export default router
