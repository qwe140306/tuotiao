<template>
  <div class="search-history">
    <!-- 标签 -->
    <van-cell title="搜索历史">

      <div v-if="isDeleteShow">
        <span @click="deleteAllHistory">全部删除</span>
        &nbsp;
        <span @click="isDeleteShow =false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isDeleteShow = true"/>
    </van-cell>
    <!-- 搜索记录 -->
    <van-cell v-for="(history,index) in searchHistories" :key="index" :title="history" @click="onDelete(index)">
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {setItem,removeItem} from '@/utils/storage'

export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      required: true,
      type: Array
    },
    getSearchHistory: Function
  },
  data () {
    return {
      isDeleteShow: false,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  watch: {},
  methods: {
    onDelete(index){
      if (!this.isDeleteShow){
        // 不是删除状态 点击跳转
        return this.$emit('search',this.searchHistories[index])
      }
      this.searchHistories.splice(index,1)
      // 数据持久化
      if (this.user){
        // 没有删除单个的接口，意思一下
        console.log('没有删除单个的接口，意思一下')
      }else {
        // 本地
        setItem('search-history', this.searchHistories )
      }

    },
    async deleteAllHistory(){
      this.$emit('deleteAllSerrch',[])
      // 删除所有
      if (this.user){
        // 删除服务器
        await this.$axios.delete(`/app/v1_0/search/histories`)
      }else {
        // 删除本地
        removeItem('search-history')
      }
    }
  },
  created () {
    if (this.user) {
      this.getSearchHistory()
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped></style>
