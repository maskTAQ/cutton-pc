<template>
  <div class="home">
    <div class="search-tool">
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        @click.prevent.native="handleCheckAll"
      >全选</Checkbox>
      <Input
        v-model="search"
        placeholder="账号工厂仓库找资源搜索发布1"
        :search="true"
        @on-search="handleSearch"
        @on-enter="handleSearch"
        :enter-button="true"
        style="width: 200px"
      />
      <Button>批量修改价格</Button>
      <Button>批量修改基差</Button>
      <Button>重新生成升贴水</Button>

      <Button @click="exportQuotationList">生成报价单</Button>
      <Button>批量替换仓库</Button>
    </div>
    <ListWrapper :data="list">
      <template v-if="list.status === 'success'">
        <div class="card-list">
          <HomeCardItem
            v-for="data in list.data.list"
            :key="data.id"
            :data="data"
            :map="list.data.key"
            :checkedGroup="checkedGroup"
            :onChange="handleCheckAllChange"
          />
        </div>
      </template>
    </ListWrapper>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getOfferList,getAuthInfo } from "@/apis";
import { productTypesValue } from "@/constants";
import ListWrapper from "@/components/list-wrapper.vue";
import HomeCardItem from "./card";
import { Message } from "element-ui";
export default {
  name: "home",
  created() {
    
  },
  data() {
    return {
      search: "",
      indeterminate: false,
      checkAll: false,
      checkedGroup: []
    };
  },
  created(){
    this.getAppData();
    this.getData();
  },
  computed: {
    ...mapState({
      data: state => state.data,
      list: state => state.data["offer_list_全部"]
    })
  },
  methods: {
    ...mapActions(["asyncActionWrapper"]),
    getAppData(){
      this.getAuthInfo();
    },
    getAuthInfo() {
      const { id } = this.data.user.data;
      this.asyncActionWrapper({
        call: getAuthInfo,
        params: { user_id: id },
        type: "data",
        key: "auth"
      });
    },
    getData() {
      this.asyncActionWrapper({
        call: getOfferList,
        params: { 棉花云报价类型: productTypesValue["全部"] },
        type: "data",
        key: `offer_list_全部`
      });
    },
    handleSearch() {
      this.asyncActionWrapper({
        call: getOfferList,
        params: {
          棉花云报价类型: productTypesValue["全部"],
          search: this.search
        },
        type: "data",
        key: `offer_list_全部`
      });
    },
    getListKeys() {
      const { list } = this;
      if (list.status === "success") {
        return list.data.list.map(item => item[list.data.key["主键"]]);
      } else {
        return [];
      }
    },
    handleCheckAll(e) {
      const { indeterminate, checkAll, list } = this;
      if (indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !checkAll;
      }
      this.indeterminate = false;

      if (!checkAll) {
        this.checkedGroup = this.getListKeys();
      } else {
        this.checkedGroup = [];
      }
    },
    handleCheckAllChange(v) {
      this.checkedGroup = v;
      //如果更改的选择列表 等于所有的 就是全选
      if (this.getListKeys().every(item => v.includes(item))) {
        this.checkAll = true;
        this.indeterminate = false;
      } else {
        this.checkAll = false;
        this.indeterminate = true;
      }
      if (v.length === 0) {
        this.checkAll = false;
        this.indeterminate = false;
      }
    },
    exportQuotationList() {
      const { checkedGroup, list } = this;
      if (checkedGroup.length === 0) {
        return Message.error("请选择要生成的报价单");
      }
      if (checkedGroup.length > 1) {
        return Message.error("只能同时生成一张报价单");
      }
      for (let i = 0; i < list.data.list.length; i++) {
        const item = list.data.list[i];
        if (item[list.data.key["主键"]] === checkedGroup[i]) {
          window.open(
            `/#/quotation-list?data=${JSON.stringify(
              item
            )}&key=${JSON.stringify(list.data.key)}`,
            "_blank"
          );
          return;
        }
      }
      console.log(checkedGroup, "checkedGroup");
      //window.open(`/#/quotation-list?data=${1}`, "_blank");
    }
  },
  watch: {
    checkedGroup(v) {
      console.log(v, "v");
    }
  },
  components: {
    ListWrapper,
    HomeCardItem
  }
};
</script>
<style lang="scss" scoped>
.search-tool {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  & > * {
    margin: 0 4px;
  }
}
.card-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

