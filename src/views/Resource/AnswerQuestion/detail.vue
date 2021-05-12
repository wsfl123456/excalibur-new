<template>
  <div style="height:320px;overflow-y:auto">
      <div v-html="content"></div>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Detail extends Vue {
  @Prop({ type: String }) readonly content!: string;
}
</script>
