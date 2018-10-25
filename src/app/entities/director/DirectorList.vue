<template>
  <LoadingPage
    :loading="loading"
    :error="error">

   <!--  <div class="float-right">
      <b-btn
        :to="{ name: 'DirectorCreate' }"
        variant="primary">New</b-btn>
      <b-btn
        :to="{ name: 'DirectorUpdate', params: { id: director.id }}"
        variant="primary">Edit</b-btn>
       <b-btn
        variant="primary"
        @click="eliminateDirector()">Eliminate</b-btn>
    </div> -->

    <div
      v-for="director in directors"
      :key="director.id">
      </button> 
       <h5>  
        <b-btn
         :to= "{ name: 'DirectorUpdate'}"
         variant = "primary">Edit</b-btn>
       {{ director.nombre }} {{ director.apellido1 }} {{ director.apellido2 }}
       </h5>
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
      directors: null,
      error: null
    }
  },
  created() {
    this.loading = true

    HTTP.get('directors')
    .then(response => this.directors = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
  eliminateDirector(){
      HTTP.delete(`directors/${this.$route.params.id}`, {params: { id: this.director.id }})
       .then(response =>
          this.$router.replace({ name: 'DirectorList', params: { id: response.data }}))
       .catch(err => this.error = err.message)
    }
  }
}
</script>
