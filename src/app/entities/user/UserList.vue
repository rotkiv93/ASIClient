<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <nav class="nav">
      <h3>List of registered users</h3>
    </nav>

    <div v-if="users" class="margenes">  
      <div
        v-for="user in users"
        :key="user.id"
        class="listas">
         <h5>
          <router-link class="router" :to="{ name: 'UserDetail', params: { id: user.login } }">
           User: {{user.login}} Numero de peliculas vistas: {{user.num_vistas}}
           </router-link>
          
         </h5>

      </div>
    </div>
    
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import Vue from 'vue'

export default {
  components: { LoadingPage },
  data() {
    return {
      loading: false,
      users: null,
      user: {},
      error: null,
      movies: null,
    }
  },
  created() {
    this.loading = true
    HTTP.get('users')
    .then(response => {
      this.users = response.data
    })
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
}
</script>
