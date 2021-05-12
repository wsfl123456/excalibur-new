import { NetAction } from '../state';

const SupplierActions: NetAction[] = [
  {
    url: '/supply/list',
    name: 'getSupplierList',
    type: 'post',
  },
  {
    url: '/supply/view',
    name: 'getSupplierMsg',
    type: 'post',
  },
  {
    url: '/supply/new',
    name: 'createSupplier',
    type: 'post',
  },
  {
    url: '/supply/edit',
    name: 'editSupplier',
    type: 'post',
  },
  {
    url: '/supply/commentadd',
    name: 'commentSupplier',
    type: 'post',
  },
  {
    url: '/supply/commentdetail',
    name: 'supplierCommentMsg',
    type: 'post',
  },
  {
    url: '/supply/audit',
    name: 'auditSupplier',
    type: 'post',
  },
];

export default SupplierActions;
