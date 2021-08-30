<template>
  <div class="my-container">
    <!-- 登录状态 -->
    <van-cell-group v-if="user" class="my-info">
      <!-- 头像区域 -->
      <van-cell :border="false" center class="base-info">
        <van-image
          slot="icon"
          :src="userInfo.photo"
          class="avatar"
          fit="cover"
          round
        />
        <div slot="title" class="name">
          {{ userInfo.name }}
        </div>
        <van-button
          class="update-btn"
          round
          size="small"
          to="/user/profile"
        >
          编辑资料
        </van-button>
      </van-cell>
      <!-- 数据信息 -->
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div class="text-warp">
            <div class="count">{{ userInfo.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-warp">
            <div class="count">{{ userInfo.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-warp">
            <div class="count">{{ userInfo.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-warp">
            <div class="count">{{ userInfo.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录 -->
    <div v-else class="not-login">
      <div @click="$router.push({
              name:'login',
              query:{
                redirect:'/my'
              }
            })">
        <img alt="" class="mobile" src="./image/no-login.png"/>
      </div>
      <div class="text">
        登录 / 注册
      </div>
    </div>
    <!-- 收藏历史 -->
    <van-grid :column-num="2" class="nav-grid mb-5">
      <van-grid-item class="nav-grid-item" icon="star-o" text="关注"/>
      <van-grid-item
        class="nav-grid-item"
        icon="underway-o"
        text="历史"
      />
    </van-grid>
    <!-- 消息通知 -->
    <van-cell is-link title="消息通知" to=""/>
    <!-- 小智同学 -->
    <van-cell class="mb-5" is-link title="小智同学" to=""/>
    <!-- 退出登录 -->
    <van-button v-if="user" block class="quit-login" @click="onLogout"
    >退出登录
    </van-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'My',
  components: {},
  props: {},
  data () {
    return {
      // 当前登录用户的信息
      userInfo: {}
    }
  },
  computed: {
    // 存放着 token 的vuex
    ...mapState(['user'])
  },
  watch: {},
  methods: {
    // 退出登录
    onLogout () {
      this.$dialog
        .confirm({
          title: '退出登录',
          message: '是否退出账户登录！'
        })
        .then(() => {
          // 清除登录状态
          this.$store.commit('setUser', null)
          // 提示用户
          this.$toast.success('退出成功')
        })
        .catch(() => {
          this.$toast({
            message: '已取消',
            position: 'top'
          })
        })
    },
    // 获取用户信息
    async getUserInfo () {
      const { data } = await this.$axios.get('/app/v1_0/user')
      this.userInfo = data.data
    }
  },
  created () {
    if (this.user) {
      this.getUserInfo()
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
// 登录
.my-info {
  background: url('./image/banner.png') no-repeat;
  background-size: cover;
  // 基本信息
  .base-info {
    background-color: unset;
    height: 115px;
    box-sizing: border-box;
    padding-top: 38px;
    padding-bottom: 11px;

    .avatar {
      box-sizing: border-box;
      width: 66px;
      height: 66px;
      border: 1px solid #ffffff;
      margin-right: 11px;
    }

    .name {
      color: #ffffff;
      font-size: 16px;
    }

    .update-btn {
      height: 16px;
      font-size: 12px;
      color: #666666;
    }
  }

  /deep/ .van-grid-item__content {
    background-color: unset;
  }

  // 数据信息
  .data-info {
    .data-info-item {
      height: 65px;
      color: #ffffff;

      .text-warp {
        text-align: center;

        .count {
          font-size: 18px;
        }

        .text {
          font-size: 11px;
        }
      }
    }
  }
}

// 未登录
.not-login {
  background: url('./image/banner.png') no-repeat;
  background-size: cover;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .mobile {
    width: 66px;
  }

  .text {
    font-size: 14px;
    color: #ffffff;
  }
}

// 关注历史
.nav-grid {
  /deep/ .nav-grid-item {
    height: 70px;

    .van-icon {
      font-size: 22px;
    }

    .van-icon-star-o {
      color: #eb5253;
    }

    .van-icon-underway-o {
      color: #ff9d1d;
    }

    .van-grid-item__text {
      font-size: 14px;
      color: #333;
    }
  }
}

// 退出登录
.quit-login {
  .van-button__text {
    color: #d86262;
    font-size: 15px;
  }
}

//下边距
.mb-5 {
  margin-bottom: 5px;
}
</style>
