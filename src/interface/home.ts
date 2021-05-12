import { RawLocation } from 'vue-router';
import { AjaxResponse } from '@/interface/base';

/*
 * 顶部公用导航菜单数据
 * api: /user/usermenu
 * */
export type MenuInfo = AjaxResponse<{menuInfo: number[]}>

/**
 * 首页系统公告弹出框数据
 * api: pdeclare/list
 */

export type SysNoticeRes = AjaxResponse<{
   data: {
     title: string,
     content: string,
     id: number,
     typeId: boolean
   }[]
 }>

/*
 * 首页今日日程数据
 * api: /meeting/all
 * */
export type ScheduleRes = AjaxResponse<{
  data: {
    name: string,
    'time_range': string,
  }[],
}>;

/*
 * 系统公告数据
 * api: /pdeclare/list
 * */
export type NoticeList = AjaxResponse<{
  data: {
    id: number,
    typeId: number,
    title: string,
    isNew: boolean,
    lastModifyTime: string,
  }[]
}>

/*
 * 知识库Tips数据
 * api: /tips/list
 * */
export type KnowledgeList = AjaxResponse<{
  data: {
    id: number,
    title: string,
    creatorName: string,
    lastModifyTime: string,
    productId: number,
    typeId?: number,
    dataType: string,
  }[]
}>;

/*
 * 首页我的工作数据
 * api: /task/worknumber
 * */
interface WorkDataItem {
  stateNameMe: string,
}
export interface WorkData {
  workNumber: number,
  workList: WorkDataItem[],
}
export type MyWorkDataType = AjaxResponse<WorkData>;

/*
 * 首页我的工作 个人Review
 * api: /dashboard/userexecmonthtasknumberRe
 * */
export type MyWorkReview = {
  taskOperationArrByCustomerByProject: {
    customerName: string,
    customerId: number,
    children: {
      projectId: number,
      projectName: string,
      children: {
        taskName: string,
        taskId: number,
      }[],
    }[],
  }[],
  taskCreateArrByCustomerByProject: {
    customerName: string,
    customerId: number,
    children: {
      projectId: number,
      projectName: string,
      children: {
        taskName: string,
        taskId: number,
      }[],
    }[],
  }[],
  taskCustomerArr: {
    customerName: string,
    customerId: number,
  }[], // 服务品牌列表
  taskCustomerNum: number, // 服务品牌数量
  taskProjectNum: number, // 执行项目数量
  taskProjectArr: {
    customerName: string,
    customerId: number,
    children: {
      projectId: number,
      projectName: number,
    }[],
  }[], // 执行项目列表
  taskCreateNum: number, // 发布任务总数
  taskOperationNum: number, // 接收任务总数
};
export type MyWorkReviewType = AjaxResponse<{
  dataInfo: MyWorkReview
}>;

/*
 * 菜单导航栏-菜单数据类型
 * */
export interface NavMenuItem {
  id: number,
  title: string,
  url?: RawLocation,
  subMenu?: NavMenuItem[],
}

/*
 * 项目概况-项目执行图表接口
 * api: /dashboard/userexecmonthprojectnumberallcustomer
 * */
export type ProjectExecuteChartRes = AjaxResponse<{
  chartResult: {
    monthName: string,
    projectNumEachCustomer: {
      customerName: string,
      customerId: number,
      projectNum: number,
    }[],
  }[],
  customerList: {
    customerId: number,
    customerName: string,
  }[],
}>;


/*
 * 项目概况-项目创收图表接口
 * api: /dashboard/userincomeproject
 * */
export type ProfitChartRes = AjaxResponse<{
  chartResult: {
    customerName: string,
    projectList: {
      income: string | number,
      projectId: number,
      projectName: string,
    }[],
  }[],
  chartResultProject: {
    projectId: number,
    projectName: string,
  }[],
}>;

/*
 * 任务概况-任务耗时图表接口
 * api: /dashboard/userincomeproject
 * */
export type TaskTimingChartRes = AjaxResponse<{
  chartResult: {
    monthName: string,
    operationAvgDurTime: number,
    taskAvgVersionNum: number,
  }[],
}>;

/*
 * 任务概况-任务数量图表接口-按月份显示
 * api: /dashboard/userexecmonthdurtime
 * */
export type TaskCountChartRes = AjaxResponse<{
  chartResult: {
    monthName: string,
    taskCreateNum: number,
    taskOperationNum: number,
    taskCommenFinishCreatePercent: number,
    taskCommenFinishOperationPercent: number,
  }[],
}>;

/*
 * 任务概况-任务数量图表接口-按客户显示
 * api: /dashboard/userexeccustomertasknumber
 * */
export type TaskCountChartByClientRes = AjaxResponse<{
  chartResult: {
    customerName: string,
    taskCreateNum: number,
    taskOperationNum: number,
    taskCommenFinishCreatePercent: number,
    taskCommenFinishOperationPercent: number,
  }[],
}>;

/*
 * 个人工作Review 个人创收接口
 * api: /dashboard/userincomeproject
 * */
export interface UserIncomeMsg {
  customerName: string,
  customerId: number,
  projectList: {
    projectName: string,
    customerName: string,
    income: string,
    projectId: number,
  }[],
}
export type UserIncomeRes = AjaxResponse<{
  dataInfo: {
    incomeTotalValue: string,
  },
  customerProjectClean: UserIncomeMsg[],
}>;

/*
 * 全局消息提示列表
 * api: /notice/list
 * */
export interface UserNoticeMsg {
  id: number;
  state: number,
  name: string,
  type: number,
  taskId: number,
  customerId: number,
  userInfo: {
    userName: string,
    name: string,
  },
  content: {
    taskId: number,
    productId: number,
    projectId: number,
    name: string,
    assetNo: string,
    type: string,
    time: string,
    customerId: number,
    supplierId: number,
  },
}
export type UserNoticeListRes = AjaxResponse<{
  data: UserNoticeMsg[],
}>;
export type UserNoticeNumRes = AjaxResponse<{
  number: string
}>;
