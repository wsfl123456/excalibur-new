import { AjaxResponse } from "@/interface/base";

/**
 * 解决方案审核-列表信息
 * api: qa/solutionlist
 */

export interface QASolutionTable {
  solutionId: number;
  title: string;
  content: string;
  creatorName: string;
  creatorHeadPic: string;
  creatorId: number;
  lastModifyTime: string;
  auditorName: string;
  auditorHeadPic: string;
  auditorId: number;
  auditorTime: string;
}

export type QASolutionTableRes = AjaxResponse<{
    'tipsList': QASolutionTable[],
    count: string,
}>;

/**
 * 解决方案审核-详情
 * api: qa/solutiondetail
 */

interface FileContent {
  fileName: string;
  filePath: string;
  fileSize: string;
  summary: string;
}

export interface QASolutionDetail {
  solutionId: number | null;
  title: string;
  typeId: number | string;
  collegeId: number | null;
  studyId: number | null;
  viewScope: number | null;
  tagText: string | null;
  productId: number;
  task_toolkit_id: number;
  shuxingId: number | null;
  pubCompany: string | null;
  pubTime: string |null;
  fileAddressWindows: string | null;
  fileAddress: string | null;
  fileContent: FileContent[];
  picture: string | null;
  content: string;
}

export type QASolutionDetailRes = AjaxResponse<{
    'tipsInfo': QASolutionDetail,
}>;
/**
 * 解决方案审核-提交
 * api: qa/solutionopert
 */


export type QASolutionOpertRes = AjaxResponse<{
}>;




