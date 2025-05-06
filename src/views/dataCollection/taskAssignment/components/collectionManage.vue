<template>
  <div>
    <div class="search-container">
      <!--搜索栏--->
      <el-input
        v-model="searchQuery"
        placeholder="请输入搜索内容"
        style="width: 300px; margin-right: 10px"
      ></el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <div>
      <el-table :data="info" style="width: 100%" border>
        <el-table-column
          label="检验批名称"
          prop="batchName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="项目名称"
          prop="programName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="起始时间"
          prop="time"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="状态"
          prop="state"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <!-- 在这里访问每一行的 state 字段 -->
          <template slot-scope="scope">
            <div v-if="scope.row.state === '待发布'">
              <el-button type="text" @click="show()">查看</el-button>
              <el-button type="text" @click="stop()" style="color: #f56c6c"
                >终止</el-button
              >
            </div>
            <div v-else>
              <el-button type="text">人工采集</el-button>
              <el-button type="text">OCR识别</el-button>
              <el-button type="text" style="color: #f56c6c">终止</el-button>
            </div>
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
export default {
  data() {
    return {
      info: [
        {
          batchName: "1#楼东1-7A-F三层墙柱-现浇结构外观及尺寸偏差",
          programName: "蓬莱家园1#楼建设项目",
          state: "待发布",
          time: "2024-07-16",
        },
        {
          batchName: "1#楼东1-7A-F三层墙柱-现浇结构外观及尺寸偏差",
          programName: "蓬莱家园1#楼建设项目",
          state: "待发布",
          time: "2024-07-16",
        },
        {
          batchName: "1#楼东1-7A-F三层墙柱-现浇结构外观及尺寸偏差",
          programName: "蓬莱家园1#楼建设项目",
          state: "已发布",
          time: "2024-07-16",
        },
        {
          batchName: "1#楼东1-7A-F三层墙柱-现浇结构外观及尺寸偏差",
          programName: "蓬莱家园1#楼建设项目",
          state: "已发布",
          time: "2024-07-16",
        },
        {
          batchName: "1#楼东1-7A-F三层墙柱-现浇结构外观及尺寸偏差",
          programName: "蓬莱家园1#楼建设项目",
          state: "已发布",
          time: "2024-07-16",
        },
        {
          batchName: "1#楼东1-7A-F三层墙柱-现浇结构外观及尺寸偏差",
          programName: "蓬莱家园1#楼建设项目",
          state: "已发布",
          time: "2024-07-16",
        },
      ],
      currentPage: 2, //分页器数据
      limit: 20, //每页显示的数据
      total: 100,
    };
  },
  methods: {
    show() {
      const isShow = false;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    stop() {},
  },
};
</script>

<style>
.search-container {
  float: right;
}
</style>