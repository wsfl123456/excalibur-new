<template>
  <div class="weaponry-create">
    <router-link class="back" :to="{name: 'weaponry'}">返回列表</router-link>

    <div v-loading="isLoading">
      <div class="normal-form">
        <el-form label-width="140px">
          <div class="row-form">
            <el-form-item label="标题" required>
              <el-input v-model="params.title" placeholder="请填写标题"></el-input>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item label="学院" required>
              <el-select
                v-model="params.collegeId"
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
            <el-form-item label="专业">
              <el-select v-model="params.studyId" clearable placeholder="请选择专业">
                <el-option
                  v-for="(i, k) in collegestudylist"
                  :label="i.title"
                  :value="Number(i.studyId)"
                  :key="k"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item label="分组" required>
              <el-select v-model="params.viewScope" placeholder="请选择分组">
                <el-option v-for="(i, k) in viewScopeList" :label="i.label" :value="i.id" :key="k"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-input v-model="params.tagText" placeholder="请填写标签，如有多个，请用空格隔开"></el-input>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item label="属性" required>
              <el-select v-model="params.shuxingId" placeholder="请选择属性">
                <el-option
                  v-for="(i, k) in propertyList"
                  :label="i.shuxingName"
                  :value="i.shuxingId"
                  :key="k"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item label="状态" required>
              <el-switch
                class="switch"
                v-model="params.state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="2"
              ></el-switch>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="normal-form top20" v-for="(i, k) in params.fileContent" :key="k">
        <el-form label-width="140px">
          <div class="row-form">
            <el-form-item label="上传文件" required>
              <div style="display:flex">
                <el-upload
                  action="/api/ueditor/index?action=uploadfile&encode=utf-8"
                  :show-file-list="false"
                  :before-upload="handleBeforeUpload"
                  :on-success="(response, file, fileList) => handleSuccess(file, k)"
                  :on-error="handleError"
                  class="left15"
                >
                  <div v-if="!i.filePath">
                    <el-button icon="el-icon-upload2" type="text">上传文件</el-button>
                    <span style="color:#868e96">（文件最大50MB，不限制仅支持Pdf）</span>
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
          </div>
          <div class="row-form">
            <el-form-item label="预览" required>
              <quill-editor v-model="i.summary" class="editor" :options="editOpt"></quill-editor>
            </el-form-item>
          </div>
        </el-form>

        <div class="text-right">
          <el-button
            icon="el-icon-remove"
            type="text"
            class="red-important"
            @click="() => { params.fileContent.splice(k, 1); fileList.splice(k, 1) }"
            v-if="params.fileContent.length > 1"
          >删除文件</el-button>
          <el-button icon="el-icon-circle-plus" type="text" @click="addFile">添加文件</el-button>
        </div>
      </div>
    </div>

    <el-button class="center btn-large" type="primary" @click="save">保存</el-button>
  </div>
</template>
<script lang="ts">
import './index.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Message, MessageBox } from 'element-ui';
import merge from 'deepmerge';
import {
  Collegelist,
  CollegelistRes,
  Collegestudylist,
  CollegestudylistRes,
  WeaponrtForm,
  Storeshuxing,
  StoreshuxingRes,
  StoreAddRes,
  StoreDetailRes,
  StoreEditRes,
  FileContent,
} from '@/interface';
import { editorOptions } from '@/util';
import Network from '@/network';

const { quillEditor } = require('vue-quill-editor');

const StoreRegexCheck = new Map([
  [['params', 'title'], '请填写标题'],
  [['params', 'collegeId'], '请选择学院'],
  [['params', 'viewScope'], '请选择分组'],
  [['params', 'shuxingId'], '请选择属性'],
]);

@Component({
  components: {
    quillEditor,
  },
})
export default class WeaponryCreate extends Vue {
  editOpt: any = {
    ...merge(editorOptions, {
      placeholder: '请在此输入预览',
    }),
  };

  isEditMode: boolean = false;

  isLoading: boolean = true;

  collegeList: Collegelist[] = [];

  collegestudylist: Collegestudylist[] = [];

  propertyList: Storeshuxing[] = [];

  viewScopeList: any[] = [
    { id: 1, label: '全员' },
    { id: 2, label: '船长/副船长' },
    { id: 3, label: '船长' },
  ];

  params: WeaponrtForm = {
    storeId: null,
    title: '',
    collegeId: null,
    studyId: null,
    viewScope: 1,
    tagText: '',
    shuxingId: null,
    state: 1,
    fileContent: [
      {
        fileName: '',
        filePath: '',
        summary: '',
        fileSize: '',
      },
    ],
  };

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
      this.params.fileContent.forEach((e) => {
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

  handleCollgeChange(id: number) {
    this.params.studyId = null;
    this.getCollegestudylist(id);
  }

  clearFile(k: number) {
    this.params.fileContent[k].fileName = '';
    this.params.fileContent[k].filePath = '';
    this.params.fileContent[k].summary = '';
    this.params.fileContent[k].fileSize = '';
  }

  addFile() {
    this.params.fileContent.push({
      fileName: '',
      filePath: '',
      summary: '',
      fileSize: '',
    });
  }

  handleBeforeUpload(file: any): boolean {
    if (file.size > 1024 * 1000 * 50) {
      MessageBox.confirm(
        `<div class="upload-error-wrapper">
        <span class="upload-fail-img"></span>
        <p class="error-msg">很抱歉，文件超过50MB</p>
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

  handleSuccess(file: any, k: number) {
    this.params.fileContent[k].fileName = file.name;
    this.params.fileContent[k].filePath = file.response;
    this.params.fileContent[k].fileSize = file.size;
    Message.success('上传成功');
  }

  handleError() {
    Message.error('上传失败');
  }

  async save() {
    const canSave = this.regexCheck(StoreRegexCheck) && this.fileRegexCheck();

    if (canSave) {
      let storeAddRes;
      let storeEditRes;
      switch (this.isEditMode) {
        case false:
          storeAddRes = await Network.fetch<StoreAddRes>(
            'addStore',
            this.params,
          );
          if (storeAddRes.data.retCode === 0) {
            Message.success('添加成功');
            setTimeout(() => {
              this.$router.push({
                name: 'weaponry',
              });
            }, 2000);
          }
          break;
        case true:
          storeEditRes = await Network.fetch<StoreEditRes>(
            'editStore',
            this.params,
          );
          if (storeEditRes.data.retCode === 0) {
            Message.success('修改成功');
            setTimeout(() => {
              this.$router.push({
                name: 'weaponry',
              });
            }, 2000);
          }
          break;

        default:
          break;
      }
    }
  }

  async created() {
    if (this.$route.name === 'weaponryEdit') this.isEditMode = true; // 进入编辑模式

    await Promise.all([
      (async () => {
        if (this.isEditMode) {
          const storeDetailRes = await Network.fetch<StoreDetailRes>(
            'storeDetail',
            { storeId: this.$route.params.id },
          );
          this.params = storeDetailRes.data.retData.tipsInfo;

          if (this.isEditMode) this.getCollegestudylist(this.params.collegeId);
        }
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
