import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue"
import SignUp from "../views/SignUp.vue"
import Feed from "../views/Feed.vue"
import FindFriends from "../views/FindFriends.vue"
import Dashboard from "../views/Dashboard.vue"
import Users from "../views/Users.vue"
import NewActivity from "../views/NewActivity.vue"
import Statistics from "../views/Statistics.vue"
import User from "../views/User.vue"
import AccountSettings from "../views/AccountSettings.vue"
import Friends from "../views/Friends.vue"

Vue.use(VueRouter);

const routes = [
  // { path: "/", name: "SignIn", component: SignIn},
  { path: "/", name: "Feed", component: Feed},
  { path: "/friends", name: "Friends", component: Friends},
  { path: "/signIn", name: "SignIn", component: SignIn},
  { path: "/signUp", name: "SignUp", component: SignUp},
  { path: "/findFriends", name: "FindFriends", component: FindFriends},
  { path: "/dashboard", name: "Dashboard", component: Dashboard},
  { path: "/newActivity", name: "NewActivity", component: NewActivity},
  { path: "/users", name: "Users", component: Users},
  { path: "/statistics", name: "Statistics", component: Statistics},
  { path: "/users/:id", name: "users", component: User,props: true,},
  { path: "/AccountSettings", name: "AccountSettings", component: AccountSettings},
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
