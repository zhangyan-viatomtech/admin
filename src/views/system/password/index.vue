<template>
  <div class="app-container">
    <el-form ref="queryForm">
      <el-form-item label="旧密码">
        <el-input
          v-model="password"
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

export default {
  name: "password",
  data() {
    return {
      password:"",
      newPassword:"",
      repeatPassword:''
    };
  },
  created() {

  },
  methods: {
    handleQuery(data){
      console.log(data)
    },
    submit(){

    }
  }
};
</script>
