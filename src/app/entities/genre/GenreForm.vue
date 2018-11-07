<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()">Back</b-btn>
        <b-btn
          variant="primary"
          @click="save()">Submit</b-btn>
      </div>

      <b-form
        v-if="genre"
        class="app-form"
        @submit="save">

        <b-form-group
          label="Nombre:"
          label-for="nombre">
          <b-form-input
            id="nombre"
            v-model="genre.nombre"
            type="text"
            required
            placeholder="Introduce nombre"/>
        </b-form-group>
    <div class="margenes">
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'

export default {
  components: { LoadingPage },
  data() {
    return {
      genre: {},
      error: null,
      loading: false,
    }
  },
  created() {
    if (this.$route.params.id) {
      this.loading = true

      HTTP.get(`genres/${this.$route.params.id}`)
      .then(response => this.genre = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    } else {
      this.genre = {}
    }
  },
  methods: {
    save(genre) {
        HTTP.put(`genres/${genre.id}`,  {params: { id: genre.id }}, genre)
        .then(response =>
          this.$router.replace({ name: 'GenreList', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
    },
    post(genre){ 
        HTTP.post('genres', this.genre)
        .then(response =>
          this.$router.replace({ name: 'GenreList', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
    }
  }
},
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
