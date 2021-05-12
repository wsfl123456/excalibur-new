<template>
  <div class="weaponry-list">
    <div v-for="(i, k) in list" :key="k"  @click="toPush(i.storeId)">

      <div class="file-content">
        <div class="header">{{ i.title }}</div>
        <div class="user">
          <header-pic
            :paramInfo="{id: i.creatorId, enName: i.creatorName, headerPic: i.creatorHeadPic}"
          ></header-pic>
          <span>{{ i.creatorName }}</span>
          <span>{{ i.lastModifyTime }}</span>
        </div>
        <ul>
          <li v-for="(file, key) in i.fileContent" :key="key">
            <a href="javascript:;" style="font-size:14px">{{ file.fileName }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- <el-dialog
      title="文件预览"
      :visible.sync="visibleDialog"
      :close-on-click-modal="false"
      width="600px"
      top="20vh"
      center
    >
      <div class="dialog-content">
        <div class="title">
          <div>
            <span>{{dialogFile.fileName }}</span>
            <span>{{ toSize(Number(dialogFile.fileSize)) }}</span>
          </div>
          <div>{{ dialogInfo.creatorName }}更新于{{ dialogInfo.lastModifyTime }}</div>
        </div>
        <div class="summary">
          <div>文件简介：</div>
          <div v-html="dialogFile.summary"></div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="downloadFile">下载文件</el-button>
        <a class="download" :href="dialogFile.filePath" :download="dialogFile.fileName">下载文件</a>
      </span>
    </el-dialog> -->
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Storelistfront } from '@/interface';
import Network from '@/network';
import HeaderPic from '@/components/headerPic/index.vue';
import { bytesToSize } from '@/util';

interface DialogInfo {
  storeId: number | null,
  creatorName: string;
  lastModifyTime: string;
}

interface DialogFile {
  fileName: string;
  filePath: string;
  summary: string;
  fileSize: string;
}

@Component({
  components: {
    HeaderPic,
  },
})
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: Storelistfront[];

  visibleDialog: boolean = false;

  dialogInfo: DialogInfo = {
    storeId: null,
    creatorName: '',
    lastModifyTime: '',
  };

  dialogFile: DialogFile = {
    fileName: '',
    filePath: '',
    summary: '',
    fileSize: '',
  };

  toPush(id: number) {
    const routeData = this.$router.push({
      name: 'weaponryDetail',
      params: {
        id: String(id),
      },
    });
  }

  toSize(size: number) {
    return size ? bytesToSize(size) : '';
  }

  showDialog(info: DialogInfo, file: DialogFile) {
    this.dialogInfo = info;
    this.dialogFile = file;
    this.visibleDialog = true;
    Network.fetch('getStoredetailfront', { storeId: info.storeId });
  }

  // downloadFile() {
  //   window.open(this.dialogFile.filePath);
  //   let a = document.createElement('a');
  //   a.href = this.dialogFile.filePath;
  //   a.download = this.dialogFile.fileName;
  //   node.dispatchEvent(new MouseEvent('click'))
  // }
}
</script>
