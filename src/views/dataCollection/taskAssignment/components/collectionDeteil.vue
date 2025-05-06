<template>
  <div>
    <div>数据采集设置与发布</div>
    <div>
      <el-table :data="info" style="width: 100%" border>
        <el-table-column
          label="指标名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="标准值"
          prop="standardValue"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="规则"
          prop="rule"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="参数"
          prop="parameter"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          label="是否采样"
          prop="collection"
          align="center"
          width="50"
        >
          <template slot-scope="scope">
            <!-- 两种情况的选择 可选/必选 -->
            <div v-if="scope.row.collection === ''">
              <el-checkbox :value="true" disabled></el-checkbox>
            </div>
            <div v-else>
              <el-checkbox v-model="scope.row.collection"></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="代表批量"
          prop="sampleSize"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column label="分发岗位" align="center" prop="post">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.post">
              <el-radio :label="1">混凝土-目测</el-radio>
              <el-radio :label="2">混凝土-尺测</el-radio>
              <el-radio :label="3">钢筋连接</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="demo">
      <span>检验批容量：</span>
      <el-input
        v-model="capacity"
        placeholder="请输入内容"
        size="small"
        style="flex-grow: 1; max-width: 200px"
      ></el-input>
    </div>
    <div class="demo1">
      <el-button @click="quxiao">取消</el-button>
      <el-button type="primary" @click="assign">分发</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: [
        {
          name: "外观质量",
          standardValue: "-",
          rule: "是否合格",
          parameter: "-",
          collection: "", //三种状态
          sampleSize: 50,
          post: 1,
        },
        {
          name: "影响结构性能或使用功能的尺寸偏差",
          standardValue: "-",
          rule: "是否合格",
          parameter: "-",
          collection: "",
          sampleSize: 50,
          post: 1,
        },
        {
          name: "外观质量一般缺陷",
          standardValue: "-",
          rule: "是否合格",
          parameter: "-",
          collection: true,
          sampleSize: 50,
          post: 2,
        },
        {
          name: "轴线位置-墙，柱，梁",
          standardValue: "-",
          rule: "是否合格",
          parameter: "-",
          collection: true,
          sampleSize: 50,
          post: 2,
        },
        {
          name: "垂直度-层高<6cm",
          standardValue: "50",
          rule: "是否合格",
          parameter: "-",
          collection: false,
          sampleSize: 50,
          post: 3,
        },
        {
          name: "垂直度-层高>6cm",
          standardValue: "20",
          rule: "是否合格",
          parameter: "-",
          collection: false,
          sampleSize: 50,
          post: 3,
        },
        {
          name: "垂直度-全高<300m",
          standardValue: "15",
          rule: "是否合格",
          parameter: "-",
          collection: false,
          sampleSize: 50,
          post: 3,
        },
      ],
      capacity: "",
    };
  },
  methods: {
    assign() {
      const isShow = true;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    quxiao() {
      const isShow = true;
      const data = { isShow };
      this.$emit("transmit", data);
    },
  },
};
</script>

<style>
.demo {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.demo1{
  margin-top: 10px;
}
</style>