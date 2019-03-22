<template>
  <div class="container">
    <div v-for="(area,areaIndex) in data.param" :key="areaIndex" class="area">
      <p class="area-title" v-if="area.title">{{area.title}}</p>

      <div class="area-content">
        <div
          :class="{'field-column':field.layout==='column','field-row':field.layout==='row'}"
          v-for="field in area.data"
          :key="field.title"
        >
          <template class v-if="isShowField(field.visible)&&field.layout==='row'">
            <p class="field-title">{{field.title}}</p>
            <div class="field-content">
              <template v-for="component in field.components">
                <input
                  v-if="component.type === 'input'"
                  :key="component.label"
                  v-model="params[component.param]"
                  :placeholder="component.content"
                >
                <el-select
                  v-if="component.type === 'select'"
                  :key="component.label"
                  v-model="params[component.param]"
                  :placeholder="component.placeholder"
                >
                  <el-option
                    v-for="item in component.content"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>

                <el-radio-group
                  v-if="component.type === 'radio'"
                  :key="component.label"
                  v-model="params[component.param]"
                  
                >
                  <el-radio v-for="item in component.content" :label="item" :key="item">{{item}}</el-radio>
                </el-radio-group>
                <p
                  v-if="component.type === 'text'"
                  :key="component.label"
                  :placeholder="component.placeholder"
                  class="text"
                >{{component.content}}</p>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <el-button type="primary" :loading="false" @click="submit">发布</el-button>
  </div>
</template>
<script>
import { getOfferList } from "@/apis";
export default {
  props: ["data", "onSubmit"],
  data() {
    return {
      params: {}
    };
  },
  created() {
    this.computedLayoutValue();

    this.data.param.forEach(area => {
      area.data.forEach(filed => {
        filed.components.forEach(component => {
          const { param, value } = component;
          this.params[param] = value;
        });
      });
    });
  },

  watch: {
    params(p) {
      this.computedLayoutValue();
    }
  },
  methods: {
    computedLayoutValue() {
      this.layout = this.data.param.map(area => {
        const data = area.data.filter(filed => {
          return this.isShowField(filed.visible);
        });
        return { ...area, data };
      });
    },
    isShowField(visible) {
      const { params } = this;
      let isVisible = true;
      if (typeof visible === "string") {
        if (visible.includes("=")) {
          const [key, value] = visible.split("=");
          if (Array.isArray(params[key])) {
            isVisible = params[key].some(item => item === value);
          } else {
            isVisible = params[key] === value;
          }
        }
        if (visible.includes("!=")) {
          const [key, value] = visible.split("!=");
          if (Array.isArray(params[key])) {
            isVisible = params[key].every(item => item !== value);
          } else {
            isVisible = params[key] !== value;
          }
        }
      }
      if (typeof visible === "boolean") {
        isVisible = visible;
      }
      return isVisible;
    },

    submit() {
      const { params, onSubmit } = this;
      onSubmit(params);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../platform.scss";
.input {
  flex: 1;
  height: 100%;
  font-size: 28px;
  color: #000;
}

.area-title {
  padding-left: 20px;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  color: #000;
}

.field-column {
  @extend .flex;
  flex-direction: column;
  padding: 0 20px;
  background: #fff;
}
.field-row {
  @extend .flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  @include borderD(bottom, 1px, solid, #ccc);
}
.field-title {
  font-size: 14px;
  color: #000;
}

.field-label {
  margin-right: 10px;
  @extend .flex;
  flex-direction: column;
  justify-content: center;
}

.field-label-text {
  font-size: 28px;
  color: #000;
}

.field-row-content {
  flex: 1;
  height: 100%;
  @extend .flex;
  flex-direction: row;
  align-items: center;
}

.layout-row {
  @extend .flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.layout-column {
  @extend .flex;
  flex-direction: column;
}

.field-content {
  flex: 1;
  @extend .flex;
  flex-direction: row;
  align-items: center;
}
.label-content {
  @extend .flex;
  flex-direction: column;
  justify-content: center;
}
.text {
  height: 100%;
  font-size: 14px;
  color: #000;
}
</style>
