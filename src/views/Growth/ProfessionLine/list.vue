<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        :class="{ 'is-activing': activeName === col.tipsId }"
        :id="listType + col.tipsId"
        :name="col.tipsId"
        :key="key"
        v-for="(col, key) in list"
      >
        <template slot="title">
          <div class="header" @click="toPush(col.tipsId)">
            <div class="title">
              <div>{{col.title}}</div>
            </div>
            <div class="user">
              <header-pic
                :paramInfo="{id: col.creatorId, enName: col.creatorName, headerPic: col.creatorHeadPic}"
              ></header-pic>
              <span>{{ col.creatorName }}</span>
              <span>{{ col.lastModifyTime }}</span>
            </div>
            <div class="answer">{{ replaceHtmlTag(col.content) }}</div>
          </div>
        </template>

        <!-- 详情 -->
        <!-- <div v-html="col.content"></div> -->
      </el-collapse-item>
    </el-collapse>

  </div>
</template>
<script lang="ts">
import './index.less';
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import { Maplistfront } from '@/interface';
import Network from '@/network';
import HeaderPic from '@/components/headerPic/index.vue';

@Component({
  components: {
    HeaderPic,
  },
})
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: Maplistfront[];

  @Prop({ type: String, default: () => '' }) readonly listType!: string;

  @Watch('activeName') handleTabChange(tipsId: number) {
    if (tipsId) this.getMapdetailfront(tipsId);
  }

  replaceHtmlTag(htmlStr: string): string {
    return htmlStr.replace(/<[^>]+>|&nbsp;|&amp;/g, '');
  }

  getMapdetailfront(tipsId: number) {
    Network.fetch('getMapdetailfront', { tipsId });
  }

  activeName: number = 0;

  get queryId() {
    return this.$route.query.id;
  }

  toPush(id: number) {
    const routeData = this.$router.push({
      name: 'professionLineDetail',
      params: {
        id: String(id),
      },
    });
    // window.open(routeData.href, '_blank');
  }

  created() {
    if (this.$route.query.id) this.activeName = Number(this.$route.query.id);
  }

  mounted() {
    this.$nextTick(() => {
      if (this.queryId) {
        window.location.hash = this.listType + this.queryId;
      }
    });
  }
}
</script>
