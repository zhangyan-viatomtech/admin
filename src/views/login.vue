<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">若依后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" @focus="focus_chang" @blur="blur_chang" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="flag?'password':'text'"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          <i slot="suffix" class="el-icon-view" :style="{'color':flag ? '#c0c4cc':'#409EFF'}" style="margin-top:8px;font-size:18px;" autocomplete="auto" @click="flag=!flag" />
        </el-input>
      </el-form-item>
      <!--      <el-form-item prop="code">-->
      <!--        <el-input-->
      <!--          v-model="loginForm.code"-->
      <!--          auto-complete="off"-->
      <!--          placeholder="验证码"-->
      <!--          style="width: 63%"-->
      <!--          @keyup.enter.native="handleLogin"-->
      <!--        >-->
      <!--          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />-->
      <!--        </el-input>-->
      <!--        <div class="login-code">-->
      <!--          <img :src="codeUrl" @click="getCode" class="login-code-img"/>-->
      <!--        </div>-->
      <!--      </el-form-item>-->
      <!--      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>-->
      <el-form-item>
        <div class="topbtn">
          <span v-if="registerfalg" @click="register">立即注册</span>
          <span v-else  @click="login_chang">已有账号去登录</span>
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">{{loadtext}}</span>
          <span v-else>{{loadtext}} 中...</span>
        </el-button>
      </el-form-item>
      <div class="userHistoryList" v-if="userHistoryListFalg">
        <ul>
          <li v-for="(item,index) in userHistoryList" :key="index" @click="HistoryList_chang(item)">{{item}}</li>
        </ul>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2021 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { checkPhoneExist } from "@/api/login";
import axios from 'axios'
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "7777777",
        password: "123456",
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      userHistoryList:[],
      userHistoryListFalg:false,
      flag: false,
      registerfalg:true,
      loadtext:'登 录'
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  async created() {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    register(){
      this.registerfalg=false
      this.loginForm.username = ''
      this.loginForm.password = ''
      this.loadtext = '注 册'
    },
    login_chang(){
      this.registerfalg=true
      this.loginForm.username = ''
      this.loginForm.password = ''
      this.loadtext = '登 录'
    },
    focus_chang(){
      this.userHistoryListFalg = true
    },
    blur_chang(){
      this.userHistoryListFalg = false
    },
    HistoryList_chang(name){
      this.loginForm.username = name
      this.loginForm.password = ''
    },
    // getCode() {
    //   getCodeImg().then(res => {
    //     this.codeUrl = "data:image/gif;base64," + res.img;
    //     this.loginForm.uuid = res.uuid;
    //   });
    // },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          /*checkPhoneExist(this.loginForm.username).then((res)=>{
            console.log(res)
          }).catch(() => {
            this.loading = false;
            // this.getCode();
          });*/
          if(this.registerfalg){
            this.$store.dispatch("Login", this.loginForm).then(() => {
              this.userHistoryList.push(this.loginForm.username)
              this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
            }).catch(() => {
              this.loading = false;
              // this.getCode();
            });
          }else{
            checkPhoneExist(this.loginForm.username).then((res)=>{
              console.log(res)
            }).catch(() => {
              this.loading = false;
              // this.getCode();
            })
          }

        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.login-form{
  position: relative;
}
.userHistoryList{
  position: absolute;
  top: 117px;
  left: 0;
  width: 100%;
  padding: 0 25px;
}
.userHistoryList ul{
  padding: 0;
  background: #fff;
  box-shadow: #ccc 0px 0px 6px;
  margin: 0;
  border-radius: 5px;
}
.userHistoryList li{
  list-style: none;
  padding: 10px;
}
.topbtn{
  display: flex;
  justify-content: space-between;
}
.topbtn span{
  cursor: pointer;
  text-decoration: underline;
}
</style>
