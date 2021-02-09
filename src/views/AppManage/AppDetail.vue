<template>
  <div>
    <div class="overview">
      <div class="overview_title">应用简介</div>
      <div class="flex flex-align-center">
        <img class="overview_avatar" :src="detail.applicationLogoPath" alt="">
        <div class="overview_detail">
          <div class="info_wrap flex flex-wrap">
            <div class="info_item"><label>应用ID：</label>{{detail.applicationId}}</div>
            <div class="info_item"><label>服务商ID：</label>{{detail.providerId}}</div>
            <div class="info_item"><label>发布时间：</label>{{detail.releaseTime}}</div>
            <div class="info_item"><label>应用名称：</label>{{detail.applicationName}}</div>
            <div class="info_item"><label>服务商名称：</label>{{detail.providerName}}</div>
            <div class="info_item">
              <label>分类标签：</label>
              {{detail.productTypeLabelName}}>{{detail.applicationTypeLabelName}}
            </div>
          </div>
          <div class="info_desc">
            <div class="label">应用简介：</div>
            <span class="intro-text">
              {{detail.introduce}}
            </span>
          </div>
        </div>
        <div class="overview_point flex flex-align-center flex-justify-around">
          <div class="overview_point_1">
            <p>评分</p>
            <span class="point">{{detail.mark}}</span>
            <p class="desc">(共{{detail.markPeopleNum}}人评分)</p>
          </div>
          <div class="overview_point_2">
            <p>总浏览人数</p>
            <div class="relative">
              <a-input
                type="number"
                v-model="viewCount"
                v-if="editable"
                @blur="handleEdit()"
                style="margin: 13px 0"/>
              <div v-else><span class="point" >{{viewCount}}</span>
              <a-icon type="edit" class="icon_edit" @click="editable = true"/></div>
            </div>
            <p class="desc">(实际{{detail.viewerCount}}人)</p>
          </div>
        </div>
      </div>
    </div>
    <div class="tab_info_wrap">
      <a-tabs defaultActiveKey="1" class="">
        <a-tab-pane tab="产品详情" key="1">
          <div v-html="detail.detailInfo"></div>
        </a-tab-pane>
        <a-tab-pane tab="系统演示" key="2" v-if="detail.presentVideoUrl">
          <video :src="detail.presentVideoUrl" controls="controls" width="842" height="507">
            您的浏览器不支持 video 标签。
          </video>
          <!-- <a :href="detail.presentVideoUrl">{{detail.presentVideoUrl}}</a> -->
        </a-tab-pane>
        <a-tab-pane tab="套餐信息" key="3">
          <!-- <h4> </h4> -->
          <div class="flex flex-justify-start p10">
            <div style="width: 800px;">
              <a-table
                row-key="id"
                :columns="columns"
                :dataSource="detail.packageList"
                bordered :pagination="false" size="middle">
                <span slot="packageInvokeMax" slot-scope="data">
                  {{data==-1?'不限':data+'次'}}
                </span>
                <span slot="packageUserMax" slot-scope="data">
                  {{data==-1?'不限':data+'人'}}
                </span>
                <span slot="packageTime" slot-scope="data">
                  {{data.packageTime===-1?
                    '无上限'
                    :data.packageTime+$getters.timeUnit(Number(detail.packageTimeUnit))}}
                </span>
              </a-table>
            </div>
          </div>

        </a-tab-pane>
        <a-tab-pane tab="售后服务" key="4">
          <div v-html="detail.afterSaleInstruction"></div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="tab_info_wrap">
      <a-tabs defaultActiveKey="1" class="">
        <a-tab-pane tab="评论详情" key="1">
          <div v-if="commentList.length>0">
            <div v-for="(item, i) in commentList" :key="i">
              <!-- {{item}} -->
              <div class="comment">
                <div class="top flex flex-justify-between">
                  <div>
                    <span class="name">{{item.userName}}</span>
                    <span class="score">评分：<a-rate v-model="item.mark" allowHalf disabled/></span>
                  </div>
                  <div class="time">{{item.reviewTime}}</div>
                </div>
                <div class="middle flex flex-justify-between flex-align-center">
                  <div class="content">{{item.review | whetherIsEmpty}}</div>
                  <a @click="handleDelete(item.reviewId)">
                    <a-icon class="delete" type="delete" /></a>
                </div>
                <div v-if="item.response" class="response">
                  <label>商家回复：</label>
                  <span>{{item.response}}</span>
                </div>
              </div>
              <div></div>
            </div>
            <div class="flex flex-justify-end p10">
               <a-pagination v-model="commentPage.current" :total="commentPage.total"
              @change="() => {
                this.commentPage.current = pagination.current;this.getComment();
              }"/>
            </div>
          </div>
          <span v-else>暂无评论</span>
        </a-tab-pane>
        <a-tab-pane tab="浏览用户" key="2">
          <!-- <div v-if="viewUserList.length>0"> -->
            <a-table
              rowKey="viewId"
              :dataSource="viewUserList"
              :columns="viewColumns"
              :pagination="viewPage"
              @change="(pagination) => {
                this.viewPage.current = pagination.current;this.getViewUserList();}">
                <span slot="viewDuration" slot-scope="data">{{transformTime(data)}}</span>
                <span slot="userType" slot-scope="data">{{$getters.userType(data)}}</span>
                <span slot="operation" slot-scope="data">
                  <span
                    @click="$router.push(`/UserManage/CustomUserDetail/${data.userId}`)"
                    class="mr10"><a>用户详情</a></span>
                </span>
            </a-table>
          <!-- </div>
          <span v-else>暂无浏览用户</span> -->
        </a-tab-pane>
        <a-tab-pane tab="试用用户" key="3">
          <!-- <div v-if="trailUserList.length>0"> -->
            <a-table
              rowKey="viewId"
              :dataSource="trailUserList"
              :columns="trailColumns"
              :pagination="trailPage"
              @change="(pagination) => {
                this.trailPage.current = pagination.current;this.getTrailUserList();}">
                <span slot="userType" slot-scope="data">{{$getters.userType(data)}}</span>
                <span slot="operation" slot-scope="data">
                  <span
                  @click="$router.push(`/UserManage/CustomUserDetail/${data.userId}`)"
                  class="mr10">
                    <a>用户详情</a>
                  </span>
                </span>
            </a-table>
          <!-- </div>
          <span v-else>暂无试用用户</span> -->
        </a-tab-pane>
        <a-tab-pane tab="付费用户" key="4">
          <!-- <div v-if="payUserList.length>0"> -->
            <a-table
              rowKey="viewId"
              :dataSource="payUserList"
              :columns="payColumns"
              :pagination="payPage"
              @change="(pagination) => {
                this.payPage.current = pagination.current;this.getPayUserList();}">
                <span slot="applicationPackage" slot-scope="data">
                  {{data.packageVersion}}  <br>
                  {{data.packageTime===-1?
                    '无上限'
                    :data.packageTime+$getters.timeUnit(Number(detail.packageTimeUnit))}}
                      / {{data.packageInvokeMax == -1?'无上限':'限用'+data.packageInvokeMax + '次'}}
                      / {{data.packageUserMax == -1?'无上限':data.packageUserMax + '人'}}
                </span>
                <span slot="mark" slot-scope="data">
                  <a-rate v-model="data" allowHalf disabled/>
                </span>
                <span slot="userType" slot-scope="data">{{$getters.userType(data)}}</span>
                <span slot="operation" slot-scope="data">
                  <span
                    @click="$router.push(`/UserManage/CustomUserDetail/${data.userId}`)"
                    class="mr10">
                    <a>用户详情</a>
                  </span>
                </span>
            </a-table>
          <!-- </div>
          <span v-else>暂无付费用户</span> -->
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>

export default {
  components: {
  },
  data() {
    const columns = [{
      title: '套餐版本',
      dataIndex: 'packageVersion',
    }, {
      title: '套餐配额',
      dataIndex: 'packageInvokeMax',
      scopedSlots: { customRender: 'packageInvokeMax' },
    }, {
      title: '套餐人数',
      dataIndex: 'packageUserMax',
      scopedSlots: { customRender: 'packageUserMax' },
    }, {
      title: '价格',
      dataIndex: 'packagePrice',
      scopedSlots: { customRender: 'packagePrice' },
    }, {
      title: '时间',
      key: 'packageTime',
      scopedSlots: { customRender: 'packageTime' },
    }];
    const viewColumns = [
      {
        title: '浏览ID',
        dataIndex: 'viewId',
        align: 'center',
      }, {
        title: '用户ID',
        dataIndex: 'userId',
        align: 'center',
      }, {
        title: '用户类型',
        dataIndex: 'userType',
        scopedSlots: { customRender: 'userType' },
        align: 'center',
      }, {
        title: '注册手机号',
        dataIndex: 'mobile',
        align: 'center',
      }, {
        title: '浏览时间',
        dataIndex: 'viewTime',
        align: 'center',
      }, {
        title: '浏览时长',
        dataIndex: 'viewDuration',
        align: 'center',
        scopedSlots: { customRender: 'viewDuration' },
      }, {
        title: '操作',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
        align: 'center',
      },
    ];
    const trailColumns = [{
      title: '用户ID',
      dataIndex: 'userId',
      align: 'center',
    }, {
      title: '用户类型',
      dataIndex: 'userType',
      scopedSlots: { customRender: 'userType' },
      align: 'center',
    }, {
      title: '注册手机号',
      dataIndex: 'mobile',
      align: 'center',
    }, {
      title: '试用时间',
      dataIndex: 'viewTime',
      align: 'center',
    }, {
      title: '登录次数',
      dataIndex: 'viewDuration',
      align: 'center',
    }, {
      title: '操作',
      key: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center',
    },
    ];
    const payColumns = [{
      title: '用户ID',
      dataIndex: 'userId',
      align: 'center',
    }, {
      title: '用户类型',
      dataIndex: 'userType',
      scopedSlots: { customRender: 'userType' },
      align: 'center',
    }, {
      title: '注册手机号',
      dataIndex: 'mobile',
      align: 'center',
    }, {
      title: '支付时间',
      dataIndex: 'payTime',
      align: 'center',
    }, {
      title: '购买套餐',
      key: 'applicationPackage',
      align: 'center',
      scopedSlots: { customRender: 'applicationPackage' },
    }, {
      title: '支付金额',
      dataIndex: 'paymentAmount',
      align: 'center',
    }, {
      title: '应用评分',
      dataIndex: 'mark',
      align: 'center',
      scopedSlots: { customRender: 'mark' },
    }, {
      title: '操作',
      key: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center',
    },
    ];
    return {
      applicationId: this.$route.params.id,
      detail: {},
      editable: false,

      commentList: [],
      commentPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      viewUserList: [],
      viewColumns,
      viewPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      trailUserList: [],
      trailColumns,
      trailPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      payUserList: [],
      payColumns,
      payPage: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      pagaination: {
        current: 1,
        pageSize: global.config.pageSize,
        total: 0,
      },
      columns,
    };
  },
  computed: {
    viewCount: {
      get() {
        return this.detail.viewerCountFake;
      },
      set(val) {
        this.detail.viewerCountFake = val;
      },
    },
  },
  mounted() {
    this.getDetail();
    this.getComment();
    this.getViewUserList();
    this.getTrailUserList();
    this.getPayUserList();
  },
  filters: {
    whetherIsEmpty(value) {
      if (!value) return '-';
      return value;
    },
  },
  methods: {
    transformTime(data) {
      /* eslint-disable */
      return data > 3600 ? `${parseInt(data / 3600)}h${parseInt((data % 3600) / 60)}min${data % 60}s`
        : data > 60 ? `${parseInt(data / 60)}min${data % 60}s`
          : `${data}s`;
    },
    getDetail() {
      this.$api.app.getAppDetail(this.applicationId).then((res) => {
        if (res.code) {
          this.detail = res.result;
          if (this.detail.packageColumns) {
            const packageColumns = JSON.parse(this.detail.packageColumns);
            packageColumns.forEach((item) => {
              if (item.value === 0) {
                this.columns.forEach((ele, index) => {
                  if (ele.title === item.name) {
                    this.columns.splice(index, 1);
                  }
                });
              }
            });
          }
        }
      });
    },
    getComment() {
      const params = {
        applicationId: this.applicationId,
        pageNum: this.commentPage.current,
        pageSize: this.commentPage.pageSize,
      };
      this.$api.app.getComment(params).then((res) => {
        if (res.code === 200) {
          this.commentList = res.result.list;
          this.commentPage.total = Number(res.result.total);
        }
      });
    },
    getViewUserList() {
      const params = {
        applicationId: this.applicationId,
        pageNum: this.viewPage.current,
        pageSize: this.viewPage.pageSize,
      };
      this.$api.app.getViewUser(params).then((res) => {
        if (res.code === 200) {
          this.viewUserList = res.result.list;
          this.viewPage.total = Number(res.result.total);
        }
      });
    },
    getTrailUserList() {
      const params = {
        applicationId: this.applicationId,
        pageNum: this.trailPage.current,
        pageSize: this.trailPage.pageSize,
      };
      this.$api.app.getTrailUserList(params).then((res) => {
        if (res.code === 200) {
          this.trailUserList = res.result.list;
          this.trailPage.total = Number(res.result.total);
        }
      });
    },
    getPayUserList() {
      const params = {
        applicationId: this.applicationId,
        status: 10,
        pageNum: this.payPage.current,
        pageSize: this.payPage.pageSize,
      };
      this.$api.app.getPayUserList(params).then((res) => {
        if (res.code === 200) {
          const { list } = res.result;
          /* eslint-disable */
          if (list && list.length) {
            list.forEach((item) => {
              item.mark = Number(item.mark);
            });
          }

          this.payUserList = list;
          this.payPage.total = Number(res.result.total);
        }
      });
    },
    handleEdit() {
      this.editable = false;
      const params = {
        applicationId: this.applicationId,
        viewerCountFake: this.viewCount,
      };
      this.$api.app.updateViewCount(params).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
        }
      });
    },
    handleDelete(id) {
      this.$api.app.commentDelete(id).then((res) => {
        if (res.code === 200) {
          this.$message.success('操作成功');
          this.getComment();
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.overview{
  width: 100%;
  // height: 320px;
  background: #fff;
  margin-bottom: 20px;
  padding:  10px 50px 30px ;
  .overview_title{
    font-size:18px;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    color:rgba(43,48,59,1);
    line-height:40px;
  }
  .overview_avatar{
    width: 280px;
    height: 200px;
  }
  .overview_detail{
    margin-left: 20px;
    .info_wrap{
      padding: 0 10px;
      .info_item{
        flex: 0 0 320px;
        font-size:14px;
        font-family:SourceHanSansCN-Regular,SourceHanSansCN;
        color: #909090;
        line-height:40px;
        label{
          font-weight:400;
          color:#2B303B;
        }
      }
    }
    .info_desc{
      padding: 0 10px;
      max-width:900px;
      .label{
        color: #2B303B;
        line-height: 30px;
      }
      .intro-text{
        color: #909090;
        line-height: 30px;
      }
    }
  }
  .overview_point{
    width: 320px;
    .relative{
      // width: 70px;
      position: relative;
      .icon_edit{
        position: absolute;
        top: 5px;
        right: 0px;
        cursor: pointer;
      }
    }
    .point{
      font-size:28px;
      font-family:SourceHanSansCN-Bold,SourceHanSansCN;
      font-weight:bold;
      line-height:58px;
    }
    .overview_point_1{
      flex: 1;
      border-right: 1px dashed #CECECE;
      padding: 0 20px;
      .point{
        color:#FF8B46;
      }
    }
    .overview_point_2{
       flex: 1;
       padding: 0 20px;
      .point{
        color:#1585FF;
      }
    }
  }
}
.tab_info_wrap{
  background: #fff;
  margin-bottom: 20px;
  padding: 20px;
}
.comment{
  padding: 10px 20px;
  .top{
    line-height: 30px;
    .name {
      display: inline-block;
      width:100px;
    }
  }
  .middle {
    height: 50px;
    .comment{
      padding: 0 10px;
    }
    .delete{
      font-size: 18px;
    }
  }
  .response {
    padding: 10px 20px;
    background: #F4F4F4;
  }
}
</style>
