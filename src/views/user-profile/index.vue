<template>
  <div class="user-profile">
    <!-- 顶部 -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      title="个人信息"
      @click-left="$router.back()"
    />
    <!-- 编辑资料 -->
    <input
      ref="file"
      accept="image/*"
      hidden
      type="file"
      @change="onFileChange"
    />
    <van-cell-group>
      <van-cell
        center
        class="avatar"
        is-link
        title="头像"
        @click="$refs.file.click()"
      >
        <van-image
          :src="user.photo"
          fit="cover"
          height="34"
          round
          width="34"
        />
      </van-cell>
      <van-cell
        :value="user.name"
        is-link
        title="昵称"
        @click="editNamePopup = true"
      />
      <van-cell
        :value="user.gender === 0 ? '男' : '女'"
        is-link
        title="性别"
        @click="editGenderPopup = true"
      />
      <van-cell
        :value="user.birthday"
        is-link
        title="生日"
        @click="editBirthdayPopup = true"
      />
    </van-cell-group>

    <!-- 修改昵称弹出层 -->
    <van-popup
      v-model="editNamePopup"
      :style="{ height: '100%' }"
      class="edit-name-popup"
      position="bottom"
    >
      <!-- :name="user.name" @updata-name="user.name = $event" -->
      <!--
    v-model="user.name"
      默认传递了一个 vlaue
        :value='user.name'
      默认监听  @input 事件
         @input="user.name = $event"
 -->
      <edit-name
        v-if="editNamePopup"
        :name.sync="user.name"
        @close="editNamePopup = false"
      />
    </van-popup>

    <!-- 性别 -->
    <van-popup
      v-model="editGenderPopup"
      :style="{ height: '40%' }"
      position="bottom"
    >
      <edit-gender
        v-if="editGenderPopup"
        :gender.sync="user.birthday"
        @close="editGenderPopup = false"
      />
    </van-popup>
    <!-- 生日 -->
    <van-popup
      v-model="editBirthdayPopup"
      :style="{ height: '40%' }"
      position="bottom"
    >
      <edit-birthday
        v-if="editBirthdayPopup"
        :birthday.sync="user.birthday"
        @close="editBirthdayPopup = false"
      />
    </van-popup>
    <!-- 头像 -->
    <van-popup
      v-model="editPhotoPopup"
      :style="{ height: '100%' }"
      class="edit-photo-popup"
      position="bottom"
    >
      <edit-photo
        v-if="editPhotoPopup"
        :previewImages="previewImages"
        @close="editPhotoPopup = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import EditName from './components/editName.vue'
import EditGender from './components/editGender'
import EditBirthday from './components/editBirthday.vue'
import EditPhoto from './components/editPhoto'

export default {
  name: 'UserProfile',
  components: {
    EditName,
    EditGender,
    EditBirthday,
    EditPhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 用户
      // 昵称
      editNamePopup: false,
      // 性别
      editGenderPopup: false,
      // 生日
      editBirthdayPopup: false,
      editPhotoPopup: false,
      previewImages: null
    }
  },
  computed: {},
  watch: {},
  methods: {
    async getUserInfo () {
      const { data } = await this.$axios({
        method: 'get',
        url: '/app/v1_0/user/profile'
      })
      this.user = data.data
    },

    onFileChange () {
      // 获取图片的 blod  保存 blod
      this.previewImages = window.URL.createObjectURL(this.$refs.file.files[0])
      // 选中图片，展示弹出层
      this.editPhotoPopup = true

      // 解决相同文件不触发 change 清空 file 的value
      this.$refs.file.value = ''
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.avatar {
  /deep/ .van-cell__value {
    height: 37px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.edit-name-popup {
  background: #f5f7f9;
}

.edit-photo-popup {
  background: #222222;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
