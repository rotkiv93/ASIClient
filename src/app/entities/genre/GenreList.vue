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
          <b-form-group
            label="Intrdoduce new genre:"
            feedback="Genre name required">
            <b-form-input
              id="nombre"
              v-model="genre.nombre"
              :state="!$v.genre.nombre.$invalid"
              type="text"
              placeholder="Genre name"/>
          </b-form-group>
          <b-btn style="margin-top:1%;"
            v-b-toggle.collapseNew
            variant="success"
            :disabled="$v.genre.$invalid"
            @click="post()">Submit</b-btn>
        </b-collapse>
      <div
        v-for="genre in sortedGenres"
        :key="genre.id"
        class="listas2">
         <h5>
          <b-btn
            variant="outline-danger"
            @click="deleteGenre(genre)">Remove</b-btn>
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
import {required} from 'vuelidate/lib/validators'
import Vue from 'vue'


export default {
  components: { LoadingPage },
  data() {
    return {
      loading: false,
      genres: [],
      genre: {},
      error: null,
      success: null
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
      .then(response => {this.success = Vue.notify({
                  text: 'Gender successfully modified',
                  type: 'success'
                  }), this.actualizaGeneros()})
      .catch(err => {this.error = Vue.notify({
                  text: 'Gender already exists or is empty',
                  type: 'error'
                  }), this.actualizaGeneros()})
    },
    post(){
        HTTP.post('genre', this.genre)
        .then(response => this.actualizaGeneros())
        .catch(err => this.error = Vue.notify({
                  text: 'Gender already exists or is empty',
                  type: 'error'
                  }))
    },
    deleteGenre(genre){
      HTTP.delete(`genre/${genre.id}`, {params: { id: genre.id }})
      .then(response => this.actualizaGeneros())
      .catch(err => this.error = Vue.notify({
                  text: 'This genre cannot be removed',
                  type: 'error'
                  }))
    },
    actualizaGeneros(){
      HTTP.get('genre')
      .then(response => this.genres = response.data)
      .catch(err => this.error = err.response.data)
    }
  },
  validations: {
    genre: {
      nombre: {
        required
      }
    }
  }
}
</script>
