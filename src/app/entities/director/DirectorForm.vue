<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()"> Back </b-btn>
        <b-btn variant="primary"
          :disabled="$v.director.$invalid"
          @click="submitForm()"> Submit </b-btn>
      </div>

      <b-form
        v-if="director"
        class="app-form">

        <b-form-group
          label="Name:"
          label-for="name"
          feedback="name required">
          <b-form-input
            id="nombre"
            v-model="director.nombre"
            :state="!$v.director.nombre.$invalid"
            type="text"
            placeholder="Introduce name"/>
        </b-form-group>

         <b-form-group
          label="First last name:"
          label-for="first last name"
          feedback="last name required">
          <b-form-input
            id="apellido1"
            v-model="director.apellido1"
            :state="!$v.director.apellido1.$invalid"
            placeholder="Introduce first last name"/>
        </b-form-group>

        <b-form-group
          label="Second last name:"
          label-for="second last name">
          <b-form-input
            id="apellido2"
            v-model="director.apellido2"
            placeholder="Introduce second last name"/>
        </b-form-group>
      </b-form>
    </div>
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import {required} from 'vuelidate/lib/validators'

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
  validations: {
    director: {
      nombre: {
        required
      },
      apellido1: {
        required
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .error-message{
    color: red;
  }

</style>
