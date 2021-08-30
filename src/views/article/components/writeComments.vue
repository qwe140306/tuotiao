<template>
  <div class="write-comments">
    <van-field
      v-model.trim="content"
      :border="false"

      autosize
      class="post-inp"
      maxlength="30"
      placeholder="优质评论将会被优先展示"
      show-word-limit
      type="textarea"
    />
    <van-button :disabled="!this.content" class="post-btn" round size="small" @click="postComment">
      发布
    </van-button>
  </div>
</template>

<script>
export default {
  name: 'WriteComments',
  components: {},
  props: {
    target: [Number, String, Object],
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data () {
    return {
      content: '',
    }
  },
  computed: {},
  watch: {},
  methods: {
    async postComment () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁止背景点击
        duration: 0
      })
      const { data } = await this.$axios({
        method: 'POST',
        url: `/app/v1_0/comments`,
        data: {
          target: this.target.toString(),
          content: this.content,
          art_id: this.articleId === null ? null : this.articleId.toString()
        }
      })
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success('发布成功！')
      this.content = ''

    }
  },
  created () {

  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
.write-comments {
  display: flex;
  align-items: center;
  padding: 14px;

  .post-btn {
    width: 60px;
    margin-left: 15px;
  }

  .post-inp {
    background: #F5F7F9;
  }
}

</style>
