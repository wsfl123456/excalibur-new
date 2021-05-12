import { AjaxResponse } from '@/interface/base';

/**
 * 活点地图-列表信息
 * api: 
 */

export interface LivemapTable {
    typeId: number,
    collegeName: string,
    tagText: string,
    title: string,
    creatorName: string,
    lastModifyTime: string,
    stateName: string,
}

export type LivemapTableRes = AjaxResponse<{
    'tipsList': LivemapTable[],
    count: string,
}>;

/**
 * 活点地图-表单信息
 * api: 
 */

 export interface LivemapCreateForm {
    tipsId?: number | null,
    typeId: number | null,
    collegeId?: number | null,
    studyId?: number | null,
    viewScope?: number | null,
    tagText?: string,
    productId?: number,
    task_toolkit_id?: number,
    title: string,
    content: string,
    state: number,
 }

 /*
 * 活点地图-新增
 * api: tips/mapadd
 * */
export type AddMapRes = AjaxResponse<{}>;

 /*
 * 活点地图-编辑
 * api: tips/mapedit
 * */
export type EditMapRes = AjaxResponse<{}>;

 /*
 * 活点地图-详情
 * api: tips/mapdetail
 * */
export type MapDetailRes = AjaxResponse<{
    tipsInfo: LivemapCreateForm
}>;

export interface Maplistask {
    tipsId: number,
    title: string,
    askerId: number,
    askerName: string,
    askerHeadPic: string,
    lastModifyTime: string,
}

/*
 * 活点地图-问题列表
 * api: tips/maplistask
 * */
export type MaplistaskRes = AjaxResponse<{
    tipsList: Maplistask[]
}>;

/*
 * 活点地图-回答问题
 * api: tips/mapeditask
 * */
export type MapeditaskRes = AjaxResponse<{}>;






