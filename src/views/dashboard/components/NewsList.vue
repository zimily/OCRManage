<template>
  <div class="news-list">
    <div 
      v-for="item in news" 
      :key="item.id"
      class="news-item"
      @click="$emit('click-item', item)"
    >
      <div class="news-title">
        <span v-if="item.isNew" class="new-badge">NEW</span>
        {{ item.title }}
      </div>
      <div class="news-date">{{ item.date }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsList',
  props: {
    news: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
  cursor: pointer;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item:hover {
  background-color: #f5f7fa;
}

.news-title {
  font-size: 14px;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
  font-size: 12px;
  color: #999;
}

.new-badge {
  display: inline-block;
  padding: 0 4px;
  background-color: #f56c6c;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  margin-right: 6px;
}
</style>