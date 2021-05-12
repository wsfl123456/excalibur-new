<template>
  <div class="my-work">
    <div class="work">
      <div class="title">
        <div class="msg">
          <span
            class="icon"
            :style="{backgroundImage: `url(${require(`@/assets/svg/ic_work.svg`)})`}"
          ></span>
          <span class="font">我的工作</span>
        </div>
      </div>
      <div class="work-content">
        <el-tabs type="border-card" v-loading="loading">
          <el-tab-pane :label="`待我审核(${auditWorkData.workNumber})`">
            <work-table :data="auditWorkData.workList"></work-table>
          </el-tab-pane>
          <el-tab-pane :label="`待我执行(${executionWorkData.workNumber})`">
            <work-table :data="executionWorkData.workList"></work-table>
          </el-tab-pane>
          <el-tab-pane :label="`待我质检(${inspectWorkData.workNumber})`">
            <work-table :data="inspectWorkData.workList"></work-table>
          </el-tab-pane>
          <el-tab-pane :label="`我创建的(${createWorkData.workNumber})`">
            <work-table :data="createWorkData.workList"></work-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="review">
      <div class="title">
        <div class="msg">
          <span
            class="icon"
            :style="{backgroundImage: `url(${require(`@/assets/svg/ic_review.svg`)})`}"
          ></span>
          <span class="font">个人工作Review</span>
        </div>
      </div>
      <div class="review-content">
        <date-range-picker :value="workReviewMonthRange" @input="getWorkOverViewData"></date-range-picker>
        <ul class="service">
          <li>
            <el-tooltip placement="right" :disabled="!workReviewData.taskCustomerNum">
              <div class="service-item prefix">
                <span
                  class="icon"
                  :style="{backgroundImage: `url(${require(`@/assets/svg/ic_service.svg`)})`}"
                ></span>
                <span class="title">
                  服务的品牌(
                  <span class="count">{{ workReviewData.taskCustomerNum }}</span>个)
                </span>
              </div>
              <div class="work-overview-tooltip" slot="content">
                <div
                  class="brand"
                  v-for="(brand, key) in workReviewData.taskCustomerArr"
                  :key="key"
                >
                  <div
                    class="title jump-link"
                    title="点击跳转"
                    @click="goBrand(brand.customerId)"
                  >{{ brand.customerName }}</div>
                </div>
              </div>
            </el-tooltip>
          </li>
          <li>
            <el-tooltip placement="right" :disabled="!workReviewData.taskProjectNum">
              <div class="service-item prefix">
                <span
                  class="icon"
                  :style="{backgroundImage: `url(${require(`@/assets/svg/ic_excute.svg`)})`}"
                ></span>
                <span class="title">
                  执行的项目(
                  <span class="count">{{ workReviewData.taskProjectNum }}</span>个)
                </span>
              </div>
              <div class="work-overview-tooltip" slot="content">
                <div class="brand" v-for="(brand, key) in workReviewData.taskProjectArr" :key="key">
                  <div class="title">{{ brand.customerName }}</div>
                  <ul>
                    <li
                      v-for="(project, key) in brand.children"
                      @click="goProject(brand.customerId, project.projectId)"
                      title="点击跳转"
                      :key="key"
                    >{{ project.projectName }}</li>
                  </ul>
                </div>
              </div>
            </el-tooltip>
          </li>
          <li>
            <el-tooltip placement="left" :disabled="!workReviewData.taskCreateNum">
              <div class="service-item prefix">
                <span
                  class="icon"
                  :style="{backgroundImage: `url(${require(`@/assets/svg/ic_issue.svg`)})`}"
                ></span>
                <span class="title">
                  发布的任务(
                  <span class="count">{{ workReviewData.taskCreateNum }}</span>个)
                </span>
              </div>
              <div class="work-overview-tooltip" slot="content">
                <div
                  class="brand"
                  v-for="(customer, key) in workReviewData.taskCreateArrByCustomerByProject"
                  :key="key"
                >
                  <div class="title">
                    <span>{{ customer.customerName }}</span>
                  </div>
                  <template v-for="(project, key) in customer.children">
                    <p :key="key + 'p'" style="margin-top: 10px">{{ project.projectName }}</p>
                    <ul :key="key + 'ul'">
                      <li
                        v-for="(task, subKey) in project.children"
                        :key="`${key}-${subKey}`"
                      >{{ task.taskName }}</li>
                    </ul>
                  </template>
                </div>
              </div>
            </el-tooltip>
          </li>
          <li>
            <div class="service-item">
              <el-tooltip placement="right" :disabled="!workReviewData.taskOperationNum">
                <div>
                  <span
                    class="icon"
                    :style="{backgroundImage: `url(${require(`@/assets/svg/ic_accept.svg`)})`}"
                  ></span>
                  <span class="title">
                    接受的任务(
                    <span class="count">{{ workReviewData.taskOperationNum }}</span>个)
                  </span>
                </div>
                <div class="work-overview-tooltip" slot="content">
                  <div
                    class="brand"
                    v-for="(customer, key) in workReviewData.taskOperationArrByCustomerByProject"
                    :key="key"
                  >
                    <div class="title">{{ customer.customerName }}</div>
                    <template v-for="(project, key) in customer.children">
                      <p :key="key + 'p'" style="margin-top: 10px">{{ project.projectName }}</p>
                      <ul :key="key + 'ul'">
                        <li
                          v-for="(task, subKey) in project.children"
                          :key="`${key}-${subKey}`"
                        >{{ task.taskName }}</li>
                      </ul>
                    </template>
                  </div>
                </div>
              </el-tooltip>
            </div>
          </li>
          <!--    目前暂时隐藏      -->
          <li v-if="0">
            <el-tooltip placement="left">
              <div class="service-item">
                <span
                  class="icon"
                  :style="{backgroundImage: `url(${require(`@/assets/svg/ic_money.svg`)})`}"
                ></span>
                <span class="title">
                  个人创收(
                  <span class="count">{{ userIncome }}</span>万)
                </span>
              </div>
              <div class="work-overview-tooltip" slot="content">
                <div class="brand" v-for="(customer, key) in incomeList " :key="key">
                  <div class="title">{{ customer.customerName }}</div>
                  <ul>
                    <li
                      v-for="(project, key) in customer.projectList"
                      @click="goProject(customer.customerId, project.projectId)"
                      title="点击跳转"
                      :key="key"
                    >{{ project.projectName }} 创收{{ project.income }}万</li>
                  </ul>
                </div>
              </div>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import DateRangePicker from '@/components/DateRangePicker/index.vue';
import Network from '@/network';
import {
  MyWorkDataType,
  MyWorkReview,
  MyWorkReviewType,
  WorkData,
  MonthDateRange,
  UserIncomeRes,
  UserIncomeMsg,
} from '@/interface';
import WorkTable from './work-table.vue';
import { toFixed } from '@/util';

@Component({
  components: {
    WorkTable,
    DateRangePicker,
  },
})
export default class Work extends Vue {
  userIncome: string = '';

  auditWorkData: WorkData = {
    workNumber: 0,
    workList: [],
  };

  executionWorkData: WorkData = {
    workNumber: 0,
    workList: [],
  };

  inspectWorkData: WorkData = {
    workNumber: 0,
    workList: [],
  };

  createWorkData: WorkData = {
    workNumber: 0,
    workList: [],
  };

  workReviewData: MyWorkReview = {
    taskOperationArrByCustomerByProject: [],
    taskCreateArrByCustomerByProject: [],
    taskCustomerArr: [],
    taskCustomerNum: 0,
    taskProjectNum: 0,
    taskProjectArr: [],
    taskCreateNum: 0,
    taskOperationNum: 0,
  };

  incomeList: UserIncomeMsg[] = [];

  workReviewMonthRange: MonthDateRange = {
    from: new Date(new Date().getFullYear(), 0, new Date().getDate()),
    to: new Date(),
  };

  loading: boolean = true;

  async created() {
    /* 我的工作数据 */

    Promise.all([
      (async () => {
        const auditWorkDataRes = await Network.fetch<MyWorkDataType>(
          'getMyWorkData',
          { typeId: 2 },
        );
        this.auditWorkData = auditWorkDataRes.data.retData;
        this.loading = false;
      })(),
      (async () => {
        const executionWorkDataRes = await Network.fetch<MyWorkDataType>(
          'getMyWorkData',
          { typeId: 3 },
        );
        this.executionWorkData = executionWorkDataRes.data.retData;
      })(),
      (async () => {
        const inspectWorkDataRes = await Network.fetch<MyWorkDataType>(
          'getMyWorkData',
          { typeId: 4 },
        );
        this.inspectWorkData = inspectWorkDataRes.data.retData;
      })(),
      (async () => {
        const createWorkDataRes = await Network.fetch<MyWorkDataType>(
          'getMyWorkData',
          { typeId: 1 },
        );
        this.createWorkData = createWorkDataRes.data.retData;
      })(),
    ]);
  }

  /*
   * 个人工作Review数据
   * */
  async getWorkOverViewData(months: MonthDateRange) {
    this.workReviewMonthRange = months;
    const dateParams = {
      fromtime: this.workReviewMonthRange.from,
      totime: this.workReviewMonthRange.to,
    };

    return Promise.all([
      (async () => {
        const reviewDataRes = await Network.fetch<MyWorkReviewType>(
          'getWorkReview',
          dateParams,
        );
        this.workReviewData = reviewDataRes.data.retData.dataInfo;
      })(),
      (async () => {
        const userIncomeRes = await Network.fetch<UserIncomeRes>(
          'getUserIncome',
          dateParams,
        );
        this.userIncome = toFixed(
          userIncomeRes.data.retData.dataInfo.incomeTotalValue,
        );
        this.incomeList = userIncomeRes.data.retData.customerProjectClean;
      })(),
    ]);
  }

  goBrand(id: string) {
    this.$router.push({ name: 'brandHome', params: { id } });
  }

  goProject(brandId: number, projectId: number) {
    this.$router.push(`/projects/list/${brandId}?id=${projectId}`);
  }
}
</script>
