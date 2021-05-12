<template>
  <div class="gold-house">
    <div class="filter">
      <div class="label">学 院</div>
      <el-radio-group v-model="searchParams.collegeId" class="radio-group">
        <el-radio
          :label="Number(i.collegeId)"
          v-for="(i, k) in collegeList"
          :key="k"
          @change="getGoldHouseList()"
        >{{ i.title }}</el-radio>
      </el-radio-group>
    </div>

    <div class="content" v-loading="isLoading">
      <el-tabs v-model="searchParams.bangdan" type="border-card" @tab-click="tabClick()">
        <el-tab-pane name="hot" label="最热榜单">
          <div class="serach">
            <el-input v-model="searchParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="goldhouseList" v-if="goldhouseList.length > 0"></list>
          <div class="no-answer" v-else>没有结果</div>
        </el-tab-pane>
        <el-tab-pane name="new" label="最新列表">
          <div class="serach">
            <el-input v-model="searchParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="goldhouseList" v-if="goldhouseList.length > 0"></list>
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
  HouselistfrontList,
  HouselistfrontRes,
} from '@/interface';
import BackTop from '@/components/BackTop/index.vue';
import Network from '@/network';
import AddQuestion from '@/components/AddQuestions/index.vue';

interface GoldHouseListSearchParams {
  collegeId: number;
  bangdan: string;
  keyword: string;
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
  searchParams: GoldHouseListSearchParams = {
    collegeId: 0,
    bangdan: 'new',
    keyword: '',
    pageSize: 10000,
  };

  isLoading: boolean = true;

  goldhouseList: HouselistfrontList[] = [];

  collegeList: Collegelist[] = [];

  tabClick() {
    const label = this.searchParams.bangdan === 'new' ? 'A20' : 'A19';
    this.getGoldHouseList();
    this.$ga.event({
      eventCategory: label,
      eventAction: label,
      eventLabel: label,
      eventValue: 500,
    });
  }

  search() {
    this.getGoldHouseList();
    this.$ga.event({
      eventCategory: 'A21',
      eventAction: 'A21',
      eventLabel: 'A21',
      eventValue: 500,
    });
  }

  windowGa(btn: string) {
    const win: any = window;
    console.log(win.ga);

    if (win.ga) {
      win.ga('set', {
        page: `${this.$route.path}?btn=${btn}`,
        title: `${this.$route.name}/${btn}`,
      });
      win.ga('send', 'pageview');
    }
  }

  async getGoldHouseList() {
    this.isLoading = true;

    const houselistfront = await Network.fetch<HouselistfrontRes>(
      'gethouselistfront',
      this.searchParams,
    );
    this.goldhouseList = houselistfront.data.retData.tipsList;
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
      this.getGoldHouseList(),
    ]);
  }
}
</script>
