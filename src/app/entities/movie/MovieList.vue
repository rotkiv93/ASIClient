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
    <transition-group tag="main" name="card">
      <article v-for="movie in movies" :key="movie.id" class="card">
        <div class="image">
          <img src="https://source.unsplash.com/random/300x300" v-on:load="isLoaded()" v-bind:class="{ active: isActive }">
        </div>
        <div class="description">
          <router-link :to="{ name: 'MovieDetail', params: { id: movie.id } }">
            <h3 class="titulo"> {{ movie.titulo }} </h3> 
          </router-link>
          <p class="release"> {{ movie.fecha_estreno }} </p>
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
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin()
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
