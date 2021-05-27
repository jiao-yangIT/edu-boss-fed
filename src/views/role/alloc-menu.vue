<template>
  <div class="alloc-menu">
      <el-card>
        <el-tree
            ref="menu-tree"
            node-key="id"
            :data="menus"
            :default-checked-keys="checkedKeys"
            show-checkbox
            default-expand-all
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
import { getMenuNodeList, allocRoleMenus, getRolesMenus } from '@/services/menu'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    // 自己封装用于数据筛选的方法（筛选出被选中菜单项的ID）
    getCheckedKeys (menus) {
      menus.forEach(menu => {
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 选中的叶子接点（不存在子节点的接点） 存储ID
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    async loadRoleMenus () {
      const { data } = await getRolesMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async onSave () {
      const { data } = await allocRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss"></style>
