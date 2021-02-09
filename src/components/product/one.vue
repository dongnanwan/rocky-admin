<template>
  <div class="wrap">
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="应用名称"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-row :gutter="6">
          <a-col :span="18">
            <a-input
              maxlength="50"
              v-decorator="[
                'applicationName',
                {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
              ]"
              placeholder="请输入应用名称"
            />
          </a-col>
          <a-col :span="6">
            <span>{{form.getFieldValue('applicationName')?form.getFieldValue('applicationName').length:0}}/50</span>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        label="应用简介"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-row :gutter="6">
          <a-col :span="18">
            <a-textarea
              :autosize="{ minRows: 3, maxRows: 6 }"
              maxlength="130"
              v-decorator="[
                'introduce',
                {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
              ]"
              placeholder="请输入应用简介"
            >
            </a-textarea>
          </a-col>
          <a-col :span="6">
            <span>{{form.getFieldValue('introduce')?form.getFieldValue('introduce').length:0}}/130</span>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        label="产品类型"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-radio-group
          v-decorator="['productTypeLabelId', {
            rules: $mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial),
          }]"
          buttonStyle="solid" @change="handleModuleChange">
          <a-radio-button
            v-for="item in moduleOptions"
            :key="item.value"
            :value="item.value">{{item.label}}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="应用类型"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
        v-if="moduleTag"
      >
        <a-radio-group
          v-decorator="['applicationTypeLabelId', {
            rules: $mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial),
          }]"
          buttonStyle="solid">
          <a-radio-button
            v-for="item in classifyOptions"
            :key="item.value"
            :value="item.value">{{item.label}}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="所属行业"
        v-if="moduleTag"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
        required
        :validate-status="industryValidate.status"
        :help="industryValidate.errorMsg"
      >
        <template v-for="tag in industryOptions">
          <a-checkable-tag
            :key="tag.value"
            :checked="selectedTags.indexOf(tag.value) > -1"
            @change="(checked) => handleChange(tag.value, checked)"
          >
            {{tag.label}}
          </a-checkable-tag>
        </template>
      </a-form-item>
      <a-form-item
        label="服务商名称"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-row :gutter="6">
          <a-col :span="18">
            <a-input
              maxlength="50"
              v-decorator="[
                'providerName',
                {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
              ]"
              placeholder="请输入服务商名称"
            />
          </a-col>
          <a-col :span="6">
            <span>{{form.getFieldValue('providerName')?form.getFieldValue('providerName').length:0}}/50</span>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        label="客服热线"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-row :gutter="6">
          <a-col :span="18">
            <a-input
              placeholder="请输入客服热线"
              v-decorator="[
                'customerServiceLine',
                {rules: [
                  {
                    validator: checkValue,
                  },
                  {
                    required: true,
                    message: '请输入客服热线',
                  },
                ],}
              ]"
            />
          </a-col>
          <a-col>
            <span>付费后展示</span>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        label="客服邮箱"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-row :gutter="6">
          <a-col :span="18">
            <a-input
              placeholder="请输入客服邮箱"
              v-decorator="[
                'customerServiceEmail',
                {rules: [
                  {
                    type: 'email',
                    message: '输入错误或格式不正确',
                  },
                  {
                    required: true,
                    message: '请输入邮箱',
                  },
                ],}
              ]"
            />
          </a-col>
          <a-col>
            <span>付费后展示</span>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        label="在线时间"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="如：早上8:00~12:00，下午14:00~18:00"
          v-decorator="[
            'onlineServiceTime',
            {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="合作模式"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-radio-group
          v-decorator="['cooperateMode', {
            rules: $mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial),
          }]"
          >
          <a-radio
            v-for="item in $selectOptions.cooperateModeOptions"
            :key="item.value"
            :value="item.value">{{item.label}}
          </a-radio>
        </a-radio-group>
        <p v-if="form.getFieldValue('cooperateMode') === 2">用户在RockySaaS平台完成支付流程，且可直接从RockySaaS平台中进入系统</p>
      </a-form-item>
      <a-form-item
        label=" 导流地址 "
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
        v-if="form.getFieldValue('cooperateMode') === 1"
      >
        <a-input
          placeholder="请输入导流地址"
          v-decorator="[
            'diversionAddress',
            {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="应用图片"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
        :validate-status="imgValidate.status"
        :help="imgValidate.errorMsg"
        required
      >
        <div class="flex">
          <div>
            <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :headers="{'Authorization':$store.state.token}"
              :action="uploadUrl"
              :beforeUpload="(file)=>{return beforeUpload(file,'appLogo')}"
              @change="(info) => {handleImgChange(info, 'appLogo')}"
            >
              <img v-if="appLogo" :src="appLogo" alt="avatar" width="100" height="100"/>
              <div class="flex flex-col flex-justify-center" style="height: 104px;" v-else>
                  <a-icon :type="'upload'" class="green"/>
                  <div class="ant-upload-text">292*194px</div>
              </div>
            </a-upload>
            <div class="text-center">应用LOGO</div>
          </div>
          <div>
            <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :headers="{'Authorization':$store.state.token}"
              :action="uploadUrl"
              :beforeUpload="(file)=>{return beforeUpload(file,'providerLogo')}"
              @change="(info) => {handleImgChange(info, 'providerLogo')}"
            >
              <img v-if="providerLogo" :src="providerLogo" alt="avatar" width="100" height="100"/>
              <div class="flex flex-col flex-justify-center" style="height: 104px;" v-else>
                  <a-icon :type="'upload'" class="green"/>
                  <div class="ant-upload-text">234*72px</div>
              </div>
            </a-upload>
            <p class="text-center">服务商LOGO</p>
          </div>
          <div>
            <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :headers="{'Authorization':$store.state.token}"
              :action="uploadUrl"
              :beforeUpload="(file)=>{return beforeUpload(file,'appBanner')}"
              @change="(info) => {handleImgChange(info, 'appBanner')}"
            >
              <img v-if="appBanner" :src="appBanner" alt="avatar" width="100" height="100"/>
              <div class="flex flex-col flex-justify-center" style="height: 104px;" v-else>
                  <a-icon :type="'upload'" class="green"/>
                  <div class="ant-upload-text">286*180px</div>
              </div>
            </a-upload>
            <p class="text-center">应用展位图</p>
          </div>

        </div>
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12, offset:10 }"
      >
        <a-button
          class="mt50"
          style="width:320px;height:50px"
          type="primary"
          :loading="$store.state.spinning"
          html-type="submit"
        >
          下一步
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      moduleTag: '',
      selectedTags: [],
      appLogo: '',
      applicationLogoAttachId: '',
      providerLogo: '',
      providerLogoAttachId: '',
      appBanner: '',
      applicationImageAttachId: '',
      uploadUrl: global.config.uploadUrl,
      cooperateMode: '',
      applicationId: 0,
      industryValidate: {},
      imgValidate: {},
      name: '',
    };
  },
  computed: {
    ...mapState(['moduleOptions', 'classifyOptions', 'industryOptions', 'optionsFetched']),
  },
  watch: {
    moduleTag(val) {
      this.$store.dispatch('fetchClassifyOptions', val);
    },
    info(val) {
      this.fillFormDate(val);
    },
  },
  methods: {
    industryValidateFun() {  // 验证行业是否为空
      if (this.selectedTags.length > 0) {
        this.industryValidate = {
          status: 'success',
          errorMsg: null,
        };
        return true;
      }
      this.industryValidate = {
        status: 'error',
        errorMsg: '请选择所属行业',
      };
      return false;
    },
    imgValidateFun() {  // 验证是否上传完整
      if (this.applicationImageAttachId && this.providerLogoAttachId && this.applicationLogoAttachId) {
        this.imgValidate = {
          status: 'success',
          errorMsg: null,
        };
        return true;
      }
      this.imgValidate = {
        status: 'error',
        errorMsg: '请上传图片',
      };
      return false;
    },
    checkValue(rule, value, callback) {
      const reg = /^400[0-9]{7}|^800[0-9]{7}|^1(3|4|7|5|8)([0-9]{9})|^0[0-9]{2,4}-[0-9]{7,8}$/;
      if (value && reg.test(value)) {
        callback();
        return;
      }
      callback('输入错误或格式不正确');
    },
    fillFormDate(info) { // 填充表单
      this.applicationId = info.applicationId;
      if (info.applicationId) {
        this.cooperateMode = info.cooperateMode;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            applicationName: info.applicationName,
            introduce: info.introduce,
            productTypeLabelId: info.productTypeLabelId,
            providerName: info.providerName,
            customerServiceEmail: info.customerServiceEmail,
            customerServiceLine: info.customerServiceLine,
            onlineServiceTime: info.onlineServiceTime,
            cooperateMode: info.cooperateMode,
          });
        });
        this.moduleTag = info.productTypeLabelId;
        if (this.moduleTag) {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              applicationTypeLabelId: info.applicationTypeLabelId,
            });
          });
        }

        if (info.diversionAddress) {
          setTimeout(() => {
            this.$nextTick(() => {
              this.form.setFieldsValue({
                diversionAddress: info.diversionAddress,
              });
            });
          }, 1000);
        }
        this.selectedTags = JSON.parse(info.industryLabelIds).id;
        this.applicationLogoAttachId = info.applicationLogoAttachId;
        this.providerLogoAttachId = info.providerLogoAttachId;
        this.applicationImageAttachId = info.applicationImageAttachId;
        this.appLogo = info.applicationLogoPath;
        this.providerLogo = info.providerLogoPath;
        this.appBanner = info.applicationImagePath;
      }
    },
    handleModuleChange(e) {  // 产品类型选择重置对应的应用类型和所属行业
      this.moduleTag = e.target.value;
      if(this.form.getFieldValue('applicationTypeLabelId')){
        this.form.setFieldsValue({'applicationTypeLabelId': ''});
      }
      this.selectedTags = [];
    },
    handleChange(tag, checked) {  // 所属行业选择变更
      const { selectedTags } = this;
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter(t => t !== tag);
      this.selectedTags = nextSelectedTags;
    },
    handleImgChange(info, name) {  // 处理三张图片上传
      const { response } = info.file;
      if (response) {
        if (response.code === 200) {
          switch (name) {
            case 'appLogo':
              this.appLogo = response.result.attachmentUrl;
              this.applicationLogoAttachId = response.result.attachmentId;
              break;
            case 'providerLogo':
              this.providerLogo = response.result.attachmentUrl;
              this.providerLogoAttachId = response.result.attachmentId;
              break;
            case 'appBanner':
              this.appBanner = response.result.attachmentUrl;
              this.applicationImageAttachId = response.result.attachmentId;
              break;
            default:
              break;
          }
          this.imgValidateFun();
        } else {
          this.$message.error(response.message);
        }
      }
    },
    beforeUpload(file, name) { // 限制图片 格式、size
      const isJPG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';
      if (!(isJPG || isGIF || isPNG)) {
        this.$message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片~');
      }
      let validWidth;
      let validHeight;
      switch (name) {
        case 'appLogo':
          validWidth = 292;
          validHeight = 194;
          break;
        case 'providerLogo':
          validWidth = 234;
          validHeight = 72;
          break;
        case 'appBanner':
          validWidth = 286;
          validHeight = 180;
          break;
        default:
          break;
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('Image must smaller than 1MB!');
      }
      return (isJPG || isGIF || isPNG)
      && isLt1M && this.$utils.valWidthAndHeight(file, validWidth, validHeight);
    },
    handleSubmit(e) {  
      e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            const res1 = this.industryValidateFun();
            const res2 = this.imgValidateFun();
            if (res1 && res2) {
              const params = {  // 封装第一步提交请求所粗的参数
                ...values,
                industryLabelIds: this.selectedTags.join(','),
                applicationLogoAttachId: this.applicationLogoAttachId,
                providerLogoAttachId: this.providerLogoAttachId,
                applicationImageAttachId: this.applicationImageAttachId,
              };
              if (this.applicationId) {
                params.applicationId = this.applicationId;
              }
              this.$emit('save', params);
            }
          }
      });
    },
  },
};
</script>
<style>
.ant-upload.ant-upload-select-picture-card{
  margin: 0 10px;
}
.ant-input-affix-wrapper input::-webkit-input-placeholder {
  font-family:SourceHanSansCN-Regular,SourceHanSansCN;
}
.ant-input-affix-wrapper input::-moz-input-placeholder {
  font-family:SourceHanSansCN-Regular,SourceHanSansCN;
}
.ant-input-affix-wrapper input::-ms-input-placeholder {
  font-family:SourceHanSansCN-Regular,SourceHanSansCN;
}
.ant-form-item-children .ant-radio-group label.ant-radio-button-wrapper {
  margin-right: 10px;
  background:rgba(247,248,250,1);
  border-radius:4px!important;
  border:1px solid rgba(222,227,236,1);
}
.ant-form-item-children .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  background: #DCE9FF!important;
  border-radius:4px!important;
  border:1px solid #DCE9FF!important;
  color: #1585FF!important;
  outline:none!important;
  box-shadow: none;
  /* height:34px;
  line-height: 34px; */
}
.ant-form-item-children .ant-radio-button-wrapper:not(:first-child)::before{
  content: none!important;
}
.ant-form-item-children .ant-radio-button-wrapper-checked:before{
  content: none!important;
}
</style>
