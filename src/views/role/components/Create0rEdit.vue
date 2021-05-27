<template>
  <div class="create-or-edit">
    <el-form :model="role">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createOrUpdate, getRolesById } from '@/services/role'
export default {
  name: "CreateOrEdit",
  role: [],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  data () {
    return {
      role: {
        name: "",
        code: "",
        description: ''
      }
    }
  },
  methods: {
    async loadRole () {
      const { data } = await getRolesById(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    },
    onCancel () {
      this.role = {}
      this.$emit('cancel')
    },
    async onSubmit () {
      const { data } = await createOrUpdate(this.role)
      if (data.code === '000000') {
        // 关闭提示框，需要子组件向父组件传递状态
        this.$emit('success')
        this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
      }
    }
  },
  watch: {
    roleId () {
      this.loadRole()
    },
    isEdit () {
      if (!this.isEdit) {
        this.role = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
