<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <nav class="nav">
    </nav>

    <div class="margenes">  
      <div
        v-for="user in users"
        :key="user.id"
        class="listas">
         <h5>
          {{user.login}} {{user.viewed}}
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


    HTTP.get('movieusers', {params: {userLogin: 'josete'}})
    .then(response => {
      this.movies = response.data,
      console.log(response.data)
    })
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
  }
}
</script>
