import { AjaxResponse } from "@/interface/base";

export interface HouselistfrontList {
  houseId: number;
  picture: string;
  title: string;
  tagText: string;
  creatorName: string;
  creatorId: number;
  creatorHeadPic: string;
  lastModifyTime: string;
  pubCompany: string;
  pubTime: string;
  content: string;
  fileAddress: string;
  fileAddressWindows: string;
}

/*
 * 成长计划-黄金屋-列表
 * api: tips/houselistfront
 * */
export type HouselistfrontRes = AjaxResponse<{
  tipsList: HouselistfrontList[];
}>;
