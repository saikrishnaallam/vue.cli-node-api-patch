import Vue from "vue";
import Vuex from "vuex";
import currentUserModule  from './modules/currentUserModule ';
import inputsModule from './modules/inputsModule'
import postsModule from './modules/postsModule'
import usersModule from './modules/usersModule'
import friendshipsModule from './modules/friendshipsModule'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {currentUserModule,postsModule,inputsModule,usersModule,friendshipsModule}
})



export default store
