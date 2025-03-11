<template>
    <div class="body">
      <!-- <img class="bg" src="../assets/bg.png" alt=""> -->
      <div class="form">
        <h2>后台管理系统</h2>
        <el-input v-model="username" placeholder="请输入账号"></el-input>
        <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
        <el-button @click="submit">登录</el-button>
      </div>
    </div>
</template>


<script>
import dayjs from "dayjs";
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async submit () {
      const { username, password } = this
      if (username === '' || password === '') {
        this.$message.warning('账号或密码不能为空')
        return
      }
      const params = {
        username,
        password
      }

      const result = await this.$http.post('/admin/login', params)
      const { data } = result
      if (typeof data === 'object') {
        localStorage.setItem('userInfo', JSON.stringify(data))// 存储用户信息
        this.$message.success('登录成功')
        this.$router.push('/home')
      } else {
        this.password = ''
        this.$message.error('账号或密码错误')
       
      }
      console.log(result)
    }
  }
}
</script>

<style lang="less" scoped>
.body {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: url('../assets/bg.png') no-repeat center/cover;
  .bg {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 10;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    position: absolute;
    z-index: 11;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(214, 237, 248, 0.8);
    border-radius: 20px;
    padding: 20px 40px;

    h2 {
      margin-bottom: 20px;
    }
    .el-input {
      width: 300px;
      margin-bottom: 10px;
    }
    .el-button {
      width: 100px;
      margin-top: 13px;
      background-color:rgb(159, 207, 244);
    }
  }
}

</style>
