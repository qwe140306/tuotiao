<template>
  <div class="edit-gender">
    <van-picker
      :columns="columns"
      :default-index="defaultIndex"
      show-toolbar
      title="性别"
      @cancel="$emit('close')"
      @change="onchange"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
export default {
  name: 'EditGender',
  components: {},
  props: {
    gender: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.gender
    }
  },
  computed: {},
  watch: {},
  methods: {

    async onConfirm () {
      if (this.defaultIndex === this.gender) {
        this.$toast.success('保存成功！')
        this.$emit('close')
        return
      }
      console.log(123)
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
            gender: this.defaultIndex
          }
        })
        // 更新用户名
        this.$toast.success('保存成功！')

        // 关闭弹出层
        this.$emit('update:gender', this.defaultIndex)
        this.$emit('close')

      } catch (e) {
        this.$toast({
          message: '更新失败，未知错误' + e,
          position: 'top'
        })
      }
    },
    onchange (vc, value, index) {
      this.defaultIndex = index
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>


</style>
