<template>
  <div class="container">
    <h1 class="title">Edit Profile</h1>
    <form @submit.prevent="editProfile">
      <b-field group-multiline grouped>
        <b-field label="Name" expanded >
          <b-input v-model="name" placeholder="Name" required></b-input>
        </b-field>
      </b-field>

      <b-field>
        <b-field label="Email Address" expanded>
          <b-input v-model="email" placeholder="Email Address" required></b-input>
        </b-field>
      </b-field>

      <b-field label="Current Password" expanded >
        <b-input v-model="currentPassword" type="password" placeholder="Current Password" required></b-input>
      </b-field>
      <b-field label="New Password" expanded >
        <b-input v-model="password" type="password" placeholder="New Password"></b-input>
      </b-field>
      <b-field label="Confirm Password" :message="[{'Passwords do not match':isDisabled}]" expanded >
        <b-input v-model="confirmPassword" type="password" placeholder="Confirm Password" ></b-input>
      </b-field>


      <b-field group-multiline grouped>
        <b-field label="City" expanded >
          <b-input v-model="city" placeholder="City (optional)"></b-input>
        </b-field>
        <b-field label="Country" expanded>
          <b-input v-model="country" placeholder="Country (optional)"></b-input>
        </b-field>
      </b-field>


      <b-field label="Current Profile Picture">
        <figure class="image crop">
          <img class="crop-profile" :src="userImageURL(this.userId)"
               @error="showDefaultUserImg"/>
        </figure>
      </b-field>
      <b-field class="file">
        <b-upload accept=".jpg, .png, .gif, .jpeg" v-model="file">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Change Profile Picture</span>
          </a>
        </b-upload>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
      </b-field>

      <b-field>
        <b-button @click="confirm" class="is-danger">Delete Current</b-button>
      </b-field>

      <br />
      <b-field>
        <b-button native-type="submit" :disabled="isDisabled">Submit</b-button>
      </b-field>
      <br />
      <br />
    </form>
  </div>
</template>

<script>
  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1'
    export default {
        name: "EditProfile",

      data() {
          return {
            userId: this.$route.params.userId,
            user: null,
            name: null,
            email: null,
            password: null,
            currentPassword: null,
            confirmPassword: null,
            city: null,
            country: null,
            file: null,
            delete: false
          }
      },
      computed: {
        isDisabled() {
          return !(this.password == this.confirmPassword);
        }
      },
      mounted: function() {
          this.getProfile(this.userId)
      },
      methods: {
        confirm() {
          this.$buefy.dialog.confirm({
            message: 'You are about to delete your current proflie picture. Are you sure?',
            onConfirm: () => this.deletePhoto()
          })
        },
        deletePhoto: function() {
          axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken")
          axios.delete(`${SERVER_URL}/users/${this.userId}/photo`)
            .then(response => {
              console.log(response)
              this.displayPhotoSuccess()
            })
            .catch(error => console.log(error))
        },
        getProfile: function() {
          if (this.$route.params.userId != localStorage.getItem('userId')) {
            this.$router.push({path: '/'});
          }
          axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken")
          axios.get(SERVER_URL + `/users/${this.userId}`)
            .then(response => {
              this.user = response.data
              this.name = response.data.name
              this.email = response.data.email
              this.city = response.data.city
              this.country = response.data.country
            })
            .catch(error => console.log(error))
        },
        uploadPhoto() {
          axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken");
          axios.put(SERVER_URL + "/users/" + this.userId + "/photo",
            this.file,
            {
              headers: {
                "Content-Type": this.file.type
              }
            })
            .then(response => {
              console.log(response)
            })
            .catch(error => console.log(error))
        },
        showDefaultUserImg(event) {
          event.target.src = "../images/default_profile_image.jpg";
        },
        userImageURL(userId) {
          let image = 'http://localhost:4941/api/v1/users/' + userId +'/photo/';
          return image;
        },
        displaySuccess() {
          this.$buefy.toast.open({
            duration: 5500,
            message: "Profile updated",
            type: 'is-success',
            position: 'is-top'
          })
        },
        showWarning() {
          this.$buefy.toast.open({
            duration: 5000,
            message: "Email is already in use",
            type: 'is-danger',
            position: 'is-top',
            queue: false,
          })
        },
        showWarning2(message) {
          this.$buefy.toast.open({
            duration: 5000,
            message: message,
            type: 'is-danger',
            position: 'is-top',
            queue: false,
          })
        },
        displayPhotoSuccess() {
          this.$buefy.toast.open({
            duration: 5500,
            message: "Proflie picture deleted successfully",
            type: 'is-success',
            position: 'is-top'
          })
        },
        editProfile() {
          let updateProfile
          if (this.email === "" || this.email.trim().length === 0 || !this.email.includes('@', 0)) {
            this.showWarning2("Please enter a valid email address")
            return
          }
          if (this.password == null) {
            if (this.city == null && this.country == null) {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "currentPassword": this.currentPassword
              }
            }
            else if (this.city != null && this.country == null) {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "currentPassword": this.currentPassword,
                "city": this.city
              }
            }
            else if (this.city == null && this.country != null) {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "currentPassword": this.currentPassword,
                "country": this.country
              }
            }
            else {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "currentPassword": this.currentPassword,
                "city": this.city,
                "country": this.country
              }
            }
          } else {
            if (this.city == null && this.country == null) {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "password": this.password,
                "currentPassword": this.currentPassword
              }
            } else if (this.city != null && this.country == null) {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "password": this.password,
                "currentPassword": this.currentPassword,
                "city": this.city
              }
            } else if (this.city == null && this.country != null) {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "password": this.password,
                "currentPassword": this.currentPassword,
                "country": this.country
              }
            } else {
              updateProfile = {
                "name": this.name,
                "email": this.email,
                "password": this.password,
                "currentPassword": this.currentPassword,
                "city": this.city,
                "country": this.country
              }
            }
          }
          axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken");
          axios.patch(`${SERVER_URL}/users/${this.userId}`,  updateProfile)
            .then((response => {
              console.log(response)
              if (this.file != null) {
                this.uploadPhoto()
                this.displaySuccess()
                this.$router.push({path: '/Profile'})
                location.reload()
              }
               else {
                this.displaySuccess()
                this.$router.push({path: '/Profile'})
              }
            }))
            .catch(error => {
              console.log(error)
              this.showWarning()
            })
        }
      }
    }
</script>

<style scoped>
  .container {
    padding-top: 100px;
    width: 1000px;
    position: absolute;
    left: 28.5%;
    margin-left: -50px;
  }

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
