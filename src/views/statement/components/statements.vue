<template>
  <div class="container">
    <div class="block">
      <span class="demonstration">日期</span>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span class="sort">
        <el-radio v-model="sort" label="1">升序</el-radio>
        <el-radio v-model="sort" label="2">降序</el-radio>
      </span>
      <span class="stateFliter">
        <span style="margin-right: 10px">状态筛选</span>
        <el-radio v-model="state" label="1">待审批</el-radio>
        <el-radio v-model="state" label="2">已通过</el-radio>
        <el-radio v-model="state" label="3">不通过</el-radio>
      </span>
    </div>
    <div>
      <el-table :data="info" style="width: 100%" border>
        <el-table-column
          label="检验批名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="报表生成时间"
          prop="time"
          align="center"
        ></el-table-column>
        <el-table-column
          label="合格率"
          prop="rate"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" prop="" align="center">
          <el-button type="text" @click="show()">查看</el-button>
          <el-button type="text" @click="exportData()">导出</el-button>
          <el-button type="text" style="color: #f56c6c" @click="del()">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
     <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: "",
      sort: "1",
      state: "1",
      info: [
        {
          name: '1#楼东1-7/A-F三层墙柱-现浇结构外观及尺寸偏差',
          time: "2024-06-01",
          rate: "100%",
        },
       {
          name: '1#楼东1-7/A-F三层墙柱-现浇结构外观及尺寸偏差',
          time: "2024-06-01",
          rate: "100%",
        },{
          name: '1#楼东1-7/A-F三层墙柱-现浇结构外观及尺寸偏差',
          time: "2024-06-01",
          rate: "100%",
        },
        {
          name: '1#楼东1-7/A-F三层墙柱-现浇结构外观及尺寸偏差',
          time: "2024-06-01",
          rate: "100%",
        },
        {
          name:'1#楼东1-7/A-F三层墙柱-现浇结构外观及尺寸偏差',
          time: "2024-06-01",
          rate: "100%",
        },
      ],
      currentPage: 2, //分页器数据
      limit: 20, //每页显示的数据
      total: 100,
    };
  },
  methods: {
    //查看功能
    show() {
      const isShow = false;
      const data = { isShow };
      this.$emit("transmit", data);
    },
    del(){

    },
    exportData(){

    },
  },
};
</script>

<style>
.demonstration {
  margin-right: 10px;
}
.block{
  margin-block: 10px;
}
.sort {
  margin-left: 10px;
}
.stateFliter {
  margin-right: 10px;
  float: right;
}
</style>