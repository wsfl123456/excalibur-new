<template>
  <div class="project-case-upload">
    <div class="back" @click="$emit('switch-page', 'list')">返回案例列表</div>
    <list-tpl :data="formData" border-less></list-tpl>
    <el-button type="primary" class="btn-large center" @click="createProjectCase">保存项目案例</el-button>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ListTpl from '@/components/ListTpl/index';
import {
  ListTplItem,
  ProjectCaseTagRes,
  ProjectCaseStateRes,
  ListSelect,
  ListUpload,
  AddProjectCaseRes,
  ProjectCaseDetailRes,
  EditCaseDetailRes,
} from '@/interface';
import Network from '@/network';
import { formRegexCheckHandler, convertListToFormData, stuffFormData } from '@/util';

@Component({
  components: {
    ListTpl,
  },
})
export default class ProjectCaseUpload extends Vue {
  @Prop(Number) readonly id!: number;

  get isEditMode() {
    return this.id !== undefined;
  }

  formData: ListTplItem[][] = [
    [
      {
        required: true,
        label: '标题',
        prop: 'title',
        inputType: 'input',
        regex: {
          test: true,
        },
        inputParams: {
          value: '',
          placeholder: '请输入标题',
        },
      },
    ],
    [
      {
        required: true,
        label: '标签',
        prop: 'tagId',
        inputType: 'select',
        regex: {
          test: true,
          errorMsg: '请选择案例标签',
        },
        inputParams: {
          value: '',
          placeholder: '请选择案例标签',
          options: [],
        },
      },
    ],
    [
      {
        required: true,
        label: '类别',
        prop: 'typeId',
        inputType: 'select',
        regex: {
          test: true,
          errorMsg: '请选择案例类别',
        },
        inputParams: {
          value: '',
          placeholder: '请选择案例类别',
          options: [],
        },
      },
    ],
    [
      {
        required: true,
        label: '下载地址',
        prop: 'fileAddress',
        inputType: 'input',
        regex: {
          test: true,
        },
        inputParams: {
          value: '',
          placeholder: '请输入下载地址',
        },
      },
    ],
    [
      {
        required: true,
        label: '缩略图',
        prop: 'picture',
        inputType: 'thumbnail',
        regex: {
          test: true,
        },
        inputParams: {
          tipText: '(请上传的图片清晰可见，不超过10m，格式为：bmp,jpg,png)',
          uploadText: '添加图片',
          action: '/api/ueditor/index?action=uploadfile&encode=utf-8',
          value: '',
          onSuccess: (url: string) => {
            const inputParams = this.formData[4][0].inputParams as ListUpload;
            inputParams.value = url;
          },
          beforeUpload: (file: any) => {
            const isImg = file.type === 'image/bmp'
              || file.type === 'image/jpeg'
              || file.type === 'image/jpg'
              || file.type === 'image/png';
            const isLt10M = file.size / 1024 / 1024 <= 10;

            if (!isImg) {
              this.$message.error('仅支持BMP、JPG、PNG、JPEG格式的图片');
              return false;
            }
            if (!isLt10M) {
              this.$message.error('图片大小不超过10M');
            }
            return isImg && isLt10M;
          },
        },
      },
    ],
    [
      {
        required: true,
        label: '相关文件',
        prop: 'filePath',
        inputType: 'upload',
        regex: {
          test: true,
        },
        inputParams: {
          tipText: '(上传文件大小不超过2MB，格式仅为PDF)',
          action: '/api/ueditor/index?action=uploadfile&encode=utf-8',
          limit: 1,
          value: '',
          beforeUpload: (file: any) => {
            const isPdf = file.type === 'application/pdf';
            if (!isPdf) { this.$message.error('仅支持PDF文件'); return false; }

            const isLt2M = file.size / 1024 / 1024 <= 2;
            if (!isLt2M) this.$message.error('文件大小不能超过2M');

            return isPdf && isLt2M;
          },
          onSuccess: (url: string) => {
            const inputParams = this.formData[5][0].inputParams as ListUpload;
            inputParams.value = url;
          },
        },
      },
    ],
    [
      {
        required: true,
        label: '相关内容',
        prop: 'content',
        inputType: 'editor',
        regex: {
          test: true,
        },
        inputParams: {
          value: '',
        },
      },
    ],
    [
      {
        required: true,
        label: '状态',
        prop: 'state',
        inputType: 'switch',
        regex: {
          test: true,
        },
        inputParams: {
          inactiveValue: '2',
          value: '1',
        },
      },
    ],
  ];

  async created() {
    return Promise.all([
      (async () => {
        /* 案例标签列表 */
        const projectCaseTagsRes = await Network.fetch<ProjectCaseTagRes>('getProjectCaseTags');
        const tagParams = this.formData[1][0].inputParams as ListSelect;
        tagParams.options = projectCaseTagsRes.data.retData.data.map(i => ({
          label: i.name,
          value: String(i.id),
        }));
      })(),
      (async () => {
        /* 案例状态列表 */
        const projectCaseStateRes = await Network.fetch<ProjectCaseStateRes>('getProjectCaseState');
        const statePrams = this.formData[2][0].inputParams as ListSelect;
        statePrams.options = projectCaseStateRes.data.retData.data.map(i => ({
          label: i.name,
          value: String(i.id),
        }));
      })(),
      (async () => {
        /* 编辑模式下，取案例详情，填充数据 */
        if (!this.isEditMode) return;

        const projectCaseDetailRes = await Network.fetch<ProjectCaseDetailRes>('getProjectCaseDetail', {
          caseId: this.id,
        });
        const caseDetail = projectCaseDetailRes.data.retData.caseInfo;

        stuffFormData(caseDetail, this.formData);
      })(),
    ]);
  }

  async createProjectCase() {
    /* 表单数据校验 */
    if (!formRegexCheckHandler(this.formData)) return;

    if (this.isEditMode) {
      const editRes = await Network.fetch<EditCaseDetailRes>('editProjectCaseDetail', {
        ...convertListToFormData(this.formData),
        customerId: this.$route.params.id,
        caseId: this.id,
      });

      if (editRes.data.retCode === 0) {
        this.$message.success({
          message: '案例修改成功，即将返回案例详情',
          onClose: () => {
            this.$emit('switch-page', 'detail', this.id);
          },
        });
      }
    } else {
      const createRes = await Network.fetch<AddProjectCaseRes>('addProjectCase', {
        ...convertListToFormData(this.formData),
        customerId: this.$route.params.id,
      });
      if (createRes.data.retCode === 0) {
        this.$message.success({
          message: '案例创建成功，即将返回案例列表',
          onClose: () => {
            this.$emit('switch-page', 'list');
          },
        });
      }
    }
  }
}
</script>
