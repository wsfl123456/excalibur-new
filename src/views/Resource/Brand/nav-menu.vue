<template>
  <ul class="nav-menu">
    <li>
      <span class="prefix">行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业：</span>
      <span :class="['item', navMenuParams.profession === i.prop && 'active']"
            @click="changeMenu('profession', i.prop)"
            :key="key"
            v-for="(i, key) in navMenu.profession">
          {{ i.label }}
        </span>
    </li>
    <li>
      <span class="prefix">合作状态：</span>
      <span :class="['item', navMenuParams.consociation === i.prop && 'active']"
            @click="changeMenu('consociation', i.prop)"
            :key="key"
            v-for="(i, key) in navMenu.consociation">
          {{ i.label }}
        </span>
    </li>
    <li>
      <span class="prefix">审核状态：</span>
      <span :class="['item', navMenuParams.auditState === i.prop && 'active']"
            @click="changeMenu('auditState', i.prop)"
            :key="key"
            v-for="(i, key) in navMenu.auditState">
          {{ i.label }}
        </span>
    </li>
    <li>
      <span class="prefix">签约公司：</span>
      <span :class="['item', navMenuParams.signatoryCompany === i.prop && 'active']"
            @click="changeMenu('signatoryCompany', i.prop)"
            :key="key"
            v-for="(i, key) in navMenu.signatoryCompany">
          {{ i.label }}
        </span>
    </li>
    <li>
      <span class="prefix">创建时间：</span>
      <span :class="['item', navMenuParams.createTime === i.prop && 'active']"
            @click="changeMenu('createTime', i.prop)"
            :key="key"
            v-for="(i, key) in navMenu.createTime">
          {{ i.label }}
      </span>
      <el-date-picker
        :value="createTimeRange"
        @input="changeCreateTimeRange"
        type="monthrange"
        start-placeholder="请选择开始时间"
        end-placeholder="请选择结束时间">
      </el-date-picker>
    </li>
  </ul>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { ProfessionListRes, SignatoryCompanyRes } from '@/interface';

@Component
export default class NavMenu extends Vue {
  @Prop(Object) readonly navMenuParams?: {[index: string]: string};

  @Prop(Array) readonly createTimeRange?: Date[] | null;

  navMenu = {
    profession: [
      {
        label: '全部',
        prop: '',
      },
    ],
    consociation: [
      {
        label: '全部',
        prop: '',
      },
      {
        label: '接触中',
        prop: '1',
      },
      {
        label: '合作中',
        prop: '2',
      },
      {
        label: '已解约',
        prop: '3',
      },
    ],
    auditState: [
      {
        label: '全部',
        prop: '',
      },
      {
        label: '待审核',
        prop: '1',
      },
      {
        label: '审核通过',
        prop: '2',
      },
      {
        label: '审核不通过',
        prop: '3',
      },
    ],
    signatoryCompany: [
      {
        label: '全部',
        prop: '',
      },
    ],
    createTime: [
      {
        label: '全部',
        prop: '',
      },
      {
        label: '当月',
        prop: 'month',
      },
      {
        label: '当季',
        prop: 'season',
      },
      {
        label: '当年',
        prop: 'year',
      },
    ],
  };

  async created() {
    await Promise.all([
      (async () => {
        /* 行业列表 */
        const professionListRes = await Network.fetch<ProfessionListRes>('getProfessionList');
        professionListRes.data.retData.data.forEach((i) => {
          this.navMenu.profession.push({
            label: i.industryName,
            prop: String(i.id),
          });
        });
      })(),
      (async () => {
        /* 品牌状态 */
        const signatoryCompanyRes = await Network.fetch<SignatoryCompanyRes>('getSignatoryCompany');
        signatoryCompanyRes.data.retData.data.forEach((i) => {
          this.navMenu.signatoryCompany.push({
            label: i.customerName,
            prop: String(i.idAuto),
          });
        });
      })(),
    ]);
  }

  changeMenu(type: string, prop: string) {
    this.$emit('change-menu-param', type, prop);
  }

  changeCreateTimeRange(time: any) {
    this.$emit('change-time-range', time);
  }
}
</script>
