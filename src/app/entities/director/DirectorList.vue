<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <div class="margenes">
      <div class="float-right" >
        <b-btn
          :to="{ name: 'DirectorCreate' }"
          variant="outline-primary">New</b-btn>
      </div>

      <div
        v-for="director in directors"
        :key="director.id">
         
         <h5>  
          <b-btn
           :to= "{ name: 'DirectorUpdate', params:{id : director.id}}"
           variant = "outline-primary">Edit</b-btn>
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
