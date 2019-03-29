<template>
  <div class="contion">
    <div class="head-top"  v-if="path !== '/login'">
      <div class="head-left">
        <p>欢迎来到中棉网，无差价棉花数据报价信息平台</p>
      </div>
      <div class="head-right">
        <div class="isLogin" v-show="isLoginUser">
          <span class="mainColor">默默公司</span>
          <span class="approve">已认证</span>
          <div class="btn">退出</div>
        </div>
        <div>
          <span class="mainColor">|&nbsp;企业信息&nbsp;|&nbsp;</span>
          <span>
            客服咨询热线：
            <span class="mainColor">4008825779</span>
          </span>
        </div>
      </div>
    </div>
    <div class="head-bottom">
      <div>
        <img src="../../assets/logo.png" alt>
      </div>
      <div  v-if="path !== '/login'">
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
import { mapState } from "vuex";

//this.data.user.data;
export default {
  data() {
    return {
      allplant: "",
      isLoginUser: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.data.user
    }),
    path() {
      return this.$route.path;
    }
  },
  methods: {
    isLogins() {
      if (this.user.status === "success") {
        this.isLoginUser = true;
      } else {
        this.isLoginUser = false;
      }
    }
  },
  created() {
    this.isLogins();
  }
};
</script>
<style scoped lang="scss">
.contion {
  font-size: 14px;
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
          color: white;
          width: 66px;
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
