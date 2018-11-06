<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <nav class="nav">
      <b-button-group class="buttons" v-if="isLogged">
        <b-button v-if="isAdmin" :to="{ name: 'MovieCreate' }"> New </b-button>
        <b-button v-on:click="filter = ''" :class="{ active: filter == '' }"> Viewed </b-button>
        <b-button v-on:click="filter = ''" :class="{ active: filter == '' }"> Pending </b-button>
      </b-button-group>

      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="text" v-model="search" placeholder="Search movies">
        <button class="btn btn-secondary my-2 my-sm-0" type="submit">
        <font-awesome-icon icon="search"/> </button>
      </form>
    </nav>

    <menu>
    </menu>

    <transition-group tag="main" name="card">
      <article v-for="movie in searchMovie" :key="movie.id" class="card">
        <div class="image">
          <img src="https://source.unsplash.com/random/300x300" v-on:load="isLoaded()" v-bind:class="{ active: isActive }">
        </div>
        <div class="description">
          <router-link :to="{ name: 'MovieDetail', params: { id: movie.id } }">
            <h3 class="titulo"> {{ movie.titulo }} </h3> 
          </router-link>
          <p class="release"> {{ movie.fecha_estreno | moment('LL') }} </p>
        </div>

      </article>
    </transition-group>
      <b-btn variant="success" @click="loadImages()"> Empieza a votar! </b-btn>
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
      movies: null,
      error: null,
      ruta: null,
      rutas: [],
      isActive: false,
      search: '',
      userFilter: ''
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

    theMovieDb.common.api_key = "31cde0355b497e2024b6dcd18cc0347d";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";
    theMovieDb.common.images_uri = "https://image.tmdb.org/t/p/";
    theMovieDb.common.timeout = 4000;

    HTTP.get('movies')
    .then(response => this.movies = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
    isLoaded: function(){
      this.isActive = true;
    },
    loadImages(){
      this.rutas = []
      for (var key in this.movies){
        theMovieDb.search.getMovie({"query":encodeURI(this.movies[key].titulo)}, this.successCB, this.errorCB)
      }
      //console.log(this.rutas)
      //for (var key1 in this.rutas){
        //console.log(this.rutas[key1])
        //var a = theMovieDb.search.getMovie({"query":encodeURI(this.movies[key].titulo)}, this.successCB, this.errorCB)
      //}
    },
    successCB: function (data) {
      var json = JSON.parse(data);
      this.rutas.push("https://image.tmdb.org/t/p/w300/" + json.results[0].poster_path)
      //console.log("Success callback: https://image.tmdb.org/t/p/w300/" + json.results[0].poster_path);
      //return (" https://image.tmdb.org/t/p/w300/" + json.results[0].poster_path);
    },  
    errorCB: function (data) {
      console.log("Error callback: " + data);
    }
  }
}
</script>

<style scoped lang="scss">

.controls{
  display: flex; 
}

.nav{
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  margin: 0 1rem;
  padding: 2rem 0.5rem 1rem;
  border-bottom: 1px solid #c5d0d1;
}

.buttons{
}


</style>
