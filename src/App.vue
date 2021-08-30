<template>
  <div id="app">
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  data () {
    return {}
  },
  computed: {
    ...mapState(['cachePages'])
  }

}
</script>

<style lang="less"></style>
