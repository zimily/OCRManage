<template xmlns:el-col="http://www.w3.org/1999/html">
  <div style="display: flex">
    <!--左边-->
    <div style="width: 50%;height: 100%">
      <div>
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="图片示例:">
                    <div style="display: flex">
                      <div class="form-cell-ellipsis">{{ imgName }}</div>
                      <el-upload
                        class="imp-button"
                        :action="aaa"
                        name="excelFile"
                        multiple
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="importImg"
                      >
                        <el-button
                          type="primary"
                        >选择
                        </el-button>
                      </el-upload>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="对应台账:">
                    <el-select
                      v-model="form.reportType"
                      :placeholder="reportTypes[0].label"
                      @change="reportTypeChange"
                    >
                      <el-option
                        v-for="item in reportTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="模板名称:">
                <el-input v-model="form.templateName" placeholder="请输入内容" />
              </el-form-item>
              <el-row>
                <el-col :span="12" style="padding-right: 10px">
                  <el-form-item label="公司名称:">
                    <el-input v-model="form.companyName" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报告名称:">
                    <el-input v-model="form.reportName" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          :data="form.items"
          height="30em"
          style="width: 100%;"
          border
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column prop="x1" label="x1" align="center" />
          <el-table-column prop="y1" label="y1" align="center" />
          <el-table-column prop="x2" label="x2" align="center" />
          <el-table-column prop="y2" label="y2" align="center" />
          <el-table-column prop="belongGroup" label="分组" align="center">
            <template v-slot="scope">
              <el-select v-model="scope.row.belongGroup" :placeholder="fenzu[0].label" @change="changeXiang(scope)">
                <el-option
                  v-for="item in fenzu"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="fieldId" label="项" align="center">
            <template v-slot="scope">
              <el-select v-model="scope.row.fieldId" :placeholder="xiangList[0].label" @change="changeXiang(scope)">
                <el-option
                  v-for="item in xiangList"
                  :key="item.tfid"
                  :label="item.label"
                  :value="item.tfid"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" align="center">
            <template v-slot="scope">
              <el-button
                type="danger"
                size="mini"
                @click="deleteData(scope)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px">
          <span>{{ `表格坐标  （${graphXY.x1}, ${graphXY.y1}）至 （${graphXY.x2}, ${graphXY.y2}）` }}</span>
          <el-button v-if="op===1" style="margin-left: 25em" type="primary" @click="makeGraphXY">表格坐标划定</el-button>
          <el-button v-else style="margin-left: 25em" type="primary" @click="makeGraphXY">确定</el-button>
        </div>
        <div style="margin-top: 50px">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
    <!--右边图片-->
    <div style="width: 50%; height: 50em;position: relative;">
      <img
        ref="urlInfo"
        :src="imgUrl"
        alt=""
        @load="getImgSize"
      >
      <canvas ref="markCanvas" tabindex="0" />
      <canvas ref="markCanvas2" :class="op===1?'markCanvas1':'markCanvas2'" tabindex="0" />
    </div>
  </div>
</template>

<script>

import { draw, reDraw } from '@/api/makeRectangle'
import { getTemplateById, postTemplates } from '@/api/ocrTest'
import { getFields } from '@/api/ocrEntry'

export default {
  data() {
    return {
      imgName: '', // 导入的图片名字
      aaa: '',
      reportTypes: [{
        value: 1,
        label: '钢筋原材'
      }, {
        value: 2,
        label: '钢筋机械连接'
      }, {
        value: 3,
        label: '钢筋焊接'
      }, {
        value: 4,
        label: '混凝土强度'
      }],
      textarea: '',
      selectXiang: '', // 对应项的初始值
      form: { items: [] },
      fenzu: [{
        value: 0,
        label: '公共'
      }, {
        value: 1,
        label: '第1组'
      }, {
        value: 2,
        label: '第2组'
      }, {
        value: 3,
        label: '第3组'
      }, {
        value: 4,
        label: '第4组'
      }, {
        value: 5,
        label: '第5组'
      }, {
        value: 6,
        label: '第6组'
      }],
      xiangList: [[]],
      tableValue: [],
      tmpIndex: -1,
      imgUrl: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.VzhOTC3SVqdVV48AhF5grwHaFS?rs=1&pid=ImgDetMain&o=7&rm=3',
      markList: [], // 标记矩形数组 x,y,w,h
      markList2: [], // 标记表格坐标数组 x,y,w,h
      graphXY: { x1: 0, y1: 0, x2: 0, y2: 0 }, // 表格坐标 x,y,w,h
      op: 1, // 选择当前是canvas1还是canvas2
      imgInfo: {},
      displayedWidth: 1, // 图片的展示宽度
      displayedHeight: 1, //  图片的展示高度
      naturalWidth: 1, // 实际宽度
      naturalHeight: 1, // 实际高度
      offsetX: 0, // 图片左上角坐标（相对于容器）
      offsetY: 0,
      scale: 1, // 缩放比例
      containerWidth: 1, // 容器宽度
      containerHeight: 1// 容器高度
    }
  },
  computed: {
    templateId() {
      return parseInt(this.$route.query.templateId)
    }
  },
  watch: {
    markList: {
      handler(newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          if (i >= this.form.items.length) {
            this.form.items.push({
              belongGroup: 0,
              fieldId: 0,
              templateId: this.templateId,
              templateItemId: 0, // 11111111111111111111111111111111111这个怎么传
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0
            })
          }
          this.form.items[i].x1 = Math.round((newValue[i].x - this.offsetX) / this.scale)
          this.form.items[i].y1 = Math.round((newValue[i].y - this.offsetY) / this.scale)
          this.form.items[i].x2 = Math.round((newValue[i].x + newValue[i].w - this.offsetX) / this.scale)
          this.form.items[i].y2 = Math.round((newValue[i].y + newValue[i].h - this.offsetY) / this.scale)
        }
      }
    },
    markList2: {
      handler(newValue, oldValue) {
        const temp = []
        for (let i = 0; i < newValue.length; i++) {
          temp.push({
            x1: Math.round((newValue[i].x - this.offsetX) / this.scale),
            y1: Math.round((newValue[i].y - this.offsetY) / this.scale),
            x2: Math.round((newValue[i].x + newValue[i].w - this.offsetX) / this.scale),
            y2: Math.round((newValue[i].y + newValue[i].h - this.offsetY) / this.scale)
          })
        }
        this.graphXY = temp[0]
      }
    },
    deep: true
  },
  async created() {
    if (this.templateId !== 0) {
      await this.getTemplateById()
    }
    this.getImgInfo()
  },
  methods: {
    async getTemplateById() {
      try {
        const { result } = await getTemplateById(this.templateId)
        console.log('获取模板详情(含所有项)', result)
        this.form = result
        // this.imgUrl = result.imageExample
        const pos = result.tablePos.split(',')
        this.graphXY = {
          x1: parseInt(pos[0]),
          y1: parseInt(pos[1]),
          x2: parseInt(pos[2]),
          y2: parseInt(pos[3])
        }

        if (result.reportType) {
          await this.getFields(result.reportType)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getFields(report_type) {
      try {
        const res = await getFields(report_type)
        console.log('根据台账类型获取需ocr的列名', res)
        this.xiangList = res.data
        console.log('xiangList', this.xiangList)
      } catch (error) {
        console.log(error)
        this.$message.error('出错啦，请稍后重试！')
      }
    },
    async postTemplates() {
      try {
        const { result } = await postTemplates(this.form)
        console.log('创建模板(含初始项)', result)
      } catch (error) {
        console.log(error)
      }
    },
    importImg(file) {
      console.log(file)
      this.imgName = file.name
      this.imgUrl = URL.createObjectURL(file.raw)
    },
    reportTypeChange(report_type) {
      // console.log('reportTypeChange', val)
      this.getFields(report_type)
    },
    // 获取图片真实宽高
    getImgSize() {
      const imgElement = this.$refs.urlInfo
      if (imgElement) {
        console.log('图片加载完成', imgElement)
        this.naturalWidth = imgElement.naturalWidth // 实际宽度
        this.naturalHeight = imgElement.naturalHeight // 实际高度
        this.containerWidth = imgElement.clientWidth // 容器宽度
        this.containerHeight = imgElement.clientHeight // 容器高度

        // 计算缩放比例
        this.scale = Math.min(this.containerWidth / this.naturalWidth, this.containerHeight / this.naturalHeight)

        // 实际显示宽高
        this.displayedWidth = this.naturalWidth * this.scale
        this.displayedHeight = this.naturalHeight * this.scale

        // 图片左上角坐标（相对于容器）
        this.offsetX = (this.containerWidth - this.displayedWidth) / 2
        this.offsetY = (this.containerHeight - this.displayedHeight) / 2

        console.log(this.containerWidth, this.containerHeight, this.naturalWidth, this.naturalHeight, this.scale)
        console.log('实际显示宽度:', this.displayedWidth)
        console.log('实际显示高度:', this.displayedHeight)
        console.log('图片左侧偏移:', this.offsetX)
        console.log('图片顶部偏移:', this.offsetY)
        this.initCanvas()
      }
    },
    getImgInfo() {
      if (this.imgUrl !== '') {
        const img = new Image()
        img.src = this.imgUrl
        img.onload = () => {
          // 图片加载完成后执行 initCanvas
          this.initCanvas()
        }
      }
    },
    deleteData(scope) {
      const { $index } = scope
      // 删除
      this.markList.splice($index, 1)
      this.form.items.splice($index, 1)

      const cav = this.$refs.markCanvas
      const ctx = cav.getContext('2d')
      // console.log(this.markList, $index)
      reDraw(cav, ctx, this.markList)
    },
    changeXiang(scope) {
      console.log(scope.row)
    },
    // 表格坐标划定按钮
    makeGraphXY() {
      this.op = this.op ^ 1
      const cav = this.$refs.markCanvas
      const ctx = cav.getContext('2d')
      reDraw(cav, ctx, this.markList)
      const cav2 = this.$refs.markCanvas2
      const ctx2 = cav2.getContext('2d')
      reDraw(cav2, ctx2, this.markList2)
      if (this.markList2.length !== 0) {
        this.markList2.forEach(function(value, index, array) {
          ctx2.beginPath()
          ctx2.strokeStyle = 'green'
          ctx2.rect(value.x, value.y, value.w, value.h)
          ctx2.stroke()
          ctx2.closePath()
        })
      }
    },
    save() {
      this.form.imageExample = this.imgUrl
      if (this.graphXY.x1 !== 0 || this.graphXY.y1 !== 0 || this.graphXY.x2 !== 0 || this.graphXY.y2 !== 0) {
        this.form.tablePos = this.graphXY.x1 + ',' + this.graphXY.y1 + ',' + this.graphXY.x2 + ',' + this.graphXY.y2
      }
      this.form.templateId = this.templateId
      console.log('form', this.form)
      console.log('form', JSON.stringify(this.form))
      this.postTemplates()
      // this.$router.replace('/menus/ocrTemplate/ocrManage')
      // console.log({
      //   "items":[{
      //     "belongGroup":0,
      //     "fieldId":0,
      //     "templateId":0,
      //     "templateItemId":0,
      //     "x1":48,
      //     "y1":45,
      //     "x2":159,
      //     "y2":66,
      //     "xiang":1}],
      //   "templateName":"aaa",
      //   "reportType":1,
      //   "imageExample":"https://ts2.tc.mm.bing.net/th/id/OIP-C.VzhOTC3SVqdVV48AhF5grwHaFS?rs=1&pid=ImgDetMain&o=7&rm=3","templateId":0,
      //   "companyName":"aaa",
      //   "reportName":"aa",
      //   "tablePos":"9,8,456,324"})
      // console.log(
      //   {
      //     'items': [],
      //     'imageExample': 'https://ts2.tc.mm.bing.net/th/id/OIP-C.VzhOTC3SVqdVV48AhF5grwHaFS?rs=1&pid=ImgDetMain&o=7&rm=3',
      //     'templateId': 0
      //   })
    },
    cancel() {
      this.$router.replace('/menus/ocrTemplate/ocrManage')
    },
    initCanvas() {
      this.$nextTick(() => {
        // 初始化canvas宽高
        const cav = this.$refs.markCanvas
        cav.width = this.containerWidth
        cav.height = this.containerHeight
        const ctx = cav.getContext('2d')
        ctx.strokeStyle = 'red'
        cav.style.cursor = 'crosshair'
        // 计算使用变量
        // 按比例缩放
        const { x1, y1, x2, y2 } = this.graphXY
        console.log(x1, y1, x2, y2)
        if (x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0) {
          this.markList2 = []
          this.markList2.push({
            x: x1 * this.scale + this.offsetX,
            y: y1 * this.scale + this.offsetY,
            w: (x2 - x1) * this.scale,
            h: (y2 - y1) * this.scale
          })
        }
        this.markList = []
        this.form.items.forEach(item => {
          this.markList.push({
            x: item.x1 * this.scale + this.offsetX,
            y: item.y1 * this.scale + this.offsetY,
            w: (item.x2 - item.x1) * this.scale,
            h: (item.y2 - item.y1) * this.scale
          })
        })
        console.log('markList', this.markList)
        console.log('markList2', this.markList2)
        const list = this.markList// 画框数据集合, 用于服务端返回的数据显示和绘制的矩形保存
        // 若服务端保存的为百分比则此处需计算实际座标, 直接使用实际座标可省略
        // list.forEach(function(value, index, array) {
        //   const newValue = {
        //     x: value.x * cav.width,
        //     y: value.y * cav.height,
        //     w: value.w * cav.width,
        //     h: value.h * cav.height
        //   }
        //   list.splice(index, 1, newValue)
        // })
        // console.log(list)
        // 若list长度不为0, 则显示已标记框
        if (list.length !== 0) {
          list.forEach(function(value, index, array) {
            // 遍历绘制所有标记框
            ctx.rect(value.x, value.y, value.w, value.h)
            ctx.stroke()
          })
        }
        // 调用封装的绘制方法
        draw(cav, list)
        // 备注: js中对象操作指向的是对象的物理地址, 获取绘制完矩形的结果数组直接取用或处理this.markList即可

        const cav2 = this.$refs.markCanvas2
        cav2.width = this.containerWidth
        cav2.height = this.containerHeight
        const ctx2 = cav2.getContext('2d')
        ctx2.strokeStyle = 'red'
        cav2.style.cursor = 'crosshair'

        if (this.markList2.length !== 0) {
          this.markList2.forEach(function(value, index, array) {
            ctx2.beginPath()
            ctx2.strokeStyle = 'green'
            ctx2.rect(value.x, value.y, value.w, value.h)
            ctx2.stroke()
            ctx2.closePath()
          })
        }
        draw(cav2, this.markList2)
      })
    }
  }
}
</script>

<style scoped>
.form-cell-ellipsis {
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 利用穿透，设置input边框隐藏 */
.inputDeep ::v-deep {
  .el-input__inner {
    border: 0;
  }
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 9;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
}
.markCanvas1{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.markCanvas2{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 13;
}
</style>
