<template>
  <div>
    <div>
      <!-- 按钮 -->
      <span style="float: left">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px 10px"
          @click="addBatch"
          >新建规范</el-button
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
    <div>
      <!-- 表格 -->
      <el-table
        :data="specInfo"
        style="width: 100%"
        border
        :header-cell-class-name="headerCellClassName"
      >
        <el-table-column prop="fenxiangName" label="分项" align="center">
        </el-table-column>
        <el-table-column prop="typeName" label="类别" align="center">
        </el-table-column>
        <el-table-column prop="yanshouRule" label="验收依据" align="center">
        </el-table-column>
        <el-table-column prop="prop" label="操作" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateBatch(row, $index)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteBatch()"
              >删除</el-button
            >
          </template>
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
import { getAllSpecifications,getSpecificationsById } from "@/api/specifications";
export default {
  data() {
    return {
      searchQuery: "", // 用于存储输入框的内容
      specInfo: [],
      currentPage: 1, //分页器数据
      limit: 10, //每页显示的数据
      total: 0, //全部数据条数
    };
  },
  created() {
    this.getSpecifications();
  },
  methods: {
    async getSpecifications() {
      //请求
      try {
        let res = await getAllSpecifications(this.currentPage, this.limit);
        if (res.code == 200) {
          console.log("获取所有验收规范", res);
          this.specInfo = res.result.records;
          this.total = Number(res.result.total);
          this.limit = Number(res.result.size);
          this.currentPage = Number(res.result.pages);
        } else {
          this.$message.error("获取所有检验批失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    //新建检验批
    addBatch() {
      this.$router.push({
        path: "batchDetailBuilt",
      });
    },
    //编辑检验批
    async updateBatch(row,index) {
      const inspectId=row.inspectId
      this.$router.push({
        path: "batchDetailEdit",
          query: {
            id: inspectId,
          },
      });
    },
    //删除检验批
    deleteBatch() {
      console.log("删除检验批事件");
    },
    //搜索事件
    handleSearch() {
      console.log("搜索内容:", this.searchQuery);
    },
    //分页器
    handleSizeChange(val) {
      this.limit = val;
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      //前往第X页
      this.currentPage = val;
      // console.log(`当前页: ${val}`);
    },
    headerCellClassName({ column }) {
      return "header-cell-highlight"; // 返回自定义的类名
    },
  },
};
</script>

<style>
.header-cell-highlight {
  background-color: rgba(
    197,
    194,
    190,
    0.801
  ) !important; /* 设置你想要的背景颜色 */
  color: rgb(61, 60, 60) !important; /* 设置文字颜色 */
  font-weight: bold; /* 设置文字为粗体 */
  font-size: 16px; /* 设置文字大小 */
}
</style>