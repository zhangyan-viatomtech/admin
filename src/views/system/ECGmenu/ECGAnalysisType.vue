<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="类型名称" prop="roleName">
        <el-input
          v-model="queryParams.serviceTypeName"
          placeholder="请输入类型名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="roleKey">
        <el-date-picker
          v-model="queryParams.startTime"
          type="date"
          placeholder="选择日期"
          @keyup.enter.native="handleQuery"
          format="yyyy 年 MM 月 dd 日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="roleKey">
        <el-date-picker
          v-model="queryParams.endTime"
          type="date"
          placeholder="选择日期"
          @keyup.enter.native="handleQuery"
          format="yyyy 年 MM 月 dd 日">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="List">
      <el-table-column label="心电分析卡类型" prop="serviceTypeName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="创建时间" prop="createdAt" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="心电分析卡次数" prop="aiTimes" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="说明" prop="description" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="操作人" prop="staffName" :show-overflow-tooltip="true" width="150" />
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" class="card" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="心电分析卡类型名称" prop="serviceTypeName">
          <el-input v-if="falg" v-model="form.serviceTypeName" placeholder="请输入心电分析卡类型名称" />
          <span v-else>{{form.serviceTypeName}}</span>
        </el-form-item>
        <el-form-item label="心电分析次数" prop="aiTimes">
          <el-input v-if="falg" v-model="form.aiTimes" placeholder="请输入心电分析次数" />
          <span v-else>{{form.aiTimes}}</span>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
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
import { getServiceType,createServiceType } from "@/api/system/ecg";
import Cookies from "js-cookie";

export default {
  name: "ECGAnalysisCard",
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
      List: [],
      // 弹出层标题
      title: "",
      falg:true,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        serviceTypeName:'',
        startTime:'',
        endTime:''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serviceTypeName: [
          { required: true, message: "心电分析卡类型名称不能为空", trigger: "blur" }
        ],
        aiTimes: [
          { required: true, message: "心电分析次数不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "说明不能为空", trigger: "blur" }
        ]
      },
      pageIndex:1
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      let data={
        pageSize:10
      }
      getServiceType(data).then(
        response => {
          this.List = response.data;
          // this.total = response.total;
          this.loading = false;
        }
      );
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
        aiTimes: '',
        cdKeyType: '',
        serviceTypeName: '',
        staffId: '',
        description: '',
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageSize = 1;
      this.queryParams.pageIndex = 1;
      getServiceType(this.queryParams).then(
        response => {
          this.List = response.data;
          // this.total = response.total;
          this.loading = false;
        }
      );
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
      this.title = "添加心电分析卡类型";
      this.falg= true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改心电分析卡类型";
      this.falg= false
      this.form = {
        aiTimes: row.aiTimes,
        cdKeyType: 1,
        serviceTypeName: row.serviceTypeName,
        staffId: Cookies.get("RolesId"),
        description: row.description,
      };
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            let data = {
              "roleName": this.form.roleName,
              "roleId": this.form.roleId,
              "explain": this.form.remark
            }
            createServiceType(data).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let data = {
              aiTimes: this.form.aiTimes,
              cdKeyType: 1,
              serviceTypeName: this.form.serviceTypeName,
              staffId: Cookies.get("RolesId"),
              description: this.form.description,
            }
            createServiceType(data).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });

          }
        }
      });
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
.card .el-form-item{
  display: flex;
}
.card .el-form-item__label{
  width: 150px!important;
}
.card .el-form-item__content{
  width: calc(100% - 150px);
  margin-left: 0!important;
}
</style>
