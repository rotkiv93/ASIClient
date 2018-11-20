<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <nav class="nav">
      <div class="float-right" >
        <b-btn
          :to="{ name: 'DirectorCreate' }"
          variant="outline-success">New</b-btn>
      </div>
    </nav>
    <div class="margenes">
      
      <div
        v-for="director in directors"
        :key="director.id"
        class="listas">
         <h5>  
          <b-btn
           @click="eliminateDirector(director)" 
           variant = "outline-danger">Remove</b-btn>
          <b-btn
           :to= "{ name: 'DirectorUpdate', params:{id : director.id}}"
           variant = "outline-warning">Edit</b-btn>
          <router-link class="router" :to="{ name: 'DirectorDetail', params: { id: director.id } }">
          {{director.login}} {{director.apellido1}} {{director.apellido2}}
          </router-link>
         </h5>
      </div>
    </div>
    
  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import Vue from 'vue'

export default {
  components: { LoadingPage },
  data() {
    return {
      loading: false,
      directors: null,
      director: {},
      error: null
    }
  },
  created() {
    this.loading = true
    HTTP.get('users')
    .then(response => this.directors = response.data)
    .then(response => console.log(response))
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods: {
    eliminateDirector(director){
      HTTP.delete(`directors/${director.id}`, {params: { id: director.id }})
      .then(response => this.actualizaDirectores())
      .catch(err => this.error = Vue.notify({
                  text: 'This director cannot be removed',
                  type: 'error'
                  }))
    },
    actualizaDirectores(){
      HTTP.get('directors')
      .then(response => this.directors = response.data)
      .catch(err => this.error = err.response.data)
    }
  }
}
</script>
