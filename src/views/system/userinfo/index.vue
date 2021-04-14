<template>
  <div class="app-container">
    <!--用户数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="appellation">
        <el-input
          v-model="queryParams.appellation"
          placeholder="请输入名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色类型">
        <el-select v-model="queryParams.roleId" placeholder="请选择角色类型" clearable size="small">
          <el-option
            v-for="dict in rolelist"
            :key="dict.id"
            :label="dict.roleName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column label="名称" align="center" key="appellation" prop="appellation"/>
      <el-table-column label="用户名" align="center" key="name" prop="name" />
      <el-table-column label="角色" align="center" key="roles" prop="roles"/>
      <el-table-column label="说明" align="center" key="explicate" prop="explicate" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="appellation">
          <el-input v-model="form.appellation" placeholder="请输入名称" maxlength="18" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="title == '添加用户'">
          <el-input
            v-model="form.password"
            :type="flags?'password':'text'"
            auto-complete="off"
            placeholder="请输入密码"
          >
            <svg-icon slot="suffix" :icon-class="!flags?'eye-open':'eye'" class="el-input__icon input-icon" @click="flags=!flags"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="roleIdsNamearr" multiple @change="selectChang" placeholder="请选择角色类型" clearable size="small">
            <el-option
              v-for="dict in rolelist"
              :key="dict.id"
              :label="dict.roleName"
              :value="dict.roleName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.explicate" type="textarea" placeholder="请输入说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除后台用户" :visible.sync="deleteOpen" width="300px" append-to-body class="deleted">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称:">
          {{form.appellation}}
        </el-form-item>
        <el-form-item label="用户名:">
          {{form.name}}
        </el-form-item>
        <el-form-item label="角色:">
          {{roleIdsname}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDelete">确 定</el-button>
        <el-button @click="cancelDelete">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { listRole } from '@/api/system/role'
import {register,checkNameExist,updateManager,deleteManager} from "@/api/login"
import Cookies from 'js-cookie'
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
export default {
  name: "User",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: { },
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        appellation: '',
        name: '',
        roleId: '',
      },
      rolelist:[],
      // 表单校验
      rules: {
        appellation: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        roleIds: [
          { required: true, message: "角色不能为空", trigger: "blur" }
        ],
      },
      flags:false,
      deleteOpen:false,
      roleIdsname:'',
      managerId:'',
      roleIdsNamearr:[]
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList()
    this.getrolelist()
  },
  methods: {
    selectChang(data){
      /*for(let i=0;i<this.rolelist.length;i++){
        if(this.rolelist[i].roleName==data && this.form.roleIds.indexOf(this.rolelist[i].id) !=-1){
          this.form.roleIds.push(this.rolelist[i].id)
        }else{
          this.form.roleIds.remove(this.rolelist[i].id)
        }
      }*/
      // console.log(data)
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      let roleId = 0,pageIndex=1,pageSize=10
      if(this.queryParams.roleId){
        roleId = this.queryParams.roleId
      }
      if(this.queryParams.pageIndex){
        pageIndex = this.queryParams.pageIndex
      }
      if(this.queryParams.pageSize){
        pageSize = this.queryParams.pageSize
      }
      let data = {
        "appellation": this.queryParams.appellation,
        "name": this.queryParams.name,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "roleId": roleId,
      }
      getUser(data,'change').then(response => {
          this.userList = response.data.dataList;
          this.total = response.data.count;
          this.loading = false;
        }
      );
    },
    getrolelist(){
      listRole('').then(
        response => {
          this.rolelist = response.data;
        }
      );
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.userId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelDelete(){
      this.deleteOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        appellation: "",
        explicate: "",
        gender: 1,
        id: '',
        isAgent: 1,
        isStaff: 0,
        managerRole: "",
        name: "",
        password: "",
        phone: "",
        roleIds: ""
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
      /*getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });*/
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row.roleIds)
      this.reset();
      this.open = true;
      this.title = "修改用户";
      this.form.appellation = row.appellation;
      this.form.explicate = row.explicate;
      this.form.name = row.name;
      this.form.password = row.password;
      this.form.id = row.id;
      this.form.roleIds = row.roleIds.split(',')
      this.roleIdsNamearr = row.roles.split(',')
      /*const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });*/
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        resetUserPwd(row.userId, value).then(response => {
          this.msgSuccess("修改成功，新密码是：" + value);
        });
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let pattern = /^[a-zA-Z0-9]{6,18}$/ // 正整数的正则表达式
          let name = this.form.name.toString()
          if (!pattern.test(name)) {
            this.msgError('用户名请输入长度6-18位的英文或数字')
            return
          }
          if (this.form.id != '') {
            let roleIds = []
            for(let i=0;i<this.rolelist.length;i++){
              console.log(this.roleIdsNamearr.indexOf(this.rolelist[i].roleName))
              if(this.roleIdsNamearr.indexOf(this.rolelist[i].roleName) !=-1){
                roleIds.push(this.rolelist[i].id)
              }
            }
            let data = {
              id:this.form.id,
              appellation:  this.form.appellation,
              explicate: this.form.explicate,
              name: this.form.name,
              password: this.form.password,
              roleIds: roleIds.toString()
            }
            checkNameExist({name:this.form.name}).then(res=>{
              if(res.code == 200){
                updateManager(data,'change').then(response => {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              }else{
                this.msgError(res.msg)
              }
            })
          } else {
            let password = this.form.password
            if (!pattern.test(password)) {
              this.msgError('密码请输入长度6-18位的英文或数字')
              return
            }
            let data = {
              appellation:  this.form.appellation,
              explicate: this.form.explicate,
              name: this.form.name,
              password: this.form.password,
              roleIds: Cookies.get("RolesId")
            }
            checkNameExist({name:this.form.name}).then(res=>{
              if(res.code == 200){
                register(data,'change').then(response => {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
              }else{
                this.msgError(res.msg)
              }
            })
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.deleteOpen = true
      this.form.appellation = row.appellation
      this.form.name = row.name
      this.managerId = row.id
      this.roleIdsname = row.roles
    },
    submitDelete(){
      deleteManager({managerId:this.managerId}).then(res=>{
        this.deleteOpen = false
        this.msgSuccess("删除成功");
        this.getList();
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportUser(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style>
.deleted .el-form-item{
  margin-bottom: 0px;
}
.deleted .el-form-item__label{
  text-align: left;
  padding-left: 30px;
}
</style>
