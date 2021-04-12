<template>
  <div class="app-container">
    <el-form ref="queryForm">
      <el-form-item label="旧密码">
        <el-input
          v-model="oldPassword"
          placeholder="请输入旧密码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="newPassword"
          placeholder="请输入新密码"
          clearable
          type="password"
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重复密码">
        <el-input
          v-model="repeatPassword"
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

export default {
  name: "password",
  data() {
    return {
      oldPassword:"",
      newPassword:"",
      repeatPassword:''
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
      if(this.newPassword != this.repeatPassword){
        this.msgError('两次新密码输入不一致');
        return;
      }
      let data={
        managerId: Cookies.get("RolesId"),
        newPassword: this.newPassword,
        oldPassword: this.oldPassword
      }
      password(data).then(res=>{
        if(res.code==200){
          this.msgSuccess('修改成功！')
          this.newPassword = ''
          this.oldPassword = ''
          this.repeatPassword = ''
        }
      })
    }
  }
};
</script>
