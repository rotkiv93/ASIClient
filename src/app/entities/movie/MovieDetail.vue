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
      <div>
      <div class="container">
        <div class="card flex-row flex-wrap">
          <div class="card header">
            <img class="movie-image" src="https://source.unsplash.com/random/300x300" alt="***" />
          </div>
          <div class="card-block px-2">
            <h1 class="card-title"> {{ movie.titulo }} ( {{movie.ano_salida}} ) </h1>
            <h4 class="subtitle">
              <p class="subtitle-tag"> {{  movie.fecha_estreno | moment('LL') }} | </p>
              <p class="subtitle-tag"> {{ movie.duracion }} | </p>
              <p class="subtitle-tag"> {{ movie.genero.nombre }} |</p>
              <p class="subtitle-tag"> {{ movie.productora }} | </p> 
              <p class="subtitle-tag"> {{ movie.pais }} </p>
            </h4>
            <p class="description"> {{ movie.sinopsis }}</p>

            <b-btn class="button" size=lg @click="back()">
             <font-awesome-icon icon="arrow-left"/> 
            </b-btn>

            <b-btn class="viewed-button" @click="">
              Viewed <font-awesome-icon icon="plus-square"/> 
            </a>
          </div>
        </div>
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

  $text: #777;

  .card{
    background: #2B2A34;
  }

  .movie-image{
  }

  .card-title{
    font-size: 45px;
    font-weight: 600;
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

  .description{
    font-size: 15px;
    margin-bottom: 24px;
    max-width: 450px;
    color: white;
  }

  .viewed-button{
    padding-left: 10px;
    padding-top: 2px;
    background-color: Transparent;
    border: none;
  }

  .button{
    position: absolute;
    top: 0%;
    left: 0%;
    overflow: auto;
    background-color: Transparent;
    border: none;
    cursor:pointer;
  }

</style>

