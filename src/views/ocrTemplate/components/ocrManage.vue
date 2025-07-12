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
        <el-select v-model="reportType" @change="TemplateChange">
          <el-option
            v-for="item in reportTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <span class="search-container" style="float: right">
          <!--搜索栏--->
          <el-input
            v-model="searchQuery"
            placeholder="请输入搜索内容"
            style="width: 300px; margin-right: 10px;margin-top: 10px"
            @keyup.enter.native="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </span>
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column
            prop="templateName"
            label="文档模版名称"
            align="center"
          />
          <el-table-column
            prop="reportType"
            label="台账类别"
            align="center"
          >
            <template v-slot="scope">
              {{ typeName(scope.row.reportType) }}
            </template>
          </el-table-column>
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

import { deleteTemplateById, getTemplates, postTemplates } from '@/api/ocrTest'

export default {
  name: 'Template',
  data() {
    return {
      searchQuery: '', // 用于存储输入框的内容
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
      }, {
        value: 0,
        label: '无'
      }
      ],
      tableData: [],
      changeInformation: {
        name: '',
        templateNum: 0
      },
      templateId: '0', // 模板id
      reportType: 0,
      option: [],
      currentPage: 1, // 分页器当前页码
      totalData: 0, // 总共筛选出的数据条目
      limit: 10 // 每页显示的数据
    }
  },
  created() {
    this.getTemplates()
    // this.postTemplates()
  },
  methods: {
    async getTemplates() {
      try {
        const { result } = await getTemplates(this.currentPage, this.limit, this.searchQuery, this.reportType)
        console.log('分页获取模板', result)
        this.tableData = result.records
        this.totalData = parseInt(result.total)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteTemplateById() {
      try {
        const res = await deleteTemplateById(this.templateId)
        console.log('删除模板', res)
      } catch (error) {
        console.log(error)
      }
    },
    createNewModel() {
      this.$router.push({ path: '/menus/ocrTemplate/ocrDetail', query: { templateId: '0' }})
    },
    handleSearch() {
      this.getTemplates()
    },
    TemplateChange() {
      this.getTemplates()
    },
    updateBatch(scope) {
      this.templateId = scope.row.templateId
      // console.log(scope)
      this.$router.push({ path: '/menus/ocrTemplate/ocrDetail', query: { templateId: this.templateId }})
    },
    deleteBatch(scope) {
      this.templateId = scope.row.templateId
      this.tableData = this.tableData.filter(item => item.templateId !== scope.row.templateId)
      this.deleteTemplateById()
    },
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      console.log(this.limit)
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    typeName(typeId) {
      if (typeId === 1) {
        return '钢筋原材'
      } else if (typeId === 2) {
        return '钢筋机械连接'
      } else if (typeId === 3) {
        return '钢筋焊接'
      } else {
        return '混凝土强度'
      }
    }
  }
}
</script>

<style>
.app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>
