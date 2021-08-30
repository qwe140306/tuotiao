<template>
  <div class="edit-birthday">
    <van-datetime-picker
      v-model="currentDate"
      :max-date="maxDate"
      :min-date="minDate"
      title="选择年月日"
      type="date"
      visible-item-count="5"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>

export default {
  name: 'EditName',
  components: {},
  props: {
    birthday: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      minDate: new Date(1970, 1, 1),
      maxDate: new Date(2030, 1, 1),
      currentDate: new Date(this.birthday),
    }
  },
  computed: {},
  watch: {},
  methods: {

    async onConfirm () {
      // 处理选中时间
      const date = this.dayjs(this.currentDate).format('YYYY-MM-DD')
      if (date === this.birthday) {
        this.$toast.success('保存成功！')
        this.$emit('close')
        return
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
            birthday: date
          }
        })
        // 更新用户名
        this.$toast.success('保存成功！')
        // 关闭弹出层
        this.$emit('update:birthday', date)
        this.$emit('close')

      } catch (e) {
        this.$toast({
          message: '更新失败，未知错误' + e,
          position: 'top'
        })
      }
    },

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
