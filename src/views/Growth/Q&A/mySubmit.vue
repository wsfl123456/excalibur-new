<template>
  <div class="qa-my_submit">
    <div class="content">
      <el-tabs v-model="activeTab" type="border-card" @tab-click="tabClick()">
        <el-tab-pane :name="tabsName.MyQuestion" label="我的问题">
          <div class="serach">
            <el-input v-model="searchKeyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <MyQuestionList
            :list="myQuestionList"
            @changeContent="getList()"
            v-if="myQuestionList.length > 0"
          ></MyQuestionList>
          <div class="no-answer" v-else>没有结果</div>
        </el-tab-pane>
        <el-tab-pane :name="tabsName.MyAnswer" label="我的回答">
          <div class="serach">
            <el-input v-model="searchKeyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <MyAnswerList
            :list="myAnswerList"
            @changeContent="getList()"
            v-if="myAnswerList.length > 0"
          ></MyAnswerList>
          <div class="no-answer" v-else>没有结果</div>
        </el-tab-pane>
        <el-tab-pane :name="tabsName.MySolution" label="我上传的案例">
          <div class="serach">
            <el-input v-model="searchKeyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <MySolutionList
            :list="mySolutionList"
            @changeContent="getList()"
            v-if="mySolutionList.length > 0"
          ></MySolutionList>
          <div class="no-answer" v-else>没有结果</div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import MyQuestionList from './myQuestionList.vue';
import MyAnswerList from './myAnswerList.vue';
import MySolutionList from './mySolutionList.vue';
import Network from '@/network';
import {
  QATable,
  QATableRes,
  QAAnswerTable,
  QAAnswerTableRes,
  QASolutionTable,
  QASolutionTableRes,
} from '@/interface';
import { getCookie } from '../../../util';

enum TabsName {
  MyQuestion = 'MyQuestion',
  MyAnswer = 'MyAnswer',
  MySolution = 'MySolution'
}

const userInfo = JSON.parse(
  decodeURIComponent(getCookie('userInfo') as string),
);

@Component({
  components: {
    MyQuestionList,
    MyAnswerList,
    MySolutionList,
  },
})
export default class Weaponry extends Vue {
  tabsName: any = {
    MyQuestion: TabsName.MyQuestion,
    MyAnswer: TabsName.MyAnswer,
    MySolution: TabsName.MySolution,
  };

  activeTab: TabsName = TabsName.MyQuestion;

  searchKeyword: string = '';

  myQuestionList: QATable[] = [];

  myAnswerList: QAAnswerTable[] = [];

  mySolutionList: QASolutionTable[] = [];

  tabClick() {
    let label = '';
    if (this.activeTab === 'MyQuestion') {
      label = '我的问题';
    } else if (this.activeTab === 'MyAnswer') {
      label = '我的回答';
    } else if (this.activeTab === 'MySolution') {
      label = '我上传的案例';
    }
    this.getList();
  }

  search() {
    this.getList();
  }

  get queryType() {
    return this.$route.query.type;
  }

  async getQuestionList() {
    const params = {
      isFinish: 0,
      keyword: this.searchKeyword,
      pageSize: 1000,
      creatorId: userInfo.id,
    };
    const qATableRes = await Network.fetch<QATableRes>(
      'qAQuestionList',
      params,
    );
    this.myQuestionList = qATableRes.data.retData.tipsList;
  }

  async getAnswerList() {
    const params = {
      keyword: this.searchKeyword,
      pageSize: 1000,
      creatorId: userInfo.id,
    };
    const qAAnswerTableRes = await Network.fetch<QAAnswerTableRes>(
      'qAAnswerList',
      params,
    );
    this.myAnswerList = qAAnswerTableRes.data.retData.tipsList;
  }

  async getSolutionList() {
    const params = {
      keyword: this.searchKeyword,
      pageSize: 1000,
      creatorId: userInfo.id,
    };
    const qASolutionTableRes = await Network.fetch<QASolutionTableRes>(
      'qASolutionList',
      params,
    );
    this.mySolutionList = qASolutionTableRes.data.retData.tipsList;
  }

  async getList() {
    switch (this.activeTab) {
      case TabsName.MyQuestion:
        this.getQuestionList();
        break;
      case TabsName.MyAnswer:
        this.getAnswerList();
        break;
      case TabsName.MySolution:
        this.getSolutionList();
        break;
      default:
        break;
    }
  }

  async created() {
    if (this.queryType) this.activeTab = this.queryType as TabsName;
    this.getList();
  }
}
</script>
