<template>
  <div>
    <div class="page_wapper">
      <div class="p10 flex flex-justify-between flex-align-center">
        <p class="title">商城应用分类标签管理</p>
        <button class="edit-btn btn"  @click="handleEdit(1)" v-if="!classifyEditable">
          <a-icon type="edit" class="mr10"/>
          编辑</button>
        <div v-else>
          <button
            class="delete-btn btn mr10"
            :disabled="checkedList.length===0" @click="handleDelete(1)">删除</button>
          <button class="save-btn btn" type="primary" @click="handleEdit(1)">保存</button>
        </div>
      </div>
      <div class="label-wrap">
        <div class="label-item-wrap">
          <label>一级标签（产品标签）</label>
          <div class="p20">
            <div>
              <template v-for="(tag) in myModuleOptions">
                <a-checkable-tag
                  :key="tag.value"
                  :checked="selectedTags===tag.value"
                  @change="(checked) => handleChange(tag.value, checked)">
                  {{tag.label}}
                </a-checkable-tag>
              </template>
            </div>
          </div>
        </div>
        <div class="label-item-wrap">
          <div class="grey-bg">
            <label class="label-title">二级标签（应用标签）</label>
            <div v-if="!classifyEditable">
              <template v-for="(tag) in myClassifyOptions">
                <a-tag
                  color="blue"
                  :key="tag.value">
                  {{tag.label}}
                </a-tag>
              </template>
            </div>
            <div class="flex flex-wrap flex-align-center" v-else>
              <draggable
                v-model="myClassifyOptions"
                @update="datadragEnd"
                v-bind="{animation:500}">
                  <transition-group>
                    <template v-for="(tag, index) in myClassifyOptions">
                      <a-tag
                        class="mt10 mb10"
                        color="blue"
                        :key="tag.value"
                        :closable="Number(tag.value)<0"
                        @close="handleClose(tag.value, 'second')">
                        <a-checkbox
                          :checked="checkedList.indexOf(Number(tag.value))===-1?false:true"
                          :key="index"
                          :disabled="tag.label=== '其他'"
                          @change="(e)=> {handleCheck(e, tag.value)}"
                          v-if="Number(tag.value)>0">
                          {{tag.label}}
                        </a-checkbox>
                        <span v-else>{{tag.label}}</span>
                      </a-tag>
                    </template>
                  </transition-group>
              </draggable>
              <newTag :tags="myClassifyOptions" @submit="(tagName) => {handleNodes(tagName, 2)}"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page_wapper">
      <div class="p10 flex flex-justify-between flex-align-center">
        <p>行业应用标签</p>
        <button
          class="edit-btn btn"
          icon="edit"
          @click="handleEdit(2)"
          v-if="!industryLevelEditable">
          <a-icon type="edit" class="mr10"/>编辑</button>
        <div v-else>
          <button
            class="mr10 delete-btn btn"
            @click="handleDelete(2)"
            :disabled="this.handleIndustryCheck.length===0">删除</button>
          <button class="save-btn btn" @click="handleEdit(2)">保存</button>
        </div>
      </div>
      <div class="label-wrap">
        <div>
          <div class="p20">
            <div v-if="!industryLevelEditable">
              <template v-for="(tag) in myIndustryOptions">
                <a-tag
                  color="blue"
                  :key="tag.value">
                  {{tag.label}}
                </a-tag>
              </template>
            </div>
            <div class="flex flex-wrap flex-align-center" v-else>
              <draggable
                v-model="myIndustryOptions"
                @update="datadragEnd"
                v-bind="{animation:500}">
                  <transition-group>
                    <template v-for="(tag, index) in myIndustryOptions">
                      <a-tag
                        class="mt10 mb10"
                        color="blue"
                        :key="tag.value"
                        :closable="Number(tag.value)<0"
                        @close="handleClose(tag.value, 'three')">
                        <a-checkbox
                          :disabled="tag.label=== '其他'"
                          :checked="industryCheckList.indexOf(Number(tag.value))===-1?false:true"
                          :key="index"
                          v-if="Number(tag.value)>0"
                          @change="(e)=> {handleIndustryCheck(e, tag.value)}"
                          >
                        {{tag.label}}
                        </a-checkbox>
                        <span v-else>{{tag.label}}</span>
                      </a-tag>
                    </template>
                  </transition-group>
              </draggable>
              <newTag
                :tags="myIndustryOptions"
                @submit="(tagName) => {handleNodes(tagName, 3)}"/>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

</template>
<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import newTag from '../../components/NewTag.vue';

export default {
  components: {
    draggable,
    newTag,
  },
  data() {
    return {
      classifyEditable: false,
      industryLevelEditable: false,
      selectedTags: this.$store.state.moduleOptions.length > 0 ? this.$store.state.moduleOptions[0].value : '', // 以及标签选中联动二级标签
      myModuleOptions: this.$store.state.moduleOptions,
      myClassifyOptions: this.$store.state.classifyOptions,
      myIndustryOptions: this.$store.state.industryOptions,
      firstLabelParams: [],
      secondLevelParams: [],
      industryParams: [],
      checkedList: [],
      industryCheckList: [],

    };
  },
  computed: {
    ...mapState(['optionsFetched', 'moduleOptions', 'classifyOptions', 'industryOptions']),
    classifyOtherId() {
      let result;
      this.classifyOptions.forEach((element) => {
        if (element.label === '其他') {
          result = Number(element.value);
        }
      });
      return result;
    },
    industryOtherId() {
      let result;
      this.industryOptions.forEach((element) => {
        if (element.label === '其他') {
          result = Number(element.value);
        }
      });
      return result;
    },
  },
  watch: {
    moduleOptions(val) {
      this.myModuleOptions = val;
    },
    classifyOptions(val) {
      this.myClassifyOptions = val;
    },
    industryOptions(val) {
      this.myIndustryOptions = val;
    },
    optionsFetched(flag) {
      if (flag) {
        const [first] = this.moduleOptions;
        if (!this.selectedTags) {
          this.selectedTags = first.value;
        }
        this.$store.dispatch('fetchClassifyOptions', this.selectedTags);
      }
    },
  },
  mounted() {
    if (this.selectedTags) {
      this.$store.dispatch('fetchClassifyOptions', this.selectedTags);
    }
    // 为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    /* eslint-disable */
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  methods: {
    handleCheck(e, id) {
      const { checked } = e.target;
      if (checked) {
        this.checkedList.push(Number(id));
      } else {
        const index = this.checkedList.indexOf(Number(id));
        this.checkedList.splice(index, 1);
      }
    },
    handleIndustryCheck(e, id) {
      const { checked } = e.target;
      if (checked) {
        this.industryCheckList.push(Number(id));
      } else {
        const index = this.industryCheckList.indexOf(Number(id));
        this.industryCheckList.splice(index, 1);
      }
    },
    datadragEnd(evt) {
      evt.preventDefault();
    },
    handleChange(tag) {
      this.selectedTags = tag;
      this.$store.dispatch('fetchClassifyOptions', this.selectedTags);
    },
    handleClose(removedTag, level) {
      let tags = [];
      switch (level) {
        case 'second':
          // this.labelDelete(removedTag);
          tags = this.myClassifyOptions.filter(tag => tag.value !== removedTag);
          this.myClassifyOptions = tags;
          break;
        case 'three':
          tags = this.myIndustryOptions.filter(tag => tag.value !== removedTag);
          this.myIndustryOptions = tags;
          break;
        default:
          break;
      }
    },
    handleNodes(tagName, level) {
      switch (level) {
        case 2:
          this.myClassifyOptions.push({ label: tagName, value: 0 - this.myClassifyOptions.length });
          break;
        case 3:
          this.myIndustryOptions.push({ label: tagName, value: 0 - this.myIndustryOptions.length });
          break;
        default:
          break;
      }
    },
    handleLabelSave(list) {
      const params = { list };
      this.$api.mailManage.labelSave(params).then((res) => {
        if (res.code === 200) {
          this.$store.dispatch('commonOptions', this);
          this.$store.dispatch('fetchClassifyOptions', this.selectedTags);
        }
      });
    },
    handleEdit(level) {
      switch (level) {
        case 1:
          this.classifyEditable = !this.classifyEditable;
          if (!this.classifyEditable) {
            this.secondLevelParams = this.myClassifyOptions.map((item, index) => ({
              id: Number(item.value) < 0 ? 0 : item.value,
              name: item.label,
              sort: index + 1, // 排列顺序
              type: 1, // 标签类型 1、不分级标签 2、分级标签
              level: 2, // 标签等级  分级标签才有
              pid: this.selectedTags, // 父级Id   分级标签才有
            }));
            this.handleLabelSave(this.secondLevelParams);
          }

          break;
        case 2:
          this.industryLevelEditable = !this.industryLevelEditable;
          if (!this.industryLevelEditable) {
            this.industryParams = this.myIndustryOptions.map((item, index) => ({
              id: Number(item.value) < 0 ? 0 : item.value,
              name: item.label,
              sort: index + 1,
              type: 1, // 标签类型
              labelClass: 1, // 标签类别（1：行业）
              level: 2, // 标签等级  分级标签才有
              pid: this.selectedTags, // 父级Id   分级标签才有
            }));
            this.handleLabelSave(this.industryParams);
          }

          break;
        default:
          break;
      }
    },
    labelDelete(params) {
      this.$api.mailManage.labelDelete(params).then((res) => {
        if (res.code === 200) {
          this.$store.dispatch('commonOptions', this);
        }
      });
    },
    handleDelete(type) {
      let params;
      const self = this;
      this.$confirm({
        title: '删除',
        content: `确认将${type === 1 ? self.checkedList.length : self.industryCheckList.length}个标签删除吗`,
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          switch (type) {
            case 1:
              params = {
                pid: Number(self.selectedTags),
                otherId: self.classifyOtherId,
                idList: self.checkedList,
              };
              self.labelDelete(params);
              break;
            case 2:
              params = {
                otherId: self.industryOtherId,
                idList: self.industryCheckList,
              };
              self.labelDelete(params);
              break;
            default:
              break;
          }
        },
        onCancel() {
        },
      });
    },
  },
};
</script>
<style>
.ant-tag{
  line-height: 30px;
    height: 30px;
    padding: 0 10px;
}
</style>

<style lang="scss" scoped>

.p20{
  padding: 20px;
}
.page_wapper{
  background: #fff;
  padding: 20px 40px;
}
.label-wrap{
  padding: 10px 30px;
}
.label-item-wrap:nth-child(1){
  border-bottom: 1px dashed #ddd;
}
.label-item-wrap:nth-child(2){
  padding: 20px 0;
  border-bottom: none;
}
.edit-btn {
  width:130px;
  height:40px;
  background:rgba(235,238,245,1);
  border-radius:4px;
  border: none;
  color:rgba(105,115,131,1);
  transition: all .15s ease,transform .2s ease-in-out;
  cursor: pointer;
}
.btn:hover{
  // background:rgba(235,238,245,.8);
  opacity: 0.8;

}
.delete-btn{
  width:130px;
  height:40px;
  background:rgba(255,139,70,1);
  border-radius:4px;
  border: none;
  color: #fff;
}
.save-btn{
  width:130px;
  height:40px;
  background:rgba(21,133,255,1);
  border-radius:4px;
  border: none;
  color: #fff;
}
.grey-bg{
  min-height:127px;
  background:rgba(247,248,250,1);
  border:1px solid rgba(222,227,236,1);
  padding: 20px;
  label.label-title {
    line-height: 38px;
  }
}
.title{
  font-size:18px;
  font-family:SourceHanSansCN-Regular,SourceHanSansCN;
  font-weight:400;
  color:rgba(43,48,59,1);
}
</style>
