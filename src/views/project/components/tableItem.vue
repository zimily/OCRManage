<template>
  <div>
    <div v-if="value.find(item => item === str)" style="background-color: #03fb03">√</div>
    <div v-else style="background-color: gray">×</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    str: {
      type: String,
      default: ''
    }
  },
  created() {
  }
}
</script>

<style>

</style>
