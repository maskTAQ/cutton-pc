<template>
  <div class="content">
    <div class="left">
      <el-tabs v-model="type">
        <el-tab-pane v-for="item in tabList" :label="item" :name="item" :key="item"></el-tab-pane>
      </el-tabs>
      <StatusBox :data="layout.data" :status="layout.status">
        <Layout v-if="layout.status === 'success'" :data="layout.data" :onSubmit="submit"/>
      </StatusBox>
    </div>
    <div class="right">
      <div class="header">
        <p
          class="title"
        >我的云报价:{{my_cloud_offer_list.status === 'success'?my_cloud_offer_list.data.list.length:my_cloud_offer_list.status}}</p>
        <div class="btn-group">
          <el-checkbox v-model="isAllChecked" class="checkbox">全选</el-checkbox>
          <i @click="edit" class="el-icon-edit"></i>
          <i @click="del" class="el-icon-delete"></i>
        </div>
      </div>
      <div class="list-container">
        <ListWrapper :data="my_cloud_offer_list">
          <template v-if="my_cloud_offer_list.status === 'success'">
            <CardItem
              v-for="data in my_cloud_offer_list.data.list"
              :key="data.id"
              :data="data"
              :map="my_cloud_offer_list.data.key"
              :checkedList="checkedList"
              :onChange="hadnleCheckedListChange"
            />
          </template>
        </ListWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Message } from "element-ui";
import ListWrapper from "@/components/list-wrapper.vue";
import StatusBox from "@/components/status-box.vue";
import Layout from "@/components/layout.vue";
import CardItem from "./card";
import {
  getMyOfferList,
  getMyCloudOfferList,
  getOfferLayout,
  doSubmit,
  deleteMyCloudOffer
} from "@/apis";
export default {
  name: "cloud-offer-tool",
  data() {
    return {
      type: "新疆棉",
      isAllChecked: false,
      checkedList: []
    };
  },
  created() {
    this.getMyCloudOfferList();
    this.getOfferLayout();
  },

  computed: {
    ...mapState({
      my_cloud_offer_list: state => state.data.my_cloud_offer_list,
      data: state => state.data,
      layouts: state => state.layout,
      tabList: state => state.productTypes
    }),
    layout() {
      const { type, layouts } = this;
      return layouts[`offer_${type}`];
    }
  },
  methods: {
    ...mapActions(["asyncActionWrapper"]),
    getOfferLayout() {
      const { type, tabList, layouts } = this;
      const key = `offer_${type}`;
      const { status } = layouts[key];
      if (status !== "success" && status !== "loading") {
        this.asyncActionWrapper({
          call: getOfferLayout,
          params: { 棉花云报价类型: tabList.indexOf(type) + 1 },
          type: "layout",
          key
        });
      }
    },
    getMyCloudOfferList() {
      const { id } = this.data.user.data;
      //获取我的报价
      this.asyncActionWrapper({
        call: getMyCloudOfferList,
        params: { 用户ID: id },
        type: "data",
        key: `my_cloud_offer_list`
      });
    },
    getPreValue(data) {
      const { id } = this.data.user.data;
      const params = {
        用户ID: id
      };
      data.param.forEach(area => {
        area.data.forEach(layout => {
          layout.components.forEach(component => {
            const { value, param } = component;
            params[param] = value;
          });
        });
      });
      return params;
    },
    toggleCheckedStatus() {
      const { isAllChecked, checkedList } = this;
    },
    submit(params) {
      const { data } = this.layout;
      doSubmit(
        data.do,
        Object.assign(this.getPreValue(data), params, data.carry)
      ).then(res => {
        Message.success("发布成功");
        this.getMyCloudOfferList();
      });
    },
    hadnleCheckedListChange(v) {
      this.checkedList = v;
    },
    del() {
      if (this.checkedList.length) {
        Promise.all(
          this.checkedList.map(id =>
            deleteMyCloudOffer({
              主键: id
            }).catch(e => true)
          )
        ).then(res => {
          this.getMyCloudOfferList();
          this.checkedList = [];
          Message.success("删除成功");
        });
      }
    },
    edit() {
      const { checkedList } = this;
      if (checkedList.length > 1) {
        Message.error("同时只能编辑一个");
      }

      if (checkedList.length === 1) {
        alert(1);
      }
    }
  },
  watch: {
    type(v) {
      this.getOfferLayout();
    },
    isAllChecked(v) {
      const { data } = this.my_cloud_offer_list;
      if (v) {
        this.checkedList = data.list.map(item => item[data.key["主键"]]);
      } else {
        this.checkedList = [];
      }
    },
    checkedList(v) {
      const { data } = this.my_cloud_offer_list;
      if (data.list.length === v.length) {
        this.isAllChecked = true;
      } else {
        this.isAllChecked = false;
      }
    }
  },

  components: {
    ListWrapper,
    CardItem,
    StatusBox,
    Layout
  }
};
</script>
<style lang="scss" scoped>
$main: #44bdf7;
.content {
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #fff;
  .left {
    flex: 1;
    border-right: 1px solid #ccc;
    background: #fff;
  }
  .right {
    width: 400px;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .header {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 15px;
      background: $main;
    }
    .title {
      height: 50px;
      line-height: 50px;

      color: #fff;
      padding: 0;
    }
    .btn-group {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #fff;
      font-size: 18px;
      i {
        margin: 0 6px;
        cursor: pointer;
      }
      .checkbox {
        color: #fff !important;
      }
      :global {
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .list-container {
      height: 100%;
      padding-bottom: 50px;
      overflow: auto;
    }
  }
}
</style>

