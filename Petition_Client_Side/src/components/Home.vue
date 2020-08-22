<template>
<div class="container">
  <img class="mainpage-banner" src="../../images/petitionsnz-banner.png"/>
  <div class="container has-text-centered">
    <div v-if="!store.getters.getAuthenticationStatus">
      <h2 class="title">Welcome</h2>
      <p>
        You can view petitions in New Zealand straight away without an account!
      </p>
      <br/>
      <b-button
        tag="router-link"
        to="/Petitions"
        type="is-info">
        Petitions
      </b-button>
    </div>
    <div v-if="store.getters.getAuthenticationStatus">
      <h2 class="title">Welcome</h2>
      <p>
        You are logged in!
      </p>
      <br/>
      <b-button
        tag="router-link"
        to="/Petitions"
        type="is-info">
        Petitions
      </b-button>
    </div>
    <hr>
    <div v-if="!store.getters.getAuthenticationStatus">
      <p>
        It's easy to sign a petition or even to create your own! Just register for free today!
      </p>
      <br/>
      <b-button
        tag="router-link"
        to="/Register"
        type="is-info">
        Register
      </b-button>
    </div>
  </div>
</div>
</template>

<script>
  import store from "../store"

  export default {
    name: "Home.vue",
    data() {
      return {
        store: store
      }
    }
  }
</script>

<style scoped>
  #inner {
    width: 50%;
    margin: 0 auto;
  }

  .mainpage-banner {
    /*width: 1550px;*/
    /*height: 1250px;*/
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    display: block;

  }
  .mainpage-banner img {
    /*width: 1550px;*/
    /*height:1250px;*/
    /*margin: -75px 0 0 -100px;*/
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .container {
    padding-top: 100px;
    /*width: 1000px;*/
    /*position: absolute;*/
    /*left: 28.5%;*/
    /*margin-left: -50px;*/
  }
</style>
