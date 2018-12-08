<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
        <b-btn style="float left;"
          variant="secondary"
          @click="back()">Back</b-btn>
        <b-btn style="float left;"
          variant="outline-success"
          :disabled="$v.movie.$invalid"
          @click="submitForm()">Submit</b-btn>

      <div class="float-right">
          <p style="margin:1%;">Hide</p>
          <toggle-button v-model="movie.oculta"/>
      </div>

      <b-form
        v-if="movie"
        class="app-form"
        @submit="submitForm">

        <b-form-group
          label="Title:"
          label-for="title"
          feedback="Title required">
          <b-form-input
            id="titulo"
            v-model="movie.titulo"
            :state="!$v.movie.titulo.$invalid"
            type="text"
            placeholder="Title"/>
        </b-form-group>

         <b-form-group class="form-group"
          label="Country:"
          label-for="country"
          feedback="Country required">
          <b-form-input
            id="pais"
            v-model="movie.pais"
            :state="!$v.movie.pais.$invalid"
            placeholder="Country"/>
        </b-form-group>

        <b-form-group
          label="Producer:"
          label-for="producer"
          feedback="Producer required">
          <b-form-input
            id="productora"
            v-model="movie.productora"
            :state="!$v.movie.productora.$invalid"
            placeholder="Producer"/>
        </b-form-group>

         <b-form-group
          label="Duration:"
          label-for="duration"
          feedback="Duration required, only positive numbers">
          <b-form-input
            id="duracion"
            type="number"
            v-model="movie.duracion"
            :state="!$v.movie.duracion.$invalid"
            placeholder="Duration"/>
        </b-form-group>

        <b-form-group
          label="Director:"
          label-for="director"
          feedback="You must choose a director from the list">
          <b-form-select
            id="director"
            :options="directors"
            v-model="movie.director"
            :state="!$v.movie.director.$invalid" />
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
          label="Genre:"
          label-for="genre"
          feedback="You must choose a genre from the list">
          <b-form-select
            id="genero"
            :options="genres"
            v-model="movie.genero"
            :state="!$v.movie.genero.$invalid" />
        </b-form-group>

         <b-form-group
          label="Release year:"
          label-for="release year"
          feedback="Release year required, starting from 1900">
          <b-form-input
            id="ano_salida"
            v-model="movie.ano_salida"
            :state="!$v.movie.ano_salida.$invalid"
            placeholder="Release year"/>
        </b-form-group>

         <b-form-group
          label="Release date::"
          label-for="release date">
          <b-form-input
            id="fecha_estreno"
            v-model="movie.fecha_estreno"
            type="date"
            placeholder="Release date"/>
        </b-form-group>

        <b-form-group
          label="Synopsis:"
          label-for="synopsis"
          feedback="Synopsis required">
          <b-form-textarea
            id="sinopsis"
            v-model="movie.sinopsis"
            :state="!$v.movie.sinopsis.$invalid"
            :rows="3"
            :max-rows="6"
            placeholder="Synopsis"/>
        </b-form-group>

        <b-form-group
          label="Image route:"
          label-for="route">
          <b-form-textarea
            id="ruta"
            v-model="movie.ruta"
            placeholder="Image route"/>
        </b-form-group>

        <b-btn @click="getImageTitle()" v-b-toggle="'collapse2'" class="m-1">Find Movies</b-btn>
        <b-collapse id="collapse2">
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
           <b-btn @click="addSelectedMovies()" v-b-toggle="'collapse2'" class="m-1">Add peliculas</b-btn>
        </b-collapse>

        <picture-input
          ref="pictureInput"
          @change="onChanged"
          @remove="onRemoved"
          :width="300"
          :removable="true"
          remove-button-class="ui red button"
          :height="300"
          accept="image/jpeg, image/png, image/gif"
          button-class="ui button primary"
          :custom-strings="{
          upload: '<h1>Upload it!</h1>',
          drag: 'Drag and drop your image here'}">
        </picture-input>
        <button @click="attemptUpload" v-bind:class="{ disabled: !image }">
          Upload
        </button>

      </b-form>
    </div>
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import Multiselect from 'vue-multiselect'
import theMovieDb from 'themoviedb-javascript-library'
import PictureInput from 'vue-picture-input'
import FormDataPost from '../../common/upload'
import {required, numeric, minValue, minLength} from 'vuelidate/lib/validators'

export default {
  components: { LoadingPage,  Multiselect,  PictureInput},
  data() {
    return {
      movie: {},
      movieSearch: [],
      error: null,
      image: null,
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
    onChanged() {
      console.log("New picture loaded");
      if (this.$refs.pictureInput.file) {
        this.image = this.$refs.pictureInput.file;
      } else {
        console.log("Old browser. No support for Filereader API");
      }
    },
    onRemoved() {
      this.image = '';
    },
    attemptUpload() {
      if (this.image){
      FormDataPost('http://localhost:8080/movies/pictures', this.image)
        .then(response=>{
          if (response.data.success){
            this.image = '';
            console.log("Image uploaded successfully ✨");
          }
        })
        .catch(err=>{
          console.error(err);
        });
      }
    },
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
    submitForm() {
      if (this.$route.params.id) {
        HTTP.put(`movies/${this.$route.params.id}`, this.movie)
        .then(response =>
          this.$router.replace({ name: 'MovieDetail', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
      } else {
        HTTP.post('movies', this.movie)
        .then(response =>
          this.$router.replace({ name: 'MovieDetail', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
      }
    },
    back() {
      this.$router.go(-1)
    },
    getImageTitle(){
        theMovieDb.search.getMovie({"query":encodeURI(this.movie.titulo)}, this.successCB, this.errorCB)
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
    }
  },
  validations: {
    movie: {
      titulo: {
        required
      },
      sinopsis: {
        required
      },
      director: {
        required
      },
      genero: {
        required
      },
      duracion: {
        required,
        numeric
      },
      pais: {
        required
      },
      productora: {
        required
      },
      ano_salida: {
        required,
        numeric,
        minLength: minLength(4),
        minValue: minValue(1900)
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

.invalidTitle{

}
</style>
