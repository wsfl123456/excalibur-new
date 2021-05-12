<template>
  <div class="solution_case">
    <div class="list" v-loading="isLoading">
      <el-tabs v-model="serachParams.askState" type="border-card" @tab-click="getMapList()">
        <el-tab-pane name="1" label="待发布">
          <div class="serach">
            <el-input v-model="serachParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="getMapList()">搜索</el-button>
          </div>
          <list :list="list"  v-if="list.length" @changeContent="getMapList" :questionType="0"></list>
          <div class="no-answer" v-else>暂无数据</div>
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
  QASolutionTable,
  QASolutionTableRes,
} from '@/interface';
import BackTop from '@/components/BackTop/index.vue';
import Network from '@/network';
import List from './list.vue';

interface QASearchParams {
  askState: string;
  keyword: string;
  pageSize: number;
}

@Component({
  components: {
    List,
    BackTop,
  },
})
export default class Growth extends Vue {
  isLoading: boolean = true;

  list: QASolutionTable[] = [];

  serachParams: QASearchParams = {
    askState: '1',
    keyword: '',
    pageSize: 1000,
  };

  async getMapList() {
    this.isLoading = true;
    const qASolutionTableRes = await Network.fetch<QASolutionTableRes>(
      'qASolutionList',
      this.serachParams,
    );
    this.list = qASolutionTableRes.data.retData.tipsList;
    this.isLoading = false;
  }


  async created() {
    this.getMapList();
  }
}
</script>
