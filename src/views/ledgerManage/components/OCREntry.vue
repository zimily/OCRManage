<template>
  <div>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="primary">主要按钮</el-button>
    <el-button @click="changeIndex()">取消</el-button>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {
    console.log('OCREntry', this.category)
  },
  methods: {
    // 取消按钮，同时向父组件传参，
    changeIndex() {
      this.$emit('update-index', 0, null)
    }
  }
}
</script>

<style></style>
