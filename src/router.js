import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', component: Home,
      props: (route) => ({ path: route.path }),
      children: [
        { path: 'join' },
        { path: 'create' },
      ],
    },
    { path: '/wait', component: () => import('./views/WaitingRoom') },
    { path: '/fake-artist', component: () => import('./games/fake-artist/FakeArtist') },
    { path: '*', redirect: '/' },
  ]
});
