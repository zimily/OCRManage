<template>
  <div>
    <!-- 项目信息 -->
    <el-row :gutter="2" class="equal-height-row">
      <el-col :span="6">
        <el-card class="pro-card card-box" :body-style="{ padding: '10px' }" >
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="8">
              <div class="card-item">单位工程:</div>
            </el-col>
            <el-col :span="16">
              <div class="card-item-name">{{ rowData.subprojectName }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row" >
            <el-col :span="8">
              <div class="card-item">检验批部位:</div>
            </el-col>
            <el-col :span="16">
              <div class="card-item-name">{{ rowData.inspectPart }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="8">
              <div class="card-item">检验批类别:</div>
            </el-col>
            <el-col :span="16">
              <div class="card-item-name">{{ rowData.inspectType }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="sub-card card-box" :body-style="{ padding: '10px' }" >
          <el-row :gutter="3" class="spaced-row">
            <el-col :span="9">
              <div class="card-item">分包单位:</div>
            </el-col>
            <el-col :span="15">
              <el-input
                v-model="fenbaoCompany"
                placeholder="请输入分包单位"
                class="card-item-name"
                size="small"
              ></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="3" class="spaced-row">
            <el-col :span="9">
              <div class="card-item">分包单位项目负责人:</div>
            </el-col>
            <el-col :span="15">
              <el-input
                v-model="fenbaoDirector"
                placeholder="请输入项目负责人"
                class="card-item-name"
                size="small"
              ></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="3" class="spaced-row">
            <el-col :span="9">
              <div class="card-item">分包单位技术负责人:</div>
            </el-col>
            <el-col :span="15">
              <el-input
                v-model="fenbaoTechnical"
                placeholder="请输入技术负责人"
                class="card-item-name"
                size="small"
              ></el-input>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="build-card card-box" :body-style="{ padding: '10px' }" >
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="4">
              <div class="card-item">施工规范:</div>
            </el-col>
            <el-col :span="20">
              <el-input
                v-model="shigongRule"
                size="small"
                placeholder="请输入施工规范"
              ></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="4">
              <div class="card-item">检验批容量:</div>
            </el-col>
            <el-col :span="20">
              <div class="card-item-name">
                <span class="capacity-text">{{ capactity }}</span>
                <el-button
                  type="primary"
                  @click="editCapactity"
                  size="small"
                  style="margin-left: 10px"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  @click="importLedger"
                  size="small"
                  style="margin-left: 10px"
                  >选择台账</el-button
                >
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="4">
              <div class="card-item">验收规范:</div>
            </el-col>
            <el-col :span="20">
              <div class="card-item-name">{{ yanshouRule }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div class="card-item">设计值:</div>
            </el-col>
            <el-col :span="20">
               <div class="card-item-name">
                  <span class="capacity-text">{{shejizhi}}</span>
                  <el-button type="primary" @click="editDesignValue" size="small"  style="margin-left: 10px"
                    >编辑</el-button>
                </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 项目验收项信息 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; margin-top: 20px; margin-bottom: 20px"
      :row-class-name="rowClassName"
    >
      <el-table-column prop="isEmpty" label="是否采集" width="80" align="center">
        <template slot-scope="scope">
          <el-checkbox 
           :value="scope.row.isEmpty === 1" 
            @change="val => { scope.row.isEmpty = val ? 1 : 0 }"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column
        prop="itemName"
        label="验收项目"
        align="center"
        show-overflow-tooltip
      />

      <el-table-column
        prop="ruleStandard"
        label="设计要求及规范规定"
        align="center"
        show-overflow-tooltip
      />

      <el-table-column prop="variableMeaning" label="变量的值" align="center">
        <template #default="{ row }">
          <el-input style="width: 8em" v-model="row.variableMeaning" />
        </template>
      </el-table-column>

      <el-table-column prop="totalSampleNumber" label="样本总数" align="center">
        <template #default="{ row }">
          <el-input
            style="width: 8em"
            v-model="row.totalSampleNumber"
            type="number"
            min="0"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="minSampleNumber"
        label="最小抽样批量"
        align="center"
      >
        <template #default="{ row }">
          <el-input
            style="width: 8em"
            v-model="row.minSampleNumber"
            type="number"
            min="0"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="positionId"
        label="分发岗位"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.positionId"
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-button type="primary" @click="distributeTask()">分发</el-button>
      <el-button @click="cancelDistributeTask()">取消</el-button>
    </div>
    <!-- 设计值编辑弹窗 -->
    <el-dialog
      title="设计值编辑"
      :visible.sync="dialogTableVisible2"
      :show-close="false"
    >
      <!-- 添加按钮 -->
      <div style="margin-bottom: 10px; text-align: left">
        <el-button type="primary" icon="el-icon-plus" @click="addDesign">
          添加
        </el-button>
      </div>
      <el-table :data="gridData">
        <el-table-column
          label="内容"
          property="position"
          width="220"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.position"
              placeholder="请输入采样部位"
              style="width: 200px"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          property="value"
          label="设计值"
          width="220"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.value"
              placeholder="请输入设计值"
              style="width: 200px"
            ></el-input>
          </template>
          <el-input
            v-model="Subcontractor"
            placeholder=""
            style="width: 200px"
          ></el-input>
        </el-table-column>
        <el-table-column property="operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteDesignRow(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDesignValue()"
          >确 定</el-button
        >
        <el-button @click="cancelDssignValue()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑检验批容量弹窗 -->
    <el-dialog
      title="检验批容量编辑"
      :visible.sync="dialogTableVisible1"
      :show-close="false"
    >
      <!-- 添加按钮 -->
      <div style="margin-bottom: 10px; text-align: left">
        <el-button type="primary" icon="el-icon-plus" @click="addRow">
          添加
        </el-button>
      </div>
      <el-table :data="inspectCapacity">
        <el-table-column property="itemName" label="来源" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.itemName" placeholder="请选择">
              <el-option
                v-for="item in optionsEdit"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column property="number" label="数量" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.number"
              @input="(val) => (scope.row.number = parseFloat(val))"
              type="number"
              placeholder="请输入数量"
              min="0"
            />
          </template>
        </el-table-column>
        <el-table-column property="other" label="其他信息" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.other" placeholder="请输入其他信息" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteRow(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmCapactity">确 定</el-button>
        <el-button @click="cancelCapactity">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAssignData, getAllCollector,distribution,updateStatus } from "@/api/collection";
const statusMap = {
  sampleQiang: "墙",
  sampleBan: "板",
  sampleLiang: "梁",
  sampleZhu: "柱",
  sampleDtj: "电梯间",
  sampleGj: "钢筋",
  sampleHnt: "混凝土",
  sampleJxli: "机械连接",
  sampleDljc: "独立基础",
  sampleLt: "楼梯",
};
function getStatusText(item) {
  const activeItems = [];

  // 检查每个属性是否为 1，如果是则加入数组
  if (item.sampleQiang === 1) activeItems.push(statusMap.sampleQiang);
  if (item.sampleBan === 1) activeItems.push(statusMap.sampleBan);
  if (item.sampleLiang === 1) activeItems.push(statusMap.sampleLiang);
  if (item.sampleZhu === 1) activeItems.push(statusMap.sampleZhu);
  if (item.sampleDtj === 1) activeItems.push(statusMap.sampleDtj);
  if (item.sampleGj === 1) activeItems.push(statusMap.sampleGj);
  if (item.sampleHnt === 1) activeItems.push(statusMap.sampleHnt);
  if (item.sampleJxli === 1) activeItems.push(statusMap.sampleJxli);
  if (item.sampleDljc === 1) activeItems.push(statusMap.sampleDljc);
  if (item.sampleLt === 1) activeItems.push(statusMap.sampleLt);
  // console.log(activeItems);
  // 拼接成字符串（如 "板，电梯井，楼梯"）
  // return activeItems.join("，");
  return activeItems;
}
export default {
  data() {
    return {
      fenbaoCompany: "",
      fenbaoDirector: "",
      fenbaoTechnical: "",
      shigongRule: "",
      yanshouRule: "",
      Subcontractor: "",
      inspectCapacity: [
        {
          itemName: "",
          number: 0,
          other: "",
        },
      ],
      // 默认行模板（用于重置）
      defaultRow: { itemName: "", number: 0, other: "" },
      capactity: "请编辑检验批容量",
      shejizhi: "请编辑设计值",
      optionsEdit: [
        {
          value: "选项1",
          label: "墙",
        },
        {
          value: "选项2",
          label: "板",
        },
        {
          value: "选项3",
          label: "梁",
        },
        {
          value: "选项4",
          label: "柱",
        },
        {
          value: "选项5",
          label: "电梯井",
        },
        {
          value: "选项6",
          label: "钢筋",
        },
        {
          value: "选项7",
          label: "混凝土",
        },
        {
          value: "选项8",
          label: "机械连接",
        },
        {
          value: "选项9",
          label: "独立基础",
        },
      ],
      // distribute: "", // 状态选择器值
      gridData: [
        {
          position: "",
          value: "",
        },
      ],
      dialogTableVisible1: false,
      tableData: [
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          value: "",
          sum: "6",
          min: "全",
        },
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          value: "",
          sum: "6",
          min: "全",
        },
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          value: "",
          sum: "6",
          min: "全",
        },
        {
          isChecked: false,
          project: "钢筋力学性能和重量偏差检验",
          require: "第5.2.1条",
          value: "",
          sum: "6",
          min: "全",
        },
      ],
      options: [],
      distribute: "", // 状态选择器值
      dialogTableVisible2: false,
      taskId:0,
    };
  },
  computed: {
    status() {
      return this.$route.query.status;
    },
    curId(){
      return this.$route.query.taskId
    },
    rowData() {
      return this.$store.state.collection.currentRowData;
    },
  },
  created() {
    //根据id号,发送请求，从后端获取数据。(待写)
    this.getData();
    this.getAllCollector();
    //将后端的数据 传递给data中
  },
  mounted(){
    console.log("row",this.row)
  },
  methods: {
    async getData() {
      try {
        // console.log("this.curId",this.curId)
        const res = await getAssignData(this.curId);
        if (res.code == "200") {
          console.log("待分发数据", res);
          this.taskId=res.result.taskId;
          this.yanshouRule=res.result.yanshouRule
          const items = res.result.inspectItemModel;
          this.tableData = items.map((item) => ({
            ...item, // 保留原始属性
            totalText: getStatusText(item), // 新增状态文本
            totalSampleNumber: 0,
            minSampleNumber: 0,
            isEmpty:0,//是否采样 0-不采样
            positionId:null,//分发岗位Id
          }));
          console.log("this.tableData ", this.tableData);
        } else {
          this.$message.error("获取待分发数据失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("操作失败", error);
      }
    },
    async getAllCollector() {
      try {
        const res = await getAllCollector();
        if (res.code == "200") {
          console.log("采集员角色", res);
          this.options = res.result.map((role) => ({
            value: role.roleId.toString(), // 根据需求决定是否转字符串
            label: role.roleName,
          }));
        } else {
          this.$message.error("获取采集员角色失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("操作失败", error);
      }
    },
    //编辑检验批容量
    editCapactity() {
      this.dialogTableVisible1 = true;
    },
    // 添加新行
    addRow() {
      this.inspectCapacity.push({
        itemName: "", // 与下拉选择绑定
        number: null, // 与数字输入绑定
        other: "", // 与其他信息绑定
      });
    },
    // 删除行
    deleteRow(index) {
      this.inspectCapacity.splice(index, 1);
    },
    confirmCapactity() {
      this.dialogTableVisible1 = false;
      const result = this.inspectCapacity
        .filter((row) => row.itemName && row.number)
        .map((row) => `${row.itemName}${row.number}批`)
        .join("；");
      console.log(result);
      //页面中检验批容量 显示
      this.capactity = result;
      console.log("this.inspectCapacity", this.inspectCapacity);

      //要修改表格中的样本总数和最小抽样批量
      //1.要清除已存在的数据
      this.tableData.forEach((item) => {
        item.totalSampleNumber = 0;
        item.minSampleNumber = 0;
      });

      this.inspectCapacity.forEach((capacityItem) => {
        const itemName = capacityItem.itemName;
        const number = capacityItem.number;
        // 在tableDate数组中查找
        const exists = this.tableData.some((tableItem) => {
          // 确保totalText存在且是数组
          if (tableItem.totalText.includes(itemName)) {
            //样本总数=检验批内容中存在的来源的总和，不存在就不计算
            tableItem.totalSampleNumber += number;
            //最小抽样批量计算
            if (tableItem.minSampleRule === 1) {
              tableItem.minSampleNumber = tableItem.totalSampleNumber;
            } else if (tableItem.minSampleRule === 2) {
              //按批次
              tableItem.minSampleNumber += tableItem.minSample;
            } else if (tableItem.minSampleRule === 3) {
              //按比例
              const n = number * tableItem.partMinPercentage;
              if (n < tableItem.minSample) {
                tableItem.minSampleNumber += tableItem.minSample;
              } else {
                tableItem.minSampleNumber += n;
              }
            } else if (tableItem.minSampleRule === 4) {
              //X
              tableItem.minSampleNumber += number / tableItem.checkPer;
            }
            console.log(tableItem.minSampleRule, tableItem.minSampleNumber);
          }
        });
      });
    },
    cancelCapactity() {
      this.dialogTableVisible1 = false;
      this.inspectCapacity = [JSON.parse(JSON.stringify(this.defaultRow))];
    },
    rowClassName({ row }) {
      return row.isChecked ? "checked-row" : "unchecked-row";
    },
    //设计值编辑
    editDesignValue() {
      this.dialogTableVisible2 = true;
    },
    addDesign() {
      this.gridData.push({});
    },
    deleteDesignRow(index) {
      this.gridData.splice(index, 1);
    },
    confirmDesignValue() {
      this.dialogTableVisible2 = false;
      const result = this.gridData
        .filter((row) => row.position && row.value)
        .map((row) => `${row.position}:${row.value} `)
        .join("；");
      console.log(result);
      //页面中检验批容量 显示
      this.shejizhi= result;
      console.log("设计值", this.gridData);
    },
    cancelDssignValue() {
      this.dialogTableVisible2 = false;
    },
    //分发按钮
    async distributeTask(){
      //整理数据
      const resultDate={}
      resultDate.taskId=this.taskId
      resultDate.fenbaoCompany=this.fenbaoCompany
      resultDate.fenbaoDirector=this.fenbaoDirector
      resultDate.fenbaoTechnical=this.fenbaoTechnical
      resultDate.shigongRule=this.shigongRule

      const taskInspectBatchVolumeList=this.inspectCapacity.map(({
          itemName:sourceName,number:volume,other:info,
        })=>({  
          sourceName,volume,info,
           // 添加固定值属性
          batchId: null,
          taskId: this.taskId,
        }))

      const processData = (originalData) => {
        return originalData.map(item => {
          // 通过解构赋值提取需要的属性，并用冒号(:)重命名
          const {
            totalSampleNumber: sampleAmount,        // 将原 totalSampleNumber属性重命名为sampleAmount
            variableMeaning: variableValue,    // 将原name属性重命名为userName
            passThresh:passRate,
            isEmpty,
            positionId,
            inspectItemId,
            minSampleNumber:minSample,
          } = item;
          const taskId=this.taskId
          const taskItemId=null
          const checkRecord=null
          const isFinished=0
          const minSampleInfo=null
          const collectedAmount=0 
          return { taskItemId,taskId,inspectItemId,isEmpty,positionId,sampleAmount, variableValue, minSample,minSampleInfo,collectedAmount,isFinished, passRate,checkRecord};
        });
      };
      const taskItemList=processData(this.tableData);
      const designValue = JSON.stringify(this.gridData);
      resultDate.taskInspectBatchVolumeList = taskInspectBatchVolumeList;
      resultDate.taskItemList = taskItemList;
      resultDate.designValue = designValue;
      console.log('最终resultDate：', resultDate);
      try {
        let res= await distribution(resultDate)
        if (res.code==200){
           this.$message.success("任务发送成功！");
           //分发成功更改任务状态
        }else {
          this.$message.error("任务发送失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("操作失败", error);
      }
    },
    //取消分发
    cancelDistributeTask(){
         this.$router.push({
          name: "CollectionManage",
        });
    },
    //选择台账
    importLedger(){
      console.log("选择台账")
    }
  },
};
</script>
<style scoped>
.equal-height-row {
  display: flex;
  align-items: stretch; /* 让每个列的高度一致 */
}

.equal-height-row >>> .el-col {
  display: flex;
  flex-direction: column;
}

.card-box {
  flex: 1; /* 让 card 撑满列的高度 */
  display: flex;
  flex-direction: column;
}
</style>

<style>
/* 被选中时颜色 */
/* .checked-row{
  color: #999999;
} */
/* 未被选中时颜色 */
.unchecked-row {
  color: #a9a9a9;
}
.spaced-row {
  display: flex;
  margin-top: 1em; /* 调整行距，例如 20px */
}

.sub-card.card-item {
  background-color: red;
  display: flex;
}

.sub-card.card-item-name .el-input__inner {
  height: 1em; /* 输入框撑满高度 */
}
/* 添加在组件的 <style> 部分或全局 CSS 中 */
.capacity-text {
  display: inline-block; /* 必须设置为块级元素 */
  max-width: 10em; /* 根据实际布局调整最大宽度 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 禁止换行 */
  vertical-align: middle; /* 垂直对齐 */
}
</style>