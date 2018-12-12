<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div v-if="movie">
      <nav v-if="isAdmin" class="nav" style="margin-bottom:1%">
       <div v-if="isAdmin" class="float-right">
        <b-btn
          v-if="isAdmin"
          :to="{ name: 'MovieUpdate', params: { id: movie.id }}"
          variant="outline-warning">Edit</b-btn>
        <b-btn style="margin-left:2%;"
          v-if="isAdmin"
          variant="outline-danger"
          @click="eliminateMovie()">Remove</b-btn>
        </div>
      </nav>

      <div style="width:80%; margin:0 auto;">
        <div>
          <div class="mov-user" style="width:15%; float:right;">
                <div v-if="movieUser" style="margin-top:2%; margin-bottom:2%;">
                     <h5>Add to: </h5>
                  <select v-if="movieUser" v-model="movieUser.estado" @change="updateMovieUser()">
                     <option v-for="option in estado" v-bind:value="option.value">
                    {{ option.text }}
                    </option>
                  </select>
                  
                  <h5  v-if="oculta()" style="margin-top:10%;">Rate: </h5>
                  <star-rating v-if='oculta()' v-model="movieUser.valoracion"
                   @rating-selected ="updateMovieUser()"
                   v-bind:star-size=22
                   v-bind:max-rating=10
                   v-bind:glow=1.5
                   
                   v-bind:show-rating="false"
                   v-bind:padding= 1.5>
                   </star-rating>
                </div>
                <b-btn v-if="!movieUser" variant="outline-success" @click="post()"> Empieza a votar! </b-btn>
          </div>
          <div class="container" style="width:85%; float:left">
            <div class="card flex-row flex-wrap">
              <div class="card header">
                <b-img class="movie-image" thumbnail v-bind:src="getImagen()" alt="***" />
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
              </div>
            
            <div>
              <b-btn class="button" size=lg @click="back()">
                <font-awesome-icon icon="arrow-left"/> 
              </b-btn>
            </div>
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
      ruta: null,
      user:{},
      estado: [{value: null, text: 'Cancelar'},
              {value: 'Vista', text: 'Vista'},
              {value: 'Pendiente', text: 'Pendiente'}],
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
    this.getPelicula()
    this.fetchData()
    this.fetchMovieUser()
    this.getUsuario()

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
         HTTP.get(`movieusers/${this.$route.params.id}/${auth.getLogin()}`)
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
          .then(response =>
              this.$router.replace({ name: 'MovieList'}))
          .catch(err => this.error = err.message);
          
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
    getUsuario(){
        if(auth.getLogin() != ''){
          HTTP.get(`users/${auth.getLogin()}`)
          .then(response => this.user = response.data)
        }
    },
    getPelicula(){
        HTTP.get(`movies/${this.$route.params.id}`)
        .then(response => this.movie = response.data)
    },
    getImagen(){
      return "/movies/image/" + this.movie.ruta;
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

  div.mov-user{ 

  }

</style>

