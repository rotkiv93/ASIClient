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
          :disabled="$v.actor.$invalid"
          @click="save()">Submit</b-btn>
      </div>

      <b-form
        v-if="actor"
        class="app-form"
        @submit="save">

        <b-form-group
          label="Name:"
          label-for="Name"
          feedback="Name required">
          <b-form-input
            id="nombre"
            v-model="actor.nombre"
            type="text"
            :state="!$v.actor.nombre.$invalid"
            required
            placeholder="Introduce name"/>
        </b-form-group>

         <b-form-group
          label="First last name:"
          label-for="first last name"
          feedback="Last name required">
          <b-form-input
            id="apellido1"
            v-model="actor.apellido1"
            :state="!$v.actor.apellido1.$invalid"
            required
            placeholder="Introduce first last name"/>
        </b-form-group>

        <b-form-group
          label="Second last name:"
          label-for="second last name">
          <b-form-input
            id="apellido2"
            v-model="actor.apellido2"
            required
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
      actor: {},
      error: null,
      loading: false,
    }
  },
  created() {
    if (this.$route.params.id) {
      this.loading = true

      HTTP.get(`actors/${this.$route.params.id}`)
      .then(response => this.actor = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    } else {
      this.actor = {}
    }
  },
  methods: {
    save() {
      if (this.$route.params.id) {
        HTTP.put(`actors/${this.$route.params.id}`, this.actor)
        .then(response =>
          {this.$router.replace({ name: 'ActorList', params: { id: response.data.id }}), Vue.notify({
                  text: 'Actor successfully updated',
                  type: 'success'
                  })} )
        .catch(err => this.error = Vue.notify({
                  text: 'One or more fields are wrong',
                  type: 'error'
                  }))
      } else {
        HTTP.post('actors', this.actor)
        .then(response =>
          {this.$router.replace({ name: 'ActorList', params: { id: response.data.id }}), Vue.notify({
                  text: 'Actor successfully updated',
                  type: 'success'
                  })} )
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
    actor: {
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
