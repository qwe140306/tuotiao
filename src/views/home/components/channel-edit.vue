<template>
  <div class="channel-edit">
    <!--    我的频道-->
    <van-cell :border="false" center>
      <template slot="title" class="channel-title">我的频道</template>
      <van-button
        class="edit-btn"
        plain
        round
        size="mini"
        type="danger"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <!--    频道列表-->
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(userChannel, index) in channels"
        :key="userChannel.id"
        :class="{ active: active === index }"
        :icon="isEdit && index !== 0 ? 'close' : ''"
        :text="userChannel.name"
        class="grid-item"
        @click="onUserChannelClick(userChannel,index)"
      />
    </van-grid>
    <!--    频道推荐-->
    <van-cell :border="false" center>
      <template slot="title">频道推荐</template>
    </van-cell>
    <!--    频道列表-->
    <van-grid :gutter="10">
      <van-grid-item
        v-for="channel in recommendChannel"
        :key="channel.id"
        :text="channel.name"
        class="grid-item"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    channels: {
      required: true,
      type: Array
    },
    active: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      allChannelsList: [],
      // 是否处于编辑状态
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannel () {
      // 过滤数组
      return this.allChannelsList.filter(channel => {
        // 返回没有列表数组
        return !this.channels.find(userChannel => {
          // 返回我的频道中没有的列表
          return userChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  methods: {
    async getAllChannelsList () {
      const { data } = await this.$axios.get(`/app/v1_0/channels`)
      this.allChannelsList = data.data.channels
    },
    // 点击添加频道
    async onAdd (channel) {
      this.channels.push(channel)
      // 数据持久化
      if (this.user) {
        await this.$axios.patch(`/app/v1_0/user/channels`, {
          channels: [
            {
              id: channel.id,
              seq: this.channels.length
            }
          ]
        })
        // this.$toast.fail('请求出错，请稍后重试')
      } else {
        setItem('user-channel', this.channels)
      }
    },
    // 跳转或者删除频道
    onUserChannelClick (userChannel, index) {
      if (this.isEdit && index !== 0) {
        // 删除频道
        this.deleteChannel(userChannel, index)
      } else {
        //切换频道
        this.switcheChanel(index)
      }
    },
    // 删除频道
    async deleteChannel (userChannel, index) {
      // 如果删除了索引之前的频道，那么需要更新当前激活的频道
      if (index <= this.active) {
        this.$emit('updata-active', this.active - 1)
      }
      this.channels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        await this.$axios.delete(`/app/v1_0/user/channels/${userChannel.id}`,)
        // this.$toast.fail('请求出错，请稍后重试')
      } else {
        setItem('user-channel', this.channels)
      }
    },
    //切换频道
    switcheChanel (index) {
      this.$emit('updata-active', index)
      this.$emit('close')
    }
  },
  created () {
    this.getAllChannelsList()
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;

  /deep/ .van-cell__title {
    font-size: 16px;
    color: #333333;
  }

  /deep/ .van-cell__value {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .edit-btn {
      width: 52px;
    }
  }

  .grid-item {
    width: 80px;
    height: 43px;

    /deep/ .van-grid-item__content {
      background: #f4f5f6;

      .van-grid-item__text {
        font-size: 12px;
        color: #222;
        margin-top: 0;
      }
    }

    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -6px;
      top: -6px;
      font-size: 18px;
    }
  }

  .active {
    /deep/ .van-grid-item__text {
      color: #f85959 !important;
    }
  }
}
</style>
