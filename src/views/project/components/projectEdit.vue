<template>
  <div class="container">
    <el-row :gutter="10" class="full-height-row">
      <el-col :span="6" class="full-height-col">
        <el-card shadow="hover" class="full-height-card">
          <div>
            <el-button
              type="primary"
              :disabled="isAbled"
              @click="addProject"
            >新建</el-button>
            <el-button type="danger" @click="delProject">删除</el-button>
            <el-button type="warning" @click="importProject">导入</el-button>
          </div>
          <div>
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              show-checkbox
              default-expand-all
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
            @transmit="getMessage"
          />
          <unit-name-item
            v-if="isShow === 2"
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
import { getAllProjects, getAllSubprojectsById, postSubprojects } from '@/api/project'

export default {
  components: {
    UnitNameItem,
    ProjectInfo
  },
  data() {
    return {
      isShow: 1,
      isAbled: true,
      treeData: [
        {
          id: 0,
          label: '郑州中原保利心语项目',
          disabled: true, // 不可勾选 根节点不能删除
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      idCounter: 1,
      lastAddedNode: null // 记录最新添加的节点
    }
  },
  computed: {
    projectId() {
      return this.$route.query.projectId
    }
  },
  async created() {
    try {
      // const res = await getProjects()
      const data2 = await getAllSubprojectsById(2)
      // console.log(res)
      console.log(data2)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    // 父子组件传参
    getMessage(data) {
      this.isShow = data.isShow
      this.isAbled = data.isAbled
    },
    addProject() {
      const newChild = {
        id: ++this.idCounter,
        label: `子节点 ${this.idCounter}`
      }
      const rootNode = this.treeData[0]
      this.$refs.tree.append(newChild, rootNode)
      // 新建按钮禁用，
      this.isAbled = true
      this.lastAddedNode = newChild // 保存最新添加的子节点
      // 显示右侧组件，显示单位工程信息
      this.isShow = 2

      // 当前新建流程完成后，新建按钮才可用
    },
    handleUnitNameItem(data) {
      this.isShow = data.isShow
      this.isAbled = data.isAbled
      // console.log("handleUnitNameItem", data);
      if (data.action === 'preserve' && this.lastAddedNode) {
        // 如果是保存操作，更新最新添加节点的名称
        this.lastAddedNode.label = data.nodeName
        this.postSubprojects({ subprojectId: this.lastAddedNode.id, projectId: this.projectId, obj: data.obj })
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
          if (nodesToDelete.some((n) => n.id === child.id)) {
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
    importProject() {},
    async postSubprojects(obj) {
      const res = await postSubprojects(obj)
      console.log(res)
    }
  }
}
</script>

<style scoped>
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
</style>

