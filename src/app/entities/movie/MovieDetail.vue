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
      <div>
      <div class="container">
        <div class="card flex-row flex-wrap">
          <div class="card header">
            <img class="movie-image" src="https://source.unsplash.com/random/300x300" alt="***" />
          </div>
          <div class="card-block px-2">
            <h1 class="card-title"> {{ movie.titulo }} ( {{movie.ano_salida}} ) </h1>
            <h4 class="subtitle">
              <p class="subtitle-tag"> {{ movie.fecha_estreno | moment('LL') }} | </p>
              <p class="subtitle-tag"> {{ movie.duracion }} | </p>
              <p class="subtitle-tag"> {{ movie.genero.nombre }} |</p>
              <p class="subtitle-tag"> {{ movie.productora }} | </p> 
              <p class="subtitle-tag"> {{ movie.pais }} </p>
              
            </h4>
            <p class="description"> {{ movie.sinopsis }}</p>

            <div v-if="movieUser">

            <b-button-group v-model="movieUser.estado" @change="updateMovieUser()">
              <b-button :class="[{ 'hide': movieUser.estado == 'Pendiente' }]" @click="addToViewed()">
                <span :class="[{ 'hide': movieUser.estado != 'Vista' }]"> Add to </span>
                <span :class="[{ 'hide': movieUser.estado == 'Vista' }]"> Remove from </span>
                Viewed <font-awesome-icon icon="plus-square"/> 
              </b-button>

              <b-button :class="[{ 'hide': movieUser.estado == 'Vista' }]" @click="addToPending()">
                <span :class="[{ 'hide': movieUser.estado != 'Pendiente' }]"> Add to </span>
                <span :class="[{ 'hide': movieUser.estado == 'Pendiente' }]"> Remove from </span>
                Pending <font-awesome-icon icon="plus-square"/> 
              </b-button>
            </b-button-group>

              <star-rating v-if="movieUser.estado == 'Vista'" v-model="movieUser.valoracion"
                @rating-selected ="updateMovieUser()"
                :star-size="25"
                v-bind:show-rating="false"
                :padding= 1.5>
              </star-rating>

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

export default {
  components: { LoadingPage },
  data() {
    return {
      loading: false,
      movieUser: {},
      error: null,
      selected: null,
      movie: {},
      user:{},
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin()
    },
    addToViewed() {
      if (this.movieUser.estado == 'Vista') {
        return this.movieUser.estado =  '';
      }
      else
        return this.movieUser.estado = 'Vista';
    },
    addToPending() {
      if (this.movieUser.estado == 'Pendiente'){
        return this.movieUser.estado = '';
      }
      else
        return this.movieUser.estado = 'Pendiente';
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created() {
    this.fetchData()
    this.fetchMovieUser()
    this.getUsuario()
    this.getPelicula()
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
      if(this.movieUser != null && this.movieUser.estado != ''){
        HTTP.put(`movieusers/${this.movieUser.id}`, this.movieUser)
        .then(response => console.log(response))
        .catch(err => this.error = err.message)
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
    getUsuario(){
        if(auth.getLogin() != ''){
          HTTP.get(`users`, {params: {login: auth.getLogin()}})
          .then(response => this.user = response.data)
        }
    },
    getPelicula(){
        HTTP.get(`movies/${this.$route.params.id}`)
        .then(response => this.movie = response.data)
    },
    eliminateMovie(){
      HTTP.delete(`movies/${this.$route.params.id}`, {params: { id: this.movie.id }})
       .then(response =>
          this.$router.replace({ name: 'MovieList', params: { id: response.data }}))
       .catch(err => this.error = err.message)
    },
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

