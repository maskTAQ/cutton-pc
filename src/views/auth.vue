<template>
<<<<<<< HEAD
    <div class="container">
        <div class="auth-con">
            <p class="title">认证信息</p>
            <el-form :model="authDataList" status-icon :rules="rules" ref="authDataList" label-width="100px" class="demo-ruleForm">
                <el-form-item v-for="item in authList" :label="item.label" :prop="item.key">
                    <div v-if="isAuth">{{authDataList[item.key]}}</div>
                    <el-input v-model="authDataList[item.key]" :placeholder="item.placeholder"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="submitForm('authDataList')">提交</el-button>
                    <el-button @click="resetForm('authDataList')">重置</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <div class="auth-con-service">
            <p>客服信息</p>
            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
                <el-form-item prop="serviceName" label="客服姓名" :rules="[
                        { required: true, message: '请输入客服姓名', trigger: 'blur' },
                      ]">
                    <el-input v-model="dynamicValidateForm.serviceName"></el-input>
                </el-form-item>
                <el-form-item prop="servicePhone" label="客服电话" :rules="[
                { required: true, message: '请输入客服电话', trigger: 'blur' },
              ]">
            <el-input v-model="dynamicValidateForm.servicePhone"></el-input>
        </el-form-item>
                <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :label="String(domain.laber + index)" :key="domain.key" :prop="'domains.' + index + '.value'"
                    :rules="{
                        required: true, message: '域名不能为空', trigger: 'blur'
                      }">
                    <el-input v-model="domain.value"></el-input>
                    <el-button v-show="index%2" @click.prevent="removeDomain(domain)">删除</el-button>
                </el-form-item>
                <el-form-item>
                        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                        <el-button @click="addDomain">新增域名</el-button>
                        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
                      </el-form-item>
            </el-form>
        </div>
        <div>
            <p>信息上传</p>

        </div>
=======
  <div class="container">
    <div class="list-wrapper">
      <p class="title">认证信息</p>
      <ul>
        <li v-for="item in authInfo" :key="item.label">
          <i class="label">{{item.label}}：</i>
          <div class="conponent-box">
            <p v-if="isAuth">{{data[item.key]}}</p>
            <input type="text" v-else :placeholder="item.placeholder">
          </div>
        </li>
      </ul>
>>>>>>> ce2a2de8fe9384497875159d8969006feb4330f7
    </div>
  </div>
</template>
<script>
<<<<<<< HEAD
    import { auth } from '@/apis'
    export default {
        name: 'auth',
        data() {
            return {
                dynamicValidateForm: {
                    domains: [{
                        laber:'客服姓名',
                        value: ''
                    },
                    {
                        laber:'客服电话',
                        value:""
                    }
                    
                    ],
                    email: ''
                },
                isAuth: false,
                authDataList: {
                    phone: '66666',
                },
                authList: [
                    {
                        label: '手机号码:',
                        key: 'phone',
                        placeholder: "请输入手机号"
                    },
                    {
                        label: '负责人:',
                        key: 'phone',
                        placeholder: "请输入负责人"
                    },
                    {
                        label: '行业:',
                        key: 'phone',
                        placeholder: "请输入行业"
                    },
                    {
                        label: '企业名称:',
                        key: 'phone',
                        placeholder: "请输入企业名称"
                    },
                    {
                        label: '单位地址:',
                        key: 'phone',
                        placeholder: "请输入单位地址"
                    }
                ],
                rules: {
                    phone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' },
                    ],
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            removeDomain(item) {
                var index = this.dynamicValidateForm.domains.indexOf(item)
                if (index !== -1) {
                    this.dynamicValidateForm.domains.splice(index, 2)
                }
            },
            addDomain() {
                this.dynamicValidateForm.domains.push({
                    value: '',
                    key: Date.now()
                });
                this.dynamicValidateForm.domains.push({
                    value: '',
                    key: Date.now()
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .container {
        height:100%;
        overflow: auto;
        .auth-con {
            width: 90%;
            padding: 20px;
            .title {
                padding-left: 20px;
                color: #2196F3;
                font-size: 16px;
                padding-bottom: 16px;
            }
            .demo-ruleForm {
                width: 60%;
                padding: 20px;
            }
            }
            .auth-con-service{
                width:90%;
                padding: 20px;
                .demo-dynamic {
                width: 60%;
                padding: 20px;
               } 
                }
        }
    
</style>
=======
export default {
  name: "auth",
  data() {
    return {
      isAuth: false,
      data: {
        phone: "1231"
      },
      authInfo: [
        {
          label: "手机号码",
          key: "phone",
          placeholder:'请输入手机号码',
          type: "input"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
}
</style>
>>>>>>> ce2a2de8fe9384497875159d8969006feb4330f7
