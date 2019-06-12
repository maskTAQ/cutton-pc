<template>
  <div class="layout-container">
    <div v-for="(area,areaIndex) in data.param" :key="areaIndex" class="area">
      <p class="area-title" v-if="area.title">{{area.title}}</p>

      <div class="area-content">
        <div
          :class="{'field-row':isShowField(field.visible,field)}"
          v-for="(field,fidldI) in area.data"
          :id="field.title+field.visible"
          :key="field.title||fidldI"
        >
          <template class v-if="isShowField(field.visible)">
            <p class="field-label" v-if="field.title">{{field.title}}</p>
            <div class="field-content">
              <template v-for="(component,componentI) in field.components">
                <textarea
                  class="areatext"
                  v-if="isShowField(component.visible) && component.type === 'input' && component.param.includes('批号')"
                  :key="component.content || componentI"
                  :value="value[component.param]"
                  @input="e=>handleChange(component.param,e.target.value)"
                  :placeholder="component.content"
                />
                <input
                  class="input"
                  v-if="isShowField(component.visible) && component.type === 'input' && !component.param.includes('批号')"
                  :key="component.content || componentI"
                  :value="value[component.param]"
                  @input="e=>handleChange(component.param,e.target.value)"
                  :placeholder="component.content"
                >
                <Select
                  size="small"
                  v-if="isShowField(component.visible) && component.type === 'select'"
                  :key="component.label || componentI"
                  :value="value[component.param]"
                  @on-change="v=>handleChange(component.param,v)"
                  :placeholder="component.placeholder"
                >
                  <Option
                    v-for="item in component.content"
                    :key="item"
                    :label="item"
                    :value="item"
                  >{{ item }}</Option>
                </Select>

                <LayoutSlide
                  v-if="isShowField(component.visible) && component.type === 'slide'"
                  :key="component.label || componentI"
                  :data="component"
                  :value="value[component.param]"
                  @onChange="handleChange(component.param,$event)"
                />

                <LayoutDatePicker
                  v-if="isShowField(component.visible) && component.type === 'datepicker'"
                  :key="component.label || componentI"
                  :data="component"
                  :value="value[component.param]"
                  @onChange="handleChange(component.param,$event)"
                />
                <RadioGroup
                  v-if="isShowField(component.visible) && ['radio','radiorect'].includes(component.type)"
                  :key="component.label || componentI"
                  :value="value[component.param]"
                  @on-change="v=>handleChange(component.param,v)"
                >
                  <Radio v-for="item in component.content" :label="item" :key="item">{{item}}</Radio>
                </RadioGroup>
                <CheckboxGroup
                  v-if="isShowField(component.visible) && ['check','checkcircle'].includes(component.type)"
                  :key="component.label || componentI"
                  :value="value[component.param]"
                  @on-change="v=>handleChange(component.param,v)"
                >
                  <Checkbox v-for="item in component.content" :label="item" :key="item"></Checkbox>
                </CheckboxGroup>

                <UploadFile
                  type="file"
                  v-if="isShowField(component.visible) && component.type === 'input-file'"
                  :key="component.label || componentI"
                  :value="value[component.param]"
                  :name="component.param"
                  :handleChange="handleChange"
                  :data="updataParams"
                  :action="component.url"
                  :multiple="true"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :on-error="onUploadError"
                  :on-success="(res)=>onUploadSuccess(component.param,res)"
                >
                  <el-button size="small" type="text">点击上传</el-button>
                </UploadFile>
                <p
                  v-if="isShowField(component.visible) && component.type === 'text'"
                  :key="component.label || componentI"
                  :placeholder="component.placeholder"
                  class="text"
                >{{component.content}}</p>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getOfferList } from "@/apis";
import { commonParmas } from "@/apis/base.js";
import LayoutSlide from "./layout-slide";
import LayoutDatePicker from "./layout-datepicker";
import UploadFile from "@/components/upload-file";
export default {
  props: ["data", "params", "onChange"],
  data() {
    return {
      system: commonParmas
    };
  },
  computed: {
    updataParams() {
      const { system } = this;
      const { carry } = this.data;
      return { ...carry, ...system };
    },
    value() {
      const p = { ...this.params };
      this.data.param.forEach(area => {
        area.data.forEach(filed => {
          filed.components.forEach(component => {
            const { param, value, type } = component;
            if (type.includes("check")) {
              p[param] = p[param] || value || [];
            } else {
              p[param] = p[param] || value;
            }
          });
        });
      });
      return p;
    }
  },
  methods: {
    handleChange(key, value) {
      if (key.includes("批号")) {
        
        const reg = /[^\d\.]/g;
        const replaceDot = value.replace(reg, ",").replace(/,+/,',');
        const reverse = replaceDot.split("").reverse();
        const i = reverse.findIndex(item => !isNaN(parseInt(item)));
        const v = reverse
            .splice(i)
            .reverse()
            .join('');
            console.log(replaceDot.split("").reverse(),reverse,'v')
        this.onChange({
          key,
          value: v
        });
      } else {
        this.onChange({
          key,
          value
        });
      }
    },
    isShowField(visible, d) {
      const { value: params } = this;

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
          if (Array.isArray(value[key])) {
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

    beforeUpload(file) {
      const { name = "", type } = file;
      const isJPG = name.includes("xls");

      if (!isJPG) {
        this.$message.error("只能上传xls格式的文件");
      }

      return isJPG;
    },
    onUploadError(...v) {
      this.$message.error("上传失败");
    },
    onUploadSuccess(key, res) {
      const { code, message, data } = res;
      if (code === 1) {
        if (data["上传结果"]["错误批号"]) {
          this.$message.error(data["上传结果"]["错误批号"]);
        }
        let prev = this.value[key] ? this.value[key].split(",") : [];
        prev.push(data["上传结果"]["仓单批号"]);
        const next = prev.filter(i => i);
        this.handleChange(key, next.join(","));
        this.$message.success(
          `本次上传成功个数${data["上传结果"]["可用个数"]},总计${next.length}个`
        );
      } else {
        this.$message.error(message);
      }

      // for (const key in data) {
      //
      // }

      //this.$message.success("上传成功");
    }
  },
  components: {
    LayoutSlide,
    LayoutDatePicker,
    UploadFile
  }
};
</script>
<style lang="scss">
.field-content {
  .upload-box {
    flex: 1;
  }
}
</style>

<style lang="scss" scoped>
@import "../platform.scss";
.layout-container {
  .area-title {
    //padding-left: 20px;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    color: #000;
  }

  .field-column {
    @extend .flex;
    flex-direction: column;

    background: #fff;
  }
  .field-row {
    min-height: 50px;
    @extend .flex;
    flex-direction: row;
    align-items: center;
    padding-right: 15px;
    //padding: 0 20px;
    @include borderD(bottom, 1px, solid, #ccc);
  }
  .field-title {
    font-size: 14px;
    color: #000;
  }

  .field-label {
    width: 74px;
    margin-right: 10px;
    font-size: 14px;
    color: #000;
  }

  .field-row-content {
    flex: 1;
    height: 100%;
    @extend .flex;
    flex-direction: row;
    align-items: center;
  }

  .field-content {
    flex: 1;
    @extend .flex;
    flex-direction: row;
    align-items: center;
  }
  .el-select {
    margin-right: 10px;
  }
  .input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
  }
  .areatext {
    margin: 8px 0;
    padding: 5px;
    flex: 1;
    height: 80px;
    border: 1px solid #979797;
    border-radius: 4px;
    outline: none;
  }
  .text {
    height: 100%;
    font-size: 14px;
    color: #000;
  }
  .upload-box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
