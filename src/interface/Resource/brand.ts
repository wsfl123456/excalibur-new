import { AjaxResponse } from '@/interface/base';

/*
 * 我的品牌-行业列表
 * api: /customer/industry
 * */
export type ProfessionListRes = AjaxResponse<{
  data: {
    id: number,
    industryName: string,
  }[],
}>;

/*
 * 我的品牌-签约公司列表
 * api: /customer/industry
 * */
export type SignatoryCompanyRes = AjaxResponse<{
  data: {
    idAuto: number,
    customerName: string,
  }[],
}>;

/*
 * 我的品牌-品牌列表
 * api: /customer/list
 * */
export type BrandListRes = AjaxResponse<{
  data: {
    data: {
      id: number,
      picture: string,
      customerName: string,
      industryName: string,
    }[],
  }
}>;

/*
 * 我的品牌-品牌审核Leader
 * api: /customer/industry
 * */
export type BrandLeader = AjaxResponse<{
  data: {
    id: number,
    name: string,
    headPic: string,
  }[],
}>;

/*
 * 我的品牌-创建新品牌
 * api: /customer/new
 * */
export type CreateBrandRes = AjaxResponse<{}>;

/*
 * 我的品牌-品牌信息
 * api: /customer/new
 * */
export interface BrandMsg {
  id: number,
  name: string,
  img: string,
  category: string,
}

/*
 * 我的品牌-品牌数据
 * api: /customer/view
 * */
export type BrandDataRes = AjaxResponse<{
  customerName: string,
  industry: string,
  workStateName: string,
  onSignTime: string,
  createTime: string,
  picture: string,
  state: string,
  ncCompanyId: number,
  showAccountContactInfo: boolean,
  auditInfo: {
    headPic: string,
    userName: string,
    id: number,
  },
  contactsInfo: {
    addInfo: string,
    birthday: string,
    email: string,
    gender: string,
    hobby: string,
    hometown: string,
    mobile: string,
    name: string,
    phoneNo: string,
    position: string,
  }[],
  accountInfo: {
    accountId: string | number,
    accountName: string,
    bankName: string,
    dutyParagraph: string,
  }[],
  roleInfo?: {
    audit: string,
    edit: string,
  },
}>;

/*
 * 我的品牌-品牌信息
 * api: /customer/edit
 * */
export type EditBrandRes = AjaxResponse<{}>;

/*
 * 我的品牌-项目列表信息
 * api: /project/listaudit
 * */
export interface BrandProjectType {
  id: number,
  name: string,
  typeName: string,
  level: number,
  projectMemberCount: number,
  createTime: string,
  endTime: string,
  projectPeriod: number,
  leadingPmData: {
    userName: string,
  },
}

export type BrandProjectListRes = AjaxResponse<{
  'project_list': BrandProjectType[],
}>;

/*
 * 我的品牌-项目指数-利润概况图表
 * api: /dashboard/customersku
 * */
export type BrandProfitChartRes = AjaxResponse<{
  chartResult: {
    projectName: string,
    baojiadanAmount: number,
    marginAmount: number,
    marginPercent: number,
  }[],
}>;

/*
 * 我的品牌-项目指数-执行力图表
 * api: /dashboard/customertasknumber
 * */
export type BrandExecuteProjectRes = AjaxResponse<{
  chartResult: {
    projectName: string,
    taskCreateNum: number,
    taskOperationNum: number,
    taskCommenFinishCreatePercent: number,
    taskCommenFinishOperationPercent: number,
  }[],
}>;

/*
 * 我的品牌-项目指数-客户满意度图表
 * api: /dashboard/customersatisfy
 * */
export type BrandSurveyChartRes = AjaxResponse<{
  chartResult: {
    projectName: string,
    paperAvgScore: number,
  }[],
}>;

/*
 * 我的品牌-项目案例-标签
 * api: /customer/casetag
 * */
export type ProjectCaseTagRes = AjaxResponse<{
  data: {
    id: number,
    name: string,
  }[],
}>;

/*
 * 我的品牌-项目案例-状态
 * api: /customer/casetype
 * */
export type ProjectCaseStateRes = AjaxResponse<{
  data: {
    id: number,
    name: string,
  }[],
}>;

/*
 * 我的品牌-项目案例-添加案例
 * api: customer/addcase
 * */
export type AddProjectCaseRes = AjaxResponse<{}>;

/*
 * 我的品牌-项目案例-案例列表
 * api: /customer/caselist
 * */
export interface ProjectItemCaseDetail {
  caseId: number,
  creatorId: number,
  createTime: string,
  creatorName: string,
  customerId: number,
  fileAddress: string,
  filePath: string,
  picture: string,
  state: number,
  tagId: number,
  tagName: string,
  title: string,
  typeId: number,
  typeName: string,
  content: string,
}

export type ProjectCaseListRes = AjaxResponse<{
  caseList: ProjectItemCaseDetail[],
}>;

/*
 * 我的品牌-项目案例-案例详情
 * api: /customer/casedetail
 * */
export type ProjectCaseDetailRes = AjaxResponse<{
  caseInfo: ProjectItemCaseDetail,
}>;

/*
 * 我的品牌-项目案例-修改案例
 * api: /customer/editcase
 * */
export type EditCaseDetailRes = AjaxResponse<{}>;

/*
 * 我的品牌-用户权限信息
 * api: /customer/role
 * */
export type BrandUserPermissionRes = AjaxResponse<{
  add: boolean,
}>;

/*
 * 我的品牌-审核品牌
 * api: /customer/review
 * */
export type AuditBrandRes = AjaxResponse<{}>;

/*
 * 我的品牌-是否Captain权限
 * api: /user/myinfo
 * */
export type MyInfoRes = AjaxResponse<{
  isCaptain: boolean,
}>;

/*
 * 品牌-项目案例-组织架构图数据
 * api: /project/parstruct
 * */
export interface BrandTreeNode {
  title: string,
  userList?: {
    userName: string,
    headPic: string,
    id: string,
  }[],
  children: BrandTreeNode[],
}

export type BrandOrgTreeRes = AjaxResponse<{
  data: BrandTreeNode[],
}>;
