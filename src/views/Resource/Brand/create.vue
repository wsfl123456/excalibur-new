<template>
  <div class="brand-create">
    <router-link class="back" :to="{name: 'brand'}">返回品牌列表</router-link>

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

    <list-tpl class="list-item" :data="brandData"></list-tpl>
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

    <el-button
      class="center btn-large"
      type="primary"
      @click="createBrand">提交品牌信息</el-button>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import flatten from 'array-flatten';
import ListTpl from '@/components/ListTpl';
import {
  ListTplItem,
  ListRadio,
  ProfessionListRes,
  SignatoryCompanyRes,
  BrandLeader,
  ListMember,
  CreateBrandRes,
  BrandDataRes,
  EditBrandRes,
} from '@/interface';
import Network from '@/network';
import {
  formRegexCheckHandler,
  regexCheck,
  convertListToFormData,
  stuffFormData,
} from '@/util';

function getBrandData() {
  return [
    [
      {
        required: true,
        label: '品牌名称',
        prop: 'customerName',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请填写品牌名称',
        },
        regex: {
          test: true,
        },
      },
    ],
    [
      {
        required: true,
        label: '品牌分类',
        prop: 'industry',
        inputType: 'radio',
        inputParams: {
          value: '',
          radios: [],
        },
        regex: {
          test: true,
          errorMsg: '请选择品牌分类',
        },
      },
    ],
    [
      {
        required: true,
        label: '品牌简介',
        prop: 'brandSummary',
        inputType: 'editor',
        inputParams: {
          value: '',
        },
        regex: {
          test: true,
        },
      },
    ],
    [
      {
        required: true,
        label: '合作状态',
        prop: 'workState',
        inputType: 'radio',
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
        regex: {
          test: true,
          errorMsg: '请选择合作状态',
        },
      },
    ],
    [
      {
        required: true,
        label: '品牌全称',
        prop: 'brandFullName',
        inputType: 'input',
        regex: {
          test: true,
        },
        inputParams: {
          value: '',
          placeholder: '请输入品牌全称',
        },
      },
      {
        required: true,
        label: '公司地址',
        prop: 'brandAddress',
        inputType: 'input',
        regex: {
          test: true,
        },
        inputParams: {
          value: '',
          placeholder: '请输入公司地址',
        },
      },
    ],
    [
      {
        label: '品牌官网',
        prop: 'webSiteUrl',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入品牌官网地址',
        },
      },
      {
        label: '品牌资料',
        prop: 'brandZiliao',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入品牌资料公盘地址',
        },
      },
    ],
    [
      {
        label: '品牌微博',
        prop: 'weibo',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入品牌微博',
        },
      },
      {
        label: '品牌公众号',
        prop: 'wechart',
        inputType: 'input',
        inputParams: {
          value: '',
          placeholder: '请输入品牌公众号',
        },
      },
    ],
  ];
}

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
        // regex: {
        //   test: /^([A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20})?$/,
        //   errorMsg: '税号由15或者17或者18或者20位大写字母、数字组成',
        // },
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
        regex: {
          test: /^\d*$/,
          errorMsg: '银行账号只能是数字',
        },
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
        //   test: /^[A-Za-z0-9.\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
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
export default class BrandCreate extends Vue {
  isEditMode: boolean = false;

  logo: string = '';

  brandData: ListTplItem[][] = getBrandData();

  accountInfoList: ListTplItem[][][] = [getAccountInfo()];

  contactPersonList: ListTplItem[][][] = [getContactPerson()];

  contactData: ListTplItem[][] = [
    [
      {
        label: '签约公司',
        prop: 'ncCompanyId',
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
    [
      {
        label: '品牌审核',
        prop: 'auditId',
        inputType: 'member',
        inputParams: {
          value: [],
          readonly: true,
        },
        regex: {
          test: true,
          errorMsg: '品牌审核人不能为空',
        },
      },
    ],
  ];

  async created() {
    if (this.$route.name === 'brandEdit') this.isEditMode = true; // 进入编辑模式

    await Promise.all([
      (async () => {
        /* 行业列表 */
        const professionListRes = await Network.fetch<ProfessionListRes>('getProfessionList');
        professionListRes.data.retData.data.forEach((i) => {
          if (this.brandData[1][0].inputParams) {
            const listRadioType = this.brandData[1][0].inputParams as ListRadio;
            listRadioType.radios.push({
              name: i.industryName,
              label: String(i.id),
            });
          }
        });
      })(),
      (async () => {
        /* 签约公司 */
        const signatoryCompanyRes = await Network.fetch<SignatoryCompanyRes>('getSignatoryCompany');
        signatoryCompanyRes.data.retData.data.forEach((i) => {
          const listItem = this.contactData[0][0].inputParams as ListRadio;
          listItem.radios.push({
            label: String(i.idAuto),
            name: i.customerName,
          });
        });
      })(),
      (async () => {
        /* 品牌审核Leader */
        const signatoryCompanyRes = await Network.fetch<BrandLeader>('getBrandLeader');
        signatoryCompanyRes.data.retData.data.forEach((i) => {
          const listItem = this.contactData[1][0].inputParams as ListMember;
          listItem.value.push({
            id: i.id,
            name: i.name,
            userName: i.name,
            headPic: i.headPic,
          });
        });
      })(),
      (async () => {
        if (!this.isEditMode) return;

        const brandDataRes = await Network.fetch<BrandDataRes>('getBrandData', { id: this.$route.params.id });
        const brandInfo = brandDataRes.data.retData;

        /* 当无编辑权限时, 返回品牌里列表 */
        if (brandInfo.roleInfo && brandInfo.roleInfo.edit !== 'show') {
          this.$message.error({
            message: '您无权限修改此品牌信息, 即将返回品牌列表',
            onClose: () => {
              this.$router.push({ name: 'brand' });
            },
          });
        }

        /* 当处于编辑页面时进入编辑模式，填充数据 */
        this.logo = brandInfo.picture;

        stuffFormData(brandInfo, this.brandData); // 品牌数据

        /* 账户数据填充 */
        this.accountInfoList = brandInfo.accountInfo.map((i) => {
          const accountInfo = getAccountInfo();
          stuffFormData(i, accountInfo);
          return accountInfo;
        });

        /* 联系人数据填充 */
        this.contactPersonList = brandInfo.contactsInfo.map((i) => {
          const person = getContactPerson();
          stuffFormData(i, person);
          return person;
        });

        /* 签约公司数据填充 */
        const companyParams = this.contactData[0][0].inputParams as ListRadio;
        if (companyParams) companyParams.value = String(brandInfo.ncCompanyId);
      })(),
    ]);
  }

  async createBrand() {
    /* Logo及品牌信息表单数据校验 */
    if (!regexCheck(this.logo, true)) {
      this.$message.warning('请选择品牌Logo');
      return;
    }
    if (!formRegexCheckHandler(this.brandData)) return;

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

    const contactsInfo = this.contactPersonList.map(i => convertListToFormData(i)); // 联系人数据
    const accountInfo = this.accountInfoList.map(i => convertListToFormData(i)); // 账户信息

    /* 签约审核人数据 */
    const auditIdItem = this.contactData[1][0].inputParams as ListMember;
    const auditId = auditIdItem.value[0].id;
    const companyItem = this.contactData[0][0].inputParams as ListRadio;
    const ncCompanyId = companyItem.value;

    const listToformData = convertListToFormData(this.brandData);
    const formData = {
      address: listToformData.brandAddress,
      picture: this.logo,
      contactsInfo,
      accountInfo,
      auditId,
      ncCompanyId,
      ...listToformData,
    };

    if (!this.isEditMode) {
      const createBrandRes = await Network.fetch<CreateBrandRes>('createBrand', formData);
      if (createBrandRes.data.retCode === 0) {
        this.$message.success({
          message: '品牌创建成功',
          onClose: () => {
            this.$router.push({ name: 'brand' });
          },
        });
      }
    } else {
      const editBrandRes = await Network.fetch<EditBrandRes>('editBrand', {
        ...formData,
        id: this.$route.params.id,
      });

      if (editBrandRes.data.retCode === 0) {
        this.$message.success({
          message: '修改成功，即将返回品牌详情',
          onClose: () => {
            this.$router.push({ name: 'brandHome' });
          },
        });
      }
    }
  }

  addAccountInfo() {
    this.accountInfoList.push(getAccountInfo());
  }

  addContactPerson() {
    this.contactPersonList.push(getContactPerson());
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
