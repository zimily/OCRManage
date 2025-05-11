<template>
  <div>
    <div>
      <!-- 按钮 -->
      <span style="float: left">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px 10px"
          @click="addProject"
          >新建项目</el-button
        >
      </span>
      <span class="search-container" style="float: right">
        <!--搜索栏--->
        <el-input
          v-model="searchQuery"
          placeholder="请输入搜索内容"
          style="width: 300px; margin-right: 10px"
        ></el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </span>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="info" style="width: 100%" border>
        <el-table-column
          label="项目名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="项目用时"
          prop="duration"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          label="数据采集次数"
          prop="frequency"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" prop="prop" width="400" align="center">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateproject()"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteProject()"
            >删除</el-button
          >
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "", // 用于存储输入框的内容
      info: [
        {
          name: "蓬莱嘉园1#楼建设项目",
          duration: "36月",
          frequency: 30,
        },
        {
          name: "蓬莱嘉园2#楼建设项目",
          duration: "36月",
          frequency: 30,
        },
        {
          name: "蓬莱嘉园4#楼建设项目",
          duration: "36月",
          frequency: 20,
        },
        {
          name: "蓬莱嘉园5#楼建设项目",
          duration: "36月",
          frequency: 10,
        },
      ],
      currentPage: 2, //分页器数据
      limit: 20, //每页显示的数据
      total: 100,
    };
  },
  methods: {
    //新建项目
    addProject() {
      const isShow = false;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    //编辑按钮
    updateproject() {
       const isShow=false
      const data={isShow}
      this.$emit('transmit',data)
    },
    //删除按钮
    deleteproject() {},
    //搜索事件
    handleSearch() {
      console.log("搜索内容:", this.searchQuery);
    },
    //分页器
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    headerCellClassName({ column }) {
      return "header-cell-highlight"; // 返回自定义的类名
    },
  },
};
</script>

<style>
</style>