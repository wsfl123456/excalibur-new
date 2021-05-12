import { NetAction } from './state';

const HomeActions: NetAction[] = [
  {
    url: '/meeting/all',
    name: 'getSchedule',
    type: 'post',
  },
  {
    url: '/pdeclare/list',
    name: 'getNoticeList',
    type: 'post',
  },
  {
    url: '/tips/list',
    name: 'getKnowledgeTips',
    type: 'post',
  },
  {
    url: '/task/worknumber',
    name: 'getMyWorkData',
    type: 'post',
  },
  {
    url: '/dashboard/userexecmonthtasknumber',
    name: 'getWorkReview',
    type: 'post',
  },
  {
    url: '/dashboard/userexecmonthprojectnumbereachcustomer',
    name: 'getProjectExecuteChart',
    type: 'post',
  },
  {
    url: '/dashboard/userincomeproject',
    name: 'getProjectProfitChart',
    type: 'post',
  },
  {
    url: '/dashboard/userincomeproject',
    name: 'getProjectProfitChart',
    type: 'post',
  },
  {
    url: '/dashboard/userexecmonthdurtime',
    name: 'getTaskTimingChart',
    type: 'post',
  },
  {
    url: '/dashboard/userexecmonthtasknumber',
    name: 'getTaskCountChart',
    type: 'post',
  },
  {
    url: '/dashboard/userexeccustomertasknumber',
    name: 'getTaskCountChartByClient',
    type: 'post',
  },
  {
    url: '/dashboard/userincomeproject',
    name: 'getUserIncome',
    type: 'post',
  },
  {
    url: '/notice/list',
    name: 'getUserNoticeList',
    type: 'post',
  },
  {
    url: '/notice/number',
    name: 'noticeNum',
    type: 'post',
  },
];
export default HomeActions;
