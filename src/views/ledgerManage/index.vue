<template>
  <div>
    <div class="nav-buttons">
      <el-button
        type="primary"
        :class="{ active: activeButton === data_raw }"
        :disabled="index !== 0"
        @click="navigate(data_raw)"
      >{{ data_raw }}
      </el-button>
      <el-button
        type="primary"
        :class="{ active: activeButton === data_connection }"
        :disabled="index !== 0"
        @click="navigate(data_connection)"
      >{{ data_connection }}
      </el-button>
      <el-button
        type="primary"
        :class="{ active: activeButton === data_weld }"
        :disabled="index !== 0"
        @click="navigate(data_weld)"
      >{{ data_weld }}
      </el-button>
      <el-button
        type="primary"
        :class="{ active: activeButton === data_beton }"
        :disabled="index !== 0"
        @click="navigate(data_beton)"
      >{{ data_beton }}
      </el-button>
    </div>
    <div class="content-container">
      <div>
        <!-- 动态切换三个组件渲染 -->
        <ledger-list
          v-if="index === 0"
          :index="index"
          :category="activeButton"
          @update-index="handleUpdateIndex"
        />

        <OCREntry
          v-else-if="index === 1"
          :index="index"
          :category="activeButton"
          @update-index="handleUpdateIndex"
        />

        <ledger-entry
          v-else-if="index === 2"
          :index="index"
          :category="activeButton"
          @update-index="handleUpdateIndex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ledgerList from '@/views/ledgerManage/components/ledgerList'
import OCREntry from '@/views/ledgerManage/components/OCREntry'
import ledgerEntry from '@/views/ledgerManage/components/ledgerEntry'

export default {
  components: {
    ledgerList,
    OCREntry,
    ledgerEntry
  },
  data() {
    return {
      data_raw: '钢筋原材',
      data_connection: '钢筋机械连接',
      data_weld: '钢筋焊接',
      data_beton: '混凝土强度',
      activeButton: '钢筋原材', // 当前选中的按钮
      index: 0 // 控制显示哪个组件
    }
  },
  methods: {
    navigate(category) {
      console.log(category)
      this.activeButton = category
    },
    handleUpdateIndex(newIndex) {
      this.index = newIndex
    }
  }
}
</script>

<style scoped>
.nav-buttons {
  padding: 20px;
  background: #f5f5f5;
  margin-bottom: 20px;
}

.el-button.active {
  background-color: #409eff !important; /* 更深的蓝色 */
  border-color: #409eff !important;
  color: #fff !important;
}

.el-button:not(.active) {
  background-color: #fff;
  color: #409eff;
  border-color: #dcdfe6;
}

.content-container {
  padding: 0 20px;
}
</style>
