<template>
  <div>
    <!-- 根据类别控制按钮显示 -->
    <el-row style="margin-bottom: 20px" v-if="showMaterialButtons">
      <el-button
        type="primary"
        @click="dialogTableVisible = true"
        style="margin-right: 20px"
        >选择物资平台数据</el-button
      >
      <el-button type="primary">二维码扫描</el-button>
    </el-row>

    <!-- 物资选择对话框 -->
    <el-dialog title="选择物资平台数据" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column label="选择" width="60" fixed>
          <template slot-scope="scope">
            <el-radio
              v-model="selectedMaterial"
              :label="scope.row.id"
              @change="handleMaterialSelect(scope.row)"
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          label="物资名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="provider"
          label="供应商"
          width="150"
        ></el-table-column>
        <el-table-column
          property="specification"
          label="规格"
          width="150"
        ></el-table-column>
        <el-table-column
          property="part"
          label="工程部位"
          width="150"
        ></el-table-column>
        <el-table-column
          property="num"
          label="入库数量"
          width="150"
        ></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMaterialSelection"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <div class="scrollable-content">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card class="pro-card">
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">项目名称</div>
              </el-col>
              <el-col :span="14">
                <el-select v-model="value1" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">单位工程（栋）</div>
              </el-col>
              <el-col :span="14">
                <el-select v-model="value2" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">施工单位</div>
              </el-col>
              <el-col :span="14">
                <div class="card-item-name">{{ constructionUnit }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">建设单位</div>
              </el-col>
              <el-col :span="14">
                <div class="card-item-name">{{ developmentUnit }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">工程号</div>
              </el-col>
              <el-col :span="14">
                <div class="card-item-name">{{ projectNumber }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">钢筋种类</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="steelType"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">生产厂家</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="manufacturer"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">炉批号</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="batchNumber"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">公称直径</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="nominalDiameter"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">抗震等级</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="seismicGrade"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">进场批量</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="incomingBatch"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">送检数量（组）</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="inspectionQuantity"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">本单位工程数量（吨）</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="projectQuantity"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">使用部位</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="usageLocation"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">本组试件分表数量</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="specimenQuantity"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="9">
          <el-card class="pro-card">
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">进场日期</div>
              </el-col>
              <div class="block">
                <el-date-picker
                  v-model="entryDate"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                >
                </el-date-picker>
              </div>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">见证日期</div>
              </el-col>
              <div class="block">
                <el-date-picker
                  v-model="witnessDate"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                >
                </el-date-picker>
              </div>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">送样日期</div>
              </el-col>
              <div class="block">
                <el-date-picker
                  v-model="sampleDate"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                >
                </el-date-picker>
              </div>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">报告日期</div>
              </el-col>
              <div class="block">
                <el-date-picker
                  v-model="reportDate"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                >
                </el-date-picker>
              </div>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">验收规范</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="acceptanceSpecification"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">报告编号</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="reportNumber"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">监督号</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="supervisionNumber"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">检测单位</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="testingUnit"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">委托单位</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="clientUnit"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">委托编号</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="clientNumber"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">见证单位</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="witnessUnit"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">见证人</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="witnessPerson"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">送样人</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="samplePerson"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="2" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">检验类别</div>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="inspectionType"
                  placeholder="请输入"
                  class="card-item-name"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="7">
          <el-card class="pro-card">
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">屈服强度（MPa）</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="yieldStrength1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="yieldStrength2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="yieldStrength3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">抗拉强度（MPa）</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="tensileStrength1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="tensileStrength2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="tensileStrength3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">伸长率（%）</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="elongation1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="elongation2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="elongation3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">总伸长率（%）</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="totalElongation1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="totalElongation2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="totalElongation3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">强屈比</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="strengthRatio1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="strengthRatio2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="strengthRatio3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">超屈比</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="yieldRatio1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="yieldRatio2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="yieldRatio3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">弯曲压头直径（mm）</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="bendingDiameter1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="bendingDiameter2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="bendingDiameter3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">弯曲角度（°）</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="bendingAngle1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="bendingAngle2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="bendingAngle3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="spaced-row">
              <el-col :span="10">
                <div class="card-item">结果</div>
              </el-col>
              <el-col :span="14">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input
                      v-model="result1"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="result2"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      v-model="result3"
                      placeholder=""
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>

      <div class="footer-buttons">
        <el-button type="primary">保存</el-button>
        <el-button @click="changeIndex()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedMaterial: null, // 当前选中的物资索引
      selectedMaterialData: null, // 当前选中的物资数据
      gridData: [
        {
          id: 1,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
        {
          id: 2,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
        {
          id: 3,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
        {
          id: 4,
          name: "三级螺纹钢",
          provider: "",
          specification: "HRB400",
          part: "",
          num: 6.825,
        },
      ],
      dialogTableVisible: false,
      options1: [
        {
          value: "选项1",
          label: "A",
        },
        {
          value: "选项2",
          label: "B",
        },
        {
          value: "选项3",
          label: "C",
        },
        {
          value: "选项4",
          label: "C",
        },
        {
          value: "选项5",
          label: "D",
        },
      ],
      value1: "",
      options2: [
        {
          value: "选项1",
          label: "E",
        },
        {
          value: "选项2",
          label: "F",
        },
        {
          value: "选项3",
          label: "G",
        },
        {
          value: "选项4",
          label: "H",
        },
        {
          value: "选项5",
          label: "I",
        },
      ],
      value2: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      // 项目基本信息
      projectName: "",
      buildingNumber: "",
      projectOptions: [],
      buildingOptions: [],
      constructionUnit: "",
      developmentUnit: "",
      projectNumber: "",
      // 钢筋信息
      steelType: "",
      manufacturer: "",
      batchNumber: "",
      nominalDiameter: "",
      seismicGrade: "",
      incomingBatch: "",
      inspectionQuantity: "",
      projectQuantity: "",
      usageLocation: "",
      specimenQuantity: "",
      // 日期信息
      entryDate: "",
      witnessDate: "",
      sampleDate: "",
      reportDate: "",
      // 规范与编号
      acceptanceSpecification: "",
      reportNumber: "",
      supervisionNumber: "",
      testingUnit: "",
      clientUnit: "",
      clientNumber: "",
      witnessUnit: "",
      witnessPerson: "",
      samplePerson: "",
      inspectionType: "",
      // 检测数据
      yieldStrength1: "",
      yieldStrength2: "",
      yieldStrength3: "",
      tensileStrength1: "",
      tensileStrength2: "",
      tensileStrength3: "",
      elongation1: "",
      elongation2: "",
      elongation3: "",
      totalElongation1: "",
      totalElongation2: "",
      totalElongation3: "",
      strengthRatio1: "",
      strengthRatio2: "",
      strengthRatio3: "",
      yieldRatio1: "",
      yieldRatio2: "",
      yieldRatio3: "",
      bendingDiameter1: "",
      bendingDiameter2: "",
      bendingDiameter3: "",
      bendingAngle1: "",
      bendingAngle2: "",
      bendingAngle3: "",
      result1: "",
      result2: "",
      result3: "",
      // 模拟接口返回延迟
      mockDelay: 300,
    };
  },
  props: {
    index: Number,
    category:String,
  },
  computed: {
    categoryText() {
      const map = {
        raw: "钢筋原材",
        connection: "钢筋机械连接",
        weld: "钢筋焊接",
        beton: "混凝土强度",
      };
      return map[this.category] || "未知类别";
    },
    // 控制物资相关按钮的显示
    showMaterialButtons() {
      return this.category === "raw";
    },
  },
  watch: {
  },
  mounted(){
    console.log("ledgerEntry",this.category)
  },
  methods: {
    handleMaterialSelect(row) {
      // 处理物资选择
      this.selectedMaterialData = row;
      // 自动填充表单字段
      this.steelType = row.name;
      this.manufacturer = row.provider;
      this.nominalDiameter = row.specification;
    },
    confirmMaterialSelection() {
      // 确认选择并关闭对话框
      if (this.selectedMaterialData) {
        // 可以添加其他处理逻辑
      }
      this.dialogTableVisible = false;
    },
    //取消按钮，同时向父组件传参，
    changeIndex() {
      this.$emit("update-index", 0);
    },
  },
};
</script>

<style>
.ledger-entry-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 占满整个视口高度 */
  padding: 20px;
  box-sizing: border-box;
}

.scrollable-content {
  flex: 1;
  /* 占据剩余空间 */
  overflow-y: auto;
  /* 添加垂直滚动条 */
  padding-bottom: 20px;
  /* 为底部按钮留出空间 */
}

.footer-buttons {
  margin-right: 8px;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 10px;
}

.spaced-row {
  margin-bottom: 5px;
}
</style>