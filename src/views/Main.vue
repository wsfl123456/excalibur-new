<template>
  <div class="home">
    <common-head></common-head>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <sys-notice></sys-notice>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonHead from '@/components/CommonHead/index.vue';
import SysNotice from '@/components/SysNotice/index.vue';

@Component({
  components: {
    CommonHead,
    SysNotice,
  },
})
export default class Main extends Vue {
}
</script>

<style lang="less">
  .main-content {
    padding-top: 48px;
  }
</style>
