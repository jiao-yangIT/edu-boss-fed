<template>
  <div class="course-section">
    <el-card>
      <el-button type="primary"
      style="float:right;margin-bottom:10px"
      @click="handleAddSection"
      >添加章节</el-button>
    </el-card>
    <el-card>
      <el-tree
      :data="section"
      v-loading="isLoading"
      :props="defaultProps"
      draggable
      :allow-drop="handleAllowDrop"
      @node-drop="handleNodeDrop"
      >
        <div class="inner" slot-scope="{ node, data }">
            <!-- 内容设置 -->
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button @click="handleEditSection(data)">编辑</el-button>
            <el-button type="primary" @click="handleAddLesson">添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <span v-else class="actions">
            <el-button>编辑</el-button>
            <el-button type="success"
              @click="$router.push({
                  name: 'course-video',
                  params: {
                    courseId
                  },
                  query: {
                    lessonId: data.id
                  }
                })"
            >上传视频</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
      <!-- 添加section  dialog -->
      <el-dialog
        :title="isEdit ? '编辑章节信息' : '添加章节信息'"
        :visible.sync="dialogVisibleSection">
        <create-or-edit-section
          :is-edit= "isEdit"
          :section-id= "sectionId"
          @successSection="handleSuccessSection"
          @cancelSection = "handleCancelSection"
          close-on-click-modal="false"
        ></create-or-edit-section>
      </el-dialog>
      <!-- 添加lesson  dialog -->
      <el-dialog
        :title="isEdit ? '编辑课时信息' : '添加课时信息'"
        :visible.sync="dialogVisibleLesson">
        <create-or-edit-lesson
          :is-edit= "isEdit"
          :lesson-id= "lessonId"
          close-on-click-modal="false"
        ></create-or-edit-lesson>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/section'
import CreateOrEditSection from './components/CreateOrEditSection'
import CreateOrEditLesson from './components/CreateOrEditLesson'
export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [Number, String]
    }
  },
  components: {
    CreateOrEditSection,
    CreateOrEditLesson
  },
  data () {
    return {
      section: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          // data 是章节或课时的时候，label 的属性名不同，需要检测后使用
          return data.sectionName || data.theme
        }
      },
      isLoading: false,
      dialogVisibleSection: false,
      dialogVisibleLesson: false,
      isEdit: false,
      sectionId: '',
      lessonId: ''
    }
  },
  created () {
    this.loadSectionAndLesson()
  },
  methods: {
    async loadSectionAndLesson () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.section = data.data
      }
    },
    // 节点拖拽处理函数
    handleAllowDrop (draggingNode, dropNode, type) {
      // 只能同级移动，type不能为inner --- 课时不能移动到其他章节中
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 节点拖拽完成后处理函数
    async handleNodeDrop (draggingNode, dropNode, type, ev) {
      this.isLoading = true
      try {
        // 由于有很多章节与课时，需要给每个章节与课时都进行最新的排序顺序的请求
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
        // 判断当前是章节还是课时，再给对应接口发送请求即可
          if (draggingNode.data.sectionId) {
            // 课时接口处理
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          } else {
            // 章节接口处理
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.error('数据更新失败', err)
      }
      this.isLoading = false
    },
    // 添加章节
    handleAddSection () {
      this.dialogVisibleSection = true
    },
    handleSuccessSection () {
      this.dialogVisibleSection = false
      this.loadSectionAndLesson()
    },
    handleCancelSection () {
      this.dialogVisibleSection = false
    },
    // 编辑章节
    handleEditSection (data) {
      this.dialogVisibleSection = true
      this.sectionId = data.id
      this.isEdit = true
    },
    // 添加课时
    handleAddLesson () {
      this.dialogVisibleLesson = true
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  display: flex;
  flex:1;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgb(226, 226, 226);
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
