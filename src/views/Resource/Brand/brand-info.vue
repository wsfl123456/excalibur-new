<template>
  <div class="brand-brief">
    <div class="brief-paragraph">
      <div class="title">品牌简介</div>
      <div class="brand-intro" v-html="brandInfo.brandSummary"></div>
    </div>
    <div class="brief-paragraph">
      <div class="title">品牌信息</div>
      <ul class="msg-list">
        <li>
          <div>
            <span>品牌全称:</span>
            <span>{{ brandInfo.brandFullName}}</span>
          </div>
          <div>
            <span>公司地址：</span>
            <span>{{ brandInfo.brandAddress}}</span>
          </div>
        </li>
        <li>
          <div>
            <span>品 牌 官 网：</span>
            <a target="_blank" :href="brandInfo.webSiteUrl" class="link">{{ brandInfo.webSiteUrl }}</a>
          </div>
          <div>
            <span>品牌资料：</span>
            <span>{{ brandInfo.brandZiliao }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>品 牌 微 博：</span>
            <span>{{ brandInfo.weibo }}</span>
          </div>
          <div>
            <span>品牌公众号：</span>
            <span>{{ brandInfo.wechart }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="brief-paragraph" v-if="brandInfo.showAccountContactInfo">
      <div class="title">账户信息</div>
      <ul class="msg-list" v-for="(account, key) in brandInfo.accountInfo" :key="key">
        <li>
          <div>
            <span>账 户 名 称：</span>
            <span>{{ account.accountName }}</span>
          </div>
          <div>
            <span>开户银行：</span>
            <span>{{ account.bankName }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
            <span>{{ account.dutyParagraph }}</span>
          </div>
          <div>
            <span>银行账号：</span>
            <span>{{ account.accountId }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="brief-paragraph" v-if="brandInfo.showAccountContactInfo">
      <div class="title">联系人信息</div>
      <ul class="msg-list" v-for="(person, key) in brandInfo.contactsInfo" :key="key">
        <li>
          <div>
            <span>联&nbsp;&nbsp;&nbsp;系&nbsp;&nbsp;&nbsp;人：</span>
            <span>{{ person.name }}</span>
          </div>
          <div>
            <span>固话：</span>
            <span>{{ person.phoneNo }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span>
            <span>{{ person.gender | getSex }}</span>
          </div>
          <div>
            <span>手机：</span>
            <span>{{ person.mobile }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>喜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好：</span>
            <span>{{ person.hobby }}</span>
          </div>
          <div>
            <span>邮箱：</span>
            <span>{{ person.email }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>家&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;乡：</span>
            <span>{{ person.hometown }}</span>
          </div>
          <div>
            <span>生日：</span>
            <span>{{ person.birthday }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>补 充 说 明：</span>
            <span>{{ person.addInfo }}</span>
          </div>
        </li>
      </ul>
    </div>
    <el-button
      v-if="brandInfo.roleInfo && brandInfo.roleInfo.edit === 'show'"
      @click="$router.push({name: 'brandEdit'})"
      class="btn-large center"
      type="primary"
      style="margin-top: 50px;">编辑品牌信息
    </el-button>

    <!--  品牌审核状态  -->
    <div v-if="brandInfo.roleInfo && brandInfo.roleInfo.audit === 'show'" class="center" style="text-align: center">
      <el-button type="primary" class="btn-large" @click="failAudit">审核不通过</el-button>
      <el-button type="primary" class="btn-large" @click="passAudit">审核通过</el-button>
    </div>

    <!-- <el-tooltip
      v-if="brandInfo.roleInfo && brandInfo.roleInfo.edit === 'auditing'"
      content="品牌正在审核中，无法进行编辑，审核通过后才能再次编辑">
      <el-button class="btn-large center" type="primary">品牌审核中</el-button>
    </el-tooltip> -->
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { AuditBrandRes } from '@/interface';

@Component
export default class BrandInfo extends Vue {
  @Prop(Object) readonly brandInfo!: {[index: string]: any};

  passAudit() {
    this.$confirm('您确定要通过此品牌审核吗？', '提示', {
      type: 'warning',
    })
      .then(async () => {
        const auditRes = await Network.fetch<AuditBrandRes>('auditBrand', {
          state: 2,
          id: this.$route.params.id,
        });

        if (auditRes.data.retCode === 0) {
          this.$message.success({
            message: '审核成功',
            onClose() {
              window.location.reload(); // 审核成功，刷新页面，懒得写状态更新了
            },
          });
        } else {
          this.$message.error('审核失败，请重新审核');
        }
      });
  }

  failAudit() {
    this.$prompt('请输入审核失败原因', '您确定要否决此品牌审核吗？')
      .then(async (reason: any) => {
        const auditRes = await Network.fetch<AuditBrandRes>('auditBrand', {
          reason: reason.value,
          state: 3,
          id: this.$route.params.id,
        });

        if (auditRes.data.retCode === 0) {
          this.$message.error({
            message: '已拒绝此品牌审核申请',
            onClose() {
              window.location.reload(); // 审核成功，刷新页面，懒得写状态更新了
            },
          });
        }
      });
  }
}
</script>
