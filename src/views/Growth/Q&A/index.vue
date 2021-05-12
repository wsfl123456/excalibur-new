<template>
  <div class="q_a">
    <div class="filter">
      <div class="label">学 院</div>
      <el-radio-group v-model="searchParams.collegeId" class="radio-group">
        <el-radio
          :label="Number(i.collegeId)"
          v-for="(i, k) in collegeList"
          :key="k"
          @change="getQAList()"
        >{{ i.title }}</el-radio>
      </el-radio-group>
    </div>

    <div class="serach">
      <el-input class="serach-input" v-model="searchParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
      <el-button class="serach-submit" type="primary" @click="search">搜索</el-button>
      <el-button class="serach-view" type="primary" @click="toPush" >
        <i class="el-icon-view"></i>查看我提交的
      </el-button>
    </div>

    <div v-loading="isLoading">
      <list :list="qAList" v-if="qAList.length"></list>
      <div class="no-answer" v-else>暂无数据</div>
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
  Collegelist, CollegelistRes, QATable, QATableRes,
} from '@/interface';
import BackTop from '@/components/BackTop/index.vue';
import AddQuestion from '@/components/AddQuestions/index.vue';
import Network from '@/network';

interface QASearchParams {
  collegeId: number;
  keyword: string;
  askState: number;
  isFinish: number;
  pageSize: number
}

@Component({
  components: {
    List,
    BackTop,
    AddQuestion,
  },
})
export default class QA extends Vue {
  searchParams: QASearchParams = {
    collegeId: 0,
    keyword: '',
    askState: 2,
    isFinish: 0,
    pageSize: 10000,
  };

  isLoading: boolean = false;

  qAList: QATable[] = [];

  collegeList: Collegelist[] = [];

  toPush() {
    this.$ga.event({
      eventCategory: 'A25',
      eventAction: 'A25',
      eventLabel: 'A25',
      eventValue: 500,
    });
    this.$router.push({ name: 'Q&AMySubmit' });
  }

  search() {
    this.getQAList();
    this.$ga.event({
      eventCategory: 'A24',
      eventAction: 'A24',
      eventLabel: 'A24',
      eventValue: 500,
    });
  }

  async getQAList() {
    this.isLoading = true;
    const qATableRes = await Network.fetch<QATableRes>(
      'qAQuestionList',
      this.searchParams,
    );
    this.qAList = qATableRes.data.retData.tipsList;
    this.isLoading = false;
  }

  async created() {
    await Promise.all([
      (async () => {
        const collegelistRes = await Network.fetch<CollegelistRes>(
          'getCollegelist',
          { collegeId: '1,2,3' },
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
      this.getQAList(),
    ]);
  }
}
</script>
