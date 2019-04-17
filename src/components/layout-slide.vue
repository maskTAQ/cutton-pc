<template>
  <div class="slide-box">
    <Slider
      :value="valueWrapper"
      :step="0.1"
      :min="range.min"
      :max="range.max"
      @on-change="onChange"
    ></Slider>
  </div>
</template>
<script>
export default {
  name: "layout-slide",
  props: {
    value: {
      type: String
    },
    data: {
      type: Object
    }
  },
  computed: {
    range() {
      const [start, end] = this.data.content;
      return {
        min: Number(start),
        max: Number(end)
      };
    },
    valueWrapper() {
      const { value, range } = this;
      if (!value) {
        return range.min;
      } else {
        return value;
      }
    }
  },
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
