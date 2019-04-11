<template>
  <div class="cloud-offer-tool-container">
    <div class="content" v-show="excel.status === 'init'">
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
    <div class="execl-content" v-show="excel.status !== 'init'">
      <div v-if="excel.status !== 'complete'" class="progress-box">
        <p v-show="excel.status !== 'getProgress'">{{excel.msg}}</p>
        <template v-show="excel.status === 'getProgress'">
          <p>生成excel中...</p>
          <el-progress type="circle" :percentage="excel.progress"></el-progress>
        </template>
      </div>
      <div v-show="excel.status === 'complete'">
        <div class="btn-group">
          <el-button size="mini" @click="prevStep">重新导入</el-button>
          <el-button size="mini">删除</el-button>
          <el-button size="mini" @click="replaceStore" v-show="isOnlyModifyStore">批量修改仓库</el-button>
          <el-button size="mini" @click="replaceStore" v-show="!isOnlyModifyStore">添加</el-button>
          <el-button size="mini" @click="replaceStore" v-show="!isOnlyModifyStore">批量修改</el-button>
          <el-button size="mini" class="checkbox-btn">
            <el-checkbox v-model="isAllHotTableChecked" size="mini">全选</el-checkbox>
          </el-button>
          <el-button size="mini" class="checkbox-btn">
            <el-checkbox v-model="isHighlight" size="mini">重复项高亮</el-checkbox>
          </el-button>
          <el-button size="mini" @click="download">下载excel</el-button>
          <el-button size="mini" @click="submit">发布</el-button>
        </div>
        <div class="excel-box" :style="{height:excelHeight}">
          <el-tabs v-model="excel.activeTab" type="card" @tab-click="handleExcelTabClick">
            <el-tab-pane v-for="item in excel.tabList" :label="item" :name="item" :key="item"></el-tab-pane>
          </el-tabs>
          <hot-table
            :data="tableData"
            :colHeaders="colHeaders"
            :rowHeaders="true"
            :columns="columns"
            :columnSorting="true"
            :observeChanges="true"
            :afterChange="afterChange"
            width="100%"
            height="100%"
            ref="hotTable"
            licenseKey="non-commercial-and-evaluation"
          ></hot-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import { mapActions, mapState } from "vuex";
import _ from "lodash";
import { Message } from "element-ui";
import ListWrapper from "@/components/list-wrapper.vue";
import StatusBox from "@/components/status-box.vue";
import Layout from "@/components/layout.vue";
import Handsontable from "handsontable";
import CardItem from "./card";
import {
  getMyCloudOfferList,
  getOfferLayout,
  doSubmit,
  deleteMyCloudOffer,
  getSpotIndicators,
  uploadExcelData,
  getUpdateGetExcelListPer,
  getExcelList
} from "@/apis";
import { send } from "@/apis/ws";
const disabledColumns = ["参考价", "报价"];
export default {
  name: "cloud-offer-tool",
  data() {
    return {
      type: "新疆棉",
      isAllChecked: false,
      isAllHotTableChecked: false,
      checkedList: [],
      colHeaders: [],
      columns: [],
      tableData: [],
      params: {},
      loading: false,
      excel: {
        status: "init", //upload  getProgress getData complete error
        msg: "",
        progress: 0,
        tabList: [],
        activeTab: "",
        hotTableConfigs: [
          // {
          //   columns:[]
          // }
        ]
      },
      isHighlight: false
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
    isOnlyModifyStore() {
      const { type } = this;
      return ["新疆棉", "地产棉", "拍储"].includes(type);
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
      const nextParams = { ...this.params[type] };
      //设置批号前 情况之前设置的批号 当验证批号时确保同时最多存在一个批号的字段
      if (key.includes("批号")) {
        for (const key in nextParams) {
          if (key.includes("批号")) {
            nextParams[key] = "";
          }
        }
      }
      this.params[type] = { ...nextParams, [key]: value };
    },

    nextStep() {
      const { status, data } = this.layout;
      if (status === "success") {
        if (this.type !== "新疆棉") {
          return this.uploadExcelData();
        }
        const { id } = this.data.user.data;
        const params = this.params[this.type];
        const { url, action } = data.verify;

        const loading = this.$loading({
          lock: true,
          text: "验证批号中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        //找批号字段
        let number = "";
        for (const key in params) {
          if (key.includes("批号")) {
            number = params[key];
            break;
          }
        }
        // this.setExcelStatus({
        //   status: "complete",
        //   msg: "准备渲染excel"
        //   // data: res,
        //   // tabList,
        //   // activeTab: tabList[0]
        // });

        send({
          action,
          data: { number: number, userId: id, url, carry: data.carry }
        })
          .then(res => {
            loading.close();

            this.uploadExcelData();
          })
          .catch(e => {
            loading.close();
            Message.error(e);
          });
      }
    },
    uploadExcelData() {
      const { data } = this.layout;
      const { id } = this.data.user.data;
      const { params } = this.$refs.layout;
      this.setExcelStatus({
        status: "upload",
        msg: "上传excel数据中"
      });
      uploadExcelData({
        //加工批号: "62044171101" || params["批号"],
        用户ID: id,
        ...data.carry,
        ...params
      })
        .then(() => {
          this.setExcelStatus({
            status: "getProgress",
            msg: "开始获取进度"
          });

          this.getProgress();
        })
        .catch(e => {
          this.setExcelStatus({
            status: "error",
            msg: "上传excel数据失败"
          });
        });
    },
    getProgress() {
      clearTimeout(this.timeout);
      const { id } = this.data.user.data;
      getUpdateGetExcelListPer(this.layout.data.carry)
        .then(res => {
          const { percent } = res;
          if (+percent === 100) {
            this.setExcelStatus({
              status: "getProgress",
              progress: percent,
              msg: "进度100%"
            });
            this.getExeclData();
          } else {
            this.setExcelStatus({
              status: "getProgress",
              progress: percent,
              msg: "进度" + percent + "%"
            });
            this.timeout = setTimeout(this.getProgress, 2000);
          }
        })
        .catch(e => {
          console.log(e, "e");
          this.getProgress();
        });
    },
    setExcelStatus(data) {
      this.excel = {
        ...this.excel,
        ...data
      };
    },
    getExeclData() {
      const { data } = this.layout;
      const { id } = this.data.user.data;
      const { params } = this.$refs.layout;
      this.setExcelStatus({
        status: "getData",
        msg: "获取excellist"
      });
      getExcelList({ ...data.carry, excel: true })
        .then(res => {
          const tabList = res.map(item => item.title);

          this.setExcelStatus({
            status: "complete",
            msg: "准备渲染excel",
            data: res,
            tabList,
            activeTab: tabList[0]
          });
          setTimeout(this.initExcelData, 100);
        })
        .catch(e => {
          console.log(e, "e");
          this.setExcelStatus({
            status: "error",
            msg: "获取excel列表数据失败"
          });
        });
      return;
    },
    initExcelData() {
      const { data, activeTab, tabList, hotTableConfigs } = this.excel;
      const i = tabList.indexOf(activeTab);
      if (hotTableConfigs[i]) {
        this.updateHotData(hotTableConfigs[i]);
        return;
      }
      const [colHeaders, ...tableData] = data[i].data;
      const fullColHeaders = ["选择"].concat(colHeaders);
      const fullTableData = tableData.map(row => {
        const nextRow = [...row];
        nextRow.unshift(false);
        return nextRow;
      });

      const that = this;
      const columns = fullColHeaders.map((item, i) => {
        if (i === 0) {
          return {
            type: "checkbox"
          };
        }
        return {
          readOnly: disabledColumns.includes(item),
          renderer: function(
            instance,
            td,
            row,
            col,
            prop,
            value,
            cellProperties
          ) {
            const num = that.num(value);
            if (that.isHighlight && num > 1) {
              td.style.color = "red";
            }
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            return td;
          }
        };
      });
      const hotTableConfig = {
        colHeaders: fullColHeaders,
        data: fullTableData,
        columns
      };
      this.excel.hotTableConfigs[i] = hotTableConfig;
      this.updateHotData(hotTableConfig);
    },
    prevStep() {
      this.excel = {
        status: "init"
      };
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
    num(v) {
      let i = 0;
      // a.forEach(item => {
      //   item === v && i++;
      // });
      this.tableData.forEach(row => {
        row.forEach(value => {
          if (value === v) {
            i++;
          }
        });
      });
      return i;
    },
    afterChange(v, type) {
      if (type === "edit") {
        const { colHeaders, tableData } = this;
        const [rowI, colI] = v[0];
        const nextV = _.cloneDeep(tableData);
        const expressionList = ["基差升贴水+参考价=报价"];
        expressionList.forEach(expression => {
          const [e, C] = expression.split("=");
          const [A, B] = e.split("+");
          const AI = colHeaders.indexOf(A);
          const BI = colHeaders.indexOf(B);
          const CI = colHeaders.indexOf(C);
          if ([AI, BI, CI].includes(colI)) {
            const row = nextV[rowI];
            const aValue = Number(row[AI]);
            const bValue = Number(row[BI]);
            if (typeof aValue === "number" && typeof bValue === "number") {
              row[CI] = aValue + bValue;
              console.log(row[CI], "row[CI]");
            } else {
              row[CI] = "--";
            }
            // console.log(tableData[rowI],row, " row");
          }
        });
        this.updateHotData({ data: nextV });
      }
    },
    updateHotData(config) {
      const { data, activeTab, tabList, hotTableConfigs } = this.excel;
      const i = tabList.indexOf(activeTab);

      const hot = this.$refs.hotTable;
      hot.hotInstance.updateSettings(config);
      if (config.data) {
        config.tableData = config.data;
        delete config.data;
      }
      Object.assign(this, config);
      this.excel.hotTableConfigs[i] = config;
    },

    handleExcelTabClick(e) {
      this.initExcelData();
    },

    replaceStore() {
      this.$prompt("请输入仓库地址", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          const hot = this.$refs.hotTable;
          const nextData = this.tableData;
          const { colHeaders } = this;
          nextData.map(row => {
            const [checked] = row;
            if (checked) {
              row[colHeaders.indexOf("仓库")] = value;
            }
            row[0] = false;
            return row;
          });
          this.updateHotData({
            data: nextData
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
      } else {
        nextData.map(row => {
          row[0] = false;
          return row;
        });
      }
      this.updateHotData({
        data: nextData
      });
    },
    isHighlight() {
      this.initExcelData();
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
    Layout,
    HotTable
  }
};
</script>
<style lang="scss">
.excel-box {
  .el-tabs__header {
    margin-bottom: 0px;
    border: none;
  }
}
</style>

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
.execl-content {
  .btn-group {
    height: 60px;
    padding: 0 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .checkbox-btn {
      padding: 3.5px 10px;
    }
  }
  .progress-box {
    display: flex;
    height: 300px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>

