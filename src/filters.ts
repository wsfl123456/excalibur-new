import Vue from 'vue';
import dateFormat from 'dateformat';

/* 注册全局Filter */
const filers: {[index: string]: (...args: any) => any} = {
  emptyTip(v: string, tip: string) {
    return v || tip || '--';
  },
  /* 品牌审核状态名称 */
  getBrandAuditTypeName: (() => {
    const auditStates: {[index: number]: string} = { 1: '待审核', 2: '审核通过', 3: '审核不通过' };
    return (s: number) => auditStates[s];
  })(),
  /* 获取性别 */
  getSex(v: string) {
    const sex: {[index: string]: string} = { 1: '男', 2: '女' };
    return sex[v];
  },
  /* 时间格式化 */
  dateFormat(date: string, format: string) {
    return date ? dateFormat(date.substring(0, 10), format || 'yyyy-mm-dd') : '--';
  },
};

Object.keys(filers).forEach(prop => Vue.filter(prop, filers[prop]));
