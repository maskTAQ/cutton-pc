
<template>
  <div class="upload">
    <label class="top" :for="id">
      <p class="label">点我上传{{label}}</p>
      <img :src="wordIcon" class="icon" alt>
    </label>
    <input
      :id="id"
      type="file"
      class="file-input"
      :accept="type==='image'?'image/png,image/jpeg,image/jpg':'*'"
      :multiple="multiple"
      @change="onUploadFilesChange"
      style="display: none"
    >
    <div class="content">
      <ul class="file-list">
        <li v-for="(file,i) in uploadFileList" :key="file.name" :class="fileItemClass(file)">
          <img v-show="type === 'image'" :src="file.src" alt>
          <template v-if="type === 'file'">
            <img :src="getIconByFile(file)" class="file-icon" alt>
            <div class="content">
              <p>{{file.name}}</p>
            </div>
          </template>
          <div :class="layerClass()">
            <div v-show="file.status === 'uploading'" class="badge ball-clip-rotate">
              <div></div>
            </div>
            <div
              class="badge close"
              v-show="file.status === 'upload-success'"
              @click="deleteFile(i)"
            >
              <img :src="closeIcon" alt>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Axios from "axios";
import closeIcon from "./close.png";
import wordIcon from "./word.png";
export default {
  name: "upload",
  props: {
    type: {
      type: String,
      default: "image"
    },
    multiple: {
      type: Boolean,
      default: true
    },
    action: {
      type: String
    },
    name: {
      type: String
    },
    data: {
      type: Object
    },
    handleChange: {
      type: Function
    },
    value: {
      type: String
    }
  },
  created() {
    //生成id
    this.id = Date.now() + "upload";
  },
  computed: {
    label() {
      return this.type === "image" ? "图片" : "附件";
    }
  },
  data() {
    return {
      closeIcon,
      wordIcon,
      uploadFileList: [],
      uploadTool: (function() {
        let isInWork = false;
        return {
          tryUpload() {
            //当前不存在上传任务时继续下一个任务
            if (!isInWork) {
              const { uploadFileList } = this;
              const uploadI = uploadFileList.findIndex(
                file => file.status === "not-upload"
              );
              //const {hasUploadList,uploadFileList}
              //如果文件队列中有未上传的开始上传
              if (uploadI > -1) {
                this.upload(uploadI);
              }
            }
          },
          updateWorkStatus(v) {
            isInWork = v;
          }
        };
      })()
    };
  },
  methods: {
    fileItemClass(file) {
      return {
        ["file-item"]: true,
        ["img-type"]: this.type === "image",
        ["file-type"]: this.type === "file",
        [file.status]: true
      };
    },
    layerClass() {
      return {
        layer: true,
        ["img-layer"]: this.type === "image",
        ["file-layer"]: this.type === "file"
      };
    },
    getIconByFile(file) {
      //在这里判断file的类型 返回不同的图标
      return this.wordIcon;
    },
    //获取上传成功的文件列表
    getHasUploadFileList() {
      return this.uploadFileList.filter(
        file => file.status === "upload-success"
      );
    },
    onUploadFilesChange(e) {
      const { files } = e.target;
      //将类数组转为数组
      const append = [].slice.call(files, 0).map(file => {
        file.status = "not-upload";
        if (this.type === "image") {
          //绑定图片的src
          this.bindImgSource(file);
        }
        return file;
      });
      this.uploadFileList = this.uploadFileList.concat(append);
      //调用上传
      this.uploadTool.tryUpload.bind(this)();
    },

    upload(uploadI) {
      const file = this.uploadFileList[uploadI];
      this.updateFileStatusByIndex({
        index: uploadI,
        status: "uploading"
      });
      const form = new FormData(); // FormData 对象
      form.append(this.name, file); // 文件对象
      for (const key in this.data) {
        form.append(key, this.data[key]);
      }

      Axios({
        url: this.action,
        method: "post",
        data: form,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          const { code, message, data } = res.data;
          const key = this.name;
          if (code === 1 && data["上传结果"]) {
            if (data["上传结果"]["错误批号"]) {
              this.$message.error(data["上传结果"]["错误批号"]);
            }
            let prev = this.value ? this.value.split(",") : [];
            prev.push(data["上传结果"]["仓单批号"]);
            const next = prev.filter(i => i);
            this.handleChange(key, next.join(","));
            this.$message.success(
              `本次上传成功个数${data["上传结果"]["可用个数"]},总计${
                next.length
              }个`
            );

            this.updateFileStatusByIndex({
              index: uploadI,
              status: "upload-success",
              value: data["上传结果"]["仓单批号"]
            });
          } else {
            this.$message.error(message);
            this.updateFileStatusByIndex({
              index: uploadI,
              status: "upload-error"
            });
          }
          this.uploadTool.updateWorkStatus(false);
          //调用上传
          this.uploadTool.tryUpload.bind(this)();
        })
        .catch(err => {
          this.updateFileStatusByIndex({
            index: uploadI,
            status: "upload-error"
          });
          this.uploadTool.updateWorkStatus(false);
          //调用上传
          this.uploadTool.tryUpload.bind(this)();
        });
    },
    updateFileStatusByIndex({ index, status, value }) {
      const next = [...this.uploadFileList];
      next[index].status = status;
      next[index].value = value;
      this.uploadFileList = next;
    },
    updateFileSource({ file, src }) {
      const index = this.uploadFileList.indexOf(file);
      if (index > -1) {
        const next = [...this.uploadFileList];
        next[index].src = src;
        this.uploadFileList = next;
      }
    },
    deleteFile(i) {
      const v = (this.value || "").split(",");
      if (v.length) {
        const vI = v.findIndex(item => item === this.uploadFileList[i].value);
        if (vI > -1) {
          const next = v.splice(vI, 1);

          this.handleChange(this.name, v.join(","));
        }
      }
      this.uploadFileList.splice(i, 1);
    },
    bindImgSource(file) {
      const reads = new FileReader();
      reads.readAsDataURL(file);
      const that = this;
      reads.onload = function(e) {
        that.updateFileSource({
          file,
          src: this.result
        });
      };
    },
    getFileSize(file) {
      return file.size + "kb";
    }
  }
};
</script>
<style lang="scss">
@import "./loading.css";
div,
label,
i,
ul,
p {
  margin: 0;
  padding: 0;
}
.upload {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  height: 30px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.top .label {
  margin-right: 4px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
}
.top .icon {
  width: 14px;
}
.file-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  li {
    list-style: none;
    position: relative;
    .ball-clip-rotate {
      & > div {
        border-width: 1px !important;
        height: 9px !important;
        width: 9px !important;
      }
    }
  }
}

.file-item {
  .file-icon {
    margin-right: 4px;
    width: 14px;
  }
}
.img-type {
  margin: 10px;
  width: 100px;
  height: 100px;
}
.img-type img {
  display: block;
  width: 100%;
  height: 100%;
}
.file-type {
  padding: 4px 10px;
  padding-right: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.file-type .content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.layer {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0;
  left: 0;
}
.badge {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-layer .badge {
  top: -10px;
  right: -10px;
}
.file-layer .badge {
  top: 2px;
  right: 10px;
  width: 20px;
  height: 20px;
}
.close img {
  width: 15px;
  height: 15px;
  cursor: pointer;
}
</style>

