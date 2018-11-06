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
        :key="director.id">
         
         <h5>  
          <b-btn
           :to= "{ name: 'DirectorUpdate', params:{id : director.id}}"
           variant = "outline-success">Edit</b-btn>
          <router-link :to="{ name: 'DirectorDetail', params: { id: director.id } }">
          {{director.nombre}} {{director.apellido1}} {{director.apellido2}}
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
  }
}
</script>
