<template>
  <div class="staff-daily">

    <div class="list" v-loading="isLoading">
      <el-tabs v-model="serachParams.bangdan" type="border-card" @tab-click="tabClick()">
        <el-tab-pane name="hot" label="最热榜单">
          <div class="serach">
            <el-input v-model="serachParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="staffList" listType="hotList" v-if="staffList.length"></list>
          <div class="no-answer" v-else>没有结果，请点击添加问题直接输入想要了解的问题，收到问题后，答案会定期公布在最新列表中</div>
        </el-tab-pane>
        <el-tab-pane name="new" label="最新列表">
          <div class="serach">
            <el-input v-model="serachParams.keyword" placeholder="请在此输入关键字进行搜索"></el-input>
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
          <list :list="staffList" listType="newList" v-if="staffList.length"></list>
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
  Collegelist,
  CollegelistRes,
  Maplistfront,
  MaplistfrontRes,
  Mapaddask,
} from '@/interface';
import BackTop from '@/components/BackTop/index.vue';
import Network from '@/network';
import List from './list.vue';
import AddQuestion from '@/components/AddQuestions/index.vue';


interface StaffMapParams {
  typeId: number;
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

  visibleDialog: boolean = false;

  mapAddTitle: string = '';

  collegelist: Collegelist[] = [];

  staffList: Maplistfront[] = [];

  serachParams: StaffMapParams = {
    typeId: 111,
    keyword: '',
    bangdan: 'new',
    pageSize: 1000,
  };

  tabClick() {
    const label = this.serachParams.bangdan === 'new' ? 'A10' : 'A9';
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
      eventCategory: 'A11',
      eventAction: 'A11',
      eventLabel: 'A11',
      eventValue: 500,
    });
  }

  async getMapList() {
    this.isLoading = true;
    const maplistfrontRes = await Network.fetch<MaplistfrontRes>(
      'getMaplistfront',
      this.serachParams,
    );
    this.staffList = maplistfrontRes.data.retData.tipsList;
    this.isLoading = false;
  }


  async mapaddask() {
    const params = {
      typeId: 111,
      title: this.mapAddTitle,
    };
    const mapaddaskRes = await Network.fetch<Mapaddask>(
      'mapaddask',
      params,
    );

    if (mapaddaskRes.data.retCode === 0) {
      this.visibleDialog = false;
      Message.success('提问成功');
    }
  }


  async created() {
    if (this.$route.query.id) this.serachParams.bangdan = 'new';

    this.getMapList();
  }
}
</script>
