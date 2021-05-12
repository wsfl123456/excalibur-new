<template>
  <div class="resource">
    <nav-menu :menu="navMenu"></nav-menu>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import { MenuInfo, NavMenuItem, PrRouteRes } from '@/interface';
import { filterMenu } from '@/util';
import Network from '@/network';
import NavMenu from '@/components/NavMenu/index.vue';

/* 资源管理界面下子菜单 id 取自资源管理-菜单配置管理-菜单设置 ID */
const ResourceMenu: NavMenuItem[] = [
  {
    id: 4,
    url: { name: 'brand' },
    title: '我的品牌',
  },
  {
    id: 8,
    url: { name: 'supplier' },
    title: '我的供应商',
  },
  {
    id: 63,
    url: '/myReimburse/list/',
    title: '我的报销',
  },
  {
    id: 77,
    url: '',
    title: 'PR审批', // 动态加载子路由
  },
  {
    id: 31,
    title: '我的设备',
    subMenu: [
      {
        id: 32,
        url: '/myDevice/list',
        title: '设备清单',
      },
      {
        id: 33,
        url: '/myDevice/apply',
        title: '我的申请',
      },
    ],
  },
  {
    // id: 12,
    id: 0,
    title: '人事管理',
    subMenu: [
      {
        id: 38,
        title: '员工管理',
        subMenu: [
          {
            id: 39,
            url: '/employee/basic',
            title: '基本信息',
          },
          {
            id: 40,
            url: '/employee/contract',
            title: '合同信息',
          },
        ],
      },
      {
        id: 41,
        title: '薪资与奖金',
        subMenu: [
          {
            id: 42,
            url: '/money/salaryManage',
            title: '薪资管理',
          },
          {
            id: 43,
            url: '/money/bonusManage',
            title: '奖金管理',
          },
        ],
      },
      {
        id: 44,
        title: '考勤与假期',
        subMenu: [
          {
            id: 45,
            url: '/attend/attendance',
            title: '员工考勤',
          },
          {
            id: 46,
            url: '/attend/vacation',
            title: '员工假期',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: '财务管理',
    subMenu: [
      {
        id: 90,
        title: '合同',
        subMenu: [
          {
            // id: 91,
            id: 0,
            url: '/contract/clientContract',
            title: '客户合同',
          },
          {
            // id: 92,
            id: 0,
            url: '/contract/supplierContract',
            title: '供应商合同',
          },
        ],
      },
      {
        id: 94,
        title: '财务凭证',
        subMenu: [
          {
            // id: 97,
            id: 0,
            url: '/financeCertificates/certificate',
            title: '凭证管理',
          },
          {
            // id: 98,
            id: 0,
            url: '/financeCertificates/invoice',
            title: '可用发票',
          },
        ],
      },
      {
        id: 95,
        title: '财务报表',
        subMenu: [
          {
            id: 119,
            url: '/financeReport/ar',
            title: 'AR',
          },
          {
            id: 120,
            url: '/financeReport/ap',
            title: 'AP',
          },
          {
            id: 121,
            url: '/financeReport/ce',
            title: 'CE',
          },
          {
            id: 122,
            url: '/financeReport/marginSheet',
            title: 'Margin Sheet',
          },
          {
            id: 109,
            url: '/financeReport/bp',
            title: 'BP',
          },
          {
            id: 123,
            url: '/financeReport/fc',
            title: 'FC',
          },
        ],
      },
    ],
  },
  {
    // id: 13,
    id: 0,
    title: '设备管理',
    subMenu: [
      {
        id: 34,
        title: '设备管理',
        subMenu: [
          {
            id: 35,
            url: '/deviceManage/list',
            title: '设备清单',
          },
          {
            id: 36,
            url: '/deviceManage/owner',
            title: '所有者管理',
          },
        ],
      },
      {
        id: 37,
        url: '/device/repair',
        title: '报修管理',
      },
    ],
  },
  {
    // id: 15,
    id: 0,
    title: '系统设置',
    subMenu: [
      {
        id: 20,
        url: '/system/userManage',
        title: '用户管理',
      },
      {
        id: 21,
        title: '菜单配置管理',
        subMenu: [
          {
            id: 24,
            url: '/menuConfManage/setting',
            title: '菜单设置',
          },
          {
            id: 25,
            url: '/menuConfManage/role',
            title: '菜单权限',
          },
        ],
      },
      {
        id: 22,
        title: '功能配置管理',
        subMenu: [
          // {
          //   id: 61,
          //   url: '/functionManage/tips',
          //   title: '品牌工具包Tips',
          // },
          {
            id: 98,
            // id: 0,
            url: { name: 'livemap' },
            title: '活点地图',
          },
          {
            id: 104,
            // id: 0,
            url: { name: 'weaponry' },
            title: '皇家兵器库',
          },
          {
            id: 108,
            // id: 0,
            url: { name: 'goldhouse' },
            title: '黄金屋',
          },
          {
            id: 112,
            // id: 0,
            url: { name: 'auditQuestion' },
            title: '提问审核',
          },
          {
            id: 113,
            // id: 0,
            url: { name: 'answerQuestion' },
            title: '回答审核',
          },
          {
            id: 114,
            // id: 0,
            url: { name: 'solution' },
            title: '解决方案审核',
          },
          {
            id: 26,
            url: '/functionManage/toolkit',
            title: '工具包管理',
          },
          {
            id: 27,
            url: '/functionManage/auditor',
            title: '业务审批人',
          },
          {
            id: 28,
            url: '/functionManage/meeting',
            title: '会议配置',
          },
          {
            id: 29,
            url: '/functionManage/device',
            title: '设备类型',
          },
          {
            id: 30,
            url: '/functionManage/department',
            title: '公司部门设置',
          },
          {
            id: 76,
            url: '/functionManage/hoshinUnit',
            title: '事业部设置',
          },
        ],
      },
    ],
  },
];

@Component({
  components: {
    NavMenu,
  },
})
export default class Resource extends Vue {
  navMenu: NavMenuItem[] = [];

  async created() {
    /* 动态加载PR审批路由 */
    const prRouteRes = await Network.fetch<PrRouteRes>('getPrRoute');
    const prRoute = ResourceMenu[3];
    prRoute.subMenu = prRouteRes.data.retData.productTool.map(i => ({
      id: 0,
      title: i.toolkitName,
      url: `/PRAudit/${i.toolkitId}`,
    }));

    const res = await Network.fetch<MenuInfo>('getUserMenu');
    this.navMenu = filterMenu(ResourceMenu, res.data.retData.menuInfo);
  }
}
</script>
