<template>
  <div class="goldhouse_detail">
    <router-link class="back" :to="{name: 'goldHouse'}">返回列表</router-link>

    <div class="goldhouse_detail-card">
      <div class="goldhouse_detail-card-header">
        <div>{{ tipsInfo.title }}</div>
        <div>
          <header-pic
            :paramInfo="{id: tipsInfo.creatorId, enName: tipsInfo.creatorName, headerPic: tipsInfo.creatorHeadPic}"
            style="margin-right:10px"
          ></header-pic>
          <span>{{ tipsInfo.creatorName }}更新于{{ tipsInfo.lastModifyTime }}</span>
          <span>发布时间：{{tipsInfo.pubTime ? tipsInfo.pubTime.substring(0, 10) : '无'}}</span>
          <span>发布机构：{{tipsInfo.pubCompany}}</span>
        </div>
      </div>
      <div class="goldhouse_detail-card-address">
        <div>下载地址：</div>
        <div>
          <span>Win地址：</span>
          <span>{{ tipsInfo.fileAddressWindows }}</span>
          <el-tooltip effect="dark" content="复制地址" placement="right">
            <el-button
              v-if="tipsInfo.fileAddressWindows"
              type="info"
              icon="el-icon-document-copy"
              size="mini"
              circle
              style="margin-left:5px"
              v-clipboard:copy="tipsInfo.fileAddressWindows"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            ></el-button>
          </el-tooltip>
        </div>
        <div>
          <span>Mac地址：</span>
          <span>{{ tipsInfo.fileAddress }}</span>
          <el-tooltip effect="dark" content="复制地址" placement="right">
            <el-button
            v-if="tipsInfo.fileAddress"
              type="info"
              icon="el-icon-document-copy"
              size="mini"
              circle
              style="margin-left:5px"
              v-clipboard:copy="tipsInfo.fileAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            ></el-button>
          </el-tooltip>
        </div>
      </div>

      <div class="goldhouse_detail-card-content">
        <div>文件简介：</div>
        <div class="goldhouse_detail-card-content-info" v-html="tipsInfo.content"></div>
      </div>
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

  onCopy() {
    Message.success('已成功复制到剪切板');
  }

  onError() {
    Message.error('复制失败');
  }

  async created() {
    await Promise.all([
      (async () => {
        const collegelistRes = await Network.fetch<any>('gethousedetailfront', {
          houseId: this.$route.params.id,
        });
        this.tipsInfo = collegelistRes.data.retData.tipsInfo;
      })(),
    ]);
  }
}
</script>
