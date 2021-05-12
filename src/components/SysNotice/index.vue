<template>
  <div class="sys-notice">
    <el-dialog  width="70%"  :visible="showNotice"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false">
     <div slot="title">
         【{{typeConf[sysNoticeInfo.typeId]}}】{{sysNoticeInfo.title}}
     </div>
      <div v-html="sysNoticeInfo.content" class="content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="large" @click.native="closeNotice">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import { SysNoticeRes } from '@/interface';
import Network from '@/network';

@Component
export default class SysNotice extends Vue {
  typeConf: any = {
    1: 'EXCALIBUR',
    2: '人事部通知',
    3: '行政部通知',
    4: 'SDC通知',
    5: 'NCC通知',
    6: 'NHU通知',
  };

  sysNoticeInfo: any = {};

  get showNotice() {
    return this.sysNoticeInfo.id ? Number(localStorage.getItem('noticeGot')) !== this.sysNoticeInfo.id : false;
  }

  async created() {
    const params = {
      page: 1,
      pageSize: 1,
      state: 1,
      orderBy: 'lastModifyTime',
    };

    const sysNoticeRes = await Network.fetch<SysNoticeRes>('getNoticeList', params);
    const [data] = sysNoticeRes.data.retData.data;
    this.sysNoticeInfo = data;
  }

  closeNotice() {
    localStorage.setItem('noticeGot', this.sysNoticeInfo.id);
    this.sysNoticeInfo.id = null;
  }
}
</script>
