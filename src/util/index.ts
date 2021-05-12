import dateFormat from "dateformat";
import flatten from "array-flatten";
import { Message } from "element-ui";
import { ListTplItem, NavMenuItem, RegexType, UserInfo } from "@/interface";

export function getNoticeType(id: number): string {
  switch (id) {
    case 1:
      return "EXCALIBUR";
    case 2:
      return "人事部通知";
    case 3:
      return "行政部通知";
    case 4:
      return "SDC通知";
    case 5:
      return "NCC通知";
    case 6:
      return "NHU通知";
    default:
      return "未知消息";
  }
}

export function getCookie(name: string): string | void {
  const cookie = `; ${document.cookie}`;
  const field = cookie.split(`; ${name}=`);
  const v = field.pop();

  return field.length ? v && v.split(";").shift() : undefined;
}

/* 获取用户信息 */
export function getUserInfo(): UserInfo | undefined {
  const userInfo = getCookie("userInfo");
  if (!userInfo) return undefined;

  return JSON.parse(decodeURIComponent(userInfo));
}

/*
 * Echart 公用配置
 * */
export const EchartsBasicOptions = {
  title: {
    left: 40,
    top: 40,
    textStyle: {
      color: "#868E96",
      fontWeight: "normal",
      fontSize: 14
    }
  },
  tooltip: {
    show: true,
    padding: [10, 16],
    trigger: "axis",
    textStyle: {
      color: "rgba(255, 255, 255, .85)",
      fontSize: 14
    }
  },
  grid: {
    left: "100px",
    right: "10%",
    top: "90px",
    bottom: "40px"
  },
  legend: {
    left: -2,
    itemGap: 30,
    textStyle: { color: "#868E96" }
  },
  xAxis: {
    axisTick: { show: false },
    axisLine: {
      lineStyle: {
        color: "#CED4DA"
      }
    },
    axisLabel: {
      fontSize: 14,
      color: "#999999"
    }
  },
  yAxis: {
    axisTick: { show: false },
    splitLine: {
      color: "#E9ECEF",
      lineStyle: {
        type: "dotted"
      }
    },
    axisLine: {
      symbol: ["none", "arrow"],
      symbolSize: [6, 12],
      symbolOffset: [0, 10],
      lineStyle: {
        color: "#CED4DA"
      }
    }
  },
  color: [
    "#57A5F9",
    "#50E3C2",
    "#B8E986",
    "#FFE15B",
    "#FA9493",
    "#FEA39E",
    "#FFBB96",
    "#FFA941",
    "#FFD666",
    "#D2F261",
    "#B7EB8F",
    "#91D5FF",
    "#ADC5FF",
    "#86E8DE",
    "#D4ADF7",
    "#B37FEA"
  ]
};

export function noAction() {}

/*
 * 很无奈的将对象日期进行格式化，唉，菜狗子
 * */
export function formatDateInObject(obj: { [index: string]: any }) {
  if (typeof obj === "object") {
    // eslint-disable-next-line no-restricted-syntax
    for (const [k, v] of Object.entries(obj)) {
      // eslint-disable-next-line no-param-reassign
      if (v instanceof Date) obj[k] = dateFormat(v, "yyyy-mm-dd HH:MM");
    }
  }
  return obj;
}

/*
 * 菜单导航栏过滤函数
 * id === 0 时开启免过滤
 * */
export function filterMenu(menu: NavMenuItem[], menuInfo: number[]): NavMenuItem[] {
  return menu.filter(i => {
    if (menuInfo.indexOf(i.id) > -1 || i.id === 0) {
    // if (menuInfo.indexOf(i.id) > -1) {
      // eslint-disable-next-line no-param-reassign
      if (i.subMenu) i.subMenu = filterMenu(i.subMenu, menuInfo);
      return true;
    }
    return false;
  });
}

/*
 * 将小数固定小数点
 * */
export function toFixed(n: number | string, decimal?: number): string {
  return parseFloat(n as string).toFixed(decimal === undefined ? 2 : decimal);
}

/*
 * 表单数据类型正则校验
 * */
export function regexCheck(v: any, regex: RegexType): boolean | Promise<boolean> {
  if (typeof regex === "boolean") {
    /* 快捷校验检验是否为空 */
    return regex && !/^\s*$/.test(v);
  }
  if (typeof regex === "function") {
    return regex(v);
  }
  return regex.test(v);
}

/*
 * 表单数据正则校验处理，检验其是否符合正则标准，错误则弹出提示框
 * */
export function formRegexCheckHandler(data: ListTplItem[][]): boolean {
  let result = true;
  const lisItems = flatten(data);

  /* 当存在校验失败时即返回错误 */
  lisItems.find((item: any) => {
    let r = false;
    if (item.regex && !regexCheck(item.inputParams.value, item.regex.test)) {
      result = false;
      r = true;
      Message.warning(item.regex.errorMsg || `请输入${item.label}`);
    }

    return r;
  });

  return result;
}

/*
 * 将ListItem表格数据转换成{key: value}键值对对象
 * */
export function convertListToFormData(data: ListTplItem[][]) {
  const lisItems = flatten(data);
  const formData: { [index: string]: string } = {};

  lisItems.forEach((i: any) => {
    formData[i.prop] = i.inputParams.value;
  });
  return formData;
}

/*
 * 将表格数据进行适当类型转换以使其适应综合情况
 *  */
function getProperValue(v: any) {
  if (!v) return "";
  if (typeof v === "object") return v;
  return String(v);
}

/*
 * 将数据填充至List表格
 * */
export function stuffFormData(stuff: { [index: string]: any }, formData: any) {
  const lisItems = flatten(formData);
  lisItems.forEach((i: any) => {
    const listParams = i.inputParams;
    if (listParams) listParams.value = getProperValue(stuff[i.prop]);
  });
}

/* 清除全部Cookie */
export function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * 富文本编辑器配置
 */
export const editorOptions: any = {
  modules: {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"],
        ["link", "image", "video"]
      ]
    }
  },
  placeholder: "请输入内容"
};

/**
 * 字节转化
 */

export function bytesToSize(limit: number) {
  var size = "";
  if (limit < 0.1 * 1024) {
    //如果小于0.1KB转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  var sizestr = size + "";
  var len = sizestr.indexOf(".");
  var dec = sizestr.substr(len + 1, 2);
  if (dec == "00") {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}
