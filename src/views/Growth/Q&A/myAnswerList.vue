<template>
  <div class="qa-my_answer">
    <el-collapse v-model="activeName" accordion v-if="list.length !== 0">
      <el-collapse-item :name="col.answerId" :key="key" v-for="(col, key) in list">
        <template slot="title">
          <!--  @click.stop=""  阻止elementUI默认点击展开的行为 -->
          <div class="header" @click.stop :id="`answer${col.answerId}`">
            <div class="title">
              <div>
                <div>{{col.title}}</div>
                <div class="operate">
                  <el-button type="text" disabled v-if="col.answerStateName === '已发布'">已发布</el-button>
                  <el-button
                    type="text"
                    disabled
                    v-if="col.askState !== 3 && col.answerStateName === '待审核'"
                  >待审核</el-button>
                  <el-button
                    type="text"
                    :disabled="activeName === col.answerId"
                    @click="edit(col)"
                    v-if="col.askState === 3"
                  >编辑</el-button>
                </div>
              </div>

              <div class="user">
                <header-pic
                  :paramInfo="{id: col.creatorId, enName: col.creatorName, headerPic: col.creatorHeadPic}"
                ></header-pic>
                <span>{{ col.creatorName }}</span>
                <span>{{ col.lastModifyTime }}</span>
              </div>
            </div>
            <div class="warning" v-if="col.askState === 3">
              <i class="el-icon-warning"></i>
              {{ `回答审核不通过：${ col.auditorReason}` }}
            </div>
            <div class="answer" v-if="col.content">{{ replaceHtmlTag(col.content) }}</div>
          </div>
        </template>
        <div v-loading="isLoading">
          <div class="general-form">
            <el-form label-width="80px">
              <div class="row-form">
                <el-form-item label="上传文件">
                  <div class="add_solutions-dialog-upload">
                    <div
                      class="add_solutions-dialog-upload-list"
                      v-for="(i, k) in answerDetail.fileContent"
                      :key="i.filePath"
                    >
                      <div :title="i.fileName">
                        <i class="el-icon-document" style="margin-right:5px"></i>
                        {{ i.fileName }}
                      </div>
                      <i class="el-icon-error" @click="reduceFile(k)"></i>
                    </div>

                    <el-upload
                      action="/api/ueditor/index?action=uploadfile&encode=utf-8"
                      :show-file-list="false"
                      :before-upload="handleBeforeUpload"
                      :on-success="(response, file, fileList) => handleSuccess(file)"
                      :on-error="handleError"
                    >
                      <div>
                        <el-button icon="el-icon-upload2" type="text">上传文件</el-button>
                      </div>
                    </el-upload>
                  </div>
                  <div style="color:#ADB5BD;">
                    （
                    <span style="color:#F56C6C;">注</span>：文件最大5MB，支持PDF, Word, PPT, Excel, TXT等格式）
                  </div>
                </el-form-item>
              </div>
              <div class="row-form">
                <el-form-item label="内容" required>
                  <!-- v-if刷新编辑器内容 -->
                  <quill-editor
                    v-if="activeName !== 0"
                    :value="answerDetail.content"
                    class="editor"
                    :options="editOpt"
                    @change="contentChange"
                  >></quill-editor>
                </el-form-item>
              </div>

              <div class="btn-group">
                <el-button class="btn-large" @click="editCancel">取消</el-button>
                <el-button type="primary" class="btn-large" @click="answer">提交</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts">
import './index.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import { Message, MessageBox } from 'element-ui';
import merge from 'deepmerge';
import { QAAnswerDetail, QAAnswerDetailRes, QAanswerEdit } from '@/interface';
import Network from '@/network';
import HeaderPic from '@/components/headerPic/index.vue';
import { editorOptions } from '@/util';
// import Detail from '@/views/Resource/AnswerQuestion/detail.vue'

const { quillEditor } = require('vue-quill-editor');

interface FileContent {
  fileName: string;
  filePath: string;
  fileSize: number;
  summary: string;
}

interface AnswerParams {
  fileContent: FileContent[];
  content: string;
}

interface QuillObj {
  html: string;
  text: string;
  quill: object;
}

@Component({
  components: {
    HeaderPic,
    quillEditor,
    // Detail
  },
})
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: [];

  @Prop({ type: Number }) readonly questionType!: number;

  editOpt: any = {
    ...merge(editorOptions, {
      placeholder: '请在此输入内容',
    }),
  };

  typeId: number | null = null;

  publicId: number | null = null;

  isLoading: boolean = false;

  dialogVisible: boolean = false;

  quillValue: string = '';

  answerDetail: any = {};

  edit(col: any) {
    this.activeName = col.answerId;
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

  @Watch('activeName') handleTabChange(answerId: number) {
    if (answerId) this.getQuestionDetail(answerId);
  }

  replaceHtmlTag(htmlStr: string): string {
    return htmlStr.replace(/<[^>]+>|&nbsp;|&amp;/g, '');
  }

  contentChange(v: QuillObj) {
    this.quillValue = v.html;
  }

  reduceFile(k: number) {
    this.answerDetail.fileContent.splice(k, 1);
  }

  handleBeforeUpload(file: any): boolean {
    if (file.size > 1024 * 1000 * 5) {
      MessageBox.confirm(
        `<div class="upload-error-wrapper">
        <span class="upload-fail-img"></span>
        <p class="error-msg">很抱歉，文件超过5MB</p>
        <p class="error-msg">您可以重新上传</p>
      </div>`,
        {
          dangerouslyUseHTMLString: true,
        },
      );

      return false;
    }
    return true;
  }

  handleSuccess(file: any) {
    this.answerDetail.fileContent.push({
      fileName: file.name,
      filePath: file.response,
      fileSize: file.size,
      summary: '',
    });
    Message.success('上传成功');
  }

  handleError() {
    Message.error('上传失败');
  }

  publicQuestion() {}

  async getQuestionDetail(answerId: number) {
    this.isLoading = true;
    const qAQuestionDetailRes = await Network.fetch<QAAnswerDetailRes>(
      'qAAnswerDetail',
      {
        answerId,
      },
    );
    this.answerDetail = qAQuestionDetailRes.data.retData.tipsInfo;
    this.isLoading = false;
  }

  async answer() {
    const submitParams = {
      answerId: this.activeName,
      content: this.quillValue,
      fileContent: this.answerDetail.fileContent,
    };
    const successMsg = '提交成功';
    const qAQuestionOpertRes = await Network.fetch<QAanswerEdit>(
      'qAanswerEdit',
      submitParams,
    );
    if (qAQuestionOpertRes.data.retCode === 0) {
      Message.success(successMsg);
      this.activeName = 0;
      this.$emit('changeContent', this.activeName);
    }
  }

  activeName: number = 0;

  //  mounted() {
  //   this.$nextTick(() => {
  //     if (this.queryId) {
  //       window.location.hash = 'answer' + this.queryId;
  //     }
  //   });
  // }
}
</script>
