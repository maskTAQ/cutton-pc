<template>
  <div>
    <div class="login-container">
      <div class="content">
        <img :src="bgIcon" alt="bg" class="bg">
        <div class="qr">
          <img :src="markIcon" alt class="mark">
          <qrcode :value="JSON.stringify({clientId,type:'cotton'})" :options="{ width: 300 }"/>
          <p>请使用小程序扫码登录</p>
        </div>
      </div>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import { clientId, Publisher } from "@/utils";
import { mapMutations } from "vuex";
import { Message } from "element-ui";
import AppFooter from "@/components/app-footer.vue";
import Vue from "vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import bgIcon from "@/assets/bg.png";
import markIcon from "@/assets/mark.png";
Vue.component(VueQrcode.name, VueQrcode);
export default {
  name: "login",
  data() {
    return {
      bgIcon,
      markIcon,
      clientId
    };
  },
  mounted() {
    //   this.renderQr();
    window.onload = this.renderQr;
    Publisher.on("login", this.handleLogin);
  },
  methods: {
    ...mapMutations(["login"]),
    handleLogin(data) {
      this.login({
        payload: data
      });
      Message.success("登录成功");
      this.$router.push("cloud-offer-tool");
    },
    createdClientId() {
      var timestamp = Date.parse(new Date());
      //获取n位随机数,随机来源chars
      var chars = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];
      function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
          var id = Math.ceil(Math.random() * 35);
          res += chars[id];
        }
        return res;
      }
      this.clientId = generateMixed(6) + timestamp;
    },
    renderQr() {
      if (typeof WxLogin !== "undefined") {
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
    AppFooter
  }
};
</script>
<style lang="scss" scoped>
.login-container {
  background: #dfdede;
}
.content {
  margin: 0 auto;
  max-width: 1200px;
  height: 500px;
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .bg {
    margin-left: 50px;
    width: 500px;
  }
  .qr {
    position: absolute;
    right: 70px;
    top: 50%;
    margin-top: -150px;
    width: 300px;
    height: 320px;
    border: 1px solid #bbb;
    overflow: hidden;
    background: #fff;
    p {
      text-align: center;
      position: absolute;
      width: 100%;
      bottom: 10px;
    }
    .mark{
      position: absolute;
      top: 0;
      right: 20px;
      width: 100px;
      border: 1px solid #bbb;
      border-top: none;
    }
  }
}
</style>
