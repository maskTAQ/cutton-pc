<template>
  <DatePicker type="date" :value="value" @on-change="onChange" placeholder="选择时间"/>
</template>
<script>
export default {
  name: "layout-slide",
  props: ["value", "data"],
  methods: {
    onChange(v) {
      this.$emit("onChange", v);
    }
  }
};
</script>
<style lang="scss" scoped>
.slide-box {
  flex: 1;
}
</style>
