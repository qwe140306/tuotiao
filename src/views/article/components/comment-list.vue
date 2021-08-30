<template>
  <div class="comment-list">
    <van-cell title="全部评论"/>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        @reply-click="$emit('reply-click',$event)"
      />
    </van-list>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Object, Number, String],
      required: true
    },
    list: {
      type: Array,
      //  数组或者对象的默认值必须通过函数返回
      default: () => []
    },
    type:{
      type:String,
      default:'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
    }
  },
  computed: {},
  watch: {},
  methods: {
    async onLoad () {
      // 请求获取评论
      const { data } = await this.$axios.get(`/app/v1_0/comments`, {
        params: {
          type: this.type,
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit
        }
      })
      const { results,total_count } = data.data
      this.list.push(...results)
      this.loading = false
      // 传递所有评论数量给父组件
      this.$emit('updata-total-count',total_count)

      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  },
  created () {
    this.onLoad()
  },
  mounted () {

  }
}
</script>

<style lang="less" scoped></style>
