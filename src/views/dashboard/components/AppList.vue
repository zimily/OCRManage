<template>
  <div class="app-list">
    <el-row :gutter="0">
      <el-col
        v-for="app in apps"
        :key="app.id"
        :xs="6"
        :sm="4"
        :md="3"
        :lg="2"
        class="app-item"
        @click.native="$emit('click-app', app)"
      >
        <div class="app-content">
          <svg class="app-icon" aria-hidden="true">
            <use :xlink:href="`#icon-${app.icon}`" />
          </svg>
          <span class="app-name">{{ app.name }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AppList",
  props: {
    apps: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    console.log(this.apps);
  },
  methods: {
   
  },
};
</script>

<style scoped>
.app-item {
  margin-bottom: 15px; /* 可选，增加底部间距 */
  margin-left: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.app-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-3px);
}


.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.app-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  fill: #409eff; /* 或 fill: currentColor; 搭配 color 使用 */
  flex-shrink: 0;
}

.app-name {
  font-size: 12px;
  text-align: center;
  white-space: nowrap; /* 禁止换行 */
  display: block;
}
</style>