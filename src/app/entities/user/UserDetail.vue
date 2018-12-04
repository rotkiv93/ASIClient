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
        <h5>Peliculas vistas: {{ user.num_vistas }}</h5>
        <h5>Peliculas pendientes: {{ user.num_pendientes }}</h5>
        <h5>Peliculas Votadas: {{ user.num_valoradas }}</h5>
        
        <div v-if="user.login == userLogin">
           <multiselect
            class =multiselect_notif
            v-model="user.notificaciones" 
            :options="opciones" 
            :multiple="false" 
            :close-on-select="true" 
            :clear-on-select="true" 
            :preserve-search="true"
            placeholder="Pick an option"
            :show-labels="true"
            :preselect-first="false"
            @select="updateUser"
            @remove="removeNotif">
          </multiselect>
            <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">
        </div>
        
        <hr>
        <!-- <div class="actor">{{ actor.body }}</div> -->
      </div>
    </div>
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import Multiselect from 'vue-multiselect'

export default {
  components: { LoadingPage, Multiselect },
  data() {
    return {
      loading: false,
      user: null,
      error: null,
      userLogin: null,
      opciones: ["Email" ,"SMS"]
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

      this.userLogin = `${auth.user.login}`
    },
    updateUser(){
      console.log(this.user.notificaciones)
        HTTP.put(`users/${this.$route.params.id}`, this.user)
        .catch(err => this.error = err.message)
    },
    removeNotif(){
      HTTP.put(`users/${this.$route.params.id}`, this.user)
        .catch(err => this.error = err.message)
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>


<style lang="sass" src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss">
  .movie {
    white-space: pre;
  }
</style>
