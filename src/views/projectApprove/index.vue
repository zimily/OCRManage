<template>
  <div>
    <ApproveManage
      v-if="isShow"
      :visible.sync="isShow"
      @transmit="getMessage"
    ></ApproveManage>
    <ApproveDetail v-if="!isShow" @transmit="getMessage"></ApproveDetail>
  </div>
</template>

<script>
import ApproveManage from "@/views/projectApprove/components/approveManage";
import ApproveDetail from "@/views/projectApprove/components/approveDetail";

export default {
  data() {
    return {
      isShow: true,
    };
  },
  components: {
    ApproveManage,
    ApproveDetail,
  },
  methods: {
    //子组件传递数据
    getMessage(data) {
      this.isShow = data.isShow;
    },
  },
};
</script>

<style>
</style>