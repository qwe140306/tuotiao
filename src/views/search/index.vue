<template>
  <div class="search-container">
    <!--      搜索栏-->
    <form action="/">
      <van-search
        v-model="searchText"
        background="#3296FA"
        clearable
        placeholder="请输入搜索关键词"
        show-action
        @cancel="$router.back()"
        @focus="isResultShow = false"
        @search="onSearch(searchText)"
      />
    </form>
    <!--      搜索结果-->
    <search-results v-if="isResultShow" :search-text="searchText"/>
    <!--      联想建议-->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"/>
    <!--      历史记录-->
    <search-history @deleteAllSerrch="searchHistories = $event" v-else :getSearchHistory="getSearchHistory" :searchHistories="searchHistories" @search="onSearch"/>

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResults from './components/search-results'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResults
  },
  props: {},
  data () {
    return {
      searchText: '',
      // 搜索结果的显示隐藏
      isResultShow: false,
      searchHistories: []  // 搜索历史数据
    }
  },
  computed: {},
  watch: {},
  methods: {
    onSearch (searchText) {

      // 如果是点击联想搜索，会将联想的 str 传递过来，赋值给 searchText ，然后触发搜索
      // 如果正常搜索，那么将 searchText 重新赋值一遍搜索，没有影响
      this.searchText = searchText

      if (!this.$store.state.user) {
        // 触发搜索 记录历史记录
        this.searchHistories.unshift(searchText)
        this.searchHistories = [...new Set(this.searchHistories)]
        // 如果用户没有登录 则把搜索历史记录存储到本地
        setItem('search-history', this.searchHistories)
      }

      // 搜索展示搜索结果
      this.isResultShow = true
    },
    async getSearchHistory () {
      try {
        const { data } = await this.$axios.get('/app/v1_0/search/histories')
        this.searchHistories = data.data.keywords
      } catch (e) {
        this.$toast({
          message: '未登录!' + e.message,
          position: 'top'
        })
      }
    }
  },
  created () {
    if (this.$store.state.user) {
      this.getSearchHistory()
    } else {
      this.searchHistories = getItem('search-history') || []
    }
  },
  mounted () {
  },

}
</script>

<style lang="less" scoped></style>
