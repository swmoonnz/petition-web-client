<template>

  <div class="container containerColor">
    <!-- Header -->
    <section class="hero level">
      <div class=" hero-body level-item">
        <div class="container containerColor">Hello! I am
          <h1 class="title is-1">
            {{ user.name}}
          </h1>
          <br>
          <img class="is-rounded crop-profile" v-bind:src="userImageURL(store.getters.getUserId)"
               @error="showDefaultUserImg"/>
        </div>

        <b-button  @click="editProfile"
                   type="is-info">
          Edit Profile <Profile></Profile>
        </b-button>
      </div>
    </section>
    <!-- Social Media Count -->
    <section class="section" id="about">
      <hr class ="hrLine">
      <div class="container containerColor has-same-height is-gapless">
        <div class="column">
          <!-- Profile -->
          <div class="card">
            <div class="card-content">
              <h3 class="title is-4">Personal Details</h3>

              <div class="content">
                <table class="table-profile">
                  <tr>
                    <th colspan="1"></th>
                    <th colspan="2"></th>
                  </tr>
                  <tr>
                    <td>Email: </td>
                    <td>{{ user.email }}</td>
                  </tr>
                  <tr>
                    <td>City: </td>
                    <td>{{ user.city }}</td>
                  </tr>
                  <tr>
                    <td>Country: </td>
                    <td>{{ user.country }}</td>
                  </tr>

                </table>
              </div>
              <br>
            </div>
          </div>
        </div>



      </div>
    </section>

  </div>
</template>

<script>
  import store from '../store'
  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1'
  export default {
    name: "Profile.vue",
    data () {
      return {
        userId: localStorage.getItem('userId'),
        user: null,
        store: store

        }
      },
    mounted: function() {
      this.getProfile()

    },
    methods: {
      getProfile: function() {
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken")
        axios.get(SERVER_URL + `/users/${this.userId}`)
          .then(response => {
            this.user = response.data
        })
          .catch(error => console.log(error))
      },
      userImageURL(userId) {
        let image = 'http://localhost:4941/api/v1/users/' + userId +'/photo/';
        return image;
      },
      showDefaultUserImg(event) {
        event.target.src = "../images/default_profile_image.jpg";
      },
      editProfile() {
        this.$router.push({path: '/EditProfile/' + this.userId});
      },
    }
  }
</script>

<style scoped>
  .crop-profile {
    width: 200px;
    height: 180px;
    overflow: hidden;
  }
  .crop-profile img {
    width: 400px;
    height: 300px;
  }

</style>
