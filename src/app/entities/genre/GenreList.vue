<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
      <!-- <div class="float-right" >
        <b-btn
          :to="{ name: 'GenreCreate' }"
          variant="outline-primary">New</b-btn>
      </div> -->
      <div
        v-for="genre in orderedGenres"
        :key="genre.id"> 
         <h5>
          <!-- <b-btn
           :to= "{ name: 'GenreUpdate', params:{id : genre.id}}"
           variant = "outline-primary">Edit</b-btn> -->
        {{genre.nombre}} 

        <!-- <router-link :to="{ name: 'GenreDetail', params: { id: genre.id } }"> -->
       <!--  </router-link> -->
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
      genres: null,
      error: null
    }
  },
  computed:{
    orderedGenres(){
      return this.genres.sort()
    }
  },
  created() {
    this.loading = true

    HTTP.get('genre')
    .then(response => this.genres = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  }
}
</script>
