<template>
  <div class='comment-reply'>
    <!--   头部信息-->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>
    <!--    当前评论项-->
    <comment-item :item="comment"></comment-item>
    <!--    所有评论回复-->
    <comment-list :source="comment.com_id" :type="`c`" :list="commentList"></comment-list>

    <!--    评论回复按钮-->
    <van-cell center class="bottom-bar">
      <van-button
        slot="title"
        hairline
        plain
        round
        size="small"
        @click="isPostShow = true"
      >
        写评论
      </van-button>
    </van-cell>
    <!--    弹出层-->
    <van-popup v-model="isPostShow" position="bottom">
      <write-comments :target="comment.com_id" :articleId='articleId' @post-success="onPostSuccess"/>
    </van-popup>
  </div>
</template>

<script>
import commentItem from './comment-item'
import commentList from './comment-list'
import writeComments from './writeComments'


export default {
  name: 'CommentReply',
  components: {
    commentItem,
    commentList,
    writeComments
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId:{
      type:[Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      isPostShow:false,
      commentList:[]
    }
  },
  computed: {},
  watch: {},
  methods: {
    onPostSuccess(comment){
      this.commentList.unshift(comment)
      this.comment.reply_count++
      this.isPostShow = false
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  height: 46px;

  .van-cell__title {
    display: flex;
    align-items: center;
    justify-content: center;

    .van-button {
      width: 100%;
    }
  }

}
</style>
