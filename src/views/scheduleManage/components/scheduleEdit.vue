<template>
  <div>
    <el-row :gutter="10" class="full-height-row">
      <el-col :span="6" class="full-height-col">
        <el-card shadow="hover" class="full-height-card">
          <div>
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              show-checkbox
              default-expand-all
              @node-click="hangleNodeClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col v-if="subprojectId" :span="18" class="full-height-col">
        <el-card shadow="hover" class="full-height-card">
          <el-upload
            ref="upload"
            class="imp-button"
            :action="aaa"
            :on-change="importProject"
            name="excelFile"
            multiple
            :show-file-list="false"
            :auto-upload="false"
          >
            <el-button type="warning" :disabled="roleName==='总工'">导入</el-button>
          </el-upload>
          <el-table :data="plans" border>
            <el-table-column align="center" label="工程部位" prop="inspectPart" min-width="10%" />
            <el-table-column align="center" label="检查内容" prop="items">
              <template v-slot="scope">
                <div v-for="(item,index) in scope.row.items" :key="index">
                  <el-col style="width: 10%">
                    <el-tag style="vertical-align: bottom;">{{ item.inspectType }}</el-tag>
                  </el-col>
                  <el-col style="width: 30%">
                    <span>分发日期 </span>
                    <el-date-picker
                      v-model="item.approStartDate"
                      type="date"
                      width="50%"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :disabled="roleName==='总工'"
                    />
                  </el-col>
                  <el-col style="width: 30%">
                    <span>预警日期 </span>
                    <el-date-picker
                      v-model="item.alertDate"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :disabled="roleName==='总工'"
                    />
                  </el-col>
                  <el-col style="width: 30%">
                    <span>结束日期 </span>
                    <el-date-picker
                      v-model="item.approFinishDate"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :disabled="roleName==='总工'"
                    />
                  </el-col>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-button v-if="roleName!=='总工'" type="primary" @click="save">保存</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { excelToJSON, getAllSubprojectsById, getProjectsById } from '@/api/project'
import router from '@/router'
import { getInspectPlan, importInspectPlan, postInspectPlan } from '@/api/schedule'
import { getUserById } from '@/api/authority'
import { getUserId } from '@/utils/storage'

export default {
  data() {
    return {
      aaa: '',
      roleName: '', // 当前用户的职位 总工只能看不能编辑，管理员可以编辑
      plans: [],
      subprojectId: null,
      treeData: [
        {
          id: 0,
          subprojectName: '郑州中原保利心语项目',
          disabled: true, // 不可勾选 根节点不能删除
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'subprojectName'
      },
      idCounter: 1
      // isShowSave: false
    }
  },
  computed: {
    projectId() {
      return this.$route.query.projectId
    }
  },
  watch: {
    subprojectId(newVal) {
      if (newVal) {
        this.getInspectPlan()
      }
    }
    // plans: {
    //   handler(newValue) {
    //     // console.log('plans', newValue)
    //     this.isShowSave = true
    //   },
    //   deep: true
    // }
  },
  created() {
    this.getProjectsById()
    this.getAllSubprojectsById()
    this.getRoleById()
    this.idCounter = this.treeData[0].children.length
  },
  methods: {
    async getProjectsById() {
      try {
        const { result } = await getProjectsById(this.projectId)
        this.treeData[0].subprojectName = result.projectName
        this.isCreated = result.isCreated
        this.notImport = !result.isCreated
        console.log('getProjectsById', result)
      } catch (error) {
        console.log(error)
      }
    },
    async getAllSubprojectsById() {
      try {
        const { result } = await getAllSubprojectsById(this.projectId)
        console.log('getAllSubprojectsById', this.projectId, result)
        this.treeData[0].children = result
      } catch (error) {
        console.log(error)
      }
    },
    async getInspectPlan() {
      try {
        const { result } = await getInspectPlan(this.projectId, this.subprojectId)
        console.log('获取检验批计划', result)
        this.plans = result.plans
      } catch (error) {
        console.log(error)
      }
    },
    async postInspectPlan(data) {
      try {
        const { result } = await postInspectPlan(data)
        console.log('更新检验批计划', result)
        this.$message.success('更新成功')
        // 把分项目检验批计划页面变空
        this.subprojectId = null
      } catch (error) {
        console.log(error)
      }
    },
    async excelToJSON(data) {
      try {
        const { result } = await excelToJSON(data)
        console.log('上传Excel表格返回所有内容转成的JSON', result)
        result.forEach(item => {
          const temp = { inspectPart: item['工程部位'], items: [] }
          if (item['钢筋原材预计分发日期'] !== '') {
            temp.items.push({
              inspectType: '钢筋原材',
              approStartDate: item['钢筋原材预计分发日期'],
              alertDate: item['钢筋原材预警日期'],
              approFinishDate: item['钢筋原材预计结束日期']
            })
          }
          if (item['钢筋加工预计分发日期'] !== '') {
            temp.items.push({ inspectType: '钢筋加工',
              approStartDate: item['钢筋加工预计分发日期'],
              alertDate: item['钢筋加工预警日期'],
              approFinishDate: item['钢筋加工预计结束日期']
            })
          }
          if (item['钢筋连接预计分发日期'] !== '') {
            temp.items.push({
              inspectType: '钢筋连接',
              approStartDate: item['钢筋连接预计分发日期'],
              alertDate: item['钢筋连接预警日期'],
              approFinishDate: item['钢筋连接预计结束日期']
            })
          }
          if (item['钢筋安装预计分发日期'] !== '') {
            temp.items.push({
              inspectType: '钢筋安装',
              approStartDate: item['钢筋安装预计分发日期'],
              alertDate: item['钢筋安装预警日期'],
              approFinishDate: item['钢筋安装预计结束日期']
            })
          }
          if (item['模板安装预计分发日期'] !== '') {
            temp.items.push({
              inspectType: '模板安装',
              approStartDate: item['模板安装预计分发日期'],
              alertDate: item['模板安装预警日期'],
              approFinishDate: item['模板安装预计结束日期']
            })
          }
          if (item['混凝土施工预计分发日期'] !== '') {
            temp.items.push({
              inspectType: '混凝土拌合物',
              approStartDate: item['混凝土拌合物预计分发日期'],
              alertDate: item['混凝土拌合物预警日期'],
              approFinishDate: item['混凝土拌合物预计结束日期']
            })
          }
          if (item['混凝土施工预计分发日期'] !== '') {
            temp.items.push({
              inspectType: '混凝土施工',
              approStartDate: item['混凝土施工预计分发日期'],
              alertDate: item['混凝土施工预警日期'],
              approFinishDate: item['混凝土施工预计结束日期']
            })
          }
          if (item['现浇结构预计分发日期'] !== '') {
            temp.items.push({
              inspectType: '现浇结构',
              approStartDate: item['现浇结构预计分发日期'],
              alertDate: item['现浇结构预警日期'],
              approFinishDate: item['现浇结构预计结束日期']
            })
          }
          this.plans.push(JSON.parse(JSON.stringify(temp)))
        })
        console.log('plans', this.plans)
      } catch (error) {
        console.log(error)
      }
    },
    async importInspectPlan(data) {
      try {
        const { result } = await importInspectPlan(this.projectId, this.subprojectId, data)
        console.log('导入检验批计划', result)
        this.$message.success('导入成功')
        // 获取检验批计划,刷新页面
        await this.getInspectPlan()
      } catch (error) {
        console.log(error)
      }
    },
    async getRoleById() {
      try {
        const { result } = await getUserById(getUserId())
        console.log('当前用户职位', result)
        this.roleName = result.roleName
        console.log(this.roleName)
      } catch (error) {
        console.log(error)
      }
    },
    // 点击树的节点
    hangleNodeClick(node) {
      console.log('点击树的节点', node, this.idCounter)
      if (node.id === 0) return
      this.isShow = 2
      this.subprojectId = node.subprojectId
      this.notImport = !this.subprojectId
    },
    importProject(file) {
      const fd = new FormData()
      // console.log('file', file)
      fd.append('file', file.raw)
      this.importInspectPlan(fd)
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()// 清空上传文件
      }
    },
    save() {
      const data = {
        projectId: this.projectId,
        subprojectId: this.subprojectId,
        plans: this.plans
      }
      this.postInspectPlan(data)
    },
    cancel() {
      router.back()
    }
  }
}
</script>

<style scoped>
.full-height-row {
  height: 100%;
}

.full-height-col {
  height: 100%;
}

.full-height-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
