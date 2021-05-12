<template>
  <div class="brand-container">
    <el-button
      type="primary"
      class="create-btn"
      icon="el-icon-plus"
      v-if="createPermission"
      @click="$router.push({name: 'brandCreate'})">新建品牌</el-button>
    <span class="clear"></span>
    <nav-menu
      :navMenuParams="navMenuParams"
      :createTimeRange="timeRange"
      @change-menu-param="changeMenuParam"
      @change-time-range="changeTimeRange">
    </nav-menu>
    <brand-list style="min-height: 300px;" v-loading="renderingBrandList" :brands="allBrands"></brand-list>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import dateFormat from 'dateformat';
import NavMenu from './nav-menu.vue';
import BrandList from './brand-list.vue';
import Network from '@/network';
import { BrandListRes, BrandMsg, BrandUserPermissionRes } from '@/interface';

@Component({
  components: {
    BrandList,
    NavMenu,
  },
})
export default class Brand extends Vue {
  timeRange: string[] = [];

  navMenuParams: {[index: string]: string} = {
    profession: '',
    consociation: '',
    auditState: '',
    signatoryCompany: '',
    createTime: '',
  };

  createPermission = false;

  renderingBrandList = false;

  allBrands: BrandMsg[]= [];

  async created() {
    this.getBrandList();

    /* 获取用户权限信息 */
    const permissionRes = await Network.fetch<BrandUserPermissionRes>('getRolePermission');
    this.createPermission = permissionRes.data.retData.add;
  }

  async getBrandList() {
    this.renderingBrandList = true;
    const brandListRes = await Network.fetch<BrandListRes>('getBrandList', {
      fromtime: this.timeRange.length ? dateFormat(this.timeRange[0], 'yyyy-mm-dd') : '',
      totime: this.timeRange.length ? dateFormat(this.timeRange[1], 'yyyy-mm-dd') : '',
      industry: this.navMenuParams.profession,
      state: this.navMenuParams.auditState,
      ncCompanyId: this.navMenuParams.signatoryCompany,
      workState: this.navMenuParams.consociation,
      page: 1,
      perPage: 1000,
      orderBy: 'createTime',
      asc: 'desc',
    });

    this.allBrands = brandListRes.data.retData.data.data.map(i => ({
      id: i.id,
      img: i.picture,
      name: i.customerName,
      category: i.industryName,
    }));
    this.renderingBrandList = false;
  }

  changeMenuParam(type: string, prop: string) {
    if (type === 'createTime') {
      /* 按月份、季度、年选择时间 */
      const date = new Date();
      const dates: {[index: string]: string[]} = {
        month: [
          String(new Date(date.getFullYear(), date.getMonth(), 1)),
          String(new Date(date.getFullYear(), date.getMonth(), 31)),
        ],
        season: [
          String(new Date(date.getFullYear(), date.getMonth() - 2, 1)),
          String(new Date(date.getFullYear(), date.getMonth(), 31)),
        ],
        year: [
          String(new Date(date.getFullYear(), 0, 1)),
          String(new Date(date.getFullYear(), 11, 30)),
        ],
      };
      this.timeRange = dates[prop];
    }

    this.navMenuParams[type] = prop;
    return this.getBrandList();
  }

  changeTimeRange(timeRange: string[]) {
    this.navMenuParams.createTime = 'timeRange';
    this.timeRange = timeRange;
    return this.getBrandList();
  }
}
</script>
