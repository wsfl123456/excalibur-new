import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
// @ts-ignore
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import MemberSelect from '@/components/MemberSelect';
import {
  ListInput,
  ListRadio,
  ListTplItem,
  ListSelect,
  ListSwitch,
  ListUpload,
  ListMember,
  ListDate,
} from '@/interface';
import Upload from './upload.vue';

@Component({
  components: {
    quillEditor,
    MemberSelect,
    Upload,
  },
})
export default class ListTpl extends Vue {
  @Prop({ type: Boolean, default: () => false }) readonly borderLess!: boolean;

  @Prop(Array) readonly data!: ListTplItem[][];

  render() {
    const data = this.data || [];

    return (
      <div class={['list-tmp', this.borderLess ? 'no-border' : 'border']}>
        { data.map(row => this.switchRowTemplate(row))}
      </div>
    );
  }

  /*
   * 对某些特殊的需要占用一行或者几行等特殊列启用专用的特殊样式
   * 特殊样式需要单独占用一行至少，并且在第一个
   * 例如: 富文本编辑器
   * */
  switchRowTemplate(row: ListTplItem[]) {
    let inputItem: any;
    const mode = row[0].inputType;
    const extraClass = row[0].className;

    switch (mode) {
      case 'editor':
        // eslint-disable-next-line no-case-declarations
        const editorOptions = {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['clean'],
              ['link', 'image', 'video'],
            ],
          },
        };

        inputItem = row[0] as ListInput;

        return (
          <div class={['row', 'editor-row', extraClass]}>
            <div class="label">
              {inputItem.required && <span class="el-icon-star-on" />}
              <span>{inputItem.label}</span>
            </div>
            <div class="editor">
              <quill-editor
                value={inputItem.inputParams.value}
                options={editorOptions}
                onInput={(v:string) => { inputItem.inputParams.value = v; }}>
              </quill-editor>
            </div>
          </div>
        );
      case 'thumbnail':
        return <div class={['row', 'thumbnail', extraClass]}>{row.map(col => this.switchTemplate(col))}</div>;
      default:
        return <div class={['row', extraClass]}>{row.map(col => this.switchTemplate(col))}</div>;
    }
  }

  /*
   * 对列表格模板的选项，根据其类型选择不同的值模板
   * 从而决定表格具体行的情况
   * */
  // eslint-disable-next-line class-methods-use-this
  switchTemplate(item: ListTplItem) {
    let input;
    let inputParams: any;

    switch (item.inputType) {
      case 'input':
        inputParams = item.inputParams as ListInput;

        input = <el-input
          value={inputParams.value}
          placeholder={inputParams.placeholder}
          disabled={inputParams.disabled}
          onInput={(v: string) => { inputParams.value = v; }}/>;
        break;
      case 'radio':
        inputParams = item.inputParams as ListRadio;
        input = (
          <el-radio-group
            value={inputParams.value}
            disabled={inputParams.disabled}
            onInput={(v:string) => { inputParams.value = v; }}>
            {inputParams.radios.map((radio: any, key: number) => <el-radio
              key={key}
              label={radio.label}
              disabled={radio.disabled}>{radio.name}
              </el-radio>)}
          </el-radio-group>
        );
        break;
      case 'select':
        inputParams = item.inputParams as ListSelect;
        input = (
          <el-select
            value={inputParams.value}
            disabled={inputParams.disabled}
            multiple={inputParams.multiple}
            placeholder={inputParams.placeholder}
            onInput={(v:string) => { inputParams.value = v; }}
            style={{width:'100%'}}>
            {
              inputParams.options.map((option: any, key: number) => <el-option
              key={key}
              label={option.label}
              value={option.value}
              disabled={option.disabled} />)
            }
          </el-select>
        );
        break;
      case 'upload':
      case 'thumbnail':
        inputParams = item.inputParams as ListUpload;

        input = <upload input-type={item.inputType} input-params={inputParams}/>;
        break;
      case 'switch':
        inputParams = item.inputParams as ListSwitch;
        input = (
          <el-switch
            value={inputParams.value}
            active-color={inputParams.activeColor || '#13ce66'}
            inactive-color={inputParams.inactiveColor || '#ff4949'}
            active-value={inputParams.activeValue || '1'}
            inactive-value={inputParams.inactiveValue || '0'}
            onInput={(v:string) => { inputParams.value = v; }}
            disabled={inputParams.disabled}
            active-text={inputParams.activeText || '开'}
            inactive-text={inputParams.inactiveText || '关'}>
          </el-switch>
        );
        break;
      case 'date':
      case 'datetime':
        inputParams = item.inputParams as ListDate;
        input = (
          <el-date-picker
            onInput={(v:string) => { inputParams.value = v; }}
            type={item.inputType}
            picker-options={inputParams.pickOptions}
            disabled={inputParams.disabled}
            editable={inputParams.editable}
            clearable={inputParams.clearable}
            value={inputParams.value}>
          </el-date-picker>
        );
        break;
      case 'member':
        inputParams = item.inputParams as ListMember;
        input = (
          <member-select
            project-id={46}
            value={inputParams.value}
            readonly={inputParams.readonly}
            multiple={inputParams.multiple}
            tooltip={inputParams.tooltip}
            onInput={(v:any) => { inputParams.value = v; }}>
          </member-select>
        );
        break;
      default:
        inputParams = item.inputParams as any;
        input = inputParams ? inputParams.value : '';
        break;
    }

    return [
      <div class="label">
        {item.required && <span class="el-icon-star-on" />}
        <span>{item.label}</span>
      </div>,
      <div class="content">{input}</div>,
    ];
  }
}
