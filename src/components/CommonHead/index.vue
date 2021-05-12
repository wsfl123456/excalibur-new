<template>
  <div class="common-head">
    <div class="left-menu">
      <a href="/" class="brand-icon">
        <img src="~@/assets/svg/logo.svg" alt="Logo" />
      </a>
      <ul class="top-menu">
        <li class="item" v-for="item in filterMenu" :key="item.id">
          <router-link
            :class="{ isActive: defaultActive === item.title }"
            @click="setSession(item.id)"
            :to="item.path"
            >{{ item.title }}</router-link
          >
        </li>
      </ul>
    </div>
    <div class="right-toolbar">
      <div class="search-bar">
        <el-select
          class="search-type"
          v-model="searchParams.type"
          placeholder="请选择"
        >
          <el-option
            v-for="option in searchTypeOptions"
            :key="option.id"
            :value="option.id"
            :label="option.name"
          ></el-option>
        </el-select>
        <el-input
          class="search-input"
          placeholder="搜索……"
          v-model="searchParams.query"
          clearable
        >
          <i slot="suffix" @click="search" class="el-icon-search"></i>
        </el-input>
      </div>

      <el-dropdown placement="bottom">
        <span>
          <i class="el-icon-circle-plus"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(i, key) in addListPermission"
            :key="key"
            @click.native="newAdd(i)"
            >{{ i.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>

      <i class="el-icon-question"></i>

      <el-tooltip :disabled="noticeCount === 0" placement="bottom">
        <div slot="content">
          <span>
            当前共有
            <span style="color: #f56c6c">{{ noticeCount }}</span
            >个任务等待处理，点击
            <a
              style="font-size: 12px"
              class="link"
              href="/msg/list"
              @click="toMsgCenter"
              >查看</a
            >
          </span>
        </div>
        <el-badge :value="noticeCount" :max="99" :hidden="noticeCount === 0">
          <i @click="toMsgCenter" class="el-icon-message-solid"></i>
        </el-badge>
      </el-tooltip>

      <el-menu class="user-menu" mode="horizontal">
        <el-submenu index="1">
          <template slot="title">{{ userInfo.userName }}</template>
          <el-menu-item @click="goToUserCenter">个人中心</el-menu-item>
          <el-menu-item @click="signOut">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue, Watch } from 'vue-property-decorator';
import Notice from './notice';
import Network from '@/network';
import {
  MenuInfo,
  UserNoticeNumRes,
  UserNoticeListRes,
  BrandUserPermissionRes,
  ProjectRoleRes,
} from '@/interface';
import { getUserInfo } from '@/util';

@Component({
  components: {
    Notice,
  },
})
export default class CommonHead extends Vue {
  @Watch('routerName', { immediate: true }) handleRouteChange() {
    const menu: any = this.$route.matched.find(i => i.meta && i.meta.topMenu) || {};
    this.defaultActive = menu.meta ? menu.meta.topMenu : '';
  }

  showingNoticeList = false;

  menuIds: number[] = [];

  notifys: any[] = [];

  defaultActive: any = '';

  /* 路由跳转采用兼容模式，字符串路由将跳转至老系统 */
  menu = [
    { id: 69, title: '首页', path: { name: 'home' } },
    { id: 1, title: '我的项目', path: '/projects/list' },
    { id: 70, title: '我的任务', path: '/tasks/list' },
    { id: 72, title: '资源管理', path: { name: 'brand' } },
    { id: 9, title: '成长计划', path: '/new/nccBook/map' },
    { id: 10, title: '日程计划', path: '/schedule/manage' },
    { id: 78, title: '仪表盘', path: '/dashborad/staff' },
  ];

  /* 搜索相关属性 */
  searchParams: { type?: string; query: string } = {
    type: undefined,
    query: '',
  };

  searchTypeOptions = [
    { id: '1', name: '项目' },
    { id: '2', name: '任务' },
    { id: '5', name: '合同' },
    { id: '4', name: '供应商' },
    { id: '3', name: '品牌' },
  ];

  createBrandPermission: boolean = false;

  createProjectPermission: boolean = false;

  msgList: any[] = [];

  get addListPermission() {
    const newList: any[] = [];
    this.addList.forEach((e) => {
      if (!this.createBrandPermission && e.name === '品牌') {
        console.log('hasPermission');
      } else if (!this.createProjectPermission && e.name === '项目') {
        console.log('hasPermission');
      } else newList.push(e);
    });
    return newList;
  }

  addList = [
    {
      name: '品牌',
      urlName: 'brandCreate',
      path: '',
      openedSub: ['brands'],
      submenu: 'brands/list/',
    },
    {
      name: '供应商',
      urlName: 'supplierCreate',
      path: '',
      openedSub: ['suppliers'],
      submenu: 'suppliers/list/',
    },
    {
      name: '项目',
      urlName: '',
      path: '/projects/add',
      openedSub: [],
      submenu: '',
    },
    {
      name: '任务',
      urlName: '',
      path: '/tasks/list',
      openedSub: [],
      submenu: '',
    },
    {
      name: '会议',
      urlName: '',
      path: '/schedule/add',
      openedSub: ['schedule'],
      submenu: 'schedule/meeting',
    },
    {
      name: '请假',
      urlName: '',
      path: '/vacation/apply',
      openedSub: ['vacation'],
      submenu: 'vacation/apply',
    },
    {
      name: '报销',
      urlName: '',
      path: '/myReimburse/add',
      openedSub: ['myReimburse'],
      submenu: 'myReimburse/list/',
    },
    {
      name: '报修',
      urlName: '',
      path: '/myDevice/add',
      openedSub: ['myDevice'],
      submenu: 'myDevice/list',
    },
  ];

  disableSearchMsgWarning = false;

  userInfo = getUserInfo();

  /* 消息提示相关属性 */
  noticeCount: number = 0;

  noticeCacheStamp = window.localStorage.getItem('cacheNoticeStamp');

  get filterMenu() {
    return this.menu.filter(item => this.menuIds.indexOf(item.id) > -1);
  }

  get routerName() {
    return this.$route.name;
  }

  async created() {
    // if (this.$route.name !== 'home') return; // 仅在主页显示消息列表, 并仅在页面刷新时显示

    return Promise.all([
      (async () => {
        const res = await Network.fetch<MenuInfo>('getUserMenu');
        this.menuIds = res.data.retData.menuInfo;
      })(),
      (async () => {
        this.showNoticeList();
        setInterval(() => this.showNoticeList(), 300000);
      })(),
      (async () => {
        /* 获取新建品牌用户权限信息 */
        const permissionRes = await Network.fetch<BrandUserPermissionRes>(
          'getRolePermission',
        );
        this.createBrandPermission = permissionRes.data.retData.add;
      })(),
      (async () => {
        /* 获取新建品牌用户权限信息 */
        const permissionRes = await Network.fetch<ProjectRoleRes>(
          'getProjectRole',
        );
        this.createProjectPermission = permissionRes.data.retData.add;
      })(),
    ]);
  }

  /* 需要被设置成如此 */
  static setSession(id: string) {
    window.sessionStorage.setItem('primaryMenu', id);
    window.sessionStorage.setItem('currMenu', id);
  }

  toMsgCenter = () => {
    // Promise.all(
    //   this.msgList.map((e: any) => Network.fetch('clearNotice', { noticeId: e.id })),
    // ).then(() => {
    //   window.location.href = '/msg/list';
    // });
    window.sessionStorage.setItem('hideNotice', '1');
    window.location.href = '/msg/list';
  };

  reduceNotice(id: string) {
    const curNotify = this.notifys.find(i => String(i.customClass) === id);
    curNotify.close();
  }

  // changeNoticeShow() {
  //   if (this.showingNoticeList) sessionStorage.setItem('showNotice', 'hide');
  //   else sessionStorage.setItem('showNotice', 'show');

  //   this.showNoticeList(false);
  // }

  async showNoticeList() {
    /* 消息总数 */
    const noticeNum = await Network.fetch<UserNoticeNumRes>('noticeNum');

    /* 用户消息弹窗 */
    const noticeListRes = await Network.fetch<UserNoticeListRes>(
      'getUserNoticeList',
      {
        page: 1,
        pageSize: 1000,
        noticeId: 1,
        state: 1,
      },
    );

    const renderList = () => {
      this.showingNoticeList = true;
      this.noticeCount = Number(noticeNum.data.retData.number);
      const vm = this;
      noticeListRes.data.retData.data.slice(0, 5).forEach((i, k) => {
        /* 偏移的距离，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 */
        setTimeout(() => {
          const notify = vm.$notify({
            duration: 0, // 不会自动关闭
            offset: 60,
            type: i.state === 1 ? 'warning' : undefined,
            title: i.name,
            customClass: String(i.id),
            message: vm.$createElement('notice', {
              props: { noticeMsg: i, curId: String(i.id) },
              on: { reduceCount: this.reduceNotice },
            }),
            onClose: () => {
              if (vm.showingNoticeList) {
                Network.fetch('clearNotice', { noticeId: i.id });
                this.noticeCount -= 1;
              }
            },
          });
          vm.notifys.push(notify);
        });
      });
    };

    if (this.noticeCount !== Number(noticeNum.data.retData.number)) {
      this.msgList = noticeListRes.data.retData.data;
      renderList();
    }

    /* 最多显示五条消息 */
    // if (sessionStorage.getItem('showNotice') !== 'hide') {
    //   renderList();
    // } else {
    //   this.showingNoticeList = false;
    //   this.noticeCount = Number(noticeNum.data.retData.number);
    // }
    // renderList();
  }

  async search() {
    if (!this.searchParams.type || !this.searchParams.query) {
      if (!this.disableSearchMsgWarning) {
        this.$message.warning({
          duration: 1000,
          message: '请先选择搜索数据类型并且输入搜索信息',
          onClose: () => {
            this.disableSearchMsgWarning = false;
          },
        });
        this.disableSearchMsgWarning = true;
      }
      return;
    }

    this.$router.push({
      path: '/searchResult',
      query: {
        type: this.searchParams.type,
        searchValue: this.searchParams.query,
      },
    });
  }

  /* 缓存消息提示一天不显示 */
  // markAsRead() {
  //   window.localStorage.setItem('cacheNoticeStamp', String(Date.now()));
  //   this.a = 11;
  // }

  goToUserCenter() {
    this.$router.push('/profile/list');
  }

  async signOut() {
    await Network.fetch('signOut');
    this.$router.push('/');
  }

  newAdd(i: any) {
    if (i.urlName) this.$router.push({ name: i.urlName });
    else this.$router.push({ path: i.path });
  }
}
</script>
