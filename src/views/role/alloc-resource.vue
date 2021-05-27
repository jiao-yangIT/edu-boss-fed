<template>
  <div class="alloc-resource">
      <el-card>
        <el-tree
            ref="resource-tree"
            node-key="id"
            :data="resources"
            :default-checked-keys="checkedKeys"
            show-checkbox
            default-expand-all
            :render-content="renderContent"
            :props="defaultProps">
        </el-tree>
        <div style="margin-top:15px;text-align:center">
          <el-button @click="onReset" type="danger">重置</el-button>
          <el-button
            type="primary"
            @click="onSave"
          >保存</el-button>
        </div>
      </el-card>
  </div>
</template>

<script>
import { getResourceList, allocRoleResources, getRoleResources } from '@/services/resource'
export default {
  name: 'AllocResource',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      resources: [],
      defaultProps: {
        children: 'subResourceList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadResources()
    this.loadRoleResources()
  },
  methods: {
    // 自己封装用于数据筛选的方法（筛选出被选中菜单项的ID）
    getCheckedKeys (resources) {
      // 遍历数据（将所有存在子节点的 node 排除，对子节点列表进行筛选）
      resources.forEach(resource => {
        // 未选中，结束
        if (!resource.selected) {
          return
        }
        // 检测是否存在子节点
        if (resource.subResourceList) {
          // 对子节点进行选中状态检测。结束
          return this.getCheckedKeys(resource.subResourceList)
        }
        // 说明为选中的叶子节点（不存在子节点的节点），存储 ID
        // this.checkedKeys.push(menu.id)
        this.checkedKeys = [...this.checkedKeys, resource.id]
      })
    },
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async loadResources () {
      const { data } = await getResourceList()
      if (data.code === '000000') {
        this.resources = data.data
      }
    },
    async onSave () {
      const { data } = await allocRoleResources({
        roleId: this.roleId,
        resourceIdList: this.$refs['resource-tree'].getCheckedKeys()
      })
      console.log(data)
      if (data.code === '000000') {
        this.$message.success('分配资源成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    onReset () {
      this.$refs['resource-tree'].setCheckedKeys([])
    },
    // 树节点横向排列
    renderContent (h, { node, data, store }) {
      // 树节点的内容区的渲染 Function
      let classname = ""
      // 由于项目中有三级菜单也有四级级菜单，就要在此做出判断
      if (node.level === 2 && node.childNodes.length === 0) {
        classname = "foo"
      }
      return h(
        "p",
        {
          class: classname
        },
        node.label
      );
    },
  }
}
</script>

<style lang="scss"></style>
