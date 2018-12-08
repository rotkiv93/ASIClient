<template>
    <div class="margenes">

      <div class="float-right">
        <b-btn
          variant="primary"
          @click="back()">Back</b-btn>
        <b-btn
          variant="primary"
          :disabled="$v.user.$invalid"
          @click="save()">Registrate</b-btn>
      </div>

      <b-form
        v-if="user"
        class="app-form"
        @submit="save">

        <b-form-group
          label="Login:"
          label-for="login"
          feedback="login required">
          <b-form-input
            id="login"
            v-model="user.login"
            :state="!$v.user.login.$invalid"
            type="text"
            placeholder="Introduce login"/>
        </b-form-group>


        <b-form-group
          label="Password:"
          label-for="password"
          feedback="password required">
          <b-form-input
            id="password"
            v-model="user.password"
            :state="!$v.user.password.$invalid"
            type="password"
            placeholder="Introduce password"/>
        </b-form-group>

        <b-form-group
          label="E-mail:"
          label-for="e-mail"
          feedback="email required">
          <b-form-input
            id="email"
            v-model="user.email"
            :state="!$v.user.email.$invalid"
            type="text"
            placeholder="Introduce e-mail"/>
        </b-form-group>
      </b-form>

    </div>
</template>

<script>
import { HTTP } from '../common/http-common'
import { required, email } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      user: {},
      error: null,
      loading: false
    }
  },

  methods: {
    save() {
        HTTP.post('users', this.user)
        .then(response =>
          this.$router.replace({ name: 'Login', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
      },

    back() {
      this.$router.go(-1)
    }
  },
  validations: {
    user: {
      login: {
        required
      },
      password: {
        required
      },
      email: {
        required,
        email
      }
    }
  }
}
</script>
