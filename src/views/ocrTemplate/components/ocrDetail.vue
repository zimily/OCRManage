<template xmlns:el-col="http://www.w3.org/1999/html">
  <div>
    <!--左边-->
    <div style="width: 800px;height: 800px">
      <div>
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="图片示例:">
                    <input
                      id="showimg"
                      type="file"
                      style="font-size: 20px;line-height: 40px"
                      accept="image/*"
                      class="inputDeep"
                      @change="showImage"
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="对应台账:">
                    <el-select v-model="selectModel" :placeholder="ledgerData[0].label">
                      <el-option
                        v-for="item in ledgerData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="模板名称:">
                <el-input v-model="modelName" placeholder="请输入内容" />
              </el-form-item>
              <el-row>
                <el-col :span="12" style="padding-right: 10px">
                  <el-form-item label="公司名称:">
                    <el-input v-model="companyName" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报告名称:">
                    <el-input v-model="reportName" placeholder="请输入内容" />
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
          :data="currentPageData"
          style="width: 100%"
          border
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column
            prop="x1"
            label="x1"
            align="center"
          />
          <el-table-column
            prop="y1"
            label="y1"
            align="center"
          />
          <el-table-column
            prop="x2"
            label="x2"
            align="center"
          />
          <el-table-column
            prop="y2"
            label="y2"
            align="center"
          />
          <el-table-column prop="xiang" label="项" align="center">
            <template v-slot="scope">
              <el-select v-model="scope.row.xiang" :placeholder="options[0].label" @change="changeXiang(scope)">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
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
        <!-- 分页器 -->
        <el-pagination
          style="margin-top:20px; text-align:center"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20]"
          layout="prev, pager, next,jumper,->,sizes,total"
          :total="tableValue.length"
          :page-size="limit"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <div style="margin-top: 10px">
          <span>{{ `表格坐标  （${graphXY.x1}, ${graphXY.y1}）至 （${graphXY.x2}, ${graphXY.y2}）` }}</span>
          <el-button
            type="primary"
            style="margin-left: 250px"
            @click="dialogVisible=true"
          >添加项
          </el-button>
          <el-button v-if="op===1" type="primary" @click="makeGraphXY">表格坐标划定</el-button>
          <el-button v-else type="primary" @click="makeGraphXY">确定</el-button>
        </div>
        <div style="margin-top: 50px">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
    <!--右边图片-->
    <div style="width: 500px;height:800px;position: relative;left: 900px;top: -800px;">
      <img
        ref="urlInfo"
        :src="imgUrl"
        alt=""
        @load="getImgSize"
      >
      <canvas ref="markCanvas" tabindex="0" />
      <canvas ref="markCanvas2" :class="op===1?'markCanvas1':'markCanvas2'" tabindex="0" />
    </div>

    <!--添加项-->
    <el-dialog title="添加项" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="项名称">
          <el-input v-model="xiangName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addXiang">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { draw, reDraw } from '@/api/makeRectangle'
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      index: -1,
      textarea: '',
      selectModel: '', // 对应台账的初始值
      modelName: '', // 模板名称的初始值
      selectXiang: '', // 对应项的初始值
      companyName: '', // 公司名称的初始值
      reportName: '', // 报告名称的初始值
      form: {},
      options: [{
        value: 1,
        label: '黄金糕'
      }, {
        value: 2,
        label: '双皮奶'
      }, {
        value: 3,
        label: '蚵仔煎'
      }],
      tableValue: [],
      tmpIndex: -1,
      imgUrl: 'https://pica.zhimg.com/v2-7b9592a5ef7d7e5b2c71bfa3eb3d79c2_r.jpg?source=1940ef5c',
      dialogVisible: false, // 添加项的dialog是否显示
      xiangName: '', // 添加项的名称
      markList: [], // 标记矩形数组 x,y,w,h
      markList2: [], // 标记表格坐标数组 x,y,w,h
      graphXY: { x1: 0, y1: 0, x2: 0, y2: 0 }, // 表格坐标 x,y,w,h
      op: 1, // 选择当前是canvas1还是canvas2
      imgInfo: {},
      w: 1, // 图片的真实宽度
      h: 1, //  图片的真实高度
      currentPage: 1, // 分页器当前页码
      limit: 10 // 每页显示的数据
    }
  },
  computed: {
    ...mapState({
      'tableData': state => state.ocr.tableData,
      'ledgerData': state => state.ocr.ledgerData
    }),
    // 分页器当前页码对应的数据
    currentPageData() {
      return this.tableValue.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )
    }
  },
  watch: {
    markList: {
      handler(newValue, oldValue) {
        const temp = []
        for (let i = 0; i < newValue.length; i++) {
          temp.push({
            x1: Math.round(newValue[i].x * this.w / 500),
            y1: Math.round(newValue[i].y * this.h / 800),
            x2: Math.round((newValue[i].x + newValue[i].w) * this.w / 500),
            y2: Math.round((newValue[i].y + newValue[i].h) * this.h / 800),
            xiang: i >= this.tableValue.length ? '' : this.tableValue[i].xiang
          })
        }
        this.tableValue = temp
      }
    },
    markList2: {
      handler(newValue, oldValue) {
        const temp = []
        for (let i = 0; i < newValue.length; i++) {
          temp.push({
            x1: Math.round(newValue[i].x * this.w / 500),
            y1: Math.round(newValue[i].y * this.h / 800),
            x2: Math.round((newValue[i].x + newValue[i].w) * this.w / 500),
            y2: Math.round((newValue[i].y + newValue[i].h) * this.h / 800)
          })
        }
        this.graphXY = temp[0]
      }
    },
    deep: true
  },
  created() {
    this.index = this.$route.query.index

    if ((+this.index) !== -1) {
      console.log(this.imgUrl)
      this.imgUrl = this.tableData[this.index].imgUrl
      this.selectModel = this.tableData[this.index].templateNum
      this.modelName = this.tableData[this.index].name
      this.companyName = this.modelName.substring(0, 3)
      this.tableValue = this.tableData[this.index].detailData
      this.reportName = this.tableData[this.index].reportName
      this.graphXY = this.tableData[this.index].graphXY
    }
    // console.log(this.value)
    // console.log(this.index)
    this.getImgInfo()
  },
  methods: {
    // 展示图片
    showImage() {
      const file = document.getElementById('showimg').files[0]
      // console.log(file)
      this.imgUrl = URL.createObjectURL(file)
      // console.log(this.imgUrl)
    },
    // 获取图片真实宽高
    getImgSize(e) {
      this.w = e.target.naturalWidth
      this.h = e.target.naturalHeight
      console.log(this.w, this.h)
    },
    getImgInfo() {
      console.log(this.imgUrl)
      if (this.imgUrl !== '') {
        const img = new Image()
        img.src = this.imgUrl
        const vm = this
        img.onload = () => {
          vm.$set(vm.imgInfo, 'width', img.width)
          vm.$set(vm.imgInfo, 'height', img.height)
          vm.w = vm.imgInfo.width
          vm.h = vm.imgInfo.height

          // 图片加载完成后执行 initCanvas
          this.initCanvas()
        }
      }
    },
    deleteData(scope) {
      const { $index } = scope
      this.deleteDetail([this.index, $index])
      this.markList.splice($index, 1)

      const cav = this.$refs.markCanvas
      const ctx = cav.getContext('2d')
      // console.log(this.markList, $index)
      reDraw(cav, ctx, this.markList)
    },
    changeXiang(scope) {
      console.log(scope.row.xiang)
      const { $index } = scope
      this.tableValue[$index] = scope.row
    },
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      console.log(this.limit)
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    addXiang() {
      const index = this.options.length
      this.options.push({ value: index + 1, label: this.xiangName })
      this.xiangName = ''
      this.dialogVisible = false
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
      const obj = { imgUrl: '', name: '', templateNum: '', detailData: [], reportName: '', graphXY: {}, index: -1 }
      obj.imgUrl = this.imgUrl
      obj.name = this.modelName
      obj.templateNum = this.selectModel
      obj.detailData = this.tableValue
      obj.reportName = this.reportName
      obj.index = this.index
      obj.graphXY = this.graphXY
      this.saveDetail(obj)
      this.$router.replace('/menus/ocrTemplate/ocrManage')
    },
    cancel() {
      this.$router.replace('/menus/ocrTemplate/ocrManage')
    },
    initCanvas() {
      this.$nextTick(() => {
        // 初始化canvas宽高
        const cav = this.$refs.markCanvas
        cav.width = 500
        cav.height = 800
        const ctx = cav.getContext('2d')
        ctx.strokeStyle = 'red'
        cav.style.cursor = 'crosshair'
        // 计算使用变量
        // 按比例缩放
        if ((+this.index) !== -1) {
          const { x1, y1, x2, y2 } = this.tableData[this.index].graphXY
          console.log(x1, y1, x2, y2)
          this.markList2.push({
            x: x1 * 500 / this.w,
            y: y1 * 800 / this.h,
            w: (x2 - x1) * 500 / this.w,
            h: (y2 - y1) * 800 / this.h
          })
          for (let i = 0; i < this.tableData[this.index].detailData.length; i++) {
            // console.log(this.tableValue[i].x1, 500, this.w)
            this.markList.push({
              x: this.tableValue[i].x1 * 500 / this.w,
              y: this.tableValue[i].y1 * 800 / this.h,
              w: (this.tableValue[i].x2 - this.tableValue[i].x1) * 500 / this.w,
              h: (this.tableValue[i].y2 - this.tableValue[i].y1) * 800 / this.h
            })
          }
        }

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
        cav2.width = 500
        cav2.height = 800
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
    },
    ...mapMutations({
      'deleteDetail': 'ocr/deleteDetail',
      'saveDetail': 'ocr/saveDetail'
    })
  }
}
</script>

<style>
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
