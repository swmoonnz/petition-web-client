<template>
  <div class="container">
    <h1 class="title">Create Petition</h1>
    <form @submit.prevent="createPetition">

      <b-field group-multiline grouped>
        <b-field label="Title" expanded >
          <b-input v-model="title" placeholder="Title" required></b-input>
        </b-field>
      </b-field>
      <br />

      <b-field label="Petition Category" expanded>
        <b-select placeholder="Petition Category" v-model="categoryId" expanded required>
          <option
            v-for="category in categories"
            :value="category.categoryId"
            :key="category.Id">
            {{ category.categoryId}} {{ category.name }}
          </option>
        </b-select>
      </b-field>
      <br/>

      <b-field label="Closing Date">
        <b-datetimepicker v-model="closingDate"
                          placeholder="Click to select... (Optional)"
                          :min-datetime=minDate>

          <template slot="left">
            <button class="button is-danger"
                    @click="closingDate = null">

              <span>Clear</span>
            </button>
          </template>
        </b-datetimepicker>
      </b-field>

      <br />

      <b-field label="Description" expanded>
        <b-input v-model="description" maxlength="200" type="textarea" placeholder="Enter a description" required></b-input>
      </b-field>

      <b-field class="file">
        <b-upload accept=".jpg, .png, .gif, .jpeg" v-model="file" required>
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Upload Image</span>
          </a>
        </b-upload>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
      </b-field>
      <p><i>(Bannner Image is Required)</i></p>

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
    name: "CreatePetition",

    data() {
      const today = new Date()
      return {
        title: "",
        categoryId: null,
        description: "",
        closingDate: null,
        file: null,
        categories: null,
        minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()+1),
        petitionId: null
      }
    },
    mounted: function() {
      this.getCategories()
    },
    methods: {
      getCategories() {
        axios.get(SERVER_URL + "/petitions/categories")
          .then(response => {
            this.categories = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      createPetition() {
        let petitionDetails;
        let categoryId = parseInt(this.categoryId)
        if (this.closingDate == null) {
          petitionDetails = {
            "title": this.title,
            "description": this.description,
            "categoryId": categoryId
          }
        } else if (this.closingDate != null) {
          let date = `${this.closingDate.getFullYear()}-${this.closingDate.getMonth() + 1}-${this.closingDate.getDate()} `
          let time = `${this.closingDate.getHours()}:${this.closingDate.getMinutes()}`
          let formatDateTime = `${date}${time}`
          petitionDetails = {
            "title": this.title,
            "description": this.description,
            "categoryId": categoryId,
            "closingDate": formatDateTime
          }
        }
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken");
        axios.post(SERVER_URL + "/petitions", petitionDetails)
          .then((response => {
            this.petitionId = response.data.petitionId
            this.signPetition()

            if (this.file != null) {
              this.uploadPhoto()
              this.displaySuccess()
              this.$router.push({path: '/MyPetitions'})
              location.reload()
            }
            else{
              this.displaySuccess()
              this.$router.push({path: '/MyPetitions'})
            }
          }))
              .catch(error => {
                console.log(error)
              })
      },
      uploadPhoto() {
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken");
        axios.put(SERVER_URL + "/petitions/" + this.petitionId + "/photo",
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
      signPetition() {
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken")
        axios.post(SERVER_URL + `/petitions/${this.petitionId}/signatures`).then(response => {
          console.log(response)
        })
        .catch(error => console.log(error))
      },
      displaySuccess() {
        const message = 'Petition Created'
        this.$buefy.toast.open({
          duration: 5500,
          message: message,
          type: 'is-success',
          position: 'is-top'
        })
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
