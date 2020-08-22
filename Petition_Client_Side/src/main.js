import Vue from 'vue'
import App from './App.vue'
import Home from './components/Home.vue';
import Petitions from './components/Petitions.vue';
import Register from './components/Register';
import Petition from './components/Petition';
import Profile from './components/Profile';
import Login from './components/Login';
import CreatePetition from './components/CreatePetition';
import MyPetitions from "./components/MyPetitions";
import EditPetition from "./components/EditPetition";
import EditProfile from "./components/EditProfile";
import store from './store';
import "@babel/polyfill";
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueSocialSharing from 'vue-social-sharing'

Vue.use(VueSocialSharing);
Vue.use(Vuex)
Vue.use(Buefy)
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

if (localStorage.getItem('authToken') != null) {
      let payload = {'token': localStorage.getItem('authToken'), 'userId': localStorage.getItem('userId')}
      store.dispatch('validateByTokenAndUserId', payload).then()
}

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/Petitions",
    component: Petitions
  },
  {
    path: "/Register",
    component: Register
  },
  {
    path:"/Petition/:petitionId",
    component: Petition
  },
  {
    path:"/Profile",
    component: Profile
  },
  {
    path:"/Login",
    component: Login
  },
  {
    path:"/CreatePetition",
    component: CreatePetition
  },
  {
    path:"/MyPetitions",
    component: MyPetitions
  },
  {
    path:"/EditPetition/:petitionId",
    component: EditPetition
  },
  {
    path:"/EditProfile/:userId",
    component: EditProfile
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: router

  // render: h => h(App)
})
