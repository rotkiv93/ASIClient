<template>
  <div>
    <div
      v-if="loading"
      class="spinner">
      <Stretch></Stretch>
    </div>

    <div
      v-else-if="error"
      class="error">
      <pre>{{ error }}</pre>
      <button
        class="btn btn-primary"
        @click="reload">Reload</button>
    </div>

    <slot v-else/>
  </div>
</template>

<script>
import {Stretch} from 'vue-loading-spinner' 
export default {
  components: {
      Stretch
    },
  name: 'LoadingPage',
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    error: {
      type: [ String, Object, Error ],
      default: null
    }
  },
  methods: {
    reload() {
      this.$router.go()
    }
  }
}
</script>
