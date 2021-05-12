<template>
  <div class="goldhouse-create">
    <router-link class="back" :to="{name: 'goldhouse'}">返回列表</router-link>

    <div v-loading="isLoading">
      <div class="normal-form">
        <el-form label-width="140px">
          <div class="row-form">
            <el-form-item label="标题" required>
              <el-input v-model="params.title" placeholder="请填写标题"></el-input>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item label="案例分类">
              <el-select v-model="params.postType" placeholder="请选择案例分类" clearable>
                <el-option
                  v-for="(i, k) in postTypeList"
                  :label="i.label"
                  :value="i.id"
                  :key="k"
                ></el-option>
              </el-select>
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
            <el-form-item label="专业" required>
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
            <el-form-item label="标签" required>
              <el-input v-model="params.tagText" placeholder="请填写标签"></el-input>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item label="发布机构" required>
              <el-input v-model="params.pubCompany" placeholder="请填写发布机构"></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker v-model="params.pubTime" type="date" placeholder="请选择发布时间"></el-date-picker>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item label="Win下载地址" required>
              <el-input v-model="params.fileAddressWindows" placeholder="请填写Windows下载地址"></el-input>
            </el-form-item>
            <el-form-item label="Mac下载地址" required>
              <el-input v-model="params.fileAddress" placeholder="请填写Mac下载地址"></el-input>
            </el-form-item>
          </div>
          <div class="row-form">
            <el-form-item required>
              <span slot="label">
                缩略图
                <br />
                <span style="font-size: 13px;color: #ADB5BD;">（宽高：4 X 3）</span>
              </span>
              <div class="picture-upload">
                <el-upload
                  v-if="!params.picture"
                  action="/api/ueditor/index?action=uploadfile&encode=utf-8"
                  :show-file-list="false"
                  :before-upload="handleBeforeUpload"
                  :on-success="(response, file, fileList) => handleSuccess(file)"
                  :on-error="handleError"
                >
                  <i slot="default" class="el-icon-plus icon"></i>
                </el-upload>

                <div v-if="params.picture" class="upload-view">
                  <el-image style="height:80px;width:107px" :src="params.picture" fit="cover"></el-image>
                  <div class="operate">
                    <i class="el-icon-view pointer" @click="() => { this.dialogVisible = true }"></i>
                    <i class="el-icon-delete pointer" @click="() => { this.params.picture = '' }"></i>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
          <div class="row-form gold_house_upload_hide">
              <el-upload
                :show-file-list="false"
                :on-success="handleEditSuccess"
                :max-size="2048"
                multiple
                action="/api/ueditor/index?action=uploadfile&encode=utf-8"
              >
                <el-button icon="el-icon-upload2" type="text">上传文件</el-button>
              </el-upload>
            <el-form-item label="概览" required>
              <quill-editor
              ref="goldHouseEditor"
              v-model="params.content"
              class="editor"
              :options="editOpt">
              </quill-editor>
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
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="this.params.picture" alt />
    </el-dialog>

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
  GoldHouseForm,
  HouseAddRes,
  HouseEditRes,
  GoldHouseDeatilRes,
} from '@/interface';
import { editorOptions } from '@/util';
import Network from '@/network';

const { quillEditor } = require('vue-quill-editor');

const RegexCheck = new Map([
  [['params', 'title'], '请填写标题'],
  // [['params', 'postType'], '请选择案例分类'],
  [['params', 'collegeId'], '请选择学院'],
  [['params', 'studyId'], '请选择专业'],
  [['params', 'viewScope'], '请选择分组'],
  [['params', 'tagText'], '请填写标签'],
  [['params', 'pubCompany'], '请填写发布机构'],
  [['params', 'fileAddressWindows'], '请填写Windows下载地址'],
  [['params', 'fileAddress'], '请填写Mac下载地址'],
  [['params', 'picture'], '请上传缩略图'],
  [['params', 'content'], '请填写概览'],
]);

@Component({
  components: {
    quillEditor,
  },
})
export default class GoldHouseCreate extends Vue {
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
                    '.gold_house_upload_hide .el-upload .el-button',
                  )
                  .click();
              } else {
                // this.quill.format("image", false);
              }
            },
          },
        },
      },
      placeholder: '请在此输入概览',
    }),
  };

  isEditMode: boolean = false;

  isLoading: boolean = true;

  dialogVisible: boolean = false;

  collegeList: Collegelist[] = [];

  collegestudylist: Collegestudylist[] = [];

  viewScopeList: any[] = [
    { id: 1, label: '全员' },
    { id: 2, label: '船长/副船长' },
    { id: 3, label: '船长' },
  ];

  postTypeList: any[] = [
    {
      id: 1,
      label: '行业案例',
    },
    {
      id: 5,
      label: '行业趋势',
    },
  ];

  params: GoldHouseForm = {
    houseId: null,
    collegeId: null,
    studyId: null,
    viewScope: 1,
    tagText: '',
    picture: '',
    title: '',
    content: '',
    pubCompany: '',
    pubTime: '',
    fileAddress: '',
    fileAddressWindows: '',
    state: 1,
    postType: null,
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

  handleEditSuccess(res: any) {
    // 获取富文本组件实例
    const goldHouseEditor = this.$refs.goldHouseEditor as any;
    const { quill } = goldHouseEditor;

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

  handleBeforeUpload(file: any): boolean {
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

  handleSuccess(file: any) {
    this.params.picture = file.response;
    Message.success('上传成功');
  }

  handleError() {
    Message.error('上传失败');
  }

  async save() {
    const canSave = this.regexCheck(RegexCheck);

    if (canSave) {
      let houseAddRes;
      let houseEditRes;
      switch (this.isEditMode) {
        case false:
          houseAddRes = await Network.fetch<HouseAddRes>(
            'houseadd',
            this.params,
          );
          if (houseAddRes.data.retCode === 0) {
            Message.success('添加成功');
            setTimeout(() => {
              this.$router.push({
                name: 'goldhouse',
              });
            }, 2000);
          }
          break;
        case true:
          houseEditRes = await Network.fetch<HouseEditRes>(
            'houseedit',
            this.params,
          );
          if (houseEditRes.data.retCode === 0) {
            Message.success('修改成功');
            setTimeout(() => {
              this.$router.push({
                name: 'goldhouse',
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
    if (this.$route.name === 'goldhouseEdit') this.isEditMode = true; // 进入编辑模式

    await Promise.all([
      (async () => {
        if (this.isEditMode) {
          const goldHouseDeatil = await Network.fetch<GoldHouseDeatilRes>(
            'gethousedetail',
            { houseId: this.$route.params.id },
          );
          this.params = goldHouseDeatil.data.retData.tipsInfo;

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
    ]);

    this.isLoading = false;
  }
}
</script>
