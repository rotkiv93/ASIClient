<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
        
        <b-button-group style="float:right;">
          <b-btn
            variant="primary"
            @click="upload()">Upload</b-btn>
          <b-btn 
            variant="outline-secondary"
            @click="back()">Back</b-btn>
        </b-button-group>

        <div>
            <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="text" v-model="searchTitle" placeholder="Search title">
            <button class="btn btn-secondary my-2 my-sm-0" type="submit" @click="getImageTitle()" v-b-toggle="'collapse2'">
            <font-awesome-icon icon="search"/> </button>
            </form>
        </div>
        
        <b-collapse id="collapse2">
            <b-btn  @click="addSelectedMovies()" v-b-toggle="'collapse2'">Add Selected Movies</b-btn>
            <b-card>
            <transition-group  tag="main" name="card">
            <article v-for="movie in searchMovies" :key="movie.id" class="card">
                <div class="image">
                <img v-bind:src= "movie.poster_path" v-on:load="isLoaded()" v-bind:class="{ active: isActive }">
                </div>
                <div class="description" style="float:right;">
                <h3 class="titulo">  {{movie.original_title}} </h3> 
                <p class="release">  {{movie.release_date}} </p>
                </div>
                <toggle-button v-model="movie.seleccionada"/>
            </article>
            </transition-group>
            </b-card>
             <b-btn style="margin-top:2%" @click="addSelectedMovies()" v-b-toggle="'collapse2'" >Add Selected Movies</b-btn>
        </b-collapse>
        
    
        <nav class="nav" style="margin-bottom:1%"></nav>
            <h3>Selected Movies</h3>
           <transition-group tag="main" name="card">
            <article v-for="(movie,key) in selectedMovies" :key="movie.id" class="card">
                <div class="image">
                <img v-bind:src= "movie.poster_path" v-on:load="isLoaded()" v-bind:class="{ active: isActive }">
                </div>
                <div class="description" style="float:right;">
                <h3 class="titulo">  {{movie.titulo}} </h3> 
                <p class="release">  {{movie.ano_salida}} </p>

                <div>
                  <b-button-group style="margin-top:5%;">
                  <b-btn v-b-modal=movie.id.toString()  variant="outline-warning">Edit</b-btn>       
                  <b-btn @click="deleteMovie(key)" variant="outline-danger"> Delete </b-btn>
                  </b-button-group>
                    <b-modal size="lg" v-bind:id=movie.id.toString() v-bind:title="movie.titulo">
                        <b-form>
                          <b-form-group
                          label="Titulo:"
                          label-for="title">
                          <b-form-input
                              id="titulo"
                              v-model="movie.titulo"
                              type="text"
                              required
                              placeholder="Introduce titulo"/>
                          </b-form-group>

                          <b-form-group class="form-group"
                          label="Pais:"
                          label-for="pais">
                          <b-form-input
                              id="pais"
                              v-model="movie.pais"
                              required
                              placeholder="Introduce pais "/>
                          </b-form-group>

                          <b-form-group
                          label="Productora:"
                          label-for="productora">
                          <b-form-input
                              id="productora"
                              v-model="movie.productora"
                              required
                              placeholder="Introduce productora "/>
                          </b-form-group>

                          <b-form-group
                          label="Duracion:"
                          label-for="duracion">
                          <b-form-input
                              id="duracion"
                              v-model="movie.duracion"
                              required
                              placeholder="Introduce duracion "/>
                          </b-form-group>

                          <b-form-group
                          label="Director:"
                          label-for="director">
                          <b-form-select
                              id="director"
                              :options="directors"
                              v-model="movie.director"
                              required/>
                          </b-form-group>

                          <b-form-group
                          label = "Actores:"
                          label-for="actores">
                          <multiselect
                              class =multiselect_actores 
                              v-model="movie.actores" 
                              :options="allActors" 
                              :multiple="true" 
                              :close-on-select="false" 
                              :clear-on-select="false" 
                              :preserve-search="true"
                              :custom-label="customLabel"
                              :show-labels="false"
                              placeholder="Pick some actors" 
                              label="nombre"
                              track-by="nombre"
                              :preselect-first="false">
                          </multiselect>
                          <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">
                          </b-form-group>

                          <b-form-group
                          label="Genero:"
                          label-for="genero">
                          <b-form-select
                              id="genero"
                              :options="genres"
                              v-model="movie.genero"
                              required/>
                          </b-form-group>

                          <b-form-group
                          label="Año salida:"
                          label-for="ano_salida">
                          <b-form-input
                              id="ano_salida"
                              v-model="movie.ano_salida"
                              required
                              placeholder="Introduce año salida "/>
                          </b-form-group>

                          <b-form-group
                          label="Fecha Estreno::"
                          label-for="fecha_estreno">
                          <b-form-input
                              id="fecha_estreno"
                              v-model="movie.fecha_estreno"
                              type="date"
                              required
                              placeholder="Introduce fecha estreno "/>
                          </b-form-group>

                          <b-form-group
                          label="Sinopsis:"
                          label-for="sinopsis">
                          <b-form-textarea
                              id="sinopsis"
                              v-model="movie.overview"
                              :rows="3"
                              :max-rows="6"
                              required
                              placeholder="Introduce sinopsis"/>
                          </b-form-group>

                          <b-form-group
                          label="Ruta de imagen:"
                          label-for="ruta">
                          <b-form-textarea
                              id="ruta"
                              v-model="movie.ruta"
                              required
                              placeholder="Introduce ruta de imagen"/>
                          </b-form-group>          
                        </b-form>
                  </b-modal>
              </div>
        </article>
    </transition-group>
    </div>

         
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import Multiselect from 'vue-multiselect'
import theMovieDb from 'themoviedb-javascript-library'
import Vue from 'vue'


export default {
  components: { LoadingPage,  Multiselect},
  data() {
    return {
        searchTitle: null,
      movieSearch: [],
      moviesSelected: [],
      error: null,
      isActive: false,
      loading: false,
      allGenres: [],
      allActors: [],
      allDirectors: []
    }
  },
  computed: {
    genres() {
      return this.allGenres.map(genre => {
        return {
          text: genre.nombre,
          value: genre
        }
      })
    },
    searchMovies(){
        return this.movieSearch;
    },
    selectedMovies(){
        return this.moviesSelected;
    },
    directors(){
      return this.allDirectors.map(director => {
        return {
          text: director.nombre + ' ' + director.apellido1 + ' '+ director.apellido2,
          value: director
        }
      })
    }
  },
  created() {

    theMovieDb.common.api_key = "31cde0355b497e2024b6dcd18cc0347d";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";
    theMovieDb.common.images_uri = "https://image.tmdb.org/t/p/";
    theMovieDb.common.timeout = 4000;

    this.getUsers()
    this.getDirectors()
    this.getActors()
    if (this.$route.params.id) {
      this.loading = true

      HTTP.get(`movies/${this.$route.params.id}`)
      .then(response => this.movie = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    } else {
      this.movie = {}
    }
  },
  methods: {
    customLabel(actor){
      if (actor.apellido2 != null){
        return `${actor.nombre} ${actor.apellido1} ${actor.apellido2}`;
      } else if (actor.apellido1 !=null) {
        return `${actor.nombre} ${actor.apellido1}`;
      } else {
        return `${actor.nombre}`;
      }
    },
    isLoaded: function(){
      this.isActive = true;
    },
    getUsers() {
      HTTP.get('genre')
      .then(response => this.allGenres = response.data)
      .catch(err => this.error = err.message)
    },
    getDirectors(){
      HTTP.get('directors')
      .then(response => this.allDirectors = response.data)
      .catch(err => this.error = err.message)     
    },
    getActors(){
       HTTP.get('actors')
      .then(response => this.allActors = response.data)
      .catch(err => this.error = err.message)
    },
    back() {
      this.$router.go(-1)
    },
    getImageTitle(){
        theMovieDb.search.getMovie({"query":encodeURI(this.searchTitle)}, this.successCB, this.errorCB)
    },
    successCB: function (data) {
      var json = JSON.parse(data);
      var aux = json.results;

      aux.forEach(function (movie){
          movie.poster_path = "https://image.tmdb.org/t/p/w300" + movie.poster_path 
          movie.seleccionada = false
        })
      this.movieSearch = aux;
      this.movie.ruta = "https://image.tmdb.org/t/p/w300" + json.results[0].poster_path;
    },  
      errorCB: function (data) {
      console.log("Error callback: " + data);
    },
    deleteMovie(key){
      this.moviesSelected[key].seleccionada = false;
      this.moviesSelected.splice(key, 1);
    },
    addSelectedMovies(){
      for(let i = 0, len = this.movieSearch.length; i< len; i++){
        if (this.movieSearch[i].seleccionada == true){
          theMovieDb.movies.getById({"id":this.movieSearch[i].id}, response => {
            this.movieSearch[i] = (JSON.parse(response)),
            this.movieSearch[i].titulo = this.movieSearch[i].title,
            this.movieSearch[i].fecha_estreno = this.movieSearch[i].release_date,
            this.movieSearch[i].sinopsis = this.movieSearch[i].overview.substring(0,250),
            this.movieSearch[i].ruta = this.movieSearch[i].poster_path,
            this.movieSearch[i].duracion = this.movieSearch[i].runtime,
            this.movieSearch[i].ano_salida = parseInt(this.movieSearch[i].release_date.substring(0, 4)),
            this.movieSearch[i].poster_path = "https://image.tmdb.org/t/p/w300" + this.movieSearch[i].poster_path,
            this.movieSearch[i].seleccionada = true,
            this.movieSearch[i].productora = (this.movieSearch[i].production_companies.length != 0) ? this.movieSearch[i].production_companies[0].name : null,
            this.movieSearch[i].pais =  (this.movieSearch[i].production_countries.length != 0) ? this.movieSearch[i].production_countries[0].name : null,
            this.movieSearch[i].ruta = this.movieSearch[i].poster_path;
            this.moviesSelected.push(this.movieSearch[i])
          }, this.errorCB)

          
        }
      } 
    },
    upload(){
       for(let i = 0, len = this.moviesSelected.length; i< len; i++){
          HTTP.post('movies', this.moviesSelected[i])
          .then(response => this.moviesSelected.splice(i,1))
          .catch(err => this.error = Vue.notify({
                    text: 'A movie cannot be uploaded',
                    type: 'error'
                    }))
       }
    }
  }
}
</script>

<style lang="sass" src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">

article { 
    display: block;
}
#collapse2 {
    margin-top: 3%;
}


</style>
