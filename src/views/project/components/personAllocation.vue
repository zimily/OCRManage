<template>
  <div>
    <div>
      <!--头部-->
      <div style="margin: 1em">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="form" label-width="170px">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="项目号">{{ project.projectId }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="项目名称">{{ project.projectName }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="类别">
                    <el-select
                      placeholder="请选择"
                      value=""
                      @change="changeXiang()"
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
                <el-col :span="6">
                  <!--搜索栏--->
                  <el-input
                    v-model="tempSearch"
                    placeholder="请输入搜索内容"
                    style="width:70%"
                    @keyup.enter.native="handleSearch"
                  />
                  <el-button type="primary" style="width: 30%" @click="handleSearch">搜索</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" style="margin-bottom: 1em" @click="addPeople">添加</el-button>
      <div>
        <!-- 表格 -->
        <el-table
          :data="currentPageData"
          style="width: 100%"
          border
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >
          <el-table-column
            prop="realname"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop="role"
            label="角色"
            align="center"
          />
          <el-table-column
            prop="affiliation"
            label="所属单位"
            align="center"
          />
          <el-table-column prop="prop" label="操作" align="center">
            <template v-slot="scope">
              <el-button
                type="info"
                size="mini"
                @click="lookUser"
              >查看
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

      <!--弹窗-->
      <AllocationDialog :looks="looks" @savePeople="savePeople" />
    </div>
  </div>
</template>

<script>

import { getPerson, getProject } from '@/api/personAllocation'
import { getProjects, getProjectsById } from '@/api/project'
import AllocationDialog from '@/views/project/components/allocationDialog.vue'

export default {
  components: {
    AllocationDialog
  },
  data() {
    return {
      form: {},
      personList: [],
      project: [],
      searchQuery: '', // 用于存储搜索框的最后内容
      tempSearch: '', // 用于暂存搜索框的内容
      projectName: '', // 项目名称
      currentPage: 1, // 分页器当前页码
      totalData: 0, // 总共筛选出的数据条目
      limit: 10, // 每页显示的数据
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
      looks: {
        isLook1: false,
        isLook2: false,
        pre: 0
      }
    }
  },
  computed: {
    currentPageData() {
      let res = this.personList
      if (this.searchQuery !== '') {
        res = this.personList.filter(item => item.name === this.searchQuery)
      }
      this.totalData = res.length
      return res.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      )
    }
  },
  async created() {
    // 把projectId存到本地
    let id = this.$route.params.id
    console.log(id, this.$route.params)
    if (id) {
      localStorage.setItem('projectId', JSON.stringify(id))
    }
    id = JSON.parse(localStorage.getItem('projectId'))
    this.projectId = id

    try {
      const { result } = await getPerson(id)
      const data = await getProjectsById(id)
      const aaa = await getProject()
      this.personList = result
      this.project = data.result

      console.log('人员分配', aaa)
      console.log('getPerson', result)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    changeXiang() {

    },
    addPeople() {
      this.looks = {
        isLook1: true,
        isLook2: false,
        pre: 0
      }
    },
    // 分页器
    handleSizeChange(val) {
      this.limit = val
      console.log(this.limit)
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSearch() {
      this.searchQuery = this.tempSearch
    },
    lookUser() {
      this.looks = {
        isLook1: true,
        isLook2: true,
        pre: 1
      }
    },
    deleteBatch() {

    },
    savePeople(obj) {
      const { option, data, looks } = obj
      // console.log(obj)
      if (option === 2 && looks.pre === 0) {
        this.looks = { // 进入用户查看弹窗
          isLook1: true,
          isLook2: true,
          pre: 0
        }
      } else if (option === 1 && looks.pre === 0) { // 进入人员添加弹窗
        this.looks = {
          isLook1: true,
          isLook2: false,
          pre: 0
        }
      } else {
        this.looks = { // 进入主界面
          isLook1: false,
          isLook2: false,
          pre: 0
        }
      }
      if (option === -1) {
        console.log(data)
      }
    }
  }
}
</script>

<style>
.title {
  text-align: center;
  font-weight: bold; /* 加粗 */
  font-size: 20px; /* 增大字体 */
}

.app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>
