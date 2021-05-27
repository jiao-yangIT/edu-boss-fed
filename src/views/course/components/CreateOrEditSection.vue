<template>
  <div class="CreateOrEditSection">
    <el-form :model="sections">
      <el-form-item label="课程名称" label-width="80px">
        <el-input disabled></el-input>
      </el-form-item>
      <el-form-item label="章节名称" prop="name" label-width="80px">
        <el-input v-model="sections.sectionName"></el-input>
      </el-form-item>
      <el-form-item label="章节描述" prop="description" label-width="80px">
        <el-input type="textarea" v-model="sections.description"></el-input>
      </el-form-item>
      <el-form-item label="章节排序" prop="orderNum" label-width="80px">
        <el-input-number v-model="sections.orderNum" controls-position="right" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel" style="float:right;margin-left:10px">取 消</el-button>
        <el-button type="primary" @click="onSubmit" style="float:right">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getBySectionId, saveOrUpdateSection } from '@/services/section'
export default {
  name: 'CreateOrEditSection',
  sections: [],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    sectionId: {
      type: [Number, String]
    }
  },
  created () {
    if (this.isEdit) {
      this.loadSection()
    }
  },
  data () {
    return {
      sections: {
        name: '',
        description: '',
        orderNum: ''
      }
    }
  },
  methods: {
    async loadSection () {
      const { data } = await getBySectionId(this.sectionId)
      if (data.code === '000000') {
        this.sections = data.data
        console.log(this.section)
      }
    },
    async onSubmit () {
      const { data } = await saveOrUpdateSection(this.sections)
      if (data.code === '000000') {
        // 关闭提示框，需要子组件向父组件传递状态
        this.$emit('successSection')
        this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
      }
    },
    onCancel () {
      this.$emit('cancelSection')
    }
  }
}
</script>

<style lang="scss" scoped></style>
