<template>
  <div class="back-top" v-show="scrollTop > 200" @click="backTop">
    <i class="el-icon-caret-top"></i>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BackTop extends Vue {
    scrollTop: number = 0;

    backTop() {
      const timer = setInterval(() => {
        const ispeed = Math.floor(-this.scrollTop / 5);
        document.documentElement.scrollTop = this.scrollTop + ispeed;
        document.body.scrollTop = this.scrollTop + ispeed;
        if (this.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    }

    ScrollToTop() {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    }

    async created() {
      window.addEventListener('scroll', this.ScrollToTop);
    }
}
</script>
