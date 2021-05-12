import { AjaxResponse } from '@/interface/base';

export interface Maplistfront {
    tipsId: number,
    title: string,
    creatorId: number,
    creatorName: string,
    creatorHeadPic: string,
    lastModifyTime: string,
    content: string,
}

/*
 * 成长计划-活点地图-列表
 * api: tips/maplistfront
 * */
export type MaplistfrontRes = AjaxResponse<{
    tipsList: Maplistfront[],
}>;

/*
 * 成长计划-活点地图-添加问题
 * api: tips/mapaddask
 * */
export type Mapaddask = AjaxResponse<{}>;
