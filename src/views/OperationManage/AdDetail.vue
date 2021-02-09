<template>
  <div class="common_page_wapper white-bg">
    <Back></Back>
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="广告位选择"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-select
          v-decorator="[
            'adType',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
          @change="handleTypeChange"
          placeholder="请选择">
          <a-select-option
            v-for="item in $selectOptions.advertType"
            :value="item.value"
            :key="item.value">{{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="广告图"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
        required
        :validate-status="customValidate.status"
        :help="customValidate.errorMsg"
      >
        <a-upload
          name="file"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :headers="{'Authorization':$store.state.token}"
          :action="uploadUrl"
          :beforeUpload="(file) => {return beforeUpload(file, this.form.getFieldValue('adType'))}"
          @change="handleImgChange"
        >
          <!-- <img v-if="adImg" :src="adImg" width="100" height="100"/> -->
          <img v-if="adImg" :src="adImg" alt="avatar"  width="100" height="100"/>
          <div v-else style="height: 100px;" class="flex flex-col flex-justify-center">
            <a-icon type="plus" />
            <div class="ant-upload-text">{{validWidth?validWidth+'*'+validHeight+'px':'Upload'}}</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="推广对象"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-select
          v-decorator="[
            'targetUser',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
          placeholder="请选择">
          <a-select-option
            v-for="item in $selectOptions.targetUser"
            :value="item.value"
            :key="item.value">{{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="推广时间"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-range-picker
          v-decorator="[
            'time',
            {rules:$mixRule.execute($mixRule.rules.required, $mixRule.message.requiredSpecial)}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="广告链接"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-input
          v-decorator="[
            'adLink',
          ]"
          placeholder="请输入活动链接"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 8, offset:7 }"
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
import moment from 'moment';
import Back from '../../components/Back.vue';

export default {
  components: { Back },
  data() {
    return {
      id: this.$route.params.id,
      form: this.$form.createForm(this),
      uploadUrl: global.config.uploadUrl,
      adImg: '',
      adImageAttachId: '',
      validWidth: '',
      validHeight: '',
      customValidate: {
        status: 'success',
        errorMsg: '',
      },
      dateString: [],
    };
  },
  mounted() {
    if (Number(this.id)) {
      this.$api.operation.advertiseDetail({ id: this.id }).then((res) => {
        if (res.code === 200) {
          const data = res.result;
          this.adImageAttachId = data.adImageAttachId;
          this.adImg = data.adImageAttachUrl;
          this.form.setFieldsValue({
            adType: data.adType,
            targetUser: data.targetUser,
            adLink: data.adLink,
            time: [moment(data.popularizeStartTime.split(' ')[0], 'YYYY-MM-DD'),
              moment(data.popularizeEndTime.split(' ')[0], 'YYYY-MM-DD')],
          });
          this.handleTypeChange(data.adType);
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  methods: {
    moment,
    // handleTimeChange(date, dateString) {
    //   this.dateString= dateString;
    // },
    handleTypeChange(val) {
      switch (val) {
        case 1:
          this.validWidth = 200;
          this.validHeight = 200;
          break;
        case 2:
          this.validWidth = 1920;
          this.validHeight = 400;
          break;
        case 3:
          this.validWidth = 1200;
          this.validHeight = 120;
          break;
        default:
          break;
      }
    },
    beforeUpload(file, type) {
      // 限制图片 格式、size、分辨率
      const isJPG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';
      if (!(isJPG || isGIF || isPNG)) {
        this.$message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片~');
      }
      if (type == undefined) {
        this.$message.warning('请先选择广告类型！');
        return false;
      }
      // let validWidth = ;
      // let validHeight;
      // switch (type) {
      //   case 1:
      //     validWidth = 200;
      //     validHeight = 200;
      //     break;
      //   case 2:
      //     validWidth = 1920;
      //     validHeight = 400;
      //     break;
      //   case 3:
      //     validWidth = 1200;
      //     validHeight = 120;
      //     break;
      //   default:
      //     break;
      // }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('Image must smaller than 1MB!');
      }
      return (isJPG || isGIF || isPNG)
      && isLt1M && this.$utils.valWidthAndHeight(file, this.validWidth, this.validHeight);
    },
    handleImgChange(info) {
      const { response } = info.file;
      if (response) {
        if (response.code === 200) {
          this.adImg = response.result.attachmentUrl;
          this.adImageAttachId = response.result.attachmentId;
          this.customValidate = {
            status: 'success',
            errorMsg: null,
          };
        } else {
          this.$message.error(response.message);
        }
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.adImageAttachId) {
            // this.message
            this.customValidate = {
              status: 'error',
              errorMsg: '请上传图片',
            };
          } else {
            const params = {
              ...values,
              adImageAttachId: this.adImageAttachId,
              popularizeStartTime: this.$utils.dateRangeFormat(values.time, 'begin'),
              popularizeEndTime: this.$utils.dateRangeFormat(values.time, 'end'),
            };

            delete params.time;
            if (this.id) {
              params.id = this.id;
            }
            this.$api.operation.advertiseEdit(params).then((res) => {
              if (res.code === 200) {
                this.$router.go(-1);
              } else {
                this.$message.error(res.message);
              }
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
