<template>
  <div class="header-container" v-if="visible">
    <div class="head-top" v-if="path !== '/login'">
      <div class="head-left">
        <p>欢迎来到中棉网，无差价棉花数据报价信息平台</p>
      </div>
      <div class="head-right">
        <div class="isLogin">
          <span class="mainColor" v-show="isAuth">{{auth.store_name}}</span>
          <span class="approve">{{authStatusMap[auth.state]}}</span>
          <div class="btn" @click="handleLogout">退出</div>
        </div>
        <div v-show="isAuth" @click="goAuth" class="company-info">
          <span class="mainColor">|&nbsp;企业信息&nbsp;|&nbsp;</span>
          <span>
            客服咨询热线：
            <span class="mainColor">{{auth.tel}}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="head-bottom">
      <div>
        <img src="../../assets/logo.png" alt>
      </div>
      <div v-if="path !== '/login'">
        <el-input
          class="input"
          type="text"
          placeholder="批号工厂仓库找资源找信息"
          prefix-icon="el-icon-search"
          v-model="allplant"
        >
          <span>批量</span>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { authStatusMap } from "@/constants";
export default {
  name: "app-head",
  data() {
    return {
      authStatusMap,
      allplant: "",
      isLoginUser: false
    };
  },
  computed: {
    ...mapState({
      data: state => state.data
    }),
    path() {
      return this.$route.path;
    },
    auth() {
      const { data } = this.data.auth;
      return data ? { ...data, state: +data.state } : { status: NaN };
    },
    isAuth() {
      return this.auth.state === 2;
    },
    visible(){
      return !['/login','/quotation-list'].includes(this.path);
    }
  },
  methods: {
    ...mapMutations(["logout"]),
    handleLogout() {
      this.logout();
      this.$router.push("login");
    },
    goAuth(){
      this.$router.push("auth");
    }
  }
};
</script>
<style scoped lang="scss">
.header-container {
  font-size: 14px;
  background: #fff;
  .head-top {
    display: flex;
    align-items: center;
    padding: 6px 30px;
    color: "#999";
    border-bottom: 1px solid #999999;
    .head-left {
      width: 40%;
    }
    .head-right {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .isLogin {
        display: flex;
        .btn {
          text-align: center;
          line-height: 23px;
          height: 23px;
          margin: 0px 8px;
          border-radius: 6px;
          font-size: 14px;
          background: #2da22e;
          color: #fff;
          width: 66px;
          cursor: pointer;
        }
        .approve {
          padding-left: 10px;
          color: red;
        }
      }
    }
    .mainColor {
      color: #2da22e;
    }
    .company-info{
      cursor: pointer;
    }
  }
  .head-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 30px;
    img {
      height: 75px;
    }
  }
}
.input {
  width: 400px;
}
</style>
