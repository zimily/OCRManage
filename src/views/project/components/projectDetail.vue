<template>
  <div>
    <el-card>
      <span class="centered-text">项目详情信息</span>
    </el-card>
    <el-card>
      <!-- 项目相关信息 -->
      <el-form :model="info" label-width="150px" class="form">
        <el-form-item label="单位工程名称">
          <el-input
            v-model="info.projectName"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分部工程名称">
          <el-input
            v-model="info.brandProjectName"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="施工单位名称">
          <el-input
            v-model="info.constructionUnit"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目负责人">
          <el-input
            v-model="info.leader"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分包单位工程名称">
          <el-input
            v-model="info.subconstructionUnit"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分包单位项目负责人">
          <el-input
            v-model="info.leader1"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="info.timeNode" style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="时间节点"
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="part"
          label="检验批工程部位"
          width="500"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="record"
          label="收集的检验批数据"
          width="500"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="prop" label="操作" align="center">
          <el-button type="danger">删除</el-button>
        </el-table-column>
      </el-table>
      <!-- 保存按钮 -->
      <div style="margin-top: 10px">
        <el-button type="primary" @click="addProject">保存</el-button>
        <el-button @click="quxiao">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        projectName: "蓬莱嘉园1#楼建设项目",
        brandProjectName: "主题结构/混凝土结构",
        constructionUnit: "中国建筑第五工程局有限公司",
        leader: "张三",
        subconstructionUnit: "河南建筑有限公司",
        leader1: "赵四",
        timeNode: [
          {
            time: "2024-06-01",
            part: "1#楼1-7/A-F四层墙柱",
            record: "混凝土施工检验批",
          },
          {
            time: "2024-07-02",
            part: "1#楼2-7/A-F二层墙柱",
            record: "钢筋原料检验批",
          },
        ],
      },
    };
  },
  methods: {
    //保存项目
    addProject() {
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
  },
};
</script>

<style>
.centered-text {
  display: block; /* 或者使用 inline-block */
  text-align: center; /* 对于 block 元素 */
  width: 100%; /* 确保它占据整个父容器的宽度 */
}
</style>