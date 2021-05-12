export interface AjaxResponse<T> {
  retCode: number,
  retData: T,
  retMsg: string,
}

/*
 * 表格列表模板-相关数据结构
 * */
export interface ListInput {
  value: string,
  disabled?: boolean,
  placeholder?: string,
}

export interface ListSelect {
  value?: string,
  disabled?: boolean,
  multiple?: boolean,
  placeholder?: string,
  options?: {
    value?: string,
    label?: string,
    disabled?: boolean,
  }[],
}

export interface ListRadio {
  value?: string,
  disabled?: boolean,
  radios: {
    label: string,
    name: string,
    disabled?: boolean,
  }[]
}

export interface ListSwitch {
  value?: string,
  activeColor?: string,
  inactiveColor?: string,
  activeValue?: string,
  inactiveValue?: string,
  disabled?: boolean,
  activeText?: string,
  inactiveText?: string,
}

export interface ListUpload {
  multiple?: boolean,
  value?: any[] | string,
  limit?: number,
  tipText?: string,
  action: string, // action 必须要填
  uploadText?: string,
  onSuccess?: (...args: any) => void,
  handleExceed?: (...args: any) => void,
  handlePreview?: (...args: any) => void,
  handleRemove?: (...args: any) => void,
  beforeRemove?: (...args: any) => void,
  beforeUpload?: (...args: any) => void,
}

export interface ListDate {
  type?: string,
  value?: string | Date,
  pickOptions?: any,
  disabled?: boolean,
  editable?: boolean,
  clearable?: boolean,
}

export interface ListMember {
  value: MemberMsg[],
  readonly?: boolean,
  multiple?: boolean,
  tooltip?: string,
}

export interface RegexTestFn {
  (v: string | number) : boolean;
}

export interface RegexTestPromise {
  (v: string | number) : Promise<boolean>;
}

export type RegexType = RegExp | RegexTestFn | RegexTestPromise | boolean; // true类型为简写, 表示不能为空

export interface Regex {
  test: RegexType,
  errorMsg?: string,
}

export type ListItemType = ListInput | ListSelect | ListRadio | ListSwitch | ListUpload | ListDate | ListMember;

export interface ListTplItem {
  inputClass?: string;
  required?: boolean, // 是否要求必填
  label?: string,
  prop?: string,
  inputType?: string,
  className?: string, // className属性仅对每一行的第一个ListTplItem生效
  regex?: Regex,
  inputParams?: ListItemType,
}

export interface MonthDateRange {
  to: Date,
  from: Date
}

/*
 * 公司成员数据
 * api: /task/taskuser
 * */
export interface MemberMsg {
  id: number,
  name: string,
  userName: string,
  headPic: string,
  positionName?: string,
}

/*
 * PR路由数据
 * api: /task/showcasetool
 * */
export type PrRouteRes = AjaxResponse<{
  productTool: {
    toolkitId: number,
    toolkitName: string,
  }[],
}>;

export type MemberMsgRes = AjaxResponse<{
  data: MemberMsg[]
}>;

export interface UserInfo {
  headPic: string,
  id: number,
  mobile: string,
  teamName: string,
  userName: string,

}

export interface WorkItem {
  customerId: number,
  taskId: number,
  projectId: number,
  workType: string,
  dataVersion: number,
  toolkitId: number,
  productId: number,
  supplyId: number
}

/**
 * 用户信息
 * api: user/info
 */

 export interface UserHeaderInfo {
  englishName: string,
  positionName: string,
  companyEmail: string
 }

 export type UserHeaderInfoRes = AjaxResponse<UserHeaderInfo>;

/**
 * 学院列表
 * api: task/collegelist
 */

 export interface Collegelist {
  collegeId: string,
  title: string,
  item: {
    studyId: string,
    title: string,
  }[]
 }

 export type CollegelistRes = AjaxResponse<{
   data: Collegelist[]
 }>;


/**
 * 专业列表
 * api: task/collegestudylist
 */

 export interface Collegestudylist {
  studyId: string,
  title: string,
 }

 export type CollegestudylistRes = AjaxResponse<{
   data: Collegestudylist[]
 }>;


/**
 * 工具包列表
 * api: tips/toolkitbyproduct
 */


 export interface Toolkitbyproduct {
  productId: number,
  productName: string,
  value: number,
  label: string,
  child: {
    toolkitId: number,
    toolkitName: string,
  }[],
  children: {
    value: number,
    label: string,
  }[]
 }

 export type ToolkitbyproductRes = AjaxResponse<{
  toolkit: Toolkitbyproduct[]
 }>;

/**
 * 新建项目权限
 * api: project/role
 */

 export type ProjectRoleRes = AjaxResponse<{
   add: boolean
 }>;



 

