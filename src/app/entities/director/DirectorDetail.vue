<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div v-if="director">
      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()">Back</b-btn>
        <b-btn
          :to="{ name: 'DirectorUpdate', params: { id: director.id }}"
          variant="primary">Edit</b-btn>
        <b-btn
          variant="primary"
          @click="eliminateDirector()">Eliminate</b-btn>
      </div>
      <h3>Nombre; {{ director.nombre }}</h3>
      <h5>Primer Apellido: {{ director.apellido1 }}</h5>
      <h5>Segundo Apellido {{ director.apellido2 }}</h5>
      <hr>
      <div class="director">{{ director.body }}</div>
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
      director: null,
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
      this.error = this.director = null
      this.loading = true

      HTTP.get(`directors/${this.$route.params.id}`)
      .then(response => this.director = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    },
    back() {
      this.$router.go(-1)
    },
    eliminateDirector(){
      HTTP.delete(`directors/${this.$route.params.id}`, {params: { id: this.director.id }})
       .then(response =>
          this.$router.replace({ name: 'DirectorList', params: { id: response.data }}))
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
