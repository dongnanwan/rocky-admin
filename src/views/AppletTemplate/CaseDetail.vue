<template>
  <div class="common_page_wapper white-bg">
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
        label="小程序码"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
        :validate-status="programCodeValidate.status"
        :help="programCodeValidate.errorMsg"
        required
      >
        <a-upload
          name="file"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :headers="{'Authorization':$store.state.token}"
          :action="uploadUrl"
          :beforeUpload="(file) => {return beforeUpload(file, 'programCode')}"
          @change="(info) => {return handleImgChange(info, 'programCode') }"
        >
          <img v-if="programCode" :src="programCode" width="100" height="100"/>
          <div v-else style="height:100px" class="flex flex-col flex-justify-center">
              <a-icon :type="'upload'" class="green"/>
              <div class="ant-upload-text">200*200px</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="案例图"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
        :validate-status="caseImgValidate.status"
        :help="caseImgValidate.errorMsg"
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
              <div class="ant-upload-text">290*490px</div>
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
import Back from '../../components/Back.vue';

export default {
  components: { Back },
  data() {
    return {
      caseId: Number(this.$route.params.id),
      form: this.$form.createForm(this),
      uploadUrl: global.config.uploadUrl,
      programCode: '',
      miniprogramImageAttachId: '',
      caseImg: '',
      caseImageAttachId: '',
      providerName: '',
      programCodeValidate: {},
      caseImgValidate: {},
      providerList: [],
      appList: [],
      industryOptions: [],
    };
  },
  mounted() {
    this.getProviderByType(2, () => {
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
    programCodeValidateFun() {
      if (!this.miniprogramImageAttachId) {
        this.programCodeValidate = {
          status: 'error',
          errorMsg: '图片未上传',
        };
        return false;
      }
      this.programCodeValidate = {
        status: 'success',
        errorMsg: null,
      };
      return true;
    },
    caseImgValidateFun() {
      if (!this.caseImageAttachId) {
        this.caseImgValidate = {
          status: 'error',
          errorMsg: '图片未上传',
        };
        return false;
      }
      this.caseImgValidate = {
        status: 'success',
        errorMsg: null,
      };
      return true;
    },
    fetchData(caseId) {
      this.$api.miniProgram.getCaseDetail(caseId).then((res) => {
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
          this.programCode = data.miniprogramImagePath;
          this.miniprogramImageAttachId = data.miniprogramImageAttachId;
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
        case 'programCode':
          validWidth = 200;
          validHeight = 200;
          break;
        case 'caseImg':
          validWidth = 290;
          validHeight = 490;
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
            case 'programCode':
              this.programCode = response.result.attachmentUrl;
              this.miniprogramImageAttachId = response.result.attachmentId;
              break;
            case 'caseImg':
              this.caseImg = response.result.attachmentUrl;
              this.caseImageAttachId = response.result.attachmentId;
              break;
            default:
              break;
          }
          this.programCodeValidateFun();
          this.caseImgValidateFun();
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
      this.providerList.forEach((item) => {
        if (item.providerId === val) {
          self.appList = item.application;
        }
      });
    },
    handleAppChange(val) {
      const self = this;
      this.industryOptions = [];
      this.form.setFieldsValue({ industryLabelId: '' });
      this.appList.forEach((item) => {
        if (item.id === val) {
          self.industryOptions = item.industryLabel;
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      const res1 = this.programCodeValidateFun();
      const res2 = this.caseImgValidateFun();
      if (res1 && res2) {
        this.form.validateFields((err, values) => {
          if (!err) {
            const params = {
              ...values,
              providerName: this.providerName,
              miniprogramImageAttachId: this.miniprogramImageAttachId,
              caseImageAttachId: this.caseImageAttachId,
            };
            if (this.caseId) {
              params.caseId = this.caseId;
              this.$api.miniProgram.editCase(params).then((res) => {
                if (res.code === 200) {
                  this.$router.push('/AppletTemplate/CaseList');
                }
              });
            } else {
              this.$api.miniProgram.addCase(params).then((res) => {
                if (res.code === 200) {
                  this.$router.push('/AppletTemplate/CaseList');
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
