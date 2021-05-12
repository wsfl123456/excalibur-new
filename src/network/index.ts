import { Message } from "element-ui";
import qs from "qs";
import NetworkState, { NetAction } from "./state";
import BaseActions from "./base";
import HomeActions from "./home";
import ResourceActions from "./Resource";
import GrowthActions from "./Growth";
import { deleteAllCookies, getCookie } from "@/util";

const actions: NetAction[] = [...BaseActions, ...HomeActions, ...ResourceActions, ...GrowthActions];

const authToken = `Bearer ${getCookie("token")}`; // 不明所以的后端验证字段
const Network = new NetworkState(
  actions,
  {
    errorHandler(e) {
      const res = e.response;

      if (res && res.status) {
        switch (res.status) {
          case 404:
            Message.error("当前访问接口不存在");
            break;
          case 401:
            Message.error("当前接口无访问权限");
            break;
          case 500:
            Message.error("服务器错误");
            break;
          default:
            Message.error(`未知的服务器异常发生了，请联系管理员处理，错误状态码: ${res.status}`);
            break;
        }
      }
    },
    beforeRequest(data) {
      /* 转换成表单结构发送 */
      return qs.stringify(data);
    },
    afterResponse(res) {
      const resCode = res.data.retCode;

      /* 登录失效 */
      if (resCode === 100014) {
        // if (process.env.NODE_ENV === 'production') {
        //   const redirect = 'v2' + window.location.href.split('v2')[1];
        //   Message.error({
        //     message: '身份验证失败，即将跳转至登录界面',
        //     onClose() {
        //       window.location.href = `/?redirect=${redirect}`;
        //     },
        //   });
        // } else {
        //   Message.error('当前登录已失效');
        // }
        window.location.href = "/";

        deleteAllCookies(); // 登录失效清除Cookie
      } else if (resCode !== 0) {
        Message.error(res.data.retMsg || "未知的错误发生了，请联系管理员处理");
      }

      /* 发生错误 */
    }
  },
  {
    baseURL: "/api/", // 后端路由重定向
    headers: {
      Authorization: authToken
    },
    validateStatus(status) {
      return status === 200;
    }
  }
);

export default Network;
