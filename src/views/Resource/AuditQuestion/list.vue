<template>
  <div>
    <el-collapse v-model="activeName" accordion v-if="list.length !== 0">
      <el-collapse-item :name="col.questionId" :key="key" v-for="(col, key) in list">
        <template slot="title">
          <!--  @click.stop=""  阻止elementUI默认点击展开的行为 -->
          <div class="header" @click.stop>
            <div class="title">
              <div>{{col.content}}</div>
              <div class="operate">
                <el-button
                  type="text"
                  v-if="col.answerStateName !== '已回答'"
                  @click="ignore(col.questionId)"
                >忽略</el-button>
                <el-button
                  type="text"
                  :disabled="activeName === col.questionId"
                  @click="() => { activeName = col.questionId }"
                  v-if="col.answerStateName !== '已回答'"
                >编辑</el-button>
                <el-button
                  v-if="questionType === 0"
                  type="text"
                  @click="dialogVisible = true;publicId = col.questionId"
                >发布</el-button>
                <el-button
                  v-if="questionType === 1"
                  type="text"
                  :style="{color: col.answerStateName === '已回答' ? '#67c23a' : '#f56c6c'}"
                >{{ col.answerStateName }}</el-button>
              </div>
            </div>
            <div class="user">
              <header-pic
                :paramInfo="{id: col.creatorId, enName: col.creatorName, headerPic: col.creatorHeadPic}"
              ></header-pic>
              <span class="name">{{ col.creatorName }}</span>
              <span>{{ col.lastModifyTime }}</span>
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
            <el-button class="btn-large" @click="activeName = 0">取消</el-button>
            <el-button type="primary" class="btn-large" @click="opreate">提交</el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      title="发布问题"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @closed="typeId = null; publicId = null"
      center
    >
      <div class="audit_question-dialog">
        <el-form label-width="80px" label-position="left">
          <el-form-item label="类别" required>
            <el-select v-model="typeId">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="publicQuestion">确 定</el-button>
      </span>
    </el-dialog>
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
    let submitParams = {};
    let successMsg = '';
    switch (askState) {
      // case 2:
      //   submitParams = {
      //     questionId,
      //     askState,
      //     typeId: this.typeId,
      //   };
      //   successMsg = "发布成功";
      //   break;
      // case 3:
      //   submitParams = {
      //     questionId,
      //     askState,
      //   };
      //   successMsg = '忽略成功';
      //   break;
      default:
        submitParams = {
          questionId: this.activeName,
          content: this.questionDetil.content,
        };
        successMsg = '提交成功';
    }
    const qAQuestionOpertRes = await Network.fetch<QAQuestionOpertRes>(
      'qAQuestionOpert',
      submitParams,
    );
    if (qAQuestionOpertRes.data.retCode === 0) {
      Message.success(successMsg);
      this.activeName = 0;
      this.$emit('changeContent', this.activeName);
    }
  }

  activeName: number = 0;
}
</script>
