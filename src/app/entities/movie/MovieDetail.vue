<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div v-if="movie">
        <b-btn
          v-if="isAdmin"
          :to="{ name: 'MovieUpdate', params: { id: movie.id }}"
          variant="primary">Edit</b-btn>
        <b-btn
          v-if="isAdmin"
          variant="primary"
          @click="eliminateMovie()">Eliminate</b-btn>
      </div>
      <div class="movie">
        <b-card class="movie"
          img-src="https://source.unsplash.com/random/300x300"
          img-alt="***"
          img-top
          :title="movie.titulo"
          :sub-title="movie.fecha_estreno">
          <div> {{ movie.body }} </div>
          <b-btn class="button" variant="primary" @click="back()"> Back </b-btn>
        </b-card>
      </div>
    </div>
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
      movie: null,
      error: null
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin()
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.error = this.movie = null
      this.loading = true

      HTTP.get(`movies/${this.$route.params.id}`)
      .then(response => this.movie = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    },
    back() {
      this.$router.go(-1)
    },
    eliminateMovie(){
      HTTP.delete(`movies/${this.$route.params.id}`, {params: { id: this.movie.id }})
       .then(response =>
          this.$router.replace({ name: 'MovieList', params: { id: response.data }}))
       .catch(err => this.error = err.message)
    }
  }
}
</script>

<style scoped lang="scss">

  .button{
    position: absolute;
    top: 0%;
    left: 0%;
    overflow: auto;
  }
</style>

