<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <nav class="nav">
      <b-button-group class="buttons" v-if="isLogged">
        <b-button v-if="isAdmin" :to="{ name: 'MovieCreate' }"> New </b-button>
        <b-button @click="getAll()"> All </b-button>
        <b-button @click="getVistas()"> Viewed </b-button>
        <b-button @click="getPendientes()"> Pending </b-button>
      </b-button-group>


      <vue-csv-downloader v-if="movies"
        :data="movies"
        :fields="fields"
      > <b-button> Download CSV</b-button>
      </vue-csv-downloader>
      
      <div>
        <label style="margin-top:10%; color: white">Toggle detail view</label>
        <toggle-button v-model="toggled"/>
      </div>

      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="text" v-model="search" placeholder="Search movies">
        <button class="btn btn-secondary my-2 my-sm-0" type="submit" disabled>
        <font-awesome-icon icon="search"/> </button>
      </form>
    </nav>

    <div v-if = "toggled == false">
      <transition-group  tag="main" name="card">
        <article v-for="movie in searchMovie" :key="movie.id" class="card">
          <div class="image">
            <img v-bind:src="movie.ruta" v-on:load="isLoaded()" v-bind:class="{ active: isActive }">
          </div>
          <div class="description">
            <router-link :to="{ name: 'MovieDetail', params: { id: movie.id } }">
              <h3 class="titulo"> {{ movie.titulo }} </h3> 
            </router-link>
            <p class="release"> {{ movie.fecha_estreno | moment('LL') }} </p>
          </div>
        </article>
      </transition-group>
    </div>

    <div v-if="toggled === true" class = "listDetail">
      <div class="detMovie" v-for="movie in searchMovie" :key="movie.id">
        <div class="description">
            <router-link class="router" :to="{ name: 'MovieDetail', params: { id: movie.id } }">
              <h3 class="tituloDet"> {{ movie.titulo }} </h3> 
            </router-link>
            <p >{{ movie.director.nombre }} {{ movie.director.apellido1 }} 
              | {{ movie.pais }}
              | {{ movie.fecha_estreno | moment('LL') }} 
              | {{ movie.genero.nombre }} 
              | {{ movie.productora}} 
              | {{ movie.duracion }} min. </p>
            <label style="color:white">Cast:</label>
            <span v-for="actor in movie.actores" :key="actor.id"> {{ actor.nombre }} {{actor.apellido1}} {{actor.apellido2}} |</span>
            <p><label style="color:white">Synopsis: </label> {{ movie.sinopsis }} </p>
          </div>
      </div>
    </div>

  </LoadingPage>
</template>
 
<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import VueCsvDownloader from 'vue-csv-downloader'

export default {
  components: { LoadingPage, VueCsvDownloader },
  data() {
    return {
      loading: false,
      movies: null,
      error: null,
      ruta: null,
      rutas: [],
      isActive: false,
      search: '',
      userFilter: '',
      fields: [],
      toggled: false
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin()
    },
     isLogged() {
      return auth.user.logged
    },
    filter: function(){
      return this.userFilter;
    },
    searchMovie: function(){
      if (this.movies != null)
        return this.movies.filter((movie) => movie.titulo.toLowerCase().match(this.search.toLowerCase()));
    },
    filterViewedPending: function(){
      if (this.movies != null)
        return this.movies.filter((movie) => movie.estado.toLowerCase().match(this.filter.toLowerCase()));
    }
  },
  created() {
    this.loading = true

    HTTP.get('movies')
    .then(response => {
        this.movies = response.data,
        this.fields = (response.data.length !=0) ? Object.keys(response.data[0]) : null
        })
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
    isLoaded: function(){
      this.isActive = true;
    },
    getAll(){
      HTTP.get('movies')
    .then(response => this.movies = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
    },
    getVistas(){
      HTTP.get('movies', {params: {tipoBusqueda : "Vista"}})
      .then(response => this.movies = response.data)
      .catch(err => this.error = err.response.data)
      .finally(() => this.loading = false)
    },
    getPendientes(){
      HTTP.get('movies', {params: {tipoBusqueda : "Pendiente"}})
      .then(response => this.movies = response.data)
      .catch(err => this.error = err.response.data)
      .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped lang="scss">

.controls{
  display: flex; 
}


</style>
