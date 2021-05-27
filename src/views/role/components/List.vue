<template>
    <div class="role-list">
      <el-card class="box-card">
        <!-- 使用form组件 -->
        <div slot="header" class="clearfix">
          <el-form ref="form" :inline="true" class="demo-form-inline" :model="form" >
            <el-form-item label="输入搜索" prop="name">
              <el-input v-model="form.name" placeholder="角色名称" clearable></el-input>
            </el-form-item>
          <el-form-item>
              <el-button @click="onReset">重置</el-button>
              <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
          </el-form-item>
          </el-form>
        </div>
        <el-button @click="handleAdd">添加角色</el-button>
        <el-table :data="roles" stripe style="width: 100%" v-loading="isLoading">
          <el-table-column label="编号" type="index" width="100">
          </el-table-column>
          <el-table-column prop="name" label="角色名称"> </el-table-column>
          <el-table-column prop="description" label="描述"> </el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">
              <span> {{ scope.row.createdTime | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
                  >分配菜单</el-button>
                <el-button
                  size="mini"
                  @click="$router.push({
                  name: 'alloc-resource',
                  params: {
                    roleId: scope.row.id
                  }
                })"
                  >分配资源</el-button>
                </div>
                <div style="margin-top:10px">
                  <el-button size="mini" @click="handleEdit(scope.row)"
                    >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)"
                    >删除</el-button>
                </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件结构 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.current"
            :page-sizes="[10, 15, 20]"
            :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            :disabled="isLoading"
          >
          </el-pagination>
        <!-- 添加角色 -->
        <el-dialog
          :title="isEdit ? '编辑角色' : '添加角色'"
          :visible.sync="dialogVisible">
          <create-or-edit
            :is-edit= "isEdit"
            :role-id= "roleId"
            @success="handleSuccess"
            @cancel="handleCancel"
            close-on-click-modal="false"
          ></create-or-edit>
        </el-dialog>
      </el-card>
    </div>
</template>
<script>
import CreateOrEdit from './Create0rEdit'
import { getRoles, deleteRole } from '@/services/role'
export default {
  name: "RoleList",
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: '',
        current: 1,
        size: 10,
      },
      isloading: false,
      roles: [],
      dialogVisible: false,
      isEdit: false,
      roleId: '',
      totalCount: 0,
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    onSubmit () {
      this.loadRoles()
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    async handleEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    },
    handleDelete (role) {
      this.$confirm(`确定删除角色: ${role.name}?`, '删除提示')
        .then(async () => {
          await deleteRole(role.id)
          this.$message.success('删除成功')
          this.loadRoles()
        }).catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$$message.error('取消删除')
          }
        })
    },
    handleSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    },
    handleCancel () {
      this.dialogVisible = false
    },
    async loadRoles () {
      this.isLoading = true;
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页显示的条数，应当将页数还原为默认值 1
      this.form.current = 1
      this.loadRoles()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadRoles()
    },
  },
  filters: {
    dateFormat (date) {
      date = new Date(date)
      // .toString().padStart(2, '0')对单数前面补0
      return `
        ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} 
        ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}
      `
    }
  }
};
</script>
<style lang="scss" scoped></style>
