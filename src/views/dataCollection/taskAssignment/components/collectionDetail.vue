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
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :row-class-name="rowClassName"
      >
        <el-table-column
          prop="project"
          label="验收项目"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="require"
          label="设计要求及规范规定"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="sum" label="样本总数" width="120" align="center">
        </el-table-column>
        <el-table-column
          prop="min"
          label="最小抽样批量"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="reality"
          label="实际抽样批量"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="record"
          label="验收记录"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="value" label="合格率" width="120" align="center">
        </el-table-column>
        <el-table-column
          prop="master"
          label="是否为主控项"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="dialogTableVisible = true"
              >查看数据</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="turnBack()">返回</el-button>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="原始数据展示" :visible.sync="dialogTableVisible"  :show-close="false">
      <el-table :data="gridData">
        <el-table-column
          property="position"
          label="采集部位"
          width="220"
          align="center"
        >
        </el-table-column>
        <el-table-column
          property="data"
          label="原始数据"
          width="220"
          align="center"
        >
        </el-table-column>
        <el-table-column property="regular" label="是否合格" align="center">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskDetailData } from "@/api/collection";
export default {
  data() {
    return {
      inspectVolume: "钢筋6批",
      gridData: [
        {
          position: "1施工段墙",
          data: "-3mm",
          regular: "合格",
        },
        {
          position: "1施工段墙",
          data: "+1mm",
          regular: "合格",
        },
        {
          position: "1施工段柱",
          data: "0mm",
          regular: "合格",
        },
      ],
      dialogTableVisible: false,
      tableData: [
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          sum: "6",
          min: "全",
          reality: "6",
          record: "/",
          value: "100%",
          master: "是",
        },
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          sum: "6",
          min: "全",
          reality: "6",
          record: "/",
          value: "100%",
          master: "是",
        },
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          sum: "6",
          min: "全",
          reality: "6",
          record: "/",
          value: "100%",
          master: "是",
        },
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          sum: "6",
          min: "全",
          reality: "6",
          record: "/",
          value: "100%",
          master: "是",
        },
      ],
    };
  },
  computed: {
    taskId() {
      return this.$route.query.taskId;
    },
    // rowData() {
    //   return this.$route.params.row;
    // },
    // subprojectName() {
    //   return this.$route.params.row.subprojectName;
    // },
    // inspectPart() {
    //   return this.$route.params.row.inspectPart;
    // },
    // inspectName() {
    //   return this.$route.params.row.inspectType;
    // },
  },
  mounted() {
    console.log("当前任务ID:", this.taskId);
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const response = await getTaskDetailData(this.taskId);
        if (response && response.data) {
         console.log("获取到的任务详情数据:", response);
        } else {
          console.error("获取数据失败，响应数据格式不正确");
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    rowClassName({ row }) {
      return row.isChecked ? "checked-row" : "unchecked-row";
    },
    //返回
    turnBack(){
       this.$router.push({
          name: "CollectionManage",
        });
    }
  },
};
</script>

<style>
/* 被选中时颜色 */
/* .checked-row{
  color: #999999;
} */
/* 未被选中时颜色 */
.unchecked-row {
  color: #a9a9a9;
}
</style>