<template>
  <div class="livemap-create">
    <div class="normal-form">
      <el-form label-width="140px">
        <div class="row-form">
          <el-form-item label="类别" required>
            <el-select v-model="params.typeId" placeholder="请选择类别">
              <el-option label="专业线" :value="112"></el-option>
              <el-option label="员工日常" :value="111"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row-form" v-show="params.typeId === 112">
          <el-form-item label="学院" required>
            <el-select v-model="params.collegeId" placeholder="请选择学院" @change="handleCollgeChange">
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
        <div class="row-form" v-show="params.typeId === 112">
          <el-form-item label="分组" required>
            <el-select v-model="params.viewScope" placeholder="请选择分组">
              <el-option v-for="(i, k) in viewScopeList" :label="i.label" :value="i.id" :key="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="params.tagText" placeholder="请填写标签"></el-input>
          </el-form-item>
        </div>
        <div class="row-form" v-show="params.typeId === 112">
          <el-form-item label="工具包">
            <el-cascader
              v-model="toolkitId"
              :options="toolkitbyproductList"
              :props="{ expandTrigger: 'hover' }"
              placeholder="请选择工具包"
            ></el-cascader>
          </el-form-item>
        </div>
        <div class="row-form">
          <el-form-item label="标题" required>
            <el-input v-model="params.title" placeholder="请填写标题"></el-input>
          </el-form-item>
        </div>
        <div class="row-form">
          <el-form-item label="内容" required>
            <quill-editor class="editor" v-model="params.content" :options="editOpt"></quill-editor>
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

    <div class="btn-group">
      <el-button class="btn-large" @click="() => { this.$emit('cancel') }">取消</el-button>
      <el-button type="primary" class="btn-large" @click="answer">提交</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import './index.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {
  Component, Vue, Watch, Prop,
} from 'vue-property-decorator';
import { Message } from 'element-ui';
import {
  LivemapCreateForm,
  Collegelist,
  CollegelistRes,
  Collegestudylist,
  CollegestudylistRes,
  Toolkitbyproduct,
  ToolkitbyproductRes,
  MapeditaskRes,
} from '@/interface';
import { editorOptions } from '@/util';
import Network from '@/network';

const { quillEditor } = require('vue-quill-editor');

const lineRegexCheck = new Map([
  [['params', 'collegeId'], '请选择学院'],
  [['params', 'viewScope'], '请选择分组'],
  [['params', 'title'], '请填写标题'],
  [['params', 'content'], '请输入内容'],
]);

const staffRegexCheck = new Map([
  [['params', 'title'], '请填写标题'],
  [['params', 'content'], '请输入内容'],
]);

@Component({
  components: {
    quillEditor,
  },
})
export default class AnswerForm extends Vue {
  @Prop({ type: Number }) readonly typeId!: number;

  @Prop({ type: String }) readonly title!: string;

  @Prop({ type: Number }) readonly tipsId!: number;

  @Watch('params.typeId', { immediate: true }) handleTypeIdChange(id: number) {
    if (id === 111) {
      this.params.collegeId = null;
      this.params.studyId = null;
      this.params.viewScope = null;
      this.params.tagText = '';
      this.toolkitId = [];
      this.collegestudylist = [];
    }
  }

  isLoading: boolean = true;

  isEditMode: boolean = false;

  editOpt: any = editorOptions;

  collegeList: Collegelist[] = [];

  collegestudylist: Collegestudylist[] = [];

  toolkitbyproductList: Toolkitbyproduct[] = [];

  toolkitId: number[] = [];

  viewScopeList: any[] = [
    { id: 1, label: '全员' },
    { id: 2, label: '船长/副船长' },
    { id: 3, label: '船长' },
  ];

  params: LivemapCreateForm = {
    tipsId: this.tipsId,
    typeId: this.typeId,
    collegeId: null,
    studyId: null,
    viewScope: null,
    tagText: '',
    productId: 0,
    task_toolkit_id: 0,
    title: this.title,
    content: '',
    state: 1,
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
    this.params.studyId = null;
    this.getCollegestudylist(id);
  }

  async answer() {
    let [canSave, params] = [true, {}];
    const [productId, taskToolkitId] = this.toolkitId;
    switch (this.params.typeId) {
      case 112:
        canSave = this.regexCheck(lineRegexCheck);
        if (canSave) {
          this.params.productId = productId;
          this.params.task_toolkit_id = taskToolkitId;
          params = Object.assign(this.params);
        }
        break;
      case 111:
        canSave = this.regexCheck(staffRegexCheck);
        if (canSave) {
          const {
            tipsId, typeId, title, content, state,
          } = this.params;
          params = {
            tipsId,
            typeId,
            title,
            content,
            state,
          };
        }
        break;
      default:
        break;
    }

    if (canSave) {
      const mapeditaskRes = await Network.fetch<MapeditaskRes>('mapeditask', params);
      if (mapeditaskRes.data.retCode === 0) this.$emit('saveSuccess');
    }
  }

  async created() {
    await Promise.all([
      (async () => {
        if (!this.isEditMode) {
          this.getToolkitbyproduct();
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
