<template>
  <div>
    <el-button type="primary" @click="addChildToRoot">添加子节点到根节点</el-button>

    <el-tree
      ref="tree"
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      default-expand-all>
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      idCounter: 2,
      treeData: [
        {
          id: 1,
          label: '根节点',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    addChildToRoot() {
      const newChild = {
        id: this.idCounter++,
        label: `子节点 ${this.idCounter}`
      }

      const rootNode = this.treeData[0]
      this.$refs.tree.append(newChild, rootNode)
    }
  },

}
</script>
