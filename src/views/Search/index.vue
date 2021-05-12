<template>
  <div class="search-page">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommonHead from '@/components/CommonHead/index.vue';

@Component({
  components: {
    CommonHead,
  },
})
export default class Search extends Vue {
}
</script>
