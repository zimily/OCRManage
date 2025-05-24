<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card class="pro-card">
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="10">
              <div class="card-item">单位工程:</div>
            </el-col>
            <el-col :span="14">
              <div class="card-item-name">{{ unitProjectName }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="10">
              <div class="card-item">检验批部位:</div>
            </el-col>
            <el-col :span="14">
              <div class="card-item-name">{{ inspectionBatchLocation }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="10">
              <div class="card-item">检验批类别:</div>
            </el-col>
            <el-col :span="14">
              <div class="card-item-name">{{ inspectionBatchCategory }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="sub-card">
          <el-row :gutter="5" class="spaced-row">
            <el-col :span="8">
              <div class="card-item">分包单位</div>
            </el-col>
            <el-col :span="12">
              <el-input v-model="data1" placeholder="请输入分包单位" class="card-item-name" ></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="5" class="spaced-row">
            <el-col :span="8">
              <div class="card-item">分包单位项目负责人</div>
            </el-col>
            <el-col :span="12">
              <el-input v-model="data2" placeholder="请输入项目负责人" class="card-item-name" ></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="5" class="spaced-row">
            <el-col :span="8">
              <div class="card-item">分包单位技术负责人</div>
            </el-col>
            <el-col :span="12">
              <el-input v-model="data3" placeholder="请输入技术负责人" class="card-item-name" ></el-input>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="build-card">
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="6">
              <div class="card-item">施工规范</div>
            </el-col>
            <el-col :span="14">
             <el-input v-model="data4" placeholder="请输入施工规范"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="6">
              <div class="card-item">检验批容量</div>
            </el-col>
            <el-col :span="14">
              <div class="card-item-name">{{ inspectionBatchLocation }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="2" class="spaced-row">
            <el-col :span="6">
              <div class="card-item">验收规范</div>
            </el-col>
            <el-col :span="14">
              <div class="card-item-name">{{ data6 }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :row-class-name="rowClassName"
    >
      <!-- 复选框列 -->
      <el-table-column label="是否采集" width="80" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
        </template>
      </el-table-column>
      <!-- 其他列 -->
      <el-table-column
        prop="project"
        label="验收项目"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="require"
        label="设计要求及规范规定"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="value" label="变量的值" width="160" align="center">
      </el-table-column>
      <el-table-column prop="sum" label="样本总数" width="160" align="center">
      </el-table-column>
      <el-table-column
        prop="min"
        label="最小抽样批量"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="distribute"
        label="分发岗位"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.distribute"
            placeholder=""
            style="width: 150px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="设计值" align="center">
        <template slot-scope="scope">
          <el-button type="warning" @click="dialogTableVisible2 = true"
            >编辑</el-button
          >
          <!-- 设计值编辑弹窗 -->
          <!-- 每个编辑弹窗还没有对应每一行数据 -->
          <el-dialog title="设计值编辑" :visible.sync="dialogTableVisible2">
            <el-table :data="gridData">
              <el-table-column
                property="count"
                label="采样部位"
                width="220"
                align="center"
              >
                <el-input
                  v-model="Subcontractor"
                  placeholder=""
                  style="width: 200px"
                ></el-input>
              </el-table-column>
              <el-table-column
                property="count"
                label="设计值"
                width="220"
                align="center"
              >
                <el-input
                  v-model="Subcontractor"
                  placeholder=""
                  style="width: 200px"
                ></el-input>
              </el-table-column>
              <el-table-column property="operation" label="操作" align="center">
                <el-button type="danger">删除</el-button>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button type="primary">分发</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      unitProjectName: "保利心语佳苑1#楼",
      inspectionBatchLocation: " -2层1施工段墙柱",
      inspectionBatchCategory: "钢筋原材",
      data1:"",
      data2:"",
      data3:"",
      data4:"",
      data6:"《混凝土结构工程施工质量验收规范》GB50204-2015",
      Subcontractor: "",
      build: "",
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
      distribute: "", // 状态选择器值
      gridData: [
        {
          //
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
      options: [
        {
          value: "选项1",
          label: "台账采集员",
        },
        {
          value: "选项2",
          label: "测量采集员",
        },
      ],
      distribute: "", // 状态选择器值
      dialogTableVisible2: false,
    };
  },
  computed: {
    curId() {
      return this.$route.params.id;
    },
  },
  created() {
    //获取路径中携带的单位工程的id号
    // console.log(this.$route)
    console.log("任务分发", this.curId);
    //根据id号,发送请求，从后端获取数据。(待写)

    //将后端的数据 传递给data中
  },
  methods: {
    rowClassName({ row }) {
      return row.isChecked ? "checked-row" : "unchecked-row";
    },
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
</style>