<template>
  <div>
    <div class="nav-text">
      <span v-for="item in [data_raw, data_connection, data_weld, data_beton]" :key="item"
        :class="{ active: activeButton === item }" @click="handleNavClick(item)">
        {{ item }}
      </span>
    </div>
    <div class="content-container">
      <div>
        <!-- 动态切换三个组件渲染  0710-->
        <ledger-list v-if="index === 0" :index="index" :category="activeButton" @update-index="handleUpdateIndex" />

        <OCREntry v-else-if="index === 1" :index="index" :category="activeButton" @update-index="handleUpdateIndex" />

        <ledger-entry v-else-if="index === 2" :index="index" :category="activeButton" :dataId="dataId"
          @update-index="handleUpdateIndex" />
      </div>
    </div>
  </div>
</template>

<script>
import ledgerList from '@/views/ledgerManage/components/ledgerList'
import OCREntry from '@/views/ledgerManage/components/OCREntry'
import ledgerEntry from '@/views/ledgerManage/components/ledgerEntry'

export default {
  data() {
    return {
      data_raw: "钢筋原材",
      data_connection: "钢筋机械连接",
      data_weld: "钢筋焊接",
      data_beton: "混凝土强度",
      activeButton: "钢筋原材", //当前选中的按钮
      index: 0, // 控制显示哪个组件
      dataId: null,
    };
  },
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
    handleNavClick(item) {
      this.activeButton = item;
      this.index = 0;
    },
    handleUpdateIndex(newIndex, newDataId) {
      this.index = newIndex;
      this.dataId = newDataId
    },

  },
};
</script>

<style scoped>
.content-container {
  padding:20px;
}

.nav-text {
  display: flex;
  align-items: center;
  gap: 20px;      /* 保证菜单项之间有间距 */
  padding: 10px 20px;
  background: #f9f9f9; /* 菜单栏背景色 */
  border-bottom: 1px solid #ddd;
}

.nav-text span {
  cursor: pointer;
  font-size: 16px;
  color: #666;
  position: relative;
  transition: all 0.3s;
}

.nav-text span:hover {
  color: #409EFF; /* 鼠标悬停时颜色 */
}

.nav-text span.active {
  color: #409EFF;       /* 选中高亮 */
  font-weight: 600;
}

.nav-text span.active::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: #409EFF; /* 选中下划线 */
  border-radius: 1px;
}

</style>
