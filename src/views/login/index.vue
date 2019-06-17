<template>
  <div class="container">
    <div class="login-container">
      <div class="content">
        <img :src="bgIcon" alt="bg" class="bg">
        <div class="qr">
          <div class="tag-box" v-if="false">
            <button :class="{active:activeQrType==='wx'}" @click="toggleQrType">微信</button>
            <i>/</i>
            <button :class="{active:activeQrType==='mp'}" @click="toggleQrType">小程序</button>
          </div>
          <img :src="markIcon" alt class="mark">
          <img v-show="activeQrType === 'wx'" :src="src" alt class="qr-img">
          <qrcode
            class="mpQr"
            v-show="activeQrType === 'mp'"
            :value="JSON.stringify({clientId,type:'cotton'})"
            :options="{ width: 280 }"
          />
        </div>
      </div>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import Axios from "axios";
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
      activeQrType: "wx",
      bgIcon,
      markIcon,
      clientId,
      src: ""
    };
  },
  mounted() {
    //   this.renderQr();
    //window.onload = this.renderQr;
    Publisher.on("login", this.handleLogin);
    this.updateSrc();
  },
  destroyed() {
    this.unmounted = true;
  },
  watch: {
    activeQrType(v) {
      if (v === "mp") {
        clearTimeout(this.timeout);
      } else {
        this.updateSrc();
      }
    }
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
    },
    updateSrc() {
      this.src = `http://s.chncot.com/addons/zh_dianc/wxclientid.php?client_id=${
        this.clientId
      }&time=${Date.now()}`;
    },
    toggleQrType() {
      if (this.activeQrType === "wx") {
        this.activeQrType = "mp";
      } else {
        this.activeQrType = "wx";
      }
    }
  },
  components: {
    AppFooter
  }
};
</script>
<style lang="scss" scoped>
.container{
  height: 100%;
}
.login-container {
  height: calc(100% - 200px);
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
    .tag-box {
      position: absolute;
      padding: 0 4px;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      i {
        margin: 0 4px;
      }
      button {
        border: none;
        outline: none;
        cursor: pointer;
        &.active {
          color: #3cbaf7;
        }
      }
    }
    .mpQr {
      margin: 20px 10px;
    }
    p {
      text-align: center;
      position: absolute;
      width: 100%;
      bottom: 10px;
    }
    .mark {
      position: absolute;
      top: 0;
      right: 20px;
      width: 100px;
      border: 1px solid #bbb;
      border-top: none;
    }
    .qr-img {
      display: block;
      margin: 25px;
      width: 250px;
    }
  }
}
</style>
