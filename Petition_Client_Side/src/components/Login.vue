<template>
  <div class="container">
    <div class="form-container sign-in-container">
      <section>
        <form action="" method="post" class="form-register">
          <h1 class="title">Login</h1>
          <b-field label="Email">
            <b-input class="help" placeholder="Email"
                     v-model="email"

                     maxlength="40">
            </b-input>
          </b-field>

          <b-field label="Password">
            <b-input placeholder="Password"
                     v-model="password"
                     type="password"
                     maxlength="20">
            </b-input>
          </b-field>
          <b-button @click="login"
                    type="is-info">
            Login
          </b-button>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
  import store from "../store"

  export default {
    name: 'Login',
    data() {
      return {
        email: "",
        password: ""
      }
    },
    methods: {
      login() {
        this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify({
          email: this.email,
          password: this.password
        })).then((response => {
          localStorage.setItem('authToken', response.data.token)
          localStorage.setItem('userId', response.data.userId)
          let payload = {'token': response.data.token, 'userId': response.data.userId}
          store.dispatch('validateByTokenAndUserId', payload).then()
          this.displaySuccess()
          this.$router.push({path: '/'})
        }))
          .catch(error => this.displayError(error.status))
      },
      displaySuccess(){
        const message = 'Login Successful'
        this.$buefy.toast.open({
          duration:5500,
          message: message,
          type: 'is-success',
          position: 'is-top'
        })
      },
      displayError(errorStatusCode){
        const message = this.getErrorMessageFromStatusCode(errorStatusCode)
        this.$buefy.toast.open({
          duration:5500,
          message: message,
          type: 'is-danger',
          position: 'is-top'
        })
      },
      getErrorMessageFromStatusCode(statusCode){
        let message = "Incorrect email or password"
        if(statusCode === 400){
          message = "Incorrect email or password"
        }
        return message;
      }
    }
  }
</script>

<style scoped>
  .container {
    padding-top: 100px;
    width: 500px;
  }

  @media only screen and (max-width: 600px) {
    .container {
      width: 100%;
    }
  }

</style>
