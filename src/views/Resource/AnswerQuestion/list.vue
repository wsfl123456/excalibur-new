<template>
  <div>
    <el-collapse :value="activeName" accordion @change="collapseChange" v-if="list.length !== 0">
      <el-collapse-item :name="col.answerId" :key="key" v-for="(col, key) in list">
        <template slot="title">
          <div class="header">
            <div class="title">
              <div>{{col.title}}</div>
              <!--  @click.stop=""  阻止elementUI默认点击展开的行为 -->
              <div class="operate" v-if="questionType === 0" @click.stop>
                <el-button type="text" @click="ignore(col.answerId)">忽略</el-button>
                <el-button
                  type="text"
                  @click="toEdit(col.answerId)"
                  :disabled="activeName === col.answerId && editMode === true"
                >编辑</el-button>
                <el-button
                  v-if="col.typeRecId === 0 && col.typeId !== ''"
                  type="text"
                  @click="publicAnswer(col.answerId)"
                >发布</el-button>
              </div>
              <div v-else class="operate" @click.stop>
                <el-button type="text" @click="PushEdit(col.typeId, col.typeRecId)">编辑</el-button>
              </div>
            </div>
            <div class="user">
              <div>
                <span class="from">
                  <span>From</span>
                  ：
                </span>
                <header-pic
                  :paramInfo="{id: col.creatorIdQuestion,
                  enName: col.creatorNameQuestion,
                  headerPic: col.creatorHeadPicQuestion}"
                ></header-pic>
                <span class="name">{{ col.creatorNameQuestion }}</span>
                <span>{{ col.createTimeQuestion }}</span>
              </div>
              <div>
                <span class="answer">
                  <span>Answered</span>
                  ：
                </span>
                <header-pic
                  :paramInfo="{id: col.creatorId, enName: col.creatorName, headerPic: col.creatorHeadPic}"
                ></header-pic>
                <span class="name">{{ col.creatorName }}</span>
                <span>{{ col.lastModifyTime }}</span>
              </div>
            </div>
            <div
              v-show="activeName !== col.answerId"
              class="content"
            >{{ replaceHtmlTag(col.content) }}</div>
          </div>
        </template>
        <div v-loading="isLoading" v-if="activeName === col.answerId">
          <edit
            v-if="editMode === true"
            :answerId="col.answerId"
            @cancel="activeName = 0"
            @changeContent="changeContent"
          ></edit>
          <detail v-else :content="col.content"></detail>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts">
import './index.less';
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import { Message } from 'element-ui';
import { QAAnswerTable, QAAnswerOpertRes } from '@/interface';
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
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: QAAnswerTable[];

  @Prop({ type: Number }) readonly questionType!: number;

  activeName: number = 0;

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
    const vm = this;
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
          this.$message.success({
            message: '忽略成功',
            onClose() {
              vm.$emit('changeContent');
            },
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
