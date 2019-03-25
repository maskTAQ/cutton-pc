<template>
  <div>
    <div class="content">
      <qrcode
        class="qr"
        :value="JSON.stringify({clientId,type:'cotton'})"
        :options="{ width: 200 }"
      ></qrcode>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import { clientId, Publisher } from "@/utils";
import { mapMutations } from "vuex";
import {Message} from 'element-ui';
import AppFooter from "@/components/app-footer.vue";
import Vue from "vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";

Vue.component(VueQrcode.name, VueQrcode);
export default {
  name: "login",
  data() {
    return {
      clientId
    };
  },
  created() {
    console.log(this.clientId, "clientId");
  },
  mounted() {
    //   this.renderQr();
    window.onload = this.renderQr;
    Publisher.on("login", this.handleLogin);
  },
  methods: {
    ...mapMutations(['login']),
    handleLogin(data) {
      console.log(data,'data')
      this.login({
        payload:data
      });
      Message.success('登录成功');
      console.log(this.$router.push('cloud-offer-tool'), 'data');
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
