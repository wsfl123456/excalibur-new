import { NetAction } from './state';

const BaseActions: NetAction[] = [
  {
    url: '/user/usermenu',
    name: 'getUserMenu',
    type: 'post',
  },
  {
    url: '/user/logout',
    name: 'signOut',
    type: 'post',
  },
  {
    url: '/user/alluser',
    name: 'getMemberList',
    type: 'post',
  },
  {
    url: '/task/showcasetool',
    name: 'getPrRoute',
    type: 'post',
  },
  {
    url: '/notice/edit',
    name: 'clearNotice',
    type: 'post',
  },
  {
    url: 'user/info',
    name: 'userInfo',
    type: 'post',
  },
  {
    url: "task/collegelist",
    name: "getCollegelist",
    type: "post",
  },
  {
    url: "task/collegestudylist",
    name: "getCollegestudylist",
    type: "post",
  },
  {
    url: "tips/toolkitbyproduct",
    name: "getToolkitbyproduct",
    type: "post",
  },
  {
    url: "project/role",
    name: "getProjectRole",
    type: "post",
  },
];

export default BaseActions;
