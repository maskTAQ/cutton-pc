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
      <ListWrapper :data="my_offer_list">
        <template v-if="my_offer_list.status === 'success'">
          <CardItem v-for="data in my_offer_list.data.list" :key="data.id" :data="data"/>
        </template>
      </ListWrapper>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ListWrapper from "@/components/list-wrapper.vue";
import StatusBox from "@/components/status-box.vue";
import Layout from "@/components/layout.vue";
import CardItem from "./card";
import { getMyOfferList, getOfferLayout, doSubmit } from "@/apis";
export default {
  name: "cloud-offer-tool",
  data() {
    return {
      type: "新疆棉"
    };
  },
  created() {
    this.getMyOfferList();
    this.getOfferLayout();
  },

  computed: {
    ...mapState({
      my_offer_list: state => state.data.my_offer_list,
      data: state => state.data,
      layouts: state => state.layout,
      tabList: state => [...state.productTypes].splice(0, 4)
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
    getMyOfferList() {
      //获取我的报价
      this.asyncActionWrapper({
        call: getMyOfferList,
        params: { 用户ID: "4" },
        type: "data",
        key: `my_offer_list`
      });
    },
    getPreValue(data) {
      console.log(data, "data");
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
      //alert(123)
      const { data } = this.layout;
      doSubmit(
        data.do,
        Object.assign(this.getPreValue(data), params, data.carry)
      ).then(res => {
        //Tip.success("操作成功");
        // asyncActionWrapper({
        //   call: getOfferList,
        //   params: navParams,
        //   type: "data",
        //   key: `offer_list_${navParams.type}`
        // });
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
.content {
  padding: 20px 15px;
  display: flex;
  flex-direction: row;
  .left {
    flex: 1;
    border-right: 1px solid #ccc;
  }
}
</style>

