import options from './options';

const data = options;
const getters = {};

function process(key, val) {
  getters[key] = (v) => {
    const temp = val.filter(item => item.value === v)[0];
    return typeof temp === 'undefined' ? '' : temp.label;
  };
}

Object.keys(data).forEach((key) => {
  process(key, data[key]);
});

export default getters;
