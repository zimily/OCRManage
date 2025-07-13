<template>
  <div>
    <!-- 验收规范 -->
    <el-card :body-style="{ padding: '20px' }">
      <el-form :inline="true" :model="subItem" class="demo-form-inline">
        <el-form-item label="类别:">
          <span class="display-value">{{ inspectTypeName }}</span>
        </el-form-item>
        <el-form-item label="验收依据：">
          {{ yanshouRule }}
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 验收规范细则 -->
    <el-card>
      <!-- 指标表格 -->
      <el-table :data="indices" style="width: 100%" border>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="itemName" label="验收项目" align="center">
        </el-table-column>
        <el-table-column prop="ruleType" label="规则" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.ruleType === 1">是否合格</span>
            <span v-else-if="scope.row.ruleType === 2">大于</span>
            <span v-else-if="scope.row.ruleType === 3">大于等于</span>
            <span v-else-if="scope.row.ruleType === 4">小于</span>
            <span v-else-if="scope.row.ruleType === 5">小于等于</span>
            <span v-else-if="scope.row.ruleType === 6">范围</span>
            <span v-else-if="scope.row.ruleType === 7">加减</span>
            <span v-else>未知规则</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleStandard" label="标准值或规范" align="center" width="130">
        </el-table-column>
        <el-table-column prop="variableMeaning" label="参数含义" align="center" width="100">
        </el-table-column>
        <el-table-column prop="dataUnit" label="单位" align="center" width="80">
        </el-table-column>
        <el-table-column prop="itemType" label="项目类型" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.itemType === 1">主控项目</span>
            <span v-else-if="scope.row.itemType === 2">一般项目</span>
            <span v-else>未知项目类型</span>
          </template>
        </el-table-column>
        <el-table-column prop="dataType" label="数据类型" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.ruleType === 1">目测</span>
            <span v-else-if="scope.row.ruleType === 2">尺量</span>
            <span v-else-if="scope.row.ruleType === 3">实验报告</span>
            <span v-else>未知数据类型</span>
          </template>
        </el-table-column>
        <el-table-column prop="passThresh" label="合格率阈值" align="center" width="100">
          <!-- :formatter="(row) => row.passThresh !== null ? (row.passThresh * 100) + '%' : 'N/A'" -->

        </el-table-column>
        <el-table-column prop="totalText" label="样本总数" align="center" width="80"
          :formatter="(row) => Array.isArray(row.totalText) ? row.totalText.join('、') : row.totalText">
        </el-table-column>
        <el-table-column prop="minSampleText" label="最小抽样批量" align="center" width="200">
        </el-table-column>
        <el-table-column prop="prop" label="操作" align="center" width="150">
          <template v-slot="scope">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateRule(scope)">编辑规则</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:10px">
        <el-button type="primary" @click="preserve">保存</el-button>
        <el-button type="info" @click="quxiao">取消</el-button>
      </div>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="验收项目" :label-width="formLabelWidth">
          <el-input v-model="form.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规则" :label-width="formLabelWidth">
          <el-select v-model="form.ruleType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准值或规范" :label-width="formLabelWidth">
          <el-input v-model="form.ruleStandard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数含义" :label-width="formLabelWidth">
          <el-input v-model="form.variableMeaning" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位" :label-width="formLabelWidth">
          <el-input v-model="form.dataUnit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" :label-width="formLabelWidth">
          <el-select v-model="form.itemType" placeholder="请选择">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型" :label-width="formLabelWidth">
          <el-select v-model="form.dataType" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合格率阈值" :label-width="formLabelWidth">
          <el-input v-model="form.passThresh" type="number" :min="0" :max="1" :step="0.01" autocomplete="off"
            @blur="handlePassThreshBlur"></el-input>
        </el-form-item>
        <el-form-item label="样本总数为空" :label-width="formLabelWidth">
          <el-radio v-model="form.totalSampleEmpty" :label="1" @change="handleTotalSampleEmptyChange">是</el-radio>
          <el-radio v-model="form.totalSampleEmpty" :label="0" @change="handleTotalSampleEmptyChange">否</el-radio>
        </el-form-item>
        <el-form-item label="样本总数来源" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.totalText" :disabled="isCheckboxGroupDisabled">
            <el-checkbox label="墙"></el-checkbox>
            <el-checkbox label="板"></el-checkbox>
            <el-checkbox label="梁"></el-checkbox>
            <el-checkbox label="柱"></el-checkbox>
            <el-checkbox label="电梯间"></el-checkbox>
            <el-checkbox label="钢筋"></el-checkbox>
            <el-checkbox label="混凝土"></el-checkbox>
            <el-checkbox label="机械连接"></el-checkbox>
            <el-checkbox label="独立基础"></el-checkbox>
            <el-checkbox label="楼梯"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="最小抽样数是否为空" :label-width="formLabelWidth">
          <el-radio v-model="form.minSampleEmpty" :label="1" @change="handleMinSampleEmptyChange">是</el-radio>
          <el-radio v-model="form.minSampleEmpty" :label="0" @change="handleMinSampleEmptyChange">否</el-radio>
        </el-form-item>
        <el-form-item label="最小抽样规则" :label-width="formLabelWidth">
          <el-select v-model="form.minSampleRule" placeholder="请选择抽样规则" :disabled="isCheckboxGroupDisabled1"
            style="width: 100%;">
            <el-option label="全数检查" :value="1"></el-option>
            <el-option label="按批次抽样" :value="2"></el-option>
            <el-option label="按比例抽样" :value="3"></el-option>
            <el-option label="满X抽1" :value="4"></el-option>
            <el-option label="总工设置" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <!-- 动态表单内容 -->
        <template v-if="form.minSampleRule === 2">
          <el-form-item label="每批抽" :label-width="formLabelWidth">
            <el-input v-model="form.minSample" placeholder="请输入每批抽取个数" suffix="个"
              :disabled="isCheckboxGroupDisabled1"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="form.minSampleRule === 3">
          <el-form-item label="抽取比例" :label-width="formLabelWidth">
            <!-- <el-input v-model="form.partMinPercentage" placeholder="请输入百分比" suffix="%"
              :disabled="isCheckboxGroupDisabled1"></el-input> -->
            <el-input v-model="form.partMinPercentage" type="number" :min="0" :max="1" :step="0.01" autocomplete="off"
              @blur="handlePassThreshBlur"></el-input>
          </el-form-item>
          <el-form-item label="不少于" :label-width="formLabelWidth">
            <el-input v-model="form.minSample" placeholder="请输入最少抽取数量" suffix="处"
              :disabled="isCheckboxGroupDisabled1"></el-input>
          </el-form-item>
        </template>

        <template v-else-if="form.minSampleRule === 4">
          <el-form-item label="满X抽1" :label-width="formLabelWidth">
            <el-input v-model="form.checkPer" placeholder="请输入X值" suffix="抽1"
              :disabled="isCheckboxGroupDisabled1"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSpecificationsById,
  getAllInspectType,
  updateInspectDetil,
} from "@/api/specifications";
import { mapState, mapGetters } from "vuex";
import { cloneDeep } from "lodash";
const statusMap = {
  sampleQiang: "墙",
  sampleBan: "板",
  sampleLiang: "梁",
  sampleZhu: "柱",
  sampleDtj: "电梯间",
  sampleGj: "钢筋",
  sampleHnt: "混凝土",
  sampleJxlj: "机械连接",
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
  if (item.sampleJxlj === 1) activeItems.push(statusMap.sampleJxlj);
  if (item.sampleDljc === 1) activeItems.push(statusMap.sampleDljc);
  if (item.sampleLt === 1) activeItems.push(statusMap.sampleLt);
  return activeItems;
}
const reverseStatusMap = {
  墙: "sampleQiang",
  板: "sampleBan",
  梁: "sampleLiang",
  柱: "sampleZhu",
  电梯间: "sampleDtj",
  钢筋: "sampleGj",
  混凝土: "sampleHnt",
  机械连接: "sampleJxlj",
  独立基础: "sampleDljc",
  楼梯: "sampleLt",
};
function setTextStatus(data) {
  const textArray = data.totalText;
  // 重置所有状态为0
  Object.keys(statusMap).forEach((key) => {
    data[key] = 0;
  });

  textArray.forEach((text) => {
    const propName = reverseStatusMap[text];
    if (propName) {
      data[propName] = 1;
    }
  });
  return data;
}
function getMinSampleText(item) {
  let text = "";
  if (!item) return text; // 防止item为null或undefined
  if (item.minSampleEmpty === 1) return text;

  const percentage = (item.partMinPercentage ?? 0) * 100 + "%"; // 处理 null 转换为百分比形式，如 0.1 → "10%"

  switch (item.minSampleRule) {
    case 1:
      text = "全";
      break;
    case 2:
      text = `每批抽${item.minSample}个`;
      break;
    case 3:
      if (item.minSample === 0 || item.minSample === null) {
        text = percentage; // 如 "10%"
      } else {
        text = `${percentage}且不少于${item.minSample}个`; // 如 "10%且不少于5个"
      }
      break;
    case 4:
      text = `满${item.checkPer}抽一`;
      break;
    case 5:
      text = "总工设置";
      break;
    default:
      text = ""; // 未知情况，返回空字符串
  }
  return text;
}
export default {
  name: "batchDetail",
  data() {
    return {
      options0: [//类别
      ],
      options: [
        {
          value: 1,
          label: "是否合格",
        },
        {
          value: 2,
          label: "大于",
        },
        {
          value: 3,
          label: "大于等于",
        },
        {
          value: 4,
          label: "小于",
        },
        {
          value: 5,
          label: "小于等于",
        },
        {
          value: 6,
          label: "范围",
        },
        {
          value: 7,
          label: "加减",
        },
      ],
      options1: [
        {
          value: 1,
          label: "主控项目",
        },
        {
          value: 2,
          label: "一般项目",
        },
      ],
      options2: [
        {
          value: 1,
          label: "目测",
        },
        {
          value: 2,
          label: "尺量",
        },
        {
          value: 3,
          label: "实验报告",
        },
      ],
      checkList: [
        "墙",
        "板",
        "梁",
        "柱",
        "电梯井",
        "钢筋",
        "混凝土",
        "机械连接",
        "独立基础",
      ],
      dialogFormVisible: false,
      dialogFormTitle: "",
      // inspectId:3,//当前验收细则对应的验收项目的ID
      form: this.getDefaultFormData(), //对话框数据  表单数据
      formLabelWidth: "120px",
      curIndex: 0, //表示当前所选的行号
      indices: [], //多条细则信息
      inspectTypeId: null, //类别对应的Id
      yanshouRule: "", //验收依据
      subItem: {
        name: "混凝土现烧检验批",
        constructionBasis: "《混凝土结构工程施工规范》GB50066-2011",
        acceptanceCriteria: "《混凝土结构工程施工质量验收规范》GB50204-2015",
      },
      isCheckboxGroupDisabled: false, // 添加计算属性控制 样本来源复选框组是否禁用
      isCheckboxGroupDisabled1: false, //最小抽样规则是否可用
    };
  },
  computed: {
    inspectId() {
      return this.$route.query.id;
    },
    inspectTypeName() {
      const inspectTypeName = this.options0.find(
        item => item.value === this.inspectTypeId
      );
      return inspectTypeName ? inspectTypeName.label : "未选择";
    }
    //访问vuex中的数据，
    //方式一
    // indices(){
    //   return this.$store.state.inspectionDetail.indices
    // }
    //方式二 mapState
    // 数组形式
    // ...mapState("inspectionDetail", ["subItem"]),
    // //方式三 getter
    // ...mapGetters(["indices"]),
    // 处理后的 indices 文本
    // formattedIndices() {
    //   console.log("原始 indices:", this.indices); // 先打印原始数据
    //   const result = this.indices.map((item) => ({
    //     ...item, // 保留原始属性
    //     statusText: getStatusText(item), // 新增状态文本
    //   }));
    //   console.log("计算后:", result);
    //   return result;
    // },
  },
  watch: {
    // 监听样本总数为空的变化
    "form.totalSampleEmpty": function (newVal) {
      if (newVal === 1) {
        // 选择"是"
        this.form.totalText = []; // 清空所有选中项
        this.isCheckboxGroupDisabled = true; // 禁用复选框组
      } else if (newVal === 0) {
        // 选择"否"
        this.isCheckboxGroupDisabled = false; // 启用复选框组
      }
    },
    "form.minSampleEmpty": function (newVal) {
      if (newVal === 1) {
        // 选择"是"
        this.form.minSampleText = []; // 清空所有选中项
        this.isCheckboxGroupDisabled1 = true; // 禁用复选框组
      } else if (newVal === 0) {
        // 选择"否"
        this.isCheckboxGroupDisabled1 = false; // 启用复选框组
      }
    },
  },
  created() {
    this.getInpecInfo();
    this.getInspectType();
  },
  mounted() { },
  methods: {
    // 提取默认表单数据为独立方法
    getDefaultFormData() {
      return {
        baseRule: "",
        checkPer: "",
        dataType: "",
        dataUnit: "",
        inspectId: "",
        inspectItemId: "",
        inspectTypeId: "",
        isAllcheck: "",
        itemName: "",
        itemType: "",
        items: "",
        minSample: "",
        minSampleEmpty: "",
        partMinPercentage: "",
        passThresh: "",
        ruleStandard: "",
        ruleType: "",
        sampleBan: "",
        sampleDljc: "",
        sampleDtj: "",
        sampleGj: "",
        sampleHnt: "",
        sampleJxlj: "",
        sampleLiang: "",
        sampleLt: "",
        sampleQiang: "",
        sampleZhu: "",
        totalSampleEmpty: "",
        variableMeaning: "",
        yanshouRule: "",
        totalText: [],
        minSampleText: [],
      };
    },
    reSetForm() {
      // 方法1：保持对象引用，只修改属性
      Object.keys(this.getDefaultFormData()).forEach((key) => {
        this.$set(this.form, key, this.getDefaultFormData()[key]);
      });
    },
    async getInpecInfo() {
      // const id = parseInt(this.curInspecId);
      try {
        let res = await getSpecificationsById(this.inspectId);
        if (res.code == 200) {
          console.log("全部细则", res);
          const items = res.result.items;
          this.inspectTypeId = res.result.inspectTypeId;
          this.yanshouRule = res.result.yanshouRule;
          this.isBasedOnExistingRule = res.result.isBasedOnExistingRule;
          this.indices = items.map((item) => ({
            ...item, // 保留原始属性
            totalText: getStatusText(item), // 新增状态文本
            minSampleText: getMinSampleText(item),
          }));
          // console.log("indices", this.indices);
        } else {
          throw new Error(res.message || "获取验收规则的全部细则失败");
        }
      } catch (error) {
        this.$message.error("出错啦，请稍后重试！");
        console.log(error);
      }
    },
    async getInspectType() {
      try {
        let res = await getAllInspectType();
        if (res.code == 200) {
          console.log("所有验收类别", res);
          // console.log(res.result)
          this.options0 = res.result.map((item, index) => ({
            value: item.inspectType,
            label: item.typeName,
          }));
          console.log(this.options0);
        } else {
          throw new Error(res.message || "获取所有验收类别信息失败");
        }
      } catch (error) {
        this.$message.error("出错啦，请稍后重试！");
        console.log(error);
      }
    },
    //编辑规则
    updateRule(value) {
      console.log("编辑细则", value.$index, value.row);
      this.dialogFormVisible = true;
      this.dialogFormTitle = "编辑规则";
      this.curIndex = value.$index;
      this.form = JSON.parse(JSON.stringify(value.row));
      console.log("this.form", this.form, typeof this.form.ruleType);
    },
    //弹窗的确认按钮
    confirm() {
      // console.log("确认按钮", this.dialogFormTitle,this.form.totalText, this.form);//神经  this.form为什么为空
      this.dialogFormVisible = false;
      if (
        this.curIndex.totalSampleEmpty === 1 &&
        this.curIndex.totalText.length > 0
      ) {
        this.$message.error("当样本总数为空时，不能选择样本来源");
        return false;
      }
      //数组中数据替换
      const formCopy = JSON.parse(JSON.stringify(this.form)); // 创建一个深拷贝，确保打印的是当前状态
      //将样本来源文本转换成对应的字段
      const data = setTextStatus(formCopy);
      //最小抽样规则 文字修改
      data.minSampleText = getMinSampleText(data);
      // 替换索引为 index 的数据
      this.$set(this.indices, this.curIndex, _.cloneDeep(data));
      console.log("编辑后this.indices", this.indices);
      this.reSetForm();
    },
    //弹窗取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.reSetForm();
    },

    //全部细则 保存按钮
    async preserve() {
      //整理需要保存的内容
      console.log("保存按钮", this.indices);
      const data = this.indices.map(
        ({
          inspectItemId,
          inspectId,
          itemName,
          ruleType,
          ruleStandard,
          variableMeaning,
          dataUnit,
          dataType,
          passThresh,
          itemType,
          minSampleEmpty,
          totalSampleEmpty,
          minSample,
          isAllCheck,
          partMinPercentage,
          checkPer,
          sampleQiang,
          sampleBan,
          sampleLiang,
          sampleZhu,
          sampleDtj,
          sampleGj,
          sampleHnt,
          sampleJxlj,
          sampleDljc,
          sampleLt,
          minSampleRule,
          inspectTypeId,
          yanshouRule,
          baseRule,
          items,
        }) => ({
          inspectItemId,
          inspectId,
          itemName,
          ruleType,
          ruleStandard,
          variableMeaning,
          dataUnit,
          dataType,
          passThresh,
          itemType,
          minSampleEmpty,
          totalSampleEmpty,
          minSample,
          isAllCheck,
          partMinPercentage,
          checkPer,
          sampleQiang,
          sampleBan,
          sampleLiang,
          sampleZhu,
          sampleDtj,
          sampleGj,
          sampleHnt,
          sampleJxlj,
          sampleDljc,
          sampleLt,
          minSampleRule,
          inspectTypeId,
          yanshouRule,
          baseRule,
          items,
        })
      );
      try {
        let res = await updateInspectDetil(data);
        if (res.code == 200) {
          this.$message.success("验收规范编辑成功!");
          //返回上 验收分项页面
          this.$router.push({
            path: "batchesManage",
          });
        } else {
          throw new Error(res.message || "验收规范编辑失败");
        }
      } catch (error) {
        this.$message.error("出错啦，请稍后重试！");
        console.log(error);
      }
    },
    //全部细则 取消按钮
    quxiao() {
      //返回上 验收分项页面
      this.$router.push({
        path: "batchesManage",
      });
    },
    // 单选按钮变更处理函数
    handleTotalSampleEmptyChange(value) {
      if (value === 1) {
        this.form.totalText = []; // 立即清空选中项
        this.isCheckboxGroupDisabled = true; // 立即禁用
      } else {
        this.isCheckboxGroupDisabled = false; // 立即启用
      }
    },
    handleMinSampleEmptyChange(value) {
      if (value === 1) {
        this.form.minSampleText = ""; // 立即清空选中项
        this.isCheckboxGroupDisabled1 = true; // 立即禁用
      } else {
        this.isCheckboxGroupDisabled1 = false; // 立即启用
      }
    },
    //弹窗中 合格率阈值
    handlePassThreshBlur() {
      if (this.form.passThresh < 0) {
        this.form.passThresh = 0;
      } else if (this.form.passThresh > 1) {
        this.form.passThresh = 1;
      }
    },
  },
};
</script>

<style scoped>
.demo-form-inline .el-form-item {
  margin-left: 100px;
  margin-top: 0px;
  margin-bottom: 10px;
}
</style>