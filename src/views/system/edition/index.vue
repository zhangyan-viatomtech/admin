<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="所属项目" prop="roleName">
        <el-select v-model="queryParams.projectId" size="small">
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="终端类型" prop="roleKey">
        <el-select v-model="queryParams.terminalType" size="small">
          <el-option value="WIndows"/>
          <el-option value="Mac"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否生效" prop="roleKey">
        <el-select v-model="queryParams.effect" size="small">
          <el-option :value="0" label="否"/>
          <el-option :value="1" label="是"/>
        </el-select>
      </el-form-item>
      <el-form-item label="强制升级" prop="roleKey">
        <el-select v-model="queryParams.forcedUpgrade" size="small">
          <el-option :value="0" label="否"/>
          <el-option :value="1" label="是"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
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
    <el-table v-loading="loading" :data="list">
      <el-table-column label="所属项目" prop="projectName"/>
      <el-table-column label="终端类型" prop="terminalType"/>
      <el-table-column label="版本号" prop="versionNumber"/>
<!--      <el-table-column label="下载地址" prop="explain"/>-->
      <el-table-column label="是否生效" prop="effect"/>
      <el-table-column label="强制升级" prop="forcedUpgrade"/>
<!--      <el-table-column label="下载渠道" prop="explain"/>-->
      <el-table-column label="描述" prop="descriptionCn"/>
      <el-table-column label="described" prop="descriptionEn"/>
      <el-table-column label="强制升级版本号" prop="forcedUpgradeVersion"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
            icon="el-icon-edit"
            v-if="scope.row.effect=='无效'"
            @click="handleEffect(scope.row)"
          >设为有效</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.effect=='有效'"
            @click="handleEffect(scope.row)"
          >设为无效</el-button>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="described">
        <el-form-item label="所属项目" prop="projectName">
          <el-select v-model="form.projectName" placeholder="请选择">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.projectName"
              :value="item.projectName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="终端类型" prop="terminalType">
          <el-select v-model="form.terminalType" size="small">
            <el-option value="WIndows"/>
            <el-option value="Mac"/>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNumber">
          <el-input v-model="form.versionNumber" type="text" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="是否生效" prop="effect">
          <el-select v-model="form.effect" size="small">
            <el-option :value="0" label="无效"/>
            <el-option :value="1" label="有效"/>
          </el-select>
        </el-form-item>
        <el-form-item label="强制升级" prop="forcedUpgrade">
          <el-select v-model="form.forcedUpgrade" size="small">
            <el-option :value="0" label="不强制"/>
            <el-option :value="1" label="强制"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.forcedUpgrade==1" label="强制升级版本号" prop="forcedUpgradeVersion">
          <el-input v-model="form.forcedUpgradeVersion" type="text" placeholder="请输入强制升级版本号"></el-input>
        </el-form-item>
<!--        <el-form-item label="下载渠道" prop="roleName">
          <el-select v-model="form.jobGroup" placeholder="请选择">
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下载地址" prop="roleName">
          <el-input v-model="form.remark" type="text" placeholder="请输入下载地址"></el-input>
        </el-form-item>-->
        <el-form-item label="描述" prop="descriptionCn">
          <el-input v-model="form.descriptionCn" type="textarea" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="described" prop="descriptionEn">
          <el-input v-model="form.descriptionEn" type="textarea" placeholder="请输入described"></el-input>
        </el-form-item>

        <el-form-item label="升级文件" v-if="title == '添加版本'" class="fileupload" prop="uploadFile">
          <span id="filename1">上传文件</span>
          <input type="file" id="fileExport1" @change="handleFileChange" ref="inputer">
          <span v-if="file.name">{{file.name}}</span>
          <span v-else>未选择</span>
        </el-form-item>
        <el-form-item v-else label="升级文件" class="fileupload">
          <span id="filename2">上传文件</span>
          <input type="file" id="fileExport2" @change="handleFileChange" ref="inputer">
          <span v-if="file.name">{{file.name}}</span>
          <span v-else>未选择</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectVersions , getProjects,changeEffect,updateProjectVersion,addProjectVersion} from "@/api/system/edition";

import fileUpload from "@/components/FileUpload"

export default {
  name: "edition",
  components: {
    fileUpload
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        descriptionCn: "",
        descriptionEn:"",
        effect: "",
        forcedUpgrade: "",
        forcedUpgradeVersion: "",
        projectId: "",
        terminalType: "",
        versionId: "",
        versionNumber: "",
        uploadFile:""
      },
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "所属项目不能为空", trigger: "blur" }
        ],
        terminalType: [
          { required: true, message: "终端类型不能为空", trigger: "blur" }
        ],
        versionNumber: [
          { required: true, message: "版本号不能为空", trigger: "blur" }
        ],
        effect: [
          { required: true, message: "是否生效不能为空", trigger: "blur" }
        ],
        forcedUpgrade: [
          { required: true, message: "强制升级不能为空", trigger: "blur" }
        ],
        forcedUpgradeVersion: [
          { required: true, message: "强制升级版本号不能为空", trigger: "blur" }
        ],
        descriptionCn: [
          { required: true, message: "描述不能为空", trigger: "blur" }
        ],
        descriptionEn: [
          { required: true, message: "described不能为空", trigger: "blur" }
        ],
        uploadFile: [
          { required: true, message: "升级文件不能为空", trigger: "blur" }
        ]
      },
      projectList:[],
      fileList:[],
      file:'',
      effect:"",
      forcedUpgrade:"",
      falg : true
    };
  },
  created() {
    getProjects('').then(res=>{
      this.projectList = res.data
    })
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      let effect = -1,pageIndex=1,pageSize=10,projectId=0,forcedUpgrade=-1,terminalType=''
      if(this.queryParams.effect==0 || this.queryParams.effect==1){
        effect = this.queryParams.effect
      }
      if(this.queryParams.pageIndex){
        pageIndex = this.queryParams.pageIndex
      }
      if(this.queryParams.pageSize){
        pageSize = this.queryParams.pageSize
      }
      if(this.queryParams.projectId){
        projectId = this.queryParams.projectId
      }
      if(this.queryParams.forcedUpgrade==0 || this.queryParams.forcedUpgrade==1){
        forcedUpgrade = this.queryParams.forcedUpgrade
      }
      if(this.queryParams.terminalType){
        terminalType = this.queryParams.terminalType
      }
      let data = {
        effect: effect,
        forcedUpgrade: forcedUpgrade,
        pageIndex: pageIndex,
        pageSize: pageSize,
        projectId: projectId,
        terminalType: terminalType
      }
      getProjectVersions(data,"change").then(
        response => {
          this.list = response.data.dataList;
          this.total = response.data.count;
          this.loading = false;
        }
      );
    },
    handleFileChange (e) {
      let inputDOM = this.$refs.inputer;
      this.file = inputDOM.files[0];// 通过DOM取文件数据
      let size = Math.floor(this.file.size / 1024);//计算文件的大小　
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.open1 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        descriptionCn: "",
        descriptionEn:"",
        effect: "",
        forcedUpgrade: "",
        forcedUpgradeVersion: "",
        projectId: "",
        terminalType: "",
        versionId: "",
        versionNumber: "",
        uploadFile:"",
        projectName:""
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改版本";
      let projectId = ""
      for (let i = 0;i<this.projectList.length;i++){
        if(row.projectName==this.projectList[i].projectName){
          this.form.projectId = this.projectList[i].projectId
        }
      }
      if(row.effect=='有效'){
        this.effect = 1
      }else{
        this.effect = 0
      }
      if(row.forcedUpgrade=='强制'){
        this.forcedUpgrade = 1
      }else{
        this.forcedUpgrade = 0
      }
      this.form = {
        projectName: row.projectName,
        id:row.versionId,
        descriptionCn: row.descriptionCn,
        descriptionEn: row.descriptionEn,
        effect: row.effect,
        forcedUpgrade: row.forcedUpgrade,
        forcedUpgradeVersion: row.forcedUpgradeVersion,
        projectId: projectId,
        terminalType: row.terminalType,
        versionId: row.versionId,
        versionNumber: row.versionNumber,
        uploadFile:row.uploadFile
      };
    },
    handleEffect(row){
      let effect = -1;
      if(row.effect=='有效'){
        effect = 0
      }else{
        effect = 1
      }
      changeEffect({effect:effect,versionId:row.versionId}).then(res=>{
        this.msgSuccess("设置成功");
        this.getList();
      })
      console.log(row)
    },
    /** 提交按钮 */
    submitForm: function() {
      let formData = new FormData();
      formData.append("uploadFile",this.file);
      this.form.uploadFile = formData
      console.log(this.$store.state.app.falg)
      if(this.$store.state.app.falg){
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$store.state.app.falg = false
            for (let i = 0;i<this.projectList.length;i++){
              if(this.form.projectName==this.projectList[i].projectName){
                this.form.projectId = this.projectList[i].id
              }
            }
            formData.append("projectId",this.form.projectId);
            formData.append("descriptionCn",this.form.descriptionCn);
            formData.append("descriptionEn",this.form.descriptionEn);
            let effect = '',forcedUpgrade=''
            if(typeof this.form.effect == 'string'){
              effect = this.effect
            }else{
              effect = this.form.effect
            }
            if(typeof this.form.forcedUpgrade == 'string'){
              forcedUpgrade = this.forcedUpgrade
            }else{
              forcedUpgrade = this.form.forcedUpgrade
            }
            formData.append("effect",effect);
            formData.append("forcedUpgrade",forcedUpgrade);
            formData.append("forcedUpgradeVersion",this.form.forcedUpgradeVersion);
            formData.append("terminalType",this.form.terminalType);
            formData.append("versionId",this.form.versionId);
            formData.append("versionNumber",this.form.versionNumber);
            if (this.form.id) {
              formData.append("id",this.form.id);
              updateProjectVersion(formData).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.$store.state.app.falg = true
              })
            } else {
              addProjectVersion(formData).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.$store.state.app.falg = true
              })
            }
          }
        });
      }

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除角色"' + row.roleName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delRole(row.id);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },

  }
};
</script>
<style>
.described .el-form-item__label{
  width: 90px!important;
}
.described .el-input{
  width:203px!important;
}
.described .el-textarea{
  width:90%!important;
}
</style>
<style scoped>
.fileupload{
  position: relative;
}
#filename1,#filename2{
  background: #1890ff;
  color: #fff;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.fileupload #fileExport1,.fileupload #fileExport2{
  position: absolute;
  width:200px;
  height:35px;
  left: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  -ms-filter: 'alpha(opacity=0)';
}
.filelist .list{
  width: 80%;
  display: flex;
  justify-content: space-between;
}
.list .icon{
  font-size: 18px;
}
</style>
