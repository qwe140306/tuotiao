<template>
  <div ref="article-list" class="article-list">
    <van-pull-refresh
      v-model="refreshing"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articlesList"
          :key="index"
          :article="article"
          :title="article.title"
        >
        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/article.item'
import { debounce } from 'lodash'

export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articlesList: [],
      loading: false, // 是否正在加载中
      finished: false, // 是否已经全部加载完成
      timestamp: null, // 如果有值，则使用这个时间戳去请求列表数据
      refreshing: false, // 是否下拉刷新
      scrollTop: 0, // 文章距离顶部的位置
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 瀑布流底部发送请求刷新加载更多
    async onLoad () {
      const { data } = await this.$axios.get(`/app/v1_1/articles`, {
        params: {
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        }
      })
      const { results } = data.data
      // 将每次请求的数据push到 数组中 ，如果直接赋值是替换掉数组不可以
      this.articlesList.push(...results)
      // 本次加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (results.length) {
        // pre_timestamp 服务器返回的下一页的数据时间戳
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据 不在加载
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      const { data } = await this.$axios.get(`/app/v1_1/articles`, {
        params: {
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        }
      })
      const { results } = data.data
      // 将每次请求的数据push到 数组中 ，如果直接赋值是替换掉数组不可以
      this.articlesList.unshift(...results)
      // 关闭刷新状态
      this.refreshing = false
      // 提示刷新了多少条数据
      this.$toast({
        message: `更新了${results.length}条数据`,
        position: 'top'
      })
    },

  },
  created () {
    this.onLoad()
  },
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce( () => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  // 被 keep-alive 缓存的组件激活时调用。
  activated () {
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  // 被 keep-alive 缓存的组件失活时调用。
  deactivated () {
  }

}
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}
</style>
