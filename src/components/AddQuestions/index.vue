<template>
  <div class="add_question">
    <div class="add_question-group" draggable="true">
      <div class="add_question-btn">
        <el-dropdown trigger="click" placement="bottom" @command="dropdownClick">
          <span class="add_icon">+</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="question">我有问题</el-dropdown-item>
            <el-dropdown-item command="solution">我有答案</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog
      title="添加问题"
      :visible.sync="questionVisibleDialog"
      :close-on-click-modal="false"
      @closed="mapAddTitle = ''"
      width="700px"
      top="15vh"
      center
    >
      <div class="add_question-dialog">
        <el-input v-model="mapAddTitle" type="textarea" :rows="4" placeholder="请在此输入你想要了解的问题"></el-input>
      </div>
      <span slot="footer">
        <el-button @click="mapAddCancel" class="add_question-cancel">取 消</el-button>
        <el-button type="primary" @click="mapaddask">提 交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="上传解决方案"
      :visible.sync="solutionVisibleDialog"
      :close-on-click-modal="false"
      @closed="closedDialog"
      width="800px"
      top="10vh"
      center
    >
      <div class="add_solutions-dialog">
        <div class="general-form">
          <el-form label-width="80px">
            <div class="row-form">
              <el-form-item label="标题" required>
                <el-input v-model="addParams.title" placeholder="请填写标题"></el-input>
              </el-form-item>
            </div>
            <div class="row-form">
              <el-form-item label="上传文件">
                <div class="add_solutions-dialog-upload">
                  <div
                    class="add_solutions-dialog-upload-list"
                    v-for="(i, k) in addParams.fileContent"
                    :key="i.filePath"
                  >
                    <div :title="i.fileName">{{ i.fileName }}</div>
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
            <div class="row-form add_question_upload_hide">
              <el-upload
                :show-file-list="false"
                :on-success="handleEditSuccess"
                :max-size="2048"
                multiple
                action="/api/ueditor/index?action=uploadfile&encode=utf-8"
              >
                <el-button icon="el-icon-upload2" type="text">上传文件</el-button>
              </el-upload>
              <el-form-item label="内容" required>
                <quill-editor
                  ref="addQuestionEditor"
                  v-model="addParams.content"
                  class="editor"
                  :options="editOpt"
                ></quill-editor>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="submitCancel" class="add_solutions-cancel">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import './index.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { Component, Vue } from 'vue-property-decorator';
import { Message, MessageBox } from 'element-ui';
import merge from 'deepmerge';
import { editorOptions } from '@/util';
import Network from '@/network';
import { QAQuestionAdd, QAsolutionAddRes } from '@/interface';

const { quillEditor } = require('vue-quill-editor');

const RegexCheck = new Map([
  [['addParams', 'title'], '请填写标题'],
  [['addParams', 'content'], '请填写内容'],
]);

interface FileContent {
  fileName: string;
  filePath: string;
  fileSize: number;
}

interface AddParams {
  title: string;
  fileContent: FileContent[];
  content: string;
}

@Component({
  components: {
    quillEditor,
  },
})
export default class Growth extends Vue {
  questionVisibleDialog: boolean = false;

  solutionVisibleDialog: boolean = false;

  mapAddTitle: string = '';

  editOpt: any = {
    ...merge(editorOptions, {
      modules: {
        toolbar: {
          handlers: {
            image(value: any) {
              if (value) {
                // 调用iview图片上传
                const document = window.document as any;
                document
                  .querySelector(
                    '.add_question_upload_hide .el-upload .el-button',
                  )
                  .click();
              } else {
                // this.quill.format("image", false);
              }
            },
          },
        },
      },
      placeholder: '请在此输入内容',
    }),
  };

  addParams: AddParams = {
    title: '',
    fileContent: [],
    content: '',
  };

  dropdownClick(v: string) {
    let label = '';
    if (v === 'question') {
      this.questionVisibleDialog = true;
      switch (this.$route.name) {
        case 'professionLine':
          label = 'A7';
          break;
        case 'staffDaily':
          label = 'A12';
          break;
        case 'nccWeaponry':
          label = 'A17';
          break;
        case 'goldHouse':
          label = 'A22';
          break;
        case 'Q&A':
          label = 'A26';
          break;
        default:
          break;
      }
    } else {
      this.solutionVisibleDialog = true;
      switch (this.$route.name) {
        case 'professionLine':
          label = 'A8';
          break;
        case 'staffDaily':
          label = 'A13';
          break;
        case 'nccWeaponry':
          label = 'A18';
          break;
        case 'goldHouse':
          label = 'A23';
          break;
        case 'Q&A':
          label = 'A27';
          break;
        default:
          break;
      }
    }
    this.$ga.event({
      eventCategory: label,
      eventAction: label,
      eventLabel: label,
      eventValue: 500,
    });
  }

  mapAddCancel() {
    this.questionVisibleDialog = false;
  }

  submitCancel() {
    this.solutionVisibleDialog = false;
  }

  handleEditSuccess(res: any) {
    // 获取富文本组件实例
    const addQuestionEditor = this.$refs.addQuestionEditor as any;
    const { quill } = addQuestionEditor;
    console.log(addQuestionEditor.quill);

    this.$nextTick(() => {
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        const length = quill.getSelection().index;
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, 'image', window.location.origin + res);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        // 提示信息，需引入Message
        Message.error('图片插入失败');
      }
    });
  }

  async mapaddask() {
    const params = {
      content: this.mapAddTitle,
    };
    const qAQuestionAddRes = await Network.fetch<QAQuestionAdd>(
      'qAQuestionAdd',
      params,
    );

    if (qAQuestionAddRes.data.retCode === 0) {
      this.questionVisibleDialog = false;
      Message.success('提交成功');
    }
  }

  regexCheck(val: any): boolean {
    let check = true;
    try {
      val.forEach((value: string, key: string[]) => {
        let vm = this as any;
        key.forEach((ele) => {
          vm = vm[ele];
        });
        if ((!vm && vm !== 0) || (Array.isArray(vm) && vm.length === 0)) {
          check = false;
          Message.warning(value);
          throw new Error('break');
        }
      });
    } catch (err) {
      console.log(err);
    }

    return check;
  }

  /* 关闭对话框后重置数据 */
  closedDialog() {
    this.addParams = {
      title: '',
      fileContent: [],
      content: '',
    };
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
    this.addParams.fileContent.push({
      fileName: file.name,
      filePath: file.response,
      fileSize: file.size,
    });
    Message.success('上传成功');
  }

  handleError() {
    Message.error('上传失败');
  }

  reduceFile(k: number) {
    this.addParams.fileContent.splice(k, 1);
  }

  async submit() {
    const canSave = this.regexCheck(RegexCheck);
    console.log(111);

    if (canSave) {
      const qAsolutionAddRes = await Network.fetch<QAsolutionAddRes>(
        'qASolutionAdd',
        this.addParams,
      );

      if (qAsolutionAddRes.data.retCode === 0) {
        this.solutionVisibleDialog = false;
        Message.success('提交成功');
      }
    }
  }

  async mounted() {
    const resouce = document.getElementsByClassName(
      'add_question-group',
    )[0] as any;
    resouce.addEventListener('dragend', (ev: any) => {
      console.log(ev);
      resouce.style.top = `${ev.y - 30}px`;
      resouce.style.left = `${ev.x - 30}px`;
      ev.preventDefault();
    });
  }
}
</script>
