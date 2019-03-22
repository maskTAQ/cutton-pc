<template>
  <div id="app">
    <Nav/>
    <div class="app-container">
      <div class="app-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script>
import Nav from "@/components/nav.vue";
export default {
  components: {
    Nav
  }
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
.app-container {
  height: 100%;
  padding-bottom: 40px;
  overflow: hidden;
  .app-content {
    height: 100%;
    overflow: hidden;
  }
}
</style>
