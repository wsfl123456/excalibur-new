import { AjaxResponse } from '@/interface/base';

/*
 * 我的供应商-供应商信息
 * api: /customer/new
 * */
export interface SupplierMsg {
  id: number,
  name: string,
  img: string,
  category: string,
}

/*
 * 我的供应商-供应商列表
 * api: /customer/list
 * */
export type SupplierListRes = AjaxResponse<{
  data: {
    id: number,
    name: string,
    picture: string,
    accountName: string,
    serviceType: string,
  }[],
}>;

/*
 * 我的供应商-供应商信息
 * api: /supply/view
 * */
export interface SupplierInfoData {
  supplierFullName: string,
  offSignTime: string,
  canAudit: string | boolean,
  canEdit: string | boolean,
  accountId: string,
  accountName: string,
  accountInfo: any[],
  bankName: string,
  stateName: string,
  brandAddress: string,
  brandSummary: string,
  brandZiliao: string,
  contactInfo?: {
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
    contactName?: string,
  }[],
  dutyParagraph: string,
  name: string,
  normcoreContactsInfo: {
    headPic: string,
    userName: string,
    id: number,
  }[],
  organizationType: string,
  picture: string,
  serviceType: string,
  signCompanyId: string,
  webSiteUrl: string,
  wechart: string,
  weibo: string,
  workState: string,
  auditName: string,
  ncCompanyName: string,
}

export type SupplierMsgRes = AjaxResponse<SupplierInfoData>;

/*
 * 我的供应商-供应商信息创建、编辑
 * api: /supply/new
 * */
export type CreateSupplierRes = AjaxResponse<{}>;

export type EditSupplierRes = AjaxResponse<{}>;

/*
 * 我的供应商-供应商评论信息
 * api: /supply/commentdetail
 * */
export type SupplierCommentMsg = AjaxResponse<{
  commentInfo: {
    scoreAvg: string,
    scoreMe: number,
    scoreNum: string,
  },
}>;

/*
 * 我的供应商-供应商评论
 * api: /supply/commentadd
 * */
export type CommentSupplier = AjaxResponse<{}>;

/*
 * 我的供应商-审核供应商
 * api: /supply/audit
 * */
export type AuditSupplierRes = AjaxResponse<{}>;
