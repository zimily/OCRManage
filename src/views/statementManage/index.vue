<template>
  <div class="report-container">
    <router-view/>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="检验批验收记录" name="1">检验批验收记录</el-tab-pane>
      <el-tab-pane label="检验批验收原始记录" name="1.1">检验批验收原始记录</el-tab-pane>
      <el-tab-pane label="隐蔽验收记录" name="2">隐蔽验收记录</el-tab-pane>
      <el-tab-pane label="分部验收记录" name="3">分部验收记录</el-tab-pane>
      <el-tab-pane label="分项验收记录" name="4">分项验收记录</el-tab-pane>
      <el-tab-pane label="钢筋原材台账" name="5.1">钢筋原材台账</el-tab-pane>
      <el-tab-pane label="机械连接台账" name="5.2">机械连接台账</el-tab-pane>
      <el-tab-pane label="钢筋焊接台账" name="5.3">钢筋焊接台账</el-tab-pane>
      <el-tab-pane label="混凝土强度台账" name="5.4">混凝土强度台账</el-tab-pane>
      <el-tab-pane label="混凝土测温记录" name="6">混凝土测温记录</el-tab-pane>
      <el-tab-pane label="混凝土强度离散度" name="7">混凝土强度离散度</el-tab-pane>
    </el-tabs>

    <!--检验批验收记录，检验批原始验收记录，隐蔽验收记录搜索框-->
    <div id="searchForm1" style="display: flex; justify-content: flex-end; align-items: center" v-if="currentTableName === '1' || currentTableName === '2' || currentTableName === '1.1' ">
      <span style="line-height: 100%">检验批部位：</span>
      <el-input v-model="inspectPart" placeholder="请输入内容" style="width: 300px"/>
      <span style="line-height: 100%; margin-left: 10px">单位工程：</span>
      <el-input v-model="subprojectName" placeholder="请输入内容" style="width: 300px"/>
      <el-button type="primary" style="margin-left: 10px;margin-right: 10px" @click="search">搜索</el-button>
      <el-button type="warning" style="margin-left: 10px;margin-right: 10px;" @click="batchExport">批量导出</el-button>
    </div>

    <!--混凝土测温记录专用搜索框-->
    <div id="searchForm2" style="display: flex; justify-content: flex-end; align-items: center" v-if="currentTableName === '6'">
      <span style="line-height: 100%">试块部位：</span>
      <el-input v-model="usePart" placeholder="请输入内容" style="width: 300px"/>
      <span style="line-height: 100%; margin-left: 10px">单位工程：</span>
      <el-input v-model="subprojectName" placeholder="请输入内容" style="width: 300px"/>
      <el-button type="primary" style="margin-left: 10px;margin-right: 10px" @click="search">搜索</el-button>
      <el-button type="warning" style="margin-left: 10px;margin-right: 10px;" @click="batchExport">批量导出</el-button>
    </div>

    <!--混凝强度离散度专用搜索框-->
    <div id="searchForm3" style="display: flex; justify-content: flex-end; align-items: center" v-if="currentTableName === '7'">
      <span style="line-height: 100%">单位工程：</span>
      <el-input v-model="subprojectName" placeholder="请输入内容" style="width: 300px"/>
      <span style="line-height: 100%; margin-left: 10px">强度等级：</span>
      <el-input v-model="concreteStrength" placeholder="请输入内容" style="width: 300px"/>
      <el-button type="primary" style="margin-left: 10px;margin-right: 10px" @click="search">搜索</el-button>
      <el-button type="warning" style="margin-left: 10px;margin-right: 10px;" @click="batchExport">批量导出</el-button>
    </div>

    <!-- 四种台账+分部分项   -->
    <div id="searchForm3" style="display: flex; justify-content: flex-end; align-items: center" v-if="currentTableName === '3'|| currentTableName==='4' || currentTableName==='5.1' || currentTableName ==='5.2' || currentTableName==='5.3' || currentTableName==='5.4'">
      <span style="line-height: 100%">工程名称：</span>
      <el-input v-model="projectName" placeholder="请输入内容" style="width: 300px"/>
      <span style="line-height: 100%; margin-left: 10px">单位工程：</span>
      <el-input v-model="subprojectName" placeholder="请输入内容" style="width: 300px"/>
      <el-button type="primary" style="margin-left: 10px;margin-right: 10px" @click="search">搜索</el-button>
      <el-button type="warning" style="margin-left: 10px;margin-right: 10px;" @click="batchExport">批量导出</el-button>
    </div>

    <!-- 检验批验收记录表格 -->   <!-- key是保证dom不残留的关键，这个必须不同 -->
    <el-table
      ref="table1"
      :data="currentPageData"
      :key="'table1' + currentTableName"
      stripe
      style="width: 100%; margin-top: 15px"
      @selection-change="handleSelectionChange"
      v-if="currentTableName === '1'"
    >

      <!-- 第一列：多选框 -->
      <el-table-column type="selection" width="55"/>
      <!-- 第二列：编号 -->
      <el-table-column label="项目号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
        </template>
      </el-table-column>

      <!-- 固定列：项目名称、单位工程 -->
      <el-table-column prop="projectName" label="工程名称" align="center"/>
      <el-table-column prop="subprojectName" label="单位工程" align="center"/>
      <el-table-column prop="inspectPart" label="检验批部位" align="center"/>
      <el-table-column prop="inspectType" label="检验批名称" align="center"/>

      <!-- 最后一列：操作按钮 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="handlePreview(scope.row)">
            预览
          </el-button>
          <el-button type="warning" @click="handleExport(scope.row)">
            导出
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 隐蔽验收记录表格 -->
    <el-table
      ref="table2"
      :data="currentPageData"
      :key="'table2' + currentTableName"
      stripe
      style="width: 100%; margin-top: 15px"
      @selection-change="handleSelectionChange"
      v-if="currentTableName === '2'"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="项目号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="工程名称" prop="projectName" align="center"></el-table-column>
      <el-table-column label="单位工程" prop="danweiProject" align="center"></el-table-column>
      <el-table-column label="检验批部位" prop="inspectPart" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">

          <template slot-scope="scope">
            <el-button type="primary" @click="handlePreview(scope.row)">
              预览
            </el-button>
            <el-button type="warning" @click="handleExport(scope.row)">
              导出
            </el-button>
          </template>
      </el-table-column>
    </el-table>

    <!-- 检验批原始记录表格 -->
    <el-table
      ref="table1.1"
      :data="currentPageData"
      :key="'table1.1' + currentTableName"
      stripe
      style="width: 100%; margin-top: 15px"
      @selection-change="handleSelectionChange"
      v-if="currentTableName === '1.1'"
    >

      <!-- 第一列：多选框 -->
      <el-table-column type="selection" width="55"/>
      <!-- 第二列：编号 -->
      <el-table-column label="项目号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
        </template>
      </el-table-column>
      <!-- 固定列：项目名称、单位工程 -->
      <el-table-column prop="projectName" label="工程名称" align="center"/>
      <el-table-column prop="subprojectName" label="单位工程" align="center"/>
      <el-table-column prop="inspectPart" label="检验批部位" align="center"/>
      <el-table-column prop="inspectType" label="检验批名称" align="center"/>

      <!-- 最后一列：操作按钮 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="handlePreview(scope.row)">
            预览
          </el-button>
          <el-button type="warning" @click="handleExport(scope.row)">
            导出
          </el-button>
        </template>
      </el-table-column>
    </el-table>



    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="currentPage"
      :page-sizes="[1,10, 15, 20]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="totalData"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// 仓库提交测试。
import current from 'element-ui/packages/table/src/store/current'
import { search, search2 } from '@/api/statementManage'

export default {
  data() {
    return {
      responseData:
        [
          {
            projectName: '测试',
            subprojectName: '测试',
            inspectPart: '测试检验批',
            finishDate: '2005-05-01',
            taskId: '1'

          }
        ],
      currentPage: 1,           //当前页码
      pageSize: 10,             //页面容量
      totalData: 0,             //总记录条数
      activeName: '1',         //多选框选中的value，默认赋值为1
      inspectPart: '',        //检验批部位，用来搜索
      currentPageData: [],   //这是接收的数据
      currentTableName: '1', //记录当前要展示的表格id
      subprojectName:'',    //单位工程名称，用来搜索
      usePart:'',    //试块部位（测温记录报表专用）用来搜索
      concreteStrength:'', //混凝土强度等级（混凝土强度离散度报表专用） 用来搜索
      previewData:{}   //需要展示的数据
    }
  },
  computed: {},
  methods: {
    // 搜索
    async search() {
      // 首先判断输入是否合法！
      // 好像都可以。。。那就不管了
      console.log(this.inspectPart + '    ' + this.currentPage + '   ' + this.pageSize)
      console.log('当前请求参数的单位工程名为：' + this.subprojectName)
      // 点击search之后，首先需要发送请求，拿到数据
      //todo 需要根据切换表格的不同展示不同的数据，要用到switch-case来进行接口的访问
      switch(this.currentTableName){
        case '1': {
          const { result } = await search(this.inspectPart, this.currentPage, this.pageSize, this.subprojectName)
          this.currentPageData = result.records
          this.totalData = Number(result.total)  //给总记录数赋值，及时更改
          console.log('切换表格后，现在为检验批验收记录表格，看到我说明接口1成功请求了')
          break
        }
        case '1.1':{
          const {result}  = await search(this.inspectPart, this.currentPage, this.pageSize,this.subprojectName)
          this.currentPageData = result.records
          this.totalData = Number(result.total)
          console.log('切换表格后，现在为检验批原始验收记录表格，看到我说明接口1.1成功请求了')
          break;
        }
        case '2':{
          const {result} = await search2(this.inspectPart, this.currentPage, this.pageSize, this.subprojectName)
          this.currentPageData = result.records
          this.totalData = Number(result.total)
          console.log('切换了表格，现在为隐蔽验收记录，看到我说明接口2被成功请求了')
        }
        case '3':
          break;
        case '4':
          break;
        case '5.1':
          break;
        case '5.2':
          break;
        case '5.3':
          break;
        case '5.4':
          break;
        case '6':
          break;
        case '7':
          break;

        default:
          console.log('switch-case执行了default方法，有地方出错了！！！')
          this.currentPageData = []    //正常是不会这样的
      }

    },
    // 分页大小变化
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1 // 重置页码
      this.search()
    },
    // 页码变化
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.search()
    },
    // 多选框选中变化
    handleSelectionChange(val) {
      console.log('选中的数据:', val)
    },
    // 单行导出
    handleExport(row) {
      console.log('导出单行数据:', row)
      this.$message.success(`正在导出 ${row.projectName} - ${row.unitProject} 的数据`)
    },
    //使用多选框展示不同表格，这是切换表格数据展示的关键函数
    handleClick(tab, event) {
      this.currentTableName = tab.name   //这个是因为多选框的value和展示表格的控制变量的值是对应的，value 1 对应 currentTableName 1
      console.log('目前切换的表格为:' + this.currentTableName)

      //初始化表格
      this.initSearchAndForm()
      this.search()
    },
    /*** 对不起，这个页面已经被我毁掉了，逻辑堆成石山了  （狗头保命）
     *   我会很认真的写注释，如果需要改动，方便理解
     *          .,:,,,                                        .::,,,::.
     *        .::::,,;;,                                  .,;;:,,....:i:
     *        :i,.::::,;i:.      ....,,:::::::::,....   .;i:,.  ......;i.
     *        :;..:::;::::i;,,:::;:,,,,,,,,,,..,.,,:::iri:. .,:irsr:,.;i.
     *        ;;..,::::;;;;ri,,,.                    ..,,:;s1s1ssrr;,.;r,
     *        :;. ,::;ii;:,     . ...................     .;iirri;;;,,;i,
     *        ,i. .;ri:.   ... ............................  .,,:;:,,,;i:
     *        :s,.;r:... ....................................... .::;::s;
     *        ,1r::. .............,,,.,,:,,........................,;iir;
     *        ,s;...........     ..::.,;:,,.          ...............,;1s
     *       :i,..,.              .,:,,::,.          .......... .......;1,
     *      ir,....:rrssr;:,       ,,.,::.     .r5S9989398G95hr;. ....,.:s,
     *     ;r,..,s9855513XHAG3i   .,,,,,,,.  ,S931,.,,.;s;s&BHHA8s.,..,..:r:
     *    :r;..rGGh,  :SAG;;G@BS:.,,,,,,,,,.r83:      hHH1sXMBHHHM3..,,,,.ir.
     *   ,si,.1GS,   sBMAAX&MBMB5,,,,,,:,,.:&8       3@HXHBMBHBBH#X,.,,,,,,rr
     *   ;1:,,SH:   .A@&&B#&8H#BS,,,,,,,,,.,5XS,     3@MHABM&59M#As..,,,,:,is,
     *  .rr,,,;9&1   hBHHBB&8AMGr,,,,,,,,,,,:h&&9s;   r9&BMHBHMB9:  . .,,,,;ri.
     *  :1:....:5&XSi;r8BMBHHA9r:,......,,,,:ii19GG88899XHHH&GSr.      ...,:rs.
     *  ;s.     .:sS8G8GG889hi.        ....,,:;:,.:irssrriii:,.        ...,,i1,
     *  ;1,         ..,....,,isssi;,        .,,.                      ....,.i1,
     *  ;h:               i9HHBMBBHAX9:         .                     ...,,,rs,
     *  ,1i..            :A#MBBBBMHB##s                             ....,,,;si.
     *  .r1,..        ,..;3BMBBBHBB#Bh.     ..                    ....,,,,,i1;
     *   :h;..       .,..;,1XBMMMMBXs,.,, .. :: ,.               ....,,,,,,ss.
     *    ih: ..    .;;;, ;;:s58A3i,..    ,. ,.:,,.             ...,,,,,:,s1,
     *    .s1,....   .,;sh,  ,iSAXs;.    ,.  ,,.i85            ...,,,,,,:i1;
     *     .rh: ...     rXG9XBBM#M#MHAX3hss13&&HHXr         .....,,,,,,,ih;
     *      .s5: .....    i598X&&A&AAAAAA&XG851r:       ........,,,,:,,sh;
     *      . ihr, ...  .         ..                    ........,,,,,;11:.
     *         ,s1i. ...  ..,,,..,,,.,,.,,.,..       ........,,.,,.;s5i.
     *          .:s1r,......................       ..............;shs,
     *          . .:shr:.  ....                 ..............,ishs.
     *              .,issr;,... ...........................,is1s;.
     *                 .,is1si;:,....................,:;ir1sr;,
     *                    ..:isssssrrii;::::::;;iirsssssr;:..
     *                         .,::iiirsssssssssrri;;:.
     */
    handlePreview(data) {

      try{
        this.previewData = data
        console.log(JSON.stringify(this.previewData))  //看一下数据有没有传过来呢

        const localStorageId = 'table1' + Date.now()   //生成唯一ID用来本地存储data，因为这个东西需要传递

        localStorage.setItem(localStorageId, JSON.stringify(this.previewData)) //把数据扔进localstorage

        //todo 这里需要根据当前表来设置预览跳转的页面
        switch (this.currentTableName) {
          case '1':
            this.$router.push({ path: '/report-viewer/inspect', query: { localStorageId } })
            break;
          case '1.1':
            this.$router.push({ path: '/report-viewer/originalInspect', query: { localStorageId } })
            break;
          default:
        }

      }catch(e){
        console.log(e)   //抓到error必须先打印一下
        this.$message.error('获取报表数据失败！！！')   //交互这一块
      }



    },
    batchExport() {
      console.log('批量导出按钮被启动')
    },
    initSearchAndForm(){    //这个函数用来初始化表格分页条和搜索表单内容
      this.currentPageData = []
      this.currentPage = 1
      this.pageSize = 10
      this.subprojectName = ''
      this.inspectPart = ''
      this.usePart = ''
      this.concreteStrength = ''
    }
  },
  mounted() {
    this.search()
  }
}
</script>

<style scoped>
.report-container {
  padding: 20px;
}

/* 顶部操作区靠右布局 */
.operation-bar {
  margin-bottom: 10px;
}

.flex-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 表格样式优化 */
::v-deep .el-table th {
  background-color: #f5f7fa;
  font-weight: 500;
}

#searchForm {
  margin-top: 20px;
}
</style>
