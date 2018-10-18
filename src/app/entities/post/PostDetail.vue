<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div v-if="post">
      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()">Back</b-btn>
        <b-btn
          :to="{ name: 'PostUpdate', params: { id: post.id }}"
          variant="primary">Edit</b-btn>
      </div>
      <h3>{{ post.titulo }}</h3>
      <h5>Pais: {{ post.pais }}</h5>
      <h5>Productora: {{ post.productora }}</h5>
      <h5>Duracion: {{ post.duracion }}</h5>
      <h5>Año de salida: {{ post.ano_salida }}</h5>
      <h5>Fecha de estreno: {{ post.fecha_estreno }}</h5>
      <h6>Sinopsis: {{ post.sinopsis }}</h6>
      <hr>
      <div class="post">{{ post.body }}</div>
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
      post: null,
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
      this.error = this.post = null
      this.loading = true

      HTTP.get(`movies/${this.$route.params.id}`)
      .then(response => this.post = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
  .post {
    white-space: pre;
  }
</style>
