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
      <el-table :data="tableData" stripe style="width: 100%" :row-class-name="rowClassName">
        <el-table-column prop="inspectItem.itemName" label="验收项目" align="center" />
        <el-table-column prop="inspectItem.ruleStandard" label="设计要求及规范规定" align="center" />
        <el-table-column prop="taskItem.sampleAmount" label="样本总数" width="120" align="center" />
        <el-table-column prop="taskItem.minSample" label="最小抽样批量" width="120" align="center" />
        <el-table-column prop="taskItem.collectedAmount" label="实际抽样批量" width="120" align="center" />
        <el-table-column prop="taskItem.checkRecord" label="验收记录" width="200" align="center" />
        <el-table-column prop="taskItem.passRate" label="合格率" width="120" align="center" />
        <el-table-column prop="inspectItem.itemType" label="项目类型" align="center" width="100">
          <template v-slot="scope">
            <span v-if="scope.row.inspectItem.itemType === 1">主控项目</span>
            <span v-else-if="scope.row.inspectItem.itemType === 2">一般项目</span>
            <span v-else>未知项目类型</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              :disabled="scope.row.taskItem.isEmpty===1"
              @click="viewData(scope)"
            >查看数据
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="turnBack()">返回</el-button>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="原始数据展示" :visible.sync="dialogTableVisible" :show-close="false" @close="closeDialog">
      <div v-if="dataType===1">
        <el-row style="font-size: 1.5em">
          <el-col :span="4">合格数量</el-col>
          <el-col :span="20">{{ gridData.passed_amount }}/{{ gridData.check_amount }}</el-col>
        </el-row>
        <el-row style="font-size: 1.5em">
          <el-col :span="4">照片</el-col>
          <el-col :span="20">
            <div v-if="photos.length" class="scrollable-container">
              <!-- 横向排列的内容 -->
              <div class="photo-navigation">
                <el-button class="left-button" @click="prePage">上一页</el-button>
                <img :src="imgUrl">
                <el-button class="right-button" style="right: 1.5em" @click="nextPage">下一页</el-button>
                <div class="divs">
                  <div v-for="(item,index) in photos" :key="index" :class="{active:index===pageNum-1}" />
                </div>
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
                {{ item.is_passed ? '合格' : '不合格' }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else-if="dataType===3">
        试验报告数据
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskDetailData, getCollectData } from '@/api/collection'
import { getImage } from '@/api/ocrTest'

export default {
  data() {
    return {
      inspectVolume: '',
      gridData: [], // 点击查看数据按钮后显示的表格数据
      dialogTableVisible: false,
      tableData: [
        {
          inspectItem: {
            itemType: null
          },
          taskItem: {}
        }
      ],
      dataType: null, // 1-观察 2-采集数据 3-报告
      photos: [],
      pageNum: 1,
      imgUrl: '', // 图片地址
      intervalId: null // 用于保存定时器 ID
    }
  },
  computed: {
     rowData() {
      return this.$store.state.collection.currentRowData
    },
    taskId() {
      return this.$route.query.taskId
    },
    subprojectName() {
      return this.rowData.subprojectName
    },
    inspectPart() {
      return this.rowData.inspectPart
    },
    inspectName() {
      return this.rowData.inspectType
    }
   
  },
  mounted() {
    console.log('row', this.rowData)
    this.getDetailData()
    // console.log(this.subprojectName);
  },
  methods: {
    startAutoPlay() {
      if (this.photos.length) {
        this.intervalId = setInterval(() => {
          this.pageNum = this.pageNum % this.photos.length + 1
          this.imgUrl = this.photos[this.pageNum - 1].url
        }, 3000)
        console.log('开始自动播放', this.pageNum)
      }
    },
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId) // 清除定时器
        this.intervalId = null // 重置定时器 ID
      }
    },
    rowClassName({ row }) {
      return row.isChecked ? 'checked-row' : 'unchecked-row'
    },
    async getDetailData() {
      console.log('详情页面', this.taskId)
      try {
        const res = await getTaskDetailData(this.taskId)
        if (res.code == 200) {
          console.log('数据', res)
          this.tableData = res.result.taskItemList
          this.inspectVolume = res.result.taskInspectBatchVolumeList.map(item => `${item.sourceName}：${item.volume}`).join('；')
        } else {
          throw new Error(res.message)
        }
      } catch (error) {
        console.error('操作失败', error)
        this.$message.error('获取详情数据失败！')
      }
    },
    // 查看数据
    async viewData(value) {
      this.dialogTableVisible = true
      this.dataType = null
      this.gridData = [] // 清空 gridData
      this.photos = [] // 清空图片数据
      this.pageNum = 1
      this.stopAutoPlay() // 停止之前的自动播放
      console.log('查看数据', value)
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
              if (this.photos.length) {
                this.imgUrl = this.photos[this.pageNum - 1].url
                this.startAutoPlay()
              }
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
    prePage() {
      if (this.pageNum > 1) {
        this.pageNum--
      } else {
        this.pageNum = this.photos.length
      }
      this.imgUrl = this.photos[this.pageNum - 1].url
    },
    nextPage() {
      if (this.pageNum < this.photos.length) {
        this.pageNum++
      } else {
        this.pageNum = 1
      }
      this.imgUrl = this.photos[this.pageNum - 1].url
    },
    closeDialog() {
      this.dialogTableVisible = false
      this.stopAutoPlay()
    },
    // 返回
    turnBack() {
      this.$router.push({
        name: 'CollectionManage'
      })
    }
  }
}
</script>

<style scoped>
/* 被选中时颜色 */
/* .checked-row{
  color: #999999;
} */
/* 未被选中时颜色 */
::v-deep .unchecked-row {
  color: #a9a9a9;
}

img {
  width: 100%;
  height: 100%;
  margin-right: 1em;
  object-fit: contain;
}

.photo-navigation {
  position: relative;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  width: 100%;
  margin: 10px 0;
}

.photo-navigation button {
  position: absolute;
  background-color: grey;
  border: none;
  cursor: pointer;
  writing-mode: vertical-rl; /* 垂直排列文字 */
  white-space: nowrap; /* 防止文字换行 */
}
.photo-navigation .right-button{
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.photo-navigation .left-button{
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}
.photo-navigation .divs {
  position: absolute;
  display: flex;
  left: 0;
  bottom: 0.3em;
}

.photo-navigation .divs div {
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%; /* 设置为圆形 */
  background-color: #ccc; /* 默认背景颜色 */
  margin: 0 0.1em; /* 按钮之间的间距 */
}

.photo-navigation .divs .active {
  background-color: #409EFF; /* 选中时的背景颜色 */
  color: #fff; /* 选中时的文字颜色 */
}

.scrollable-container {
  overflow-x: auto; /* 横向滚动 */
  white-space: nowrap; /* 防止子元素换行 */
  max-width: 100%; /* 限制最大宽度 */
}
</style>
