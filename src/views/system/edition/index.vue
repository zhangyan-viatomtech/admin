<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="所属项目" prop="roleName">
        <el-select v-model="queryParams.dictType" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictId"
            :label="item.dictName"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="终端类型" prop="roleKey">
        <el-select v-model="queryParams.dictType" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictId"
            :label="item.dictName"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否生效" prop="roleKey">
        <el-select v-model="queryParams.dictType" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictId"
            :label="item.dictName"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="强制升级" prop="roleKey">
        <el-select v-model="queryParams.dictType" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictId"
            :label="item.dictName"
            :value="item.dictType"
          />
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
      <el-table-column label="所属项目" prop="roleName"/>
      <el-table-column label="终端类型" prop="explain"/>
      <el-table-column label="版本号" prop="explain"/>
      <el-table-column label="下载地址" prop="explain"/>
      <el-table-column label="是否生效" prop="explain"/>
      <el-table-column label="强制升级" prop="explain"/>
      <el-table-column label="下载渠道" prop="explain"/>
      <el-table-column label="描述" prop="explain"/>
      <el-table-column label="described" prop="explain"/>
      <el-table-column label="强制升级版本号" prop="explain"/>
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
            @click="handleUpdate(scope.row)"
          >设为有效</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >设为无效</el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属项目" prop="roleName">
          <el-select v-model="form.jobGroup" placeholder="请选择">
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端类型" prop="roleName">
          <el-select v-model="form.jobGroup" placeholder="请选择">
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="form.remark" type="text" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="是否生效" prop="roleName">
          <el-select v-model="form.jobGroup" placeholder="请选择">
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="强制升级" prop="roleName">
          <el-select v-model="form.jobGroup" placeholder="请选择">
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下载渠道" prop="roleName">
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
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="described">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入described"></el-input>
        </el-form-item>
        <el-form-item label="强制升级版本号">
          <el-input v-model="form.remark" type="text" placeholder="请输入强制升级版本号"></el-input>
        </el-form-item>
        <el-form-item label="升级文件">
          <fileUpload :isShowTip = 'false' :fileType="[]" :fileSize="0"></fileUpload>
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
import { listRole,changeRoleOperation, delRole, addRole, updateRole} from "@/api/system/role";
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
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole('').then(
        response => {
          this.list = response.data;
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
        roleId: undefined,
        roleName: undefined,
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined,
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
      this.menuLoad()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改版本";
      this.form = {
        roleId: row.id,
        roleName: row.roleName,
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: row.explain
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
            updateRole(data).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
            let data1 = {
              "operations": this.getMenuAllCheckedKeys(),
              "roleId": this.form.roleId
            }
            data1 = JSON.stringify(data1)
            changeRoleOperation(data1,'change').then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.getmenu()
            });
          } else {
            let data = {
              roleName: this.form.roleName,
              explain: this.form.remark
            }
            addRole(data).then(response => {
              this.msgSuccess("新增成功");
              let data1 = {
                "operations": this.getMenuAllCheckedKeys(),
                "roleId": response.data.roleId
              }
              data1 = JSON.stringify(data1)
              changeRoleOperation(data1,'change').then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.getmenu()
              });
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
