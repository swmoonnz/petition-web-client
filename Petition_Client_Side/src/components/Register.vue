<template>
  <div class="container">
    <h1 class="title">Create Account</h1>
    <form @submit.prevent="createUser">
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

      <b-field group-multiline grouped>
        <b-field label="Password" expanded >
          <b-input v-model="password" type="password" placeholder="Password" required></b-input>
        </b-field>
        <b-field label="Confirm Password"
                 :message="[{'Passwords do not match':isDisabled}]" expanded>
          <b-input v-model="confirmPassword" type="password" placeholder="Confirm Password" required></b-input>
        </b-field>
      </b-field>

      <b-field group-multiline grouped>
        <b-field label="City" expanded >
          <b-input v-model="city" placeholder="City (optional)"></b-input>
        </b-field>
        <b-field label="Country" expanded>
          <b-input v-model="country" placeholder="Country (optional)"></b-input>
        </b-field>
      </b-field>
      <br>
      <h1> Upload a Profile Photo!</h1>
      <subtitle><i>Optional</i></subtitle>
      <b-field class="file">
        <b-upload accept=".jpg, .png, .gif, .jpeg" v-model="file">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Click to upload</span>
          </a>
        </b-upload>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
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
  import store from "../store";
  const SERVER_URL = 'http://localhost:4941/api/v1'
  export default {
    name: "Registration",
    data() {
      return {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: null,
        country: null,
        file: null,
        userId: null
      }
    },
    computed: {
      isDisabled() {
        return !(this.password == this.confirmPassword);
      }
    },
    methods: {
      createUser() {
        let userDetails;
        if (this.city != null && this.country != null) {
          userDetails = {
            "name": this.name,
            "email": this.email,
            "password": this.password,
            "city": this.city,
            "country": this.country
          }
        } else if (this.city != null) {
          userDetails = {
            "name": this.name,
            "email": this.email,
            "password": this.password,
            "city": this.city
          }
        } else if (this.country != null) {
          userDetails = {
            "name": this.name,
            "email": this.email,
            "password": this.password,
            "country": this.country
          }
        } else {
          userDetails = {
            "name": this.name,
            "email": this.email,
            "password": this.password,
          }
        }
        this.$http.post('http://localhost:4941/api/v1/users/register', JSON.stringify(userDetails))
          .then((response => {
            console.log(response)
            this.displaySuccess()
            this.login()
          }))
          .catch(error => this.displayError(error.status))
      },
      login() {
        this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify({
          email: this.email,
          password: this.password
        })).then((response => {
          localStorage.setItem('authToken', response.data.token)
          localStorage.setItem('userId', response.data.userId)
          this.userId = response.data.userId
          let payload = {'token': response.data.token, 'userId': response.data.userId}
          store.dispatch('validateByTokenAndUserId', payload).then()
          if (this.file != null) {
            this.uploadPhoto()
            this.$router.push({path: '/Petitions'})
          }
          else{
            this.$router.push({path: '/Petitions'})
          }
        }))
          .catch(error => console.log(error.status))
        return
      },
      displayError(errorStatusCode) {
        const message = this.getErrorMessageFromStatusCode(errorStatusCode)
        this.$buefy.toast.open({
          duration: 5500,
          message: message,
          type: 'is-danger',
          position: 'is-top'
        })
      },
      displaySuccess() {
        const message = 'Registration Successful'
        this.$buefy.toast.open({
          duration: 5500,
          message: message,
          type: 'is-success',
          position: 'is-top'
        })
      },
      showDefaultUserImg() {
        let image = "../images/default_profile_image.jpg";
        return image
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
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 800px;
    padding-top: 100px;
  }

  @media only screen and (max-width: 600px) {
    .container {
      width: 100%;
    }
  }


</style>
