<template>
  <div class="brand-brief">
    <div class="brief-paragraph">
      <div class="title">供应商简介</div>
      <div class="brand-intro" v-html="supplierInfo.brandSummary"></div>
    </div>
    <div class="brief-paragraph">
      <div class="title">供应商信息</div>
      <ul class="msg-list">
        <li>
          <div>
            <span>供 应 商 全 称：</span>
            <span>{{ supplierInfo.supplierFullName }}</span>
          </div>
          <div>
            <span>供 应 商 地 址：</span>
            <span>{{ supplierInfo.brandAddress}}</span>
          </div>
        </li>
        <li>
          <div>
            <span>供 应 商 官 网：</span>
            <a target="_blank" :href="supplierInfo.webSiteUrl" class="link">{{ supplierInfo.webSiteUrl }}</a>
          </div>
          <div>
            <span>供 应 商 资 料：</span>
            <span>{{ supplierInfo.brandZiliao }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>供 应 商 微 博：</span>
            <span>{{ supplierInfo.weibo }}</span>
          </div>
          <div>
            <span>供应商公众号：</span>
            <span>{{ supplierInfo.wechart }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="brief-paragraph" v-if="supplierInfo.showAccountContactInfo">
      <div class="title">账户信息</div>
      <ul class="msg-list" v-for="(i, k) in supplierInfo.accountInfo" :key='k'>
        <li>
          <div>
            <span>账 户 名 称：</span>
            <span>{{ i.accountName }}</span>
          </div>
          <div>
            <span>开户银行：</span>
            <span>{{ i.bankName }}</span>
          </div>
        </li>
        <li>
          <div>
            <span>税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
            <span>{{ i.dutyParagraph }}</span>
          </div>
          <div>
            <span>银行账号：</span>
            <span>{{ i.accountId }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="brief-paragraph" v-if="supplierInfo.showAccountContactInfo">
      <div class="title">联系人信息</div>
      <ul class="msg-list" v-for="(person, key) in supplierInfo.contactInfo" :key="key">
        <li>
          <div>
            <span>联&nbsp;&nbsp;&nbsp;系&nbsp;&nbsp;&nbsp;人：</span>
            <span>{{ person.name ? person.name : (person.contactName ? person.contactName : '') }}</span>
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

    <div class="brief-paragraph">
      <div class="title">供应商得分</div>
      <p class="comment">
        <span>已有{{ commentCount }}人打分；平均得分<span class="red">{{ avgScore }}</span>分</span>
        <span class="my">我的评分：</span>
        <el-rate
          :disabled="!!myScore"
          :value="myScore"
          @change="comment"
          :colors="['#FF6666', '#FF6666', '#FF6666']">
        </el-rate>
        <span :class="[myScore && 'red']">{{ myScore ? '已评分' : '待评分'}}</span>
      </p>
    </div>

    <!--  供应商审核状态  -->
    <div v-if="supplierInfo.canAudit === 'show' || supplierInfo.canAudit === true"
        class="center"
        style="text-align: center">
      <el-button type="primary" class="btn-large" @click="failAudit">审核不通过</el-button>
      <el-button type="primary" class="btn-large" @click="passAudit">审核通过</el-button>
    </div>

    <el-button
      v-if="supplierInfo.canEdit"
      @click="$router.push({name: 'supplierEdit'})"
      class="btn-large center"
      type="primary"
      style="margin-top: 50px;">编辑供应商信息
    </el-button>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  SupplierInfoData,
  SupplierCommentMsg,
  CommentSupplier,
  AuditSupplierRes,
} from '@/interface';
import Network from '@/network';

@Component
export default class SupplierInfo extends Vue {
  @Prop(Object) readonly supplierInfo!: SupplierInfoData;

  commentCount: string = '0';

  avgScore: string = '0';

  myScore: number = 0;

  created() {
    this.getCommentMsg();
  }

  async getCommentMsg() {
    const commentMsg = await Network.fetch<SupplierCommentMsg>('supplierCommentMsg', {
      supplierId: this.$route.params.id,
    });

    this.commentCount = commentMsg.data.retData.commentInfo.scoreNum;
    this.avgScore = commentMsg.data.retData.commentInfo.scoreAvg;
    this.myScore = Number(commentMsg.data.retData.commentInfo.scoreMe);
  }

  async comment(v: number) {
    const commentRes = await Network.fetch<CommentSupplier>('commentSupplier', {
      supplierId: this.$route.params.id,
      score: v,
    });

    return this.getCommentMsg();
  }

  passAudit() {
    this.$confirm('您确定要通过此供应商审核吗？', '提示', {
      type: 'warning',
    })
      .then(async () => {
        const auditRes = await Network.fetch<AuditSupplierRes>('auditSupplier', {
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
    this.$prompt('请输入审核失败原因', '您确定要否决此供应商审核吗？')
      .then(async (reason: any) => {
        const auditRes = await Network.fetch<AuditSupplierRes>('auditSupplier', {
          auditReason: reason.value,
          state: 3,
          id: this.$route.params.id,
        });

        if (auditRes.data.retCode === 0) {
          this.$message.error({
            message: '已拒绝此供应商审核申请',
            onClose() {
              window.location.reload(); // 审核成功，刷新页面，懒得写状态更新了
            },
          });
        }
      });
  }
}
</script>
