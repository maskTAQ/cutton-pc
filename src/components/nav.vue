<template>
  <div class="container" v-if="path !== '/login'">
    <ul>
      <li v-for="item in navList" :key="item.path" :class="{ active: item.path === path }">
        <router-link :to="item">{{item.label}}</router-link>
        <div class="border"></div>
      </li>
    </ul>
  </div>
</template>
  <script>
export default {
  name: "app-nav",
  data() {
    return {
      navList: [
        { label: "首页", path: "/" },
        { label: "云报价工具", path: "/cloud-offer-tool" },
        { label: "认证信息", path: "/auth" }
        // "棉花超时",
        // "云报价工具",
        // "智能供需",
        // "购物车",
        // "我的供需",
        // "我的发布",
        // "升贴水计算",
        // "中棉物流",
        // "账号信息"
      ]
    };
  },
  computed: {
    path() {
      return this.$route.path;
    }
  }
};
</script>
  <style lang="scss" scoped>
.container {
  height: 40px;
  background: #2da22e;
  border-bottom: 1px solid #ccc;
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    li {
      height: 40px;
      line-height: 40px;
      margin: 0 10px;

      position: relative;
      padding: 0 20px;
      display: flex;

      a {
        text-decoration: none;
        color: #ccc;
        transition: all 1s;
      }
      &.active,
      &:hover {
        a {
          color: #fff;
        }
        .border {
          opacity: 1;
        }
      }
      .border {
        opacity: 0;
        position: absolute;
        width: 60%;
        height: 3px;
        bottom: 0;
        left: 20%;
        background: #fff;
        border-radius: 4px;
        transition: all 1s;
      }
    }
  }
  p {
    font-size: 14px;
    color: #000;
  }
}
</style>
  