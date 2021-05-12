import { AjaxResponse } from "@/interface/base";

/**
 * 提问审核-列表信息
 * api: qa/questionlist
 */

export interface QATable {
  questionId: number;
  content: string;
  answerStateName: string;
  creatorName: string;
  creatorHeadPic: string;
  creatorId: number;
  lastModifyTime: string;
}

export type QATableRes = AjaxResponse<{
    'tipsList': QATable[],
    count: string,
}>;

/**
 * 提问审核-问题详情
 * api: qa/questiondetail
 */

export interface QADetail {
  content: string;
  // state: number;
}

export type QADetailRes = AjaxResponse<{
    'tipsInfo': QADetail,
}>;

/**
 * 提问审核-问题编辑提交
 * api: qa/questionopert
 */


export type QAQuestionOpertRes = AjaxResponse<{
}>;



