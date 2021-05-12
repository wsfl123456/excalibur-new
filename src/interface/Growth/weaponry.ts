import { AjaxResponse } from "@/interface/base";

export interface Storelistfront {
  storeId: number;
  creatorName: string;
  creatorId: number;
  creatorHeadPic: string;
  lastModifyTime: string;
  title: string;
  fileContent: {
    fileName: string;
    filePath: string;
    summary: string;
  }[];
}

/*
 * 成长计划-皇家兵器库-列表
 * api: tips/storelistfront
 * */
export type StorelistfrontRes = AjaxResponse<{
  tipsList: Storelistfront[];
}>;


