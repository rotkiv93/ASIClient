<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div v-if="movie">
        <b-btn
          v-if="isAdmin"
          :to="{ name: 'MovieUpdate', params: { id: movie.id }}"
          variant="primary">Edit</b-btn>
        <b-btn
          v-if="isAdmin"
          variant="primary"
          @click="eliminateMovie()">Eliminate</b-btn>

      <div class="container">
        <div class="card flex-row flex-wrap">
          <div class="card header">
            <b-img class="movie-image" thumbnail v-bind:src="ruta" alt="***" />
          </div>
          <div class="card-block px-2">
            <h1 class="card-title"> {{ movie.titulo }} ({{movie.ano_salida}}) </h1>
            <h4 class="subtitle">
              <p class="subtitle-tag"> {{ movie.genero.nombre }} |</p>
              <p class="subtitle-tag"> {{ movie.duracion }} min | </p>
              <p class="subtitle-tag"> {{ movie.productora }} | </p> 
              <p class="subtitle-tag"> {{ movie.pais }} </p>
              
            </h4>
            <p class="description"> {{ movie.sinopsis }}</p>

            <div v-if="movieUser">
              <div>
                <select v-if="movieUser" v-model="movieUser.estado" @change="updateMovieUser()">
                   <option v-for="option in estado" v-bind:value="option.value">
                  {{ option.text }}
                  </option>
                </select>

                <star-rating v-if='oculta()' v-model="movieUser.valoracion"
                 @rating-selected ="updateMovieUser()"
                 v-bind:star-size=25
                 v-bind:show-rating="false"
                 v-bind:padding= 1.5>
                 </star-rating>
              </div>
            </div>
            <div>
              <b-btn v-if="!movieUser" variant="success" @click="post()"> Empieza a votar! </b-btn>

              <b-btn class="button" size=lg @click="back()">
                <font-awesome-icon icon="arrow-left"/> 
              </b-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import theMovieDb from 'themoviedb-javascript-library'

export default {
  components: { LoadingPage },
  data() {
    return {
      loading: false,
      movieUser: {},
      error: null,
      selected: null,
      movie: {},
      ruta: null,
      user:{},
      estado: [{value: null, text: 'Marcar Como'},
              {value: 'Vista', text: 'Vista'},
              {value: 'Pendiente', text: 'Pendiente'}],
      
      api_key: "31cde0355b497e2024b6dcd18cc0347d",
      base_uri: "http://api.themoviedb.org/3/",
      images_uri: "http://image.tmdb.org/t/p/",
      timeout: 2000
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin()
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created() {
    theMovieDb.common.api_key = "31cde0355b497e2024b6dcd18cc0347d";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";
    theMovieDb.common.images_uri = "https://image.tmdb.org/t/p/";
    theMovieDb.common.timeout = 4000;

    this.getPelicula()
    this.fetchData()
    this.fetchMovieUser()
    this.getUsuario()
    //theMovieDb.movies.getImages({"id": 550}, this.successCB, this.errorCB)
  },
  methods: {
    fetchData() {
      this.error = this.movie = this.movieUser = null
      this.loading = true

      HTTP.get(`movies/${this.$route.params.id}`)
      .then(response => this.movie = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
      },
    fetchMovieUser(){
       if(auth.getLogin() != ''){
         HTTP.get(`movieusers`, {params:{movieID: this.$route.params.id, userLogin: auth.getLogin()}})
        .then(response => this.movieUser = response.data)
        .catch(err => this.error = err.message)
      }
      if(this.movieUser) this.movieUser = {};
    },
    back() {
      this.$router.go(-1)
    },
    updateMovieUser(){
      if(this.movieUser != null && this.movieUser.estado != null){
        HTTP.put(`movieusers/${this.movieUser.id}`, this.movieUser)
        .catch(err => this.error = err.message);
      } else {
        if (this.movieUser.estado == null){
          HTTP.delete(`movieusers/${this.movieUser.id}`, {params: { id: this.movieUser.id }})
          .catch(err => this.error = err.message);
          this.movieUser= {}
        }
      }
    },
    post(){
      if(auth.getLogin() != ''){
        this.movieUser = {}
        this.movieUser.usuario = this.user
        this.movieUser.pelicula = this.movie
        this.movieUser.estado = 'Vista'

        HTTP.post(`movieusers`, this.movieUser)
        .then(response => this.movieUser = response.data)
        .catch(err => this.error = err.message)
        } else{
          this.$router.replace({ name: 'Login'})
        }
    },
    imagen(titulo){
            theMovieDb.search.getMovie({"query":encodeURI(titulo)}, this.successCB, this.errorCB)
    },
    getUsuario(){
        if(auth.getLogin() != ''){
          HTTP.get(`users`, {params: {login: auth.getLogin()}})
          .then(response => this.user = response.data)
        }
    },
    getPelicula(){
        HTTP.get(`movies/${this.$route.params.id}`)
        .then(response => this.movie = response.data)
        .then(response => this.imagen(response.titulo))
    },
    eliminateMovie(){
      HTTP.delete(`movies/${this.$route.params.id}`, {params: { id: this.movie.id }})
       .then(response =>
          this.$router.replace({ name: 'MovieList', params: { id: response.data }}))
       .catch(err => this.error = err.message)
    },
    oculta(){
      if (this.movieUser.estado == 'Vista'){
        return true
      } else return null
    },
     successCB: function (data) {
      var json = JSON.parse(data);
      console.log("Success callback: https://image.tmdb.org/t/p/w500/" + json.results[0].poster_path);
      this.ruta = " https://image.tmdb.org/t/p/w300/" + json.results[0].poster_path;
    },  
      errorCB: function (data) {
      console.log("Error callback: " + data);
    }
  }
}
</script>

<style scoped lang="scss">

  $text: #777;

  .card{
    background: #2B2A34;
  }

  .movie-image{
  }

  .card-title{
    font-size: 45px;
    font-weight: 600;
    color: white;
  }

  .subtitle{
    font-size: 15px;
    font-weight: 600;
    color: red;
  }

  .subtitle-tag{
    display: inline;
  }

  .description{
    font-size: 15px;
    margin-bottom: 24px;
    max-width: 450px;
    color: white;
  }

  .viewed-button{
    padding-left: 10px;
    padding-top: 2px;
    background-color: Transparent;
    border: none;
  }

  .hide{
    display: none;
  }

  /* .viewed-shadow {
    box-shadow: 0 0 50px 15px rgba(251, 255, 15, 0.25);
  }

  .pending-shadow {
    box-shadow: 0 0 50px 15px rgba(251, 255, 15, 0.25);
  } */

  .button{
    position: absolute;
    top: 0%;
    left: 0%;
    overflow: auto;
    background-color: Transparent;
    border: none;
    cursor:pointer;
  }

</style>

