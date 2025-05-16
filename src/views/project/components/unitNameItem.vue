<template>
  <div>
    <div>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="subProInfo" label-width="170px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="单位工程名称">
                  <el-input
                    v-model="subProInfo.subprojecttName"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="勘察单位项目负责人">
                  <el-input
                    v-model="subProInfo.kanchaDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="施工单位项目负责人">
                  <el-input
                    v-model="subProInfo.shigongDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="监督单位项目负责人">
                  <el-input
                    v-model="subProInfo.jianduPeople"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="建设单位项目负责人">
                  <el-input
                    v-model="subProInfo.jiansheDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="施工面积（m²）">
                  <el-input v-model="subProInfo.area" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="监理单位项目负责人">
                  <el-input
                    v-model="subProInfo.jianliDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目技术负责人">
                  <el-input
                    v-model="subProInfo.technicalDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="设计单位项目负责人">
                  <el-input
                    v-model="subProInfo.shejiDirector"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <hr>
    <div>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" label-width="170px">
            <el-row>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="钢筋分项验收依据">
                  <el-select
                    :placeholder="options[0].label"
                    value=""
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="模板分项验收依据">
                  <el-select
                    :placeholder="options[0].label"
                    value=""
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="混凝土分项验收依据">
                  <el-select
                    :placeholder="options[0].label"
                    value=""
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-slot="scope" label="现浇结构分项验收依据">
                  <el-select
                    :placeholder="options[0].label"
                    value=""
                    @change="changeXiang(scope)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <hr>
    <!--   添加检验批部位   -->
    <el-button type="primary" @click="addInspect">添加检验批部位</el-button>
    <el-table
      :data="allInspect"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column prop="inspectName" label="检验批部位" align="center" />
      <el-table-column
        v-for="(item, index) in arrList"
        :key="index"
        v-slot="scope"
        :prop="item.value"
        :label="item.label"
        align="center"
      >
        <TableItem :value="scope.row.obj" :str="item.label" />
      </el-table-column>
      <el-table-column v-slot="scope" prop="prop" label="操作" align="center">
        <template>
          <el-button
            type="danger"
            size="mini"
            @click="deletejianyan(scope)"
          >删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗-->
    <el-dialog title="检验批部位添加" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-row>
          <el-col :span="24">
            <el-form label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="楼层范围">
                    <el-input
                      v-model="buildingFloor"
                      placeholder="请输入内容"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="至">
                    <el-input v-model="buildingTop" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="检验批部位名称">
                <el-input v-model="inspectName" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="检验批选择">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    v-for="(item, index) in arrList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInspect">确 定</el-button>
      </span>
    </el-dialog>
    <el-button type="primary" @click="preserve">保存</el-button>
    <el-button type="info" @click="cancel">取消</el-button>
  </div>
</template>

<script>
import TableItem from '@/views/project/components/tableItem.vue'

export default {
  components: { TableItem },
  data() {
    return {
      form: {},
      subProInfo: {
        subprojecttName: '保利心语佳苑1#楼', // 单位工程名称
        kanchaDirector: '张三', // 勘察单位负责人
        shigongDirector: '建工', // 施工单位负责人
        jianduPeople: '监工', // 监督单位负责人
        jiansheDirector: '建设单位负责人', // 建设单位负责人
        area: 10000, // 施工面积
        jianliDirector: '监理单位负责人', // 监理单位负责人
        technicalDirector: '设计单位负责人', // 项目技术负责人
        shejiDirector: '设计单位负责人' // 设计单位负责人
      },
      allInspect: [], // 所有检验批部位,
      options: [
        {
          value: 1,
          label: '黄金糕'
        },
        {
          value: 2,
          label: '双皮奶'
        },
        {
          value: 3,
          label: '蚵仔煎'
        }
      ],
      dialogVisible: false,
      buildingFloor: 0,
      buildingTop: 0,
      inspectName: '', // 检验批部位名称
      checkList: [], // 选中的复选框
      arrList: [
        { value: 'obj0', label: '钢筋原材' },
        { value: 'obj1', label: '钢筋加工' },
        { value: 'obj2', label: '钢筋连接' },
        { value: 'obj3', label: '钢筋安装' },
        { value: 'obj4', label: '模板安装' },
        { value: 'obj5', label: '混凝土拌合物' },
        { value: 'obj6', label: '混凝土施工' },
        { value: 'obj7', label: '现浇结构' }
      ]
    }
  },
  methods: {
    saveInspect() {
      for (let i = this.buildingFloor; i <= this.buildingTop; i++) {
        if (this.allInspect.findIndex(item => item.floor === i) !== -1) continue// 去重操作
        if (i === 0) {
          this.allInspect.push({
            floor: i,
            inspectName: '楼前地面',
            obj: this.checkList
          })
        } else {
          this.allInspect.push({
            floor: i,
            inspectName: i.toString() + '层' + this.inspectName,
            obj: this.checkList
          })
        }
      }

      // 排序
      this.allInspect.sort((a, b) => {
        return a.floor - b.floor
      })
      this.dialogVisible = false
    },
    addInspect() {
      this.dialogVisible = true
    },
    changeXiang(scope) {},
    cancel() {
      const data = { isShow: 0, // 右侧组件显示空白
        isAbled: false, // 新建按钮可用
        action: 'cancel'
      }
      this.$emit('transmit', data)
    },
    preserve() {
      const data = {
        isShow: 0, // 右侧组件显示空白
        isAbled: false, // 新建按钮可用
        action: 'preserve',
        nodeName: this.subProInfo.subprojecttName,
        obj: this.subProInfo
      }
      this.$emit('transmit', data)
    },
    deletejianyan(scope) {
      console.log(scope)
      this.allInspect.splice(scope.$index, 1)
    }
  }
}
</script>

<style>
.el-form-item {
  margin-bottom: 0;
}
.el-table .cell,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 0;
}
.el-table .cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 0;
}
.el-table td,
.el-table th {
  padding: 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
hr {
  color: gray;
  width: 90%;
}
</style>
