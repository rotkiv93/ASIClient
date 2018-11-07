<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <nav class="nav">
       <div class="float-right" >
        <b-btn
          :to="{ name: 'ActorCreate' }"
          variant="outline-success">New</b-btn>
      </div>
    </nav>
    <div class="margenes">    
      <div
        v-for="actor in actors"
        :key="actor.id">
         <h5>  
          <b-btn
           :to= "{ name: 'ActorUpdate', params:{id : actor.id}}"
           variant = "outline-warning">Edit</b-btn>
           <router-link :to="{ name: 'ActorDetail', params: { id: actor.id } }">
            {{actor.nombre}} {{actor.apellido1}} {{actor.apellido2}}
           </router-link>
         </h5>
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
