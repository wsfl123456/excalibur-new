<template>
  <div class="supplier-create">
    <router-link class="back" :to="{name: 'supplier'}">返回供应商列表</router-link>

    <el-upload
      class="avatar-uploader center"
      action="/api/ueditor/index?action=uploadfile&encode=utf-8"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <el-avatar v-if="logo" :src="logo" class="avatar" alt="Logo"></el-avatar>
      <div class="upload-text" v-else>
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <p>上传Logo</p>
      </div>
    </el-upload>
    <span class="upload-remark center">(仅支持JPG,PNG,JPEG格式的图片，文件大小不超过100KB)</span>

    <list-tpl class="list-item" :data="supplierData"></list-tpl>
    <span class="clear"></span>
    <!-- <list-tpl class="list-item" :data="accountInfo"></list-tpl>
    <span class="clear"></span> -->
    <el-button class="add-btn" type="text" icon="el-icon-circle-plus" @click="addAccountInfo">添加账户信息</el-button>
    <span class="clear"></span>
    <template v-for="(accountInfo, key) in accountInfoList">
      <list-tpl class="list-item"
                :data="accountInfo"
                :key="`account-${key}`"></list-tpl>
      <el-button
        :key="`account-btn-${key}`"
        class="delete"
        v-if="key > 0"
        type="text" icon="el-icon-remove"
        @click="removeAccountInfo(key)">
        删除账户信息
      </el-button>
      <span :key="`account-span-${key}`" class="clear"></span>
    </template>

    <el-button class="add-btn" type="text" icon="el-icon-circle-plus" @click="addContactPerson">添加联系人</el-button>
    <span class="clear"></span>
    <template v-for="(contactPerson, key) in contactPersonList">
      <list-tpl class="list-item"
                :data="contactPerson"
                :key="`person-${key}`"></list-tpl>
      <el-button
        :key="`person-btn-${key}`"
        class="delete"
        v-if="key > 0"
        type="text" icon="el-icon-remove"
        @click="removeContactPerson(key)">
        删除联系人
      </el-button>
      <span :key="`person-span-${key}`" class="clear"></span>
    </template>

    <list-tpl class="list-item" :data="contactData"></list-tpl>

    <el-button class="center btn-large" type="primary" @click="createSupplier">提交供应商信息</el-button>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import flatten from 'array-flatten';
import ListTpl from '@/components/ListTpl/index';
import {
  ListTplItem,
  ListRadio,
  SignatoryCompanyRes,
  CreateSupplierRes,
  SupplierMsgRes,
  EditSupplierRes,
} from '@/interface';
import {
  regexCheck,
  formRegexCheckHandler,
  convertListToFormData,
  stuffFormData,
} from '@/util';
import Network from '@/network';

function getAccountInfo() {
  return [
    [
      {
        label: '账户名称',
        prop: 'accountName',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入账户名称',
        },
      },
      {
        label: '税号',
        prop: 'dutyParagraph',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入品牌纳税人识别号',
        },
        regex: {
          test: /^([A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20})?$/,
          errorMsg: '税号由15或者17或者18或者20位大写字母、数字组成',
        },
      },
    ],
    [
      {
        label: '银行账号',
        prop: 'accountId',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入开户银行账号',
        },
        // regex: {
        //   test: /^\d*$/,
        //   errorMsg: '银行账号只能是数字',
        // },
      },
      {
        label: '开户银行',
        prop: 'bankName',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入开户银行名称',
        },
        // regex: {
        //   test: /^[\u4E00-\u9FA5\uFF00-\uFFEF]*$/,
        //   errorMsg: '开户行名称只能是中文',
        // },
      },
    ],
  ];
}

function getContactPerson() {
  return [
    [
      {
        label: '联系人姓名',
        prop: 'name',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入联系人姓名',
        },
      },
      {
        label: '性别',
        prop: 'gender',
        inputType: 'radio',
        inputParams: {
          value: '1',
          radios: [
            {
              label: '1',
              name: '男',
            },
            {
              label: '2',
              name: '女',
            },
          ],
        },
      },
    ],
    [
      {
        label: '职位',
        prop: 'position',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入联系人职位',
        },
      },
      {
        label: '地址',
        prop: 'contactAddress',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入联系人地址',
        },
      },
    ],
    [
      {
        label: '固定电话',
        prop: 'phoneNo',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入联系人固定电话',
        },
      },
      {
        label: '手机',
        prop: 'mobile',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入联系人手机号',
        },
        regex: {
          test: /^[1]([3-9])[0-9]{9}$/,
          errorMsg: '请输入正确的手机号码',
        },
      },
    ],
    [
      {
        label: '电子邮箱',
        prop: 'email',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入电子邮箱账号',
        },
        // regex: {
        //   test: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        //   errorMsg: '请输入正确的联系人邮箱',
        // },
      },
      {
        label: '生日',
        prop: 'birthday',
        inputType: 'date',
        inputParams: {
          value: '',
          placeholder: '请输入联系人生日',
        },
      },
    ],
    [
      {
        label: '家乡',
        prop: 'hometown',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入联系人家乡',
        },
      },
      {
        label: '喜好',
        prop: 'hobby',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入联系人喜好',
        },
      },
    ],
    [
      {
        label: '补充说明',
        prop: 'addInfo',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '如有补充说明，请在此填写',
        },
      },
    ],
  ];
}

@Component({
  components: {
    ListTpl,
  },
})
export default class SupplierCreate extends Vue {
  isEditMode = false;

  logo = '';

  supplierData: ListTplItem[][] = [
    [
      {
        required: true,
        label: '供应商名称',
        prop: 'name',
        inputType: 'input',
        regex: { test: true },
        inputParams: {
          value: '',
          placeholder: '请填写供应商名称',
        },
      },
    ],
    [
      {
        required: true,
        label: '供应商简介',
        regex: { test: true },
        prop: 'brandSummary',
        inputType: 'editor',
        inputParams: {
          value: '',
          placeholder: '请填写供应商简介',
        },
      },
    ],
    [
      {
        required: true,
        label: '供应商分类',
        className: 'multiple-radio',
        prop: 'serviceType',
        inputType: 'radio',
        regex: { test: true },
        inputParams: {
          value: '',
          radios: [
            {
              label: '1',
              name: '方案',
            },
            {
              name: 'KOL采购',
              label: '2',
            },
            {
              name: '媒体采购',
              label: '3',
            },
            {
              name: '文案撰写',
              label: '4',
            },
            {
              name: '设计',
              label: '5',
            },
            {
              name: '插画',
              label: '6',
            },
            {
              name: '摄影',
              label: '7',
            },
            {
              name: '视频制作',
              label: '8',
            },
            {
              name: '模特费等人力费',
              label: '9',
            },
            {
              name: '服务器',
              label: '10',
            },
            {
              name: '技术制作',
              label: '11',
            },
            {
              name: '数据检测与分析',
              label: '12',
            },
            {
              name: '打印',
              label: '13',
            },
            {
              name: '行政管理类',
              label: '14',
            },
            {
              name: '其他',
              label: '15',
            },
          ],
        },
      },
    ],
    [
      {
        required: true,
        label: '合作状态',
        prop: 'workState',
        inputType: 'radio',
        regex: {
          test: true,
        },
        inputParams: {
          value: '',
          radios: [
            {
              label: '1',
              name: '接触中',
            },
            {
              label: '2',
              name: '合作中',
            },
            {
              label: '3',
              name: '已解约',
            },
          ],
        },
      },
    ],
    [
      {
        required: true,
        label: '供应商全称',
        prop: 'supplierFullName',
        inputType: 'input',
        regex: {
          test: true,
        },
        inputParams: {
          value: '',
          placeholder: '请输入供应商全称',
        },
      },
      {
        required: true,
        label: '供应商地址',
        prop: 'brandAddress',
        inputType: 'input',
        regex: { test: true },
        inputParams: {
          value: '',
          placeholder: '请输入供应商地址',
        },
      },
    ],
    [
      {
        label: '供应商官网',
        prop: 'webSiteUrl',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入供应商官网地址',
        },
      },
      {
        required: true,
        label: '供应商资质证明',
        prop: 'brandZiliao',
        inputType: 'input',
        regex: { test: true },
        inputParams: {
          value: '',
          placeholder: '请输入供应商资质证明公盘地址',
        },
      },
    ],
    [
      {
        label: '供应商微博',
        prop: 'weibo',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入供应商微博',
        },
      },
      {
        label: '供应商公众号',
        prop: 'wechart',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入供应商公众号',
        },
      },
    ],
  ];

  accountInfoList: ListTplItem[][][] = [getAccountInfo()];

  contactPersonList: ListTplItem[][][] = [getContactPerson()];

  contactData: ListTplItem[][] = [
    [
      {
        label: '我司对接人',
        prop: 'normcoreContactsInfo',
        inputType: 'member',
        inputParams: {
          value: [],
          multiple: true,
        },
        regex: {
          test: true,
        },
      },
    ],
    [
      {
        label: '对方组织',
        prop: 'organizationType',
        inputType: 'radio',
        inputParams: {
          value: '',
          radios: [
            {
              label: '1',
              name: '公司',
            },
            {
              label: '2',
              name: '个人',
            },
            {
              label: '3',
              name: '工作室',
            },
          ],
        },
        regex: {
          test: true,
        },
      },
    ],
    [
      {
        label: '签约公司',
        prop: 'signCompanyId',
        inputType: 'radio',
        inputParams: {
          value: '',
          radios: [],
        },
        regex: {
          test: true,
          errorMsg: '请选择签约公司',
        },
      },
    ],
  ];

  async created() {
    if (this.$route.name === 'supplierEdit') this.isEditMode = true; // 进入编辑模式

    await Promise.all([
      (async () => {
        /* 获取签约公司数据 */
        const signatoryCompanyRes = await Network.fetch<SignatoryCompanyRes>('getSignatoryCompany');
        signatoryCompanyRes.data.retData.data.forEach((i) => {
          const listItem = this.contactData[2][0].inputParams as ListRadio;
          listItem.radios.push({
            label: String(i.idAuto),
            name: i.customerName,
          });
        });
      })(),
      (async () => {
        if (!this.isEditMode) return;

        const supplierDataRes = await Network.fetch<SupplierMsgRes>('getSupplierMsg', { id: this.$route.params.id });
        const supplierInfo = supplierDataRes.data.retData;

        /* 当处于编辑页面时进入编辑模式，填充数据 */
        this.logo = supplierInfo.picture;

        stuffFormData(supplierInfo, this.supplierData); // 品牌数据

        stuffFormData(supplierInfo, this.contactData); // 联系人数据

        /* 账户数据填充 */
        this.accountInfoList = supplierInfo.accountInfo.map((i) => {
          const accountInfo = getAccountInfo();
          stuffFormData(i, accountInfo);
          return accountInfo;
        });

        /* 联系人数据填充 */
        this.contactPersonList = supplierInfo.contactInfo ? supplierInfo.contactInfo.map((i) => {
          if (i.contactName) i.name = i.contactName;
          const person = getContactPerson();
          stuffFormData(i, person);
          return person;
        }) : [];
      })(),
    ]);
  }

  async createSupplier() {
    /* Logo及供应商信息表单数据校验 */
    // if (!regexCheck(this.logo, true)) {
    //   this.$message.warning('请选择供应商Logo');
    //   return;
    // }

    if (!formRegexCheckHandler(this.supplierData)) return;

    /* 银行账户数据校验 */
    const passed = this.accountInfoList.find(i => !formRegexCheckHandler(i));
    if (passed) return;

    /* 联系人数据校验 */
    const contactPerson = flatten(this.contactPersonList);
    const contactPersonCheckFail = contactPerson.find((i: any) => {
      if (i.inputParams.value && i.regex && !regexCheck(i.inputParams.value, i.regex.test)) {
        this.$message.warning(i.regex.errorMsg || `请输入${i.label}`);
        return true;
      }
      return false;
    });

    if (contactPersonCheckFail) return;

    /* 签约数据校验 */
    if (!formRegexCheckHandler(this.contactData)) return;

    /* 数据获取 */
    const contactInfo = this.contactPersonList.map(i => convertListToFormData(i)); // 联系人数据
    const accountInfo = this.accountInfoList.map(i => convertListToFormData(i)); // 账户信息
    const contactData = convertListToFormData(this.contactData); // 对接人数据
    const supplierData = convertListToFormData(this.supplierData); // 供应商信息

    const formData = {
      picture: this.logo,
      contactInfo,
      accountInfo,
      ...contactData,
      ...supplierData,
    };

    if (!this.isEditMode) {
      const createSupplierRes = await Network.fetch<CreateSupplierRes>('createSupplier', formData);

      if (createSupplierRes.data.retCode === 0) {
        this.$message.success({
          message: '供应商创建成功',
          onClose: () => {
            this.$router.push({ name: 'supplier' });
          },
        });
      }
    } else {
      const editSupplierRes = await Network.fetch<EditSupplierRes>('editSupplier', {
        id: this.$route.params.id,
        ...formData,
      });

      if (editSupplierRes.data.retCode === 0) {
        this.$message.success({
          message: '供应商信息修改成功，即将返回供应商详情界面',
          onClose: () => {
            this.$router.push({ name: 'supplierHome' });
          },
        });
      }
    }
  }

  addAccountInfo() {
    this.accountInfoList.push(getAccountInfo());
  }

  removeAccountInfo(key: number) {
    this.$confirm('您确定要删除此账户吗', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.accountInfoList.splice(key, 1);
    }).catch();
  }

  addContactPerson() {
    this.contactPersonList.push(getContactPerson());
  }

  removeContactPerson(key: number) {
    this.$confirm('您确定要删除此联系人吗', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.contactPersonList.splice(key, 1);
    }).catch();
  }


  handleAvatarSuccess(url: string) {
    this.logo = url;
    this.$message.success('上传成功');
  }

  beforeAvatarUpload(file: any) {
    const isImg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    const isLt100KB = file.size / 1024 <= 100;

    if (!isImg) {
      this.$message.error('仅支持JPG、PNG、JPEG格式的图片');
      return false;
    }
    if (!isLt100KB) {
      this.$message.error('文件大小不超过100KB');
    }
    return isImg && isLt100KB;
  }
}
</script>
