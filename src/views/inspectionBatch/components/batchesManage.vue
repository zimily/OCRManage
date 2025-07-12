<template>
  <div>
    <div>
      <el-row :gutter="5">
        <el-col :span="6">
          <span style="float: left">
            <el-button type="primary" icon="el-icon-plus" style="margin: 10px 10px" @click="addBatch">新建规范</el-button>
          </span>
        </el-col>
        <el-col :span="18">
          <span class="search-container" style="float: right">
            <!--搜索栏--->
            <span>分项:</span>
            <el-input v-model="searchFenxiang" placeholder="搜索内容" style="width: 10em; margin-left: 1em; margin-right: 1em"></el-input>
            <span>类别:</span>
            <el-input v-model="searchType" placeholder="搜索内容"
              style="width: 10em; margin-left: 1em; margin-right: 1em" ></el-input>
            <span>验收依据:</span>
            <el-input v-model="searchYanshou" placeholder="搜索内容"
              style="width: 10em; margin-left: 1em; margin-right: 1em" ></el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </span>
        </el-col>
      </el-row>
    </div>
    <div>
      <!-- 表格 -->
      <el-table :data="specInfo" style="width: 100%" border :header-cell-class-name="headerCellClassName">
        <el-table-column prop="fenxiangName" label="分项" align="center">
        </el-table-column>
        <el-table-column prop="typeName" label="类别" align="center">
        </el-table-column>
        <el-table-column prop="yanshouRule" label="验收依据" align="center">
        </el-table-column>
        <el-table-column prop="prop" label="操作" align="center">
          <template slot-scope="{ row, $index }">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateBatch(row, $index)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBatch(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <el-pagination style="margin-top: 20px; text-align: center" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 20]" :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getAllSpecifications, deleteSpecifications, searchSpecifications } from "@/api/specifications";
export default {
  data() {
    return {
      specInfo: [],
      currentPage: 1, //分页器数据
      limit: 10, //每页显示的数据
      total: 0, //全部数据条数
      searchFenxiang: "",
      searchType: "",
      searchYanshou: "",
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
          this.currentPage = Number(res.result.current);
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
    async updateBatch(row, index) {
      const inspectId = row.inspectId
      this.$router.push({
        path: "batchDetailEdit",
        query: {
          id: inspectId,
        },
      });
    },
    //删除检验批
    async deleteBatch(row) {
      // console.log("删除检验批事件",row);
      try {
        let res = await deleteSpecifications(row.inspectId)
        if (res.code == 200) {
          this.$message.success("删除成功！");
          this.getSpecifications();
        } else
          throw new Error(res.message || "删除操作失败");
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }

    },
    //搜索事件
    async handleSearch() {
      console.log('搜索参数',this.searchFenxiang,this.searchType,this.searchYanshou)
      try {
        let res=await searchSpecifications(this.searchFenxiang,this.searchType,this.searchYanshou)
        if (res.code==200){
          console.log('搜索结果',res)
        }else
          throw new Error(res.message || "搜索操作失败");
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
        
      }
    },
    //分页器
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getSpecifications();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      //前往第X页
      this.currentPage = val;
      // console.log(`当前页: ${val}`);
      this.getSpecifications();
    },
    headerCellClassName({ column }) {
      return "header-cell-highlight"; // 返回自定义的类名
    },
  },
};
</script>

<style>
.header-cell-highlight {
  background-color: rgba(197,
      194,
      190,
      0.801) !important;
  /* 设置你想要的背景颜色 */
  color: rgb(61, 60, 60) !important;
  /* 设置文字颜色 */
  font-weight: bold;
  /* 设置文字为粗体 */
  font-size: 16px;
  /* 设置文字大小 */
}
</style>