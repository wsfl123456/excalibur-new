<template>
  <div class="header-pic">
    <el-popover trigger="hover" placement="top" @show="getUserInfo">
      <div>
        <div v-loading="!userInfo.englishName">
          <h3>{{userInfo.englishName}} - {{userInfo.positionName}}</h3>
          <p>Email: {{userInfo.companyEmail}}</p>
        </div>
      </div>
      <el-avatar slot="reference" :size="paramInfo.size ? paramInfo.size : 25" :src="paramInfo.headerPic">
        {{ paramInfo.enName.substr(0, 2) }}
      </el-avatar>
    </el-popover>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { UserHeaderInfo, UserHeaderInfoRes } from '@/interface';

@Component
export default class HeaderPic extends Vue {
  @Prop(Object) readonly paramInfo!: {
    id: number;
    enName: string;
    headerPic: string;
    size?: number
  };

  userInfo: UserHeaderInfo = {
    englishName: '',
    companyEmail: '',
    positionName: '',
  };

  async getUserInfo() {
    const userInfo = await Network.fetch<UserHeaderInfoRes>('userInfo', {
      id: this.paramInfo.id,
    });
    this.userInfo = userInfo.data.retData;
  }
}
</script>
