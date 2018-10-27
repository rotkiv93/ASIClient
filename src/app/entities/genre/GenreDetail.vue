<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div v-if="genre">
      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()">Back</b-btn>
        <b-btn
          :to="{ name: 'GenreUpdate', params: { id: genre.id }}"
          variant="primary">Edit</b-btn>
      </div>
      <h5>Nombre: {{ genre.nombre }}</h5>
      <h5>Primer Apellido: {{ genre.apellido1 }}</h5>
      <h5 v-if="genre.apellido2">Segundo Apellido: {{ genre.apellido2 }}</h5>
      <hr>
      <div class="genre">{{ genre.body }}</div>
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
      genre: null,
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
      this.error = this.genre != null
      this.loading = true

      HTTP.get(`genres/${this.$route.params.id}`)
      .then(response => this.genre = response.data)
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
  .movie {
    white-space: pre;
  }
</style>
