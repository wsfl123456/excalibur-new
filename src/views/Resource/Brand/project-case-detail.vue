<template>
  <div class="project-case-detail">
    <div class="back" @click="$emit('switch-page', 'list')">返回案例列表</div>
    <div class="title">
      <span>{{ caseDetail.title }}</span>
      <el-button type="primary" @click="$emit('switch-page', 'upload', id)">编辑案例</el-button>
      <span class="clear"></span>
    </div>
    <ul class="remark">
      <li>标签：<span>{{ caseDetail.tagName }}</span></li>
      <li>{{ caseDetail.creatorName }}</li>
      <li>{{ caseDetail.createTime | dateFormat }}</li>
    </ul>
    <div class="case-detail" v-html="caseDetail.content"></div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { ProjectCaseDetailRes, ProjectItemCaseDetail } from '@/interface';

@Component
export default class ProjectCaseDetail extends Vue {
  @Prop({ type: Number, required: true }) readonly id?: number;

  caseDetail: ProjectItemCaseDetail | {} = {};

  async created() {
    const projectCaseDetailRes = await Network.fetch<ProjectCaseDetailRes>('getProjectCaseDetail', {
      caseId: this.id,
    });
    this.caseDetail = projectCaseDetailRes.data.retData.caseInfo;
  }
}
</script>
