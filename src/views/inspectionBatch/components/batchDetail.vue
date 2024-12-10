<template>
  <div>
    <!-- 检验批内容 -->
    <el-card :body-style="{ padding: '20px' }">
      <el-form
        :inline="true"
        :model="batchInformation"
        class="demo-form-inline"
      >
        <el-form-item label="检验批名称">
          <el-input
            v-model="batchInformation.name"
            placeholder="输入检验批名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="施工依据">
          <el-input
            v-model="batchInformation.constructionBasis"
            placeholder="输入施工依据"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="验收依据">
          <el-input
            v-model="batchInformation.acceptanceCriteria"
            placeholder="输入验收依据"
            style="width: 400px"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" icon="el-icon-plus" style="margin: 10px 10px"
        >添加指标</el-button
      >
      <!-- 指标表格 -->
      <el-table :data="batchInformation.indices" style="width: 100%" border>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          :span="1"
        ></el-table-column>
        <el-table-column prop="prop" label="指标名称" align="center">
          <!-- 需要在显示和输入状态切换
            插槽  并将父组件中的数据传递给子组件。 -->
          <template slot-scope="{ row, $index }">
            <el-input
              v-model="row.name"
              placeholder="请输入指标名称"
              v-if="row.flag"
              @blur="toLook(row, $index)"
              @keyup.native.enter="toLook(row, $index)"
              size="small"
            ></el-input>
            <span v-else @click="toEdit(row, $index)">
              {{ row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="规则" align="center" width="150">
          <template slot-scope="{ row, $index }">
            <el-select v-model="row.rule" placeholder="请选择规则" size="small">
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
        <el-table-column
          prop="standard"
          label="标准值或规范"
          align="center"
          :span="4"
        >
        </el-table-column>
        <el-table-column prop="X" label="参数X含义" align="center" width="150">
        </el-table-column> 
        <el-table-column prop="type" label="类型" align="center" width="200">
          <template slot-scope="{ row, $index }">
            <el-radio v-model="row.type" label="主控">主控</el-radio>
            <el-radio v-model="row.type" label="一般">一般</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="minSample"
          label="最小抽样批量"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="qualication"
          label="合格率阈值"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column prop="prop" label="操作" align="center" width="250">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="addRule()"
            >添加规则</el-button
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      batchInformation: {
        name: "混凝土现烧检验批",
        constructionBasis: "《混凝土结构工程施工规范》GB50066-2011",
        acceptanceCriteria: "《混凝土结构工程施工质量验收规范》GB50204-2015",
        indices: [
          {
            name: "外观质量",
            rule: "选项1",
            standard: "第8.2.1条",
            X: "全高（mm）",
            type: "主控",
            minSample: "全部",
            qualication: "100%",
            flag: false,
          },
          {
            name: "尺寸偏差",
            rule: "选项2",
            standard: "第8.2.1条",
            X: "-",
            type: "一般",
            minSample: "全部",
            qualication: "100%",
            flag: false,
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
    };
  },
  methods: {
    //由编辑状态跳转到查看状态
    toLook(row, index) {
      //   console.log('输入框在失去焦点后，变为查看模式',row,index)
      //input 消失 span 显示
      row.flag = false;
    },
    //由查看状态跳转到编辑状态
    toEdit(row, index) {
      // console.log('span点击事件',row,index)
      row.flag = true;
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
    addRule() {},
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