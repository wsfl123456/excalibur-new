<template>
  <div class="livemap-answer" v-loading="isLoading">
    <router-link class="back" :to="{name: 'livemap'}">返回列表</router-link>

    <div class="list">
      <el-collapse v-model="activeName" accordion v-if="askList.length !== 0">
        <el-collapse-item :name="col.tipsId" :key="key" v-for="(col, key) in askList">
          <template slot="title">
            <!--  @click.stop=""  阻止elementUI默认点击展开的行为 -->
            <div class="header" @click.stop>
              <div class="title">
                <div>{{col.title}}</div>
                <div class="operate">
                  <el-button type="text" :disabled="activeName !== 0" @click="ignoreAnswer(key)">忽略</el-button>
                  <el-button
                    type="text"
                    :disabled="activeName !== 0"
                    @click="() => { activeName = col.tipsId }"
                  >编辑</el-button>
                </div>
              </div>
              <div class="user">
                <header-pic
                  :paramInfo="{id: col.askerId, enName: col.askerName, headerPic: col.askerHeadPic}"
                ></header-pic>
                <span>{{ col.askerName }}</span>
                <span>{{ col.lastModifyTime }}</span>
              </div>
            </div>
          </template>
          <div>
            <answer-form
              v-if="activeName === col.tipsId"
              :typeId="col.typeId"
              :title="col.title"
              :tipsId="col.tipsId"
              @cancel=" activeName = 0 "
              @saveSuccess="saveSuccess"
            ></answer-form>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div v-else class="no-content">暂无问题</div>
    </div>
  </div>
</template>
<script lang="ts">
import './index.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { Component, Watch, Vue } from 'vue-property-decorator';
import { Message } from 'element-ui';
import { editorOptions } from '@/util';
import HeaderPic from '@/components/headerPic/index.vue';
import Network from '@/network';
import { Maplistask, MaplistaskRes, MapeditaskRes } from '@/interface';
import AnswerForm from './answer-form.vue';

const { quillEditor } = require('vue-quill-editor');


@Component({
  components: {
    HeaderPic,
    AnswerForm,
  },
})
export default class Answer extends Vue {
  isLoading: boolean = true;

  activeName: number = 0;

  askList: Maplistask[] = [];


  async ignoreAnswer(key: number) {
    const params = {
      tipsId: this.askList[key].tipsId,
      askState: 3,
    };
    const answerRes = await Network.fetch<MapeditaskRes>('mapeditask', params);

    if (answerRes.data.retCode === 0) {
      this.askList.splice(key, 1);
      Message.success('已忽略');
    }
  }

  async saveSuccess() {
    const currentIndex = this.askList.findIndex(
      (i: Maplistask): boolean => i.tipsId === this.activeName,
    );
    this.askList.splice(currentIndex, 1);
    this.activeName = 0;
    Message.success('提交成功');
  }

  async created() {
    const maplistaskRes = await Network.fetch<MaplistaskRes>('maplistask');
    this.askList = maplistaskRes.data.retData.tipsList;
    this.isLoading = false;
  }
}
</script>
