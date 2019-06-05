<template>
  <el-card class="box-card">
    <div class="content">
      <div class="title">
        <div class="left">
          <Checkbox size="large" :value="checked" @on-change="handleCheckedGroupChange"/>
          <i class="pihao">批号{{g('批号')}}</i>
          <i class="type">{{g('类型')}}</i>
        </div>
        <div class="right">编号{{g('编号')}} {{g('发布时间')}}</div>
      </div>
      <div class="center">
        <div class="center-left">
          <div class="item" v-for="item in list" :key="item.label">
            <p class="item-label">{{item.label}}</p>
            <p class="item-value">{{g(item.key)}}</p>
          </div>
        </div>
        <div class="center-right">
          <div class="tag xh" v-if="['0', '2'].includes(g('仓单'))">现货</div>
          <div class="tag cd" v-if="['1', '2'].includes(g('仓单'))">仓单</div>
        </div>
      </div>
      <div class="desc-list">
        <div class="desc-item" v-for="item in descList" :key="item.label">
          <p class="label">{{item.label}}:</p>
          <p class="value">{{g(item.key)}}</p>
        </div>
      </div>

      <div class="bottom">
        <div class="bottom-left">
          <div class="bottom-text-box">
            <p class="bottom-text">仓库:{{g('交货仓库或方式')}}</p>
          </div>
          <div class="bottom-text-box">
            <p class="bottom-text">{{g('基差类型')}}</p>
          </div>
          <div class="bottom-text-box">
            <p class="bottom-text">基 差:(+{{g('基差值')}})</p>
          </div>
        </div>
        <div class="bottom-right">
          <div class="bottom-text-box">
            <p class="bottom-text">卖家:{{g('供应商')}}</p>
          </div>
          <div class="bottom-right-bottom">
            <div class="bottom-right-bottom-left">
              <p class="price">￥{{g('报价')}}</p>
              <p class="weight">{{g('重量')}}</p>
            </div>
            <div class="btn-group">
              <div class="btn" @click="handleClickShoppingCar( g('主键'))">
                <div class="item-icon-box">
                  <img class="btn-icon" :src="carIcon">
                </div>

                <p class="btn-text">购物车</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script>
import update from "immutability-helper";
import carIcon from "@/assets/car.png";
export default {
  props: ["data", "map", "checkedGroup", "onChange"],
  name: "home-card-item",
  data() {
    return {
      carIcon,
      list: [
        { label: "等级", key: "颜色级" },
        { label: "长度", key: "长度" },
        { label: "强力", key: "强力" },
        {
          label: "马值",
          key: "马克隆值"
        },
        {
          label: "含杂",
          key: "平均含杂"
        },
        {
          label: "回潮",
          key: "回潮"
        },
        {
          label: "长整",
          key: "整齐度"
        }
      ],
      descList: [
        {
          label: "库存",
          key: "仓库"
        },
        {
          label: "供应商",
          key: "供应商"
        }
      ]
    };
  },
  computed: {
    checked() {
      const { checkedGroup, g, onChange } = this;
      return checkedGroup.includes(g("主键"));
    }
  },
  methods: {
    g(k) {
      const { map, data } = this;
      return data[map[k]] || "-";
    },
    handleCheckedGroupChange() {
      const { checkedGroup, g, onChange } = this;
      const i = checkedGroup.indexOf(g("主键"));
      if (i > -1) {
        onChange(
          update(checkedGroup, {
            $splice: [[i, 1]]
          })
        );
      } else {
        onChange(
          update(checkedGroup, {
            $push: [g("主键")]
          })
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$main: #44bdf7;

.box-card {
  margin: 15px;
  width: 350px;

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
        font-size: 16px;
        color: $main;
      }
    }
  }

  .center {
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
        margin-bottom: 4px;
      }

      .cd {
        background: #3cbaf7;
      }
    }
  }
  .desc-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    .label {
      font-size: 15px;
      color: #000;
    }
    .value {
      font-size: 14px;
      color: #000;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }

  .bottom {
    display: flex;
    flex-direction: row;
  }
  .bottom-left{
    width: 70%;
  }
  .bottom-right {
    flex: 1;
  }

  .bottom-text-box {
    height: 25px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .bottom-text {
    font-size: 15px;
    color: #000;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
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

  .btn-text {
    font-size: 12px;
    color: #000;
  }
}
</style>
