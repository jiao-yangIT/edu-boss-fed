<template>
  <div class="login">
    <el-form
      ref="form"
      :rules="rules"
      label-position="top"
      label-width="80px"
      :model="form"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="isLoginLoading" type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import request from "@/utils/request"
// import qs from "qs"
// {} 可改为user，不过其他不需要的就使用解构来进行选择
import { Login } from '@/services/user'
export default {
  name: "LoginIndex",
  data () {
    return {
      // 表单数据存储
      form: {
        phone: "18201288771",
        password: "111111",
      },
      // 表单校验规则
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "密码长度为6-10" },
        ],
      },
      // 保存加载状态
      isLoginLoading: false
    };
  },
  methods: {
    async onSubmit () {
      try {
        // 设置校验
        await this.$refs.form.validate()
        this.isLoginLoading = true;
        // 发送请求
        // const { data } = await request({
        // method: "POST",
        // url: "/front/user/login",
        // data: qs.stringify(this.form),
        // 原注释data
        // data: {
        //   phone: this.form.phone,
        //   password: this.form.password
        // }
        // });
        const { data } = await Login(this.form)
        this.isLoginLoading = false
        // 响应处理
        if (data.state === 1) {
          // this.$router.push({
          //   name: "home",
          // });
          this.$message.success("登录成功");
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error("登录失败");
        }
      } catch {
        console.log("未通过校验");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    width: 300px;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;

    .el-button {
      width: 100%;
    }
  }
}
</style>
