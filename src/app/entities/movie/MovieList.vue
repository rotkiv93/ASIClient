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
        <button class="btn btn-secondary my-2 my-sm-0" type="submit" disabled>
        <font-awesome-icon icon="search"/> </button>
      </form>
    </nav>

    <menu>
    </menu>

    <transition-group  tag="main" name="card">
      <article v-for="movie in searchMovie" :key="movie.id" class="card">
        <div v-show="!movie.oculta || isAdmin">
          <div class="image">
            <img v-bind:src="movie.ruta" v-on:load="isLoaded()" v-bind:class="{ active: isActive }">
          </div>
          <div class="description">
            <router-link :to="{ name: 'MovieDetail', params: { id: movie.id } }">
              <h3 class="titulo"> {{ movie.titulo }} </h3> 
            </router-link>
            <p class="release"> {{ movie.fecha_estreno | moment('LL') }} </p>
          </div>
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

    HTTP.get('movies')
    .then(response => this.movies = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
    isLoaded: function(){
      this.isActive = true;
    },
  }
}
</script>

<style scoped lang="scss">

.controls{
  display: flex; 
}


.buttons{
}


</style>
