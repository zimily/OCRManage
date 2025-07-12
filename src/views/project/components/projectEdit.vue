<template>
  <div class="container">
    <el-row :gutter="10" class="full-height-row">
      <el-col :span="6" class="full-height-col">
        <el-card shadow="hover" class="full-height-card">
          <div v-if="!chakan" class="button-group">
            <el-button
              class="add-button"
              type="primary"
              :disabled="isAbled"
              @click="addProject"
            >新建</el-button>
            <el-button class="del-button" type="danger" @click="delProject">删除</el-button>
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
              <el-button
                :disabled="!((!isCreated&&isShow===1)||(isShow===2&&!subprojectId))"
                type="warning"
              >导入</el-button>
            </el-upload>
            <!--            <el-button-->
            <!--              :disabled="!((!isCreated&&isShow===1)||(isShow===2&&!subprojectId))"-->
            <!--              type="file"-->
            <!--              @click="importProject"-->
            <!--            >导入</el-button>-->
          </div>
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
      <el-col :span="18" class="full-height-col">
        <el-card shadow="hover" class="full-height-card">
          <project-info
            v-if="isShow === 1"
            :visible.sync="isShow"
            :project-id="projectId"
            :project-excel="projectExcel"
            @transmit="getMessage"
          />
          <unit-name-item
            v-if="isShow === 2"
            :subproject-id="subprojectId"
            :subproject-excel="subprojectExcel"
            :jianyan-excel="jianyanExcel"
            @transmit="handleUnitNameItem"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import UnitNameItem from '@/views/project/components/unitNameItem.vue'
import ProjectInfo from '@/views/project/components/projectInfo'
import {
  deleteSubprojects, excelToJSON, excelToJSONs,
  getAllSubprojectsById, getNewSubprojectId,
  getProjectsById,
  getSubprojects,
  postProjects, postSubAndTasks,
  postSubprojects
} from '@/api/project'

export default {
  components: {
    UnitNameItem,
    ProjectInfo
  },
  data() {
    return {
      aaa: '',
      isShow: 1,
      isAbled: true,
      isCreated: false, // 是否为已创建
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
      idCounter: 1,
      lastAddedNode: null, // 记录最新添加的节点
      subprojectId: null,
      projectExcel: null, // 项目Excel表格
      subprojectExcel: [], // 分项目基础信息Excel表格
      jianyanExcel: []// 检验批Excel表格
    }
  },
  computed: {
    projectId() {
      return this.$route.query.projectId
    },
    chakan() {
      return this.$route.query.chakan === 'true'
    }
  },
  created() {
    this.getProjectsById()
    this.idCounter = this.treeData[0].children.length
  },
  methods: {
    async getProjectsById() {
      try {
        const { result } = await getProjectsById(this.projectId)
        this.treeData[0].subprojectName = result.projectName
        this.isCreated = result.isCreated
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
    async deleteSubprojects(subprojectId) {
      if (subprojectId) {
        try {
          const result = await deleteSubprojects(subprojectId)
          console.log('根据分项目ID删除分项目', this.projectId, result)
        } catch (error) {
          console.log(error)
        }
      }
    },
    async getNewSubprojectId() {
      try {
        const { result } = await getNewSubprojectId(this.projectId)
        console.log(`获取一个在项目${this.projectId}中未被使用过的分项目ID`, result)
        this.subprojectId = result
      } catch (error) {
        console.log(error)
      }
    },

    async postSubAndTasks(data) {
      try {
        const res = await postSubAndTasks(data)
        console.log('根据分项目ID更新分项目全部字段', res)
      } catch (error) {
        console.log(error)
      }
    },
    async excelToJSON(data) {
      try {
        console.log('excelToJSON', data)
        const { result } = await excelToJSON(data)
        console.log('上传Excel表格返回所有内容转成的JSON', result)
        this.projectExcel = result
      } catch (error) {
        console.log(error)
      }
    },
    async excelToJSONs(data) {
      try {
        console.log('excelToJSONs', data)
        const { result } = await excelToJSONs(data)
        console.log('上传分项目Excel表格返回所有内容转成的JSON', result)
        for (let i = 0; i <= 11; i++) {
          this.subprojectExcel.push(result[i])
        }
        for (let i = 12; i < result.length; i++) {
          if (typeof (result[i]['施工部位']) !== 'undefined') {
            this.jianyanExcel.push(result[i])
          } else {
            break
          }
        }
        // if (result[0]['填写范例'] === '单位工程名称') {
        //   this.subprojectExcel = result
        // } else {
        //   this.jianyanExcel = result
        // }
      } catch (error) {
        console.log(error)
      }
    },
    // 父子组件传参
    async getMessage(data) {
      this.isShow = data.isShow
      this.isAbled = data.isAbled

      this.projectExcel = null
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()// 清空上传文件
      }
      await this.getProjectsById()
      await this.getAllSubprojectsById()
    },
    addProject() {
      const newChild = {
        id: ++this.idCounter,
        subprojectName: `新建节点 ${this.idCounter}`
      }
      const rootNode = this.treeData[0]
      this.subprojectId = null
      this.$refs.tree.append(newChild, rootNode)
      // 新建按钮禁用，
      this.isAbled = true
      this.lastAddedNode = newChild // 保存最新添加的子节点
      // 显示右侧组件，显示单位工程信息
      this.isShow = 2
      // 当前新建流程完成后，新建按钮才可用
    },
    async handleUnitNameItem(data) {
      this.isShow = data.isShow
      this.isAbled = data.isAbled
      // console.log("handleUnitNameItem", data);
      if (data.action === 'preserve') {
        // 如果是保存操作，更新最新添加节点的名称
        if (data.isNew) {
          await this.getNewSubprojectId()
        }
        await this.postSubAndTasks(data.data)
        console.log('更新最新添加节点的名称')
        await this.getProjectsById()
        await this.getAllSubprojectsById()
      } else if (data.action === 'cancel' && this.lastAddedNode) {
        // 如果是取消操作，删除最新添加的节点
        const rootNode = this.treeData[0]
        const index = rootNode.children.findIndex(
          (node) => node.id === this.lastAddedNode.id
        )
        if (index !== -1) {
          rootNode.children.splice(index, 1)
        }
        this.lastAddedNode = null // 清空最新添加的节点
      }
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()// 清空上传文件
      }
    },
    // 点击树的节点
    hangleNodeClick(node) {
      console.log('点击树的节点', node, this.idCounter)
      if (node.id === 0) return
      this.isShow = 2
      this.subprojectId = node.subprojectId
    },
    delProject() {
      // 删除选中的树状节点
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      if (checkedNodes.length === 0) {
        this.$message.warning('请先选择要删除的节点')
        return
      }
      // console.log(checkedNodes);
      const rootNode = this.treeData[0]

      // 递归函数：从 children 中删除对应节点
      const removeNodes = (parent, nodesToDelete) => {
        if (!parent.children) return

        parent.children = parent.children.filter((child) => {
          if (nodesToDelete.some((n) => n.$treeNodeId === child.$treeNodeId)) {
            if (this.subprojectId === child.subprojectId) {
              this.isShow = 0 // 使得右侧组件显示空白，只有点击的新建节点才能显示信息
              this.subprojectId = null
            }
            this.deleteSubprojects(child.subprojectId)
            return false // 删除该节点
          }
          // 否则递归处理其子节点
          removeNodes(child, nodesToDelete)
          return true
        })
      }

      // 不允许删除根节点
      const nodesToDelete = checkedNodes.filter((node) => node.id !== 0)
      if (nodesToDelete.length === 0) {
        this.$message.warning('根节点不能删除')
        return
      }

      removeNodes(rootNode, nodesToDelete)
      this.$refs.tree.setCheckedKeys([]) // 清空勾选
      // 后端也要进行
    },
    importProject(file) {
      const fd = new FormData()
      if (!this.isCreated && this.isShow === 1) { // 导入项目数据
        fd.append('file', file.raw)
        this.excelToJSON(fd)
      } else { // 导入分项目数据
        console.log('file', file)
        fd.append('file', file.raw)
        this.excelToJSONs(fd)
      }
      // console.log('文件', file)
      // console.log('fd', fd)
    }
  }
}
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 2em;
}
.container {
  height: 100vh;
  overflow: hidden; /* 防止溢出滚动条 */
}

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
.app-main-wrapper {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>

