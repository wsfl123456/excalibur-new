<template>
  <div class="weaponry">
    <div class="filter">
      <div>
        <div class="label">学 院</div>
        <el-radio-group v-model="searchParams.collegeId" class="radio-group">
          <el-radio
            :label="Number(i.collegeId)"
            v-for="(i, k) in collegeList"
            :key="k"
            @change="getWeaponryList()"
          >{{ i.title }}</el-radio>
        </el-radio-group>
      </div>
      <div>
        <div class="label">属 性</div>
        <el-radio-group v-model="searchParams.shuxingId" class="radio-group">
          <el-radio
            :label="i.shuxingId"
            v-for="(i, k) in propertyList"
            :key="k"
            @change="getWeaponryList()"
          >{{ i.shuxingName }}</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="content" v-loading="isLoading">
      <el-tabs v-model="searchParams.bangdan" type="border-card" @tab-click="tabClick()">
        <el-tab-pane name="hot" label="最热榜单">
          <div class="serach">
            <el-input v-model="searchParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="weaponryList" v-if="weaponryList.length > 0"></list>
          <div class="no-answer" v-else>没有结果</div>
        </el-tab-pane>
        <el-tab-pane name="new" label="最新列表">
          <div class="serach">
            <el-input v-model="searchParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="weaponryList" v-if="weaponryList.length > 0"></list>
          <div class="no-answer" v-else>没有结果</div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <add-question></add-question>

    <back-top></back-top>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import List from './list.vue';
import {
  Collegelist,
  CollegelistRes,
  Storeshuxing,
  StoreshuxingRes,
  Storelistfront,
  StorelistfrontRes,
} from '@/interface';
import BackTop from '@/components/BackTop/index.vue';
import Network from '@/network';
import AddQuestion from '@/components/AddQuestions/index.vue';

interface WeaponryListSearchParams {
  keyword: string;
  collegeId: number;
  shuxingId: number;
  bangdan: string;
  pageSize: number;
}

@Component({
  components: {
    List,
    BackTop,
    AddQuestion,
  },
})
export default class Weaponry extends Vue {
  searchParams: WeaponryListSearchParams = {
    keyword: '',
    collegeId: 0,
    shuxingId: 0,
    bangdan: 'new',
    pageSize: 10000,
  };

  isLoading: boolean = true;

  weaponryList: Storelistfront[] = [];

  collegeList: Collegelist[] = [];

  propertyList: Storeshuxing[] = [];

  tabClick() {
    const label = this.searchParams.bangdan === 'new' ? 'A15' : 'A14';
    this.getWeaponryList();
    this.$ga.event({
      eventCategory: label,
      eventAction: label,
      eventLabel: label,
      eventValue: 500,
    });
  }

  search() {
    this.getWeaponryList();
    this.$ga.event({
      eventCategory: 'A16',
      eventAction: 'A16',
      eventLabel: 'A16',
      eventValue: 500,
    });
  }

  async getWeaponryList() {
    this.isLoading = true;

    const storelistfrontRes = await Network.fetch<StorelistfrontRes>(
      'getStorelistfront',
      this.searchParams,
    );
    this.weaponryList = storelistfrontRes.data.retData.tipsList;
    this.isLoading = false;
  }

  async created() {
    await Promise.all([
      (async () => {
        const collegelistRes = await Network.fetch<CollegelistRes>(
          'getCollegelist',
        );
        const defaultCollege = [
          {
            collegeId: '0',
            title: '全部',
            item: [],
          },
        ];
        this.collegeList = [
          ...defaultCollege,
          ...collegelistRes.data.retData.data,
        ];
      })(),
      (async () => {
        const propertyRes = await Network.fetch<StoreshuxingRes>(
          'getStoreShuXingList',
        );

        const defaultProperty = [
          {
            shuxingId: 0,
            shuxingName: '全部',
          },
        ];
        this.propertyList = [
          ...defaultProperty,
          ...propertyRes.data.retData.shuxingList,
        ];
      })(),
      this.getWeaponryList(),
    ]);
  }
}
</script>
