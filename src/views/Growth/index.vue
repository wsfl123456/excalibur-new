<template>
  <div class="growth">
    <nav-menu :menu="navMenu"></nav-menu>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import { MenuInfo, NavMenuItem } from '@/interface';
import { filterMenu } from '@/util';
import Network from '@/network';
import NavMenu from '@/components/NavMenu/index.vue';

/* 成长计划界面下子菜单 id 取自资源管理-菜单配置管理-菜单设置 ID */
const GrowthMenu: NavMenuItem[] = [
  {
    title: 'NCC小黄书',
    id: 99,
    subMenu: [
      {
        title: '活点地图',
        id: 100,
        subMenu: [
          {
            title: '专业线',
            id: 101,
            url: { name: 'professionLine' },
          },
          {
            title: '员工日常',
            id: 102,
            url: { name: 'staffDaily' },
          },
        ],
      },
      {
        title: '皇家兵器库',
        id: 105,
        url: { name: 'nccWeaponry' },
      },
      {
        title: '黄金屋',
        id: 103,
        url: { name: 'goldHouse' },
      },
      {
        title: '问题悬赏榜',
        id: 111,
        url: { name: 'Q&A' },
      },
    ],
  },
  {
    id: 125,
    url: '/new/dri/index',
    title: 'DRI',
  },
  {
    title: '公司职级',
    id: 52,
    subMenu: [
      {
        title: '组织架构',
        id: 74,
        url: '/OX/list',
      },
    ],
  },
  {
    title: '我的薪酬',
    id: 53,
    subMenu: [
      {
        title: '职级工资',
        id: 54,
        url: '/salary/salary',
      },
      {
        title: '绩效收入',
        id: 55,
        url: '/salary/bonus',
      },
    ],
  },
];

@Component({
  components: {
    NavMenu,
  },
})
export default class Growth extends Vue {
  navMenu: NavMenuItem[] = [];

  async created() {
    const res = await Network.fetch<MenuInfo>('getUserMenu');
    this.navMenu = filterMenu(GrowthMenu, res.data.retData.menuInfo);
  }
}
</script>
