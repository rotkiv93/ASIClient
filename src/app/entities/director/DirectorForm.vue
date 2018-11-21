<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()"> Back </b-btn>
        <b-btn variant="primary" @click="submitForm()"> Submit </b-btn>
      </div>

      <b-form
        v-if="director"
        class="app-form">

        <b-form-group
          label="Nombre:"
          label-for="nombre">
          <b-form-input
            id="nombre"
            v-model="director.nombre"
            type="text"
            placeholder="Introduce nombre"/>
        </b-form-group>

         <b-form-group
          label="Primer apellido:"
          label-for="apellido1">
          <b-form-input
            id="apellido1"
            v-model="director.apellido1"
            placeholder="Introduce primer apellido "/>
        </b-form-group>

        <b-form-group
          label="Segundo apellido:"
          label-for="apellido2">
          <b-form-input
            id="apellido2"
            v-model="director.apellido2"
            placeholder="Introduce segundo apellido "/>
        </b-form-group>
      </b-form>
    </div>
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import Vue from 'vue'

export default {
  components: { LoadingPage },
  data() {
    return {
      director: {},
      error: null,
      loading: false,
    }
  },
  created() {
    if (this.$route.params.id) {
      this.loading = true

      HTTP.get(`directors/${this.$route.params.id}`)
      .then(response => this.director = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    } else {
      this.director = {}
    }
  },
  methods: {
    submitForm() {
        if (this.$route.params.id) {
          HTTP.put(`directors/${this.$route.params.id}`, this.director)
          .then(response =>
            this.$router.replace({ name: 'DirectorList', params: { id: response.data.id }}))
          .catch(err => this.error = Vue.notify({
                  text: 'One or more fields are wrong',
                  type: 'error'
                  }))
        } else {
          HTTP.post('directors', this.director)
          .then(response =>
            this.$router.replace({ name: 'DirectorList', params: { id: response.data.id }}))
          .catch(err => this.error = Vue.notify({
                  text: 'One or more fields are wrong',
                  type: 'error'
                  }))
        }
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped lang="scss">

  .error-message{
    color: red;
  }

</style>
