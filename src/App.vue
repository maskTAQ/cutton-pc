<template>
  <div id="app">
    <Header></Header>
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
import Header from "@/components/public/head.vue";
export default {
  components: {
    Nav,
    Header
  }
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
  // overflow: hidden;
}
.app-container {
  height: 100%;
  padding-bottom: 130px;
  /* overflow: hidden; */
  .app-content {
    height: 100%;
    /* overflow: hidden; */
  }
}
</style>
