<template>
  <div class="weaponry_detail">
    <router-link class="back" :to="{name: 'nccWeaponry'}">返回列表</router-link>

    <div class="weaponry_detail-card">
      <div class="weaponry_detail-card-header">
        <div class="weaponry_detail-card-header-user">
          <div>{{ tipsInfo.title }}</div>
          <div>
            <header-pic
              :paramInfo="{id: tipsInfo.creatorId, enName: tipsInfo.creatorName, headerPic: tipsInfo.creatorHeadPic}"
            ></header-pic>
            <span>{{ tipsInfo.creatorName }}</span>
            <span>{{ tipsInfo.lastModifyTime }}</span>
          </div>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-download" @click="loadFile">下载文件</el-button>
        </div>
      </div>
      <div class="weaponry_detail-card-content">
        <div v-for="(col, k) in tipsInfo.fileContent" :key="k">
          <div class="weaponry_detail-card-content-title">
            <span>
              <i class="el-icon-document"></i>
              {{col.fileName }}
            </span>
            <span>{{ toSize(Number(col.fileSize)) }}</span>
          </div>
          <div class="weaponry_detail-card-content-content">
            <div>文件简介：</div>
            <div class="weaponry_detail-card-content-content-info"  v-html="col.summary"></div>
          </div>
        </div>
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
import { bytesToSize } from '@/util';

@Component({
  components: {
    HeaderPic,
  },
})
export default class GrowthDetail extends Vue {
  tipsInfo: any = {};

  toSize(size: number) {
    return size ? bytesToSize(size) : '';
  }

  loadFile() {
    this.tipsInfo.fileContent.forEach((e: any) => {
      const aDom = document.createElement('a'); // 创建标签
      const evt = document.createEvent('HTMLEvents'); // 创建事件
      evt.initEvent('click', false, false); // 初始化事件，绑定点击事件，不冒泡，不阻止浏览器默认行为
      aDom.download = e.fileName;
      aDom.href = encodeURI(e.filePath); // 对地址进行编码
      aDom.dispatchEvent(evt); // 触发事件
      aDom.click();
    });
  }

  async created() {
    await Promise.all([
      (async () => {
        const collegelistRes = await Network.fetch<any>('getStoredetailfront', {
          storeId: this.$route.params.id,
        });
        this.tipsInfo = collegelistRes.data.retData.tipsInfo;
      })(),
    ]);
  }
}
</script>
