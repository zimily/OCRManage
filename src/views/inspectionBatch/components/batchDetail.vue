<template>
  <div>
    <!-- 验收规范 -->
    <el-card :body-style="{ padding: '20px' }">
      <el-form
        :inline="true"
        :model="batchInformation"
        class="demo-form-inline"
      >
        <el-form-item label="类别">
          <el-input
            v-model="batchInformation.name"
            placeholder="输入类别名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="验收依据">
          <el-input
            v-model="batchInformation.constructionBasis"
            placeholder="输入验收依据"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="基于已有规范">
          <el-input
            v-model="batchInformation.acceptanceCriteria"
            placeholder="输入已有规范"
            style="width: 400px"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 验收规范细则 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" icon="el-icon-plus" style="margin: 10px 10px" @click="addRule()"
        >添加规则</el-button
      >
      <!-- 指标表格 -->
      <el-table :data="batchInformation.indices" style="width: 100%" border>
        <el-table-column
          type="index"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="验收项目" align="center">
        </el-table-column>
        <el-table-column prop="rule" label="规则" align="center" width="100">
        </el-table-column>
        <el-table-column
          prop="standard"
          label="标准值或规范"
          align="center"
          width="130"
        >
        </el-table-column>
        <el-table-column prop="X" label="参数含义" align="center" width="100">
        </el-table-column> 
         <el-table-column prop="unit" label="单位" align="center" width="80">
        </el-table-column> 
        <el-table-column prop="proType" label="项目类型" align="center" width="100">
        </el-table-column>
         <el-table-column prop="dataType" label="数据类型" align="center" width="100">
        </el-table-column>
        </el-table-column>
        <el-table-column
          prop="qualication"
          label="合格率阈值"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="totalSamples"
          label="样本总数"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="minSample"
          label="最小抽样批量"
          align="center"
          width="200"
        >
         </el-table-column>
        <el-table-column prop="prop" label="操作" align="center" width="250">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateRule()"
            >编辑规则</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteRule()"
            >删除规则</el-button
          >
        </el-table-column>
      </el-table>
      <!-- 保存按钮 -->
      <div style="margin-top: 10px">
        <el-button type="primary" @click="addBatch">保存</el-button>
        <el-button @click="quxiao">取消</el-button>
      </div>
    </el-card>

   <!-- 弹窗 -->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="验收项目" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规则" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.rule" autocomplete="off"></el-input> -->
           <el-select v-model="form.rule" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准值或规范" :label-width="formLabelWidth">
          <el-input v-model="form.standard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数含义" :label-width="formLabelWidth">
          <el-input v-model="form.X" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位" :label-width="formLabelWidth">
          <el-input v-model="form.unit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" :label-width="formLabelWidth">
          <el-input v-model="form.proType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" :label-width="formLabelWidth">
          <el-input v-model="form.dataType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="合格率阈值" :label-width="formLabelWidth">
          <el-input v-model="form.qualication" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="样本总数为空" :label-width="formLabelWidth">
           <el-radio v-model="form.flag" :label="true">是</el-radio>
           <el-radio v-model="form.flag" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="样本总数来源" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.checkList">
            <el-checkbox label="墙"></el-checkbox>
            <el-checkbox label="板"></el-checkbox>
            <el-checkbox label="梁"></el-checkbox>
            <el-checkbox label="柱"></el-checkbox>
            <el-checkbox label="电梯井"></el-checkbox>
            <el-checkbox label="钢筋"></el-checkbox>
            <el-checkbox label="混凝土"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="最小抽样规则" :label-width="formLabelWidth">
          <el-select v-model="form.minSampleTye" placeholder="请选择抽样规则" style="width: 100%;">
          <el-option label="全数检查" value="all"></el-option>
          <el-option label="按比例抽样" value="ratio"></el-option>
          <el-option label="按批次抽样" value="batch"></el-option>
          <el-option label="满X抽1" value="everyX"></el-option>
        </el-select>
        </el-form-item>
         <!-- 动态表单内容 -->
        <template v-if="form.minSampleTye === 'ratio'">
          <el-form-item label="抽取比例" :label-width="formLabelWidth">
            <el-input v-model="form.ratioPercent" placeholder="请输入百分比" suffix="%"></el-input>
          </el-form-item>
          <el-form-item label="不少于" :label-width="formLabelWidth">
            <el-input v-model="form.ratioMin" placeholder="请输入最少抽取数量" suffix="处"></el-input>
          </el-form-item>
        </template>

        <template v-else-if="form.minSampleTye === 'batch'" >
          <el-form-item label="每批抽" :label-width="formLabelWidth">
            <el-input v-model="form.batchCount" placeholder="请输入每批抽取个数" suffix="个"></el-input>
          </el-form-item>
        </template>

        <template v-else-if="form.minSampleTye === 'everyX'" >
          <el-form-item label="满X抽1" :label-width="formLabelWidth">
            <el-input v-model="form.everyX" placeholder="请输入X值" suffix="抽1"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSpecificationsById } from "@/api/specifications";
export default {
  name: "batchDetail",
  data() {
    return {
      batchInformation: {
        name: "混凝土现烧检验批",
        constructionBasis: "《混凝土结构工程施工规范》GB50066-2011",
        acceptanceCriteria: "《混凝土结构工程施工质量验收规范》GB50204-2015",
        indices: [
          {
            name: "外观质量",
            rule: "是否合格",
            standard: "第8.2.1条",
            X: "全高（mm）",
            unit: "mm",
            proType: "主控",
            minSample: "全部",
            dataType: "观察",
            totalSamples: "全",
            qualication: "100%",
          },
          {
            name: "尺寸偏差",
            rule: "小于等于",
            standard: "H/10000且≤80",
            X: "-",
            unit: "",
            proType: "一般",
            dataType: "测量",
            minSample: "10%且至少3处",
            totalSamples: "全",
            qualication: "100%",
          },
        ],
      },
      options: [
        {
          value: "选项1",
          label: "是否合格",
        },
        {
          value: "选项2",
          label: "小于等于",
        },
        {
          value: "选项3",
          label: "范围",
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
      form: {
        name: "尺寸偏差",
        rule: "小于等于",
        standard: "H/10000且≤80",
        X: "全高（mm）",
        unit: "mm",
        proType: "一般",
        dataType: "测量",
        flag: false, //样本数量是否为空格
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
        minSampleTye:"",
        minSample: "10%且至少3处",
        totalSamples: "全",
        qualication: "100%",
      },
      formLabelWidth: "120px",
    };
  },
  props: {
    curInspecId: {
      type: Number,
      required: true, // 或者 false，根据你的需求
    },
  },
  created() {
    this.getInpecInfo();
  },
  methods: {
    async getInpecInfo() {
      const id = parseInt(this.curInspecId);
      console.log("inspectItemId", id, typeof id);
      try {
        let res = await getSpecificationsById(id);
        if (res.code == 200) {
          console.log(res);
        } else {
          throw new Error(res.message || "获取验收规范失败");
        }
      } catch (error) {
        this.$message.error("出错啦，请稍后重试！");
        console.log(error);
      }
    },
    //保存按钮
    addBatch() {
      const isShow = true;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    //取消按钮
    quxiao() {
      const isShow = true;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    //添加规则按钮
    addRule() {
      this.dialogFormVisible = true;
      this.dialogFormTitle = "添加规则";
    },
    //编辑规则
    updateRule() {
      this.dialogFormVisible = true;
      this.dialogFormTitle = "编辑规则";
    },
    //删除规则按钮
    deleteRule() {},
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