<template>
  <div class="staff_detail">

    <router-link class="back" :to="{name: 'staffDaily'}">返回列表</router-link>

    <div class="staff_detail-card">
      <div class="staff_detail-card-header">
        <div>{{ tipsInfo.title }}</div>
        <div>
          <header-pic
            :paramInfo="{id: tipsInfo.creatorId, enName: tipsInfo.creatorName, headerPic: tipsInfo.creatorHeadPic}"
          ></header-pic>
          <span>{{ tipsInfo.creatorName }}</span>
          <span>{{ tipsInfo.lastModifyTime }}</span>
        </div>
      </div>
      <div class="staff_detail-card-content" v-html="tipsInfo.content"></div>
    </div>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import { Message } from 'element-ui';
import {} from '@/interface';
import Network from '@/network';
import HeaderPic from '@/components/headerPic/index.vue';

@Component({
  components: {
    HeaderPic,
  },
})
export default class GrowthDetail extends Vue {
  tipsInfo: any = {};

  async created() {
    await Promise.all([
      (async () => {
        const collegelistRes = await Network.fetch<any>('getMapdetailfront', {
          tipsId: this.$route.params.id,
        });
        this.tipsInfo = collegelistRes.data.retData.tipsInfo;
      })(),
    ]);
  }
}
</script>
