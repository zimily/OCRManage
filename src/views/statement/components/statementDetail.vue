<template>
  <div>
    <div class="container">
      <div class="title">
        <span>数据采集评估报告</span>
      </div>
      <div class="name">
        <div class="sp1">项目名称：{{ projectName }}</div>
        <div class="sp2">检验批名称：{{ batchName }}</div>
      </div>
      <div>
        <el-table
          :data="info"
          style="width: 100%"
          border
          :span-method="mergeTypeColumn"
        >
          <el-table-column
            label="类型"
            align="center"
            prop="type"
          ></el-table-column>
          <el-table-column
            label="验收项目"
            align="center"
            prop="name"
          ></el-table-column>
          <el-table-column
            label="设计要求"
            align="center"
            prop="standard"
          ></el-table-column>
          <el-table-column
            label="样本总数"
            align="center"
            prop="sampleSize"
          ></el-table-column>
          <el-table-column
            label="最小抽样数量"
            align="center"
            prop="minSample"
          ></el-table-column>
          <el-table-column
            label="实际抽样数量"
            align="center"
            prop="actSampleNum"
          ></el-table-column>
          <el-table-column
            label="检查记录"
            align="center"
            prop="record"
          ></el-table-column>
          <el-table-column
            label="检查结果"
            align="center"
            prop="result"
          ></el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 10px">
        报告日期：
        <el-date-picker v-model="value1" type="date" placeholder="选择日期">
        </el-date-picker>
      </div>
      <div>
        说明：
        <el-input
          type="textarea"
          :rows="5"
          width="100"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
      </div>
      <div style="margin-top: 10px">
        <el-button @click="quxiao()">取消</el-button>
        <el-button type="primary" @click="success()">生成报告</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectName: "蓬莱嘉园1#楼建设项目",
      batchName: "1#楼东1-7/A-F三层墙柱-现浇结构外观及尺寸偏差",
      info: [
        {
          name: "外观质量",
          type: "主控",
          standard: "第8.2.1条",
          minSample: "全",
          sampleSize: "50",
          actSampleNum: "50",
          record: "全数检查，混凝土无严重缺陷",
          result: "合格",
        },
        {
          name: "影响结构性能或使用功能的尺寸偏差",
          type: "主控",
          standard: "第8.3.1条",
          minSample: "全",
          sampleSize: "50",
          actSampleNum: "50",
          record: "全数检查，无影响结构性能或使用功能的尺寸偏差",
          result: "合格",
        },
        {
          name: "轴线位置：墙，柱，梁",
          type: "一般",
          standard: "<8",
          minSample: "6",
          sampleSize: "50",
          actSampleNum: "6",
          record:
            "柱共30件，抽查柱3件：抽查3处，合格3处；墙共20间，抽查墙3间：合格3处",
          result: "100%",
        },
        {
          name: "垂直度-层高<6m",
          type: "一般",
          standard: "10",
          minSample: "4",
          sampleSize: "4",
          actSampleNum: "4",
          record: "共计4个角点，全数检查，4个角点合格",
          result: "100%",
        },
        {
          name: "截面尺寸-柱，梁，板，墙",
          type: "一般",
          standard: "-5，+10",
          minSample: "6",
          sampleSize: "50",
          actSampleNum: "6",
          record:
            "柱共30件，抽查柱3件：抽查3处，合格3处；墙共20间，抽查墙3间：抽查9处，合格9处",
          result: "100%",
        },
        {
          name: "电梯井-中心线位置",
          type: "一般",
          standard: "10",
          minSample: "全",
          sampleSize: "5",
          actSampleNum: "5",
          record: "5间全数检查：抽查5处，合格5处",
          result: "100%",
        },
        {
          name: "表面平整度",
          type: "一般",
          standard: "8",
          minSample: "6",
          sampleSize: "50",
          actSampleNum: "6",
          record:
            "柱共30件，抽查柱3件：抽查3处，合格3处；墙共20间，抽查墙3间：抽查9处，合格9处",
          result: "100%",
        },
      ],
      spanArr: [], // 需要合并的行数
      pos: 0, // 索引
      value1: "",
      textarea: "",
    };
  },
  mounted() {
    this.getSpanArr();
  },
  methods: {
    getSpanArr() {
      // 遍历数据
      for (let i = 0; i < this.info.length; i++) {
        // 如果是第一个数据，就将列表spanArr添加一个1，表示暂时只有一个名字相同的、且将索引pos赋值为0
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (this.info[i].type === this.info[i - 1].type) {
            // 如果相同就将索引为 pos 的值加一
            this.spanArr[this.pos] += 1;
            // 且将数组添加 0
            this.spanArr.push(0);
          } else {
            // 如果元素不同了，就可以通过索引为 pos 的值知晓应该需要合并的行数
            // 同时，我们再次添加一个值1，表示重新开始判断重复姓名的次数
            this.spanArr.push(1);
            // 同时 索引加一
            this.pos = i;
          }
        }
      }
      console.log("索引数组：");
      console.log(this.spanArr);
    },
    mergeTypeColumn({ row, column, rowIndex, columnIndex }) {
      /* 此方法总共运行次数与有几列几行有关，如果有5列30行，那么都是从0开始作为第一行第一列，
      (行，列):0,0 0,1 0,2 0,3 0,4 0,5 1,0...*/
      // 0,1,5表示需要处理 第 1，2，5列的行进行合并处理
      if (columnIndex === 0) {
        /* 
        将需要合并的行数赋值给 _row，注意这里由上一个方法的输出可以知道，这里的值可以是 3或者0
        当为 3 时，表示将当下的第 rowIndex+1 行与第 columnIndex+1 列所指向的单元格向下合并 _row 格
        当为 0 时，表示将当下的第 rowIndex+1 行与第 columnIndex+1 列所指向的单元格隐藏
        */
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    quxiao() {
      const isShow = true;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    success() {
      const isShow = true;
      const data = { isShow };
      this.$emit("transmit", data);
    },
  },
};
</script>

<style>
.title {
  display: flex;
}
.title > span {
  font-size: 30px;
  margin: auto;
}
.name {
  margin-left: 50px;
  margin-block: 20px;
}
.sp1 {
  margin-top: 10px;
}
.sp2 {
  margin-top: 10px;
}
</style>