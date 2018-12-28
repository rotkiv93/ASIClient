<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="/">FICAffinity</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor02">
        <ul class="navbar-nav mr-auto">

          <li class="nav-item">
            <b-nav-item :to="{ name: 'MovieList' }" exact>Movies</b-nav-item>
          </li>

          <form class="form-inline my-2 my-sm-0">
            <vue-instant
              v-model="input"
              placeholder="search movie title"
              :suggestion-attribute = "suggestionsAttribute"
              :suggestions="movies">
            </vue-instant>
          </form>
          <template v-if="isLogged">
            <li class="nav-item">
            <b-nav-item :to="{ name: 'UserList' }" exact>Users</b-nav-item>
          </li>
          </template>

          <template v-if="isAdmin">
            <li class="nav-item">
            <b-nav-item :to="{ name: 'DirectorList' }" exact>Directors</b-nav-item>
            </li>

            <li class="nav-item">
            <b-nav-item :to="{ name: 'ActorList' }" exact>Actors</b-nav-item>
            </li>

            <li class="nav-item">
            <b-nav-item :to="{ name: 'GenreList' }" exact>Genres</b-nav-item>
            </li>

            <li class="nav-item">
            <b-nav-item :to="{ name: 'MovieImporter' }" exact>Importer</b-nav-item>
            </li>
          </template>

        </ul>

        <b-dropdown class="m-2">
          <template slot="button-content">
            <em>{{ loggedUser }}</em>
          </template>
          <template v-if="!isLogged">
            <b-dropdown-item :to="{ name: 'Login' }" exact> Login </b-dropdown-item>
          </template>
          <template v-if="isLogged">
            <b-dropdown-item :to="{ name: 'UserDetail', params: { id: loginUser } }" exact> Profile </b-dropdown-item>
            <b-dropdown-item @click="logout()"> Logout </b-dropdown-item>
          </template>
        </b-dropdown>

    </div>
  </nav>
</template>

<script>
import { HTTP } from '../common/http-common'
import auth from '../common/auth'

export default {
  data(){
    return {
      movies: [],
      input: '',
      suggestionsAttribute: 'titulo',
      error: null,
    }
  },
  created(){
  HTTP.get('movies')
    .then(response => this.movies = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  computed: {
    entitiesActive: function () {
      return [ 'MovieCreate', 'MovieList', 'DirectorList', 'ActorList' , 'MovieImporter', 'UserList'].indexOf(this.$route.name) != -1
    },
     isLogged() {
      return auth.user.logged
    },
    loggedUser() {
      return auth.user.logged ? `${auth.user.login} (${auth.user.authority})` : 'User'
    },
    loginUser(){
      return `${auth.user.login}`
    },
    isAdmin() {
      return auth.isAdmin()
    }
  },
  methods: {
    logout() {
      auth.logout()
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped lang="scss">

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s ease;
  }
  .slide-fade-enter { 
    transform: translateY(-50px);
    opacity: 0;
  }
  .slide-fade-leave-to {
   transform: translateY(-50px);
    opacity: 0; 
  }

</style>
