<template>
  <LoadingPage
    :loading="loading"
    :error="error">
    <div class="margenes">
      <div v-if="user">
        <div class="float-right">
          <b-btn
            variant="outline-primary"
            @click="back()">Back</b-btn>
        </div>
  
        <h5 class="listas2">Name: <span class="attribute"> {{ user.login }} </span></h5>
        <h5 class="listas2">Email:<span class="attribute"> {{ user.email }}</span></h5>
        <h5 class="listas2">Signup date:<span class="attribute"> {{ user.fecha_alta }}</span></h5>
        <h5 class="listas2">Viewed movies:<span class="attribute"> {{ user.num_vistas }}</span></h5>
        <h5 class="listas2">Pending movies:<span class="attribute"> {{ user.num_pendientes }}</span></h5>
        <h5 class="listas2">Rated movies:<span class="attribute"> {{ user.num_valoradas }}</span></h5>
        
        <div style="margin-right: 50%;margin-top:5%" v-if="user.login == userLogin">
          <label>Customize your notifications</label> 
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

        <div v-if="!file">
          <input class="inputfile" type="file" id="file" ref="file" @change="onFileChange"/>
          <label for="file">Choose a file</label>
        </div>
        <div v-else>
          <img :src="loaded" />
          <b-btn id="botonEliminaImagen" variant="danger" @click="removeImage">Remove image</b-btn>
          <b-btn id="botonSubeImagen" @click="submitFile">Update image</b-btn>
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
      .then(response => {this.user = response.data, console.log(response.data)})
      .catch(err => this.error = err.message)
      .finally(() => this.loading = false)

      this.userLogin = `${auth.user.login}`
    },
    updateUser(){
      console.log(this.user.notificaciones)
        HTTP.put(`users/${this.$route.params.id}`, this.user)
        .catch(err => this.error = err.message)
    },
    removeNotif(){
      HTTP.put(`users/${this.$route.params.id}`, this.user)
        .catch(err => this.error = err.message)
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
</style>
