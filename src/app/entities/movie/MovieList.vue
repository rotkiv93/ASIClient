<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div class="float-left">
      <b-btn
        v-if="isAdmin"
        :to="{ name: 'MovieCreate' }"
        variant="dark">New</b-btn>
    </div>

    <nav class="nav">
      <b-button-group>
        <b-button v-on:click="filter = ''" :class="{ active: filter == '' }"> Viewed </b-button>
        <b-button v-on:click="filter = ''" :class="{ active: filter == '' }"> Pending </b-button>
      </b-button-group>

      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="text" v-model="filter" placeholder="Search movies">
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
      search: '',
      filter: ''
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin()
    },
    filter: function(){
      return this.filter;
    },
    searchMovie: function(){
      return this.movies.filter((movie) => movie.titulo.toLowerCase().match(this.filter.toLowerCase()));
    },
    filterViewed: function(){
      return this.movies.filter((movie) => movie.estado == 'Vista')
    },
    filterPending: function(){
      return this.movies.filter((movie) => movie.estado == 'Pendiente')
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
  },
}
</script>

<style scoped lang="scss">

.controls{
  display: flex; 
}

.nav{
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  margin: 0 1rem;
  padding: 2rem 0.5rem 1rem;
  border-bottom: 1px solid #c5d0d1;
}



</style>
