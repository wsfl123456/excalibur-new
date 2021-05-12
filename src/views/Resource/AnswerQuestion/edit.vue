<template>
  <div v-loading="isLoading">
    <div class="general-form">
      <el-form label-width="120px">
        <div class="row-form">
          <el-form-item label="类别" required>
            <el-select v-model="editParams.typeId" placeholder="请选择类别" @change="typeChange">
              <el-option v-for="(i, k) in typeList" :label="i.label" :value="i.value" :key="k"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row-form" v-show="editParams.typeId !== '111'">
          <el-form-item label="学院" required>
            <el-select
              v-model="editParams.collegeId"
              placeholder="请选择学院"
              @change="handleCollgeChange"
            >
              <el-option
                v-for="(i, k) in collegeList"
                :label="i.title"
                :value="Number(i.collegeId)"
                :key="k"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业" required>
            <el-select v-model="editParams.studyId" clearable placeholder="请选择专业">
              <el-option
                v-for="(i, k) in collegestudylist"
                :label="i.title"
                :value="Number(i.studyId)"
                :key="k"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row-form" v-show="editParams.typeId !== '111'">
          <el-form-item label="分组" required>
            <el-select v-model="editParams.viewScope" placeholder="请选择分组">
              <el-option v-for="(i, k) in viewScopeList" :label="i.label" :value="i.id" :key="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签" required>
            <el-input v-model="editParams.tagText" placeholder="请填写标签"></el-input>
          </el-form-item>
        </div>
        <div class="row-form">
          <el-form-item
            label="工具包"
            v-show="editParams.typeId === '112' || editParams.typeId === ''"
          >
            <el-cascader
              v-model="toolkitId"
              :options="toolkitbyproductList"
              :props="{ expandTrigger: 'hover' }"
              placeholder="请选择工具包"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="属性"
            v-show="editParams.typeId === 'store' || editParams.typeId === ''"
            required
          >
            <el-select v-model="editParams.shuxingId" placeholder="请选择属性">
              <el-option
                v-for="(i, k) in propertyList"
                :label="i.shuxingName"
                :value="i.shuxingId"
                :key="k"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row-form" v-show="editParams.typeId === 'house' || editParams.typeId === ''">
          <el-form-item label="发布机构" required>
            <el-input v-model="editParams.pubCompany" placeholder="请填写发布机构"></el-input>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker v-model="editParams.pubTime" type="date" placeholder="请选择发布时间"></el-date-picker>
          </el-form-item>
        </div>
        <div class="row-form" v-show="editParams.typeId === 'house' || editParams.typeId === ''">
          <el-form-item label="Win下载地址" required>
            <el-input v-model="editParams.fileAddressWindows" placeholder="请填写Windows下载地址"></el-input>
          </el-form-item>
          <el-form-item label="Mac下载地址" required>
            <el-input v-model="editParams.fileAddress" placeholder="请填写Mac下载地址"></el-input>
          </el-form-item>
        </div>
        <div class="row-form" v-if="editParams.typeId === ''">
          <el-form-item label="上传文件" required>
            <div class="add_solutions-dialog-upload">
              <div
                class="add_solutions-dialog-upload-list"
                v-for="(i) in editParams.fileContent"
                :key="i.filePath"
              >
                <div :title="i.fileName">
                  <i class="el-icon-document" style="margin-right:5px"></i>
                  {{ i.fileName }}
                </div>
                <el-button type="text">
                  <i class="el-icon-download"></i>
                  <a :href="i.filePath" :download="i.fileName">下载文件</a>
                </el-button>
              </div>

            </div>
            <div style="color:#ADB5BD;">
              （
              <span style="color:#F56C6C;">注</span>：文件最大5MB，支持PDF, Word, PPT, Excel, TXT等格式）
            </div>
          </el-form-item>
        </div>
        <template v-if="editParams.typeId === 'store'">
          <div class="row-form" v-for="(i, k) in editParams.fileContent" :key="k">
            <el-row>
              <el-col :span="24">
                <el-form-item label="上传文件" required>
                  <div class="answer_question_upload">
                    <el-upload
                      v-if="!i.filePath"
                      action="/api/ueditor/index?action=uploadfile&encode=utf-8"
                      :show-file-list="false"
                      :before-upload="handleFileBeforeUpload"
                      :on-success="(response, file, fileList) => handleFileSuccess(file, k)"
                      :on-error="handleError"
                    >
                      <div>
                        <el-button icon="el-icon-upload2" type="text">上传文件</el-button>
                        <span style="color:#868e96">（文件最大5MB，支持PDF, Word, PPT, Excel, TXT等格式）</span>
                      </div>
                      <!-- <el-button v-else icon="el-icon-upload2" type="text">重新上传</el-button> -->
                    </el-upload>

                    <el-button
                      v-if="i.filePath"
                      icon="el-icon-delete-solid"
                      type="text"
                      class="red-important"
                      @click="clearFile(k)"
                    >清空文件</el-button>
                    <el-input v-if="i.filePath" v-model="i.fileName"></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-top:10px">
                <el-form-item label="预览" required>
                  <quill-editor v-model="i.summary" class="editor" :options="editOpt"></quill-editor>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div class="text-right">
                  <el-button
                    icon="el-icon-remove"
                    type="text"
                    class="red-important"
                    @click="() => { editParams.fileContent.splice(k, 1); fileList.splice(k, 1) }"
                    v-if="editParams.fileContent.length > 1"
                  >删除文件</el-button>
                  <el-button icon="el-icon-circle-plus" type="text" @click="addFile">添加文件</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
        <div class="row-form" v-show="editParams.typeId === 'house' || editParams.typeId === ''">
          <el-form-item required>
            <span slot="label">缩略图</span>
            <div class="picture-upload">
              <el-upload
                v-if="!editParams.picture"
                action="/api/ueditor/index?action=uploadfile&encode=utf-8"
                :show-file-list="false"
                :before-upload="handlePicBeforeUpload"
                :on-success="(response, file, fileList) => handlePicSuccess(file)"
                :on-error="handleError"
              >
                <i slot="default" class="el-icon-plus icon"></i>
                <span class="remake" @click.stop>
                  （
                  <span>注</span>：建议图片宽高比为4:3）
                </span>
              </el-upload>

              <div v-if="editParams.picture" class="upload-view">
                <el-image style="height:80px;width:107px" :src="editParams.picture" fit="cover"></el-image>
                <div class="operate">
                  <i class="el-icon-view pointer" @click="() => { this.dialogVisible = true }"></i>
                  <i class="el-icon-delete pointer" @click="() => { this.editParams.picture = '' }"></i>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="row-form">
          <el-form-item label="内容" required>
            <quill-editor v-model="editParams.content" class="editor" :options="editOpt"></quill-editor>
          </el-form-item>
        </div>
      </el-form>

      <div class="btn-group">
        <el-button class="btn-large" @click="cancel">取消</el-button>
        <el-button type="primary" class="btn-large" @click="submit">提交</el-button>
      </div>

      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="editParams.picture" alt />
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import './index.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import merge from 'deepmerge';

import { Component, Prop, Vue } from 'vue-property-decorator';
import { Message, MessageBox } from 'element-ui';
import {
  QAAnswerDetail,
  QAAnswerDetailRes,
  Collegelist,
  CollegelistRes,
  Collegestudylist,
  CollegestudylistRes,
  Toolkitbyproduct,
  ToolkitbyproductRes,
  Storeshuxing,
  StoreshuxingRes,
  QAAnswerOpertRes,
} from '@/interface';
import Network from '@/network';
import { editorOptions } from '@/util';

const { quillEditor } = require('vue-quill-editor');

const LineRegexCheck = new Map([
  [['editParams', 'collegeId'], '请选择学院'],
  [['editParams', 'studyId'], '请选择专业'],
  [['editParams', 'viewScope'], '请选择分组'],
  [['editParams', 'tagText'], '请填写标签'],
  [['editParams', 'content'], '请填写内容'],
]);
const StaffRegexCheck = new Map([[['editParams', 'content'], '请填写内容']]);
const StoreRegexCheck = new Map([
  [['editParams', 'collegeId'], '请选择学院'],
  [['editParams', 'studyId'], '请选择专业'],
  [['editParams', 'viewScope'], '请选择分组'],
  [['editParams', 'tagText'], '请填写标签'],
  [['editParams', 'shuxingId'], '请选择属性'],
  [['editParams', 'content'], '请填写内容'],
]);
const HouseRegexCheck = new Map([
  [['editParams', 'collegeId'], '请选择学院'],
  [['editParams', 'studyId'], '请选择专业'],
  [['editParams', 'viewScope'], '请选择分组'],
  [['editParams', 'tagText'], '请填写标签'],
  [['editParams', 'pubCompany'], '请填写发布机构'],
  [['editParams', 'fileAddressWindows'], '请填写Windows下载地址'],
  [['editParams', 'fileAddress'], '请填写Mac下载地址'],
  [['editParams', 'picture'], '请上传缩略图'],
  [['editParams', 'content'], '请填写内容'],
]);

@Component({
  components: { quillEditor },
})
export default class Edit extends Vue {
  @Prop({ type: Number }) readonly answerId!: number;

  editOpt: any = {
    ...merge(editorOptions, {
      placeholder: '请在此输入概览',
    }),
  };

  // defaultContent: string = '';
  isLoading: boolean = true;

  editParams: QAAnswerDetail = {
    answerId: null,
    typeId: '',
    collegeId: null,
    studyId: null,
    viewScope: null,
    tagText: null,
    productId: 0,
    task_toolkit_id: 0,
    shuxingId: null,
    pubCompany: '',
    pubTime: '',
    fileAddressWindows: null,
    fileAddress: null,
    fileContent: [],
    picture: null,
    content: '',
  };

  toolkitId: number[] = [];

  dialogVisible: boolean = false;

  toolkitbyproductList: Toolkitbyproduct[] = [];

  collegeList: Collegelist[] = [];

  collegestudylist: Collegestudylist[] = [];

  propertyList: Storeshuxing[] = [];

  viewScopeList: any[] = [
    { id: 1, label: '全员' },
    { id: 2, label: '船长/副船长' },
    { id: 3, label: '船长' },
  ];

  typeList: any[] = [
    { value: '112', label: '专业线' },
    { value: '111', label: '员工日常' },
    { value: 'store', label: '兵器库' },
    { value: 'house', label: '黄金屋' },
  ];

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

  fileRegexCheck(): boolean {
    let fileCheck = true;
    try {
      this.editParams.fileContent.forEach((e: any) => {
        if (!e.fileName) {
          fileCheck = false;
          Message.warning('请上传文件');
          throw new Error('break');
        }
        if (!e.summary) {
          fileCheck = false;
          Message.warning('请输入预览');
          throw new Error('break');
        }
      });
    } catch (err) {
      console.log(err);
    }

    return fileCheck;
  }

  clearFile(k: number) {
    this.editParams.fileContent[k].fileName = '';
    this.editParams.fileContent[k].filePath = '';
    this.editParams.fileContent[k].summary = '';
    this.editParams.fileContent[k].fileSize = '';
  }

  addFile() {
    this.editParams.fileContent.push({
      fileName: '',
      filePath: '',
      summary: '',
      fileSize: '',
    });
  }

  cancel() {
    this.$emit('cancel');
  }

  typeChange(typeId: string) {
    this.toolkitId = [];
    this.editParams.collegeId = null;
    this.editParams.studyId = null;
    this.editParams.viewScope = null;
    this.editParams.tagText = null;
    this.editParams.productId = 0;
    this.editParams.task_toolkit_id = 0;
    this.editParams.shuxingId = null;
    this.editParams.pubCompany = '';
    this.editParams.pubTime = '';
    this.editParams.fileAddressWindows = null;
    this.editParams.fileAddress = null;
    this.editParams.fileContent = [
      {
        fileName: '',
        filePath: '',
        summary: '',
        fileSize: '',
      },
    ];
    this.editParams.picture = null;
  }

  reduceFile(k: number) {
    this.editParams.fileContent.splice(k, 1);
  }

  handleFileBeforeUpload(file: any): boolean {
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

  handleFileSuccess(file: any, k: number) {
    this.editParams.fileContent[k].fileName = file.name;
    this.editParams.fileContent[k].filePath = file.response;
    this.editParams.fileContent[k].fileSize = file.size;
    Message.success('上传成功');
  }

  handlePicBeforeUpload(file: any): boolean {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      MessageBox.confirm(
        `<div class="upload-error-wrapper">
        <span class="upload-fail-img"></span>
        <p class="error-msg">很抱歉，仅支持上传PNG、JPEG格式图片</p>
        <p class="error-msg">您可以重新上传</p>
      </div>`,
        {
          dangerouslyUseHTMLString: true,
        },
      );

      return false;
    }
    if (file.size > 1024 * 1000 * 5) {
      MessageBox.confirm(
        `<div class="upload-error-wrapper">
        <span class="upload-fail-img"></span>
        <p class="error-msg">很抱歉，图片超过5MB</p>
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

  handlePicSuccess(file: any) {
    this.editParams.picture = file.response;
    Message.success('图片上传成功');
  }

  handleError() {
    Message.error('上传失败');
  }

  async getCollegestudylist(collegeId: any) {
    const defaultStudy = [
      {
        studyId: '0',
        title: '全部',
      },
    ];

    if (collegeId !== 0) {
      const collegestudylistRes = await Network.fetch<CollegestudylistRes>(
        'getCollegestudylist',
        { collegeId },
      );

      this.collegestudylist = [
        ...defaultStudy,
        ...collegestudylistRes.data.retData.data,
      ];
    } else {
      this.collegestudylist = defaultStudy;
    }
  }

  async getToolkitbyproduct() {
    const toolkitbyproduct = await Network.fetch<ToolkitbyproductRes>(
      'getToolkitbyproduct',
    );

    const toolkitbyproductList: Toolkitbyproduct[] = JSON.parse(
      JSON.stringify(toolkitbyproduct.data.retData.toolkit),
    );
    this.toolkitbyproductList = toolkitbyproduct.data.retData.toolkit;

    toolkitbyproductList.forEach((ele, ind) => {
      // 将后台返回的格式转换成element-UI识别的格式
      this.toolkitbyproductList[ind].value = ele.productId;
      this.toolkitbyproductList[ind].label = ele.productName;
      this.toolkitbyproductList[ind].children = [];
      ele.child.forEach((i, k) => {
        this.toolkitbyproductList[ind].children.push({
          value: i.toolkitId,
          label: i.toolkitName,
        });
      });
    });
  }

  handleCollgeChange(id: number) {
    this.editParams.studyId = null;
    this.getCollegestudylist(id);
  }

  async submit() {
    switch (this.editParams.typeId) {
      case '112':
        if (this.regexCheck(LineRegexCheck)) break;
        else return;
      case '111':
        if (this.regexCheck(StaffRegexCheck)) break;
        else return;
      case 'store':
        if (this.regexCheck(StoreRegexCheck) && this.fileRegexCheck()) break;
        else return;
      case 'house':
        if (this.regexCheck(HouseRegexCheck)) break;
        else return;
      default:
        Message.warning('请选择类别');
        return;
    }
    const [productId, taskToolkitId] = this.toolkitId;
    this.editParams.productId = productId;
    this.editParams.task_toolkit_id = taskToolkitId;
    const qAAnswerOpertRes = await Network.fetch<QAAnswerOpertRes>(
      'qAAnswerOpert',
      this.editParams,
    );
    if (qAAnswerOpertRes.data.retCode === 0) {
      Message.success('提交成功');
      this.$emit('changeContent');
    }
  }

  async created() {
    await Promise.all([
      (async () => {
        const qAAnswerDetailRes = await Network.fetch<QAAnswerDetailRes>(
          'qAAnswerDetail',
          { answerId: this.answerId },
        );
        this.editParams = qAAnswerDetailRes.data.retData.tipsInfo;
        // this.defaultContent = qAAnswerDetailRes.data.retData.tipsInfo.content;

        this.toolkitId[0] = this.editParams.productId as number;
        this.toolkitId[1] = this.editParams.task_toolkit_id as number;
        this.getToolkitbyproduct();
      })(),
      (async () => {
        const collegelistRes = await Network.fetch<CollegelistRes>(
          'getCollegelist',
        );

        const defaultCollege = [
          {
            collegeId: '0',
            title: '全部',
            item: [],
          },
        ];

        this.collegeList = [
          ...defaultCollege,
          ...collegelistRes.data.retData.data,
        ];

        if (this.editParams.collegeId) this.getCollegestudylist(this.editParams.collegeId);
      })(),
      (async () => {
        const propertyRes = await Network.fetch<StoreshuxingRes>(
          'getStoreShuXingList',
        );
        this.propertyList = propertyRes.data.retData.shuxingList;
      })(),
    ]);
    this.isLoading = false;
  }
}
</script>
