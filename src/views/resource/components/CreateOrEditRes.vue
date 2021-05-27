<template>
  <div class="create-or-edit">
    <el-form :model="resource" ref="resource"  label-width="80px">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="resource.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="resource.url"></el-input>
      </el-form-item>
      <el-form-item label="资源分类" prop="categoryId">
        <el-select v-model="categoryId" placeholder="请选择">
          <el-option
            v-for="item in resourceCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="resource.description"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getResourceById, getResourceCategories, saveOrUpdateResources } from '@/services/resource'
export default {
  name: "CreateOrEdit",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      resource: {
        name: '',
        url: '',
        categoryId: ''
      },
      categoryId: "",
      resourceCategories: [],
    }
  },
  created () {
    this.loadResource()
    this.loadResourceCategories()
  },
  methods: {
    async loadResource () {
      const resourceId = this.$route.params.resourceId || -1
      const { data } = await getResourceById(resourceId)
      this.resource = data.data
      console.log(this.resource)
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    async onSubmit () {
      const { data } = await saveOrUpdateResources(this.resource)
      console.log(data)
    },
    onCancel () {
    }
  }
};
</script>

<style lang="scss"></style>
