<template>
  <b-navbar class="navbar is-dark">
    <template slot="brand">
      <b-navbar-item tag="router-link"
                     to="/"
                     href="#">
        Home

      </b-navbar-item>

    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <!--          <b-button tag="router-link"-->
          <!--                    to="/Login"-->
          <!--                    type="is-primary">-->
          <!--            <strong>Login</strong>-->
          <!--          </b-button>-->
          <b-button class="is-primary"
                    tag="router-link"
                    to="/Petitions"
                    type="is-light">
            Petitions
          </b-button>
          <b-button v-if="store.getters.getAuthenticationStatus"
                    class="is-primary"
                    tag="router-link"
                    to="/MyPetitions"
                    type="is-light">
            My Petitions
          </b-button>
          <b-button v-if="store.getters.getAuthenticationStatus"
                    class="is-primary"
                    tag="router-link"
                    to="/Profile"
                    type="is-light">
            Profile
          </b-button>
          <b-button
            v-if="!store.getters.getAuthenticationStatus"
            class="is-primary"
            tag="router-link"
            to="/Login"
            type="is-light">
            Login
          </b-button>
          <b-button
            v-if="!store.getters.getAuthenticationStatus"
            class="is-primary"
            tag="router-link"
            to="/Register"
            type="is-light">
            Register
          </b-button>
          <b-button
                    v-if="store.getters.getAuthenticationStatus"
                    @click="logout"
                    class="is-primary"
                    type="is-light">
            Logout
          </b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>


<script>
  import store from '../store'
  import axios from "axios";
  const SERVER_URL = 'http://localhost:4941/api/v1'

  export default {
    name: "NavBar.vue",
    data() {
      return {
        store: store
      }
    },
    methods: {
      logout(){
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken");
        axios.post(SERVER_URL + '/users/logout').then(response => {
          localStorage.clear()
          let payload = {'token': null, 'userId': null, 'authenticationStatus': false}
          store.dispatch("resetUserData", payload).then()
          this.$router.push({path: '/'});
          console.log(response)
        })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style>
  #main-navbar{
    display: flex;
    flex-wrap: wrap;
    height: 30px;
    padding: 1rem;
    justify-content: space-between;
  }
  .navbar.is-dark {
    background-color: #363636;
    color: #fff;
  }

  .container{
    width: 100%;
  }

  buttons{
    padding: 10px;
  }
</style>
