<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">FICAffinity</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor02">
      <ul class="navbar-nav mr-auto">

        <li class="nav-item active">
          <b-navbar-brand to="/"> Home </b-navbar-brand>
        </li>

        <li class="nav-item">
          <b-nav-item :to="{ name: 'MovieList' }" exact>Movies</b-nav-item>
        </li>

        <li class="nav-item">
        <b-nav-item :to="{ name: 'DirectorList' }" exact>Directors</b-nav-item>
        </li>

        <li class="nav-item">
        <b-nav-item :to="{ name: 'ActorList' }" exact>Actors</b-nav-item>
        </li>

        <li class="nav-item">
        <b-nav-item :to="{ name: 'GenreList' }" exact>Genres</b-nav-item>
        </li>

      </ul>

      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="text" placeholder="Search">
        <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
      </form>
      <b-nav-item
          v-if="!isLogged"
          :to="{ name: 'Login' }"
          exact>Login</b-nav-item>
        <b-nav-item
          v-if="isLogged"
          @click="logout()">Logout</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item>{{ loggedUser }}</b-nav-item>
      </b-navbar-nav>
    </div>
  </nav>
</template>

<script>
import auth from '../common/auth'

export default {
  computed: {
    entitiesActive: function () {
      return [ 'MovieCreate', 'MovieList', 'DirectorList', 'ActorList'].indexOf(this.$route.name) != -1
    },
     isLogged() {
      return auth.user.logged
    },
    loggedUser() {
      return auth.user.logged ? `${auth.user.login} (${auth.user.authority})` : 'not logged'
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
