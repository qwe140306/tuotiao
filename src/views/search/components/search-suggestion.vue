<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in searchSuggestion"
      :key="index"
      icon="search"
      @click="$emit('search',item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      searchSuggestion: [],
    }
  },
  computed: {},
  watch: {
    searchText: {
      immediate: true,
      // debounce
      handler: debounce(async function () {
        // 请求获取数据
        const { data } = await this.$axios.get(`/app/v1_0/suggestion`, { params: { q: this.searchText } })
        // 模板展示数据
        this.searchSuggestion = data.data.options
      }, 200)
    }
  },
  methods: {
    highlight (str) {
      return str.replace(new RegExp(this.searchText, 'gi'), `<span style="color: red">${this.searchText}</span>`)
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped></style>
