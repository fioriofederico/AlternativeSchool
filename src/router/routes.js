// Layouts
import FullPage from '@/views/Layout/Fullpage.vue'
import LeftSide from '@/views/Layout/LeftSide.vue'

const routes = [
    {
    path: '/',
    name: 'home',
    component: () => import( /* webpackChunkName: "Corsi" */ '@/views/Courses/List.vue'),
    meta: {
      layout: LeftSide,
      pageName: 'Corsi',
      title: 'Corsi',
      icon: 'book'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ '@/views/Pages/Login.vue'),
    meta: {
      layout: FullPage,
      pageName: 'Login',
      title: 'Login'
    }
  },
  {
    path: '/register',
    name: 'resgister',
    component: () => import( /* webpackChunkName: "registrazione" */ '@/views/Pages/Login.vue'),
    meta: {
      layout: FullPage,
      pageName: 'Registrazione',
      title: 'Registrazione'
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import( /* webpackChunkName: "users" */ '@/views/Users/List.vue'),
    authorize: ['ROLE_ADMIN'],
    meta: {
      layout: LeftSide,
      pageName: 'Utenti',
      title: 'Utenti',
      icon: 'users'
    }
  },
  {
    path: '/allCourses',
    name: 'allCourses',
    component: () => import( /* webpackChunkName: "users" */ '@/views/Courses/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT'],
    meta: {
      layout: LeftSide,
      pageName: 'Tutti i Corsi',
      title: 'Tutti i Corsi',
      icon: 'book'
    }
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import( /* webpackChunkName: "users" */ '@/views/MyCourses/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Miei Corsi',
      title: 'Miei Corsi',
      icon: 'user'
    }
  },
  {
    path: '/coursesModules/:id',
    name: 'coursesModules',
    component: () => import( /* webpackChunkName: "corsi con id" */ '@/views/CoursesModules/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Moduli del Corso',
      title: 'Moduli del Corso',
      icon: 'book'
    }
  },
  {
    path: '/enRoll/:id',
    name: 'coursesModules',
    component: () => import( /* webpackChunkName: "iscritti con id" */ '@/views/Enroll/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Iscritti al Corso',
      title: 'Iscritti al Corso',
      icon: 'users'
    }
  },
  {
    path: '/folderCoursesModules/:idCourse/:idModule',
    name: 'coursesModules',
    component: () => import( /* webpackChunkName: "cartella del modulo" */ '@/views/FolderCoursesModules/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Allegati del Modulo',
      title: 'Allegati del Modulo',
      icon: 'paperclip'
    }
  },
  {
    path: '/deliveryFolders/:id',
    name: 'deliveryFolders',
    component: () => import( /* webpackChunkName: "cartella consegna" */ '@/views/DeliveryFolder/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Cartella di Consegna del Corso',
      title: 'Cartella di Consegna del Corso',
      icon: 'folder-open'
    }
  },
  {
    path: '/deliveryFoldersUploadFile/:idCourse/:idFolder',
    name: 'deliveryFoldersUploadFile',
    component: () => import( /* webpackChunkName: "cartella consegna idcorso idcartella" */ '@/views/UploadFileOnDeliveryFolder/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Materiale Nella Cartella di Consegna del Corso',
      title: 'Materiale Nella Cartella di Consegna del Corso',
      icon: 'file-alt'
    }
  },
  {
    path: '/videos/:moduleId/:courseId',
    name: 'coursesModules',
    component: () => import( /* webpackChunkName: "video" */ '@/views/Videos/List.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Video del Corso',
      title: 'Video del Corso',
      icon: 'video'
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import( /* webpackChunkName: "chat" */ '@/views/Chat/Chat.vue'),
    authorize: ['ROLE_ADMIN', 'STUDENT', 'TUTOR'],
    meta: {
      layout: LeftSide,
      pageName: 'Chat',
      title: 'Chat',
      icon: 'comments'
    }
  },
  {
    path: '*',
    name: 'error404',
    component: () => import( /* webpackChunkName: "pages" */ '@/views/Pages/404.vue'),
    meta: {
      layout: FullPage,
      pageName: 'Not Found',
      title: 'Not Found'
    }
  },
]


export default routes
