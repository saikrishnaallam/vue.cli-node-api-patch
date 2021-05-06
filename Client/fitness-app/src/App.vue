<template>
  <div id="app">
          <Navbar></Navbar>

    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import { mapActions } from 'vuex'

export default {
   components:{
    Navbar
  },
  data(){
    return{

    };
  },
  methods:{
        ...mapActions(['signInFromSessionStorage'])

  },
  created(){
    this.signInFromSessionStorage()

  },
   mounted(){
    // this.signInFromSessionStorage()
   }
}
</script>

<style >
/* gets rid of vertical scrollbar */
html{
  overflow-y : hidden; 
}
</style>
