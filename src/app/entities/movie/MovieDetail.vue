<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div v-if="movie">
      <div class="float-right">
        <div class="float-left">
       <b-form-select
          id="puntuacion "
          :options="puntuation"
          v-model="selected"
          placeholder="Puntúa la película"
          @click="updatePunt()"
          required/>
        </div>
        <b-btn
          variant="primary"
          @click="back()">Back</b-btn>
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
        <b-card class="detail" overlay
          img-src="https://source.unsplash.com/random/300x300"
          img-alt="***"
          :title="movie.titulo"
          :sub-title="movie.fecha_estreno">
          <p class="card-text">
            {{movie.sinopsis}}
          </p>
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
      movieuser: null,
      error: null,
      selected: null,
      puntuation: [{ value: null, text: 'Rate this movie' },
                  { value: 1, text: '1' },
                  { value: 2, text: '2' },
                  { value: 3, text: '3' },
                  { value: 4, text: '4' },
                  { value: 5, text: '5' },
                  { value: 6, text: '6' },
                  { value: 7, text: '7' },
                  { value: 8, text: '8' },
                  { value: 9, text: '9' },
                  { value: 10, text: '10' }  ]
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
    },
  }
}
</script>

<style scoped lang="scss">
  
  .movie {
    display: block;
    margin: auto;
    overflow: auto;
    width: 50%;
    height: 100%;
  }
  .detail{

  }
</style>
