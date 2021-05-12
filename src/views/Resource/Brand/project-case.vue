<template>
  <div class="project-case">
    <ul class="nav-tags">
      <li>
        <span>标签：</span>
        <span
          v-for="(i, key) in tags"
          :key="key"
          @click="switchCaseTag(i.prop)"
          :class="[currentTag === i.prop && 'active']">{{ i.label }}</span>
      </li>
      <li>
        <span>状态：</span>
        <span
          v-for="(i, key) in state"
          :key="key"
          @click="switchCaseState(i.prop)"
          :class="[currentState === i.prop && 'active']">{{ i.label }}</span>
      </li>
    </ul>
    <el-button
      class="upload-btn"
      type="primary"
      icon="el-icon-upload"
      @click="$emit('switch-page', 'upload')">
      上传案例
    </el-button>
    <span class="clear"></span>
    <ul class="thumb-wrapper">
      <li class="thumb" @click="goToDetail(thumb.id)" v-for="(thumb, key) in projectCaseData" :key="key">
        <img :src="thumb.thumb" />
        <div class="font-desc">
          <div class="main">
            <span class="title">{{ thumb.name }}</span>
            <el-tooltip popper-class="brand-case-tooltip" placement="bottom">
              <div class="tooltip-content" slot="content">
                <div class="title">
                  <i class="el-icon-warning"></i>
                  <span>请复制公盘地址后，在浏览器中打开</span>
                </div>
                <div class="address">
                  <span>地址：<span ref="copyText">{{ thumb.url }}</span></span>
                  <el-button type="text" @click="copyText(thumb.url)">复制地址</el-button>
                </div>
              </div>
              <span class="download-btn">下载地址</span>
            </el-tooltip>
          </div>
          <div class="appendix">
            <span class="type">{{ thumb.type }}</span>
            <span class="right">
              <span>{{ thumb.user }}</span>
              <span>{{ thumb.date }}</span>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { ProjectCaseTagRes, ProjectCaseStateRes, ProjectCaseListRes } from '@/interface';

interface NavItem {
  label: string,
  prop: string,
}

interface ProjectCaseThumb {
  id: number,
  name: string,
  thumb: string,
  type: string,
  url: string,
  user: string,
  date: Date | string,
}

@Component
export default class ProjectCase extends Vue {
  currentTag: string = '';

  currentState: string = '';

  tags: NavItem[] = [];

  state: NavItem[] = [];

  projectCaseData: ProjectCaseThumb[] = [];

  async created() {
    this.getProjectCaseLists();

    return Promise.all([
      (async () => {
        /* 案例标签列表 */
        const projectCaseTagsRes = await Network.fetch<ProjectCaseTagRes>('getProjectCaseTags');
        this.tags = projectCaseTagsRes.data.retData.data.map(i => ({
          label: i.name,
          prop: String(i.id),
        }));
      })(),
      (async () => {
        /* 案例状态列表 */
        const projectCaseStateRes = await Network.fetch<ProjectCaseStateRes>('getProjectCaseState');
        this.state = projectCaseStateRes.data.retData.data.map(i => ({
          label: i.name,
          prop: String(i.id),
        }));
      })(),
    ]);
  }

  async getProjectCaseLists() {
    const projectCaseListRes = await Network.fetch<ProjectCaseListRes>('getProjectCaseList', {
      customerId: this.$route.params.id,
      tagId: this.currentTag,
      typeId: this.currentState,
      page: 1,
      pageSize: 1000,
    });

    this.projectCaseData = projectCaseListRes.data.retData.caseList.map(i => ({
      id: i.caseId,
      name: i.title,
      thumb: i.picture,
      type: i.typeName,
      url: i.fileAddress,
      user: i.creatorName,
      date: i.createTime,
    }));
  }

  switchCaseTag(tag: string) {
    this.currentTag = this.currentTag === tag ? '' : tag;
    return this.getProjectCaseLists();
  }

  switchCaseState(state: string) {
    this.currentState = this.currentState === state ? '' : state;
    return this.getProjectCaseLists();
  }

  copyText(text: string) {
    window.navigator.clipboard.writeText(text)
      .then(() => {
        this.$message.success('复制成功');
      })
      .catch(() => {
        this.$message.error('当前浏览器不支持复制功能');
      });
  }

  goToDetail(id: number) {
    this.$emit('switch-page', 'detail', id);
  }
}
</script>
