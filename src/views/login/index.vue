<template>
  <div class="login-container">
    <!-- 顶部 -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      title="登录/注册"
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <van-form
      ref="loginForm"
      :show-error="false"
      :show-error-message="false"
      validate-first
      @failed="onFailed"
      @submit="onLogin"
    >
      <!--
          vant表单验证
            1.使用 van-form 包裹所有要验证的 表单项 van-field
            2. van-form 绑定 onsubmit 事件
              只有表单验证通过才会触发 submit
       -->
      <van-field
        v-model="user.mobile"
        :rules="formRules.mobile"
        icon-prefix="iconfont icon"
        left-icon="shouji"
        name="mobile"
        placeholder="请输入手机号码"
      />
      <van-field
        v-model="user.code"
        :rules="formRules.code"
        clearable
        icon-prefix="iconfont icon"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
      >
        <template #button>
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownsh"
            @finish="isCountDownsh = false"
          />
          <van-button
            block
            class="send-btn"
            round
            size="mini"
            @click.prevent="onSendSms"
            v-else
            :loading="isSendSmsLoading"
            >获取验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block class="login-btn" type="info">登录</van-button>
      </div>
    </van-form>
    <!--登录按钮 -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "13911111111", //手机号
        code: "246810" // 验证码
      },
      // 规则
      formRules: {
        mobile: [
          {
            required: true,
            message: "请输入手机号"
          },
          {
            pattern: /^1[3|56789]\d{9}$/,
            message: "手机号格式错误"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码"
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误"
          }
        ]
      },
      // 控制倒计时和发送按钮的显示
      isCountDownsh: false,
      // 点击发送验证码按钮出现loading 加载中 并禁止点击
      isSendSmsLoading: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 登录函数
    async onLogin() {
      this.$toast.loading({
        message: "登陆中",
        // 禁止点击
        forbidClick: true,
        // 持续时间 ms  值为 0  这个不会消失 直到一个新的提示出现
        duration: 0
      });
      try {
        const { data } = await axios.post(
          "/app/v1_0/authorizations",
          this.user
        );
        console.log(data);
        this.$toast.success("登录成功");
        // 将后端返回的 token 放入 Vuex 容器中
        this.$store.commit("setUser", data.data);
        // 清除 layout 的缓存
        this.$store.commit("removeCachePages", 'Layout');
        // 登录成功 跳转回原来页面
        // this.$router.back()
        // 如果有 this.$route.query.redirect 就向后跳转  如果没有直接跳转首页
        this.$router.replace(this.$route.query.redirect || '/')


      } catch (err) {
        console.log(err);
        this.$toast.fail("登录失败,请稍后重试");

      }
    },
    // 表单验证提示函数
    onFailed(err) {
      if (err.errors[0]) {
        this.$toast({
          message: err.errors[0].message,
          position: "top"
        });
      }
    },
    // 请求验证码
    async onSendSms() {
      // 点击按钮 展示加载中 防止多次点击 多次发送行为
      this.isSendSmsLoading = true;
      // 校验手机号 发送验证码
      try {
        await this.$refs.loginForm.validate("mobile");
        // 验证通过
        // 隐藏按钮 发送验证码
        this.isCountDownsh = true;

        await this.$axios.get(`/app/v1_0/sms/codes/${this.user.mobile}`);
      } catch (err) {
        // 验证失败 提示用户
        let message;
        if (err && err.response && err.response.status === 429) {
          message = "验证码发送频繁，请稍后重试！";
        } else if (err.name === "mobile") {
          message = err.message;
        } else {
          message = "发送失败，请稍后重试！";
        }
        // 提示用户
        this.$toast({
          message,
          position: "top"
        });
      }
      // 无论发送成功还是失败 关闭加载中状态
      this.isSendSmsLoading = false;
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.van-form {
  margin-top: 15px;
}

// 获取验证码按钮
.send-btn {
  width: 76px;
  height: 23px;
  background-color: #ededed;

  .van-button__text {
    font-size: 11px;
    color: #666;
  }
}

// 登录按钮
.login-btn-wrap {
  padding: 26px 16px;

  .login-btn {
    background-color: #6db4fb;
    border: none;
    border-radius: 5px;

    .van-button__text {
      font-size: 15px;
    }
  }
}
</style>
