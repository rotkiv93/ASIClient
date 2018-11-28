<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
      <div v-if="user">
        <div class="float-right">
          <b-btn
            variant="outline-primary"
            @click="back()">Back</b-btn>
        </div>
        <h5>Nombre: {{ user.login }}</h5>
        <h5>Email: {{ user.email }}</h5>
        <h5>Fecha Alta: {{ user.fecha_alta }}</h5>
        <hr>
        <!-- <div class="actor">{{ actor.body }}</div> -->
      </div>
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
      user: null,
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
      this.error = this.user = null
      this.loading = true

      HTTP.get(`users/${this.$route.params.id}`)
      .then(response => {this.user = response.data, console.log(response.data)})
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
