<template>
  <div>
    <!--    <body>-->
    <section class="hero">
      <figure class="image crop">
        <img :src="petitionImageURL(petition.petitionId)">
      </figure>
    </section>
    <div class="container is-centered">
          <span class="icon">
          <i class="fab fa-twitter"></i>
          </span>
      <ShareNetwork
        network="twitter"
        :url="petitionURL(petition.petitionId)"
        title="Check this Petition out!"
        description="Help out by sharing and signing this petition"
        quote="Every signature counts - Petition NZ"
        hashtags="seng365,petitionNZ"
      >
        Twitter
      </ShareNetwork>
      <span class="icon">
          <i class="fab fa-reddit"></i>
          </span>
      <ShareNetwork
        network="reddit"
        :url="petitionURL(petition.petitionId)"
        title="Check this Petition out!"
        description="Help out by sharing and signing this petition"
        quote="Every signature counts - Petition NZ"
        hashtags="seng365,petitionNZ"
      >
        Reddit
      </ShareNetwork>
      <span class="icon">
          <i class="fab fa-telegram"></i>
          </span>
      <ShareNetwork
        network="telegram"
        :url="petitionURL(petition.petitionId)"
        title="Check this Petition out!"
        description="Help out by sharing and signing this petition"
        quote="Every signature counts - Petition NZ"
        hashtags="seng365,petitionNZ"
      >
        Telegram
      </ShareNetwork>
    </div>
    <section class="section">
      <br />
      <div class="container has-text-centered">
        <h2 class="title">{{petition.title}}</h2>
      </div>
      <div class="container has-text-centered">
        <p><strong>Category: </strong>{{petition.category}}</p>
      </div>

    </section>
    <!--    </body>-->
    <div class="container main-content">
      <!-- Begin About Me Section -->
      <div class="section-light about-me" id="about-me">
        <div class="container has-text-centered">
          <p>{{petition.description}}</p>
        </div>

        <div class="columns is-centered" style="padding: 2rem">
          <div class="column">
            <div class="card">
              <div class="card-image">
              </div>
              <div class="card-content">
                <div class="content">
                  <p class="title is-4">Signature Count</p>
                  <p class="subtitle is-6">{{petition.signatureCount}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-image">
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">Petition Created</p>
                    <p class="subtitle is-6">{{petition.createdDate}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-image">

              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">Petition Closes</p>
                    <p class="subtitle is-6">{{petition.closingDate}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="petition.closingDate > this.todaysDate || petition.closingDate == null" class="petition-button is-center">
          <button v-if="store.getters.getAuthenticationStatus && this.authorId != store.getters.getUserId" class="button is-medium is-danger" @click="remove">
            Remove Signature
          </button>
          <button v-if="store.getters.getAuthenticationStatus &&  this.authorId != store.getters.getUserId" class="button is-medium is-info" @click="confirm">
            Sign Petition
          </button>
        </div>

        <div v-if="petition.closingDate > this.todaysDate || petition.closingDate == null" class="petition-button is-center">
          <button v-if="store.getters.getAuthenticationStatus && this.authorId == store.getters.getUserId" class="button is-medium is-info" @click="edit(petition.petitionId)">
            Edit Petition
          </button>
        </div>


        <br/>
        <!--     Author Details start here-->
        <div class="columns is-centered" style="padding: 2rem">
          <div class="column">
            <div>
              <div>
              </div>
              <div>
                <h3 class="title">Author Information </h3>
                <img class="is-rounded crop-author":src="authorImageURL(petition.authorId)"
                         @error="showDefaultUserImg"/>
                <p class="is-larger">
                  <strong>Author: </strong>{{author.name}}
                </p>
                <br />
                <p v-if="author.city != null" class="is-larger">
                  <strong>City: </strong>{{author.city}}
                </p>
                <br />
                <p v-if="author.country != null"class="is-larger">
                  <strong>Country: </strong>{{author.country}}
                </p>
              </div>
            </div>
          </div>

          <div class="signature-table">
            <div>
              <div>
              </div>
              <div>
                <div class="media">
                  <div class="media-content">
                    <b-button v-if="!visible" class="is-primary" @click="showSignatures">Show Signatures</b-button>
                    <b-button v-if="visible" class="is-warning" @click="closeSignatures">Close Signatures</b-button>
                    <br/>
                    <br/>
                    <table class="table table-centered" v-if="visible">
                      <thead>
                      <tr>
                        <th> Name </th>
                        <th> City </th>
                        <th> Country </th>
                      </tr>
                      </thead>
                      <tr v-for="signee in signatures">
                        <td>{{ signee.name }}</td>
                        <td>{{ signee.city }}</td>
                        <td>{{ signee.country }}</td>
                        <td><img class="crop-signee":src="signeeImageURL(signee.signatoryId)"
                                 @error="showDefaultUserImg"/></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1'
  import store from '../store'

  export default {
    name: "Petition",
    data () {
      var dateobj = new Date();
      return{
        petition: null,
        petitionId: this.$route.params.petitionId,
        author: null,
        authorId: null,
        signatures: null,
        signee: null,
        visible: false,
        store: store,
        petitionImage: null,
        todaysDate: dateobj.toISOString(),
        url: "www.test"
      }
    },

    mounted: function() {
      this.getPetition(this.petitionId)
      this.getSignatures(this.petitionId)

    },
    methods: {
      edit(id) {
        this.$router.push({path: '/EditPetition/' + id})
      },
      getPetition: function(petitionId) {
        this.$http.get(`http://localhost:4941/api/v1/petitions/${petitionId}`)
          .then(function(response) {
            this.petition = response.data
            this.authorId = response.data.authorId
            this.getAuthor(this.authorId)
          })
      },
      getAuthor: function(authorId) {
        this.$http.get(`http://localhost:4941/api/v1/users/${authorId}`)
          .then(function(response) {
            this.author = response.data
          })
      },
      getSignatures: function(petitionId) {
        this.$http.get(`http://localhost:4941/api/v1/petitions/${petitionId}/signatures`)
          .then(function(response) {
            this.signatures = response.data
          })
      },
      showDefaultUserImg(event) {
        event.target.src = "../images/default_profile_image.jpg";
      },
      showSignatures: function() {
        this.visible = true;
      },
      closeSignatures: function() {
        this.visible =false;
      },
      petitionImageURL(petitionId) {
        let image = 'http://localhost:4941/api/v1/petitions/' + petitionId + '/photo';
        return image;
      },
      authorImageURL(authorId) {
        let image = 'http://localhost:4941/api/v1/users/' + authorId +'/photo/';
        return image;
      },
      signeeImageURL(signeeId) {
        let image = 'http://localhost:4941/api/v1/users/' + signeeId +'/photo/';
        return image
      },
      petitionURL(id) {
        let url = `http://localhost:8080/Petition/${id}`
        return url
      },
      signPetition() {
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken")
        axios.post(SERVER_URL + `/petitions/${this.petitionId}/signatures`).then(response => {
          console.log(response)
          this.getSignatures(this.petitionId)
          this.displaySuccess('Petition Signed')
        })
          .catch(error => this.displayError(error.response))
      },
      removeSignature() {
        axios.defaults.headers.common["X-Authorization"] = localStorage.getItem("authToken")
        axios.delete(`${SERVER_URL}/petitions/${this.petitionId}/signatures`).then(response => {
          console.log(response)
          this.getSignatures(this.petitionId)
          this.displaySuccess('You have removed your signature from this Petition')
        })
          .catch(error => {
            console.log(error)
            this.displayError2('You have not signed this Petition')})

      },
      confirm() {
        this.$buefy.dialog.confirm({
          type: 'is-success',
          message: 'You are about to sign this petition. Are you sure?',
          onConfirm: () => this.signPetition()
        })
      },
      remove() {
        this.$buefy.dialog.confirm({
          type: 'is-danger',
          message: 'You are about to remove your signature from this petition. Are you sure?',
          onConfirm: () => this.removeSignature()
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
      displayError(errorStatusCode){
        console.log(errorStatusCode)
        const message = errorStatusCode.statusText
        this.$buefy.toast.open({
          duration: 5500,
          message: message,
          type: 'is-danger',
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
  #inner {
    width: 50%;
    margin: 0 auto;
  }
  .petition-button {
    text-align: center;
  }
  .container {
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
  }
  .has-text-centered {
    text-align: center!important;
  }
  .crop {
    /*width: 1000px;*/
    height: 600px;
    overflow: hidden;
    display: flex;
    /*background-position: center;*/
    justify-content: center;
  }
  .crop img {
    width: 100%;
    height: 800px;
    margin: -90px;
    /*background-position: center;*/
  }
  .table-centered {
    margin-left:auto;
    margin-right:auto;
  }
  .crop-signee {
    width: 180px;
    height: 150px;
    overflow: hidden;
  }
  .crop-signee img {
    width: 400px;
    height: 300px;
    margin: -75px 0 0 -100px;
  }
  .crop-author {
    width: 200px;
    height: 200px;
    overflow: hidden;
  }
  .crop-author img {
    width: 400px;
    height: 300px;
  }
</style>
