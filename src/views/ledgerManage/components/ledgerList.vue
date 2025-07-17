<template>
  <div>
    <!-- 路由出口：子组件将在这里渲染    0710-->
    <router-view></router-view>
    <!-- 顶部操作栏 -->
    <el-row>
      <el-col :span="10">
        <el-button type="primary" @click="toLedgerEntry">+台账录入</el-button>
        <el-button type="primary" @click="toOCREntry">OCR数据录入</el-button>
      </el-col>
      <el-col :span="14">
        <div class="top_right">
          <span>项目名称</span>
          <el-input v-model="searchProjectName" placeholder="" style="width: 8em; margin-left: 1em; margin-right: 1em"
            size="mini"></el-input>
          <span>单位工程名称</span>
          <el-input v-model="searchSubprojectName" placeholder=""
            style="width: 8em; margin-left: 1em; margin-right: 1em" size="mini"></el-input>
          <span>使用部位</span>
          <el-input v-model="searchFloorWithInspectPart" placeholder=""
            style="width: 8em; margin-left: 1em; margin-right: 1em" size="mini"></el-input>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </el-col>
    </el-row>


    <!-- 列表数据展示 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column v-for="(col, index) in tableColumns" :key="index" :prop="col.prop" :label="col.label"
        :width="col.width" align="center" show-overflow-tooltip>
        <!-- 添加作用域插槽强制单行显示 -->
        <template #default="scope">
          <div class="single-line">{{ scope.row[col.prop] }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="operation" label="操作" align="center" width="250">
        <template v-slot="scope">
          <el-button type="warning" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



    <el-pagination style="margin-top: 20px; text-align: center" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="curPage" :page-sizes="[10, 15, 20]" :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getUser } from "@/utils/storage";
import {
  getRawMaterial,
  getConnection,
  getWeld,
  getBeton,
  deleteRaw,
  deleteConnect,
  deleteWeld,
  deleteBeton,
} from "@/api/ledger";
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
      // 存储所有列配置
      allColumns: {
        rawMaterial: [
          // 存储所有列配置
          { prop: "dataId", label: "批次", width: 50 },
          { prop: "projectName", label: "项目名称", width: 200 },
          { prop: "subprojectName", label: "单位工程名称", width: 200 },
          { prop: "usePart", label: "使用部位", },
          { prop: "diameter", label: "钢筋直径（mm）", width: 100 },
          { prop: "steelType", label: "钢筋牌号", width: 100 },
          { prop: "heatBatchNumber", label: "炉批号", width: 100 },
          { prop: "isPassed", label: "是否采集完毕", width: 80 },
        ],
        connection: [
          { prop: "dataId", label: "批次", width: 50 },
          { prop: "projectName", label: "项目名称", width: 200 },
          { prop: "subprojectName", label: "单位工程名称", width: 200 },
          { prop: "usePart", label: "使用部位" },
          { prop: "connectorType", label: "接头型号", width: 150 },
          { prop: "connectorLevel", label: "等级", width: 100 },
          { prop: "representAmount", label: "代表数量", width: 100 },
          { prop: "isPassed", label: "是否采集完毕", width: 80 },
        ],
        weld: [
          { prop: "dataId", label: "批次", width: 50 },
          { prop: "projectName", label: "项目名称", width: 200 },
          { prop: "subProjectName", label: "单位工程名称", width: 200 },
          { prop: "usePart", label: "使用部位" },
          { prop: "steelType", label: "钢筋牌号", width: 150 },
          { prop: "weldType", label: "焊接类型", width: 100 },
          { prop: "representAmount", label: "代表数量", width: 100 },
          { prop: "conclusion", label: "是否采集完毕", width: 80 },
        ],
        beton: [
          { prop: "dataId", label: "批次", width: 50 },
          { prop: "projectName", label: "项目名称", width: 200 },
          { prop: "subProjectName", label: "单位工程名称", width: 200 },
          { prop: "usePart", label: "使用部位" },
          { prop: "concreteStrength", label: "强度等级", width: 150 },
          { prop: "maintCondition", label: "养护条件", width: 100 },
          { prop: "representAmount", label: "代表数量", width: 100 },
          { prop: "isPassed", label: "是否采集完毕", width: 80 },
        ],
      },
      userId: null,
    };
  },
  props: {
    //父组件传递的参数
    index: Number,
    category: String,

  },
  created() { },
  mounted() { 
   
  },
  computed: {
    tableColumns() {
      if (this.category === "钢筋原材") {
        return this.allColumns["rawMaterial"];
      } else if (this.category === "钢筋机械连接") {
        return this.allColumns["connection"];
      } else if (this.category === "钢筋焊接") {
        return this.allColumns["weld"];
      } else if (this.category === "混凝土强度") {
        return this.allColumns["beton"];
      } else {
        return [];
      }
    },
  },
  watch: {
    category(newVal, oldVal) {
      console.log("category", newVal, oldVal)
      this.curPage=1
      this.limit=10
      this.handleCategoryChange(newVal);
    },
  },
  mounted() {
    const user = getUser();
    this.userId = user.userId;
    this.handleCategoryChange(this.category);
  },
  methods: {
    handleCategoryChange(category) {
      const data = {
        userid: this.userId,
        pageNum: String(this.curPage),
        pageSize: String(this.limit),
        projectName: "",
        subprojectName: "",
        usePart: "",
      };
      if (category === "钢筋原材") {
        this.getRawAllData(data);
      } else if (category === "钢筋机械连接") {
        this.getConnectionAllData(data);
      } else if (category === "钢筋焊接") {
        this.getWeldAllData(data);
      } else if (category === "混凝土强度") {
        this.getBetonAllData(data);
      } else {
        this.message.error(`没有 ${category} 类型的检验批，出错了！`);
      }
    },
    async getRawAllData(data) {
      const user = getUser();
      try {
        const res = await getRawMaterial(data);
        if (res.code == 200) {
          console.log("钢筋原材", res);
          this.tableData = res.result.records || [];
          this.total = Number(res.result.total) || 0;
        } else {
          throw new Error(res.message || "获取钢筋原材台账数据状态失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    async getConnectionAllData(data) {
      try {
        const res = await getConnection(data);
        if (res.code == 200) {
          console.log("钢筋机械连接", res);
          this.tableData = res.result.records || [];
          this.total = Number(res.result.total) || 0;
        } else {
          throw new Error(res.message || "获取钢筋连接台账数据状态失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    async getWeldAllData(data) {
      try {
        const res = await getWeld(
          data.pageNum, // 对应 pageNum（当前页码）
          data.pageSize, // 对应 pageSize（每页条数）
          data.userid, // 用户Id
          data.projectName, // projectName（搜索条件，暂时为空）
          data.subprojectName, // subProjectName（搜索条件，暂时为空）
          data.usePart // usePart（搜索条件，暂时为空）
        );
        if (res.code == 200) {
          console.log("钢筋焊接", res);
          this.tableData = res.result.records || [];
          this.total = Number(res.result.total) || 0;
        } else {
          throw new Error(res.message || "获取钢筋焊接台账数据状态失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    async getBetonAllData(data) {
      try {
        const res = await getBeton(
          data.pageNum, // 对应 pageNum（当前页码）
          data.pageSize, // 对应 pageSize（每页条数）
          data.userid,
          data.projectName, // projectName（搜索条件，暂时为空）
          data.subprojectName, // subProjectName（搜索条件，暂时为空）
          data.usePart // usePart（搜索条件，暂时为空）
        );
        if (res.code == 200) {
          console.log("混凝土强度", res);
          this.tableData = res.result.records || [];
          this.total = Number(res.result.total) || 0;
        } else {
          throw new Error(res.message || "获取混凝土台账数据状态失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    //编辑按钮
    editItem(row) {
      console.log("编辑项目:", row);
      this.$emit("update-index", 2, row.dataId);
    },
    //删除按钮
    async deleteItem(row) {
      const dataId = row.dataId;
      if (this.category === "钢筋原材") {
        await this.deleteRaw(dataId);
      } else if (this.category === "钢筋机械连接") {
        await this.deleteConnect(dataId);
      } else if (this.category === "钢筋焊接") {
        await this.deleteWeld(dataId);
      } else if (this.category === "混凝土强度") {
        await this.deleteBeton(dataId);
      } else {
        this.message.error(`没有 ${category} 类型的检验批，出错了！`);
      }
      await this.handleCategoryChange(this.category);
    },
    //删除功能
    async deleteRaw(dataId) {
      try {
        let res = await deleteRaw(dataId);
        if (res.code == 200) {
          this.$message.success("删除成功！");
        } else {
          throw new Error(res.message || "删除操作失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    async deleteConnect(dataId) {
      try {
        let res = await deleteConnect(dataId);
        if (res.code == 200) {
          this.$message.success("删除成功！");
        } else {
          throw new Error(res.message || "删除操作失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    async deleteWeld(dataId) {
      try {
        let res = await deleteWeld(dataId);
        if (res.code == 200) {
          this.$message.success("删除成功！");
        } else {
          throw new Error(res.message || "删除操作失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    async deleteBeton(dataId) {
      try {
        let res = await deleteBeton(dataId);
        if (res.code == 200) {
          this.$message.success("删除成功！");
        } else {
          throw new Error(res.message || "删除操作失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },
    // 台账录入
    toLedgerEntry() {
      this.$emit("update-index", 2, null);
    },
    // OCR录入
    toOCREntry() {
      this.$emit("update-index", 1, null);
    },
    // 搜索方法
    search() {
      this.curPage = 1;
      const data = {
        userid: this.userId,
        pageNum: String(this.curPage),
        pageSize: String(this.limit),
        projectName: this.searchProjectName,
        subprojectName: this.searchSubprojectName,
        usePart: this.searchFloorWithInspectPart,
      };
      console.log("搜索", data);
      if (this.category === "钢筋原材") {
        this.getRawAllData(data);
      } else if (this.category === "钢筋机械连接") {
        this.getConnectionAllData(data);
      } else if (this.category === "钢筋焊接") {
        this.getWeldAllData(data);
      } else if (this.category === "混凝土强度") {
        this.getBetonAllData(data);
      } else {
        this.message.error(`没有 ${category} 类型的检验批，出错了！`);
      }
    },

    // 分页大小变化
    handleSizeChange(newSize) {
      this.limit = newSize;
      this.curPage = 1;
      const data = {
        userid: this.userId,
        pageNum: String(this.curPage),
        pageSize: String(this.limit),
        projectName: this.searchProjectName,
        subprojectName: this.searchSubprojectName,
        usePart: this.searchFloorWithInspectPart,
      };
      console.log("页面大小", newSize, data);
      if (this.category === "钢筋原材") {
        this.getRawAllData(data);
      } else if (this.category === "钢筋机械连接") {
        this.getConnectionAllData(data);
      } else if (this.category === "钢筋焊接") {
        this.getWeldAllData(data);
      } else if (this.category === "混凝土强度") {
        this.getBetonAllData(data);
      } else {
        this.message.error(`没有 ${category} 类型的检验批，出错了！`);
      }
    },

    // 当前页码变化
    handleCurrentChange(newPage) {
      this.curPage = newPage;
      const data = {
        userid: this.userId,
        pageNum: String(this.curPage),
        pageSize: String(this.limit),
        projectName: this.searchProjectName,
        subprojectName: this.searchSubprojectName,
        usePart: this.searchFloorWithInspectPart,
      };
      if (this.category === "钢筋原材") {
        this.getRawAllData(data);
      } else if (this.category === "钢筋机械连接") {
        this.getConnectionAllData(data);
      } else if (this.category === "钢筋焊接") {
        this.getWeldAllData(data);
      } else if (this.category === "混凝土强度") {
        this.getBetonAllData(data);
      } else {
        this.message.error(`没有 ${category} 类型的检验批，出错了！`);
      }
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
  justify-content: flex-end;
  align-items: center;
}

/* 强制单行显示 */
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
