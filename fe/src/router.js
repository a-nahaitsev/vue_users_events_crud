import { createRouter, createWebHashHistory } from 'vue-router';
import UsersTable from './components/UsersTable.vue';
import EventsTable from './components/EventsTable.vue';
import PageNotFound from './components/PageNotFound.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: UsersTable,
    },
    {
      path: '/users',
      component: UsersTable,
    },
    {
      path: '/events/:userId',
      component: EventsTable,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*', 
      component: PageNotFound,
    }
  ],
});
