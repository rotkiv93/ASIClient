<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div v-if="movie">
      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()">Back</b-btn>
        <b-btn
          :to="{ name: 'MovieUpdate', params: { id: movie.id }}"
          variant="primary">Edit</b-btn>
        <b-btn
          variant="primary"
          @click="eliminateMovie()">Eliminate</b-btn>
      </div>
      <h3>{{ movie.titulo }}</h3>
      <h5>Pais: {{ movie.pais }}</h5>
      <h5>Productora: {{ movie.productora }}</h5>
      <h5>Duracion: {{ movie.duracion }}</h5>
      <h5>Genero: {{movie.genero.nombre}}</h5>
      <h5>Director : {{movie.director.nombre}} {{movie.director.apellido1}} {{movie.director.apellido2}}</h5>
      <h5>Año de salida: {{ movie.ano_salida }}</h5>
      <h5>Fecha de estreno: {{ movie.fecha_estreno }}</h5>
      <h6>Sinopsis: {{ movie.sinopsis }}</h6>
      <hr>
      <div class="movie">{{ movie.body }}</div>
    </div>
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'

export default {
  components: { LoadingPage },
  data() {
    return {
      loading: false,
      movie: null,
      error: null
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
  .movie {
    white-space: pre;
  }
</style>
