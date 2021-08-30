<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 标签导航 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/">
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/qa">
        问答
      </van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">
        视频
      </van-tabbar-item>
      <van-tabbar-item v-if="$store.state.user" icon="manager-o" to="/my">
        我的
      </van-tabbar-item>
      <van-tabbar-item v-else icon="manager-o" to="/my">
        未登录
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  components: {},
  props: {},
  data () {
    return {
      active: 0
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created () {
  },
  mounted () {
    // 页面跳转渲染成功，添加缓存
    this.$store.commit("addCachePages", 'Layout');
  }
}
</script>

<style lang="less" scoped></style>
