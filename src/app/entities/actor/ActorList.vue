<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    
    <div class="float-right" >
      <b-btn
        :to="{ name: 'ActorCreate' }"
        variant="outline-primary">New</b-btn>
    </div>

    <div class = "margenes"
      v-for="actor in actors"
      :key="actor.id">
      </button> 
       <h5>  
        <b-btn
         :to= "{ name: 'ActorUpdate', params:{id : actor.id}}"
         variant = "outline-primary">Edit</b-btn>
       <router-link :to="{ name: 'ActorDetail', params: { id: actor.id } }">
      {{actor.nombre}} {{actor.apellido1}} {{actor.apellido2}}
      </router-link>
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
      actors: null,
      error: null
    }
  },
  created() {
    this.loading = true

    HTTP.get('actors')
    .then(response => this.actors = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  }
}
</script>
