<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
        <b-btn style="float left;"
          variant="secondary"
          @click="back()">Back</b-btn>
        <b-btn style="float left;"
          variant="outline-success"
          :disabled="$v.movie.$invalid"
          @click="submitFile();submitForm()">Submit</b-btn>

      <div class="float-right">
          <p style="margin:1%;">Hide</p>
          <toggle-button v-model="movie.oculta"/>
      </div>

      <b-form
        v-if="movie"
        class="app-form"
        @submit="submitForm">

        <b-form-group
          label="Title:"
          label-for="title"
          feedback="Title required">
          <b-form-input
            id="titulo"
            v-model="movie.titulo"
            :state="!$v.movie.titulo.$invalid"
            type="text"
            placeholder="Title"/>
        </b-form-group>

         <b-form-group class="form-group"
          label="Country:"
          label-for="country"
          feedback="Country required">
          <b-form-input
            id="pais"
            v-model="movie.pais"
            :state="!$v.movie.pais.$invalid"
            placeholder="Country"/>
        </b-form-group>

        <b-form-group
          label="Producer:"
          label-for="producer"
          feedback="Producer required">
          <b-form-input
            id="productora"
            v-model="movie.productora"
            :state="!$v.movie.productora.$invalid"
            placeholder="Producer"/>
        </b-form-group>

         <b-form-group
          label="Duration:"
          label-for="duration"
          feedback="Duration required, only positive numbers">
          <b-form-input
            id="duracion"
            type="number"
            v-model="movie.duracion"
            :state="!$v.movie.duracion.$invalid"
            placeholder="Duration"/>
        </b-form-group>

        <b-form-group
          label="Director:"
          label-for="director"
          feedback="You must choose a director from the list">
          <b-form-select
            id="director"
            :options="directors"
            v-model="movie.director"
            :state="!$v.movie.director.$invalid" />
        </b-form-group>

        <b-form-group
          label = "Actores:"
          label-for="actores">
          <multiselect
            class =multiselect_actores
            v-model="movie.actores"
            :options="allActors"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :custom-label="customLabel"
            :show-labels="false"
            placeholder="Pick some actors"
            label="nombre"
            track-by="nombre"
            :preselect-first="false">
          </multiselect>
          <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">
        </b-form-group>

         <b-form-group
          label="Genre:"
          label-for="genre"
          feedback="You must choose a genre from the list">
          <b-form-select
            id="genero"
            :options="genres"
            v-model="movie.genero"
            :state="!$v.movie.genero.$invalid" />
        </b-form-group>

         <b-form-group
          label="Release year:"
          label-for="release year"
          feedback="Release year required, starting from 1900">
          <b-form-input
            id="ano_salida"
            v-model="movie.ano_salida"
            :state="!$v.movie.ano_salida.$invalid"
            placeholder="Release year"/>
        </b-form-group>

         <b-form-group
          label="Release date::"
          label-for="release date">
          <b-form-input
            id="fecha_estreno"
            v-model="movie.fecha_estreno"
            type="date"
            placeholder="Release date"/>
        </b-form-group>

        <b-form-group
          label="Synopsis:"
          label-for="synopsis"
          feedback="Synopsis required">
          <b-form-textarea
            id="sinopsis"
            v-model="movie.sinopsis"
            :state="!$v.movie.sinopsis.$invalid"
            :rows="3"
            :max-rows="6"
            placeholder="Synopsis"/>
        </b-form-group>
      </b-form>

      <div v-if="movie.id">
        <div v-if="!file">
          <input class="inputfile" type="file" id="file" ref="file" @change="onFileChange"/>
          <label for="file">Choose a file</label>
        </div>
        <div v-else>
          <img :src="loaded" />
          <b-btn id="botonEliminaImagen" variant="danger" @click="removeImage">Remove image</b-btn>
        </div>
        </div>
      </div>

  </LoadingPage>
</template>

<script>
import { HTTP } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import Multiselect from 'vue-multiselect'
import PictureInput from 'vue-picture-input'
import FormDataPost from '../../common/upload'
import {required, numeric, minValue, minLength} from 'vuelidate/lib/validators'

export default {
  components: { LoadingPage,  Multiselect,  PictureInput},
  data() {
    return {
      movie: {},
      movieSearch: [],
      error: null,
      isActive: false,
      loading: false,
      allGenres: [],
      allActors: [],
      file: '',
      loaded: '',
      allDirectors: []
    }
  },
  computed: {
    genres() {
      return this.allGenres.map(genre => {
        return {
          text: genre.nombre,
          value: genre
        }
      })
    },
    searchMovies(){
    return this.movieSearch;
    },
    directors(){
      return this.allDirectors.map(director => {
        return {
          text: director.nombre + ' ' + director.apellido1 + ' '+ director.apellido2,
          value: director
        }
      })
    }
  },
  created() {
    this.getUsers()
    this.getDirectors()
    this.getActors()
    if (this.$route.params.id) {
      this.loading = true

      HTTP.get(`movies/${this.$route.params.id}`)
      .then(response => this.movie = response.data)
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)
    } else {
      this.movie = {}
    }
  },
  methods: {
    removeImage: function (e) {
      this.file = '';
    },
    customLabel(actor){
      if (actor.apellido2 != null){
        return `${actor.nombre} ${actor.apellido1} ${actor.apellido2}`;
      } else if (actor.apellido1 !=null) {
        return `${actor.nombre} ${actor.apellido1}`;
      } else {
        return `${actor.nombre}`;
      }
    },
    isLoaded: function(){
      this.isActive = true;
    },
    getUsers() {
      HTTP.get('genre')
      .then(response => this.allGenres = response.data)
      .catch(err => this.error = err.message)
    },
    getDirectors(){
      HTTP.get('directors')
      .then(response => this.allDirectors = response.data)
      .catch(err => this.error = err.message)
    },
    getActors(){
       HTTP.get('actors')
      .then(response => this.allActors = response.data)
      .catch(err => this.error = err.message)
    },
    submitForm() {
      if (this.$route.params.id) {
        HTTP.put(`movies/${this.$route.params.id}`, this.movie)
        .then(response =>
          this.$router.replace({ name: 'MovieDetail', params: { id: response.data.id }}))
        .catch(err => this.error = err.message)
      } else {
        HTTP.post('movies', this.movie)
        .then(response => {
          this.$router.replace({ name: 'MovieDetail', params: { id: response.data.id }})})
        .catch(err => this.error = err.message)
      }
    },
    back() {
      this.$router.go(-1)
    },
    submitFile(){
      if (this.file != ''){
        let formData = new FormData();
        formData.append('file', this.file, this.movie.id + ".jpg");

        this.movie.ruta = this.movie.id + ".jpg";

        HTTP.post('movies/uploadFile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          )
        .catch(function(){
          console.log('FAILURE!!');
        });
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
      this.file = files[0];
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.loaded = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    }
  },
  validations: {
    movie: {
      titulo: {
        required
      },
      sinopsis: {
        required
      },
      director: {
        required
      },
      genero: {
        required
      },
      duracion: {
        required,
        numeric
      },
      pais: {
        required
      },
      productora: {
        required
      },
      ano_salida: {
        required,
        numeric,
        minLength: minLength(4),
        minValue: minValue(1900)
      }
    }
  }
}
</script>

<style lang="sass" src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">

article {
    display: block;
}

img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}

#botonEliminaImagen {
   margin: auto;
  display: block;
}

 .inputfile {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}


.inputfile + label {
    border-radius: 25px;
    padding: 5px; 
    font-size: 1.25em;
    font-weight: 700;
    color: white;
    background-color: rgb(44, 110, 67);
    display: inline-block;
}

.inputfile:focus + label,
.inputfile + label:hover {
    background-color: rgb(44, 110, 67);
}

.inputfile + label {
	cursor: pointer; /* "hand" cursor */
}

</style>
