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
            Introduce new genre:
            <b-form-input
              id="nombre"
              v-model="genre.nombre"
              type="text"
              required/>
            <b-btn
              variant="success"
              @click="post()">Submit</b-btn>
          </b-card>
        </b-collapse>
      <div
        v-for="genre in sortedGenres"
        :key="genre.id"> 
         <h5>
          <b-btn
           v-b-toggle="genre.nombre"
           variant = "outline-success">Edit</b-btn>
            {{genre.nombre}}
           <b-collapse :id="genre.nombre" class="mt-2">
            <b-card>
                Introduce new name:
                <b-form-input
                  id="nombre"
                  v-model="genre.nombre"
                  type="text"
                  required/>
                <b-btn
                  variant="success"
                  @click="save(genre)">Submit</b-btn>
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
    save(genre){
        console.log(genre)
        HTTP.put(`genre/${genre.id}`, {params:{genreID: this.genre.id}}, this.genre)
        /*.then(response =>
          this.$router.replace({ name: 'GenreList', params: { id: response.data.id }}))*/
        .catch(err => this.error = err.message)
    },
    post(){
        HTTP.post('genre', this.genre)
        .then(response =>
          this.$router.replace({ name: 'GenreList', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
    }
  }
}
</script>
