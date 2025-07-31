<template>
  <div class="inspection-record">
    <el-button type="primary" @click="back" >返回上级页面</el-button>
    <h1>现场验收检验批检查原始记录</h1>

    <table>
      <!-- Header row -->
      <tr class="head">
        <td class="head1">单位（子单位）工程名称</td>
        <td class="head2">{{ reportData.subprojectName }}</td>
        <td class="head3">检验批名称</td>
        <td class="head4">{{ reportData.inspectType }}</td>
      </tr>
      <!-- Second row -->
      <tr class="head">
        <td class="head1">检验批编号</td>
        <td class="head2">{{ reportData.serialNumber }}</td>
        <td class="head3">验收日期</td>
        <td class="head4">{{ reportData.finishDate }}</td>
      </tr>
    </table>
    <table class="table2">
      <!-- Table headers -->
      <tr class="content-row">
        <td class="body1">编号</td>
        <td class="body2">验收项目</td>
        <td class="body3">验收部位</td>
        <td class="body4">验收情况记录</td>
        <td class="body5">备注</td>
      </tr>
      <!-- Data rows -->
      <tr v-for="(item, index) in reportData.items" :key="index" class="content-row">
        <td class="body11">{{ item.code }}</td>
        <td class="body22">{{ item.project }}</td>
        <td class="body33">{{ item.location }}</td>
        <td class="body44">{{ item.record }}</td>
        <td class="body55">{{ item.remark }}</td>
      </tr>
    </table>

    <div class="signatures">
      <div class="signature"><strong>质量员：{{ qualityInspector }}</strong></div>
      <div class="signature"><strong>施工员：{{ constructionInspector }}</strong></div>
      <div class="signature"><strong>监理旁站监督人：{{ supervisor }}</strong></div>
    </div>
    <div class="note">注：本表格由质量员在验收现场记录填写</div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  data() {
    return {
      loading: true,   //这是一个加载标识
      reportData: {},  //这是报表数据接收变量
      localStorageId: '' // 用于存储id
    }
  },
  mounted() {
    const localStorageId = this.$route.query.localStorageId;
    this.localStorageId = localStorageId; // 保存id用于销毁时清理
    if (localStorageId) {
      const data = localStorage.getItem(localStorageId);
      if (data) {
        this.reportData = JSON.parse(data);
        console.log(this.reportData);
      }
    }

    //先使用静态数据。
    this.reportData.items = [
      {code:'主控1', project: '模板及支架材料质量', location: '1层1-8/4-Ⅱ轴墙柱', record: '全数检查，进场检验合格', remark: ''},
      {code:'主控2', project: '现浇砼模板及支架安装质量', location: '1层1-8/4-Ⅱ轴墙柱', record: '全数检查，安装牢固、稳定，符合模板施工方案要求', remark: ''},
      {code:'一般1', project: '模板安装一般要求', location: '1层1-8/4-Ⅱ轴墙柱', record: '全数检查，模板接缝严密，模内杂物等已清理干净', remark: ''},
      {code:'一般2', project: '隔离剂的品种和涂刷方法质量', location: '1层1-8/4-Ⅱ轴墙柱', record: '全数检查，脱模剂涂刷均匀符合要求', remark: ''},
      {code:'一般4', project: '现浇砼结构多层连接支模支架的竖杆垫板要求', location: '1层1-8/4-Ⅱ轴墙柱', record: '全数检查，模板支设符合施工方案，上下层竖杆基本对准且设垫板', remark: ''},
      {code:'一般7', project: '现浇结构模板安装允许偏差--轴线位置 ≤5mm', location: '1/A轴1层柱', record: '1mm', remark: ''},
      {code:'', project: '', location: '1/B轴1层柱', record: '4mm', remark: ''},
      {code:'', project: '', location: '1/C轴1层柱', record: '3mm', remark: ''},
      {code:'', project: '', location: '1/T轴1层墙', record: '2mm', remark: ''},
      {code:'', project: '', location: '1/6轴1层墙', record: '3mm', remark: ''},
      {code:'', project: '', location: '1/4轴1层墙', record: '1mm', remark: ''},
      {code:'', project: '现浇结构模板安装允许偏差--模板内部尺寸柱、墙：±5mm', location: '1/A轴1层柱', record: '内部尺寸：+2mm；-3mm；-1mm；+4mm', remark: ''},
      {code:'', project: '', location: '1/B轴1层柱', record: '内部尺寸：+3mm；-3mm；+1mm；+3mm', remark: ''},
      {code:'', project: '', location: '1/C轴1层柱', record: '内部尺寸：+2mm；-3mm；-2mm；+4mm', remark: ''},
      {code:'', project: '', location: '1/T轴1层墙', record: '内部尺寸：+2mm；+3mm；-1mm；+1mm', remark: ''},
      {code:'', project: '', location: '1/6轴1层墙', record: '内部尺寸：-2mm；+3mm；-1mm；-3mm', remark: ''},
      {code:'', project: '', location: '1/4轴1层墙', record: '内部尺寸：+4mm；-3mm；+1mm；-6mm（超标）', remark: ''},
      {code:'', project: '现浇结构模板安装允许偏差--柱、墙垂直度（层高≤6m）：≤8mm', location: '1/A轴1层柱', record: '6mm', remark: ''}
    ]

  },
  beforeDestroy() {       //这个钩子函数用来退出的时候清除本地存储的数据 防止数据堆积在浏览器里
    if (this.localStorageId) {
      localStorage.removeItem(this.localStorageId);
    }
    document.querySelector('body').setAttribute('style', 'background-color: white;'); //还原，因为这是个全局样式

  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f5f5f5;') //设置对比色
  },
  methods: {
    back() {
      router.push({ path: '/menus/statement' });
    }
  }
}
</script>
<style scoped>
/* 全局容器样式 */
.inspection-record {
  font-family: '宋体', sans-serif;
  padding: 70px 20px 60px;
  width: 62%;
  margin: 0 auto;
  background-color: white;
}
/* 标题样式 */
.inspection-record h1 {
  text-align: center;
  margin-bottom: 40px;
}

/* 表格基础样式 */
.inspection-record >>> table {
  width: 100%;
  border-collapse: collapse;
}

.inspection-record >>> th,
.inspection-record >>> td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

/* 表头样式 */
.inspection-record >>> th {
  background-color: #f2f2f2;
}

/* 表格内容单元格样式 */
.inspection-record >>> .body1 {
  width: 10%;
  border-top: none;
  font-weight: bold;
}

.inspection-record >>> .body2 {
  width: 20%;
  border-top: none;
  font-weight: bold;
}

.inspection-record >>> .body3 {
  width: 20%;
  border-top: none;
  font-weight: bold;
}

.inspection-record >>> .body4 {
  width: 30%;
  border-top: none;
  font-weight: bold;
}

.inspection-record >>> .body5 {
  width: 20%;
  border-top: none;
  font-weight: bold;
}

/* 表头单元格样式 */
.inspection-record >>> .head1 {
  width: 15%;
  font-weight: bold;
}

.inspection-record >>> .head3 {
  width: 10%;
  font-weight: bold;
}

.inspection-record >>> .head2 {
  width: 35%;
}

.inspection-record >>> .head4 {
  width: 40%;
}

/* 签名区域样式 */
.inspection-record .signatures {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
}

.inspection-record .signature {
  min-width: 200px;
}

/* 备注样式 */
.inspection-record .note {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}
.content-row{
  font-weight: 500;
}
body{
  background-color: #f5f5f5;
}
</style>
