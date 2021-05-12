<template>
  <div class="supplier-list">
    <div class="list-wrapper" v-for="(list, category) in getCategorySuppliers" :key="category">
      <template v-if="list.length">
        <div class="category">{{ category }}</div>
        <div class="brands">
          <router-link
            :key="key"
            class="item"
            v-for="(supplier, key) in list"
            :to="{name: 'supplierHome', params: {id: supplier.id}}">
            <el-avatar class="avatar" :src="supplier.img">{{ supplier.name }}</el-avatar>
            <span class="name">{{ supplier.name }}</span>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SupplierMsg, ProfessionListRes } from '@/interface';
import Network from '@/network';

interface SupplierCategoryList {
  [index: string]: SupplierMsg[],
}

@Component
export default class SupplierList extends Vue {
  @Prop({ type: Array, required: true }) readonly suppliers!: SupplierMsg[];

  professionList = [
    {
      label: '全部',
      prop: '',
    },
    {
      label: 'Proposal',
      prop: '1',
    },
    {
      label: 'KOL Purchasing',
      prop: '2',
    },
    {
      label: 'Media Purchasing',
      prop: '3',
    },
    {
      label: 'Copy Writing',
      prop: '4',
    },
    {
      label: 'Layout',
      prop: '5',
    },
    {
      label: 'lllustration',
      prop: '6',
    },
    {
      label: 'Shooting',
      prop: '7',
    },
    {
      label: 'Video Production',
      prop: '8',
    },
    {
      label: 'Talent Fee',
      prop: '9',
    },
    {
      label: 'Server',
      prop: '10',
    },
    {
      label: 'Technical Production',
      prop: '11',
    },
    {
      label: 'Tracking and Reporting',
      prop: '12',
    },
    {
      label: 'Print',
      prop: '13',
    },
    {
      label: 'Administration',
      prop: '14',
    },
    {
      label: 'Others',
      prop: '15',
    },
  ];

  get getCategorySuppliers() {
    /* 初始化行业列表 */
    const supplierCategoryList: SupplierCategoryList = {};
    this.professionList.forEach((i) => {
      supplierCategoryList[i.label] = [];
    });

    this.suppliers.forEach((i) => {
      const professions = supplierCategoryList[i.category];
      if (professions) professions.push(i);
    });
    return supplierCategoryList;
  }
}
</script>
