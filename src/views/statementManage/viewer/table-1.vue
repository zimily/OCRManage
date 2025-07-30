<template>

  <div class="table1_container">
    <div class="table1_dataShower" style="padding-bottom: 50px; padding-top: 50px;">
      <button class="report-top-button" @click="back">返回上级页面</button>
      <h1>检验批质量验收记录</h1>
      <span class="table1_reportId" style="text-align: right; display: block">PC001020101010001</span>
      <table class="table1_top_table">
        <tr>
          <th>单位（子单位）<br>工程名</th>
          <td>*******</td>
          <th>分部（子分部）工程名称</th>
          <td>*******</td>
          <th>分项工程名称</th>
          <td id="table1_top_table_last_col">*******</td>
        </tr>
        <tr>
          <th>施工单位</th>
          <td>************************************************************</td>
          <th>项目负责人</th>
          <td>********</td>
          <th>检验批容量</th>
          <td id="table1_top_table_last_col">********</td>
        </tr>
        <tr>
          <th>分包单位</th>
          <td>********</td>
          <th>分包单位<br>项目负责人</th>
          <td>********</td>
          <th>检验批部位</th>
          <td id="table1_top_table_last_col">********</td>
        </tr>
      </table>
      <table class="table1_middle_table">
        <tr>
          <th>施工依据</th>
          <td style="width: 32%">***********</td>
          <th>验收依据</th>
          <td style="width: 36%">************</td>
        </tr>
      </table>
      <table class="table1_middle_bottom_table">
        <tr>
          <th id="table1_mb_1">验收项目</th>
          <th id="table1_mb_2">设计要求及规定</th>
          <th id="table1_mb_3">样本总数</th>
          <th id="table1_mb_4">最小/实际抽样数量</th>
          <th id="table1_mb_5">检查记录</th>
          <th id="table1_mb_6">检查结果</th>
        </tr>
      </table>
      <div class="table1_bottom1" style="position: relative; height: auto">
        <div style=" vertical-align: top; border-right: 1px black solid;writing-mode: vertical-rl; /* 文字竖排，从右到左 */text-align: center /* 文字在容器内居中 */" class="table1_bottom1_div">主控项目</div>
        <table class="table1_bottom_table" style="vertical-align: top;">
          <tr v-for="(item, index) in bottomData1" :key="index">
            <td id="table1_bottom_1" style="text-align: right;">{{index + 1}}</td>
            <td id="table1_bottom_2">{{ item.projectName }}</td>
            <td id="table1_bottom_3">{{ item.design }}</td>
            <td id="table1_bottom_4">{{item.sample}}</td>
            <td id="table1_bottom_5">{{item.samples}}</td>
            <td id="table1_bottom_6">{{item.record}}</td>
            <td id="table1_bottom_7">{{item.result}}</td>
          </tr>
        </table>
      </div>
      <div class="table1_bottom1" style="position: relative; height: auto">
        <div style=" vertical-align: top; border-right: 1px black solid;writing-mode: vertical-rl; /* 文字竖排，从右到左 */text-align: center; /* 文字在容器内居中 */" class="table1_bottom1_div">一般项目</div>
        <table class="table1_bottom_table" style="vertical-align: top;">
          <tr v-for="(item, index) in bottomData2" :key="index">
            <td id="table1_bottom_1" style="text-align: right;">{{index + 1}}</td>
            <td id="table1_bottom_2">{{ item.projectName }}</td>
            <td id="table1_bottom_3">{{ item.design }}</td>
            <td id="table1_bottom_4">{{item.sample}}</td>
            <td id="table1_bottom_5">{{item.samples}}</td>
            <td id="table1_bottom_6">{{item.record}}</td>
            <td id="table1_bottom_7">{{item.result}}</td>
          </tr>
        </table>
      </div>
      <div class="table1_footer1" style="width: 90%; margin: 0 auto; border: 1px black solid; display: flex">
        <div class="table1_footer1_data1" style=" width: 32%; height: 200px;display: flex; justify-content: center; align-items: center; border-right: 1px black solid;" >
          <span>施工单位<br>检查结果</span>
        </div>
        <div class="table1__footer1_data2" style="width: 68%; display: flex; justify-content: end; align-items: flex-end">
          <div style=" height:140px; width: 50%; display: flex; flex-direction: column">
              <div style="height: 33%; width: 50%;display: flex; justify-content: flex-end">
                <span>专业工长：</span>
              </div>
              <div style="height: 33%; width: 50%; display: flex;justify-content: flex-end">
                <span>项目专业质量检查员：</span>
              </div>
              <div style="height: 33%; width: 100%;display: flex; justify-content: flex-end">
                <span style="margin-right: 10px">2025 年 7 月 30 日</span>
              </div>
          </div>
        </div>
      </div>
      <div class="table1_footer2" style="width: 90%; margin: 0 auto; border: 1px black solid; display: flex">
        <div class="table1_footer2_data1" style=" width: 32%; height: 200px;display: flex; justify-content: center; align-items: center; border-right: 1px black solid;" >
          <span>监理单位<br>验收结论</span>
        </div>
        <div class="table1__footer2_data2" style="width: 68%; display: flex; justify-content: end; align-items: flex-end;">
          <div style=" height:140px; width: 50%; display: flex; flex-direction: column">
            <div style="height: 33%; width: 50%;display: flex; justify-content: flex-end">
              <!--这个空白div拉来凑数的-->
            </div>
            <div style="height: 33%; width: 50%; display: flex;justify-content: flex-end">
              <span>专业监理工程师：</span>
            </div>
            <div style="height: 33%; width: 100%;display: flex; justify-content: flex-end">
              <span style="margin-right: 10px">2025 年 7 月 30 日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

/***
 *                                         ,s555SB@@&
 *                                      :9H####@@@@@Xi
 *                                     1@@@@@@@@@@@@@@8
 *                                   ,8@@@@@@@@@B@@@@@@8
 *                                  :B@@@@X3hi8Bs;B@@@@@Ah,
 *             ,8i                  r@@@B:     1S ,M@@@@@@#8;
 *            1AB35.i:               X@@8 .   SGhr ,A@@@@@@@@S
 *            1@h31MX8                18Hhh3i .i3r ,A@@@@@@@@@5
 *            ;@&i,58r5                 rGSS:     :B@@@@@@@@@@A
 *             1#i  . 9i                 hX.  .: .5@@@@@@@@@@@1
 *              sG1,  ,G53s.              9#Xi;hS5 3B@@@@@@@B1
 *               .h8h.,A@@@MXSs,           #@H1:    3ssSSX@1
 *               s ,@@@@@@@@@@@@Xhi,       r#@@X1s9M8    .GA981
 *               ,. rS8H#@@@@@@@@@@#HG51;.  .h31i;9@r    .8@@@@BS;i;
 *                .19AXXXAB@@@@@@@@@@@@@@#MHXG893hrX#XGGXM@@@@@@@@@@MS
 *                s@@MM@@@hsX#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&,
 *              :GB@#3G@@Brs ,1GM@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@B,
 *            .hM@@@#@@#MX 51  r;iSGAM@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@8
 *          :3B@@@@@@@@@@@&9@h :Gs   .;sSXH@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:
 *      s&HA#@@@@@@@@@@@@@@M89A;.8S.       ,r3@@@@@@@@@@@@@@@@@@@@@@@@@@@r
 *   ,13B@@@@@@@@@@@@@@@@@@@5 5B3 ;.         ;@@@@@@@@@@@@@@@@@@@@@@@@@@@i
 *  5#@@#&@@@@@@@@@@@@@@@@@@9  .39:          ;@@@@@@@@@@@@@@@@@@@@@@@@@@@;
 *  9@@@X:MM@@@@@@@@@@@@@@@#;    ;31.         H@@@@@@@@@@@@@@@@@@@@@@@@@@:
 *   SH#@B9.rM@@@@@@@@@@@@@B       :.         3@@@@@@@@@@@@@@@@@@@@@@@@@@5
 *     ,:.   9@@@@@@@@@@@#HB5                 .M@@@@@@@@@@@@@@@@@@@@@@@@@B
 *           ,ssirhSM@&1;i19911i,.             s@@@@@@@@@@@@@@@@@@@@@@@@@@S
 *              ,,,rHAri1h1rh&@#353Sh:          8@@@@@@@@@@@@@@@@@@@@@@@@@#:
 *            .A3hH@#5S553&@@#h   i:i9S          #@@@@@@@@@@@@@@@@@@@@@@@@@A.
 *
 *
 *    这个报表真麻烦！！！
 */

export default {
  data() {
    return {
      localStorageId: '',
      reportData:{},
      bottomData1: [
        {
          projectName: "阳光花园住宅小区建设项目验收",
          design: "严格按照国家建筑规范 GB50016-2014 和地方标准进行设计，包含抗震、节能和环保要求",
          sample: 150,
          samples: "15/150",
          record: "对混凝土浇筑质量、钢筋绑扎情况及防水层施工进行了详细检查，记录完整",
          result: "合格"
        },
        {
          projectName: "星河大厦",
          design: "现代简约风格",
          sample: 80,
          samples: "8/80",
          record: "检查了消防系统安装情况",
          result: "不合格"
        },
        {
          projectName: "滨江商业综合体项目验收报告",
          design: "基于绿色建筑认证 LEED 标准，结合智能化管理系统设计",
          sample: 200,
          samples: "20/200",
          record: "对幕墙玻璃、电气布线及 HVAC 系统进行了全面验收，部分区域需整改",
          result: "待整改"
        },
        {
          projectName: "南山科技园",
          design: "高科技园区规范",
          sample: 50,
          samples: "5/50",
          record: "检查了网络布线和电力分配",
          result: "合格"
        },
        {
          projectName: "东方明珠住宅楼及配套设施项目",
          design: "符合国家一级节能标准，采用新型环保材料和智能化家居系统",
          sample: 300,
          samples: "30/300",
          record: "对地基稳定性、墙体保温及管道安装进行了全面检查，记录详细且符合要求",
          result: "合格"
        },
        {
          projectName: "快速路桥",
          design: "桥梁设计规范",
          sample: 120,
          samples: "12/120",
          record: "检查了桥梁承重和材料强度",
          result: "合格"
        },
        {
          projectName: "天府新区文化中心建设项目",
          design: "结合地方文化特色，采用现代与传统融合的设计理念，满足抗震 8 级要求",
          sample: 180,
          samples: "18/180",
          record: "对钢结构连接点、幕墙安装及室内装饰材料进行了检查，部分细节需优化",
          result: "待整改"
        },
        {
          projectName: "绿地公园",
          design: "生态环保设计",
          sample: 60,
          samples: "6/60",
          record: "检查了绿化覆盖率和排水系统",
          result: "合格"
        },
        {
          projectName: "中央商务区高层办公楼项目验收",
          design: "基于国际 A 级写字楼标准，配备智能化安防和高效能耗管理系统",
          sample: 250,
          samples: "25/250",
          record: "对电梯系统、消防通道及外墙保温材料进行了检查，发现轻微裂缝需修复",
          result: "待整改"
        },
        {
          projectName: "希望小学",
          design: "简易抗震设计",
          sample: 90,
          samples: "9/90",
          record: "检查了教室结构和安全出口",
          result: "合格"
        }
      ],
      bottomData2: [
        {
          projectName: "阳光花园住宅小区建设项目验收",
          design: "严格按照国家建筑规范 GB50016-2014 和地方标准进行设计，包含抗震、节能和环保要求",
          sample: 150,
          samples: "15/150",
          record: "对混凝土浇筑质量、钢筋绑扎情况及防水层施工进行了详细检查，记录完整",
          result: "合格"
        },
        {
          projectName: "星河大厦",
          design: "现代简约风格",
          sample: 80,
          samples: "8/80",
          record: "检查了消防系统安装情况",
          result: "不合格"
        },
        {
          projectName: "滨江商业综合体项目验收报告",
          design: "基于绿色建筑认证 LEED 标准，结合智能化管理系统设计",
          sample: 200,
          samples: "20/200",
          record: "对幕墙玻璃、电气布线及 HVAC 系统进行了全面验收，部分区域需整改",
          result: "待整改"
        },
        {
          projectName: "南山科技园",
          design: "高科技园区规范",
          sample: 50,
          samples: "5/50",
          record: "检查了网络布线和电力分配",
          result: "合格"
        }
      ]
    }
  },
  mounted() {  //钩子函数
    //从localstorage中拿数据
    const localStorageId = this.$route.query.localStorageId;
    this.localStorageId = localStorageId; // 保存id用于销毁时清理
    if (localStorageId) {
      const data = localStorage.getItem(localStorageId);
      if (data) {
        this.reportData = JSON.parse(data);
        console.log(this.reportData);
      }
    }
  },
  beforeDestroy() { //离开页面要做的事

    //那就是清除localstorage！！！
    if(this.localStorageId){
      localStorage.removeItem(this.localStorageId);
    }
    document.querySelector('body').setAttribute('style', 'background-color: white;'); //还原，因为这是个全局样式

  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f5f5f5;') //设置对比色
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
}
</script>

<style>
.table1_container{
  width: 80%;
  background: white;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding-bottom: 20px;
}
.table1_dataShower {
  width:80%;
  background: white;
  margin: 0 auto;
  border: 1px black solid;
}
/*这是返回按钮的样式*/
.report-top-button {
  display: block;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Arial', sans-serif;
  color: #ffffff;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6); /* 建筑行业蓝色调，稳重且有活力 */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-top-button:hover {
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.report-top-button:active {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}
.table1_reportId {
  margin-right: 10%;
}
/*上方表格样式*/
.table1_top_table,.table1_middle_table,  .table1_middle_bottom_table{
  width:90%;
  margin:0 auto;
  border-collapse: collapse;
  border: 1px solid black;
  table-layout: fixed;
}
/*前三行表头的样式*/
.table1_top_table tr th, .table1_middle_table tr th {
  width:16%;
  height: 50px;
  border: 1px solid black;
}
.table1_top_table tr td, .table1_middle_table tr th {
  width:16%;
  height: 50px;
  border: 1px solid black;
  word-wrap: break-word; /* 允许长单词换行 */
  overflow-wrap: break-word; /* 更现代的换行属性 */
}
#table1_top_table_last_col{
  width:20%;
  min-height: 50px;
}
.table1_middle_table, .table1_middle_table th{
  border-bottom: none !important;
  border-top: none !important;
}
/*单独设置中下方表格每行的样式*/
.table1_middle_bottom_table tr th{
  border-bottom: none;
}
#table1_mb_1, #table1_mb_2, #table1_mb_3, #table1_mb_4 , #table1_mb_5, #table1_mb_6 {
  border: 1px black solid;
}
#table1_mb_1{
  width: 32%;
}
#table1_mb_2{
  width: 14%;
}
#table1_mb_3{
  width: 4%;
}
#table1_mb_4 {
  width: 14%;
}
#table1_mb_5{
  width: 32%;
}
#table1_mb_6 {
  width: 4%;
}
.table1_bottom_table{
  width: 100%;
  border-collapse: collapse;
}
/*主数据展示部分的单元格高度设置*/
.table1_bottom_table tr td{
  height: 100px;
}
.table1_bottom1{
  width:90%;
  margin: 0 auto;
}
.table1_bottom1 div{
  width:3%;
}
#table1_bottom_1{
  width: 6%;
}
#table1_bottom_2 {
  width: 26%;
}
#table1_bottom_3 {
  width:14%;
}
#table1_bottom_4 {
  width: 4%;
}
#table1_bottom_5{
  width: 14%;
}
#table1_bottom_6 {
  width: 32%;
}
#table1_bottom_7 {
  width: 4%;
}
.table1_bottom1_div{
  position: absolute;
  top:0;
  left: 0;
  width:3%;
  height:100%;
  z-index:10;
  background: white;
  border-top: 1px solid black;
  border-left:1px solid black;
  border-bottom:1px solid black;
}
/*设置主控项目表格样式*/
.table1_bottom_table tr td{
  border: 1px black solid;
  word-wrap: break-word; /* 允许长单词换行 */
  overflow-wrap: break-word; /* 更现代的换行属性 */
}
</style>
