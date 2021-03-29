<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="index"
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="operationDescription" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="iconName" label="图标" align="center" width="100">
<!--        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>-->
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
<!--      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="operationUrl" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
<!--      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
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

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" v-if="title == '添加菜单'">
              <el-select v-model="menuOptionsvalue" placeholder="请选择" @change="menuOptionsChang">
                <el-option
                  v-for="(item,index) in menuOptions"
                  :key="index"
                  :label="item.menuName"
                  :value="item.menuId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
<!--                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />-->
                  <i slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="组件路径" prop="component">-->
<!--              <el-input v-model="form.component" placeholder="请输入组件路径" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import menu from '@/store/modules/menu'
import { mapState } from "vuex";
import { dataToFlatten, transfer } from '@/utils/treeConversion'
import Cookies from '_js-cookie@2.2.1@js-cookie'
import { getRouters } from '@/api/menu'

export default {
  name: "Menu",
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ]
      },
      menuOptionsvalue:'',
      parentId:0
    };
  },
  /*computed: {
    ...mapState({
      accessRoutes: state => state.accessRoutes,
    }),
  },
  watch:{
    accessRoutes(data){
      console.log('data',data)
    }
  },*/
  created() {
    /*this.menuList = menu.state.accessRoutes
    console.log('menuList',this.menuList)
    let that = this
    setTimeout(function(){
      that.loading = false
    },1000)*/
    this.getList();
    /*this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });*/
    this.getmenu()
  },
  methods: {
    getmenu(){
      let that = this
      getRouters().then(res => {
        let resData = JSON.parse(JSON.stringify(res.data))
        let arr = dataToFlatten(resData)
        let data = transfer(arr)
        that.$store.state.permission.sidebarRouters=data
      })
    },
    // 选择图标
    selected(name) {
      console.log(name)
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      let menuName = ''
      if(this.queryParams.menuName){
        menuName= this.queryParams.menuName
      }
      let data = {
        menuName: menuName
      }
      listMenu(data).then(response => {
        /*let arr = dataToFlatten(response.data)
        let data = transfer(arr)*/
        this.menuList = this.handleTree(response.data, "menuId");
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      this.menuOptions = [];
      const menu = { menuId: 0, menuName: '主类目'};
      // menu.children = this.handleTree(response.data, "menuId");
      this.menuOptions.push(menu);
      for(let i = 0;i<this.menuList.length;i++){
        if(this.menuList[i].parentOperationId==''){
          this.menuOptions.push({
            menuId: this.menuList[i].id, menuName: this.menuList[i].operationDescription
          });
        }
      }
    },
    // 显示状态字典翻译
    visibleFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        sort: undefined,
        name:undefined,
        path:'',
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 选择父id*/
    menuOptionsChang(val){
      this.parentId = val
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.getTreeselect();
      this.form.name = row.operationDescription
      this.open = true;
      this.title = "添加菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      this.reset();
      this.open = true;
      this.title = "修改菜单";
      let name = '',iconName=''
      if(row.parentOperationId==''){
        name = '主类目'
      }else{
        name = row.operationDescription
      }
      if(row.iconName){
        iconName = row.iconName
      }
      this.form = {
        menuId: row.id,
        parentId: row.parentOperationId,
        menuName: row.operationDescription,
        icon: iconName,
        sort: row.sort,
        name:name,
        path:row.operationUrl,
      }
      console.log(this.form)
      /*getMenu(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改菜单";
      });*/
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            let data = {
              menuId: this.form.menuId,
              iconName: this.form.icon,
              sort: this.form.sort,
              url: this.form.path,
              menuName: this.form.menuName,
              parentId: this.form.parentId,
            }
            updateMenu(data,'change').then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.getmenu()
            });
          } else {
            let data = {
              iconName: this.form.icon,
              sort: this.form.sort,
              url: this.form.path,
              menuName: this.form.menuName,
              parentId: this.parentId,
            }
            addMenu(data,'change').then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.getmenu()
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.$confirm('是否确认删除名称为"' + row.operationDescription + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          let isParentMenu = 1
          if(row.parentOperationId){
            isParentMenu = 0
          }
          let data = {
            menuId: row.id,
            isParentMenu: isParentMenu
          }
          delMenu(data,'change').then(response => {
            this.msgSuccess("删除成功");
            this.open = false;
            this.getList();
          });
        })
    }
  }
};
</script>
