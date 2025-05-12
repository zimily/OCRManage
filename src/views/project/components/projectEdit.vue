<template>
  <div>
    <div style="float: left;width: 30%">
      <div style="padding: 10px">
        <el-button type="primary" @click="addProject">新建</el-button>
        <el-button type="danger" @click="delProject">删除</el-button>
        <el-button type="warning" @click="importProject">导入</el-button>
      </div>
      <div>
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="[1]"
          default-expand-all
          :props="defaultProps"
          check-strictly
          @check="currentChecked"
        />
      </div>
    </div>
    <div style="float: left;width: 70%">
      <UnitNameItem />
    </div>

  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import UnitNameItem from '@/views/project/components/unitNameItem.vue'
export default {
  components: {
    UnitNameItem
  },
  data() {
    return {
      defaultProps: {
        children: 'childList',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapState('projectEdit', ['treeData'])
  },
  created() {
    this.initData()
  },
  methods: {
    addProject() {
      const newNode = { id: Date.now(), label: '新节点' }
      // this.$refs.tree.getCheckedKeys().append(newNode, this.treeData[0])
      console.log(this.$refs.tree)
    },
    delProject() {
    },
    importProject() {
    },
    currentChecked(nodeObj, SelectedObj) {
      console.log(SelectedObj)
      console.log(SelectedObj.checkedKeys) // 这是选中的节点的key数组
      console.log(SelectedObj.checkedNodes) // 这是选中的节点数组
    },
    ...mapMutations('projectEdit', ['initData'])
  }

}
</script>

<style>

</style>
