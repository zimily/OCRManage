<template>
  <div>
    <!-- 根据类别控制按钮显示 -->
    <el-row v-if="category === '钢筋原材'" style="margin-bottom: 20px">
      <span style="margin-right: 20px" >快捷录入方式：</span>
      <el-button type="primary" style="margin-right: 20px" @click="openMaterialPlatformDialog">选择物资平台数据</el-button>
      <span style="margin-right: 20px" >或</span>
      <el-button type="primary" @click="scanQRCode">二维码扫描</el-button>
    </el-row>
    <!-- 点击二维码扫描后，提交本地的二维码信息，并上传至服务器，服务器会返回数据，并保存到数据库中。 -->
    <el-dialog title="二维码扫描" :visible.sync="qrCodeDialogVisible">
      <!-- 添加 ref="upload" -->
      <el-upload
        ref="upload"
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload"
        :http-request="uploadQRCodeFile"
        :limit="1"
        accept="image/*"
      >
        <i class="el-icon-plus" />
      </el-upload>

      <div slot="footer">
        <el-button type="primary" @click="submitQRCode">提交</el-button>
        <el-button @click="qrCodeDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 台账录入界面 -->
    <div class="scrollable-content">
      <el-card>
        <el-row :gutter="2" style="margin-bottom: 10px;">
          <el-col :span="6">
            <span>项目名称：</span>
            <el-select v-model="project" placeholder="请选择" size="small" @change="changeProject">
              <el-option
                v-for="item in options1"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <span>单位工程（栋）：</span>
            <el-select v-model="subProject" placeholder="请选择" size="small" @change="changeSubproject">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <span>施工单位：</span>
            <span>{{ constructionUnit }}</span>
          </el-col>
          <el-col :span="6">
            <span>建设单位：</span>
            <span>{{ developmentUnit }}</span>
          </el-col>
          <el-col :span="6">
            <span>工程号：</span>
            <span>{{ projectNumber }}</span>
          </el-col>
        </el-row>
      </el-card>
      <!-- 三个卡片内容 -->
      <el-form ref="form1" :model="formData" :rules="rules" label-width="180px" class="compact-form">
        <el-row :gutter="2" class="equal-height-row">
          <el-col :span="8">
            <el-card class="card-box">
              <el-tag>材料信息</el-tag>
              <el-form-item
                v-for="(item, index) in field1"
                :key="index"
                :label="item.label"
                :prop="item.fieldName"
                :required="item.required"
              >
                <el-input v-model="formData[item.fieldName]" style="width: 250px;" size="small" />
              </el-form-item>
            </el-card>
          </el-col>
          <el-col v-if="!isShowOCRInfo" :span="8">
            <el-card class="card-box">
              <el-tag>见证送检信息</el-tag>
              <el-form-item
                v-for="(item, index3) in field2"
                :key="index3"
                :label="item.label"
                :prop="item.fieldName"
                :required="item.required"
              >
                <el-date-picker
                  v-if="item.dataType === 'DATE'"
                  v-model="formData[item.fieldName]"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
                <el-input v-else v-model="formData[item.fieldName]" size="small" style="width: 250px;" />
              </el-form-item>
            </el-card>
          </el-col>
          <el-col v-if="!isShowOCRInfo" :span="8">
            <el-card class="card-box">
              <el-tag>实验报告数据</el-tag>
              <el-form-item
                v-for="(item, index3) in field3"
                :key="index3"
                :label="item.label"
                :prop="item.fieldName"
                :required="item.required"
              >
                <el-date-picker
                  v-if="item.dataType === 'DATE'"
                  v-model="formData[item.fieldName]"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
                <el-input
                 v-else-if="item.dataCount === 1&& item.dataType != 'DATE'"
                  v-model="formData[item.fieldName]"
                  size="small"
                  style="width: 250px;"
                />
                <template v-else>
                  <el-input
                    v-for="i in item.dataCount"
                    :key="`${item.fieldName}_${i}`"
                    size="small"
                    :value="getMultiInputValue(item.fieldName, i - 1)"
                    :style="getInputStyle(item.dataCount)"
                    :placeholder="`请输入${item.label}${item.dataCount > 1 ? i : ''}`"
                    style="width: 50px;"
                    @input="val => updateMultiInputValue(item.fieldName, i - 1, val)"
                  />
                </template>
              </el-form-item>
            </el-card>
          </el-col>
          <el-col v-if="isShowOCRInfo" :span="16">
            <el-card class="ocr-card-box">
              <div style="font-size: 2em">OCR扫描结果</div>
              <div class="ocr-info-container">
                <div v-for="(item, index) in OCRInfo" :key="index" class="ocr-info-item">{{ item }}</div>
              </div>
              <el-button type="info" @click="closeOCRInfo">关闭</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-form>

      <div class="footer-buttons">
        <el-button type="primary" @click="save()">保存</el-button>
        <el-button @click="changeIndex()">取消</el-button>
      </div>
    </div>

    <!-- 物资选择对话框 -->
    <el-dialog title="选择物资平台数据" :visible.sync="dialogTableVisible">
      <el-table v-loading="loading" :data="mpData" element-loading-text="正在获取数据，请稍后..." @row-click="handleRowClick">
        <el-table-column label="选择" width="100" fixed>
          <template slot-scope="scope">
            <el-radio v-model="selectedRow" :label="scope.row">{{ '' }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column property="steelType" label="钢筋种类" width="150" align="center" />
        <el-table-column property="producer" label="生产厂家" width="200" align="center" />
        <el-table-column property="heatBatchNumber" label="炉批号" width="150" align="center" />
        <el-table-column property="diameter" label="公称直径（mm）" width="150" align="center" />
        <el-table-column property="antiQuakeLevel" label="抗震等级" width="150" align="center" />
        <el-table-column property="getAmount" label="进场批量（吨）" width="150" align="center" />
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        v-if="!loading"
        style="margin-top: 20px; text-align: center"
        :current-page="pageNum"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmMaterialSelection">确 定</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getAllProjectName,
  getAllSubrojectName,
  getFieldName,
  getProjectInfo,
  getFormData,
  saveLedgerData,
  uploadQrCode,
  getUsePartBySubProject,
} from '@/api/ledger'
import { getUser } from '@/utils/storage'
import { getMaterialPlatformData } from '@/api/materialPlatform'
export default {
  props: {
    index: Number,
    category: String,
    dataId: {
      type: Number,
      default: null // 默认值为null
    }
  },
  data() {
    return {
      selectedMaterial: null, // 当前选中的物资索引
      selectedMaterialData: null, // 当前选中的物资数据
      dialogTableVisible: false,
      userId: null,
      options1: [],
      project: '',
      options2: [],
      subProject: '',
      // 项目基本信息
      constructionUnit: '',
      developmentUnit: '',
      projectNumber: '',
      // 相关字段
      field1: [],
      field2: [],
      field3: [],
      formData: {

      },
      rules: {},
      // 物资平台相关
      mpData: [],
      selectedMaterialData: {}, // 选中的物资平台信息
      selectedRow: null, // 单选
      loading: false, // 加载状态
      pageNum: 1, // 当前页码 必填
      pageSize: 10, // 每页条数 必填
      total: 0,
      projectName: '润雅苑', // 项目名称
      beginTime: '', // 开始时间
      endTime: '', // 结束时间
      materialType: '', // 材料分类类型
      materialName: '', // 材料名称
      spec: '', // 规格型号
      qrCodeDialogVisible: false, // 二维码对话框可见性
      qrCodeImage: null, // 用于存储上传的图片
      isShowOCRInfo: false, // ocr扫描结果显示
      OCRInfo: [],
      usePartList: [], // 使用部位列表
    }
  },
  computed: {
    // 控制物资相关按钮的显示
    showMaterialButtons() {
      return this.category === 'raw'
    },
    // 台账类型
    ledgerType() {
      if (this.category === '钢筋原材') {
        return 1
      } else if (this.category === '钢筋机械连接') {
        return 2
      } else if (this.category === '钢筋焊接') {
        return 3
      } else if (this.category === '混凝土强度') {
        return 4
      } else {
        return 0 // 默认值
      }
    }
  },
  watch: {},
  created() {
    const user = getUser()
    this.userId = user.userId
  },
  mounted() {
    this.getAllProjectName()
    this.getFieldName()
    if (this.dataId) {
      // 如果有 dataId，说明是编辑状态
      this.editMaterialData()
    }
  },
  methods: {
    async getAllProjectName() {
      try {
        const res = await getAllProjectName(this.userId)
        if (res.code == 200) {
          this.options1 = res.result
        } else {
          throw new Error(res.message || '获取项目名称失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    changeProject(value) {
      console.log('选中的项目名称ID:', value)
      const projectId = String(value)
      // 处理项目选择变化
      this.getAllSubrojectName(projectId)
      this.getProjectInfo(projectId)
    },
    async getAllSubrojectName(projectId) {
      // 获取所有子项目名称
      try {
        const res = await getAllSubrojectName(projectId)
        if (res.code == 200) {
          console.log(res.result)
          this.options2 = res.result.map(item => ({
            value: item.subprojectId,
            label: item.subprojectName
          }))
        } else {
          throw new Error(res.message || '获取项目信息失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async getProjectInfo(projectId) {
      // 获取项目基本信息
      try {
        const res = await getProjectInfo(projectId)
        if (res.code == 200) {
          console.log(res.result)
          this.constructionUnit = res.result.jiansheCompanyName || ''
          this.developmentUnit = res.result.shigongCompanyName || ''
          this.projectNumber = res.result.projectInnerCode || ''
        } else {
          throw new Error(res.message || '获取项目信息失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    // 获取字段名称
    async getFieldName() {
      try {
        const res = await getFieldName(this.ledgerType)
        if (res.code == 200) {
          // 遍历 result 数组
          res.result.forEach(item => {
            switch (item.showPosition) {
              case 1:
                this.field1.push(item)
                break
              case 2:
                this.field2.push(item)
                break
              case 3:
                this.field3.push(item)
                break
              default:
                console.warn(`发现未知 showPosition 值: ${item.showPosition}`, item)
            }
          })
          console.log('字段名称获取成功', this.field1, this.field2, this.field3)
          // 生成表单校验规则
          this.generateRules()
        } else {
          throw new Error(res.message || '获取字段名称失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    changeSubproject(value) {
      console.log('选中的单位工程ID:', value)
      // 获取使用部位
      this.getUsePartList(value)
    },
    //获取使用部位
    async getUsePartList(subProjectId) {
      try {
        const res = await getUsePartBySubProject(subProjectId)
        if (res.code == 200) {
          console.log('获取使用部位成功', res)
          this.usePartList = res.result || []
        } else {
          throw new Error(res.message || '获取使用部位失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    getInputStyle(count) {
      return { width: `${100 / count}%` }
    },
    // 从 JSON 字符串中获取第 n 个值
    getMultiInputValue(fieldName, index) {
      if (!this.formData[fieldName]) return ''
      const arr = JSON.parse(this.formData[fieldName])
      return arr[index] || ''
    },
    // 更新 JSON 字符串中的第 n 个值
    updateMultiInputValue(fieldName, index, val) {
      const arr = this.formData[fieldName] ? JSON.parse(this.formData[fieldName]) : []
      arr[index] = val
      this.$set(this.formData, fieldName, JSON.stringify(arr))
    },
    // 编辑状态 获取原始物资数据
    async editMaterialData() {
      try {
        console.log('编辑状态，获取物资数据', this.ledgerType, this.dataId)
        const res = await getFormData(this.ledgerType, this.dataId)
        if (res.code == 200) {
          console.log('获取物资数据成功', res)
          this.formData = res.result
          this.constructionUnit = res.result.shigongCompanyName || ''
          this.developmentUnit = res.result.jiansheCompanyName || ''
          this.projectNumber = res.result.projectInnerCode || ''
          this.project = res.result.projectId || '',
          await this.getAllSubrojectName(this.project)
          this.subProject = res.result.subprojectId || ''
        } else {
          throw new Error(res.message || '获取物资数据失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    // 表单校验
    generateRules() {
      this.rules = {}
      const allFields = [...this.field1, ...this.field2, ...this.field3]
      allFields.forEach(item => {
        if (item.required) {
          this.rules[item.fieldName] = [
            { required: true, message: `请输入${item.label}`, trigger: 'blur' }
          ]
        }
      })
    },
    // 保存按钮
    async save() {
      if (!this.project || !this.subProject) {
        this.$message.error('请选择项目名称和单位工程')
        return
      }
      this.$refs.form1.validate(async valid => {
        if (valid) {
          console.log('验证通过', this.formData)
          // 提交后端
          try {
            console.log('保存按钮被点击', this.formData, Object.keys(this.formData).length)
            // 1. 检查 this.formData 是否存在
            if (!this.formData || typeof this.formData !== 'object') {
              throw new Error('表单数据无效！')
            }
            console.log('项目数据信息', this.project, this.subProject)

            let isPassed = 0
            if (this.formData.reportNumber !== null && this.formData.reportNumber !== '' && this.formData.reportNumber !== undefined) {
              isPassed = 1
            }
            const formDataCopy = { ...this.formData }
            delete formDataCopy.jiansheCompanyName
            delete formDataCopy.projectInnerCode
            delete formDataCopy.projectId
            delete formDataCopy.shigongCompanyName
            delete formDataCopy.projectName
            delete formDataCopy.subprojectName

            // 2. 构造请求数据
            const data = {
              reportType: this.ledgerType,
              ledger: {
                dataId: this.dataId || null,
                projectId: this.project,
                subprojectId: this.subProject,
                jiansheCompany: this.constructionUnit,
                shigongCompany: this.developmentUnit,
                projectNumber: this.projectNumber,
                isPassed: isPassed,
                ...formDataCopy
              }
            }
            console.log('JSON:', JSON.stringify(data))
            console.log('请求数据:', data)
            const res = await saveLedgerData(data)

            // 4. 处理响应
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.$emit('update-index', 0) // 通知父组件
            } else {
              throw new Error(res?.message || '保存失败')
            }
          } catch (error) {
            console.error('保存出错:', error)
            this.$message.error(error.message || '出错啦，请稍后重试！')
          }
        } else {
          console.log('验证失败')
          return false
        }
      })
    },
    // 取消按钮，同时向父组件传参，
    changeIndex() {
      this.$emit('update-index', 0)
    },
    async openMaterialPlatformDialog() {
      this.loading = true
      this.dialogTableVisible = true
      await this.getMaterialPlatformData()
    },
    async getMaterialPlatformData() {
      this.loading = true
      this.mpData = []
      this.selectedRow = null
      try {
        const res = await getMaterialPlatformData(
          this.pageNum, this.pageSize,
          this.projectName, this.beginTime, this.endTime,
          this.materialType, this.materialName, this.spec
        )
        if (res.code === 0) {
          console.log('物资平台数据获取成功', res)
          this.mpData = res.data.records.map(item => ({
            // id: Number(item.id),
            steelType: '钢材',
            producer: item.supplierName,
            antiQuakeLevel: item.materialName,
            getAmount: item.checkNumsSum,
            heatBatchNumber: item.materialCode,
            diameter: '10'
          }))
          this.total = Number(res.data.total)
        } else {
          throw new Error(res.message || '获取物资平台数据失败')
        }
      } catch (error) {
        console.error('获取物资平台数据出错:', error)
        this.$message.error(error.message || '获取物资平台数据失败')
      } finally {
        this.loading = false
      }
    },
    async handleCurrentChange(value) {
      this.pageNum = value
      await this.getMaterialPlatformData()
    },
    async handleSizeChange(value) {
      this.pageSize = value
      this.pageNum = 1
      await this.getMaterialPlatformData()
    },
    handleRowClick(row) {
      this.selectedRow = row
    },
    confirmMaterialSelection() {
      if (this.selectedRow) {
        console.log('已选择的物资平台数据:', this.selectedRow)
        this.formData = {
          diameter: this.selectedRow.diameter,
          steelType: this.selectedRow.steelType,
          heatBatchNumber: this.selectedRow.heatBatchNumber,
          getAmount: this.selectedRow.getAmount,
          producer: this.selectedRow.producer,
          antiQuakeLevel: this.selectedRow.antiQuakeLevel
        }
      }
      this.dialogTableVisible = false
    },

    scanQRCode() {
      // 扫描二维码逻辑
      console.log('扫描二维码')
      this.qrCodeDialogVisible = true // 打开二维码输入对话框
    },
    submitQRCode() {
      if (!this.$refs.upload) {
        this.$message.error('上传组件未初始化')
        return
      }
      // 手动触发上传
      this.$refs.upload.submit()
    },
    // 自定义上传方法
    async uploadQRCodeFile(params) {
      const { file } = params
      // 构造请求数据
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await uploadQrCode(formData)
        if (res.code === 200) {
          this.$message.success('二维码上传成功')
          console.log('上传响应:', res)
          // 扫描二维码
          if (typeof res.result === 'object') {
            this.formData = {
              diameter: res.result.diameter,
              steelType: res.result.steelType,
              heatBatchNumber: res.result.heatBatchNumber,
              getAmount: res.result.getAmount,
              producer: res.result.producer,
              antiQuakeLevel: res.result.antiQuakeLevel
            }
          } else { // 扫描ocr图片
            this.OCRInfo = JSON.parse(res.result).data
            console.log('OCR扫描结果:', this.OCRInfo)
            this.isShowOCRInfo = true
          }
          // 关闭对话框
          this.qrCodeDialogVisible = false
          // 清空上传组件中的文件列表
          this.$refs.upload.clearFiles()
          // 清空二维码图片对象
          this.qrCodeImage = null
        } else {
          throw new Error(res.message || '二维码上传失败')
        }
      } catch (error) {
        console.error('上传出错:', error)
        this.$message.error(error.message || '出错啦，请稍后重试！')
      }
    },
    // 关闭OCR扫描的信息
    closeOCRInfo() {
      this.isShowOCRInfo = false
    },
    // 处理文件上传成功
    handleUploadSuccess(response, file) {
      const fileObject = file.raw // 获取原始文件对象
      this.qrCodeImage = fileObject // 将文件对象赋值给 qrCodeImage
      this.$message.success('图片上传成功')
      // console.log("提交二维码信息", this.qrCodeImage); // 现在应该能正确输出文件对象
    },
    // 文件上传前检查
    beforeUpload(file) {
      const isValidType = file.type.startsWith('image/')
      if (!isValidType) {
        this.$message.error('只能上传图片文件')
      }
      return isValidType
    }
  }
}

</script>
<style scoped>
.equal-height-row {
  display: flex;
  align-items: stretch;
  /* 让每个列的高度一致 */
}

.equal-height-row>>>.el-col {
  display: flex;
  flex-direction: column;
}

.card-box {
  flex: 1;
  /* 让 card 撑满列的高度 */
  display: flex;
  flex-direction: column;

}
.ocr-card-box {
  flex: 1;
  /* 让 card 撑满列的高度 */
  display: flex;
  flex-direction: column;
  background-color: #cfd3d2;
}
.compact-form .el-form-item {
  margin-bottom: 15px;
}

/*OCR扫描的样式*/
.ocr-info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1em;
}

.ocr-info-item {
  flex: 0 0 49%; /* 每项占据 49% 的宽度，加上间距 */
  box-sizing: border-box;
}

/* 添加el-tag居中和文字加粗样式 */
.card-box >>> .el-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  width: 100%;
  margin-bottom: 15px;
}
</style>

<style>
.ledger-entry-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 占满整个视口高度 */
  padding: 20px;
  box-sizing: border-box;
}

.scrollable-content {
  flex: 1;
  /* 占据剩余空间 */
  overflow-y: auto;
  /* 添加垂直滚动条 */
  padding-bottom: 20px;
  /* 为底部按钮留出空间 */
}

.footer-buttons {
  margin-right: 8px;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 10px;
}

.spaced-row {
  margin-bottom: 5px;
}
</style>
