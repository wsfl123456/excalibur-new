<template>
  <div class="brand-home">
    <router-link class="back" :to="{name: 'brand'}">返回品牌列表</router-link>
    <div class="brand-info">
      <el-avatar class="img" :src="brandInfo.picture">{{ brandInfo.customerName }}</el-avatar>
      <div class="brand-intro">
        <div class="title">{{ brandInfo.customerName }}</div>
        <ul class="msg-list">
          <li>
            <span class="prefix">品牌类型：{{ brandTypeName }}</span>
            <span>创建时间：{{ brandInfo.createTime | dateFormat }}</span>
          </li>
          <li>
            <span class="prefix">合作状态：{{ brandInfo.workStateName }}</span>
            <span>审核状态：{{ brandInfo.state | getBrandAuditTypeName }}</span>
          </li>
          <li>
            <span class="prefix">创 建 人：{{ brandInfo.creatorInfo && brandInfo.creatorInfo.userName }}</span>
            <span>审 核 人：{{ brandInfo.auditInfo && brandInfo.auditInfo.userName }}</span>
          </li>
          <li>
            <span class="prefix">签约时间：{{ brandInfo.onSignTime | dateFormat }}</span>
            <span class="long">签约公司：{{ brandInfo.ncCompanyName | emptyTip }}</span>
          </li>
          <li v-if="brandInfo.workState == 3">
            <span>解约时间：{{ brandInfo.offSignTime | dateFormat }}</span>
          </li>
        </ul>
      </div>
    </div>

    <el-alert
    v-if="brandInfo.state === 3"
    title="审核不通过"
     type="error"
      :description="brandInfo.auditReason"
      :closable="false"
      show-icon
      ></el-alert>

    <el-tabs class="brand-info-tab" mode="horizontal" @input="switchTab">
      <el-tab-pane label="品牌主页">
        <brand-info :brand-info="brandInfo"></brand-info>
      </el-tab-pane>
      <el-tab-pane label="项目案例">
        <project-tree></project-tree>
      </el-tab-pane>
      <el-tab-pane label="项目分析">
        <project-analysis :re-render="reRenderChart" @rendered="reRenderChart = false"></project-analysis>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import BrandInfo from './brand-info.vue';
import ProjectCase from './project-case.vue';
import ProjectAnalysis from './analysis.vue';
import ProjectCaseDetail from './project-case-detail.vue';
import ProjectCaseUpload from './project-case-upload.vue';
import ProjectTree from './project-tree.vue';
import Network from '@/network';
import { BrandDataRes, ProfessionListRes } from '@/interface';

@Component({
  components: {
    BrandInfo,
    ProjectTree,
    ProjectCase,
    ProjectAnalysis,
    ProjectCaseDetail,
    ProjectCaseUpload,
  },
})
export default class BrandHome extends Vue {
  reRenderChart: boolean = false;

  projectCasePage: string = 'list';

  projectCaseId?: number = undefined;

  profession: { label: string; prop: string }[] = [];

  brandInfo: { [index: string]: any } = {};

  async created() {
    await Promise.all([
      (async () => {
        /* 品牌数据 */
        const brandDataRes = await Network.fetch<BrandDataRes>('getBrandData', {
          id: this.$route.params.id,
        });
        this.brandInfo = brandDataRes.data.retData;
      })(),
      (async () => {
        /* 行业列表 */
        const professionListRes = await Network.fetch<ProfessionListRes>(
          'getProfessionList',
        );
        professionListRes.data.retData.data.forEach((i) => {
          this.profession.push({
            label: i.industryName,
            prop: String(i.id),
          });
        });
      })(),
    ]);
  }

  get brandTypeName() {
    // eslint-disable-next-line eqeqeq
    const type = this.profession.find(i => i.prop == this.brandInfo.industry);
    return type && type.label;
  }

  switchTab(index: string) {
    if (index === '2') this.reRenderChart = true; // 当Tab切换到项目分析时渲染图表
  }

  switchProjectCasePage(page: string, id?: number) {
    this.projectCaseId = id;
    this.projectCasePage = page;
  }
}
</script>
