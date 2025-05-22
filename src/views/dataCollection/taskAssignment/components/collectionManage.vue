<template>
  <div>
    <div>
      <el-row>
        <el-col :span="4" :offset="2">
          <!-- select选择器 -->
          <div class="top_left">
            <span style="margin-right: 1em">状态</span>
            <el-select v-model="value" placeholder="请选择" style="width: 10em">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8" :offset="8">
          <!-- 搜索框 -->
          <div class="top_right">
            <el-select
              v-model="searchValue"
              placeholder="请选择"
              style="width: 8em"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="searchPart"
              placeholder="请输入搜索内容"
              style="width: 20em; margin-right: 1em"
            ></el-input>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--表格  -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="项目号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="name1" label="工程名称" width="180" align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="单位工程"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="part"
        label="检验批部位"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name2"
        label="检验批名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="state" label="状态" width="180" align="center">
      </el-table-column>
      <el-table-column prop="operation" label="操作" align="center">
        <template v-slot="scope">
          <el-button type="info" @click="check(scope)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curPage"
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
      searchOptions: [
        {
          value: "选项1",
          label: "单位工程",
        },
        {
          value: "选项2",
          label: "检验批部位",
        },
      ],
      searchValue: "选项1",
      options: [
        {
          value: "选项1",
          label: "待分发",
        },
        {
          value: "选项2",
          label: "进行中",
        },
        {
          value: "选项3",
          label: "待审核",
        },
      ],
      value: "", // 状态选择器值
      searchUnit: "", // 单位工程搜索
      searchPart: "", // 检验批部位搜索
      tableData: [
        {
          date: "1010101",
          name1: "郑州中原保利心语项目",
          address: "保利心语佳苑1#楼",
          part: "-2层1施工段墙柱",
          name2: "钢筋原材",
          state: "待分发",
        },
        {
          date: "1010101",
          name1: "郑州中原保利心语项目",
          address: "保利心语佳苑1#楼",
          part: "-2层1施工段墙柱",
          name2: "钢筋原材",
          state: "待审批",
        },
        {
          date: "1010101",
          name1: "郑州中原保利心语项目",
          address: "保利心语佳苑1#楼",
          part: "-2层1施工段墙柱",
          name2: "钢筋原材",
          state: "进行中",
        },
        {
          date: "1010101",
          name1: "郑州中原保利心语项目",
          address: "保利心语佳苑1#楼",
          part: "-2层1施工段墙柱",
          name2: "钢筋原材",
          state: "已完成",
        },
      ],
      limit: 15,
      total: 0,
      curPage: 1,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    //查看按钮 点击事件
    check(value) {
      console.log("查看", value);
      const state = value.row.state; //获取当前点击查看的项目的状态。同样，项目的id号也可能会在value.row这里面。
      if (state == "待分发") {
        //跳转到分发页面
        //分发页面 需要知道当前是要分发的哪一个项目 可以通过路径携带当前项目的id号,
        //在这里，我先把项目号为例子，之后具体要传递是哪一个字段，你需要自己去修改
        //可以参考projectManage.vue的写法
        // 注意params/query传参的时候，params-name/query-path  路径的内容是不同，对应于路由中的name,path属性，注意区分大小写
        this.$router.push({
          name: "Assignment",
          params: {
            id: value.row.date,
          },
        });
      } else if (state == "待审批" || state == "进行中") {
        //跳转到详情页面
         this.$router.push({
          name: "CollectionDetail",
          params: {
            id: value.row.date,
          },
        });

      } else {
        //已完成 状态 也是要条状到详情页面，但是和上面的详情页面有点区别。
        //也可以单独写一个新的页面，我这里先简写一下，让它与上面的详情页面是一样
         this.$router.push({
          name: "CollectionDetail",
          params: {
            id: value.row.date,
          },
        });
      }
    },
    handleSizeChange(size) {
      // console.log("页面的数据条数",size)
      this.limit = size;
      this.getAllUser();
    },
    handleCurrentChange(index) {
      // console.log("直接跳转到",index)
      this.curPage = index;
      this.getAllUser();
    },
    fetchData() {
      // 根据分页和筛选条件请求数据
      // 这里只是示例，实际应从后端获取数据
      // 假设返回总数
      this.total = 50;
    },
    search() {
      // 触发搜索，重新请求数据
      this.curPage = 1;
      this.fetchData();
    },
  },
};
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.top_left {
  display: flex;
  align-items: center;
  padding: 0.5em;
}
.top_right {
  display: flex;
  align-items: center;
  padding: 0.5em;
}
</style>