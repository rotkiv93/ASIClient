<template>
  <div class = "log_marg">
    <form @submit.prevent="userLogin">
      <div
        v-if="error"
        class="error">
        <pre>{{ error }}</pre>
      </div>
        <div class = "login_mar">
          <h2>Sign in</h2>
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              class="form-control"
              required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              name="password"
              required>
          </div>
          <button
            type="submit"
            class="btn btn-primary">Log In</button>
        </div>
        <div class="reg_mar">
          <h2>Why register?</h2>
            <ul style="list-style-type:disc; margin-top:6%; font-size:130%">
              <li>Diario de tus películas y series vistas</li>
              <li>Una red social de cine con tus amigos</li>
              <li>Poco mas que decir</li>
            </ul>
              <b-btn
              :to= "{ name: 'Register'}"
              variant = "outline-success">Register</b-btn>
        </div>
    </form>
  </div>
</template>

<script>
import auth from '../common/auth'

export default {
  data () {
    return {
      username: '',
      password: '',
      error: null
    }
  },
  methods: {
    userLogin() {
      auth.login({
        login: this.username,
        password: this.password
      })
      .then(response => {
         this.$router.replace({ name: 'MovieList'})
      })
      .catch(err => {
        this.error = err.response.data.message
      })
    }
  }
}
</script>
