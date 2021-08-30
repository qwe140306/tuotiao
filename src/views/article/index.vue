<template>
  <div class="artive-container">
    <!-- 顶部 -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      title="文章详情"
      @click-left="$router.back()"
    />
    <div class="article-wrap">
      <!-- 标题-->
      <h3 class="title">{{ article.title }}</h3>
      <!-- 头像 -->
      <van-cell center size="user-info">
        <van-image
          slot="icon"
          :src="article.aut_photo"
          class="avatar"
          fit="cover"
          round
        ></van-image>
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <div slot="label" class="pubdate">
          {{ article.pubdate | dateTo }}
        </div>
        <van-button
          :icon="article.is_followed ? '' : 'plus'"
          :loading="isFollowLoading"
          :type="article.is_followed ? 'default' : 'info'"
          class="follow-btn"
          round
          size="small"
          @click="focusOn"
        >
          {{ article.is_followed ? '已关注' : '关注' }}
        </van-button>
      </van-cell>
      <!-- 正文 -->
      <div
        ref="article-conertent"
        class="markdown-body"
        v-html="article.content"
      ></div>
      <div class="article-end">正文结束</div>

      <!-- 文章评论列表 -->
      <comment-list :source="articleId" :list="commentList" @reply-click="onReplyClick" @updata-total-count='totalCount = $event'/>
    </div>

    <!-- 底部评论点赞 -->
    <van-cell center class="bottom-bar">
      <van-button
        slot="title"
        hairline
        plain
        round
        size="small"
        @click="commentShow = true"
      >
        写评论
      </van-button>
      <div class="bottom-bar-icon">
        <van-icon :badge="totalCount" name="comment-o"/>
        <van-icon
          :color="article.is_collected ? '#3296FA' : ''"
          :name="article.is_collected ? 'star' : 'star-o'"
          @click="collect"
        />
        <van-icon
          :color="article.attitude === 1 ? '#d71345' : ''"
          :name="article.attitude === 1 ? 'like' : 'like-o'"
          @click="like"
        />
        <van-icon name="share-o"/>
      </div>
    </van-cell>

    <!--文章回复弹出层-->
    <van-popup v-model="commentShow" position="bottom"  >
      <write-comments :target="articleId" @post-success="onPostSuccess"/>
    </van-popup>
    <!--评论回复-->
    <van-popup v-model="isReplyShow" position="bottom" v-if="isReplyShow" :style="{ height: '80%' }">
      <comment-reply :articleId="articleId" :comment="comment" @close="isReplyShow = false" />
    </van-popup>
  </div>
</template>

<script>
import CommentList from './components/comment-list'
import WriteComments from './components/writeComments.vue'
import CommentReply from './components/comment-reply.vue'
import './github-markdown.css'
import { ImagePreview } from 'vant'
import { mapState } from 'vuex'
// 动态路由参数
//  1. this.$route.params.articleId
//      一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。于是，我们可以更新 User 的模板，输出当前用户的 ID：
//  2.  props 传参

export default {
  name: 'Article',
  components: {
    CommentList,
    WriteComments,
    CommentReply
  },
  data () {
    return {
      // 文章数据
      article: {},
      isFollowLoading: false,
      // 弹出层的显示隐藏
      commentShow: false,
      commentList: [], // 文章评论列表
      // 总评论
      totalCount: 0,
      // 评论回复弹出层
      isReplyShow: false,
      comment: {}

    }
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  methods: {
    onReplyClick(comment){
      this.isReplyShow = true
      this.comment = comment
    },
    async getArticle () {
      const { data } = await this.$axios.get(
        `/app/v1_0/articles/${this.articleId}`
      )
      this.article = data.data
      // 循环得到文章内容 dom 容器
      this.$nextTick(() => {
        this.handlingPreviewImage()
      })
    },
    // 处理预览图片函数
    handlingPreviewImage () {
      // 得到所有img 标签
      const articleConertent = this.$refs['article-conertent']
      const imgs = articleConertent.querySelectorAll('img')
      // 所有图片路径
      const imgPaths = []
      // 循环img 列表 给 img 注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
      // 事件处理函数中调用  ImagePreview() 预览
    },
    // 点击关注
    async focusOn () {
      this.isFollowLoading = true
      if (!this.user) {
        // 未登录，提示用户，跳转登录
        this.$toast.fail('未登录，正在为您跳转登录界面')
        await this.$router.push('/login')
      } else {
        // 当前已经登录 判断是否关注
        if (!this.article.is_followed) {
          // false 未关注，发送请求关注用户
          try {
            await this.$axios({
              method: 'post',
              url: `/app/v1_0/user/followings`,
              data: {
                target: this.article.aut_id
              }
            })
            this.$toast.success('关注成功')
          } catch (e) {
            console.log(e)
            this.$toast.fail('未知错误，别点了')
          }
        } else {
          // 取消关注
          try {
            await this.$axios({
              method: 'DELETE',
              url: `/app/v1_0/user/followings/${this.article.aut_id}`
            })

            this.$toast.success('取消关注成功')
          } catch (e) {
            console.log(e)
            this.$toast.fail('未知错误，别点了')
          }
        }
        this.article.is_followed = !this.article.is_followed
        this.isFollowLoading = false

        // this.$axios()
      }
    },
    // 收藏
    async collect () {
      if (this.user) {
        if (!this.article.is_collected) {
          try {
            await this.$axios({
              method: 'post',
              url: `/app/v1_0/article/collections`,
              data: {
                target: this.articleId
              }
            })
            this.article.is_collected = true
            this.$toast({
              message: '收藏成功',
              position: 'top'
            })
          } catch (e) {
            console.log(e)
            this.$toast({
              message: '未知错误',
              position: 'top'
            })
          }
        } else {
          try {
            await this.$axios({
              method: 'delete',
              url: `/app/v1_0/article/collections/${this.articleId}`
            })
            this.article.is_collected = false
            this.$toast({
              message: '取消收藏成功',
              position: 'top'
            })
          } catch (e) {
            console.log(e)
            this.$toast({
              message: '未知错误',
              position: 'top'
            })
          }
        }
      } else {
        this.$toast({
          message: '未登录',
          position: 'top'
        })
        await this.$router.push('/login')
      }
    },
    // 点赞
    async like () {
      if (this.user) {
        if (this.article.attitude !== 1) {
          this.article.attitude = 1
          try {
            await this.$axios({
              method: 'post',
              url: `/app/v1_0/article/likings`,
              data: {
                target: this.articleId
              }
            })

            this.$toast({
              message: '点赞成功',
              position: 'top'
            })
          } catch (e) {
            console.log(e)
            this.$toast({
              message: '未知错误',
              position: 'top'
            })
          }
        } else if (this.article.attitude === 1) {
          this.article.attitude = -1
          try {
            await this.$axios({
              method: 'delete',
              url: `/app/v1_0/article/likings/${this.articleId}`
            })

            this.$toast({
              message: '取消点赞成功',
              position: 'top'
            })
          } catch (e) {
            console.log(e)
            this.$toast({
              message: '未知错误',
              position: 'top'
            })
          }
        }
      } else {
        this.$toast({
          message: '未登录',
          position: 'top'
        })
        await this.$router.push('/login')
      }
    },
    // 发布评论触发的 emit
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      // 总评论
      this.totalCount++
      // 关闭弹出层
      this.commentShow = false
    }
  },
  created () {
    this.getArticle()
  }
}
</script>

<style lang="less" scoped>
.artive-container {
  background: #ffffff;
}

.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  margin: 0;
}

.user-info {
  .name {
    font-size: 12px;
    color: #333333;
  }

  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
}

.avatar {
  width: 40px;
  height: 40px;
  margin-right: 8px;
}

/deep/ .van-cell__label {
  margin-top: 0;
}

.follow-btn {
  width: 85px;
  height: 29px;
}

.markdown-body {
  padding: 14px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  height: 46px;
  align-items: center;

  .van-button {
    width: 198px;
    height: 30px;
  }

  /deep/ .van-cell__value {
    height: 46px;
  }

  .bottom-bar-icon {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 46px;

    i {
      font-size: 20px;
    }
  }
}

.article-wrap {
  background: #ffffff;
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 46px;
  overflow-y: auto;
}

.article-end {
  font-size: 12px;
  color: #969799;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
