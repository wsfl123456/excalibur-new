import { AjaxResponse } from "@/interface/base";

/**
 * 黄金屋-列表信息
 * api: tips/houselist
 */

export interface GoldHouseTable {
  houseId: number;
  title: string;
  collegeName: string;
  studyName: string;
  tagText: string;
  creatorName: string;
  lastModifyTime: string;
  stateName: string;
}

export type GoldHouseTableRes = AjaxResponse<{
  tipsList: GoldHouseTable[];
  count: string;
}>;

/**
 * 黄金屋-表单信息
 */

export interface GoldHouseForm {
  houseId: number | null;
  collegeId: number | null;
  studyId: number | null;
  viewScope: number;
  tagText: string;
  picture: string;
  title: string;
  content: string;
  pubCompany: string;
  pubTime: string;
  fileAddress: string;
  fileAddressWindows: string;
  state: number;
  postType: number | null
}

/**
 * 黄金屋-新增
 * api: tips/houseadd
 */

export type HouseAddRes = AjaxResponse<{}>;

/**
 * 黄金屋-编辑
 * api: tips/houseedit
 */

export type HouseEditRes = AjaxResponse<{}>;

/**
 * 黄金屋-详情
 * api: tips/housedetail
 */

export type GoldHouseDeatilRes = AjaxResponse<{
  tipsInfo: GoldHouseForm;
}>;
