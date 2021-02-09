/* 富文本编辑图片上传配置 */
import Vue from 'vue';
import { Message } from 'ant-design-vue';
import '../../config';
import store from '../../store';
import router from '../../router';

const uploadConfig = {
  action: global.config.uploadUrl, // 必填参数 图片上传地址
  methods: 'POST', // 必填参数 图片上传方式
  token: store.state.token, // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
  name: 'file', // 必填参数 文件的参数名
  size: 1024, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon', // 可选 可上传的图片格式
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
  ['link', 'image'],
];
const handlers = {
  image: function image() {
    const self = this;
    let fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput === null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name);
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept);
      fileInput.classList.add('ql-image');
      // 监听选择文件
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file.size > Number(1 * 1024 * 1024)) {
          this.$message.warning('图片尺寸过大，请重新上传');
          return false;
        }
        // 创建formData
        const formData = new FormData();
        formData.append(uploadConfig.name, fileInput.files[0]);
        // 图片上传
        const xhr = new XMLHttpRequest();
        xhr.open(uploadConfig.methods, uploadConfig.action, true);
        xhr.setRequestHeader('Authorization', store.state.token);
        // 上传数据成功，会触发
        xhr.onload = (e) => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            if (res.code === 200) {
              const data = res.result;
              const length = self.quill.getSelection(true).index;
              // 这里很重要，你图片上传成功后，img的src需要在这里添加,res.path就是你服务器返回的图片链接
              self.quill.insertEmbed(length, 'image', data.attachmentUrl);
              self.quill.setSelection(length + 1);
            } else {
              Message.error(res.message);
            }
          } else if (xhr.status === 401) {
            sessionStorage.clear();
            store.commit('setPwdFlag', null);
            store.commit('setToken', null);
            setTimeout(() => {
              router.push({
                path: '/login',
              });
            }, 1000);
          } else {
            Message.error('接口异常');
          }
          fileInput.value = '';
        };
        // 开始上传数据
        xhr.upload.onloadstart = (e) => {
          fileInput.value = '';
        };
        // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
        xhr.upload.onerror = (e) => {

        };
        // 上传数据完成（成功或者失败）时会触发
        xhr.upload.onloadend = (e) => {
        };
        xhr.send(formData);
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  },
};


export default {
  placeholder: '',
  theme: 'snow', // 主题
  modules: {
    toolbar: {
      container: toolOptions, // 工具栏选项
      handlers,
      // {
      //   image: function image() {
      //     document.querySelector('input.ql-image[type=file]').click();
      //   },
      // },
    },
    ImageResize: {},
    // ImageExtend: {
    //   name: 'file',
    //   size: 1, // 单位为M, 1M = 1024KB
    //   action: global.config.uploadUrl,
    //   headers: (xhr) => {
    //     xhr.setRequestHeader('Authorization', uploadConfig.token);
    //   },
    //   response: (res) => {
    //     return res.result.attachmentUrl;
    //   },
    // },
  },
};
