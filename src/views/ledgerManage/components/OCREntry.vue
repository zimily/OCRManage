<template xmlns:el-col="http://www.w3.org/1999/html">
  <div style="display: flex">
    <div style="width: 65%;margin-right: 1em">
      <el-card shadow="hover">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" label-width="8em">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="项目名称">
                    <el-select
                      v-model="projectSelect"
                      placeholder="请选择"
                      value=""
                      @change="projectChange"
                    >
                      <el-option
                        v-for="item in projectList"
                        :key="item.projectId"
                        :label="item.projectName"
                        :value="item.projectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单位工程(栋)">
                    <el-select
                      v-model="subprojectSelect"
                      placeholder="请选择"
                      value=""
                      @change="subprojectChange"
                    >
                      <el-option
                        v-for="item in subprojectList"
                        :key="item.subprojectId"
                        :label="item.subprojectName"
                        :value="item.subprojectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-form-item label="工程号">
                  <span>{{ projectInnerCode }}</span>
                </el-form-item>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-button type="primary" @click="changeIndex">关闭OCR面板</el-button>
        <el-table
          :data="tableData"
          max-height="30em"
          height="30em"
          style="width: 100%;overflow-y:scroll;overflow-x:auto;"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :row-style="rowStyle"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-for="(item, index) in fields"
            :key="index"
            :prop="`data.${item.field_name}`"
            :label="item.label"
            align="center"
            min-width="150"
            :fixed="item.field_name==='report_number' ? 'left' : false"
          >
            <template v-slot="scope">
              <span
                v-for="(item2,index2) in scope.row.data[item.field_name]"
                :key="index2"
                :class="{ 'highlight-cell': item.conf < 0.8 }"
              >
                <el-input v-model="item2.result" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-slot="scope" prop="prop" label="操作" align="center" width="180%" fixed="right">
            <template>
              <div
                @mouseover="handleover(scope)"
                @mouseleave="showTaizhangBox = false"
              >
                <el-button
                  type="primary"
                  size="mini"
                  @click="selectTaiZhang(scope)"
                >台账选择
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleDelete(scope)"
                >删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;margin-bottom: 1em">
          <div class="custom-button-group">
            <el-button
              v-for="(item,index) in failOCRImages"
              :key="index"
              :type="buttonIndex === index ? 'primary' : 'info'"
              class="custom-button"
              @click="changeButton(index)"
            >
              {{ item }}
            </el-button>
          </div>
          <div v-if="showTaizhangBox" style="width: 20%">
            <div v-if="category==='钢筋原材'">
              <div>当前选择台账:</div>
              <div>生产厂家:</div>
              <div>炉批号:</div>
              <div>钢筋种类:</div>
              <div>直径:</div>
              <div>使用部位:</div>
            </div>
            <div v-else-if="category==='钢筋机械连接'">
              <div>当前选择台账:</div>
              <div>工程部位:</div>
              <div>牌号:</div>
              <div>直径:</div>
              <div>等级和接头类型:</div>
              <div>代表批量:</div>
            </div>
            <div v-else-if="category==='钢筋焊接'">
              <div>当前选择台账:</div>
              <div>工程部位:</div>
              <div>钢筋牌号:</div>
              <div>直径:</div>
              <div>生产厂商:</div>
              <div>焊接类型:</div>
              <div>代表批量:</div>
            </div>
            <div v-else>
              <div>当前选择台账:</div>
              <div>使用部位:{{ scopeRow.usePart }}</div>
              <div>强度:{{ scopeRow.concreteStrength }}</div>
              <div>养护类型:{{ scopeRow.maintCondition }}</div>
              <div>代表批量:{{ scopeRow.representAmount }}</div>
            </div>
          </div>
        </div>
        <el-button type="primary">完成</el-button>
        <el-button type="info" @click="changeIndex">取消</el-button>
      </el-card>
    </div>
    <div style="width: 35%">
      <el-card shadow="hover">
        <el-form label-width="5em">
          <el-form-item label="文件"> <!-- 加载动画 -->
            <el-loading v-if="loading" :fullscreen="true" text="识别中..." />
            <div style="display: flex">
              <div class="form-cell-ellipsis">{{ fileName }}</div>
              <el-upload
                class="imp-button"
                :action="aaa"
                name="excelFile"
                multiple
                :show-file-list="false"
                :auto-upload="false"
                :on-change="importPDF"
              >
                <el-button
                  type="primary"
                >选择</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="模板选择">
            <el-select
              v-model="templateName"
              style="width: 80%"
              placeholder="请选择"
              value=""
              @change="TemplateChange"
            >
              <el-option
                v-for="item in templateList"
                :key="item.templateId"
                :label="item.templateName"
                :value="item.templateId"
              />
            </el-select>
            <el-button type="primary" @click="recognizeTemplate">识别</el-button>
          </el-form-item>
        </el-form>
        <div style="width: 100%; height: 800px;">
          <img
            ref="ocrImage"
            :src="imgUrl"
            style="width: 100%; height: 100%; object-fit: contain;"
            @load="onImageLoad"
          >
        </div>
      </el-card>
    </div>
    <TaizhangDialog
      v-if="isShow"
      :is-show="isShow"
      :category="category"
      :report_type="report_type"
      @save="taiZhangSave"
    />
  </div>
</template>

<script>
import TableItem from '@/views/project/components/tableItem.vue'
import TaizhangDialog from '@/views/ledgerManage/components/taizhangDialog.vue'
import pdf from 'vue-pdf'
import { getUser } from '@/utils/storage'
import {
  autodetect,
  pollAutodetect,
  getProjectNameList,
  getSubNameList,
  postProjectInfo, geTestURL, getImageURL, getFiles, getFields, getTemplate, specifieddetect
} from '@/api/ocrEntry'

export default {
  components: { TableItem, pdf, TaizhangDialog },
  props: {
    index: Number,
    category: String
  },
  data() {
    return {
      isShow: false, // 弹窗控制
      aaa: '',
      projectList: [], // 项目名称选择数组
      projectSelect: '', // 项目名称选择的值
      subprojectList: [], // 单位工程(栋)选择数组
      subprojectSelect: '', // 单位工程(栋)选择的值
      projectInnerCode: '', // 工程号
      projectId: 0,
      report_type: 0,
      fields: [], // 列名数组
      selectedRowIndex: -1, // 获取点击行的索引
      scopeRow: {}, // 点击/鼠标移到 选择台账按钮后，该按钮所在的行
      failOCRImages: [], // ocr失败图片列表
      task_ids: [], // 每张图片对应的任务id列表
      loading: false,
      modelList: [], // 模板选择数组
      templateName: '', // 模板选择的值
      template_id: '', // 模板选择的id
      imgName: '',
      imgUrl: '', // 图片地址
      showTaizhangBox: false,
      templateList: [], // 模板选择数组
      tableData: [
        [
          { name: 'check_company', pos: [169, 954, 320, 1007], result: '负二层水泥混鬣土垫层', conf: 0.8504528999328613, file: '' },
          { name: 'concrete_strength', pos: [169, 954, 320, 1007], result: '负二层水泥混鬣土垫层', conf: 0.8504528999328613, file: '' },
          { name: '例子', pos: [169, 954, 320, 1007], result: ['例子1', '例子2'], conf: 0.8504528999328613, file: '' }
        ],
        [
          { name: 'check_company', pos: [169, 954, 320, 1007], result: '负二层水泥混鬣土垫层', conf: 0.8504528999328613, file: '' },
          { name: 'concrete_strength', pos: [169, 954, 320, 1007], result: '负二层水泥混鬣土垫层', conf: 0.8504528999328613, file: '' },
          { name: '例子', pos: [169, 954, 320, 1007], result: ['例子1', '例子2'], conf: 0.8504528999328613, file: '' }
        ],
        [
          { name: 'check_company', pos: [169, 954, 320, 1007], result: '负二层水泥混鬣土垫层', conf: 0.8504528999328613, file: '' },
          { name: 'concrete_strength', pos: [169, 954, 320, 1007], result: '负二层水泥混鬣土垫层', conf: 0.8504528999328613, file: '' },
          { name: '例子', pos: [169, 954, 320, 1007], result: ['例子1', '例子2'], conf: 0.8504528999328613, file: '' }
        ]
      ],
      buttonIndex: -1, // 选中的按钮的下标
      fileName: '', // 导入的PDF文件名
      url: '' // 文件路径地址
    }
  },
  watch: {
    imgName(val) {
      this.getImageURL(val)
    }
  },
  created() {
    console.log('OCREntry', this.category)
    if (this.category === '钢筋原材') {
      this.report_type = 1
    } else if (this.category === '钢筋机械连接 ') {
      this.report_type = 2
    } else if (this.category === '钢筋焊接') {
      this.report_type = 3
    } else {
      this.report_type = 4
    }
    console.log('给每张图片设置多少秒超时时间合适')
    this.getProjectNameList()
  },
  mounted() {
    this.getFields()
    this.getTemplate()
  },
  methods: {
    async getProjectNameList() {
      try {
        console.log(getUser().userId)
        const res = await getProjectNameList(getUser().userId)
        if (res.code === 200) {
          // console.log('获取该用户的项目名称的列表', res)
          this.projectList = res.result || []
        } else {
          throw new Error(res.message || '获取项目列表状态失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async getSubNameList(projectId) {
      try {
        console.log()
        const res = await getSubNameList(projectId)
        if (res.code === 200) {
          // console.log('获取该用户的项目的单位工程的列表', res)
          this.subprojectList = res.result || []
        } else {
          throw new Error(res.message || '获取项目列表状态失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async postProjectInfo(projectId) {
      try {
        const res = await postProjectInfo(projectId)
        if (res.code === 200) {
          // console.log('根据项目id查询项目信息', res)
          this.projectInnerCode = res.result.projectInnerCode
        } else {
          throw new Error(res.message || '获取项目列表状态失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async getTemplate() {
      try {
        const { result } = await getTemplate(this.report_type)
        console.log('获取台账表单数据', result)
        this.templateList = result
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async getFields() {
      try {
        const res = await getFields(this.report_type)
        console.log('根据台账类型获取需ocr的列名', res)
        this.fields = res.data
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async autodetect(data) {
      this.loading = true
      try {
        const res = await autodetect(data)
        if (res.code === 200) {
          console.log('自动匹配模板并识别所需信息', res)
          this.task_ids = res.task_ids
          this.tableData = []

          // 调用pollAutodetect,拿表格需要的数据
          this.task_ids.forEach(taskId => {
            pollAutodetect(taskId, (err, result, taskStatus) => {
              if (err) {
                console.error('轮询失败:', err)
              } else {
                console.log('OCR识别结果:', taskId, result, taskStatus)
                // 处理识别结果
                if (taskStatus === 'FAILED') {
                  this.failOCRImages.push(result.results_fail[0].file_name)
                } else {
                  result.results_success.forEach(item => {
                    this.tableData.push(item)
                  })
                }
              }
            })
          })
        } else {
          throw new Error(res.message || '自动匹配模板失败')
        }
      } catch (error) {
        console.log('自动匹配模板失败', error)
      }
    },
    async specifieddetect(data) {
      try {
        const res = await specifieddetect(data)
        console.log('提交指定模板的OCR任务', res)
        this.task_ids = res.task_ids

        // 调用pollAutodetect,拿表格需要的数据
        this.task_ids.forEach(taskId => {
          pollAutodetect(taskId, (err, result, taskStatus) => {
            if (err) {
              console.error('轮询失败:', err)
            } else {
              console.log('OCR识别结果:', taskId, result, taskStatus)
              // 处理识别结果

              if (taskStatus === 'FAILED') {
                this.failOCRImages.push(result.results_fail[0].file_name)
              } else {
                result.results_success.forEach(item => {
                  this.tableData.push(item)
                })
              }
            }
          })
        })
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async getImageURL(imgName) {
      try {
        const res = await getImageURL(imgName)
        if (res.code === 200) {
          // console.log('获取提取的图片', res)
          this.imgUrl = res.data
        } else {
          throw new Error(res.message || '获取图片失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('获取图片失败')
      }
    },

    projectChange(projectId) {
      this.projectId = projectId
      this.getSubNameList(projectId)
      this.postProjectInfo(projectId)
    },
    subprojectChange(subprojectId) {
      console.log('subprojectId', subprojectId)
    },
    handleRowClick(row, event, column) {
      // 重置 buttonIndex
      this.buttonIndex = -1
      if (this.selectedRowIndex !== -1) {
        this.selectedRowIndex = -1
      } else {
        // 获取点击行的索引并更新 selectedRowIndex
        this.selectedRowIndex = this.tableData.indexOf(row)
      }
      console.log('row', row)
      this.imgName = row.file_name
    },
    rowStyle({ row, rowIndex }) {
      // 如果当前行是选中的行，则返回特定的样式
      if (rowIndex === this.selectedRowIndex) {
        return { backgroundColor: '#f5f7fa' } // 改变行的颜色
      }
      return {}
    },
    TemplateChange(val) {
      this.template_id = val
    },
    recognizeTemplate() {
      // 有选中的情况
      if (this.buttonIndex !== -1 || this.selectedRowIndex !== -1) {
        // 传数据
        if (this.template_id !== '' && this.imgName !== '' && this.projectId !== 0) {
          this.buttonIndex = -1
          this.selectedRowIndex = -1
          const data = {
            image_file: this.imgName,
            template_id: this.template_id,
            report_type: this.report_type,
            project_id: this.projectId
          }
          this.tableData = this.tableData.filter(item => item.file_name !== this.imgName)
          this.failOCRImages = this.failOCRImages.filter(item => item !== this.imgName)
          this.specifieddetect(data)
        }
      }
    },
    selectTaiZhang(scope) {
      this.scopeRow = scope.row.data
      this.isShow = true
    },
    handleover(scope) {
      console.log(scope.row)
      this.scopeRow = scope.row.data
      this.showTaizhangBox = true
      console.log('handleover', this.showTaizhangBox)
    },
    handleDelete(scope) {},
    changeButton(index) {
      // 重置 selectedRowIndex
      this.selectedRowIndex = -1
      if (this.buttonIndex === index) {
        this.buttonIndex = -1
      } else {
        // 改变按钮的索引，从而改变样式
        this.buttonIndex = index
      }
      // 改变图片名称，从而改变图片
      this.imgName = this.failOCRImages[index]
    },
    importPDF(file) {
      if (this.projectId !== 0) {
        this.fileName = file.name
        // console.log('file', file)
        // const tempURL = URL.createObjectURL(file.raw)

        const formData = new FormData()
        formData.append('files', file.raw)
        formData.append('project_id', this.projectId)
        formData.append('report_type', this.report_type)
        this.autodetect(formData)
      }
    },
    onImageLoad() {
      const imgElement = this.$refs.ocrImage
      if (imgElement) {
        const naturalWidth = imgElement.naturalWidth // 实际宽度
        const naturalHeight = imgElement.naturalHeight // 实际高度

        const displayWidth = imgElement.clientWidth // 显示宽度（含 padding）
        const displayHeight = imgElement.clientHeight // 显示高度（含 padding）

        console.log('实际尺寸:', `${naturalWidth}x${naturalHeight}`)
        console.log('显示尺寸:', `${displayWidth}x${displayHeight}`)
      }
    },
    taiZhangSave(data) {
      if (data) {
        console.log(data)
        Object.assign(this.scopeRow, data)
      }
      this.isShow = false
    },
    // 取消按钮，同时向父组件传参，
    changeIndex() {
      this.$emit('update-index', 0)
    },
    handleEdit(scope, item, val) {
      console.log(scope, item, val)
    }
  }
}
</script>

<style>
.form-cell-ellipsis {
  width:80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.custom-button-group {
  width: 80%;
  display: flex;
  flex-wrap: wrap; /* 允许按钮换行 */
  gap: 10px; /* 按钮之间的间距 */
  justify-content: flex-start;
}
.highlight-cell {
  background-color: red;
  color: white; /* 提高可读性 */
}
/*.custom-button {
  width: 3em;
  height: 3em;
  flex: 0 0 calc(20% - 2em); !* 每行显示5个按钮，减去gap影响 *!
  white-space: nowrap;
}*/
.el-button-group{
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.custom-button-group .custom-button:first-child {
  margin-left: 10px !important;
}
</style>
