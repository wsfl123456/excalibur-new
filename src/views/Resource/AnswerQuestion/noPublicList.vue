<template>
  <div class="no_public_list">
    <div v-for="(col, key) in list" :key="key">
      <div class="title">
        <div>{{col.title}}</div>
      </div>
      <el-collapse :value="activeName" accordion @change="collapseChange" v-if="list.length !== 0">
        <el-collapse-item :name="i.answerId" v-for="i in col.answerList" :key="i.answerId">
          <template slot="title">
            <div class="header">
              <div class="answer-list">
                <div class="user">
                  <div>
                    <span class="from">
                      <span>From</span>
                      ：
                    </span>
                    <header-pic
                      :paramInfo="{id: i .creatorIdQuestion,
                  enName: i .creatorNameQuestion,
                  headerPic: i .creatorHeadPicQuestion}"
                    ></header-pic>
                    <span class="name">{{ i .creatorNameQuestion }}</span>
                    <span>{{ i .createTimeQuestion }}</span>
                  </div>
                  <div>
                    <span class="answer">
                      <span>Answered</span>
                      ：
                    </span>
                    <header-pic
                      :paramInfo="{id: i .creatorId, enName: i .creatorName, headerPic: i .creatorHeadPic}"
                    ></header-pic>
                    <span class="name">{{ i .creatorName }}</span>
                    <span>{{ i .lastModifyTime }}</span>
                  </div>
                </div>
                <div class="operate" @click.stop>
                  <el-button type="text" @click="ignore(i.answerId)">忽略</el-button>
                  <el-button
                    type="text"
                    @click="toEdit(i.answerId)"
                    :disabled="activeName === i.answerId && editMode === true"
                  >编辑</el-button>
                  <el-button
                    v-if="i.typeRecId === 0 && i.typeId !== ''"
                    type="text"
                    @click="publicAnswer(i.answerId)"
                  >发布</el-button>
                </div>
              </div>

              <div class="content">{{ replaceHtmlTag(i.content) }}</div>
            </div>
          </template>
          <div v-loading="isLoading" v-if="activeName === i.answerId">
            <edit
              v-if="editMode === true"
              :answerId="i.answerId"
              @cancel="activeName = 0"
              @changeContent="changeContent"
            ></edit>
            <detail v-else :content="col.content"></detail>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script lang="ts">
import './index.less';
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import { Message } from 'element-ui';
import { QAAnswerOpertRes } from '@/interface';
import Network from '@/network';
import HeaderPic from '@/components/headerPic/index.vue';
import Detail from './detail.vue';
import Edit from './edit.vue';

@Component({
  components: {
    HeaderPic,
    Detail,
    Edit,
  },
})
export default class NoPublicList extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: any;

  @Prop({ type: Number }) readonly questionType!: number;

  activeName: number = 0;

  activeAnswerId: number = 0;

  isLoading: boolean = false;

  editMode: boolean = false;

  @Watch('activeName') handleTabChange(answerId: number) {
    // if (answerId) this.getQuestionDetail(answerId);
  }

  // async ignore(id: number) {
  //   const params = {
  //     answerId: id,
  //     askState: 3,
  //   };
  //   const qAAnswerOpertRes = await Network.fetch<QAAnswerOpertRes>(
  //     'qAAnswerOpert',
  //     params,
  //   );
  //   if (qAAnswerOpertRes.data.retCode === 0) {
  //     Message.success('提交成功');
  //     this.$emit('changeContent');
  //   }
  // }
  ignore(answerId: number) {
    this.$prompt('请输入不通过的原因', '您确定要否决此回答吗？').then(
      async (reason: any) => {
        const submitParams = {
          answerId,
          auditorReason: reason.value,
          askState: 3,
        };
        const qAAnswerOpertRes = await Network.fetch<QAAnswerOpertRes>(
          'qAAnswerOpert',
          submitParams,
        );

        if (qAAnswerOpertRes.data.retCode === 0) {
          this.activeName = 0;
          this.$emit('changeContent');
          this.$message.success({
            message: '忽略成功',
          });
        }
      },
    );
  }

  async publicAnswer(id: number) {
    const params = {
      answerId: id,
      askState: 2,
    };
    const qAAnswerOpertRes = await Network.fetch<QAAnswerOpertRes>(
      'qAAnswerOpert',
      params,
    );
    if (qAAnswerOpertRes.data.retCode === 0) {
      Message.success('发布成功');
      this.activeName = 0;
      this.$emit('changeContent');
    }
  }

  changeContent() {
    this.activeName = 0;
    this.$emit('changeContent');
  }

  replaceHtmlTag(htmlStr: string): string {
    return htmlStr.replace(/<[^>]+>|&nbsp;|&amp;/g, '');
  }

  collapseChange(name: number) {
    this.editMode = false;
    if (name) this.activeName = name;
    else this.activeName = 0;
  }

  toEdit(answerId: number) {
    this.editMode = true;
    this.activeName = answerId;
  }

  PushEdit(typeId: string, typeRecId: number) {
    let name;
    switch (typeId) {
      case '112':
      case '111':
        name = 'livemapEdit';
        break;
      case 'store':
        name = 'weaponryEdit';
        break;
      case 'house':
        name = 'goldhouseEdit';
        break;
      default:
        name = '';
    }
    this.$router.push({
      name,
      params: {
        id: String(typeRecId),
      },
    });
  }
}
</script>
