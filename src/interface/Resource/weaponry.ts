import { AjaxResponse } from '@/interface/base';

/**
 * 兵器库-列表信息
 * api: tips/storelist
 */

export interface WeaponryTable {
    storeId: number,
    title: string,
    fileCount: number,
    collegeName: string,
    studyName: string,
    shuxingName: string,
    creatorName: string,
    lastModifyTime: string,
    stateName: string,
}

export type WeaponryTableRes = AjaxResponse<{
    'tipsList': WeaponryTable[],
    count: string,
}>;

/**
 * 兵器库-表单信息
 */

export interface FileContent {
    fileName: string,
    filePath: string,
    summary: string,
    fileSize: string,
}

export interface WeaponrtForm {
    storeId: number | null,
    collegeId: number | null,
    studyId: number | null,
    viewScope: number,
    tagText: string,
    shuxingId: number | null,
    title: string,
    state: number,
    fileContent: FileContent[],
}

/**
 * 兵器库-属性列表
 * api: tips/storeshuxinglist
 */

 export interface Storeshuxing {
    shuxingId: number,
    shuxingName: string,
 }

export type StoreshuxingRes = AjaxResponse<{
    'shuxingList': Storeshuxing[],
}>;

/**
 * 兵器库-新增
 * api: tips/storeadd
 */

export type StoreAddRes = AjaxResponse<{}>;

/**
 * 兵器库-编辑
 * api: tips/storeedit
 */

export type StoreEditRes = AjaxResponse<{}>;

/**
 * 兵器库-详情
 * api: tips/storedetail
 */

export type StoreDetailRes = AjaxResponse<{
    'tipsInfo': WeaponrtForm
}>;