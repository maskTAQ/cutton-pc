<template>
  <div class="slide-box">
    <Slider
      :value="valueWrapper"
      :step="0.1"
      :min="range.min"
      :max="range.max"
      range
      @on-change="onChange"
    ></Slider>
  </div>
</template>
<script>
export default {
  name: "layout-slidebothway",
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
        return [range.min, range.min];
      } else {
        return [value.min, value.max];
      }
    }
  },
  methods: {
    onChange(v) {
      const [min, max] = v;
      this.$emit("onChange", { min, max });
    }
  }
};
</script>
<style lang="scss" scoped>
.slide-box {
  flex: 1;
}
</style>
