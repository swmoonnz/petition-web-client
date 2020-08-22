<template>
  <div class="container">
      <b-field>
        <h1 class="title">Edit Petition</h1>
      </b-field>

      <b-button
                class="is-primary"
                tag="router-link"
                to="/MyPetitions"
                type="is-light">
        Go back
      </b-button>
      <hr>

      <div v-if="this.closingDate > this.todaysDate || this.closingDate == null">
        <form @submit.prevent="editPetition">
          <b-field group-multiline grouped>
            <b-field label="Title" expanded >
              <b-input v-model="title" placeholder="Title" required></b-input>
            </b-field>
          </b-field>
          <br />

          <b-field grouped group-multiline>
            <b-field class="control" label="Petition Category " expanded>
              <b-select placeholder="Petition Category" v-model="categoryId" expanded>
                <option
                  v-for="category in categories"
                  :value="category.categoryId"
                  :key="category.categoryId">
                  {{ category.categoryId}} {{ category.name }}
                </option>
              </b-select>
            </b-field>
            <subtitle ><i> Current Category: {{this.category}}</i></subtitle>
          </b-field>
          <br/>

          <b-field grouped group-multiline>
            <b-field label="Closing Date">
              <b-datetimepicker v-model="newDate"
                                placeholder="Click to select... (Optional)"
                                :min-datetime=minDate expanded>
                <template slot="left">
                  <button class="button is-danger"
                          @click="newDate = null">
                    <span>Clear</span>
                  </button>
                </template>
              </b-datetimepicker>
            </b-field>
            <subtitle ><i> Current Closing Date: {{this.closingDate}}</i></subtitle>
          </b-field>

          <br />

          <b-field label="Description" expanded>
            <b-input v-model="description" maxlength="200" type="textarea" placeholder="Enter a description" required></b-input>
          </b-field>

          <b-field label="Current Banner">
            <figure class="image crop">
              <img class="crop-petition" :src="petitionImageURL($route.params.petitionId)" >
            </figure>
          </b-field>
          <b-field class="file">
            <b-upload accept=".jpg, .png, .gif, .jpeg" v-model="file">
              <a class="button is-primary">
                <b-icon icon="upload"></b-icon>
                <span>Change Banner</span>
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
      <div v-if="this.closingDate < this.todaysDate">
        <br />
        <h1> Changes to a closed petition cannot be made</h1>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1'
  export default {
      name: "EditPetition",
      props: ["petitionInfo"],

    data() {
      const today = new Date()
      var dateobj = new Date();
      return{
        petitionId: this.$route.params.petitionId,
        petition: null,
        title: null,
        category: null,
        closingDate: null,
        description: null,
        currentImage: '',
        categoryId: null,
        categories: null,
        closingDate: null,
        minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()+1),
        file: null,
        newDate: null,
        authorId: null,
        todaysDate: dateobj.toISOString()
      }
    },
    mounted: function() {
      this.getCategories()
      this.getPetition(this.petitionId)
    },
    methods: {
      getPetition: function(petitionId) {
        this.$http.get(`http://localhost:4941/api/v1/petitions/${petitionId}`)
          .then(function (response) {
            this.petition = response.data
            this.title = response.data.title
            this.category = response.data.category
            this.closingDate = response.data.closingDate
            this.description = response.data.description
            this.authorId = response.data.authorId
            if (this.authorId != localStorage.getItem('userId')) {
              this.$router.push({path: '/Petitions'});
            }
          })
      },
      getCategories() {
        axios.get(SERVER_URL + "/petitions/categories")
          .then(response => {
            this.categories = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      editPetition() {
        let updatedPetition;
        if (this.categoryId == null && this.newDate == null) {
          updatedPetition = {
            "title": this.title,
            "description": this.description
          }
        }
        else if (this.newDate == null && this.categoryId != null) {
          updatedPetition = {
            "title": this.title,
            "description": this.description,
            "categoryId": this.categoryId
          }
        }
        else if (this.categoryId == null && this.newDate != null) {
          let date = `${this.newDate.getFullYear()}-${this.newDate.getMonth() + 1}-${this.newDate.getDate()} `
          let time = `${this.newDate.getHours()}:${this.newDate.getMinutes()}`
          let formatDateTime = `${date}${time}`
          updatedPetition = {
            "title": this.title,
            "description": this.description,
            "closingDate": formatDateTime
          }
        }
          else if (this.closingDate != null) {
            let date = `${this.newDate.getFullYear()}-${this.newDate.getMonth() + 1}-${this.newDate.getDate()} `
            let time = `${this.newDate.getHours()}:${this.newDate.getMinutes()}`
            let formatDateTime = `${date}${time}`
            updatedPetition = {
              "title": this.title,
              "description": this.description,
              "categoryId": this.categoryId,
              "closingDate": formatDateTime
          }
        }
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken");
        axios.patch(`${SERVER_URL}/petitions/${this.petitionId}`, updatedPetition)
          .then((response => {
          console.log(response)
          if (this.file != null) {
            this.uploadPhoto()
            this.displaySuccess()
            this.$router.push({path: '/MyPetitions'})
            location.reload()
          }
          else {
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
      petitionImageURL(petitionId) {
        let image = 'http://localhost:4941/api/v1/petitions/' + petitionId + '/photo';
        return image;
      },
      displaySuccess() {
        const message = 'Changes Saved'
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
    padding-top: 100px;
    width: 1000px;
    position: absolute;
    left: 28.5%;
    margin-left: -50px;
  }

  .crop-petition {
    width: 400px;
    height: 200px;
    overflow: hidden;
  }
</style>
