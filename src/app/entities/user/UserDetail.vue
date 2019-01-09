<template>
  <LoadingPage
    :loading="loading"
    :error="error">

    <nav class="nav" v-if ="user">
      <h1>{{user.login}}'s profile</h1>
    </nav>

    <div v-if="user" style="margin: 0; auto;">
      <div class="card flex-row flex-wrap">

        <div class="image-container px-4">
          <img class="user-image" v-bind:src="getImagen()">
          <div v-if="user.login == userLogin">
            <div v-if="!file">
              <input class="inputfile" type="file" id="file" ref="file" @change="onFileChange"/>
              <label for="file">Change profile image</label>
            </div>
            <div v-else>
              <img class="user-image" v-bind:src="loaded">
              <b-btn id="botonEliminaImagen" variant="danger" @click="removeImage">Remove image</b-btn>
              <b-btn id="botonSubeImagen" @click="submitFile">Update image</b-btn>
            </div>
          </div>
        </div>

        <div class="card-block px-4">

          <h4>Name: <span> {{ user.login }} </span> </h4>
          <h4>Email: <span> {{ user.email }} </span> </h4>
          <h4>Signup date: <span> {{ user.fecha_alta }} </span> </h4>
          <h4>Viewed movies: <span> {{ user.num_vistas }} </span> </h4>
          <h4>Pending movies: <span> {{ user.num_pendientes }} </span> </h4>
          <h4>Rated movies: <span> {{ user.num_valoradas }} </span> </h4>

          <div v-if="user.login == userLogin">
            <label> Customize your notifications </label>
            <multiselect
              class = multiselect_notif
              v-model="user.notificaciones"
              :options="opciones"
              :multiple="false"
              :close-on-select="true"
              :clear-on-select="true"
              :preserve-search="true"
              placeholder="Pick an option"
              :show-labels="true"
              :preselect-first="false"
              @select="updateUser"
              @remove="removeNotif">
            </multiselect>
              <link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">
          </div>
        </div>

      <div>
        <b-btn class="button" size=lg @click="back()">
          <font-awesome-icon icon="arrow-left"/>
        </b-btn>
      </div>
    </div>
  </LoadingPage>
</template>

<script>
import { HTTP, baseURL } from '../../common/http-common'
import LoadingPage from '../../components/LoadingPage'
import auth from '../../common/auth'
import Multiselect from 'vue-multiselect'
import Vue from 'vue'

export default {
  components: { LoadingPage, Multiselect },
  data() {
    return {
      loading: false,
      user: null,
      error: null,
      userLogin: null,
      file: '',
      loaded: '',
      opciones: ["Email" ,"SMS"]
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.error = this.user = null
      this.loading = true

      HTTP.get(`users/${this.$route.params.id}`)
      .then(response => {this.user = response.data})
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)

      this.userLogin = `${auth.user.login}`
    },
    updateUser(){
        HTTP.put(`users/${this.$route.params.id}`, this.user)
        .catch(err => this.error = err.message)
    },
    removeNotif(){
      HTTP.put(`users/${this.$route.params.id}`, this.user)
        .catch(err => this.error = err.message)
    },
    getImagen(){
      return baseURL + "/movies/image/" + this.user.login + ".jpg"
    },
    back() {
      this.$router.go(-1)
    },
    submitFile(){
      if (this.file != ''){
        let formData = new FormData();
        formData.append('file', this.file, this.user.login + ".jpg");

        HTTP.post('movies/uploadFile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => { this.sucess = Vue.notify({
                text: 'Sucessfully updated Image',
                type: 'sucess'
              }), this.updateUser()})
          .catch(err => { this.error = Vue.notify({
            text: 'Check file size',
            type: 'error'
          }), this.updateUser()})
        }
    },
    updateFile(){
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
    removeImage: function (e) {
      this.file = '';
    }
  }
}
</script>


<style lang="sass" src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss">

  .movie {
    white-space: pre;
  }

  $text: #777;

  .card{
    background: #2B2A34;
    overflow: auto;
  }

  .image-container{
    float: left;
    height: 300px;
    width: 300px;
  }

  .user-image{
    position: relative;
    display: block;
    height: 100%;
    width: 100%;
    object-fit: fill;
    background-image: url(http://localhost:8080/api/movies/image/pred.jpg)
  }

  .button{
    position: absolute;
    top: 0%;
    left: 0%;
    overflow: auto;
    background-color: Transparent;
    border: none;
    cursor:pointer;
  }
</style>
