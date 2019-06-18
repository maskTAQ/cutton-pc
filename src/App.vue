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
import { mapActions, mapState } from "vuex";
import Nav from "@/components/nav.vue";
import Header from "@/components/public/head.vue";

import { getAuthInfo } from "@/apis";

export default {
  components: {
    Nav,
    Header
  },
  created() {
    this.getAuthInfo();
  },
  computed: {
    ...mapState({
      data: state => state.data
    })
  },
  methods: {
    ...mapActions(["asyncActionWrapper"]),
    getAuthInfo() {
      const { id } = this.data.user.data;
      this.asyncActionWrapper({
        call: getAuthInfo,
        params: { user_id: id },
        type: "data",
        key: "auth"
      });
    }
  }
};
</script>

<style lang="scss">
html,
body,
#app,
.app-container,
.app-content {
  height: 100%;
  min-height: 650px;
}
/* 
#app {
  height: 100%;
  
}
.app-container {
  height: 100%;
  padding-bottom: 130px;
 
  .app-content {
    height: 100%;
    
  }
} */
</style>
