<template>
  <div>
    <!-- 路由出口：子组件将在这里渲染 -->
    <router-view></router-view>
    <!-- 顶部操作栏 -->
    <el-row>
      <el-button type="primary" @click="toLedgerEntry">+台账录入</el-button>
      <el-button type="primary" @click="toOCREntry">OCR数据录入</el-button>
      <el-col :offset="2">
        <div class="top_right">
          <span>项目名称</span>
          <el-input v-model="searchProjectName" placeholder="" style="width: 8em; margin-left:1em; margin-right: 1em"
            size="mini"></el-input>
          <span>单位工程名称</span>
          <el-input v-model="searchSubprojectName" placeholder="" style="width: 8em; margin-left:1em; margin-right: 1em"
            size="mini"></el-input>
          <span>使用部位</span>
          <el-input v-model="searchFloorWithInspectPart" placeholder=""
            style="width: 8em; margin-left:1em; margin-right: 1em" size="mini"></el-input>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 只有当显示主列表时才渲染表格 -->
    <div v-if="$route.name === 'RawMaterial'">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="batchNum" label="批次" width="50" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" width="150" align="center"></el-table-column>
        <el-table-column prop="subprojectName" label="单位工程名称" width="150" align="center"></el-table-column>
        <el-table-column prop="floorWithInspectPart" label="使用部位" width="150" align="center"></el-table-column>
        <el-table-column prop="barDiameter" label="钢筋直径（mm）" width="100" align="center"></el-table-column>
        <el-table-column prop="steelBarGrade" label="钢筋牌号" width="100" align="center"></el-table-column>
        <el-table-column prop="stove" label="炉批号" width="100" align="center"></el-table-column>
        <el-table-column prop="qualified" label="是否合格" width="100" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作" align="center">
          <template v-slot="scope">
            <el-button type="warning" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 20px; text-align: center" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="curPage" :page-sizes="[10, 15, 20]" :page-size="limit"
        layout="prev, pager, next, jumper,->,sizes,total" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUser } from "@/utils/storage";
import {getRawMaterial} from "@/api/ledger"
export default {
  data() {
    return {
      searchProjectName: '',
      searchSubprojectName: '',
      searchFloorWithInspectPart: '',
      allData: [
        {
          batchNum: '001',
          projectName: '项目A',
          subprojectName: '单位工程1',
          floorWithInspectPart: '一楼',
          barDiameter: 12,
          steelBarGrade: 'HRB400',
          stove: 'D-240153',
          qualified: '是'
        },
        {
          batchNum: '002',
          projectName: '项目B',
          subprojectName: '单位工程2',
          floorWithInspectPart: '二楼',
          barDiameter: 14,
          steelBarGrade: 'HRB500',
          stove: 'E-240154',
          qualified: '是'
        },
        {
          batchNum: '003',
          projectName: '项目A',
          subprojectName: '单位工程3',
          floorWithInspectPart: '三楼',
          barDiameter: 16,
          steelBarGrade: 'HRB400E',
          stove: 'D-240155',
          qualified: '否'
        },
        {
          batchNum: '004',
          projectName: '项目C',
          subprojectName: '单位工程1',
          floorWithInspectPart: '一楼',
          barDiameter: 18,
          steelBarGrade: 'HRB400',
          stove: 'F-240156',
          qualified: '是'
        },
        {
          batchNum: '005',
          projectName: '项目B',
          subprojectName: '单位工程2',
          floorWithInspectPart: '二楼',
          barDiameter: 20,
          steelBarGrade: 'HRB500',
          stove: 'E-240157',
          qualified: '是'
        },
        {
          batchNum: '006',
          projectName: '项目C',
          subprojectName: '单位工程3',
          floorWithInspectPart: '三楼',
          barDiameter: 22,
          steelBarGrade: 'HRB400E',
          stove: 'F-240158',
          qualified: '否'
        },
        {
          batchNum: '007',
          projectName: '项目A',
          subprojectName: '单位工程2',
          floorWithInspectPart: '二楼',
          barDiameter: 25,
          steelBarGrade: 'HRB500',
          stove: 'D-240159',
          qualified: '是'
        },
        {
          batchNum: '008',
          projectName: '项目B',
          subprojectName: '单位工程3',
          floorWithInspectPart: '三楼',
          barDiameter: 28,
          steelBarGrade: 'HRB400E',
          stove: 'E-240160',
          qualified: '否'
        },
        {
          batchNum: '009',
          projectName: '项目C',
          subprojectName: '单位工程1',
          floorWithInspectPart: '一楼',
          barDiameter: 32,
          steelBarGrade: 'HRB400',
          stove: 'F-240161',
          qualified: '是'
        },
        {
          batchNum: '010',
          projectName: '项目A',
          subprojectName: '单位工程3',
          floorWithInspectPart: '三楼',
          barDiameter: 20,
          steelBarGrade: 'HRB500',
          stove: 'D-240162',
          qualified: '是'
        }
      ],
      // 当前页数据
      tableData: [],
      curPage: 1,
      limit: 10,
      total: 0 // 初始化为0，在数据加载后更新
    }
  },
  created() {
    // 初始化表格数据
    this.updateTableData();
  },
  computed: {
    category() {
      return this.$route.params.category || 'raw';
    }
  },
  mounted(){
    console.log("检验批",this.category)
    this.getAllData();
  },
  methods: {
    async getAllData(){
      console.log("获取数据")
      const user=getUser()
      // const userId=user.userId
      // const projectName=""
      // const subprojectName=""
      // const usePart=""
      const data={}
      data.userid=user.userId
      data.projectName=""
      data.subprojectName=""
      data. usePart=""
      data.pageNum=this.curPage
      data.pageSize=this.limit
      console.log("data",data)
      try {
        let res=await getRawMaterial(data)
        if(res.code==200){
          console.log(res)

        } else {
          this.$message.error("获取钢筋原材台账失败！");
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("操作失败", error);
      }
    
 

    },
    toLedgerEntry() {
      // 使用命名路由跳转
      this.$router.push({
        name: 'LedgerEntry',
        params: { category: this.category }
      });
    },
    toOCREntry() {
      // 使用命名路由跳转
      this.$router.push({
        name: 'OCREntry',
        params: { category: this.category }
      });
    },
    // 搜索方法
    search() {
      // 重置到第一页
      this.curPage = 1;
      // 更新表格数据
      this.updateTableData();
    },

    // 更新表格数据
    updateTableData() {
      // 确保allData存在
      if (!this.allData || this.allData.length === 0) {
        console.warn('没有数据可显示');
        this.tableData = [];
        this.total = 0;
        return;
      }

      // 根据搜索条件过滤数据
      let filteredData = this.allData.filter(item => {
        return (
          item.projectName.includes(this.searchProjectName) &&
          item.subprojectName.includes(this.searchSubprojectName) &&
          item.floorWithInspectPart.includes(this.searchFloorWithInspectPart)
        );
      });

      // 更新总数
      this.total = filteredData.length;

      // 如果没有匹配结果，直接返回空数组
      if (filteredData.length === 0) {
        this.tableData = [];
        return;
      }

      // 计算当前页显示的数据
      const start = (this.curPage - 1) * this.limit;
      const end = start + this.limit;
      this.tableData = filteredData.slice(start, end);
    },

    // 分页大小变化
    handleSizeChange(newSize) {
      this.limit = newSize;
      this.updateTableData();
    },

    // 当前页码变化
    handleCurrentChange(newPage) {
      this.curPage = newPage;
      this.updateTableData();
    },

    // 编辑功能
    editItem(row) {
      console.log('编辑项目:', row);
      // 这里可以打开编辑对话框或跳转到编辑页面
      // 示例: this.$router.push({ name: 'editRebar', params: { id: row.id }})
    },

    // 删除功能
    deleteItem(row) {
      this.$confirm('确定要删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 从allData中删除
        this.allData = this.allData.filter(item => item.batchNum !== row.batchNum);
        // 更新表格
        this.updateTableData();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        // 用户取消操作
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
.el-row {
  display: flex;
  align-items: center;
}

.top_right {
  display: flex;
  align-items: center;
}
</style>