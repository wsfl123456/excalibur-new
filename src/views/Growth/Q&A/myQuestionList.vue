<template>
  <div class="qa-my_question">
    <el-collapse v-model="activeName" accordion v-if="list.length !== 0">
      <el-collapse-item :name="col.questionId" :key="key" v-for="(col, key) in list">
        <template slot="title">
          <!--  @click.stop=""  阻止elementUI默认点击展开的行为 -->
          <div class="header" @click.stop :id="`question${col.questionId}`">
            <div class="title">
              <div>{{col.content}}</div>
              <div class="operate">
                <el-button
                  type="text"
                  disabled
                  v-if="col.askState !== 3 && col.answerStateName === '已回答'"
                >已回答</el-button>
                <el-button
                  type="text"
                  disabled
                  v-if="col.askState !== 3 && col.answerStateName === '待回答'"
                >待回答</el-button>
                <el-button
                  type="text"
                  :disabled="activeName === col.questionId"
                  @click="edit(col)"
                  v-if="col.askState === 3"
                >编辑</el-button>
              </div>
            </div>
            <div class="warning" v-if="col.askState === 3">
              <i class="el-icon-warning"></i>
              {{ `提问审核不通过：${ col.auditorReason}` }}
            </div>
          </div>
        </template>
        <div v-loading="isLoading">
          <el-input v-model="questionDetil.content" type="textarea" :rows="5" placeholder="请在此输入内容"></el-input>
          <!-- <div class="state">
            <div>
              <span>*</span>状态
            </div>
            <el-switch
              v-model="questionDetil.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
            ></el-switch>
          </div>-->

          <div class="btn-group">
            <el-button class="btn-large" @click="editCancel">取消</el-button>
            <el-button type="primary" class="btn-large" @click="opreate">提交</el-button>
          </div>
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
import {
  QATableRes,
  QADetail,
  QADetailRes,
  QAQuestionOpertRes,
  QAQuestionEdit,
} from '@/interface';
import Network from '@/network';
import HeaderPic from '@/components/headerPic/index.vue';

@Component({
  components: {
    HeaderPic,
  },
})
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: QATableRes[];

  @Prop({ type: Number }) readonly questionType!: number;

  typeId: number | null = null;

  publicId: number | null = null;

  isLoading: boolean = false;

  dialogVisible: boolean = false;

  typeList: any = [
    {
      value: '111',
      label: '员工日常',
    },
    {
      value: '112',
      label: '专业线',
    },
    {
      value: 'store',
      label: '皇家兵器库',
    },
    {
      value: 'house',
      label: '黄金屋',
    },
  ];

  questionDetil: QADetail = {
    content: '',
    // state: 1,
  };

  edit(col: any) {
    this.activeName = col.questionId;
  }

  editCancel() {
    this.activeName = 0;
  }

  get queryType() {
    return this.$route.query.type;
  }

  get queryId() {
    return this.$route.query.id;
  }

  @Watch('activeName') handleTabChange(questionId: number) {
    if (questionId) this.getQuestionDetail(questionId);
  }

  async publicQuestion() {
    if (!this.typeId) {
      Message.warning('请选择类别');
      return;
    }
    const submitParams = {
      questionId: this.publicId,
      askState: 2,
      typeId: this.typeId,
    };
    const qAQuestionOpertRes = await Network.fetch<QAQuestionOpertRes>(
      'qAQuestionOpert',
      submitParams,
    );
    if (qAQuestionOpertRes.data.retCode === 0) {
      Message.success('发布成功');
      this.activeName = 0;
      this.dialogVisible = false;
      this.typeId = null;
      this.publicId = null;
      this.$emit('changeContent', this.activeName);
    }
  }

  ignore(questionId: number) {
    this.$prompt('请输入不通过的原因', '您确定要否决此提问吗？').then(
      async (reason: any) => {
        const submitParams = {
          questionId,
          auditorReason: reason.value,
          askState: 3,
        };
        const qAQuestionOpertRes = await Network.fetch<QAQuestionOpertRes>(
          'qAQuestionOpert',
          submitParams,
        );

        if (qAQuestionOpertRes.data.retCode === 0) {
          this.$emit('changeContent', this.activeName);
          this.$message.success({
            message: '忽略成功',
          });
        }
      },
    );
  }

  async getQuestionDetail(questionId: number) {
    this.isLoading = true;
    const qAQuestionDetailRes = await Network.fetch<QADetailRes>(
      'qAQuestionDetail',
      {
        questionId,
      },
    );
    this.questionDetil = qAQuestionDetailRes.data.retData.tipsInfo;
    this.isLoading = false;
  }

  async opreate(questionId: any, askState: any) {
    const submitParams = {
      questionId: this.activeName,
      content: this.questionDetil.content,
    };
    const successMsg = '提交成功';
    const qAQuestionOpertRes = await Network.fetch<QAQuestionEdit>(
      'qAQuestionEdit',
      submitParams,
    );
    if (qAQuestionOpertRes.data.retCode === 0) {
      Message.success(successMsg);
      this.activeName = 0;
      this.$emit('changeContent', this.activeName);
    }
  }

  activeName: number = 0;

  //    mounted() {
  //   this.$nextTick(() => {
  //     if (this.queryId) {
  //       window.location.hash = 'question' + this.queryId;
  //     }
  //   });
  // }
}
</script>
