<template>
<div>
   <div style="display: flex; gap: 10px;"> 
      <span style="margin-right: 8px; margin-top: 10px;">单位工程：</span>
      <!-- 数据 -->

      <span style="margin-top: 10px;">检验批部位：</span>
      <!-- 数据 -->

      <span style="margin-top: 10px;">检验批名称：</span>
      <!-- 数据 -->

      <span style="margin-top: 10px;">检验批容量：</span>
      <!-- 数据 -->

   </div>
  
  <el-table
    :data="tableData"
    stripe
    style="width: 100%"
    :row-class-name="rowClassName">
    <!-- 复选框列 -->
    <el-table-column
      label="不通过项目选择"
      width="60"
      align="center">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
      </template>
    </el-table-column>
    <!-- 其他列 -->
    <el-table-column
      prop="project"
      label="验收项目"
      width="150"
      align="center">
    </el-table-column>
    <el-table-column
      prop="require"
      label="设计要求及规范规定"
      width="150"
      align="center">
    </el-table-column>
    <el-table-column
      prop="sum"
      label="样本总数"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="min"
      label="最小抽样批量"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="reality"
      label="实际抽样批量"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="record"
      label="验收记录"
      width="150"
      align="center">
    </el-table-column>
    <el-table-column
      prop="value"
      label="合格率"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="master"
      label="是否为主控项"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      label="操作"
      align="center">
      <template slot-scope="scope">
        <el-button type="primary" @click="dialogTableVisible = true">查看数据</el-button>
        <el-dialog title="原始数据展示" :visible.sync="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column property="position" label="采集部位" width="220" align="center">
          </el-table-column>
          <el-table-column property="data" label="原始数据" width="220" align="center">
          </el-table-column>
          <el-table-column property="regular" label="是否合格" align="center">
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
      </template>
    </el-table-column>
  </el-table>
  <div>
    <!-- 选中不通过后这个按钮变成红色，文本为提交 -->
    <el-button type="primary">全部通过</el-button>
    <el-button>取消</el-button>  
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      Subcontractor: '',
      build:'',
      optionsEdit: [{
        value: '选项1',
        label: '墙'
      }, {
        value: '选项2',
        label: '板'
      },{
        value: '选项3',
        label: '梁'
      }, {
        value: '选项4',
        label: '柱'
      },{
        value: '选项5',
        label: '电梯井'
      }, {
        value: '选项6',
        label: '钢筋'
      },{
        value: '选项7',
        label: '混凝土'
      }, {
        value: '选项8',
        label: '机械连接'
      },{
        value: '选项9',
        label: '独立基础'
      }],
      distribute:'', // 状态选择器值
      gridData: [{
        position: '1施工段墙',
        data: '-3mm',
        regular: '合格'
      },{
        position: '1施工段墙',
        data: '+1mm',
        regular: '合格'
      },{
        position: '1施工段柱',
        data: '0mm',
        regular: '合格'
      }],
      dialogTableVisible: false,
      tableData: [
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality:'6',
          record:'/',
          value:'100%',
          master:'是'
        },
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality:'6',
          record:'/',
          value:'100%',
          master:'是'
        },
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality:'6',
          record:'/',
          value:'100%',
          master:'是'
        },
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality:'6',
          record:'/',
          value:'100%',
          master:'是'
        }
      ],
      options: [{
        value: '选项1',
        label: '台账采集员'
      }, {
        value: '选项2',
        label: '测量采集员'
      }],
      distribute:'', // 状态选择器值
    }
  },
  methods:{
    rowClassName({row}){
      return row.isChecked ? 'checked-row' : 'unchecked-row'
    }
  }
}
</script>

<style>
/* 被选中时颜色 */
/* .checked-row{
  color: #999999;
} */
 /* 未被选中时颜色 */
.unchecked-row{
  color: #A9A9A9;
}
</style>