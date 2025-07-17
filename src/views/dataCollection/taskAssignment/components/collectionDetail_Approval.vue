<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>单位工程：{{ subprojectName }}</span>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>检验批部位：{{ inspectPart }}</span>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>检验批名称：{{ inspectName }}</span>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: center">
          <span>检验批容量：{{ inspectVolume }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 5px">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 复选框列 -->
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <!-- <el-table-column label="是否通过" width="60" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
          </template>
        </el-table-column> -->
        <!-- 其他列 -->
        <el-table-column
          prop="project"
          label="验收项目"
          width="150"
          align="center"
        />
        <el-table-column
          prop="require"
          label="设计要求及规范规定"
          width="150"
          align="center"
        />
        <el-table-column prop="sum" label="样本总数" width="120" align="center" />
        <el-table-column
          prop="min"
          label="最小抽样批量"
          width="120"
          align="center"
        />
        <el-table-column
          prop="reality"
          label="实际抽样批量"
          width="120"
          align="center"
        />
        <el-table-column
          prop="record"
          label="验收记录"
          width="150"
          align="center"
        />
        <el-table-column prop="value" label="合格率" width="120" align="center" />
        <el-table-column
          prop="master"
          label="是否为主控项"
          width="120"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="dialogTableVisible = true"
            >查看数据
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="margin-top: 10px">
      <el-button
        type="primary"
        :disabled="multipleSelection.length === 0"
        @click="pass()"
      >通过
      </el-button>
      <el-button @click="cancel()">取消</el-button>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="原始数据展示"
      :visible.sync="dialogTableVisible"
      :show-close="false"
    >
      <div v-if="dataType===1">
        <el-row style="font-size: 1.5em">
          <el-col :span="4">合格数量</el-col>
          <el-col :span="20">{{ gridData.passed_amount }}/{{ gridData.check_amount }}</el-col>
        </el-row>
        <el-row style="font-size: 1.5em">
          <el-col :span="4">照片</el-col>
          <el-col :span="20">
            <div class="scrollable-container">
              <!-- 横向排列的内容 -->
              <div class="photo-list">
                <img v-for="photo in photos" :key="photo.id" :src="photo.url">
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="dataType===2">
        <el-table :data="gridData" stripe style="width: 100%">
          <el-table-column prop="inspect_part" label="采集部位" width="120" align="center" />
          <el-table-column prop="records" label="原始数据" align="center">
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.records" :key="index">
                {{ item.value }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="records" label="是否合格" align="center">
            <template v-slot="scope">
              <div v-for="(item, index) in scope.row.records" :key="index">
                {{ item.is_passed?'合格' : '不合格' }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else-if="dataType===3">
        试验报告数据
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getAllList, getCollectData } from '@/api/collection'
import { getImage } from '@/api/ocrTest'

export default {
  data() {
    return {
      inspectVolume: '钢筋6批',
      gridData: [], // 点击查看数据按钮后显示的表格数据
      dialogTableVisible: false,
      tableData: [
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality: '6',
          record: '/',
          value: '100%',
          master: '是'
        },
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality: '6',
          record: '/',
          value: '100%',
          master: '是'
        },
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality: '6',
          record: '/',
          value: '100%',
          master: '是'
        },
        {
          isChecked: false,
          project: '钢筋力学性能和重量偏差检验',
          require: '第5.2.1条',
          sum: '6',
          min: '全',
          reality: '6',
          record: '/',
          value: '100%',
          master: '是'
        }
      ],
      multipleSelection: [],
      dataType: null, // 1-观察 2-采集数据 3-报告
      photos: []
    }
  },
  computed: {
    rowData() {
      return this.$route.params.row
    },
    subprojectName() {
      return this.$route.params.row.subprojectName
    },
    inspectPart() {
      return this.$route.params.row.inspectPart
    },
    inspectName() {
      return this.$route.params.row.inspectType
    }
  },
  mounted() {
    console.log('row', this.rowData)
    console.log(this.subprojectName)
  },
  methods: {
    // 查看数据
    async viewData(value) {
      this.dialogTableVisible = true
      const data = {
        taskId: value.row.taskItem.taskId,
        inspectItemId: value.row.inspectItem.inspectItemId
      }
      this.dataType = value.row.inspectItem.dataType
      console.log('查看数据', data)
      try {
        const res = await getCollectData(data)
        if (res.code === 200) {
          console.log('查看采集数据', JSON.parse(res.result))
          if (JSON.parse(res.result)) {
            if (this.dataType === 1) {
              this.gridData = JSON.parse(res.result)[0]
              await this.getImage(this.gridData.photos)
            } else if (this.dataType === 2) {
              this.gridData = JSON.parse(res.result)
            }
          }
        } else {
          throw new Error(res.message)
        }
      } catch (error) {
        console.error('操作失败', error)
        this.$message.error('获取详情数据失败！')
      }
    },
    async getImage(photos) {
      try {
        console.log('图片数据', photos)
        if (photos && photos.length) {
          const { result } = await getImage(photos)
          console.log('返回值为url与base64的键值对集合', result)
          this.photos = []
          result.forEach((item, index) => {
            Object.keys(item).forEach(key => {
              this.photos.push({
                id: index,
                url: 'data:image/png;base64,' + item[key]
              })
            })
          })
          console.log(this.photos)
        }
        // this.imgUrl = 'data:image/png;base64,' + result[0][arr[0]]
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //通过
    async pass() {
      console.log("通过", this.multipleSelection);
      console.log("通过1", this.tableData);
      //数据整理
      const resultData = {
        taskId: '',
        taskItemList: [],
      }
      resultData.taskId = this.taskId;
      this.tableData.map(item => {
        const taskItem = {}
        if (item.isChecked) {
          taskItem.teskItemId = item.taskItem.taskItemId;
          taskItem.isChecked = 1

        } else {
          taskItem.teskItemId = item.taskItem.taskItemId;
          taskItem.isChecked = 0
        }
        resultData.taskItemList.push(taskItem)
      })
    },
    // 取消
    cancel() {
      this.$router.push({
        name: 'CollectionManage'
      })
    }
  }
}
</script>

<style>
</style>
