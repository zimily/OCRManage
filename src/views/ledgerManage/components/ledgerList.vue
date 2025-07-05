<template>
  <div>
    <!-- 路由出口：子组件将在这里渲染 -->
    <router-view></router-view>
    <!-- 顶部操作栏 -->
    <el-row>
      <el-button type="primary" @click="toLedgerEntry">+台账录入</el-button>
      <el-button type="primary" @click="toOCREntry">OCR数据录入</el-button>
      <el-col :offset="2">
        <div class="top_right">
          <span>项目名称</span>
          <el-input
            v-model="searchProjectName"
            placeholder=""
            style="width: 8em; margin-left: 1em; margin-right: 1em"
            size="mini"
          ></el-input>
          <span>单位工程名称</span>
          <el-input
            v-model="searchSubprojectName"
            placeholder=""
            style="width: 8em; margin-left: 1em; margin-right: 1em"
            size="mini"
          ></el-input>
          <span>使用部位</span>
          <el-input
            v-model="searchFloorWithInspectPart"
            placeholder=""
            style="width: 8em; margin-left: 1em; margin-right: 1em"
            size="mini"
          ></el-input>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 列表数据展示 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="dataId"
        label="批次"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="subprojectName"
        label="单位工程名称"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="usePart"
        label="使用部位"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="diameter"
        label="钢筋直径（mm）"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="steelType"
        label="钢筋牌号"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="heatBatchNumber"
        label="炉批号"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="isPassed"
        label="是否合格"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column prop="operation" label="操作" align="center">
        <template v-slot="scope">
          <el-button type="warning" @click="editItem(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="deleteItem(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curPage"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getUser } from "@/utils/storage";
import { getRawMaterial,getConnection } from "@/api/ledger";
export default {
  data() {
    return {
      searchProjectName: "",
      searchSubprojectName: "",
      searchFloorWithInspectPart: "",
      tableData: [], // 当前页数据
      curPage: 1,
      limit: 10,
      total: 0, // 初始化为0，在数据加载后更新
    };
  },
  props: {
    //父组件传递的参数
    index: Number,
    category: String,
  },
  created() {},
  computed: {},
  watch: {
    category(newVal, oldVal) {
      console.log("category changed from", oldVal, "to", newVal);
      this.handleCategoryChange(newVal);
    },
  },
  mounted() {
    console.log("台账类型", this.category);
    this.handleCategoryChange(this.category);
  },
  methods: {
    handleCategoryChange(category) {
      if (category === "钢筋原材") {
        this.getRawAllData();
      } else if (category === "钢筋机械连接") {
        this.getConnectionAllData();
      } else if (category === "钢筋焊接") {
        this.getWeldAllData();
      } else if (category === "混凝土强度") {
        this.getBetonAllData();
      } else {
        this.message.error(`没有 ${category} 类型的检验批，出错了！`);
      }
    },
    async getRawAllData() {
      console.log("获取全部数据");
      const user = getUser();
      try {
        const res = await getRawMaterial({
          userid: user.userId,
          page: this.curPage,
          limit: this.limit,
          projectName: "",
          subprojectName: "",
          usePart: "",
        });
        if (res.code == 200) {
          console.log("获取数据状态", res);
          this.tableData = res.result.records || [];
          this.total = res.result.total || 0;
        } else {
          throw new Error(res.message || "获取钢筋原材台账数据状态失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    async getConnectionAllData() {
      console.log("发请求，获取钢筋连接的数据");
      const user = getUser();
      try {
        const res = await getConnection({
          userid: user.userId,
          page: this.curPage,
          limit: this.limit,
          projectName: "",
          subprojectName: "",
          usePart: "",
        });
        if (res.code == 200) {
          console.log("获取数据状态", res);
          this.tableData = res.result.records || [];
          this.total = res.result.total || 0;

          // this.updateTableData();
        } else {
          throw new Error(res.message || "获取钢筋连接台账数据状态失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    getWeldAllData() {
      console.log("发请求，获取钢筋焊接的数据");
      this.tableData = [];
    },
    getBetonAllData() {
      console.log("发请求，获取混凝土的数据");
      this.tableData = [];
    },
    toLedgerEntry() {
      this.$emit("update-index", 2);
    },
    toOCREntry() {
      this.$emit("update-index", 1);
    },
    // 搜索方法
    search() {
      // 重置到第一页
      this.curPage = 1;
      // 更新表格数据
      this.updateTableData();
    },

    // 更新表格数据
    updateTableData() {
      // 确保allData存在
      if (!this.allData || this.allData.length === 0) {
        console.warn("没有数据可显示");
        this.tableData = [];
        this.total = 0;
        return;
      }

      // 根据搜索条件过滤数据
      let filteredData = this.allData.filter((item) => {
        return (
          item.projectName.includes(this.searchProjectName) &&
          item.subprojectName.includes(this.searchSubprojectName) &&
          item.floorWithInspectPart.includes(this.searchFloorWithInspectPart)
        );
      });

      // 更新总数
      this.total = filteredData.length;

      // 如果没有匹配结果，直接返回空数组
      if (filteredData.length === 0) {
        this.tableData = [];
        return;
      }

      // 计算当前页显示的数据
      const start = (this.curPage - 1) * this.limit;
      const end = start + this.limit;
      this.tableData = filteredData.slice(start, end);
    },

    // 分页大小变化
    handleSizeChange(newSize) {
      this.limit = newSize;
      this.updateTableData();
    },

    // 当前页码变化
    handleCurrentChange(newPage) {
      this.curPage = newPage;
      this.updateTableData();
    },

    // 编辑功能
    editItem(row) {
      console.log("编辑项目:", row);
      // 这里可以打开编辑对话框或跳转到编辑页面
      // 示例: this.$router.push({ name: 'editRebar', params: { id: row.id }})
    },

    // 删除功能
    deleteItem(row) {
      this.$confirm("确定要删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 从allData中删除
          this.allData = this.allData.filter(
            (item) => item.batchNum !== row.batchNum
          );
          // 更新表格
          this.updateTableData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          // 用户取消操作
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.el-row {
  display: flex;
  align-items: center;
}

.top_right {
  display: flex;
  align-items: center;
}
</style>