<template>
  <div class="edit-photo">
    <img :src="previewImages" ref="image" class="preview-img" />
    <!-- 底部取消 -->
    <van-nav-bar
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'EditPhoto',
  components: {},
  props: {
    previewImages: {
      require: true,
      type: String
    }
  },
  data () {
    return {
      cropper:null, // 裁剪器实例
    }
  },
  computed: {},
  watch: {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      try {
        // Content-Type	multipart/form-data
        // 如果要求 Content-Type	是 	multipart/form-data 则一定要提交 FormData 数据对象 专门用于文件上传的 ，
        // 不能提交 {} 这种对象，这是无效的
        const file = await this.getCroppedCanvas()
        const fd = new FormData()
        fd.append('photo', file)

        await this.$axios({
          method: 'PATCH',
          url: '/app/v1_0/user/photo',
          data: {
            photo: fd
          }
        })

        // 更新用户名
        this.$toast.success('保存成功！')
        // 修改页面数据
        this.$emit('update-photo', window.URL.createObjectURL(file))
        // 关闭弹出层
        this.$emit('close')
      } catch (e) {
        this.$toast({
          message: '更新失败，未知错误' + e,
          position: 'top'
        })
      }
    },
    getCroppedCanvas(){
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          resolve(blob)
        })
      })
    }

  },
  created () {
  },
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode:1,       // 查看方式
      dragMode:'move',  // 拖动模式
      aspectRatio:1,  // 纵横比 1:1 正方形
      // autoCropArea:1,  //  自动设置裁剪框大小？？？
      cropBoxMovable:false,  // 裁剪框是否可以拖动
      cropBoxResizable:false, // 裁剪框是否可以修改大小
      background:false,   // 是否显示透明背景
      movable:true,     //  图片是否可以移动
    })


  }
}
</script>

<style lang="less" scoped>
.field-warp {
  padding: 10px;
}
.preview-img{
  width: 100%;
  max-width: 100%;
}

.van-nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: unset;
}
</style>
