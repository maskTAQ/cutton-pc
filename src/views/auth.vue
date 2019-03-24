<template>
  <div class="container">
    <div class="list-wrapper">
      <p class="title">认证信息</p>
      <ul>
        <li v-for="item in authInfo" :key="item.label">
          <i class="label">{{item.label}}：</i>
          <div class="conponent-box">
            <p v-if="isAuth">{{data[item.key]}}</p>
            <input type="text" v-else :placeholder="item.placeholder">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "auth",
  data() {
    return {
      isAuth: false,
      data: {
        phone: "1231"
      },
      authInfo: [
        {
          label: "手机号码",
          key: "phone",
          placeholder:'请输入手机号码',
          type: "input"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
}
</style>
