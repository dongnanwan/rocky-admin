<template>
  <div class="common_page_wapper">

    <div class="form_wrap">
      <p class="desc" v-if="pwdFlag === '0'">第一次登录，请重新设置您的专属密码！</p>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="旧密码"
          v-if="pwdFlag !== '0'"
        >
          <a-input
            type="password"
            v-decorator="[
              'oldPassword',
              {rules: [
                {
                  required: true,
                  message: '请输入旧密码',
                }, {
                  validator: this.validatePass
                }
              ]}
            ]"
            placeholder="请输入旧密码"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="新密码"
        >
          <a-input
            type="password"
            v-decorator="[
              'newPassword',
              {rules: [
                {
                  required: true,
                  message: '请设置新密码',
                }, {
                  validator: this.validatePass
                }
              ]}
            ]"
            placeholder="请设置新密码"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="确认密码"
        >
          <a-input
            type="password"
            v-decorator="[
              'confirmPwd',
              {rules: [{
                    required: true,
                    message: '请再次输入以确认新密码',
              }, {
                    validator: this.validatePass2
              }]},
            ]"
            placeholder="再次输入确认密码"
          />
        </a-form-item>
        <!-- <a-form-item
          :label-col="formTailLayout.labelCol"
          :wrapper-col="formTailLayout.wrapperCol"
        >
          <p class="red">密码6~12位，需同时包含大小写字母和数字</p>
        </a-form-item> -->
        <a-form-item
          :wrapper-col="{ span: 12, offset: 5 }"
        >
          <a-button
            type="primary"
            html-type="submit"
            :disabled="!($store.state.enable)"
          >
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="mask" v-if="pwdFlag === '0'"></div>
  </div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 },
};
const formTailLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10, offset: 5 },
};
export default {
  data() {
    return {
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this),
      pwdFlag: sessionStorage.getItem('pwdFlag'),
    };
  },
  // watch: {
  //   $route() {
  //     if (this.pwdFlag === '0') {
  //       this.$route.push('/setting/resetPwd');
  //     }
  //   },
  // },
  methods: {
    validatePass(rule, value, callback) {
      const reg = /^(?![A-Za-z]+$)(?!\d+$)(?![\W_]+$)\S{6,12}$/;
      if (value && !reg.test(value)) {
        callback('密码6~12位，需同时包含大小写字母和数字');
      } else {
        callback();
      }
    },
    validatePass2(rule, value, callback) {
      if (value && value !== this.form.getFieldValue('newPassword')) {
        callback('两次输入不一致！');
      } else {
        callback();
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      const navList = this.$store.state.naviItems;
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = values;
          this.$store.commit('setEnable', false);
          this.$api.common.resetPwd(params).then((res) => {
            if (res.code === 200) {
              this.$store.commit('setEnable', true);
              this.$message.success(res.message);
              if (this.pwdFlag === '0') {
                sessionStorage.setItem('pwdFlag', '1');
                // this.$router.push('/');
                this.setNavi(navList[0]);
              } else {
                sessionStorage.setItem('pwdFlag', '1');
              }
            } else {
              this.$store.commit('setEnable', true);
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    setNavi(arr) { // 遍历菜单，取出第一个页面的路由以及id
      const self = this;
      if (arr.subs) {
        self.$store.dispatch('updateNaviData', { key: String(arr.index), subKey: false });
        this.key = String(arr.index);
        self.setNavi(arr.subs[0]);
      } else {
        self.$store.dispatch('updateNaviData', { key: false, subKey: String(arr.index) });
        self.path = arr.path;

        this.$store.dispatch('onOpenPagesChange', {
          path: arr.path,
          name: arr.name,
          init: false,
          key: String(arr.index),
          subKey: this.key,
          belongPath: null,
        });
        // return false;
      }
      this.$router.push(this.path);
    },
  },
};
</script>
<style scoped>
.form_wrap{
    width: 550px;
    background: #fff;
    padding: 0;
    /* -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); */
    z-index: 999;
    position: relative;
    border-radius: 10px;
    padding: 30px 0;
}
.desc{
  padding: 30px 60px;
  font-size: 22px;
}
.mask{
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
