<template>
  <div class="course-list">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>数据筛选</span>
        </div>
        <div>
           <el-form ref="form" :inline="true" :model="filterParams" class="demo-form-inline">
                <el-form-item label="课件名称" prop="courseName">
                    <el-input v-model="filterParams.courseName" placeholder="课件名称"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="filterParams.status" placeholder="状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="上架" value="1"></el-option>
                    <el-option label="下架" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="danger" @click="onReset">重置</el-button>
                    <el-button type="primary" @click="onQuery">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
    <el-card>
      <div slot="header">
        <span>查询结果</span>
        <el-button style="float:right;margin-top:-10px"
          @click="$router.push({
              name: 'course-create'
          })"
        >新增课程</el-button>
      </div>
      <el-table :data="courses">
          <el-table-column
          prop="id"
          label="ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="230">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
            >编辑</el-button>
            <el-button
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading"
        :current-page="filterParams.currentPage"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getQueryCourse, changeState } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      courses: [],
      totalCount: 0,
      isLoading: false
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourse(this.filterParams)
      if (data.code === '000000') {
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        this.courses = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    onQuery () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    onReset () {
      this.$refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 上下架切换
    async onStateChange (course) {
      // 点击开关，开启禁用状态
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 1 ? '上架' : '下架'}成功`)
        course.isStatusLoading = false
      }
    },
    handleCurrentChange (page) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },
  }
}
</script>

<style lang="scss" scoped></style>
