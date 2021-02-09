const rules = {
  /* common */
  required: [{ required: true }],
  whitespace: [{ required: true, whitespace: true }],
  num: [{ required: true, pattern: /^[1-9]\d*$/ }],
  float: [{ required: true, pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/ }],
  password: [{ required: true, min: 6 }],
};

const message = {
  requiredSpecial: '必填',
  requiredInput: '格式有误或未输入',
  requiredSeletor: '请选择',
  requiredzPassword: '密码不足6位',
};

function execute(rule, msg) { // 格式化规则
  const ruleTemp = JSON.parse(JSON.stringify(rule));
  if (typeof rule[0].pattern !== 'undefined') {
    ruleTemp[0].pattern = rule[0].pattern;
  }
  ruleTemp[0].message = msg;
  // ruleTemp[0].validator = validator
  return ruleTemp;
}

export default {
  rules,
  message,
  execute,
};
