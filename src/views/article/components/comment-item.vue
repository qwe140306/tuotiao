<template>
  <div class="comment-item">
    <van-cell center class="user-info">
      <!-- 头像 -->
      <van-image
        slot="icon"
        :src="item.aut_photo"
        class="avatar"
        fit="cover"
        round
      >
      </van-image>
      <!-- 名字 -->
      <div slot="title">
        <div class="title-warp">
          <div class="name">{{ item.aut_name }}</div>
          <div class="like-warp">
            <van-icon
              :class="{liked:item.is_liking}"
              :name="item.is_liking ? 'good-job' : 'good-job-o'"
              @click="onCommentLike"
            />
            <span>{{ item.like_count }}</span>
          </div>
        </div>

        <!-- 评论 -->
        <div class="content">
          {{ item.content }}
        </div>
        <!--时间 回复-->
        <div class="time-reply">
                    <span slot="label" class="pubdate">
                        {{ item.pubdate | datetime }}
                    </span>
          <van-button class="reply-btn" round size="mini" @click="$emit('reply-click',item)">
            {{ item.reply_count }}回复
          </van-button>
        </div>

      </div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  components: {},
  props: {
    item: {
      required: true,
      type: Object
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {

    async onCommentLike () {
      if (this.$store.state.user) {
        if (this.item.is_liking) {
          try {
            this.$axios({
              method: 'delete',
              url: `/app/v1_0/comment/likings/${this.item.com_id.toString()}`,
            })
            this.item.like_count--
            this.$toast.success({ message: '取消成功' })
          } catch (e) {
            console.log(e)
            this.$toast({
              message: '未知错误',
              position: 'top'
            })
          }
        } else {
          try {
            this.$axios({
              method: 'POST',
              url: '/app/v1_0/comment/likings',
              data: {
                target: this.item.com_id.toString()
              }
            })
            this.item.like_count++
            this.$toast.success({ message: '点赞成功' })
          } catch (e) {
            console.log(e)
            this.$toast({
              message: '未知错误',
              position: 'top'
            })
          }
        }
        // 更新视图
        this.item.is_liking = !this.item.is_liking
      } else {
        this.$toast({
          message: '未登录',
          position: 'top'
        })
        await this.$router.push('/login')
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
.comment-item {
  .user-info {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  // 头像
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
    margin-top: 5px;
  }

  .title-warp {
    display: flex;
    justify-content: space-between;
  }

  .like-warp {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      margin-left: 5px;
    }
  }

  // 用户名
  .name {
    font-size: 14px;
    color: #466b9d;
  }

  // 评论
  .content {
    font-size: 16px;
    color: #222222;
  }

  .time-reply {
    display: flex;
    align-items: center;
    height: 18px;
    // 时间
    .pubdate {
      font-size: 10px;
      color: #b4b4b4;
      margin-right: 10px;
    }

    .reply-btn {
      padding: 0 10px;
    }
  }

  .like-warp .liked {
    color: #ff69b4
  }
}
</style>
