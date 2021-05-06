<template>
  <nav class="navbar is-success" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">Feed</router-link>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="menuOpen = !menuOpen"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      :class="`navbar-menu ${menuOpen ? 'is-active' : ''}`"
    >
      <div class="navbar-start">
        <router-link to="/dashboard" class="navbar-item" v-if="isLoggedIn"
          >Dashboard</router-link
        >
        <router-link to="/findFriends" class="navbar-item" v-if="isLoggedIn"
          >Find friends</router-link
        >

        <router-link to="/users" class="navbar-item" v-if="isLoggedIn && isAdmin"
          >Users</router-link
        >
        <router-link to="/statistics" class="navbar-item" v-if="isLoggedIn && isAdmin"
          >Usage statistics</router-link
        >
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <router-link to="/signIn" class="button is-light" v-if="!isLoggedIn"
              >Sign in</router-link
            >
            <router-link
              to="/signUp"
              class="button is-primary"
              v-if="!isLoggedIn"
              >Sign up</router-link
            >
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable" v-if="isLoggedIn">
          <a class="navbar-link">
            <span class="icon">
              <i class="fas fa-user"></i>
            </span>
            <span>{{ isLoggedIn ? getCurrentUserFullName : "" }}</span>
          </a>
          <div class="navbar-dropdown">
            <router-link to="/AccountSettings" class="navbar-item"
              >My profile</router-link
            >
            <router-link to="/friends" class="navbar-item"
              >My friends</router-link
            >
            <a class="navbar-item" @click="signOut()">Sign out</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Navbar",

  components: {},
  data() {
    return {
      menuOpen: false,
    };
  },
  computed: {
    ...mapGetters(["getCurrentUserFullName", "isLoggedIn", "isAdmin"]),
  },
  methods: {
    ...mapActions(["signOut"]),
  },
};
</script>

<style scoped>
a {
  font-size: 1.15rem;
}
</style>