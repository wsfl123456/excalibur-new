<template>
  <div class="brand-list">
    <div class="list-wrapper" v-for="(list, category) in getCategoryBrands" :key="category">
      <template v-if="list.length">
        <div class="category">{{ category }}</div>
        <div class="brands">
          <router-link
            :key="key"
            class="item"
            v-for="(brand, key) in list"
            :to="{name: 'brandHome', params: {id: brand.id}}">
            <el-avatar class="avatar" :src="brand.img">{{ brand.name }}</el-avatar>
            <span class="name">{{ brand.name }}</span>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BrandMsg, ProfessionListRes } from '@/interface';
import Network from '@/network';

interface BrandCategoryList {
  [index: string]: BrandMsg[],
}

@Component
export default class BrandList extends Vue {
  @Prop({ type: Array, required: true }) readonly brands!: BrandMsg[];

  professionList: { id: number, industryName: string }[] = [];

  get getCategoryBrands() {
    /* 初始化行业列表 */
    const brandCategoryList: BrandCategoryList = {};
    this.professionList.forEach((i) => {
      brandCategoryList[i.industryName] = [];
    });

    this.brands.forEach((i) => {
      const professions = brandCategoryList[i.category];
      if (professions) professions.push(i);
    });
    return brandCategoryList;
  }

  created() {
    return this.getProfessionList();
  }

  async getProfessionList() {
    const professionList = await Network.fetch<ProfessionListRes>('getProfessionList');
    this.professionList = professionList.data.retData.data;
  }
}
</script>
