<template>
  <div>
    <div>
      <el-row :gutter="24">
        <el-col :span="5" >
          <div>
            <span>状态：</span>
            <el-select
              v-model="searchStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" >
          <div>
            <span>检验批部位：</span>
            <el-input
              v-model="searchPart"
              placeholder="请输入搜索内容"
              style="width: calc(100% - 100px)"
            ></el-input>
          </div>
        </el-col>

        <el-col :span="6" >
          <div>
            <span>单位工程：</span>
            <el-input
              v-model="searchUnit"
              placeholder="请输入搜索内容"
              style="width: calc(100% - 80px)"
            ></el-input>
          </div>
        </el-col>

        <el-col :span="2" >
          <el-button type="primary" @click="search"
            >搜索</el-button
          >
        </el-col>
      </el-row>
    </div>
    <!--表格  -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="projectInnerCode"
        label="项目号"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="工程名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="subprojectName"
        label="单位工程"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="inspectPart"
        label="检验批部位"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="inspectType"
        label="检验批名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="180" align="center">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)" disable-transitions>
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
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
      :page-size="curPageSize"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getAllAtatus } from "@/api/collection";
import { getUser } from "@/utils/storage";

export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "待分发",
        },
        {
          value: "2",
          label: "进行中",
        },
        {
          value: "3",
          label: "待审核",
        },
        {
          value: "4",
          label: "等待第二次采集",
        },
        {
          value: "5",
          label: "已完成",
        },
      ],
      searchStatus: "", // 状态选择器值
      searchUnit: "", // 单位工程搜索
      searchPart: "", // 检验批部位搜索
      tableData: [],
      curPageSize: 15,
      total: 0,
      curPage: 1,
      bodyData: {
        userId: "",
        status: null,
        subprojectName: "",
        floorWithInspectPart: "",
        pageNum: 1,
        pageSize: 15,
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const user = getUser();
      this.bodyData.userId = user.userId;
      this.bodyData.pageNum = this.curPage;
      this.bodyData.pageSize = this.curPageSize;
      try {
        const res = await getAllAtatus(this.bodyData);
        if (res.code == "200") {
          console.log("所有项目信息", res); 
          this.total = Number(res.result.total);
          this.tableData = res.result.list;
        } else {
          this.$message.error("获取全部项目的数据采集状态失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("操作失败", error);
      }
    },
    //查看按钮 点击事件
    check(value) {
      console.log("点击查看，这一列的数据", value.row.status, value);
      const state = value.row.status; //获取当前点击查看的项目的状态。同样，项目的id号也可能会在value.row这里面。
      //在vuex中保存该行的信息，应用于兄弟组件
      this.$store.commit("collection/setCurrentRowData", value.row);
      if (state == 1) {
        //待分发
        //跳转到分发页面
        //分发页面 需要知道当前是要分发的哪一个项目 可以通过路径携带当前项目的id号,
        //在这里，我先把项目号为例子，之后具体要传递是哪一个字段，你需要自己去修改
        //可以参考projectManage.vue的写法
        // 注意params/query传参的时候，params-name/query-path  路径的内容是不同，对应于路由中的name,path属性，注意区分大小写
        this.$router.push({
          path: "assignment",
          query: {
            taskId: value.row.taskId,
            status: value.row.status,
          },
        });
      } else if (state == 3) {
        //待审核   跳转到详情页面
        this.$router.push({
          name: "CollectionDetailApproval",
          params: {
            row: value.row,
          },
        });
      } else {
        //已完成 状态 也是要条状到详情页面，但是和上面的详情页面有点区别。
        //也可以单独写一个新的页面，我这里先简写一下，让它与上面的详情页面是一样
        this.$router.push({
          path: "collectionDetail",
          query: {
            taskId: value.row.taskId,
          },
        });
      }
    },
    handleSizeChange(size) {
      // console.log("页面的数据条数",size)
      this.curPageSize = size;
      this.getData();
    },
    handleCurrentChange(index) {
      console.log("直接跳转到", index);
      this.curPage = index;
      this.getData();
    },
    getStatusText(status) {
      const statusMap = {
        0: "未开始",
        1: "待分发",
        2: "进行中",
        3: "待审核",
        4: "等待第二次采集",
        5: "已完成",
      };
      return statusMap[status] || "未知状态";
    },
    getStatusType(status) {
      const typeMap = {
        0: "info", // 未开始 - 灰色
        1: "warning", // 待分发 - 黄色
        2: "", // 进行中 - 蓝色（默认）
        3: "warning", // 待审核 - 黄色
        4: "warning", // 等待第二次采集 - 黄色
        5: "success", // 已完成 - 绿色
      };
      return typeMap[status] || "";
    },
    async search() {
      // 触发搜索，重新请求数据
      this.curPage=1
      console.log(this.searchStatus,this.searchUnit,this.searchPart)
      const user = getUser();
      this.bodyData.userId = user.userId;
      this.bodyData.pageNum = this.curPage;
      this.bodyData.pageSize = this.curPageSize;
      this.bodyData.status=this.searchStatus;
      this.bodyData.floorWithInspectPart=this.searchPart;
      this.bodyData.subprojectName=this.searchUnit;
       try {
        const res = await getAllAtatus(this.bodyData);
        if (res.code == "200") {
          console.log("搜索", res);
          this.total = Number(res.result.total);
          this.tableData = res.result.list;
        } else {
          this.$message.error("搜素失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("操作失败", error);
      }
      // this.curPage = 1;
      // this.fetchData();
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