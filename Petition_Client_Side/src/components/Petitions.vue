<template>
  <div class="container">
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>
    <section>
      <b-field grouped group-multiline>
        <b-field label="Search by Keywords" expanded>
          <p class="control">
            <b-input icon="magnify" placeholder="Filter by word or phrase... " v-model="phrase"></b-input>
          </p>
        </b-field>

        <p class="control">
          <b-field label="Petition Category" expanded>
            <b-select placeholder="Petition Category" v-model="categoryId">
              <option
                v-for="category in categories"
                :value="category.categoryId"
                :key="category.categoryId">
                {{ category.categoryId}} {{ category.name }}
              </option>
            </b-select>
          </b-field>
        </p>

        <p class="control">
          <b-field label="Sort By" expanded>
            <b-select placeholder="Sort By" v-model="sortBy">
              <option
                v-for="sortRule in sortRules"
                :value="sortRule.sql"
                :key="sortRule.sql">
                {{ sortRule.name }}
              </option>
            </b-select>
          </b-field>
        </p>
        <br/>
      </b-field>

      <b-field style="float: right;"grouped group-multiline>
        <p class="control">
          <button @click="clear" class="button is-danger">Clear</button>
        </p>
        <button @click="search" class="button is-info">Search</button>
      </b-field>
    </section>

    <br/>
    <br/>
    <hr>
    <div class="columns">
      <div class="column is-one-quarter">
        <b-button class="is-warning" style="float: left;"
                  tag="router-link"
                  to="/CreatePetition">
                  Create Petition
        </b-button>
      </div>
      <div class="column">
        <b-button class="is-primary" style="float: right;"
                  @click="this.getPetitions">
          See All Petitions
        </b-button>
      </div>
    </div>
    <hr>

    <b-table :data="petitions" :paginated="true" :per-page="10" :current-page.sync="currentPage">
      <template slot-scope="props">
        <b-table-column field="title" label="Title">
          {{ props.row.title }}
        </b-table-column>

        <b-table-column field="category" label="Category">
          {{ props.row.category }}
        </b-table-column>

        <b-table-column field="authorName" label="Author" centered>
          {{ props.row.authorName }}
        </b-table-column>

        <b-table-column label="">
          <img class="crop-petition" v-bind:src="petitionImageURL(props.row.petitionId)">
        </b-table-column>

        <b-table-column field="signatureCount" label="Signatures" centered>
          {{ props.row.signatureCount }}
        </b-table-column>

        <b-table-column class="view_button" label="" centered>
          <b-button  @click="view(props.row.petitionId)"
                     type="is-info">
            View
          </b-button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
  import api from '../api.js'
  import axios from 'axios'
  const SERVER_URL = 'http://localhost:4941/api/v1'
  export default {
    data (){
      return{
        currentPage: 1,
        error: "",
        errorFlag: false,
        petitions: [],
        image: null,
        phrase: null,
        categoryId: null,
        categories: null,
        sortBy: null,
        sortRules: [
          {"name": "alphabetically by title, A - Z",
          "sql": "ALPHABETICAL_ASC" },
          {"name": "alphabetically by title, Z - A",
          "sql": "ALPHABETICAL_DESC" },
          {"name": "the number of signatures, from least to most",
            "sql": "SIGNATURES_ASC" },
          {"name": "the number of signatures, from most to least",
            "sql": "SIGNATURES_DESC" }
            ]

      }
    },
    mounted: function() {
      this.getPetitions();
      this.getCategories();
    },
    methods: {
      getPetitions: function() {
        api.getPetitions()
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
      search() {
        let queryString = ''

        if (this.phrase != null) {
          queryString = `?q=${this.phrase}`
        }
        if (this.categoryId != null) {
          if (queryString == '') {
            queryString = `?categoryId=${this.categoryId}`
          }
          else{
            queryString += `&categoryId=${this.categoryId}`
          }
        }
        if (this.sortBy != null) {
          if (queryString == '') {
            queryString = `?sortBy=${this.sortBy}`
          }
          else{
            queryString += `&sortBy=${this.sortBy}`
          }
        }

        axios.get(`${SERVER_URL}/petitions${queryString}`)
          .then(response => {
            this.petitions = response.data;
            return
          })
          .catch(error => console.log(error)

          )
      },
      getCategories() {
        axios.get(SERVER_URL + "/petitions/categories")
          .then(response => {
            this.categories = response.data
            return
          })
          .catch(error => {
            console.log(error)
            return
          })
      },
      petitionImageURL(petitionId) {
        let image = 'http://localhost:4941/api/v1/petitions/' + petitionId + '/photo';
        return image;
      },
      view(id) {
        this.$router.push({path: '/Petition/' + id});
      },
      clear() {
        this.phrase = null
        this.categoryId = null
        this.sortBy = null
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
  /*.crop-petition img {*/
  /*  width: 400px;*/
  /*  height: 300px;*/
  /*}*/
</style>
