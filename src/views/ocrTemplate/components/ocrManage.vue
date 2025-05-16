<template>
  <div>
    <div>
      <!--头部-->
      <div>
        <!-- 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px 20px"
          @click="createNewModel"
        >新建模板
        </el-button>

        <span>类别选择: </span>
        <el-select v-model="selectModel" value="无">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>

        <span class="search-container" style="float: right">
          <!--搜索栏--->
          <el-input
            v-model="searchQuery"
            placeholder="请输入搜索内容"
            style="width: 300px; margin-right: 10px;margin-top: 10px"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </span>
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
            prop="name"
            label="文档模版名称"
            align="center"
          />
          <el-table-column
            prop="templateNum"
            label="台账类别"
            align="center"
          />
          <el-table-column prop="prop" label="操作" align="center">
            <template v-slot="scope">
              <el-button
                type="warning"
                size="mini"
                @click="updateBatch(scope)"
              >编辑
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteBatch(scope)"
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
          :total="totalData"
          :page-size="limit"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'Template',
  data() {
    return {
      searchQuery: '', // 用于存储输入框的内容
      changeInformation: {
        name: '',
        templateNum: 0
      },
      selectModel: '无',
      option: [],
      currentPage: 1, // 分页器当前页码
      totalData: 0, // 总共筛选出的数据条目
      limit: 10 // 每页显示的数据
    }
  },
  computed: {
    ...mapState({
      'tableData': state => state.ocr.tableData,
      'ledgerData': state => state.ocr.ledgerData
    }),
    currentPageData() {
      let res = this.tableData
      if (this.selectModel !== '无') {
        res = this.tableData.filter(item => item.templateNum === this.selectModel)
      }
      this.totalData = res.length
      return res.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )
    }
  },
  async created() {
    await this.getNewData()
    this.option.push({ value: '无', label: '无' })
    for (let i = 0; i < this.ledgerData.length; i++) {
      this.option.push({ value: this.ledgerData[i].value, label: this.ledgerData[i].label })
    }
    console.log(this.option)
  },
  methods: {
    createNewModel() {
      this.$router.push({ path: '/menus/ocrTemplate/ocrDetail', query: { index: -1 }})
    },
    handleSearch() {

    },
    updateBatch(scope) {
      const { $index } = scope
      // console.log(scope)
      this.$router.push({ path: '/menus/ocrTemplate/ocrDetail', query: { index: $index }})
    },
    deleteBatch(scope) {
      const { $index } = scope
      this.deleteModel($index)
    },
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      console.log(this.limit)
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    ...mapMutations({ 'deleteModel': 'ocr/deleteModel' }),
    ...mapActions({ 'getNewData': 'ocr/getNewData' })
  }
}
</script>

<style>

</style>
