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
          >新建检验批</el-button
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
      <el-table :data="tableData" style="width: 100%" border 
        :header-cell-class-name="headerCellClassName">
        <el-table-column
          prop="name"
          label="检验批名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="templateNum"
          label="模板数量"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="indicatos"
          label="指标数量"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="prop" label="操作" align="center">
          <el-button type="warning" icon="el-icon-edit" size="mini"
            @click="updateBatch()">修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="deleteBatch()">删除</el-button
          >
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top:20px; text-align:center"
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
      tableData: [
        {
          //表格数据
          name: "钢筋原料检验批",
          templateNum: 2,
          indicatos: 4,
        },
        {
          name: "钢筋加工检验批",
          templateNum: 3,
          indicatos: 5,
        },
        {
          name: "钢筋链接检验批",
          templateNum: 1,
          indicatos: 2,
        },
      ],
      currentPage: 2, //分页器数据
      limit: 20, //每页显示的数据
      total: 100,
      
    };
  },
  methods: {
    //新建检验批
    addBatch() {
      console.log("触发新建检验批事件");
      const isShow=false
      const data={isShow}
      this.$emit('transmit',data)
    },
    //修改检验批
    updateBatch() {
      const isShow=false
      const data={isShow}
      this.$emit('transmit',data)
      console.log("修改检验批事件");
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    headerCellClassName({ column }) {
      return 'header-cell-highlight'; // 返回自定义的类名
    },
  },
};
</script>

<style>
.header-cell-highlight {
  background-color: rgba(197, 194, 190, 0.801) !important; /* 设置你想要的背景颜色 */
  color: rgb(61, 60, 60) !important; /* 设置文字颜色 */
  font-weight: bold; /* 设置文字为粗体 */
  font-size: 16px; /* 设置文字大小 */
}
</style>