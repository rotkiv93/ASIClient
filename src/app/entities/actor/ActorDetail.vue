<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
      <div v-if="actor">
        <div class="float-right">
          <b-btn
            variant="outline-primary"
            @click="back()">Back</b-btn>
          <b-btn
            :to="{ name: 'ActorUpdate', params: { id: actor.id }}"
            variant="outline-warning">Edit</b-btn>
        </div>
        <h5>Nombre: {{ actor.nombre }}</h5>
        <h5>Primer Apellido: {{ actor.apellido1 }}</h5>
        <h5 v-if="actor.apellido2">Segundo Apellido: {{ actor.apellido2 }}</h5>
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
      actor: null,
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
      this.error = this.actor = null
      this.loading = true

      HTTP.get(`actors/${this.$route.params.id}`)
      .then(response => this.actor = response.data)
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
