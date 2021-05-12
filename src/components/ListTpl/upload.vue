<template>
  <el-upload
    class="upload-container"
    :show-file-list="inputType === 'upload'"
    :limit="inputParams.limit"
    :multiple="inputParams.multiple"
    :file-list="inputParams.value | getFileList"
    :action="inputParams.action"
    :before-upload="inputParams.beforeUpload"
    :on-success="inputParams.onSuccess"
    :on-preview="inputParams.handlePreview"
    :on-remove="inputParams.handleRemove"
    :before-remove="inputParams.beforeRemove"
    :on-exceed="inputParams.handleExceed">
    <template v-if="inputType === 'upload'">
      <div slot="tip" class="el-upload__tip">{{ inputParams.tipText }}</div>
      <el-button icon="el-icon-upload" type="primary">{{ inputParams.uploadText || '上传文件' }}</el-button>
    </template>
    <template v-else>
      <template v-if="inputParams.value">
        <el-avatar class="avatar" alt="Logo" shape="square" :src="inputParams.value"></el-avatar>
      </template>
      <template v-else>
        <div class="upload-text">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <p>{{ inputParams.uploadText || '上传Logo'}}</p>
        </div>
      </template>
      <span class="tip-text">{{ inputParams.tipText }}</span>
    </template>
  </el-upload>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ListUpload } from '@/interface';
import { noAction } from '@/util';

/*
 * Upload组件作为中间组件使用
 * 用于解决JSX on-* 属性与 on-*事件 命令冲突
 * */
@Component({
  /* 将文件名转换成文件列表 */
  filters: {
    getFileList(file: string | string[]) {
      // eslint-disable-next-line no-nested-ternary
      const files: string[] = Array.isArray(file) ? file : (file ? [file] : []);

      return files.map(i => ({ name: i, url: i }));
    },
  },
})
export default class Upload extends Vue {
  @Prop(String) inputType!: string;

  @Prop(Object) inputParams!: ListUpload;
}
</script>
