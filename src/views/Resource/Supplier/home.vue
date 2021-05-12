<template>
  <div class="supplier-home">
    <router-link class="back" :to="{name: 'supplier'}">返回供应商列表</router-link>
    <div class="brand-info">
      <el-avatar class="img" :src="supplierInfo.picture">{{ supplierInfo.name }}</el-avatar>
      <div class="brand-intro">
        <div class="title">{{ supplierInfo.name }}</div>
        <ul class="msg-list">
          <li>
            <span class="prefix">供应商类型：{{ supplierInfo.serviceType | getSupplierTypeName }}</span>
            <span>创建时间：{{ supplierInfo.createTime | dateFormat }}</span>
          </li>
          <li>
            <span class="prefix">合 作 状 态：{{ supplierInfo.workState | getWorkStateName }}</span>
            <span>审核状态：{{ supplierInfo.stateName }}</span>
          </li>
          <li>
            <span class="prefix">创&nbsp; 建&nbsp;人：{{ supplierInfo.creatorName | emptyTip }}</span>
            <span>审&nbsp;&nbsp; 核&nbsp;&nbsp; 人：{{ supplierInfo.auditName | emptyTip }}</span>
          </li>
          <li v-if="supplierInfo.workState == '2'">
            <span class="prefix">签约时间：{{ supplierInfo.onSignTime | dateFormat }}</span>
            <span>签约公司：{{ supplierInfo.ncCompanyName | emptyTip }}</span>
          </li>
          <li v-if="supplierInfo.workState == 3">
            <span>解约时间：{{ supplierInfo.offSignTime | dateFormat }}</span>
          </li>
        </ul>
      </div>
    </div>

    <el-alert
    v-if="supplierInfo.state === 3"
      title="审核不通过"
      type="error"
      :description="supplierInfo.auditReason"
      :closable="false"
      show-icon
      ></el-alert>

    <div class="supplier-info-tab">
      <supplier-info :supplier-info="supplierInfo"></supplier-info>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { SupplierMsgRes, SupplierInfoData } from '@/interface';
import SupplierInfo from './supplier-info.vue';

@Component({
  filters: {
    getSupplierTypeName(v: number) {
      const types = [
        '',
        'Proposal',
        'KOL Purchasing',
        'Media Purchasing',
        'Copy Writing',
        'Layout',
        'lllustration',
        'Shooting',
        'Video Production',
        'Talent Fee', 'Server',
        'Technical Production',
        'Tracking and Reporting',
        'Print',
        'Administration',
        'Others',
      ];
      return types[v];
    },
    getWorkStateName(v: number) {
      const names = ['', '接触中', '合作中', '已解约'];
      return names[v];
    },
  },
  components: {
    SupplierInfo,
  },
})
export default class SupplierHome extends Vue {
  profession: {label: string, prop: string}[] = [];

  supplierInfo: SupplierInfoData | {} = {};

  async created() {
    await Promise.all([
      (async () => {
        /* 供应商数据 */
        const supplierDataRes = await Network.fetch<SupplierMsgRes>('getSupplierMsg', { id: this.$route.params.id });
        this.supplierInfo = supplierDataRes.data.retData;
      })(),
    ]);
  }
}
</script>
