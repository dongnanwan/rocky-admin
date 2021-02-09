<template>
    <div class="detail">
        <div>
            <a-steps :current="step - 1">
                <a-step>
                    <!-- <span slot="title">Finished</span> -->
                    <template slot="title"> 选择对应套餐</template>
                    <!-- <span slot="description">This is a description.</span> -->
                </a-step>
                <a-step title="客户信息补充" />
                <a-step title="订单提交" />
            </a-steps>
        </div>
        <ul class="packages" v-show="step === 1">
            <li class="package-item">
                <div class="left">
                    <div>
                        <img src="./item.png" alt="" />
                    </div>

                    <div style="margin-left: 30px">
                        <div style="line-height: 60px">title</div>
                        <div style="line-height: 50px">service-title</div>
                    </div>
                </div>
                <div class="middle">
                    <div style="margin-top:15px;font-weight:bold">套餐设置</div>
                    <div class="select-group" style="display:flex;margin-top:15px">
                        <div>
                            <div>
                                套餐版本
                            </div>
                            <div>
                                <a-select
                                    default-value="请选择"
                                    style="width: 120px"
                                    @change="handleChange"
                                >
                                    <a-select-option v-for="val in packages" :key="val.id" :value="val.id">
                                        {{val.packageVersion}}
                                    </a-select-option>
                                </a-select>
                            </div>

                        </div>
                        <div>
                            <div>
                                套餐配额
                            </div>
                            <div>
                                <a-input :value="3" style="width:120px;height:30px" disabled placeholder="" />
                            </div>
                        </div>
                        <div>
                            <div>
                                购买时间
                            </div>
                            <div>
                                <a-input :value="2" style="width:120px;height:30px" disabled placeholder="" />
                            </div>
                        </div>
                        <div>
                            <div>
                                使用人数
                            </div>
                            <div>
                                <a-input :value="1" style="width:120px;height:30px" disabled placeholder="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">价格：</div>
            </li>
        </ul>

        <div class="get-phone" v-show="step === 2">
            <span>注册商城的手机号</span>
            <a-input v-model="phone" style="width:300px;height:40px"></a-input>
            <a-button type="primary" size="large" @click="handleCheckPhone">确认</a-button>

            <div class="user-info" v-show="userInfo.accountId">
                <div>
                    <span>账号类型</span>
                    <span>{{userInfo.type}}</span>
                    <span>企业名称</span>
                    <span>{{userInfo.enterpriseName}}</span>
                    <span>是否已实名</span>
                    <span>{{userInfo.status === 1 ? '是':'否'}}</span>
                </div>
            </div>
        </div>

        <div v-show="step === 3">
            <p style="text-align:center;margin-top:150px">
                客户（【填写的客户手机号】）订单已提交，可在“我的客户订单”中查看，并将支付码返回给客户完成订单支付！
            </p>

        </div>

        <div class="btn-group" style="position: absolute;bottom:200px;right:100px">
            <a-button style="margin:10px" v-show="step === 1 || step === 3" type="primary" @click="$emit('ondetail', 'List')"
                >返回</a-button
            >
            <a-button v-show="step !== 3" style="margin:10px" type="primary" @click="handleNextStep"
                > <span>{{step === 1 ? '下':'上'}}</span>一步</a-button
            >
            <a-button :disabled="!params.accountId" v-show="step === 2" style="margin:10px" type="primary" @click="handleSubmit">提交订单</a-button>
        </div>

    </div>
</template>

<script>
import qs from 'qs';

export default {
  data() {
    return {
      packages: [],
      current: {},
      selectedPack: {},
      step: 1,
      params: {
        shareCode: 'Vp74vvSGvrgyitGy',
        accountId: '',
      },
      phone: '',
      isSubmitDisabled: true,
      userInfo: {},
    };
  },
  props: {
    app: {
      type: Object,
    },
  },
  methods: {
    handleChange(value) {
      const current = this.packages.filter(item => item.id === value);
      this.params.packageId = current[0].id;
    },
    handleNextStep() {
      this.step = this.step === 1 ? 2 : 1;
    },
    handleCheckPhone() {
      this.$api.customerManage.checkPhone(this.phone).then((res) => {
        console.log(res);
        if (res.result) {
          this.params.accountId = res.result.accountId;
          this.userInfo = res.result;
        }
      });
    },
    handleSubmit() {
      this.$api.customerManage.helpOrder(this.params).then((res) => {
        console.log(res);
        this.step = 3;
      });
    },
  },
  mounted() {
    this.$api.customerManage.getPackageInfo(this.app.applicationId).then((res) => {
      this.packages = res.result;
    });
    this.params.applicationId = this.app.applicationId;
  },
};
</script>

<style scoped>
.detail {
    width: 100%;
    min-width: 800px;
    margin: 0 auto;

}
.package-item {
    display: flex;
    height: 150px;
    background: #eee;
}
.package-item .left {
    width: 400px;
    flex-grow: 1;
    border-right: 1px dashed gray;
    display: flex;
    align-items: center;
    flex-shrink: 1;
}
.package-item .middle {
    width: 500px;
    flex-grow: 1;
    flex-shrink: 1;
    margin-left: 10px;
}
.package-item .right {
    width: 100px;
    flex-grow: 1;
    margin-left: 40px;
}
.package-item img {
    padding: 20px 5px;
    border: 1px solid #ccc;
}
.select-group div div{
    width: 150px;
}
.user-info{
    margin-top: 100px;
}
.user-info span{
    margin-left: 30px;
}

</style>
