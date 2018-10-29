<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="text" v-model="search" placeholder="Search movies">
      <button class="btn btn-secondary my-2 my-sm-0" type="submit">
      <font-awesome-icon icon="search"/> </button>
    </form>

    <div class="float-left">
      <b-btn
        v-if="isAdmin"
        :to="{ name: 'MovieCreate' }"
        variant="dark">New</b-btn>
    </div>
    
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
      movies: null,
      error: null,
      isActive: false,
      search: ''
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin()
    },
    searchMovie: function(){
      return this.movies.filter((movie) => {
        return movie.titulo.toLowerCase().match(this.search.toLowerCase());
      });
    }
  },
  created() {
    this.loading = true

    HTTP.get('movies')
    .then(response => this.movies = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
    isLoaded: function(){
      this.isActive = true;
    }
  }
}
</script>
