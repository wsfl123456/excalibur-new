<template>
  <div class="answer_question">
    <div class="list" v-loading="isLoading">
      <el-tabs v-model="serachParams.askState" type="border-card" @tab-click="getMapList()">
        <el-tab-pane name="1" label="待发布">
          <div class="serach">
            <el-input v-model="serachParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="getMapList()">搜索</el-button>
          </div>

          <no-public-list v-if="noPublicList.length" :list="noPublicList" @changeContent="getMapList"></no-public-list>
          <div class="no-answer" v-else>暂无数据</div>
          <!-- <list :list="list"  v-if="list.length" @changeContent="getMapList" :questionType="0"></list>
          <div class="no-answer" v-else>暂无数据</div> -->
        </el-tab-pane>
        <el-tab-pane name="2" label="已发布">
          <div class="serach">
            <el-input v-model="serachParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="getMapList()">搜索</el-button>
          </div>
          <list :list="list" v-if="list.length" @changeContent="getMapList" :questionType="1"></list>
          <div class="no-answer" v-else>暂无数据</div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <back-top></back-top>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import { Message } from 'element-ui';
import {
  QAAnswerTable,
  QAAnswerTableRes,
} from '@/interface';
import BackTop from '@/components/BackTop/index.vue';
import Network from '@/network';
import List from './list.vue';
import NoPublicList from './noPublicList.vue';

interface QASearchParams {
  askState: string;
  keyword: string;
  pageSize: number;
}

@Component({
  components: {
    List,
    NoPublicList,
    BackTop,
  },
})
export default class Growth extends Vue {
  isLoading: boolean = true;

  list: QAAnswerTable[] = [];

  noPublicList: any = [];

  serachParams: QASearchParams = {
    askState: '1',
    keyword: '',
    pageSize: 1000,
  };

  async getMapList() {
    this.isLoading = true;
    const qAAnswerTableRes = await Network.fetch<QAAnswerTableRes>(
      'qAAnswerList',
      this.serachParams,
    );
    this.list = qAAnswerTableRes.data.retData.tipsList;
    this.noPublicList = qAAnswerTableRes.data.retData.questionList;
    this.isLoading = false;
  }


  async created() {
    this.getMapList();
  }
}
</script>
