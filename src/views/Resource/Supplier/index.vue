<template>
  <div class="supplier-container">
    <el-button
      type="primary"
      class="create-btn"
      icon="el-icon-plus"
      @click="$router.push({name: 'supplierCreate'})">新建供应商</el-button>
    <span class="clear"></span>
    <nav-menu
      :navMenuParams="navMenuParams"
      :createTimeRange="timeRange"
      @change-menu-param="changeMenuParam"
      @change-time-range="changeTimeRange">
    </nav-menu>
    <supplier-list style="min-height: 300px" v-loading="loadingSupplierList" :suppliers="allSuppliers"></supplier-list>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import dateFormat from 'dateformat';
import NavMenu from './nav-menu.vue';
import SupplierList from './supplier-list.vue';
import Network from '@/network';
import { SupplierMsg, SupplierListRes } from '@/interface';

@Component({
  components: {
    SupplierList,
    NavMenu,
  },
})
export default class Supplier extends Vue {
  navMenuParams: {[index: string]: string} = {
    profession: '',
    consociation: '',
    auditState: '',
    signatoryCompany: '',
  };

  loadingSupplierList = false;

  timeRange: string[] = [];

  allSuppliers: SupplierMsg[] = [];

  created() {
    return this.getSupplierList();
  }

  async getSupplierList() {
    this.loadingSupplierList = true;

    const brandListRes = await Network.fetch<SupplierListRes>('getSupplierList', {
      fromtime: this.timeRange.length ? dateFormat(this.timeRange[0], 'yyyy-mm-dd') : '',
      totime: this.timeRange.length ? dateFormat(this.timeRange[1], 'yyyy-mm-dd') : '',
      serviceType: this.navMenuParams.profession,
      state: this.navMenuParams.auditState,
      ncCompanyId: this.navMenuParams.signatoryCompany,
      workState: this.navMenuParams.consociation,
      page: 1,
      perPage: 1000,
      orderBy: 'createTime',
      asc: 'desc',
    });
    this.allSuppliers = brandListRes.data.retData.data.map(i => ({
      id: i.id,
      img: i.picture,
      name: i.name,
      category: i.serviceType,
    }));
    this.loadingSupplierList = false;
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

    return this.getSupplierList();
  }

  changeTimeRange(timeRange: string[]) {
    this.navMenuParams.createTime = 'timeRange';
    this.timeRange = timeRange;
    return this.getSupplierList();
  }
}
</script>
