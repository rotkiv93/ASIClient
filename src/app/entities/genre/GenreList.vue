<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <nav class="nav">
      <div class="float-right">
        <b-btn
          v-b-toggle.collapseNew
          variant ="outline-success">New</b-btn>
      </div>
    </nav>
    <div class="margenes">
      <b-collapse id="collapseNew" class="mt-2">
          <b-card>
            <h5 class="h51">Introduce new genre:</h5>
            <b-form-input
              id="nombre"
              v-model="genre.nombre"
              type="text"
              required/>
            <b-btn v-b-toggle.collapseNew
              variant="success"
              @click="post()">Submit</b-btn>
          </b-card>
        </b-collapse>
      <div
        v-for="genre in sortedGenres"
        :key="genre.id"
        class="listas2"> 
         <h5>
          <b-btn
           v-b-toggle=genre.id.toString()
           variant = "outline-warning">Edit</b-btn>
            {{genre.nombre}}
           <b-collapse :id=genre.id.toString() class="mt-2">
            <b-card>
                <h5 class="h51">Introduce new name:</h5>
                <b-form-input
                  id="nombre"
                  v-model="genre.nombre"
                  type="text"
                  required/>
                <b-btn v-b-toggle=genre.id.toString() style="margin-top:1%"
                  variant="success"
                  @click="saveg(genre)">Save</b-btn>
                <!--<b-btn style="float:right; margin-top:1%"
                  variant="danger"
                  @click="deleteGenre(genre)">Delete</b-btn>-->
                </b-card>
          </b-collapse>

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
      genres: [],
      genre: {},
      error: null
    }
  },
  computed:{
    sortedGenres(){
      return this.genres.sort()
    }
  },
  created() {
    this.loading = true

    HTTP.get('genre')
    .then(response => this.genres = response.data)
    .catch(err => this.error = err.response.data)
    .finally(() => this.loading = false)
  },
  methods:{
    saveg(genre){
      HTTP.put(`genre/${genre.id}`, genre)
      .then(response => this.actualizaGeneros())
      .catch(err => this.error = err.message)
    },
    post(){
        HTTP.post('genre', this.genre)
        .then(response => this.actualizaGeneros())
        .catch(err => this.error = err.message)
    },
    deleteGenre(genre){
      HTTP.delete(`genre/${genre.id}`, {params: { id: genre.id }})
      .then(response => this.actualizaGeneros())
      .catch(err => this.error = err.message)
    },
    actualizaGeneros(){
      HTTP.get('genre')
      .then(response => this.genres = response.data)
      .catch(err => this.error = err.response.data)
    }
  }
}
</script>
