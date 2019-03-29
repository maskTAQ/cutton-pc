<template>
  <div class="card-container">
    <div class="title">{{title}}</div>
    <div :class="{'input-content':hasInput,'img-content':isImg}">
      <div
        v-for="item in option"
        :key="item.label"
        :class="{'input-item':hasInput,'img-item':isImg}"
      >
        <el-upload
          v-if="isImg"
          class="upload-demo"
          drag
          action="https://s.chncot.com/app/index.php?i=6&c=entry&a=wxapp&do=upload&m=zh_dianc"
          name="upfile"
          :multiple="false"
          :before-upload="beforeUpload"
          :on-error="onUploadError"
          :on-success="onUploadSuccess.bind(this,item.key)"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将{{item.label}}
            <em>点击上传</em>
          </div>
        </el-upload>
        <p
          v-if="type!=='img'"
          :class="{'input-label': hasInput,'img-label': type === 'img'}"
        >{{item.label}}</p>
        <div :class="{'input-box': showInput,'img-content':true}">
          <input
            v-if="showInput"
            @input="handleChange(item.key,$event)"
            :value="data[item.key]"
            type="text"
            class="input"
            :placeholder="item.placeholder||'请输入'"
          >
          <p v-if="showText" class="text">{{item.placeholder||'请输入'}}</p>
        </div>
      </div>
      <button v-if="showAddKf" class="add-kf-btn" @click="onRequestAddKf">添加客服</button>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
export default {
  props: [
    "option",
    "title",
    "type",
    "onRequestAddKf",
    "data",
    "state",
    "onChange"
  ],
  name: "card",
  computed: {
    hasInput() {
      return ["input", "kf"].includes(this.type);
    },
    showInput() {
      const { hasInput, state } = this;
      return hasInput && [0, 3].includes(state);
    },
    showText() {
      const { hasInput, state } = this;
      return hasInput && state === 2;
    },
    showAddKf() {
      const {
        type,
        hasInput,
        data: { state }
      } = this;
      return type === "kf" && [0, 3].includes(state);
    },
    isImg() {
      return this.type === "img";
    }
  },
  methods: {
    handleChange(key, e) {
      const { value } = e.target;
      this.onChange({
        key,
        value
      });
    },
    beforeUpload(file) {
      const { name = "", type } = file;
      const isJPG = type.includes("image");

      if (!isJPG) {
        this.$message.error("只能上传图片");
      }

      return isJPG;
    },
    onUploadError(...v) {
      this.$message.error("上传失败");
    },
    onUploadSuccess(key, value) {
      console.log(res, "res12");
      this.$message.success("上传成功");
      this.onChange({
        key,
        value
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$main: #44bdf7;
.card-container {
  margin: 20px 0;
  padding: 10px;
  background: #f4f4f4;
  border-radius: 16px;
}
.img-content {
  display: flex;
  flex-direction: row;
}
.title {
  height: 40px;
  font-size: 26px;
  color: $main;
}

.input-item {
  margin: 10px 0;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.img-item {
  margin: 0 10px;
  flex: 1;
}
.input-label {
  width: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13px;
  color: #000;
}
.img-label {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 13px;
  color: #000;
}

.item-content {
  flex: 1;
  display: flex;
}

.input-box {
  flex: 1;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
  .input {
    flex: 1;
    padding-left: 20px;
    font-size: 26px;
    color: #000;
    background: none;
    outline: none;
    border: none;
    font-size: 13px;
    color: #000;
  }
}

.add-kf-btn {
  margin: 10px 0;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $main;
  font-size: 12px;
  color: #fff;
}

.img {
  width: 100%;
  height: 300px;
}
</style>
