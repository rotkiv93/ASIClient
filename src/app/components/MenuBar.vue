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
            <b-dropdown-item href="#"> Profile </b-dropdown-item>
            <b-dropdown-item @click="logout()"> Logout </b-dropdown-item>
          </template>
        </b-dropdown>
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
      return auth.user.logged ? `${auth.user.login} (${auth.user.authority})` : 'User'
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
