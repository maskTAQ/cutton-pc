<template>
  <div class="container" v-loading="data.status==='loading'">
    <slot v-show="data.status==='success'"></slot>
    <p v-show="data.status==='success' && data.data.list.length ===0">暂无数据</p>
  </div>
</template>
<script>
export default {
  props: ["data"]
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
