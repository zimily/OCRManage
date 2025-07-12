<template>
  <div>
    <!-- <tasks v-if="isShow === 0" :visible.sync='isShow' @transmit="getMessage"></tasks>
    <manualCollection v-else-if="isShow === 1" @transmit="getMessage"></manualCollection>
    <ocrCollection v-else="isShow===2" @transmit="getMessage"></ocrCollection> -->



    <!-- 数据采集任务 -->
    <el-row class="operation-bar">
      <el-col :span="24" class="flex-right">
        <span>工程名称</span>
        <el-input 
          v-model="projectName" 
          placeholder="请输入搜索内容"
          style="width: 18em; margin-left: 1em; margin-right: 1em" size="mini"
        ></el-input>
        <span>单位工程</span>
        <el-input 
          v-model="subprojectName" 
          placeholder="请输入搜索内容"
          style="width: 18em; margin-left: 1em; margin-right: 1em" size="mini"
        ></el-input>
        <span>检验批部位</span>
        <el-input 
          v-model="inspectPart" 
          placeholder="请输入搜索内容"
          style="width: 18em; margin-left: 1em; margin-right: 1em" size="mini"
        ></el-input>
        <el-button type="primary" @click="getSearch">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="projectInnerCode" label="项目号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="projectName" label="工程名称" align="center">
      </el-table-column>
      <el-table-column prop="subprojectName" label="单位工程" align="center">
      </el-table-column>
      <el-table-column prop="inspectPart" label="检验批部位"  align="center">
      </el-table-column>
      <el-table-column prop="inspectType" label="检验批名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="operation" label="操作" align="center"  width="200">
        <template slot-scope="scope">
          <el-button type="info" @click="handleView(scope.row)">查看</el-button>
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
import { getCompleted,getSearch  } from '@/api/task';
export default {
  data() {
    return {
      tableData: [],
      projectName:"",
      subprojectName:"",
      inspectPart:"",  // 搜索关键词
      curPage: 1, // 当前页码
      limit: 10, // 每页条数
      total: 0, // 总条数（计算后更新）
    }
  },
  computed: {
    
  },
  mounted() {
    this.getCompleted();
  },
  methods: {
    async getCompleted() {
      try {
        const res = await getCompleted(
          this.curPage,
          this.limit,
          this.token,
        );
        if (res.code == 200) {
          console.log("任务列表", res);
          this.tableData = res.result.records || [];
          this.total = Number(res.result.total) || 0;
        } else {
          throw new Error(res.message || "获取数据状态失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("出错啦，请稍后重试！");
      }
    },

    // 搜索功能
    async getSearch() {
      if (!this.projectName.trim()&&!this.subprojectName.trim()&&!this.inspectPart.trim()) {
        this.$message.warning("请输入搜索内容");
        return;
      }
      try {
        this.curPage=1
        // 动态构建可选参数：将关键词传递给需要搜索的字段（至少一个）
        const res = await getSearch(
          this.curPage,
          this.limit,
          this.projectName,
          this.subprojectName,
          this.inspectPart,
          this.token
        );

        if (res.code === 200) {
          console.log("搜索数据",res)
          this.tableData = res.result.records || [];
          this.total = Number(res.result.total) || 0;
        } else {
          throw new Error(res.message || "搜索失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("搜索出错，请稍后重试");
      }
    },

    // 每页条数变化时触发
    handleSizeChange(newSize) {
      this.limit = newSize;
      this.curPage = 1; // 页码重置为1
      this.getCompleted();

    },

    // 页码变化时触发
    handleCurrentChange(newPage) {
      this.curPage = newPage;
      this.getCompleted();
    },
    handleView(row) {
      console.log('点击查看:', row);
      this.$store.commit("collection/setDataEntryRow", row);
      this.$router.push({
        name: 'TaskDetail', // 使用路由配置中的name
        query: { projectInnerCode: row.projectInnerCode, taskId:row.taskId }
      });
    }

  }

};
</script>

<style>
.operation-bar {
  margin-bottom: 10px;
}

.flex-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>