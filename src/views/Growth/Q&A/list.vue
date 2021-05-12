<template>
  <div>
    <el-collapse v-model="activeName" accordion v-if="list.length !== 0">
      <el-collapse-item :name="col.questionId" :key="key" v-for="(col, key) in list">
        <template slot="title">
          <!--  @click.stop=""  阻止elementUI默认点击展开的行为 -->
          <div class="header" @click.stop>
            <div class="title" @click="toDetail(col)">
              <div>{{col.content}}</div>
              <div class="operate">
                <el-button
                  v-if="col.answerStateName === '已回答'"
                  type="text"
                  style="color:rgb(103, 194, 58)"
                >已回答</el-button>
                <el-button
                  v-else
                  type="text"
                  :disabled="activeName === col.questionId"
                  @click="answerBtn(col)"
                >回答</el-button>
              </div>
            </div>
            <div class="user" @click="toDetail(col)">
              <header-pic
                :paramInfo="{id: col.creatorId, enName: col.creatorName, headerPic: col.creatorHeadPic}"
              ></header-pic>
              <span class="name">{{ col.creatorName }}</span>
              <span>{{ col.lastModifyTime }}</span>
            </div>
          </div>
        </template>
        <div class="general-form">
          <el-form label-width="80px">
            <div class="row-form">
              <el-form-item label="上传文件">
                <div class="add_solutions-dialog-upload">
                  <div
                    class="add_solutions-dialog-upload-list"
                    v-for="(i, k) in answerParams.fileContent"
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
                  :value="answerParams.content"
                  class="editor"
                  :options="editOpt"
                  @change="contentChange"
                >></quill-editor>
              </el-form-item>
            </div>

            <div class="btn-group">
              <el-button class="btn-large" @click="cancel">取消</el-button>
              <el-button type="primary" class="btn-large" @click="answer">提交</el-button>
            </div>
          </el-form>
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
import { Message, MessageBox } from 'element-ui';
import merge from 'deepmerge';
import { QATableRes, QAQuestionOpertRes, QAanswerAdd } from '@/interface';
import Network from '@/network';
import { editorOptions } from '@/util';
import HeaderPic from '@/components/headerPic/index.vue';

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
  },
})
export default class List extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly list!: QATableRes[];

  @Watch('activeName') handleTabChange(questionId: number) {
    this.quillValue = '';
    this.answerParams = {
      fileContent: [],
      content: '',
    };
  }

  editOpt: any = {
    ...merge(editorOptions, {
      placeholder: '请在此输入内容',
    }),
  };

  isLoading: boolean = false;

  activeName: number = 0;

  quillValue: string = '';

  answerParams: AnswerParams = {
    fileContent: [],
    content: '',
  };

  toDetail(col: any) {
    if (col.answerStateName === '已回答') {
      let pathName = '';
      switch (col.typeId) {
        case '112':
          pathName = 'professionLineDetail';
          break;
        case '111':
          pathName = 'staffDailyDetail';
          break;
        case 'store':
          pathName = 'weaponryDetail';
          break;
        case 'house':
          pathName = 'goldHouseDetail';
          break;
        default:
          break;
      }

      this.$router.push({
        name: pathName,
        params: {
          id: col.typeRecId,
        },
      });
    }
  }

  answerBtn(col: any) {
    this.activeName = col.questionId;
  }

  contentChange(v: QuillObj) {
    this.quillValue = v.html;
  }

  reduceFile(k: number) {
    this.answerParams.fileContent.splice(k, 1);
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
    this.answerParams.fileContent.push({
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

  cancel() {
    this.activeName = 0;
  }

  async answer() {
    // 不知道为什么输入内容时，编辑器会失去焦点，只能在提交时给content附值
    this.answerParams.content = this.quillValue;
    const answerParams = {
      questionId: this.activeName,
      ...this.answerParams,
    };

    if (!this.answerParams.content) {
      Message.warning('请输入内容');
      return;
    }
    const qAanswerAddRes = await Network.fetch<QAanswerAdd>(
      'qAanswerAdd',
      answerParams,
    );
    if (qAanswerAddRes.data.retCode === 0) {
      Message.success('提交成功');
      this.activeName = 0;
    }
  }
}
</script>
