<template>
  <div class="todo-list">
    <div 
      v-for="todo in todos" 
      :key="todo.id"
      class="todo-item"
      :class="{ 'completed': todo.completed }"
    >
      <el-checkbox 
        v-model="todo.completed"
        @change="$emit('complete', todo)"
      ></el-checkbox>
      <div class="todo-content">
        <div class="todo-title">{{ todo.title }}</div>
        <div class="todo-deadline">截止: {{ todo.deadline }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  props: {
    todos: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
}

.todo-content {
  margin-left: 10px;
}

.todo-title {
  font-size: 14px;
  color: #333;
}

.todo-deadline {
  font-size: 12px;
  color: #999;
}
</style>