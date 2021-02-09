const options = {
  recommendSetting: [
    { value: '', label: '请选择' },
    { value: 'buyerRecommendSetting', label: '买家应用推荐' },
    { value: 'relatedRecommendSetting', label: '同行相关推荐' },
    { value: 0, label: '否' },
  ],
  status: [
    // 应用发布状态 0:未发布 4, "编辑中 5:发布中的临时状态 6, "待审核" 7, "预发布" 8, "待发布" 10:已发布 -1, "下架审核"
    // -5, "审核驳回" -10:主动下架  -20 被动下架 -30, "审核拒绝"
    { value: 0, label: '未发布' },
    { value: 4, label: '编辑中' },
    { value: 5, label: '发布中的临时状态' },
    { value: 6, label: '待审核' },
    { value: 7, label: '预发布' },
    { value: 8, label: '待发布' },
    { value: 10, label: '已发布' },
    { value: -1, label: '下架审核' },
    { value: -30, label: '审核拒绝' },
    { value: -10, label: '主动下架' },
    { value: -20, label: '被动下架' },
    { value: -5, label: '审核驳回' },
    { value: -40, label: '发布驳回' },
  ],
  appAuditStatus: [// 应用审核状态
    // 0:未发布 4:编辑中 5:发布中的临时状态 6:待审核 7:预发布 8:待发布 10:已发布 -1:下架审核 -5:审核驳回 -10:主动下架 -20:被动下架 -30:审核拒绝
    { value: 0, label: '未发布' },
    { value: 4, label: '编辑中' },
    { value: 5, label: '发布中的临时状态' },
    { value: 6, label: '待审核' },
    { value: 7, label: '预发布' },
    { value: 8, label: '待发布' },
    { value: 10, label: '审核通过' },
    { value: -1, label: '下架审核' },
    { value: -5, label: '审核驳回' },
    { value: -10, label: '主动下架' },
    { value: -20, label: '被动下架' },
    { value: -30, label: '审核拒绝' },
    { value: -40, label: '发布驳回' },

  ],
  appAuditStatus1: [
    { value: 6, label: '待审核' },
    { value: -5, label: '审核驳回' },
    { value: -30, label: '审核拒绝' },
    { value: 8, label: '待发布' },
    { value: 7, label: '预发布' },
    { value: 10, label: '审核通过' },
  ],
  appAuditStatus2: [
    { value: -30, label: '审核拒绝' },
    { value: -5, label: '审核驳回' },
    { value: 10, label: '审核通过' },
  ],
  appAnunledStatus: [ // 6:待审核 10:审核通过 -5：审核驳回
    { value: 6, label: '待审核' },
    { value: 10, label: '审核通过' },
    { value: -5, label: '审核驳回' },
    // { value: -30, label: '审核拒绝' },
  ],
  appAuditStatus5: [
    { value: 10, label: '审核通过' },
    { value: -5, label: '审核驳回' },
  ],
  packageColumns: [
    { label: '套餐版本', value: 'version' },
    { label: '套餐配额', value: 'limit' },
    { label: '套餐人数', value: 'count' },
    { label: '价格', value: 'price' },
    { label: '时间', value: 'time' },
  ],
  accountStatus: [
    { value: 1, label: '正常' },
    { value: -1, label: '不可用' },
  ],
  userType: [
    { value: 1, label: '个人用户' },
    { value: 2, label: '企业用户' },
  ],
  authStatus: [
    { value: 0, label: '未完成' },
    { value: 1, label: '部分完成' },
    { value: 2, label: '已完成' },
  ],
  whetherFlag: [
    { value: 1, label: '是' },
    { value: -1, label: '否' },
  ],
  orderType: [ // 订单类型     1、新购 2、续费 3、试用
    { value: 1, label: '新购' },
    { value: 2, label: '续费' },
    { value: 3, label: '试用' },
  ],
  commentSataus: [ // 评论状态    1 已评论, -1 未评论"
    { value: 1, label: '已评论' },
    { value: -1, label: '未评论' },
  ],
  payWay: [
    // 连连企业网银-ll_ebank; 连连个人网银-ll_pbank; 支付宝当面付: ali_face_pay; 支付宝网站支付: ali_web_pay; 微信-wechat;
    { value: 'ali_web_pay', label: '支付宝网站支付' },
    { value: 'ali_face_pay', label: '支付宝当面付' },
    { value: 'll_pbank', label: '连连个人网银' },
    { value: 'll_ebank', label: '连连企业网银' },
    { value: 'wechat', label: '微信' },
  ],
  invoiceStatus: [ // 发票状态:   0-未开票, 5-开票中, 10-已开票
    { value: 0, label: '未开票' },
    { value: 5, label: '开票中' },
    { value: 10, label: '已开票' },
  ],
  orderStatus: [ //  订单状态:  1-已下单(未支付), 5 支付中, 10-交易成功(已支付), -10 已取消  20-已结算
    { value: 1, label: '已下单' },
    { value: 5, label: '支付中' },
    { value: 10, label: '交易成功(已支付)' },
    { value: -10, label: '已取消' },
    { value: 20, label: '已结算' },

  ],
  flowStatus: [ // 流水状态：0   :订单创建成功，5   :扣款中，10  :扣款成功，-10 :扣款失败
    { value: 0, label: '订单创建成功' },
    { value: 5, label: '扣款中' },
    { value: 10, label: '扣款成功' },
    { value: -10, label: '扣款失败' },
    { value: -20, label: '结算失败' },

  ],
  cooperateModeOptions: [
    { value: 1, label: '免费导流' },
    { value: 2, label: '账号对接' },
  ],
  timeUnit: [
    { label: '天', value: 1 },
    { label: '月', value: 2 },
    { label: '年', value: 3 },
  ],
  activityStatus: [
    { value: 0, label: '未开始' },
    { value: 1, label: '进行中' },
    { value: -1, label: '已结束' },
  ],
  bonusType: [
    { value: 1, label: '红包' },
    { value: 2, label: '代金券' },
  ],
  targetUser: [
    { value: 1, label: '所有用户' },
    { value: 2, label: '新注册用户' },
    { value: 3, label: '首单用户' },
  ],
  couponStatus: [ // -1 已过期 0 未使用 1 已冻结 10 已使用
    { value: -1, label: '已过期' },
    { value: 0, label: '未使用' },
    { value: 1, label: '已冻结' },
    { value: 10, label: '已使用' },
  ],
  advertType: [ // 1 弹窗 2 主屏banner 3 首页横栏
    { value: 1, label: '弹窗广告' },
    { value: 2, label: '主屏banner' },
    { value: 3, label: '首页横栏' },
  ],
  providerType: [
    { value: 1, label: '企业开发者' },
    { value: 2, label: '个人开发者' },
  ],
  providerAuthStatus: [ // 0：未认证 1：待审核 2:已认证 -1:审核驳回 -2：审核拒绝
    { value: 0, label: '未认证' },
    { value: 1, label: '待审核' },
    { value: -1, label: '审核驳回' },
    { value: -2, label: '审核拒绝' },
    { value: 2, label: '已认证' },
  ],
  withdrawStatus: [ // 提现状态 0:待审核; 5:结算中; 10:已结算; -10:审核驳回
    { value: 0, label: '待审核' },
    { value: 5, label: '结算中' },
    { value: 10, label: '已结算' },
    { value: -10, label: '审核驳回' },
  ],
  withdrawStatus1: [
    { value: 1, label: '审核通过' },
    { value: -1, label: '审核驳回' },
  ],
};
export default options;
