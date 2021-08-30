<template>
  <div class="home-container">
    <!-- 顶部 -->
    <van-nav-bar class="app-nav-bar">
      <template slot="left" class="topbar-left">
        <img alt="logo" class="logo" src="./images/logo.4653c8be.png"/>
      </template>
      <template slot="right">
        <van-button
          block
          class="search-btn"
          icon="search"
          round
          size="small"
          type="info"
          to="/search"
        >搜索
        </van-button
        >
      </template>
    </van-nav-bar>
    <!-- 文章列表导航 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
        class="channel-item"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="wap-nav-wrap"
        @click="isChannelEditShow = true"
      >
        <van-icon name="wap-nav"/>
      </div>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      class="channel-edit-popup"
      close-icon-position="top-left"
      closeable
      get-container="body"
      position="bottom"
      round
    >
      <channel-edit :active='active' :channels="channels" @close="isChannelEditShow = false"
                    @updata-active="active = $event"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/article_List'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      // 导航频道列表
      channels: [],
      // 控制编辑频道列表的弹出层是否显示
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  methods: {
    async getChannelsList () {
      let channels = []
      if (this.user) {
        // 登录了
        const { data } = await this.$axios.get(`/app/v1_0/user/channels`)
        channels = data.data.channels
      } else {
        // 未登录 , 是否有本地存储数据
        const localChannels = getItem('user-channel')
        if (localChannels) {
          // 有本地存储
          channels = localChannels
        } else {
          // 没有本地存储列表 ，请求获取列表
          const { data } = await this.$axios.get(`/app/v1_0/user/channels`)
          channels = data.data.channels
        }
      }
      this.channels = channels
    },
  },
  created () {
    // 获取导航列表数据
    this.getChannelsList()
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.app-nav-bar {
  .logo {
    height: 35px;
    border-radius: 50%;
  }

  .search-btn {
    width: 173px;
    height: 30px;
    background-color: #5babfb;
    border: none;
  }
}

.channel-tabs {
  /deep/ .van-tab {
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
  }

  /deep/ .van-tabs__line {
    width: 15px;
    height: 3px;
    background-color: #3296fa;
    margin-bottom: 4px;
  }
}

.channel-edit-popup {
  height: 100%;
}

/deep/ .van-popup__close-icon--top-left {
  color: #222222;
}

.wap-nav-wrap {
  position: fixed;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 43px;
  width: 38px;
  background: #ffffff;
  opacity: 0.9;

  &:before {
    content: '';
    width: 1px;
    height: 44px;
    background-image: url("./images/line.png");
    background-size: contain;
    position: absolute;
    left: 0;
    top: 0;
    opacity: .4;
  }
}

.placeholder {
  flex-shrink: 0;
  width: 29px;
  height: 44px;
  background-color: #ffffff;
}

/deep/ .van-hairline--bottom::after {
  border-bottom: none;
}
</style>
