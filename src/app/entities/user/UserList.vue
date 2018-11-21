<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <nav class="nav">
    </nav>

    <div v-if="users" class="margenes">  
      <div
        v-for="user in users"
        :key="user.id"
        class="listas">
         <h5>
          User: {{user.login}} Numero de peliculas vistas: {{user.count}}
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
      this.users = response.data,
      this.countMovies()
    })
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
    countMovies(){
      for(let i = 0, len = this.users.length; i< len; i++){
        this.users[i].count = 0;
        for(let j = 0, len1 = this.users[i].peliculas.length; j< len; j++){
          if (this.users[i].peliculas[j].estado = "Vista"){
            this.users[i].count ++;
          }
        }
      }
    }
  }
}
</script>
