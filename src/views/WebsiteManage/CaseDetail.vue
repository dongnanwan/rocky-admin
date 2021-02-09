<template>
  <div class="common_page_wapper">
    <Back></Back>
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="服务商名称"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
       <a-select
          v-decorator="[
            'providerId',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
          @change="handleChange"
          placeholder="请选择">
          <a-select-option
            v-for="item in providerList"
            :value="item.providerId"
            :key="item.providerId">{{item.providerName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="指定应用"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-select
          v-decorator="[
            'applicationId',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
          @change="handleAppChange"
          placeholder="请选择">
          <a-select-option
            v-for="item in appList"
            :value="item.id"
            :key="item.id">{{item.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="行业标签"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-select
          v-decorator="[
            'industryLabelId',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
          placeholder="请选择">
          <a-select-option
            v-for="item in industryOptions"
            :value="item.id"
            :key="item.id">{{item.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="案例名称"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'caseName',
            {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
          ]"
          placeholder="请输入案例名称"
        />
      </a-form-item>
      <a-form-item
        label="案例简介"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-textarea
          v-decorator="[
            'introduce',
            {rules:$mixRule.execute($mixRule.rules.whitespace, $mixRule.message.requiredInput)}
          ]"
          placeholder="请输入案例简介"
        />
      </a-form-item>
      <a-form-item
        label="案例图"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
        :validate-status="customValidate.status"
        :help="customValidate.errorMsg"
        required
      >
        <a-upload
          name="file"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :headers="{'Authorization':$store.state.token}"
          :action="uploadUrl"
          :beforeUpload="(file) => {return beforeUpload(file, 'caseImg')}"
          @change="(info) => {return handleImgChange(info, 'caseImg') }"
        >
          <img v-if="caseImg" :src="caseImg" width="100" height="100"/>
          <div v-else style="height:100px" class="flex flex-col flex-justify-center">
              <a-icon :type="'upload'" class="green"/>
              <div class="ant-upload-text">1060*576px</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12, offset:9 }"
      >
        <a-button
          size="large" style="width:180px"
          type="primary"
          html-type="submit"
        >
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Back from '../../components/Back.vue';

export default {
  components: { Back },
  data() {
    return {
      caseId: Number(this.$route.params.id),
      form: this.$form.createForm(this),
      uploadUrl: global.config.uploadUrl,
      appTypeOptions: [{ value: '', label: '请选择' }],
      caseImg: '',
      caseImageAttachId: '',
      providerName: '',
      customValidate: {
        status: 'success',
        errorMsg: '',
      },
      providerList: [],
      appList: [],
      industryOptions: [],
    };
  },
  mounted() {
    this.getProviderByType(3, () => {
      if (this.caseId) {
        this.fetchData(this.caseId);
      }
    });
  },
  methods: {
    getProviderByType(type, cb) {
      this.$api.common.getProviderByType(type).then((res) => {
        if (res.code === 200) {
          this.providerList = res.result;
          cb();
        }
      });
    },
    fetchData(caseId) {
      this.$api.website.getCaseDetail(caseId).then((res) => {
        if (res.code === 200) {
          const data = res.result;
          this.handleChange(data.providerId);
          this.handleAppChange(data.applicationId);
          this.form.setFieldsValue({
            providerId: data.providerId,
            applicationId: data.applicationId,
            industryLabelId: data.industryLabelId,
            caseName: data.caseName,
            introduce: data.introduce,
          });
          this.caseImg = data.caseImagePath;
          this.caseImageAttachId = data.caseImageAttachId;
        }
      });
    },
    beforeUpload(file, name) {
      // 限制图片 格式、size、分辨率
      const isJPG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';
      if (!(isJPG || isGIF || isPNG)) {
        this.$message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片~');
      }
      let validWidth;
      let validHeight;
      switch (name) {
        case 'caseImg':
          validWidth = 1060;
          validHeight = 576;
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
    handleImgChange(info, name) {
      const { response } = info.file;
      if (response) {
        if (response.code === 200) {
          switch (name) {
            case 'caseImg':
              this.caseImg = response.result.attachmentUrl;
              this.caseImageAttachId = response.result.attachmentId;
              break;
            default:
              break;
          }
          this.customValidate = {
            status: 'success',
            errorMsg: null,
          };
        } else {
          this.$message.error(response.message);
        }
      }
    },
    handleChange(val) {
      const self = this;
      this.appList = [];
      this.industryOptions = [];
      this.form.setFieldsValue({ applicationId: '', industryLabelId: '' });
      const res = this.providerList.filter((item) => {
        if (item.providerId === val) {
          self.appList = item.application;
        }
      });
    },
    handleAppChange(val) {
      const self = this;
      this.industryOptions = [];
      this.form.setFieldsValue({ industryLabelId: '' });
      const res = this.appList.filter((item) => {
        if (item.id === val) {
          self.industryOptions = item.industryLabel;
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      if (!this.caseImageAttachId) {
        this.customValidate = {
          status: 'error',
          errorMsg: '图片未上传',
        };
      } else {
        this.form.validateFields((err, values) => {
          if (!err) {
            const params = {
              ...values,
              caseImageAttachId: this.caseImageAttachId,
            };
            if (this.caseId) {
              params.caseId = this.caseId;
              this.$api.website.editCase(params).then((res) => {
                if (res.code === 200) {
                  this.$router.push('/WebsiteManage/CaseList');
                }
              });
            } else {
              this.$api.website.addCase(params).then((res) => {
                if (res.code === 200) {
                  this.$router.push('/WebsiteManage/CaseList');
                }
              });
            }
          }
        });
      }
    },
  },
};
</script>
