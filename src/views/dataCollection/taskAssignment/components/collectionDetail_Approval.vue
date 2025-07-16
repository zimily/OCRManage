<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>单位工程：{{ subprojectName }}</span>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>检验批部位：{{ inspectPart }}</span>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>检验批名称：{{ inspectName }}</span>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>检验批容量：{{ inspectVolume }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 5px">
      <el-table ref="multipleTable" :data="tableData" row-key="taskItem.taskItemId" stripe
        @selection-change="handleSelectionChange" style="width: 100%">
        <!-- 复选框列 -->
        <el-table-column prop="isChecked" type="selection" width="55" align="center"></el-table-column>
        <!-- 其他列 -->
        <el-table-column prop="inspectItem.itemName" label="验收项目" align="center">
        </el-table-column>
        <el-table-column prop="inspectItem.ruleStandard" label="设计要求及规范规定" align="center">
        </el-table-column>
        <el-table-column prop="taskItem.sampleAmount" label="样本总数" width="120" align="center">
        </el-table-column>
        <el-table-column prop="taskItem.minSample" label="最小抽样批量" width="120" align="center">
        </el-table-column>
        <el-table-column prop="taskItem.collectedAmount" label="实际抽样批量" width="120" align="center">
        </el-table-column>
        <el-table-column prop="taskItem.checkRecord" label="验收记录" width="200" align="center">
        </el-table-column>
        <el-table-column prop="taskItem.passRate" label="合格率" width="120" align="center">
        </el-table-column>
        <el-table-column prop="inspectItem.itemType" label="项目类型" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.inspectItem.itemType === 1">主控项目</span>
            <span v-else-if="scope.row.inspectItem.itemType === 2">一般项目</span>
            <span v-else>未知项目类型</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" @click="viewData(scope)">查看数据</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <div style="margin-top: 10px">
      <el-button type="primary" :disabled="multipleSelection.length === 0" @click="pass()">通过</el-button>
      <el-button @click="cancel()">取消</el-button>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="原始数据展示" :visible.sync="dialogTableVisible" :show-close="false">
      <div v-if="dataType === 1">
        目测类型测数据
      </div>
      <div v-else-if="dataType === 2">
        尺量数据
      </div>
      <div v-else-if="dataType === 3">
        试验报告数据
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskDetailData, getCollectData, verify } from "@/api/collection";
export default {
  data() {
    return {
      inspectVolume: "",
      dialogTableVisible: false,
      tableData: [],
      multipleSelection: [],
      dataType: null,//1-目测 2-尺量 3-试验报告
    };
  },
  computed: {
    rowData() {
      return this.$store.state.collection.currentRowData;
    },
    taskId() {
      return this.$route.query.taskId;
    },
    subprojectName() {
      return this.rowData.subprojectName;
    },
    inspectPart() {
      return this.rowData.inspectPart;
    },
    inspectName() {
      return this.rowData.inspectType;
    },
  },
  mounted() {
    console.log("row", this.rowData);
    this.getDetailData()
  },
  methods: {
    async getDetailData() {
      console.log("详情页面", this.taskId)
      try {
        let res = await getTaskDetailData(this.taskId)
        if (res.code == 200) {
          console.log("数据", res)
          this.tableData = res.result.taskItemList.map(item => ({
            ...item,
            isChecked: false,
          }));
          this.inspectVolume = res.result.taskInspectBatchVolumeList.map(item => `${item.sourceName}：${item.volume}`).join('；');

        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("操作失败", error);
        this.$message.error("获取详情数据失败！");

      }
    },
    //查看数据
    async viewData(value) {
      this.dialogTableVisible = true
      const data = {
        taskId: value.row.taskItem.taskId,
        inspectItemId: value.row.inspectItem.inspectItemId
      }
      this.dataType = value.row.inspectItem.dataType
      console.log("查看数据", data)
      try {
        let res = await getCollectData(data)
        if (res.code === 200) {
          console.log("查看采集数据", res)
        } else {
          throw new Error(res.message)
        }
      } catch (error) {

        console.error("操作失败", error);
        this.$message.error("获取详情数据失败！");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // 同步更新 tableData 的 isChecked
      this.tableData.forEach(row => {
        row.isChecked = this.multipleSelection.includes(row);
      });
    },
    //通过
    async pass() {
      console.log("通过", this.multipleSelection);
      console.log("通过1", this.tableData);
      //数据整理
      const resultData = {
        taskId: '',
        taskItemList: [{
          teskItemId: 0,
          isChecked: 0,
        }]
      }
      resultData.taskId = this.taskId;
      this.tableData.map(item => {
        const taskItem = {}
        if (item.isChecked) {
          taskItem.teskItemId = item.taskItem.taskItemId;
          taskItem.isChecked = 1

        } else {
          taskItem.teskItemId = item.taskItem.taskItemId;
          taskItem.isChecked = 0
        }
        resultData.taskItemList.push(taskItem)
      })
      console.log("通过数据", resultData)
      try {
        let res = await verify(resultData)
        if (res.code == 200) {
          this.$message.success("审核保存成功！")
          this.$router.push({
            name: "CollectionManage",
          });
        } else {
          throw new Error(res.message || "保存失败")
        }
      } catch (error) {
        console.log(error) 
        this.$message.error("出错啦，请稍后重试！")
      }
    },
    //取消
    cancel() {
      this.$router.push({
        name: "CollectionManage",
      });
    },
  },
};
</script>

<style></style>