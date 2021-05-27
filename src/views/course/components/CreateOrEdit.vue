<template>
  <div class="create-or-edit">
    <el-card>
      <el-steps
        :active="activeStep"
        finish-status="success"
        simple
        style="margin-top: 20px"
      >
        <el-step
          v-for="(item, i) in steps"
          :key="item.id"
          :title="item.title"
          @click.native="activeStep = i"
        ></el-step>
      </el-steps>
    </el-card>
    <el-card>
      <el-form label-width="80px">
        <!-- 基本信息 -->
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              v-model="course.previewFirstField"
              placeholder="概述1"
              style="width: 49%; min-width: 300px; margin-right: 15px"
            >
              <template slot="append"
                >{{ course.previewFirstField.length }}/20</template
              >
            </el-input>
            <el-input
              v-model="course.previewSecondField"
              placeholder="概述2"
              style="width: 49%; min-width: 300px"
            >
              <template slot="append"
              >{{ course.previewSecondField.length }}/20</template
            >
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="course.sortNum"
              label="描述文字"
              controls-position="right"
              :min=0
            ></el-input-number>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="activeStep === 1">
          <!-- 封装为图片上传组件 -->
          <course-image
            v-model="course.courseListImg"
            label="课程封面"
            :limit="3"
          ></course-image>
          <course-image
            v-model="course.courseImgUrl"
            label="解锁封面"
          ></course-image>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input v-model="course.discounts" type="number" :min=0>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="course.price" type="number" :min=0>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="course.sales" type="number" :min=0>
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag">
              <template slot="append">{{ course.discountsTag.length }}/4</template>
            </el-input>
          </el-form-item>
        </div>
        <!-- 秒杀信息 -->
        <div v-show="activeStep === 3">
          <el-form-item label="是否开启秒杀" label-width="100px">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
            <template v-if="course.activityCourse">
              <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                v-model="course.activityCourseDTO.amount"
                type="number"
                :min="0"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input
                v-model="course.activityCourseDTO.stock"
                type="number"
                :min="0"
              >
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
            </template>
        </div>
        <!-- 课程详情 -->
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item style="text-align:center">
            <el-button
              type="primary"
              @click="handleSave"
            >保存</el-button>
          </el-form-item>
        </div>
        <!-- 下一步按钮 -->
        <el-form-item v-if="activeStep !== steps.length - 1" style="text-align:center">
          <el-button @click="activeStep++" type="primary">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './CourseImage'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import TextEditor from '@/components/TextEditor'

export default {
  name: "CreateOrEdit",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  created () {
    // 检测当前是否为编辑功能，如果是，根据 courseId 请求课程数据
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { id: 1, title: "基本信息" },
        { id: 2, title: "课程封面" },
        { id: 3, title: "销售信息" },
        { id: 4, title: "秒杀信息" },
        { id: 5, title: "课程详情" },
      ],
      imageUrl: '',
      // 添加课程信息
      course: {
        // id: 0,
        courseName: '',
        // 课程介绍
        brief: '',
        // 讲师信息
        teacherDTO: {
          teacherName: '',
          teacherHaedPicUrl: '',
          position: '',
          description: ''
        },
        previewFirstField: '',
        previewSecondField: '',
        sortNum: 0,
        // 上架状态  默认0不上架  1上架
        status: 0,
        // 课程详情内容
        courseDescriptionMarkDown: '<h3>默认</h3>',
        // 销售信息
        discounts: 0,
        price: 0,
        sales: 0,
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 解锁封面地址
        courseImgUrl: '',
        // 秒杀信息
        activityCourse: false,
        activityCourseDTO: {
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  methods: {
    // 编辑功能根据 ID 加载课程信息
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        // - 判断当前课程是否为开启秒杀的状态，如果未开启秒杀，需要初始化数据
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.course = data.data
      }
    },
    // 保存功能
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}课程成功`)
        this.$router.push({
          name: 'course'
        })
      }
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-step {
    cursor: pointer
  }
</style>
