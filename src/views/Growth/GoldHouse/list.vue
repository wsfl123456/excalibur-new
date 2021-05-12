<template>
  <div class="list">
    <div class="item" ref="item" @click="toPush(i.houseId)" v-for="(i, k) in list" :key="k">
      <div class="scale">
        <el-image class="image" :src="i.picture" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <div class="info">
        <div class="title">{{ i.title }}</div>
        <div class="label">
          <span effect="plain">{{ i.tagText }}</span>
        </div>
        <div class="user">
          <header-pic
            :paramInfo="{ id: i.creatorId, enName: i.creatorName, headerPic: i.creatorHeadPic }"
          ></header-pic>
          <span class="update">{{ i.creatorName }}更新于{{ i.lastModifyTime }}</span>
        </div>
        <div
          class="create"
        >发布时间：{{i.pubTime ? i.pubTime.substring(0, 10) : '无'}} &nbsp;| &nbsp;发布机构：{{i.pubCompany}}</div>
      </div>
    </div>
    <!-- <el-dialog
      class="dialog"
      title="文件简介"
      :visible.sync="visibleDialog"
      :close-on-click-modal="false"
      width="600px"
      top="20vh"
      center
    >
      <div class="dialog-content">
        <div>
          <div>
            <span>下载地址：</span>
          </div>
          <div class="address">
            <div>
              <span>Win地址：</span>
              <span>{{ dialogInfo.fileAddressWindows }}</span>
              <el-tooltip effect="dark" content="复制地址" placement="right">
                <el-button
                  type="info"
                  icon="el-icon-document-copy"
                  size="mini"
                  circle
                  style="margin-left:5px"
                  v-clipboard:copy="dialogInfo.fileAddressWindows"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                ></el-button>
              </el-tooltip>
            </div>
            <div>
              <span>Mac地址：</span>
              <span>{{ dialogInfo.fileAddress }}</span>
              <el-tooltip effect="dark" content="复制地址" placement="right">
                <el-button
                  type="info"
                  icon="el-icon-document-copy"
                  size="mini"
                  circle
                  style="margin-left:5px"
                  v-clipboard:copy="dialogInfo.fileAddress"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div>
          <div>文件简介：</div>
          <div v-html="dialogInfo.content" class="summary"></div>
        </div>
      </div>
    </el-dialog>-->
  </div>
</template>
<script lang="ts">
import './index.less';
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { Message } from 'element-ui';
import Network from '@/network';
import { HouselistfrontList } from '@/interface';
import HeaderPic from '@/components/headerPic/index.vue';

interface DialogInfo {
  houseId: number | null;
  fileAddress: string;
  fileAddressWindows: string;
  content: string;
}

@Component({
  components: {
    HeaderPic,
  },
})
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] })
  readonly list!: HouselistfrontList[];

  //  @Watch("") handleTabChange(tipsId: number) {
  //   if (tipsId) this.getMapdetailfront(tipsId);
  // }

  visibleDialog: boolean = false;

  dialogInfo: DialogInfo = {
    houseId: null,
    fileAddress: '',
    fileAddressWindows: '',
    content: '',
  };

  ImageHeight: string = '';

  toPush(id: number) {
    const routeData = this.$router.push({
      name: 'goldHouseDetail',
      params: {
        id: String(id),
      },
    });
    // window.open(routeData.href, '_blank');
  }

  onCopy() {
    Message.success('已成功复制到剪切板');
  }

  onError() {
    Message.error('复制失败');
  }

  showDialog(i: DialogInfo) {
    this.dialogInfo = i;
    this.visibleDialog = true;
    Network.fetch('gethousedetailfront', { houseId: i.houseId });
  }
}
</script>
