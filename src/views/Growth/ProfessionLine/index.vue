<template>
  <div class="profession-line">
    <div class="filter">
      <el-tabs v-model="serachParams.collegeId" type="border-card" @tab-click="handleCollegeChange">
        <el-tab-pane :name="i.collegeId" :label="i.title" v-for="(i, k) in collegelist" :key="k">
          <el-radio-group
            v-show="serachParams.collegeId !== '0'"
            v-model="serachParams.studyId"
            style="padding:15px"
          >
            <el-radio label="0" @change="getMapList()">全部</el-radio>
            <el-radio
              :label="study.studyId"
              v-for="(study, key) in i.item"
              :key="key"
              @change="getMapList()"
            >{{ study.title }}</el-radio>
          </el-radio-group>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="list" v-loading="isLoading">
      <el-tabs v-model="serachParams.bangdan" type="border-card" @tab-click="tabClick">
        <el-tab-pane name="hot" label="最热榜单">
          <div class="serach">
            <el-input v-model="serachParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="lineList" listType="hotList" v-if="lineList.length > 0"></list>
          <div class="no-answer" v-else>没有结果，请点击添加问题直接输入想要了解的问题，收到问题后，答案会定期公布在最新列表中</div>
        </el-tab-pane>
        <el-tab-pane name="new" label="最新列表">
          <div class="serach">
            <el-input v-model="serachParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="lineList" listType="newList" v-if="lineList.length > 0"></list>
          <div class="no-answer" v-else>没有结果，请点击添加问题直接输入想要了解的问题，收到问题后，答案会定期公布在最新列表中</div>
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
import { Message } from 'element-ui';
import {
  MenuInfo,
  NavMenuItem,
  Collegelist,
  CollegelistRes,
  Maplistfront,
  MaplistfrontRes,
} from '@/interface';
import BackTop from '@/components/BackTop/index.vue';
import AddQuestion from '@/components/AddQuestions/index.vue';
import Network from '@/network';
import List from './list.vue';

interface LineMapParams {
  typeId: number;
  collegeId: string;
  studyId: string;
  keyword: string;
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
export default class Growth extends Vue {
  isLoading: boolean = true;

  collegelist: Collegelist[] = [];

  lineList: Maplistfront[] = [];

  serachParams: LineMapParams = {
    typeId: 112,
    collegeId: '0',
    studyId: '0',
    keyword: '',
    bangdan: 'new',
    pageSize: 1000,
  };

  tabClick() {
    const label = this.serachParams.bangdan === 'new' ? 'A5' : 'A4';
    this.getMapList();
    this.$ga.event({
      eventCategory: label,
      eventAction: label,
      eventLabel: label,
      eventValue: 500,
    });
  }

  search() {
    this.getMapList();
    this.$ga.event({
      eventCategory: 'A6',
      eventAction: 'A6',
      eventLabel: 'A6',
      eventValue: 500,
    });
  }

  async getMapList() {
    this.isLoading = true;
    const collegelistRes = await Network.fetch<MaplistfrontRes>(
      'getMaplistfront',
      this.serachParams,
    );
    this.lineList = collegelistRes.data.retData.tipsList;
    this.isLoading = false;
  }

  async handleCollegeChange() {
    switch (this.serachParams.collegeId) {
      case '1':
        this.$ga.event({
          eventCategory: 'A1',
          eventAction: 'A1',
          eventLabel: 'A1',
          eventValue: 500,
        });
        break;
      case '2':
        this.$ga.event({
          eventCategory: 'A2',
          eventAction: 'A2',
          eventLabel: 'A2',
          eventValue: 500,
        });
        break;
      case '3':
        this.$ga.event({
          eventCategory: 'A3',
          eventAction: 'A3',
          eventLabel: 'A3',
          eventValue: 500,
        });
        break;
      default:
        break;
    }
    this.serachParams.studyId = '0';
    this.serachParams.keyword = '';
    this.getMapList();
  }

  async created() {
    if (this.$route.query.id) this.serachParams.bangdan = 'new';

    await Promise.all([
      (async () => {
        const collegelistRes = await Network.fetch<CollegelistRes>(
          'getCollegelist',
          { collegeId: '1,2,3' },
        );
        this.collegelist = collegelistRes.data.retData.data;
      })(),
      this.getMapList(),
    ]);
  }
}
</script>
