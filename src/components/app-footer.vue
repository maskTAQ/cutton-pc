<template>
  <div class="footer-container">
    <ul>
      <li v-for="item in links" :key="item">{{item}}</li>
    </ul>
    <p>客服中心 联系我们CHNCOT@CHNCOT.COM 合作咨询0512-58707332 地址：江苏省苏州市张家港保税区福建路48号</p>
  </div>
</template>
<script>
export default {
  name: "app-footer",
  data() {
    return {
      links: [
        "@2019-中棉网 CHNCOT",
        "苏州丰润科技有限公司",
        "苏ICP备19001418号-1",
        "苏公安网备74182319381号"
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.footer-container {
  height: 200px;
  background: #b9b9b9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ul {
    display: flex;
    flex-direction: row;
    li {
      margin: 0 10px;
      font-size: 14px;
      color: #000;
    }
  }
  p {
    font-size: 14px;
    color: #000;
  }
}
</style>
