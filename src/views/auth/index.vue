<template>
  <div class="auth-container">
    <div class="auth-status-box" v-if="!hasClickAuthBtn">
      <div class="auth-status-header">认证状态</div>
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
        :data="value"
      />
      <Card
        :onChange="handleKfInfoChange"
        :onRequestAddKf="handleAddKf"
        :option="kfInfoList"
        :kfList="kfList"
        title="客服信息"
        type="kf"
        :state="auth.state"
        :requestDeleteKf="deleteKf"
        :data="newAddKfInfo"
      />
      <Card
        :onChange="handleChange"
        :option="imgList"
        title="图片信息"
        type="img"
        :state="auth.state"
        :data="value"
      />
    </div>

    <div class="btn auth" v-if="hasClickAuthBtn" @click="submit">
      <p class="btn-text">提交申请</p>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { authInfo, getAuthInfo, getKFList, addKF, deleteKF } from "@/apis";
import { authStatusMap } from "@/constants";
import { Message } from "element-ui";
import Card from "./card";
const kfInfoGroup = [
  {
    key: "客服名称",
    label: "客服名称"
  },
  {
    key: "客服电话",
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
      newAddKfInfo: {},
      params: {},

      topList: [
        {
          label: "负责人",
          placeholder: "请输入负责人",
          key: "user_name"
        },
        {
          label: "手机号码",
          placeholder: "请输入手机号码",
          key: "tel"
        },
        {
          label: "行业",
          type: "select",
          options: [
            {
              value: "轧花厂",
              label: "轧花厂"
            },
            {
              value: "贸易商",
              label: "贸易商"
            },
            {
              value: "纺织厂",
              label: "纺织厂"
            }
          ],
          placeholder: "请输入行业",
          key: "sfz_img2"
        },
        {
          label: "企业名称",
          placeholder: "请输入企业名称",
          key: "store_name"
        },
        {
          label: "企业代码(执照号)",
          placeholder: "请输入企业代码(执照号)",
          key: "sp_img"
        },
        {
          label: "单位地址",
          placeholder: "请输入单位地址"
        },
        {
          label: "详细地址",
          placeholder: "请输入详细地址",
          key: "address"
        }
      ],
      kfInfoList: kfInfoGroup,
      imgList,
      rules: {
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getAuthInfo();
    this.getKFList();
  },
  computed: {
    ...mapState({
      data: state => state.data
    }),
    showCard() {
      const {
        hasClickAuthBtn,
        auth: { state }
      } = this;
      return hasClickAuthBtn || state === 2;
    },
    auth() {
      const { data } = this.data.auth;
      return data ? { ...data, state: +data.state } : { status: NaN };
    },
    kfList() {
      const { status, data } = this.data.kfList;
      if (status === "success") {
        const { key, list } = data;
        const result = [];
        list.forEach(item => {
          result.push({
            客服名称: item[key["客服名称"]],
            客服电话: item[key["客服电话"]],
            id: item[key["主键"]]
          });
        });
        return result;
      } else {
        return [];
      }
    },
    value() {
      const { auth, params } = this;
      return auth.state === 2 ? auth : params;
    }
  },
  methods: {
    ...mapActions(["asyncActionWrapper"]),
    handleChange({ key, value }) {
      this.params[key] = value;
    },
    handleKfInfoChange({ key, value }) {
      this.newAddKfInfo[key] = value;
    },
    startAuth() {
      this.hasClickAuthBtn = true;
    },
    handleAddKf() {
      // const next = [...this.kfInfoList];
      // this.kfInfoList = next.concat(kfInfoGroup);
      const { id } = this.data.user.data;
      addKF({
        用户ID: id,
        ...this.newAddKfInfo
      }).then(res => {
        Message.success("添加成功");
        this.getKFList();
      });
    },
    submit() {
      const { params } = this;
      const clone = { ...params };
      clone.address = (clone.cityValue || []).join("-") + clone.address;
      delete clone.cityValue;
      //this.params.address = this;
      console.log(clone);
      authInfo({ ...clone, user_id: this.data.user.data.id }).then(res => {
        Message.success("认证成功");
        this.getAuthInfo();
      });
    },
    getAuthInfo() {
      const { id } = this.data.user.data;
      const { status } = this.data.auth;
      this.asyncActionWrapper({
        call: getAuthInfo,
        params: { user_id: id },
        type: "data",
        key: "auth"
      });
      this.hasClickAuthBtn = false;
    },
    getKFList() {
      const { id } = this.data.user.data;
      this.asyncActionWrapper({
        call: getKFList,
        params: { 用户ID: id },
        type: "data",
        key: "kfList"
      });
    },
    deleteKf(i) {
      const { id } = this.data.user.data;
      deleteKF({
        用户ID: id,
        客服列表的主键: i
      }).then(res => {
        this.getKFList();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
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
.auth-container {
  padding: 20px;
  background: #f9f9f9;
}

.auth-status-box {
  margin: 40px 0;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
}

.auth-status-header {
  height: 40px;
  font-size: 20px;
  color: $main;
}

.auth-status-value {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: red;
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
  margin: 0 auto;
  width: 100px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $main;
  border-radius: 8px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}
</style>
