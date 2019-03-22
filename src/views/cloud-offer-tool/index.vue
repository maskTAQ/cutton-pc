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
      <p class="title">我的云报价</p>
      <div class="list-container">
        <ListWrapper :data="my_cloud_offer_list">
          <template v-if="my_cloud_offer_list.status === 'success'">
            <CardItem
              v-for="data in my_cloud_offer_list.data.list"
              :key="data.id"
              :data="data"
              :map="my_cloud_offer_list.data.key"
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
  doSubmit
} from "@/apis";
export default {
  name: "cloud-offer-tool",
  data() {
    return {
      type: "新疆棉"
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
    submit(params) {
      const { data } = this.layout;
      doSubmit(
        data.do,
        Object.assign(this.getPreValue(data), params, data.carry)
      ).then(res => {
        Message.success("发布成功");
        this.getMyCloudOfferList();
      });
    }
  },
  watch: {
    type(v) {
      this.getOfferLayout();
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
    .title {
      margin-top: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-indent: 10px;
      background: $main;
      color: #fff;
      padding: 0;
    }
    .list-container{
        height: 100%;
        padding-bottom: 50px;
        overflow: auto;
    }
  }
}
</style>

