<template>
  <div class="cloud-offer-tool-container">
    <div class="content" v-show="!isShowExecl">
      <div class="left">
        <el-tabs v-model="type">
          <el-tab-pane v-for="item in tabList" :label="item" :name="item" :key="item"></el-tab-pane>
        </el-tabs>
        <StatusBox :data="layout.data" :status="layout.status">
          <Layout
            v-if="layout.status === 'success'"
            :data="layout.data"
            :params="params[type]"
            :onChange="handleParamsChange"
            ref="layout"
          />
          <el-button class="button" type="primary" :loading="false" @click="nextStep">下一步</el-button>
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
    <div class="execl-content" v-show="isShowExecl" v-loading="loading">
      <div class="btn-group">
        <el-button type="text" @click="download">下载到本地</el-button>
        <el-button type="text" @click="prevStep">上一步</el-button>
        <el-button type="text" @click="submit">同步发布到中棉信息网中</el-button>
        <el-button type="text" @click="replaceStore">批量替换仓库</el-button>
        <el-checkbox v-model="isAllHotTableChecked" type="text">全选</el-checkbox>
      </div>
      <div class="excel-box" :style="{height:excelHeight}">
        <hot-table
          :data="tableData"
          :colHeaders="colHeaders"
          :rowHeaders="true"
          :columns="columns"
          :columnSorting="true"
          :observeChanges="true"
          width="100%"
          height="100%"
          ref="hotTable"
          licenseKey="non-commercial-and-evaluation"
        ></hot-table>
      </div>
    </div>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import { mapActions, mapState } from "vuex";
import { Message } from "element-ui";
import ListWrapper from "@/components/list-wrapper.vue";
import StatusBox from "@/components/status-box.vue";
import Layout from "@/components/layout.vue";

import CardItem from "./card";
import {
  getMyCloudOfferList,
  getOfferLayout,
  doSubmit,
  deleteMyCloudOffer,
  getSpotIndicators,
  getExcel
} from "@/apis";
import { send } from "@/apis/ws";
export default {
  name: "cloud-offer-tool",
  data() {
    return {
      type: "新疆棉",
      isShowExecl: false,
      isAllChecked: false,
      isAllHotTableChecked: false,
      checkedList: [],
      colHeaders: [],
      columns: [],
      tableData: [],
      params: {},
      loading: false
    };
  },
  created() {
    //获取我的云报价
    this.getMyCloudOfferList();
    //获取报价布局
    this.getOfferLayout();
    //获取报价参数
    this.initParams();
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
    },
    excelHeight() {
      return window.innerHeight - 226 + "px";
    }
  },
  methods: {
    ...mapActions(["asyncActionWrapper"]),
    initParams() {
      const params = {};
      this.tabList.forEach(tab => {
        params[tab] = {};
      });
      this.params = params;
    },
    getOfferLayout() {
      const { id } = this.data.user.data;
      const { type, tabList, layouts } = this;
      const key = `offer_${type}`;
      const { status } = layouts[key];
      if (status !== "success" && status !== "loading") {
        this.asyncActionWrapper({
          call: getOfferLayout,
          params: { 棉花云报价类型: tabList.indexOf(type) + 1, 用户ID: id },
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
    handleParamsChange({ key, value }) {
      const { type } = this;
      this.params[type] = { ...this.params[type], [key]: value };
    },
    nextStep() {
      const { id } = this.data.user.data;
      const params = this.params[this.type];
      const loading = this.$loading({
        lock: true,
        text: "验证批号中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      send({
        action: "verifyBatchNumber",
        data: { number: params["现货批号"], userId: id }
      })
        .then(res => {
          loading.close();
          this.isShowExecl = true;
        })
        .catch(e => {
          loading.close();
          Message.error(e);
        });
    },
    prevStep() {
      this.isShowExecl = false;
    },
    submit() {
      const { data } = this.layout;
      const params = this.params[this.type];
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
    },
    getExeclData() {
      const { data } = this.layout;
      const { id } = this.data.user.data;
      const { params } = this.$refs.layout;
      this.loading = true;
      getExcel({
        //加工批号: "62044171101" || params["批号"],
        用户ID: id,
        ...data.carry,
        ...params
      })
        .then(res => {
          const [colHeaders, ...tableData] = res;
          this.colHeaders = ["选择"].concat(colHeaders);
          this.tableData = tableData.map(row => {
            const nextRow = [...row];
            nextRow.unshift(false);
            return nextRow;
          });
          const columns = this.colHeaders.map(item => ({}));
          this.columns = [
            {
              type: "checkbox"
            }
          ].concat(columns);

          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    replaceStore() {
      this.$prompt("请输入仓库地址", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          const hot = this.$refs.hotTable;
          const nextData = this.tableData;
          nextData.map(row => {
            const [checked] = row;
            if (checked) {
              row[2] = value;
            }
            row[0] = false;
          });
          this.isAllHotTableChecked = false;
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });
        });
    },
    download() {
      const hot = this.$refs.hotTable;
      hot.hotInstance.getPlugin("exportFile").downloadFile("csv", {
        filename: "中棉网",
        columnHeaders: true,
        range: [0, 1]
      });
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
    isAllHotTableChecked(v) {
      const hot = this.$refs.hotTable;

      const data = hot.hotInstance.getData();
      const nextData = data;
      if (v) {
        nextData.map(row => {
          row[0] = true;
          return row;
        });
        this.tableData = nextData;
      } else {
        nextData.map(row => {
          row[0] = false;
          return row;
        });
        this.tableData = nextData;
      }
    },
    checkedList(v) {
      const { data } = this.my_cloud_offer_list;
      if (data.list.length === v.length) {
        this.isAllChecked = true;
      } else {
        this.isAllChecked = false;
      }
    },
    isShowExecl(v) {
      if (v) {
        this.getExeclData();
      }
    }
  },

  components: {
    ListWrapper,
    CardItem,
    StatusBox,
    Layout,
    HotTable
  }
};
</script>
<style lang="scss" scoped>
@import "~handsontable/dist/handsontable.full.css";
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
  .button {
    margin: 20px 0;
    width: 100%;
  }
}
</style>

