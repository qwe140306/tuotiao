<template>
  <div class="edit-name">
    <van-nav-bar
      left-arrow
      left-text="取消"
      right-text="完成"
      title="编辑昵称"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="field-warp">
      <van-field
        v-model="message"
        autosize
        maxlength="7"
        placeholder="请输入昵称"
        rows="2"
        show-word-limit
        type="textarea"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditName',
  components: {},
  props: {
    name: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      message: this.name
    }
  },
  computed: {},
  watch: {},
  methods: {

    async onConfirm () {

      if (this.message === this.name) {
        return this.$toast({
          message: '当前名称一致，请重新输入',
          position: 'top'
        })
      }
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      try {
        await this.$axios({
          method: 'PATCH',
          url: '/app/v1_0/user/profile',
          data: {
            name: this.message
          }
        })
        // 更新用户名
        this.$toast.success('保存成功！')

        // 关闭弹出层
        this.$emit('update:name', this.message)
        this.$emit('close')

      } catch (e) {
        if (e && e.response && e.response.status === 409) {
          return this.$toast.fail({
            message: '用户名重复',
          })
        }
        this.$toast({
          message: '更新失败，未知错误',
          position: 'top'
        })
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
.field-warp {
  padding: 10px;
}

</style>
