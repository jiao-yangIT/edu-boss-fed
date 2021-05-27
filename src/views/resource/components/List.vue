<template>
  <div class="resource-list">
    <el-card class="box-card">
      <!-- 使用form组件 -->
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" class="demo-form-inline" :model="form" >
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
              <el-option v-for="item in resourceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="isloading">查询</el-button>
        </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button
            size="mini"
            @click="$router.push({
              name: 'resource-create'
            })">添加</el-button>
        <el-button
            size="mini"
            @click="handleDelete()">资源分类</el-button>
      </div>
      <!-- 使用table组件 -->
      <el-table :data="resources" stripe style="width: 100%" v-loading="isloading">
        <el-table-column label="编号" type="index" width="100">
        </el-table-column>
        <el-table-column prop="name" label="资源名称"> </el-table-column>
        <el-table-column prop="url" label="资源路径"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column label="添加时间">
          <template slot-scope="scope">
            <span> {{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 20, 30]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isloading">
      </el-pagination>
    </el-card>
  </div>
  <!-- 添加dialog -->
</template>

<script>
import { getResourcePages, getResourceCategories, deleteResource } from "@/services/resource";

export default {
  name: "ResourceList",
  data () {
    return {
      // 用于存储资源列表数据
      resources: [],
      form: {
        // 当前页号
        current: 1,
        // 每页显示数据条数
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      },
      totalCount: 0,
      // 存储资源分类信息
      resourceCategories: [],
      isloading: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    async loadResources () {
      this.isloading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === "000000") {
        this.resources = data.data.records
        this.totalCount = data.data.total
        this.isloading = false
      }
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    handleEdit (roWData) {
      this.$router.push({
        name: 'resource-edit',
        params: {
          resourceId: roWData.id
        }
      })
    },
    handleDelete (roWData) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteResource(roWData.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadResources()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    }
  },
  filters: {
    // 时间过滤器
    dateFormat (date) {
      date = new Date(date);
      return `
        ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}
        ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}
     `
    }
  }
}
</script>
