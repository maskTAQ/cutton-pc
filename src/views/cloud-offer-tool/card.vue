<template>
  <div class="container">
    <div class="container-left">
      <el-checkbox size="medium"></el-checkbox>
    </div>
    <div class="container-right">
      <el-card class="box-card">
        <div class="title">
          <div class="left">
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
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "map"],
  name: "card-item",
  created() {
    console.log(this.data, "data");
  },
  data() {
    return {
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
  methods: {
    g(k) {
      const { map, data } = this;
      return data[map[k]] || "-";
    }
  }
};
</script>
<style lang="scss" scoped>
$main: #44bdf7;
.container {
  display: flex;
  flex-direction: row;
  .container-left {
    width: 30px;
    text-align: center;
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
}
.desc-item {
  display: flex;
  flex-direction: row;
  .label {
    font-size: 15px;
    color: #000;
  }
  .value {
    font-size: 14px;
    color: #ccc;
  }
}
</style>
