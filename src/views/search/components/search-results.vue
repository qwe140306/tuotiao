<template>
  <div class="search-results">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title"/>
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  components: {},
  props: {
    searchText: {
      required: true,
      type: String,
    }
  },
  data () {
    return {
      list: [],
      error: false,
      loading: false,
      finished: false,
      page: 1,// 当前页
      per_page: 10, // 每页显示条数
    }
  },
  computed: {},
  watch: {},
  methods: {
    async onLoad () {
      const { data } = await this.$axios.get(`/app/v1_0/search`, {
        params: {
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        }
      })
      const { results } = data.data
      this.list.push(...results)
      // 关闭加载中
      this.loading = false

      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }

    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.search-results {
  position: fixed;
  top: 54px;
  right: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}
</style>
