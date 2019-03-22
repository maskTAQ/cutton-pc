<template>
  <div class="container" v-loading="status==='loading'">
    <slot v-show="status==='success'"></slot>
    <p v-show="status==='error'">加载失败</p>
  </div>
</template>
<script>
export default {
  props: ["data", "status"]
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
