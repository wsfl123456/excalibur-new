import { AjaxResponse } from "@/interface/base";

/**
 * 回答审核-列表信息
 * api: qa/answerlist
 */

export interface QAAnswerTable {
  questionId: number;
  answerId: number;
  title: string;
  content: string;
  creatorNameQuestion: string;
  creatorHeadPicQuestion: string;
  creatorIdQuestion: number;
  createTimeQuestion: string;
  creatorName: string;
  creatorHeadPic: string;
  creatorId: number;
  lastModifyTime: string;
}

export type QAAnswerTableRes = AjaxResponse<{
    'tipsList': QAAnswerTable[],
    'questionList': any,
    count: string,
}>;
/**
 * 回答审核-详情
 * api: qa/answerdetail
 */

interface FileContent {
  fileName: string;
  filePath: string;
  fileSize: string;
  summary: string;
}

export interface QAAnswerDetail {
  answerId: number | null;
  typeId: number | string;
  collegeId: number | null;
  studyId: number | null;
  viewScope: number | null;
  tagText: string | null;
  productId: number;
  task_toolkit_id: number;
  shuxingId: number | null;
  pubCompany: string;
  pubTime: string;
  fileAddressWindows: string | null;
  fileAddress: string | null;
  fileContent: FileContent[];
  picture: string | null;
  content: string;
}

export type QAAnswerDetailRes = AjaxResponse<{
    'tipsInfo': QAAnswerDetail,
}>;
/**
 * 回答审核-提交
 * api: qa/answeropert
 */


export type QAAnswerOpertRes = AjaxResponse<{
}>;




