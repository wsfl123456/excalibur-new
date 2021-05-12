import { NetAction } from '../state';

const BrandAction: NetAction[] = [
  {
    url: '/customer/industry',
    name: 'getProfessionList',
    type: 'post',
  },
  {
    url: '/task/innercustomernc',
    name: 'getSignatoryCompany',
    type: 'post',
  },
  {
    url: '/customer/list',
    name: 'getBrandList',
    type: 'post',
  },
  {
    url: '/user/getleaderid',
    name: 'getBrandLeader',
    type: 'post',
  },
  {
    url: '/customer/new',
    name: 'createBrand',
    type: 'post',
  },
  {
    url: '/customer/view',
    name: 'getBrandData',
    type: 'post',
  },
  {
    url: '/customer/edit',
    name: 'editBrand',
    type: 'post',
  },
  {
    url: '/project/listaudit',
    name: 'getBrandProjectList',
    type: 'post',
  },
  {
    url: '/dashboard/customersku',
    name: 'getBrandProfitChart',
    type: 'post',
  },
  {
    url: '/dashboard/customertasknumber',
    name: 'getBrandProjectExecuteChart',
    type: 'post',
  },
  {
    url: '/dashboard/customersatisfy',
    name: 'getBrandSurveyChart',
    type: 'post',
  },
  {
    url: '/customer/casetag',
    name: 'getProjectCaseTags',
    type: 'post',
  },
  {
    url: '/customer/casetype',
    name: 'getProjectCaseState',
    type: 'post',
  },
  {
    url: '/customer/addcase',
    name: 'addProjectCase',
    type: 'post',
  },
  {
    url: '/customer/caselist',
    name: 'getProjectCaseList',
    type: 'post',
  },
  {
    url: '/customer/casedetail',
    name: 'getProjectCaseDetail',
    type: 'post',
  },
  {
    url: '/customer/editcase',
    name: 'editProjectCaseDetail',
    type: 'post',
  },
  {
    url: '/customer/role',
    name: 'getRolePermission',
    type: 'post',
  },
  {
    url: '/customer/review',
    name: 'auditBrand',
    type: 'post',
  },
  {
    url: '/user/myinfo',
    name: 'getMyInfo',
    type: 'post',
  },
  {
    url: '/project/parstruct',
    name: 'getBrandOrgMsg',
    type: 'post',
  },
];

export default BrandAction;
