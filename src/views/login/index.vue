<template>
  <div>
    <div class="content">
      <div class="qr" id="login_container"></div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/footer.vue";
export default {
  name: "login",
  created() {},
  mounted() {
    this.renderQr();
    window.onload = this.renderQr;
  },
  methods: {
    renderQr() {
      if (typeof WxLogin !== "undefined") {
        console.log(WxLogin, "WxLogin");
        var obj = new WxLogin({
          id: "login_container",
          appid: "wxbdc5610cc59c1631",
          scope: "snsapi_login",
          redirect_uri: "https://passport.yhd.com/passport/login_input.do",
          state: "",
          style: "",
          href: ""
        });
      }
    }
  },
  components: {
    Footer
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 500px;
  position: relative;
  background: #dfdede;
  .qr {
    position: absolute;
    right: 20px;
    bottom: 50%;
    margin-bottom: -200px;
    width: 300px;
    height: 400px;
  }
}
</style>
