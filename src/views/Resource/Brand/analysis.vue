<template>
  <div class="project-analysis">
    <div class="title">项目列表</div>
    <el-table class="project-table" border :max-height="400" :data="tableData">
      <el-table-column
        :key="key"
        :min-width="col.minWidth"
        :width="col.width"
        :label="col.label"
        :prop="col.prop"
        :formatter="col.formatter"
        v-for="(col, key) in tableColumns"></el-table-column>
    </el-table>

    <div class="title">项目指数</div>
    <el-tabs class="project-tab" type="border-card" mode="horizontal" @input="reRenderChart">
      <el-tab-pane v-if="isCaptain" label="概况">
        <div class="chart" v-loading="renderingProfitChart" ref="overviewChart"></div>
      </el-tab-pane>
      <el-tab-pane label="执行力">
        <div class="chart" v-loading="renderingExecuteChart" ref="executeChart"></div>
      </el-tab-pane>
      <el-tab-pane label="客户满意度">
        <div class="chart" ref="surveyChart"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import './index.less';
import {
  Component,
  Prop,
  Watch,
  Vue,
} from 'vue-property-decorator';
import merge from 'deepmerge';
import echarts, { EChartOption, ECharts } from 'echarts';
import { EchartsBasicOptions } from '@/util';
import Network from '@/network';
import {
  BrandProjectListRes,
  BrandProjectType,
  BrandProfitChartRes,
  BrandExecuteProjectRes,
  BrandSurveyChartRes,
  MyInfoRes,
} from '@/interface';

const overviewChartOptions = {
  ...merge(EchartsBasicOptions, {
    tooltip: {
      formatter: (series: any) => {
        const project = `<div>${series[0].axisValue}</div>`;
        const suffix = ['万', '万', '%'];
        const items = series.map((serie: any) => `<li><span class="msg">${serie.marker} ${serie.seriesName}:</span>`
          + `<span class="count">${serie.data[serie.componentIndex + 1]}${suffix[serie.componentIndex]}</span></li>`)
          .join('');

        return `<div class="chart-tooltip">${project}<ul class="chart-item">${items}</ul></div>`;
      },
    },
    grid: {
      bottom: 70,
    },
    legend: {
      data: [
        { name: '实际营收', icon: 'rect' },
        { name: '实际利润', icon: 'rect' },
        { name: '利润率' },
      ],
    },
    xAxis: {
      type: 'category',
    },
    dataZoom: [
      {
        show: true,
        start: 94,
        end: 100,
      },
      {
        type: 'inside',
        start: 94,
        end: 100,
      },
    ],
    yAxis: [
      {
        name: '收入值（万）',
        axisTick: { show: false },
        splitLine: {
          color: '#E9ECEF',
          lineStyle: {
            type: 'dotted',
          },
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [6, 12],
          symbolOffset: [0, 10],
          lineStyle: {
            color: '#CED4DA',
          },
        },
        type: 'value',
      },
      {
        name: '利润率（%）',
        axisTick: { show: false },
        splitLine: {
          show: false,
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [6, 12],
          symbolOffset: [0, 10],
          lineStyle: {
            color: '#CED4DA',
          },
        },
        type: 'value',
      },
    ],
    series: [
      { type: 'bar' },
      { type: 'bar' },
      { type: 'line', yAxisIndex: 1 },
    ],
  }),
  ...{ color: ['#57A5F9', '#FFE15B', '#7ED321'] },
} as EChartOption<EChartOption.Series>;

const executeChartOptions = {
  ...merge(EchartsBasicOptions, {
    legend: {
      data: [
        { name: '发布任务数', icon: 'rect' },
        { name: '接受任务数', icon: 'rect' },
        { name: '任务被完成率' },
        { name: '任务完成率' },
      ],
    },
    grid: {
      bottom: 70,
    },
    xAxis: {
      type: 'category',
    },
    dataZoom: [
      {
        show: true,
        start: 94,
        end: 100,
      },
      {
        type: 'inside',
        start: 94,
        end: 100,
      },
    ],
    yAxis: [
      {
        name: '任务数量（个）',
        axisTick: { show: false },
        splitLine: {
          color: '#E9ECEF',
          lineStyle: {
            type: 'dotted',
          },
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [6, 12],
          symbolOffset: [0, 10],
          lineStyle: {
            color: '#CED4DA',
          },
        },
        type: 'value',
      },
      {
        name: '利润率（%）',
        axisTick: { show: false },
        splitLine: {
          show: false,
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [6, 12],
          symbolOffset: [0, 10],
          lineStyle: {
            color: '#CED4DA',
          },
        },
        type: 'value',
      },
    ],
    series: [
      { type: 'bar' },
      { type: 'bar' },
      { type: 'line', yAxisIndex: 1 },
      { type: 'line', yAxisIndex: 1 },
    ],
  }),
  ...{ color: ['#57A5F9', '#FFE15B', '#FF9F01', '#7ED321'] },
} as any;

const surveyChartOptions = {
  ...merge(EchartsBasicOptions, {
    legend: { type: 'scroll' },
    tooltip: {
      formatter: (series: any) => {
        const project = `<div>${series[0].axisValue}</div>`;
        const suffix = ['分'];
        const items = series.map((serie: any) => `<li><span class="msg">${serie.marker} ${serie.seriesName}:</span>`
          + `<span class="count">${serie.data[serie.componentIndex + 1]}${suffix[serie.componentIndex]}</span></li>`)
          .join('');

        return `<div class="chart-tooltip">${project}<ul class="chart-item">${items}</ul></div>`;
      },
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      max: 5,
      name: '满意度',
    },
  }),
  ...{ color: ['#FEA39E', '#FFBB96', '#FFA941', '#FFD666', '#D2F261', '#B7EB8F', '#86E8DE'] },
} as EChartOption<EChartOption.Series>;

const levels: any = {
  1: 'S级',
  2: 'A级',
  3: 'B级',
  4: 'C级',
};

const projectTypePreview: any = {
  P: 'Campaign Project',
  R: 'Retainer Project',
};

@Component
export default class ProjectAnalysis extends Vue {
  @Prop(Boolean) readonly reRender?: boolean;

  @Watch('reRender')handleTabChange() {
    this.reRenderChart();
    this.$emit('rendered');
  }

  tableColumns = [
    {
      minWidth: 150,
      label: '项目名称',
      prop: 'name',
    },
    {
      label: '项目类型',
      prop: 'periodType',
      formatter(row: any, co: any, v: any) {
        return `${projectTypePreview[v]}`;
      },
    },
    {
      label: '项目分级',
      prop: 'level',
      width: 90,
      formatter(row: any, co: any, v: any) {
        return `${levels[v]}`;
      },
    },
    {
      label: '总任务数',
      prop: 'projectTaskCount',
      width: 90,
      formatter(row: any, co: any, v: any) {
        return `${v}个`;
      },
    },
    {
      label: '总人数',
      prop: 'projectMemberCount',
      width: 80,
      formatter(row: any, co: any, v: any) {
        return `${v}人`;
      },
    },
    {
      label: '开始时间',
      prop: 'startTime',
      width: 120,
      formatter(row: any, co: any, v: any) {
        return v.split(' ')[0];
      },
    },
    {
      label: '结束时间',
      prop: 'endTime',
      width: 120,
      formatter(row: any, co: any, v: any) {
        return v.split(' ')[0];
      },
    },
    {
      label: '项目周期',
      prop: 'projectPeriod',
      width: 90,
      formatter(row: any, co: any, v: any) {
        return `${v}天`;
      },
    },
    {
      label: '项目负责人',
      prop: 'leadingPmData',
      width: 150,
      formatter(row: any, co: any, v: any) {
        return v.userName;
      },
    },
  ];

  tableData: BrandProjectType[] = [];

  renderingProfitChart = false;

  renderingExecuteChart = false;

  renderingSurveyChart = false;

  overviewChart?: ECharts = undefined;

  executeChart?: ECharts = undefined;

  surveyChart?: ECharts = undefined;

  isCaptain = false;

  async created() {
    /* 获取用户是否Captain权限 */
    const captainInfoRes = await Network.fetch<MyInfoRes>('getMyInfo');
    this.isCaptain = captainInfoRes.data.retData.isCaptain;

    /* 当权限获取完成时开始渲染图表并加载后续接口数据 */
    this.renderChart();

    return Promise.all([
      (async () => {
        /* 渲染表格 */
        const brandProjectListRes = await Network.fetch<BrandProjectListRes>('getBrandProjectList', {
          page: 1,
          pageSize: 1000,
          state: '6,7,8',
          customerId: this.$route.params.id,
        });
        this.tableData = brandProjectListRes.data.retData.project_list;
      })(),
      (async () => {
        /* 渲染营收图表数据 */
        this.renderingProfitChart = true;

        const dataset: any[][] = [['product', '实际营收', '实际利润', '利润率']];
        const profitChartRes = await Network.fetch<BrandProfitChartRes>(
          'getBrandProfitChart',
          { customerId: this.$route.params.id },
        );

        profitChartRes.data.retData.chartResult.forEach((i) => {
          dataset.push([i.projectName, i.baojiadanAmount, i.marginAmount, i.marginPercent]);
        });

        if (this.overviewChart) {
          this.overviewChart.setOption(merge(overviewChartOptions, {
            dataset: {
              source: dataset,
            },
          }));
        }
        this.renderingProfitChart = false;
      })(),
      (async () => {
        /* 渲染执行力数据图表 */
        this.renderingExecuteChart = true;

        const dataset: any[][] = [['product', '发布任务数', '接受任务数', '任务被完成率', '任务完成率']];
        const executeChartRes = await Network.fetch<BrandExecuteProjectRes>('getBrandProjectExecuteChart', {
          customerId: this.$route.params.id,
        });
        executeChartRes.data.retData.chartResult.forEach((i) => {
          dataset.push([
            i.projectName,
            i.taskCreateNum,
            i.taskOperationNum,
            i.taskCommenFinishCreatePercent,
            i.taskCommenFinishOperationPercent,
          ]);
        });

        if (this.executeChart) {
          this.executeChart.setOption(merge(executeChartOptions, {
            dataset: {
              source: dataset,
            },
          }));
        }

        this.renderingExecuteChart = false;
      })(),
      (async () => {
        /* 渲染客户满意度图表 */
        this.renderingSurveyChart = true;

        const series: any[] = [];
        const surveyChartRes = await Network.fetch<BrandSurveyChartRes>('getBrandSurveyChart', {
          customerId: this.$route.params.id,
        });

        surveyChartRes.data.retData.chartResult.forEach((i) => {
          series.push({
            type: 'bar',
            name: i.projectName,
            data: [i.paperAvgScore],
            barMaxWidth: 85,
          });
        });

        if (this.surveyChart) {
          this.surveyChart.setOption(merge(surveyChartOptions, { series }));
        }

        this.renderingSurveyChart = false;
      })(),
    ]);
  }

  reRenderChart() {
    this.$nextTick(() => {
      if (this.overviewChart) this.overviewChart.resize();
      if (this.executeChart) this.executeChart.resize();
      if (this.surveyChart) this.surveyChart.resize();
    });
  }

  renderChart() {
    this.$nextTick(() => {
      /* 项目指数概况图表, 仅当拥有Captain权限时渲染 */
      if (this.isCaptain) {
        this.overviewChart = echarts.init(this.$refs.overviewChart as HTMLDivElement);
        this.overviewChart.setOption(overviewChartOptions);
        window.addEventListener('resize', () => this.overviewChart && this.overviewChart.resize());
      }

      /* 项目指数执行力图表 */
      this.executeChart = echarts.init(this.$refs.executeChart as HTMLDivElement);
      this.executeChart.setOption(executeChartOptions);
      window.addEventListener('resize', () => this.executeChart && this.executeChart.resize());

      /* 项目指数客户满意度图表 */
      this.surveyChart = echarts.init(this.$refs.surveyChart as HTMLDivElement);
      this.surveyChart.setOption(surveyChartOptions);
      window.addEventListener('resize', () => this.surveyChart && this.surveyChart.resize());
    });
  }
}
</script>
