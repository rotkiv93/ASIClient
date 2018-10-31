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
          @click="save()">Registrate</b-btn>
      </div>

      <b-form
        v-if="user"
        class="app-form"
        @submit="save">

        <b-form-group
          label="Login:"
          label-for="login">
          <b-form-input
            id="login"
            v-model="user.login"
            type="text"
            required
            placeholder="Introduce login"/>
        </b-form-group>


        <b-form-group
          label="Password:"
          label-for="password">
          <b-form-input
            id="password"
            v-model="user.password"
            type="text"
            required
            placeholder="Introduce password"/>
        </b-form-group>

        <b-form-group
          label="E-mail:"
          label-for="e-mail">
          <b-form-input
            id="email"
            v-model="user.email"
            type="text"
            required
            placeholder="Introduce e-mail"/>
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
      user: null,
      error: null,
      loading: false,
    }
  },
  
  methods: {
    save() {
        HTTP.post('users', this.user)
        .then(response =>
          this.$router.replace({ name: 'Login', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
      }
    },
    back() {
      this.$router.go(-1)
    }
  }

</script>
