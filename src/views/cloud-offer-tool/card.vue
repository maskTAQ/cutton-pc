<template>
  <div class="container">
    <div class="container-left">
      <el-checkbox :value="checked" @change="handleCheckedListChange"></el-checkbox>
    </div>
    <div class="container-right">
      <el-card class="box-card">
        <div class="title">
          <div class="left">
            <p
              class="pihao"
            >{{pihaoKey}}{{g(pihaoKey)}} {{tidanhao ? `提单号(${tidanhao})` : ''}} {{g('产地')}} {{g('类型')}} {{' ' + g('包数')}}</p>
          </div>
          <div class="right" v-if="false"></div>
        </div>
        <div class="peie-box" v-if="peie">
          <p class="class">自带配额{{peie}}%</p>
        </div>
        <div class="center">
          <div class="center-left">
            <div class="item" v-for="item in filtersList" :key="item.label">
              <p class="item-label">{{item.label}}</p>
              <p class="item-value">{{g(item.key)}}</p>
            </div>
          </div>
          <div class="center-right">
            <div class="tag xh" v-if="['0', '2'].includes(g('仓单'))">现货</div>
            <div class="tag cd" v-if="['1', '2'].includes(g('仓单'))">仓单</div>
          </div>
        </div>
        <div class="row">
          <div class="row-left">
            <p class="row-p">仓库:{{g('交货仓库或方式')}}</p>
          </div>
          <div class="row-right">
            <p class="row-p">卖家:{{g('公司')}}</p>
          </div>
        </div>
        <div class="offer">
          <div v-if="g('报价类型') === '一口价'" class="offer-left">
            <p class="ykj-p">一口价</p>
          </div>
          <div v-else class="offer-left">
            <div class="offer-left-top">
              <p class="jc-label">{{g('基差类型')}}</p>
              <p class="jc-value">{{g('基差值')}}</p>
            </div>
            <div class="offer-left-bottom">
              <p class="jc-label">基 差</p>
              <p class="jc-value">{{g('基差值升贴水')}}</p>
            </div>
          </div>
          <div class="offer-right">
            <div class="row-right-row-left">
              <p
                class="price"
              >{{type === '进口棉$' ? '$' : '￥'}}{{g('报价')}} {{type === '进口棉$' ? ' 即期' : '元/吨'}}</p>
              <p class="weight">{{g('重量')}} {{g('重量类型')}}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import update from "immutability-helper";
import carIcon from "@/assets/car.png";
import { productTypesLabel } from "../../constants/index.js";
export default {
  props: ["data", "map", "checkedList", "onChange"],
  name: "card-item",
  data() {
    return {
      carIcon,
      list: [
        { label: "年度", key: "年份", includes: ["进口棉￥", "进口棉$"] },
        { label: "产地", key: "产地", includes: ["进口棉￥", "进口棉$"] },
        { label: "等级", key: "颜色级" },
        { label: "长度", key: "长度" },
        { label: "强力", key: "强力" },
        { label: "马值", key: "马克隆值" },
        { label: "叶屑", key: "叶屑", includes: ["进口棉￥", "进口棉$"] },
        {
          label: "含杂",
          key: "平均含杂",
          noInclude: ["进口棉￥", "进口棉$"]
        },
        {
          label: "回潮",
          key: "回潮",
          noInclude: ["进口棉￥", "进口棉$"]
        },
        {
          label: "长整",
          key: "整齐度",
          noInclude: ["进口棉￥", "进口棉$"]
        }
      ],
      descList: [
        { label: "轧花厂", key: "加工单位" },
        { label: "供应商", key: "公司" }
      ]
    };
  },
  computed: {
    type() {
      return productTypesLabel[this.g("棉花云报价类型")];
    },

    checked() {
      const { checkedList, g, onChange } = this;
      return checkedList.includes(g("主键"));
    },
    filtersList() {
      const type = productTypesLabel[this.g("棉花云报价类型")];
      return this.list.filter(({ noInclude = [], includes = "all" }) => {
        if (includes === "all") {
          return !noInclude.includes(type);
        } else {
          return !noInclude.includes(type) && includes.includes(type);
        }
      });
    },
    ckKey() {
      const type = productTypesLabel[this.g("棉花云报价类型")];
      let key = "仓库";
      if (["地产棉", "进口棉￥"].includes(type)) {
        key = "目的港";
      }
      return key;
    },
    pihaoKey() {
      const type = productTypesLabel[this.g("棉花云报价类型")];
      let key = "批号";
      if (["进口棉$", "进口棉￥"].includes(type)) {
        key = "报价号";
      }
      return key;
    },
    tidanhao() {
      return this.g("提单号");
    },
    peie() {
      return Number(this.g("配额比"));
    }
  },
  methods: {
    g(k) {
      const { map, data } = this;
      return data[map[k]] || "";
    },
    handleCheckedListChange() {
      const { checkedList, g, onChange } = this;
      const i = checkedList.indexOf(g("主键"));
      if (i > -1) {
        onChange(
          update(checkedList, {
            $splice: [[i, 1]]
          })
        );
      } else {
        onChange(
          update(checkedList, {
            $push: [g("主键")]
          })
        );
      }
    }
  }
};
</script>
<style lang="scss">
.box-card {
  .el-card__body {
    padding: 10px !important;
  }
}
</style>

<style lang="scss" scoped>
$main: #44bdf7;
.container {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  .container-left {
    width: 30px;
    p-align: center;
  }
}
.box-card {
  width: 350px;
  margin: 0 auto;
}
.title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .left {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    i {
      font-style: normal;
      color: #000;
    }
    .pihao {
      margin-right: 6px;
      font-size: 16px;
      color: $main;
    }
  }
}

.center {
  margin-bottom: 6px;
  display: flex;
  flex-direction: row;
  .center-left {
    flex: 1;
    display: flex;
    flex-direction: row;
    .item {
      flex: 1;
      margin-right: 3px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    .item-label {
      font-size: 15px;
      color: #000;
    }

    .item-value {
      font-size: 15px;
      color: #1cbb24;
    }
  }

  .center-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .center-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .tag {
      height: 22px;
      padding: 0 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
      background: red;
      font-size: 15px;
      color: #fff;
    }

    .xh {
      background: #1cbb24;
    }

    .cd {
      margin-top: 4px;
      background: #3cbaf7;
    }
  }
}

.peie {
  font-size: 14px;
  color: #2e2e2e;
}

.row {
  display: flex;
  flex-direction: row;
}

.row-left,
.row-right {
  flex: 1;
}

.row-p {
  font-size: 15px;
  color: #000;
}

.bottom {
  display: flex;
  flex-direction: row;
}

.bottom-left {
  flex: 1;
}

.bottom-p-box {
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden; //超出的文本隐藏
  p-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}

.bottom-p {
  font-size: 12px;
  color: #000;
}

.bottom-right-bottom {
  height: 43px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.bottom-right-bottom-right {
  display: flex;
  flex-direction: row;
}

.bottom-right-bottom-left {
  margin-right: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.price {
  font-size: 16px;
  color: #bc0000;
}

.weight {
  font-size: 16px;
  color: #32b9fa;
}

.btn-group {
  width: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-icon-box {
  margin-bottom: 10px;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #32b9fa;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-p {
  font-size: 12px;
  color: #000;
}

//一口价部分
.offer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.offer-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.offer-left-top,
.offer-left-bottom {
  display: flex;
  align-items: center;
  flex: 1;
}
.jc-label {
  margin-right: 5px;
  font-size: 16px;
  color: $main;
}
.jc-value {
  font-size: 14px;
  color: #b4b4b4;
}

.ykj-p {
  font-size: 16px;
  font-weight: bold;
  color: $main;
}
.offer-right-top {
  flex: 1;
}
.offer-right-bottom {
  flex: 1;
}
.offer-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.offer-right-top {
  flex: 1;
}
.offer-right-bottom {
  flex: 1;
}
.price-value {
  font-size: 32px;
  color: #44bdf7;
}
.price-label {
  font-size: 14px;
  color: #b4b4b4;
}
.weight-label {
  font-size: 15px;
  color: #b4b4b4;
}
.weight-value {
  font-size: 14px;
  color: #000;
}
</style>
