<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          placeholder="请输入旧密码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          placeholder="请输入新密码"
          clearable
          type="password"
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重复密码" prop="repeatPassword">
        <el-input
          v-model="form.repeatPassword"
          placeholder="请输入新密码"
          clearable
          type="password"
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="submit()">提交</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { password } from '@/api/system/user'
import Cookies from "js-cookie";
import {  removeToken } from '@/utils/auth'

export default {
  name: "password",
  data() {
    return {
      form:{
        oldPassword:"",
        newPassword:"",
        repeatPassword:'',
      },
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" }
        ],
        repeatPassword: [
          { required: true, message: "重复密码不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleQuery(data){
      console.log(data)
    },
    submit(){
      this.$refs["form"].validate(valid => {
        console.log(valid)
        if(valid){
          if(this.form.newPassword != this.form.repeatPassword){
            this.msgError('两次新密码输入不一致');
            return;
          }
          let pattern = /^[a-zA-Z0-9]{6,18}$/ // 正整数的正则表达式
          let newPassword = this.form.newPassword.toString()
          if (!pattern.test(newPassword)) {
            this.msgError('新密码请输入长度6-18位的英文或数字')
            return
          }
          let repeatPassword = this.form.repeatPassword.toString()
          if (!pattern.test(repeatPassword)) {
            this.msgError('重复密码请输入长度6-18位的英文或数字')
            return
          }
          let data={
            managerId: Cookies.get("RolesId"),
            newPassword: this.form.newPassword,
            oldPassword: this.form.oldPassword
          }
          password(data).then(res=>{
            if(res.code==200){
              this.msgSuccess('修改成功！')
              this.form.newPassword = ''
              this.form.oldPassword = ''
              this.form.repeatPassword = ''
              removeToken()
              location.reload();
            }
          })
        }
      })
    }
  }
};
</script>
