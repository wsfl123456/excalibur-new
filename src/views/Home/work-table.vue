<template>
  <el-table :data="data" :max-height="255" @row-click="jump" border class="work-table">
    <el-table-column width="80" prop="workTypeName" label="类型" sortable></el-table-column>
    <el-table-column prop="name" label="名称" sortable></el-table-column>
    <el-table-column width="80" prop="stateNameMe" label="状态" sortable></el-table-column>
    <el-table-column width="150" prop="time" label="截止时间" sortable></el-table-column>
    <el-table-column width="150" prop="creatorEnName" label="创建者" sortable>
      <template slot-scope="scope">
        <span>{{ scope.row.creatorEnName }}</span>
        <el-tooltip :content="scope.row.level | getLevelMsg">
          <i class="el-icon-s-flag"
             v-if="[0, 1, 2].includes(scope.row.level )"
             :style="{
            color: parseInt(scope.row.level) === 2 ? '#ff8685' : parseInt(scope.row.level) === 1 ? '#ffe15b' : '#89ea97'
           }">
          </i>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import './index.less';
import { WorkItem } from '@/interface';
import Supplier from '../Resource/Supplier/index.vue';

@Component({
  filters: {
    getLevelMsg(level: number) {
      const levelMsg = ['距离deadline大于三天', '距离deadline不到三天', '距离deadline不到一天'];
      return levelMsg[level];
    },
  },
})
export default class WorkTable extends Vue {
  @Prop(Array) readonly data!: any[];

  jump(row: WorkItem) {
    const {
      customerId,
      projectId,
      workType,
      taskId,
      dataVersion,
      toolkitId,
      productId,
      supplyId,
    } = row;

    switch (workType) {
      case 'task':
      case 'hetong':
        /* 乱七八糟的规则，反正就是这样的 */
        if (dataVersion === 0 && (toolkitId === 19 || toolkitId === 20)) {
          this.$router.push(`/tasks/list/${customerId}/${projectId}?id=${taskId}&toolkitId=${0}`);
        } else {
          this.$router.push(`/tasks/list/${customerId}/${projectId}?id=${taskId}&toolkitId=${productId}`);
        }
        break;
      case 'project':
        this.$router.push(`/projects/list/${customerId}?id=${projectId}`);
        break;
      case 'taskBaoxiao':
        this.$router.push('/myReimburse/list');
        break;
      case 'taskWaichu':
        this.$router.push('/vacation/out');
        break;
      case 'vacation':
        this.$router.push('/vacation/audit');
        break;
      case 'equipment':
        this.$router.push('/myDevice/apply');
        break;
      case 'customer':
        this.$router.push({
          name: 'brandHome',
          params: {
            id: String(customerId),
          },
        });
        break;
      case 'supply':
        this.$router.push({
          name: 'supplierHome',
          params: {
            id: String(supplyId),
          },
        });
        break;
      default:
        break;
    }
  }
}
</script>
