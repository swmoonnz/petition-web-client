<template>
  <div class="container">
    <div class="columns">
      <div class="column is-one-quarter">
        <b-button class="is-warning" style="float: left;"
                  tag="router-link"
                  to="/CreatePetition">
          Create Petition
        </b-button>
      </div>
    </div>
    <br />
    <br />
    <hr>
    <div v-if="this.petitions.length != 0">
      <div id="petitions">
        <table class="table">
          <thead>
          <tr>
            <th> Title </th>
            <th> Category </th>
            <th> Author's Name </th>
            <th> Signature Count </th>
            <th> Petition Image </th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          </thead>
          <tr v-for="petition in petitions">
            <td>{{ petition.title }}</td>
            <td>{{ petition.category }}</td>
            <td>{{ petition.authorName }}</td>
            <td>{{ petition.signatureCount}}</td>
            <td><img class="crop-petition" :src="petitionImageURL(petition.petitionId)" /></td>
            <td>
                <b-button  @click="remove(petition.petitionId)"
                           type="is-danger">
                  Delete
                </b-button>
            </td>
            <td>
              <b-button  @click="view(petition.petitionId)"
                       type="is-info">
                 View
              </b-button>
            </td>
            <td>
              <b-button  @click="edit(petition.petitionId)"
                         type="is-primary">
                Edit
              </b-button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1'
  export default {
    data (){
      return{
        error: "",
        errorFlag: false,
        petitions: [],
        image: null,
        userId: localStorage.getItem('userId')
      }
    },
    mounted: function() {
      this.getPetitions();
    },
    methods: {
      getPetitions: function() {
        axios.get(`${SERVER_URL}/petitions?authorId=${this.userId}`)
          .then(response => {
            this.petitions = response.data;
            return
          })
          .catch(error => {
            this.error = error;
            this.errorFlag = true;
            return
          });
      },
      petitionImageURL(petitionId) {
        let image = 'http://localhost:4941/api/v1/petitions/' + petitionId + '/photo';
        return image;
      },
      view(id) {
        this.$router.push({path: '/Petition/' + id});
      },
      edit(id) {
        this.$router.push({path: '/EditPetition/' + id})
      },
      removePetition(id) {
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken");
        axios.delete(`${SERVER_URL}/petitions/${id}`).then(response => {
          console.log(response)
          this.displaySuccess('Deletion Successful')
          this.$router.push({path: '/MyPetitions'})
          location.reload()
        })
          .catch(error => {
            console.log(error)
            this.displayError2('Petition not deleted')})
      },
      remove(id) {
        this.$buefy.dialog.confirm({
          type: 'is-danger',
          message: 'You are about to delete this Petition. Once you delete it you will not be able to' +
            ' retrieve this petition again.',
          onConfirm: () => this.removePetition(id)
        })
      },
      displaySuccess(message){
        this.$buefy.toast.open({
          duration:5500,
          message: message,
          type: 'is-success',
          position: 'is-top'
        })
      },
      displayError2(message) {
        this.$buefy.toast.open({
          duration: 5500,
          message: message,
          type: 'is-danger',
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

  @media only screen and (max-width: 600px) {
    .container {
      width: 100%;
    }
  }
  .crop-petition {
    width: 400px;
    height: 200px;
    overflow: hidden;
  }
</style>
