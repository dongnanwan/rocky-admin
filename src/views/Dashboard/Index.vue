<template>
  <div class="">
    <div class="datas flex flex-align-center">
      <div class="today flex-child-average">
        <div class="flex flex-align-center data-title">
          <img class="icon-today-data" src="../../assets/img/shop.png" alt="">
          <span class="text">今日商城数据</span>
        </div>
        <div class="data-content white-bg">
          <div class="flex data-1">
            <div class="flex-child-average flex flex-col flex-align-center data-content-item"
            v-for="(item, i) in personalDataToday" :key="i">
              <span class="name">{{item.name}}</span>
              <div class="value type-1">
                <ICountUp
                  :startVal="0"
                  :endVal="item.value?item.value:0"
                  :duration="1"
                  :options="options"/>
              </div>
            </div>
          </div>
        </div>
        <div class="data-content white-bg">
          <div class="flex data-2">
            <div class="flex-child-average flex flex-col flex-align-center data-content-item"
            v-for="(item, i) in companyDataToday" :key="i">
              <span class="name">{{item.name}}</span>
              <div class="value type-2">
                <ICountUp
                  :startVal="0"
                  :endVal="item.value?item.value:0"
                  :duration="1" :options="options"/>
              </div>
            </div>
          </div>
        </div>
        <div v-if="false">
          <div class="flex flex-align-center data-title">
            <img class="icon-today-data" src="../../assets/img/pingtai.png" alt="">
            <span class="text">今日开放平台数据</span>
          </div>
          <div class="platform-today flex">
            <div class="flex-child-average flex flex-col flex-align-start data-content-item"
            v-for="(item, i) in platformToday" :key="i">
              <span class="name">{{item.name}}</span>
              <div class="value">
                <ICountUp
                  :startVal="0"
                  :endVal="item.value?item.value:0"
                  :duration="1" :options="options"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="history flex-child-average">
        <div class="flex flex-align-center data-title">
          <img class="icon-today-data" src="../../assets/img/data.png" alt="">
          <span class="text">商城累计数据（截止昨日）</span>
        </div>
        <div class="data-content white-bg">
          <div class="flex data-3">
            <div class="flex-child-average flex flex-col flex-align-center data-content-item"
            v-for="(item, i) in personalDataHistory" :key="i">
              <span class="name">{{item.name}}</span>
              <div v-if="i===2">
              <div class="value type-3">
                 {{item.value}}%
                </div>
              </div>
              <div v-else>
                <div class="value type-3">
                  <ICountUp
                    :startVal="0"
                    :endVal="item.value?item.value:0" :duration="1" :options="options"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="data-content white-bg">
          <div class="flex data-4">
            <div class="flex-child-average flex flex-col flex-align-center data-content-item"
            v-for="(item, i) in companyDataHistory" :key="i">
              <span class="name">{{item.name}}</span>
              <div v-if="i===2">
                <div class="value type-4">
                  {{item.value}}%
                </div>
              </div>
              <div v-else>
                <div class="value type-4">
                  <ICountUp
                    :startVal="0"
                    :endVal="item.value?item.value:0" :duration="1" :options="options"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="false">
          <div class="flex flex-align-center data-title">
            <img class="icon-today-data" src="../../assets/img/data.png" alt="">
            <span class="text">开放平台累计数据（截止昨日）</span>
          </div>
          <div class="platform-history flex">
            <div class="flex-child-average flex flex-col flex-align-start data-content-item"
            v-for="(item, i) in platformHistory" :key="i">
              <span class="name">{{item.name}}</span>
              <div class="value">
                <ICountUp
                  :startVal="0" :endVal="item.value?item.value:0" :duration="1" :options="options"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-wrap line white-bg">
      <div class="line-title flex flex-justify-between">
        <div class="flex flex-align-center data-title">
          <img class="mr10" src="../../assets/img/qushi.png" alt="">
          <span class="text">商城用户增长趋势</span>
        </div>
        <div>
          <a-radio-group defaultValue="1" @change="handleTypeChange">
            <a-radio-button value="1">注册用户数</a-radio-button>
            <a-radio-button value="2">试用用户数</a-radio-button>
            <a-radio-button value="3">付费用户数</a-radio-button>
            <a-radio-button value="4">续费用户数</a-radio-button>
          </a-radio-group>
        </div>
        <div class="flex flex-align-center">
          <a-range-picker
            :defaultValue="timeDefault"
            @change="handleTrendTimeChange"
          />
          <!-- <a-button type="primary" @click="searchData()">查询</a-button> -->
        </div>
      </div>
      <div class="line-content full-height flex">
        <div id="mountNode"></div>
        <!-- <div class="flex flex-justify-center flex-align-center" v-else>
          <span class="none">暂无数据</span>
        </div> -->
      </div>
    </div>
    <div class="chart-wrap orthers white-bg">
      <div class="line-title flex flex-justify-between">
        <div class="flex flex-align-center data-title">
          <img class="mr10" src="../../assets/img/yonghuhx.png" alt="">
          <span class="text">用户画像数据</span>
        </div>
        <div class="flex flex-align-center">
          <a-range-picker
            :defaultValue="timeDefault"
            @change="handleTimeTwoChange"
          />
          <!-- <a-button type="primary" @click="searchData()">查询</a-button> -->
        </div>
      </div>
      <div class="chart-content flex flex-wrap white-bg">
        <div class="chart-item flex flex-col flex-child-average">
          <div class="flex pl10 flex-align-center m10">
            <div class="dot dot-yellow"></div>
            <p>企业用户行业分布</p>
          </div>
          <div id="industry" class="flex-child-average pt10"></div>
          <!-- <div class="flex full-height flex-justify-center flex-align-center" v-else>
            <span class="none">暂无数据</span>
          </div>   -->
        </div>
        <div class="chart-item flex flex-col flex-child-average ">
          <div class="flex pl10 flex-align-center m10">
            <div class="dot" style="background: #8A4CFF"></div>
            <p>用户转化漏斗</p>
          </div>
            <div id="transform" class="flex-child-average pt10" ></div>
            <p
              class="text-center"
              v-if="duration">应用平均浏览时长: <span class="blue">{{duration}}S</span></p>

          <!-- <div class="flex full-height flex-justify-center flex-align-center" v-else>
            <span class="none">暂无数据</span>
          </div>  -->
        </div>
        <div class="chart-item flex flex-col flex-child-average ">
          <div class="flex pl10 flex-align-center m10">
            <div class="dot" style="background: #00C387"></div>
            <p>用户访问时段</p>
          </div>
          <div id="viewTime" class="flex-child-average pt10"></div>
          <!-- <div class="flex full-height flex-justify-center flex-align-center" v-else>
            <span class="none">暂无数据</span>
          </div>  -->
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import moment from 'moment';
import ICountUp from 'vue-countup-v2';
import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';


export default {
  components: {
    ICountUp,
  },
  data() {
    return {
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
      },
      options1: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        suffix: '%',
      },
      personalDataToday: [],
      companyDataToday: [],
      personalDataHistory: [],
      companyDataHistory: [],
      platformToday: [],
      platformHistory: [],
      dataSource: [],
      startTime: moment().subtract('days', 6).format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
      conversion: [],
      industryData: [],
      timeSlotData: [],
      duration: '',
    };
  },
  computed: {
    timeDefault() {
      return [moment(moment().subtract('days', 6).format('YYYY-MM-DD'), 'YYYY-MM-DD'), moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')];
    },
    timeRange() {
      return { 'One Week': [moment().subtract('days', 6), moment()], 'This Month': [moment(), moment().endOf('month')] };
    },
    chart() {
      // if(this.dataSource.length>0){
      return new G2.Chart({
        container: 'mountNode',
        // width: '80%',
        forceFit: true,
        height: 400,
        padding: [20, 120, 95, 80], // 上，右，下，左
      });
      // }
    },
    industryChart() {
      // if(this.industryData.length>0){
      return new G2.Chart({
        container: 'industry',
        width: 350,
        height: 300,
      });
      // }
    },
    transformChart() {
      // if(this.conversion.length > 0){
      return new G2.Chart({
        container: 'transform',
        width: 480,
        height: 200,
        padding: [20, 80, 0, 100], // 上，右，下，左
      });
      // }
    },
    viewTimeChart() {
      // if(this.timeSlotData.length> 0){
      return new G2.Chart({
        container: 'viewTime',
        width: 400,
        height: 300,
      });
      // }
    },
  },
  mounted() {
    this.todayData();
    this.historyData();
    this.getTrendData(this.startTime, this.endTime, (result) => {
      this.dataSource = result;// 获取增长趋势数据
      // if(this.dataSource.length > 0){
      this.initLineChart(this.chart); // 初始化增长趋势图表格
      // }
    });
    this.getPortrailData(this.startTime, this.endTime, (result) => {
      this.conversion = result.conversion;
      this.duration = result.duration;
      // if(this.conversion.length>0){
      this.initTransformChart(this.transformChart);
      // }
      this.industryData = result.industry;
      this.timeSlotData = result.timeSlot;
      // if(this.industryData.length> 0) {
      this.initIndustryChart(this.industryChart);
      // }
      // if(this.timeSlotData.length> 0) {
      this.initViewTimeChart(this.viewTimeChart); // 用户访问时段统计
      // }
    });
  },
  methods: {
    historyData() {
      this.$api.dashboard.historyData().then((res) => {
        if (res) {
          const { result } = res;
          if (result.length === 0) {
            this.personalDataHistory = [
              { name: '试用个人用户', value: 0 },
              { name: '付费个人用户', value: 0 },
              { name: '个人续费率', value: 0 },
              { name: '累计付费订单', value: 0 },
            ];
            this.companyDataHistory = [
              { name: '试用企业用户', value: 0 },
              { name: '付费企业用户', value: 0 },
              { name: '企业续费率', value: 0 },
              { name: '累计付费订单', value: 0 },
            ];
          } else {
            result.forEach((item) => {
              if (item.type === 1) {
                this.personalDataHistory = [
                  { name: '试用个人用户', value: item.trialNumber },
                  { name: '付费个人用户', value: item.payNumber },
                  { name: '个人续费率', value: Number(Number(item.renew * 100).toFixed(2)) },
                  { name: '累计付费订单', value: item.paytotal },
                ];
              } else if (item.type === 2) {
                this.companyDataHistory = [
                  { name: '试用企业用户', value: item.trialNumber },
                  { name: '付费企业用户', value: item.payNumber },
                  { name: '企业续费率', value: Number(Number(item.renew * 100).toFixed(2)) },
                  { name: '累计付费订单', value: item.paytotal },
                ];
              }
            });
          }
        }
      });
    },
    todayData() {
      this.$api.dashboard.todayData().then((res) => {
        if (res) {
          const { result } = res;
          if (result) {
            result.forEach((item) => {
              if (item.type === 1) {
                this.personalDataToday = [
                  { name: '注册个人用户', value: item.enrolment },
                  { name: '试用个人用户', value: item.trialNumber },
                  { name: '付费个人用户', value: item.payNumber },
                  { name: '续费个人用户', value: item.renewNumber },
                ];
              } else if (item.type === 2) {
                this.companyDataToday = [
                  { name: '注册企业用户', value: item.enrolment },
                  { name: '试用企业用户', value: item.trialNumber },
                  { name: '付费企业用户', value: item.payNumber },
                  { name: '续费企业用户', value: item.renewNumber },
                ];
              }
            });
          }
        }
      });
    },
    getTrendData(startTime, endTime, cb) {
      const params = {
        beginTime: startTime,
        endTime,
      };
      this.$api.dashboard.trend(params).then((res) => {
        if (res.code === 200) {
          if ((JSON.stringify(res.result) !== '{}')) {
            cb(res.result);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getPortrailData(startTime, endTime, cb) {
      const params = {
        beginTime: startTime,
        endTime,
      };
      this.$api.dashboard.portrait(params).then((res) => {
        if (res.code === 200) {
          cb(res.result);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleTrendTimeChange(val) {
      const startTime = this.$utils.dateRangeFormat(val, 'begin');
      const endTime = this.$utils.dateRangeFormat(val, 'end');
      this.getTrendData(startTime, endTime, (result) => {
        this.dataSource = result;
        this.initLineChart(this.chart);
      });
    },
    handleTimeTwoChange(val) {
      const startTime = this.$utils.dateRangeFormat(val, 'begin');
      const endTime = this.$utils.dateRangeFormat(val, 'end');
      this.getPortrailData(startTime, endTime, (result) => {
        this.conversion = result.conversion;
        this.duration = result.duration;
        this.industryData = result.industry;
        this.timeSlotData = result.timeSlot;
        this.initTransformChart(this.transformChart);
        this.initIndustryChart(this.industryChart);
        this.initViewTimeChart(this.viewTimeChart);
      });
    },

    initLineChart(chart) {
      const data = this.dataSource.enrolment;
      const ds = new DataSet();

      const dv = ds.createView();
      const chartData = dv.source(data);
      chartData.transform({
        type: 'fold',
        fields: ['personal', 'enterprise'], // 展开字段集
        key: 'type', // key字段
        value: 'count', // value字段
      });

      chart.source(chartData);
      chart.tooltip({
        crosshairs: {
          type: 'line',
        },
      });
      chart.axis('count', {
        label: {
          formatter: function formatter(val) {
            return `${val}`;
          },
        },
      });
      chart.line().position('reportDay*count').color('type').shape('smooth');
      chart.point().position('reportDay*count').color('type').size(4)
        .shape('circle')
        .style({
          stroke: '#fff',
          lineWidth: 1,
        });
      chart.legend('type', {
        position: 'right-top',
      });
      chart.render();
    },
    changeLineData(val) {
      let data;

      switch (Number(val)) {
        case 1:
          data = this.dataSource.enrolment;

          break;
        case 2:
          data = this.dataSource.trial;

          break;
        case 3:
          data = this.dataSource.pay;
          break;
        case 4:
          data = this.dataSource.renew;
          break;
        default:
          break;
      }
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      dv.transform({
        type: 'fold',
        fields: ['personal', 'enterprise'],
        key: 'type',
        value: 'count',
      });
      this.chart.changeData(dv);
    },
    handleTypeChange(e) {
      const { value } = e.target;
      this.changeLineData(value);
    },
    searchData() {

    },
    initIndustryChart(chart) {
      const data = this.industryData;
      chart.source(data);
      // chart.scale('number', {
      //   tickInterval: 1000,
      // });
      chart.interval().position('industry*number').color('industry', ['#1790FF', '#1790FF', '#37B0D6', '#48C0C1', '#67D3B2', '#58D0AD']);
      // chart.interval().position('name*vote')
      chart.render();
    },
    initTransformChart(chart) { // 转化比例
      const dataSet = DataSet;
      const { DataView } = dataSet;
      /* eslint-disable */
      this.conversion.forEach((item) => {
        if (item.action === 'view') {
          item.action = '浏览';
        } else if (item.action === 'trial') {
          item.action = '试用';
        } else if (item.action === 'pay') {
          item.action = '购买';
        }
      });
      let data = this.conversion;
      /* eslint-disable */
      let total = 0;
      this.conversion.reduce((total, item, index, arr) => {
        
        switch(index){
          case 1:
            item.percent = Number(item.pv)/Number(arr[index+1].pv);
            break;
          case 2:
            item.percent = Number(item.pv)/Number(arr[index-1].pv);
            break;
          default:
            break;
        }
        return total + item.pv;
      });
      const dv = new DataView().source(data);
      // dv.transform({
      //   type: 'map',
      //   callback: function callback(row, index) {
      //     row.percent = row.pv / total;
      //     return row;
      //   },
      // });
      data = dv.rows;
      // chart.source(data, {
      //   percent: {
      //     nice: false,
      //   },
      // });
      chart.axis(false);
      /* eslint-disable */
      chart.tooltip({
        showTitle: false,
        itemTpl: '<li data-index={index} style="margin-bottom:4px;">' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '{name}<br/>' + '<span style="padding-left: 16px">浏览人数：{pv}</span><br/>' + '<span style="padding-left: 16px">占比：{percent}</span><br/>' + '</li>',
      });
      chart.coord('rect').transpose().scale(1, -1);
      /* eslint-disable */
      chart.intervalSymmetric().position('action*percent').shape('funnel').color('action', ['#3A72FF', '#5BABFF', '#6ECDFF', '#69C0FF', '#BAE7FF'])
        .label('action*percent', (action, percent) => `${action}转化率 ${parseInt(percent * 100)}%`, {
          offset: 35,
          labelLine: {
            lineWidth: 1,
            stroke: 'rgba(0, 0, 0, 0.15)',
          },
        })
        .tooltip('action*pv*percent', (action, pv, percent) => ({
          name: action,
          percent: `${parseInt(percent * 100)}%`,
          pv,
        }));
      data.forEach((obj) => {
        // 中间标签文本
        chart.guide().text({
          top: true,
          position: {
            action: obj.action,
            percent: 'median',
          },
          // content: `${parseInt(obj.percent * 100)}%`, // 显示的文本内容
          content: `${obj.action}`,
          style: {
            fill: '#fff',
            fontSize: '12',
            textAlign: 'center',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)',
          },
        });
      });
      chart.render();
    },
    initViewTimeChart(chart) {
      this.timeSlotData.forEach((item) => {
        /* eslint-disable */
        switch(item.action){
          case 'morning':
            item.action = '8~11点';
            break;
          case 'noon':
            item.action = '12~14点';
            break;
          case 'afternoon':
            item.action = '15~18点';
            break;
          case 'night':
            item.action = '19~23点';
            break;
          case 'midnight':
            item.action = '0~7点';
            break;
        }
      })
      const data = this.timeSlotData;
      chart.source(data);
      chart.interval().position('action*pv').color('action', ['#1790FF', '#1790FF', '#37B0D6', '#48C0C1', '#67D3B2', '#58D0AD']);
      chart.render();
    },
  },
};
</script>
<style lang="scss" scoped>
  .datas{
    .today{
      margin-right: 15px;
    }
    .today, .history{
      .data-title{
        padding-top: 10px;
      }
      .icon-today-data{
        width: 22px;
        height: 22px;
        object-fit: cover;
        margin-right: 15px;
      }
      .text{
        font-size:18px;
        font-weight:400;
        color:rgba(43,48,59,1);
        line-height:27px;
      }
      .data-content {
        background: #fff;
        border-radius:6px;
        margin: 20px 0;
        // background: url('../../assets/img/qiye 2.png') no-repeat;
        // background-position-x: 0%;
        // background-position-y: 20px;
        // .data-content-item:first-child
        // {

        // }
        .data-content-item:last-child
        {
          border: none;
        }
        .data-content-item{
          height: 54px;
          margin:  20px 0 ;
          box-sizing: border-box;
          border-right: 1px dashed #ddd;
          .name{
            font-size:14px;
            color:#999;
            line-height: 27px;
          }
          .value{
            font-size:18px;
            font-weight:500;
            // color:rgba(43,48,59,1);
            line-height:27px;
          }
        }
      }
      .platform-today, .platform-history{
        margin: 10px 0;
        .data-content-item{
          // width: 200px;
          border-radius: 5px;
          height: 80px;
          margin: 0 5px;
          color: #fff;
          padding: 16px 15px;
          background-size: cover;
        }
        .name{
          font-size:14px;
          line-height: 27px;
        }
        .value{
          font-size:18px;
          font-weight:500;
          line-height:27px;
        }
      }
      .platform-today{
        .data-content-item:first-child{
          margin-left: 0;
          background-image: url('../../assets/img/geren_bg.png');
        }
        .data-content-item:nth-child(2){
          background-image: url('../../assets/img/qiye_bg.png');
        }
        .data-content-item:nth-child(3){
          background-image: url('../../assets/img/tijiao_bg.png');
        }
        .data-content-item:nth-child(4){
          margin-right: 0;
          background-image: url('../../assets/img/xiajia_bg.png');
        }
      }
      .platform-history{
        .data-content-item:first-child{
          margin-left: 0;
          background-image: url('../../assets/img/fabu_bg.png');
        }
        .data-content-item:nth-child(2){
          background-image: url('../../assets/img/fugai_bg.png');
        }
        .data-content-item:nth-child(3){
          background-image: url('../../assets/img/tijiao_bg.png');
        }
        .data-content-item:nth-child(4){
          margin-right: 0;
          background-image: url('../../assets/img/xiajia_bg.png');
        }
      }
    }
  }
  .chart-wrap {
    margin: 20px 0;
    padding: 20px;
    .line-title{
      padding: 5px 20px;
      .text{
        font-size:18px;
        font-weight:400;
        color:rgba(43,48,59,1);
        line-height:27px;
      }
    }
  }
  .line{
    height: 480px;
    .line-content {
      div:nth-child(1){
        padding: 15px;
        flex: 6;
        box-sizing: border-box;
      }
      div:nth-child(2){
        flex: 1;
      }
    }

  }
  .chart-content{
    padding: 20px 0;
    // height: 350px;
    >div{
      border-right: 1px dashed #ddd;
    }
    div:last-child{
      border: none
    }
    .chart-item{
      display: flex;
      flex-direction: column;
      min-height: 300px;
    }
  }
  .dot{
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin-right: 5px;
  }
  .dot-yellow{
    background-color: #FFBA4C;
  }
  .none{
    color: #ddd;
    font-size: 30px;
  }
  .full-height {
    height: 100%;
  }
  .type-1{
    color: #00B291;
  }
  .type-2{
    color: #22B700
  }
  .type-3{
    color: #FF9124;
  }
  .type-4{
    color: #FFBC35;
  }
  .data-1 {
    background: url('../../assets/img/geren备份 5.png') no-repeat;
    background-position-x: 0%;
    background-position-y: 100%;
  }
  .data-2 {
    background: url('../../assets/img/qiye备份.png') no-repeat;
    background-position-x: 0%;
    background-position-y: 100%;
  }
  .data-3 {
    background: url('../../assets/img/geren备份 6.png') no-repeat;
    background-position-x: 0%;
    background-position-y: 100%;
  }
  .data-4 {
    background: url('../../assets/img/qiye 2.png') no-repeat;
    background-position-x: 0%;
    background-position-y: 100%;
  }
</style>
<style>
  /* label.ant-radio-button-wrapper {
    border: none !important;
  }
  .ant-radio-button-wrapper:not(:first-child)::before{
    background-color: white!important;
  }
  .ant-radio-button-wrapper-checked::before{
     background-color: white!important;
  } */
</style>
