<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <nav class="nav">
      <h3>List of registered users</h3>
    </nav>

    <div v-if="users">
      <div
        v-for="user in users"
        :key="user.id"
        class="listas">
        <div class="card flex-row flex-wrap">
          <div class="image-container px-2">
            <b-img rounded="circle" class="user-image" :src="getImagen(user)"></b-img>
          </div>
          <h1 class="card-title">
            <router-link class="router" :to="{ name: 'UserDetail', params: { id: user.login } }">
              {{ user.login }}
            </router-link>
          </h1>
          <h4 class="subtitle">
            <p class="subtitle-tag"> Viewed Films: {{user.num_vistas}}</p>
          </h4>
        </div>
      </div>
    </div>

  </LoadingPage>
</template>

<script>
import { HTTP, baseURL } from '../../common/http-common'
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
  methods:{
    getImagen(user){
      return baseURL + "/movies/image/" + user.login + ".jpg"
    }
  }
}
</script>
<style scoped lang="scss">

  .card{
    margin-left: 10%;
    margin-right: 10%;
    background: #2B2A34;
    align-items: center;
    display: flex;
  }

  .card-title{
    font-size: 30px;
    font-weight: 300;
    color: white;
  }

  .subtitle{
    font-size: 15px;
    font-weight: 600;
    color: red;
  }

  .subtitle-tag{
    display: inline;
  }

  .image-container{
    float: left;
    height: 125px;
    width: 125px;
  }

  .user-image{
    height: 100%;
    width: 100%;
    object-fit: fill;
    background-image: url(http://localhost:8080/api/movies/image/pred.jpg);
  }

</style>
