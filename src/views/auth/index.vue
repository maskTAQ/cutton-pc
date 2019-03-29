<template>
  <div class="container">
    <div class="auth-status-box" v-if="!hasClickAuthBtn">
      <div class="auth-status-header">
        <p class="auth-status-header-text">认证状态</p>
      </div>
      <div class="auth-status-value">
        <p
          :class="{'authStatusClassName':true,'has-auth':isAuth,'auth':hasClickAuthBtn,'no-auth':false}"
        >{{authStatusMap[auth.state]}}</p>
      </div>
    </div>
    <div @click="startAuth" class="btn auth" v-if="!hasClickAuthBtn && [0,3].includes(auth.state)">
      <p class="btn-text">{{auth.state ? '重新认证' : '认证'}}</p>
    </div>
    <div v-if="showCard">
      <Card
        :onChange="handleChange"
        :option="topList"
        title="认证信息"
        type="input"
        :state="auth.state"
        :data="params"
      />
      <Card
        :onChange="handleChange"
        :onRequestAddKf="handleAddKf"
        :option="kfInfoList"
        title="客服信息"
        type="kf"
        :state="auth.state"
        :data="params"
      />
      <Card
        :onChange="handleChange"
        :option="imgList"
        title="图片信息"
        type="img"
        :state="auth.state"
        :data="params"
      />
    </div>

    <div class="btn auth" v-if="hasClickAuthBtn" @click="submit">
      <p class="btn-text">提交申请</p>
    </div>
  </div>
</template>
<script>
import { authInfo } from "@/apis";
import { authStatusMap } from "@/constants";
import { Message } from "element-ui";
import Card from "./card";
const kfInfoGroup = [
  {
    label: "客服名称"
  },
  {
    label: "客服电话"
  }
];
const imgList = [
  {
    label: "营业执照",
    key: "img"
  },
  {
    label: "法人身份证",
    key: "fsz_img"
  }
];
export default {
  name: "auth",
  data() {
    return {
      isAuth: false,
      hasClickAuthBtn: false,
      authStatusMap,
      params: {},
      auth: {
        state: 0
      },
      topList: [
        {
          label: "负责人",
          placeholder: "请输入负责人",
          key: "user_name"
        },
        {
          label: "手机号码",
          placeholder: "请输入负责人",
          key: "tel"
        },
        {
          label: "行业",
          placeholder: "请输入负责人",
          key: "sfz_img2"
        },
        {
          label: "企业名称",
          placeholder: "请输入负责人",
          key: "store_name"
        },
        {
          label: "企业代码(执照号)",
          placeholder: "请输入负责人",
          key: "sp_img"
        },
        {
          label: "单位地址",
          placeholder: "请输入负责人",
          key: "address"
        }
      ],
      kfInfoList: [...kfInfoGroup],
      imgList,
      rules: {
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    authStatus() {
      const { isAuth, hasClickAuthBtn } = this;
      return isAuth ? "已认证" : hasClickAuthBtn ? "认证中" : "企业未认证";
    },
    showCard() {
      const {
        hasClickAuthBtn,
        auth: { state }
      } = this;
      return hasClickAuthBtn || state === 2;
    }
  },
  methods: {
    handleChange({ key, value }) {
      this.params[key] = value;
    },
    startAuth() {
      this.hasClickAuthBtn = true;
    },
    handleAddKf() {
      const next = [...this.kfInfoList];
      this.kfInfoList = next.concat(kfInfoGroup);
    },
    submit() {
      console.log(this.params, "params");
      authInfo(this.params).then(res => {
        Message.success("认证成功");
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 2);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    }
  },
  components: {
    Card
  }
};
</script>
<style lang="scss" scoped>
$main: #44bdf7;
.container {
  height: 100%;
  padding: 20px;
  background: #fff;
  overflow: auto;
}

.auth-status-box {
  margin: 40px 0;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
}

.auth-status-header {
  height: 80px;
}

.auth-status-header-text {
  font-size: 26px;
  color: $main;
}

.auth-status-value {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.auth-status-value-text {
  font-size: 26px;
}
.has-auth {
  color: red;
}
.no-auth {
  color: #ccc;
}
.btn {
  margin: 20px 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $main;
  border-radius: 8px;
}

.btn-text {
  font-size: 15px;
  color: #fff;
}
</style>
