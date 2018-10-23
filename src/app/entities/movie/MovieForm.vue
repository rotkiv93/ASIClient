<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div class="float-right">
      <b-btn
        variant="primary"
        @click="back()">Back</b-btn>
      <b-btn
        variant="primary"
        @click="save()">Submit</b-btn>
    </div>

    <b-form
      v-if="movie"
      class="app-form"
      @submit="save">

      <b-form-group
        label="Titulo:"
        label-for="title">
        <b-form-input
          id="titulo"
          v-model="movie.titulo"
          type="text"
          required
          placeholder="Introduce titulo"/>
      </b-form-group>

       <b-form-group
        label="Pais:"
        label-for="pais">
        <b-form-input
          id="pais"
          v-model="movie.pais"
          required
          placeholder="Introduce pais "/>
      </b-form-group>

       <b-form-group
        label="Genero:"
        label-for="genero">
        <b-form-select
          id="genero"
          :options="users"
          v-model="movie.genero"
          required/>
      </b-form-group>

      <b-form-group
        label="Productora:"
        label-for="productora">
        <b-form-input
          id="productora"
          v-model="movie.productora"
          required
          placeholder="Introduce productora "/>
      </b-form-group>

       <b-form-group
        label="Duracion:"
        label-for="duracion">
        <b-form-input
          id="duracion"
          v-model="movie.duracion"
          required
          placeholder="Introduce duracion "/>
      </b-form-group>

       <b-form-group
        label="Año salida:"
        label-for="ano_salida">
        <b-form-input
          id="ano_salida"
          v-model="movie.ano_salida"
          required
          placeholder="Introduce año salida "/>
      </b-form-group>

       <b-form-group
        label="Fecha Estreno::"
        label-for="fecha_estreno">
        <b-form-input
          id="fecha_estreno"
          v-model="movie.fecha_estreno"
          required
          placeholder="Introduce fecha estreno "/>
      </b-form-group>

      <b-form-group
        label="Sinopsis:"
        label-for="sinopsis">
        <b-form-textarea
          id="sinopsis"
          v-model="movie.sinopsis"
          :rows="3"
          :max-rows="6"
          required
          placeholder="Introduce sinopsis"/>
      </b-form-group>
    </b-form>
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'

export default {
  components: { LoadingPage },
  data() {
    return {
      movie: {},
      error: null,
      loading: false,
      allUsers: []
    }
  },
  computed: {
    users() {
      return this.allUsers.map(user => {
        return {
          text: user.nombre,
          value: user
        }
      })
    }
  },
  created() {
    this.getUsers()
    if (this.$route.params.id) {
      this.loading = true

      HTTP.get(`movies/${this.$route.params.id}`)
      .then(response => this.movie = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    } else {
      this.movie = {}
    }
  },
  methods: {
    getUsers() {
      HTTP.get('genres')
      .then(response => this.allUsers = response.data)
      .catch(err => this.error = err.message)
    },
    save() {
      if (this.$route.params.id) {
        HTTP.put(`movies/${this.$route.params.id}`, this.movie)
        .then(response =>
          this.$router.replace({ name: 'MovieDetail', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
      } else {
        HTTP.post('movies', this.movie)
        .then(response =>
          this.$router.replace({ name: 'MovieDetail', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
      }
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
