<template>
  <el-container>
      <el-aside width="200px">
        <!-- 侧边栏组件 -->
        <app-aside></app-aside>
      </el-aside>
      <el-container>
        <el-header>
          <app-header></app-header>
        </el-header>
        <el-main>
          <!-- 设置子路由出口 -->
          <router-view></router-view>
        </el-main>
        <el-footer>
          <app-footer></app-footer>
        </el-footer>
    </el-container>
  </el-container>
</template>
<script>
// 引入侧边栏组件
import AppAside from "./components/AppAside";
// 引入头部组件
import AppHeader from "./components/AppHeader"
// 引入底部文件
import AppFooter from "./components/AppFooter"

export default {
  name: "Layout",
  components: {
    AppAside,
    AppHeader,
    AppFooter
  },
};
</script>
<style lang="scss" scoped>
.el-container {
  height: 100vh;
}
.el-aside {
  background-color: #d3dce6;
}
.el-header {
  background-color: #fff;
}
.el-main {
  background-color: #e9eef3;
}
.el-footer {
  display: flex;
  line-height: 60px;
  justify-content: center;
  background-color: #d3dce6;
}
</style>
