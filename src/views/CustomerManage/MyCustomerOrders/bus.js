import Vue from 'vue';

export default new Vue();

class Bus {
  constructor() {
    this.list = {};
  }

  $on(name, fn) {
    this.list[name] = this.list[name] || [];
    this.list[name].push(fn);
  }

  $emit(name, data) {
    this.list[name].forEach((fn) => {
      fn(data);
    });
  }

  $off(name) {
    if (this.list[name]) {
      delete this.list[name];
    }
  }
}
