<template>
  <el-card class="box-card">
    <!-- 使用form组件 -->
    <div slot="header" class="clearfix">
      <el-form ref="form" :inline="true" :model="filterParams" class="demo-form-inline">
        <el-form-item label="手机号" props="phone">
          <el-input v-model="filterParams.phone" placeholder="手机号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="注册时间" props="rangeDate">
          <el-date-picker
            v-model="filterParams.rangeDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset" type="danger">重置</el-button>
          <el-button type="primary" @click="handleQuery" :disabled="isloading"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="users" style="width: 100%" v-loading="isloading">
      <el-table-column label="用户ID" width="100" prop="id"> </el-table-column>
      <el-table-column prop="" label="头像" width="100">
        <template slot-scope="scope">
          <img
            width="30px"
            :src="
              scope.row.portrait ||
              'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="createTime" label="注册时间"></el-table-column>
      <el-table-column prop="description" label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-button type="danger" size="mini">禁用</el-button>
          <el-button size="mini" @click="handleSelectAllocRole(scope.row)"
            >分配角色</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配角色" :visible.sync="dialogVisible" width="30%">
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.value"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getUser, forbidUser } from "@/services/user";
import { getAllRoles, allocUserRoles, getUserRoles } from "@/services/role";
export default {
  name: "UserList",
  data () {
    return {
      users: [],
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: "",
        startCreateTime: "",
        endCreateTime: "",
        rangeDate: [],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      isloading: false,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentRoleID: null,
    };
  },
  created () {
    this.loadUsers();
  },
  methods: {
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    handleReset () {
      this.$refs.form.resetFields()
    },
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadUsers()
      console.log('查询按钮')
    },
    async loadUsers () {
      this.isloading = true;
      const { rangeDate } = this.filterParams;
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0];
        this.filterParams.endCreateTime = rangeDate[1];
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUser(this.filterParams);
      this.users = data.data.records
      this.isloading = false;
    },
    // 点击分配角色dialog
    async handleSelectAllocRole (userInfo) {
      this.currentRoleID = userInfo.id
      this.dialogVisible = true
      // 请求所有角色列表的数据
      const { data } = await getAllRoles();
      if (data.code === "000000") {
        this.roles = data.data;
      }

      // 请求当前用户的已分配角色信息
      const { data: data2 } = await getUserRoles(userInfo.id);
      if (data2.code === "000000") {
        this.roleIdList = data2.data.map((item) => item.id);
      }
    },
    // 提交分配
    async handleAllocRole (userInfo) {
      const { data } = await allocUserRoles({
        userId: this.currentRoleID,
        roleIdList: this.roleIdList,
      });
      if (data.code === "000000") {
        this.$message.success("分配成功");
        this.dialogVisible = false;
      }
    }
  },
};
</script>

<style lang="scss"></style>
