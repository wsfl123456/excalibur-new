<template>
  <div class="project-tree">
    <template v-if="!isEmptyData">
      <div class="tree" v-for="(org, k) in orgTreeList" :key="k">
        <p class="title">{{ org.name }}</p>
        <p class="name">项目组织框架</p>
        <div class="tree-table">
          <tree-chart :json="org.nodes"></tree-chart>
        </div>
      </div>
    </template>
    <template v-else>
      <p  style="text-align: center;" class="center">暂无数据~</p>
    </template>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { BrandProjectListRes, BrandOrgTreeRes } from '@/interface';

const TreeChart: any = require('vue-tree-chart');

interface OrgTree {
  name: string,
  nodes: {[index: string]: any};
}

/* 懒得写，瞎鸡儿写的 */
function convertPeopleToChart(nodes: any[]) {
  const treeObj: {[index: string]: string} = {};

  nodes.forEach((i) => {
    // eslint-disable-next-line no-param-reassign
    treeObj.name = `${i.title}\n${i.value && i.value[0].englishName}`;

    if (i.children) {
      i.children.forEach((k: any) => {
        // eslint-disable-next-line no-param-reassign
        k.name = k.title;
        // eslint-disable-next-line no-param-reassign
        if (k.userList) {
          k.userList.forEach((k2: any) => {
            // eslint-disable-next-line no-param-reassign
            k.name += `\n${k2.userName}`;
          });
        }

        if (k.children) {
          k.children.forEach((j: any) => {
            // eslint-disable-next-line no-param-reassign
            j.name = `${j.title}`;

            if (j.userList) {
              j.userList.forEach((j2: any) => {
                // eslint-disable-next-line no-param-reassign
                j.name += `\n${j2.userName}`;
              });
            }
          });
        }
      });
      treeObj.children = i.children;
    }
  });
  return treeObj;
}

@Component({
  components: {
    TreeChart,
  },
})
export default class ProjectTree extends Vue {
  orgTreeList: OrgTree[] = [];

  isEmptyData = false;

  async created() {
    const orgMsgRes = await Network.fetch<BrandProjectListRes>('getBrandProjectList', {
      page: 1,
      size: 5,
      customerId: this.$route.params.id,
      state: '6,7,8',
    });

    if (!orgMsgRes.data.retData.project_list.length) this.isEmptyData = true;

    orgMsgRes.data.retData.project_list.forEach(async (i) => {
      /* 推入节点数据 */
      const orgTreeNode: OrgTree = {
        name: i.name,
        nodes: [],
      };
      const projectTreeMsg = await Network.fetch<BrandOrgTreeRes>('getBrandOrgMsg', { projectId: i.id });
      orgTreeNode.nodes = convertPeopleToChart(projectTreeMsg.data.retData.data);

      this.orgTreeList.push(orgTreeNode);
    });
  }
}
</script>
