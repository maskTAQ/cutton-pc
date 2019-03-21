<template>
  <div class="container">
    <ul>
      <li v-for="item in navList" :key="item" :class="{ active: item.path === path }">
        <router-link :to="item">{{item.label}}</router-link>
        <div class="border"></div>
      </li>
    </ul>
  </div>
</template>
  <script>
export default {
  name: "footer",
  data() {
    return {
      navList: [
        { label: "首页", path: "/" },
        { label: "云报价工具", path: "/cloud-offer-tool" }
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
  },
  created() {
    //const { path } = this.$route;
    console.log(this.path, "this");
  }
};
</script>
  <style lang="scss" scoped>
.container {
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    li {
      height: 30px;
      line-height: 30px;
      margin: 0 10px;
      font-size: 14px;
      color: #000;
      position: relative;
      padding: 0 20px;
      display: flex;

      a {
        text-decoration: none;
        color: #8595b6;
        transition: all 1s;
      }
      &.active,
      &:hover {
        a {
          color: #18347a;
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
        background: #18347a;
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
  