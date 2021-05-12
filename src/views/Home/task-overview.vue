<template>
  <div class="task-overview">
    <div class="title">
      <div class="msg">
        <span class="icon" :style="{backgroundImage: `url(${require(`@/assets/svg/ic_tesk.svg`)})`}"></span>
        <span class="font">任务概况</span>
      </div>
    </div>
    <div class="content">
      <el-tabs type="border-card" @tab-click="reRenderChart">
        <el-tab-pane label="任务数量">
          <el-radio-group :value="taskCountChartType" @input="switchTaskCountTab">
            <el-radio-button label="month">按月份显示</el-radio-button>
            <el-radio-button label="client">按客户显示</el-radio-button>
          </el-radio-group>
          <date-range-picker :value="taskCountParams" @input="renderTaskCountChart"></date-range-picker>
          <div class="chart" ref="taskCountChart"></div>
        </el-tab-pane>
        <el-tab-pane label="任务耗时">
          <date-range-picker :value="taskTimingParams" @input="renderTaskTimingChart"></date-range-picker>
          <div class="chart" ref="taskTimingChart" v-loading="renderingTaskTimingChart"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import echarts, { EChartOption, ECharts } from 'echarts';
import merge from 'deepmerge';
import { Component, Vue } from 'vue-property-decorator';
import dateFormat from 'dateformat';
import DateRangePicker from '@/components/DateRangePicker/index.vue';
import { EchartsBasicOptions } from '@/util';
import {
  MonthDateRange,
  TaskTimingChartRes,
  TaskCountChartRes,
  TaskCountChartByClientRes,
} from '@/interface';
import Network from '@/network';

const taskCountChartOptions = {
  ...merge(EchartsBasicOptions, {
    legend: {
      data: [
        { name: '发布任务数', icon: 'rect' },
        { name: '接受任务数', icon: 'rect' },
        { name: '任务被完成率' },
        { name: '任务完成率' },
      ],
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 40,
      },
      {
        type: 'bar',
        barMaxWidth: 40,
      },
      {
        type: 'line',
        yAxisIndex: 1,
      },
      {
        type: 'line',
        yAxisIndex: 1,
      },
    ],
    xAxis: {
      type: 'category',
    },
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
        name: '任务完成率（%）',
        axisTick: { show: false },
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: '{value} %',
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
  }) as EChartOption<EChartOption.Series>,
  ...{ color: ['#57A5F9', '#FFE15B', '#FF9F01', '#7ED321'] },
};

const taskTimingChartOptions = merge(EchartsBasicOptions, {
  tooltip: {
    formatter: (series: any) => {
      const texts = ['天', '次'];
      const items = series.map((serie: any) => (`<li><span class="msg">${serie.marker} ${serie.seriesName}:</span>`
        // eslint-disable-next-line max-len
        + `<span class="count">${serie.data[serie.componentIndex + 1]}${texts[serie.componentIndex]}</span></li>`)).join('');
      return `<div class="chart-tooltip">${series[0].axisValueLabel}<ul class="chart-item">${items}</ul></div>`;
    },
  },
  title: {
    text: '任务耗时（天）',
  },
  legend: {
    data: [
      { name: '平均任务耗时', icon: 'rect' },
      { name: '任务平均更新版本数', icon: 'rect' },
    ],
  },
  xAxis: {
    type: 'category',
  },
  yAxis: [
    {
      type: 'value',
      axisTick: { show: false },
      splitLine: {
        color: '#E9ECEF',
        lineStyle: {
          type: 'dotted',
        },
      },
      axisLabel: {
        formatter: '{value} 天',
      },
      axisLine: {
        symbol: ['none', 'arrow'],
        symbolSize: [6, 12],
        symbolOffset: [0, 10],
        lineStyle: {
          color: '#CED4DA',
        },
      },
    },
    {
      type: 'value',
      name: '版本更新数（次）',
      axisTick: { show: false },
      splitLine: {
        color: '#E9ECEF',
        lineStyle: {
          type: 'dotted',
        },
      },
      axisLabel: {
        formatter: '{value} 次',
      },
      axisLine: {
        symbol: ['none', 'arrow'],
        symbolSize: [6, 12],
        symbolOffset: [0, 10],
        lineStyle: {
          color: '#CED4DA',
        },
      },
    },
  ],
  series: [
    {
      type: 'bar',
    },
    {
      yAxisIndex: 1,
      type: 'bar',
    },
  ],
}) as EChartOption<EChartOption.Series>;

@Component({
  components: {
    DateRangePicker,
  },
})
export default class TaskOverview extends Vue {
  taskCountParams: MonthDateRange = {
    from: new Date(new Date().getFullYear(), 0, new Date().getDate()),
    to: new Date(),
  };

  taskTimingParams: MonthDateRange = {
    from: new Date(new Date().getFullYear(), 0, new Date().getDate()),
    to: new Date(),
  };

  taskCountChart?: ECharts = undefined;

  taskTimingChart?: ECharts = undefined;

  renderingTaskCountChart = false;

  renderingTaskTimingChart = false;

  taskCountChartType: string = 'month';

  mounted() {
    this.$nextTick(() => {
      this.renderChart();
    });
  }

  switchTaskCountTab(type: string) {
    this.taskCountChartType = type;
    this.renderTaskCountChart(this.taskCountParams);
  }

  renderChart() {
    this.$nextTick(() => {
      /* 任务数量图表 */
      this.taskCountChart = echarts.init(this.$refs.taskCountChart as HTMLDivElement);
      this.taskCountChart.setOption(taskCountChartOptions);
      window.addEventListener('resize', () => this.taskCountChart && this.taskCountChart.resize());

      /* 任务耗时图表 */
      this.taskTimingChart = echarts.init(this.$refs.taskTimingChart as HTMLDivElement);
      this.taskTimingChart.setOption(taskTimingChartOptions);
      window.addEventListener('resize', () => this.taskTimingChart && this.taskTimingChart.resize());
    });
  }

  reRenderChart() {
    this.$nextTick(() => {
      if (this.taskCountChart) this.taskCountChart.resize();
      if (this.taskTimingChart) this.taskTimingChart.resize();
    });
  }

  renderTaskCountChart(date: MonthDateRange) {
    this.renderingTaskCountChart = true;
    this.taskCountParams = date;
    this.$nextTick(async () => {
      if (this.taskCountChartType === 'month' /* 渲染月份数据 */) {
        const taskCountRes = await Network.fetch<TaskCountChartRes>('getTaskCountChart', {
          fromtime: date.from,
          totime: date.to,
        });
        const taskCountData = taskCountRes.data.retData.chartResult;

        /* 填充图表数据 */
        const dataset = [
          ['product', '发布任务数', '接受任务数', '任务被完成率', '任务完成率'],
        ];

        taskCountData.forEach((i) => {
          const column: any[] = [];
          column.push(
            i.monthName,
            i.taskCreateNum,
            i.taskOperationNum,
            i.taskCommenFinishCreatePercent,
            i.taskCommenFinishOperationPercent,
          );
          dataset.push(column);
        });

        if (this.taskCountChart) {
          this.taskCountChart.setOption(merge({
            tooltip: {
              formatter: (series: any) => {
                const month = `<div>${series[0].axisValue}</div>`;
                const suffix = ['个', '个', '%', '%'];
                // eslint-disable-next-line max-len
                const items = series.map((serie: any) => `<li><span class="msg">${serie.marker} ${serie.seriesName}:</span>`
                  // eslint-disable-next-line max-len
                  + `<span class="count">${serie.data[serie.componentIndex + 1]}${suffix[serie.componentIndex]}</span></li>`)
                  .join('');

                return `<div class="chart-tooltip">${month}<ul class="chart-item">${items}</ul></div>`;
              },
            },
            dataset: {
              source: dataset,
            },
          }, taskCountChartOptions), true);
        }
      } else /* 渲染顾客数据 */ {
        const taskCountRes = await Network.fetch<TaskCountChartByClientRes>('getTaskCountChartByClient', {
          fromtime: date.from,
          totime: date.to,
        });
        const taskCountData = taskCountRes.data.retData.chartResult;

        /* 填充图表数据 */
        const dataset = [
          ['product', '发布任务数', '接受任务数', '任务被完成率', '任务完成率'],
        ];

        taskCountData.forEach((i) => {
          const column: any[] = [];
          column.push(
            i.customerName,
            i.taskCreateNum,
            i.taskOperationNum,
            i.taskCommenFinishCreatePercent,
            i.taskCommenFinishOperationPercent,
          );
          dataset.push(column);
        });

        if (this.taskCountChart) {
          this.taskCountChart.setOption(merge({
            tooltip: {
              formatter: (series: any) => {
                const suffix = ['个', '个', '%', '%'];
                // eslint-disable-next-line max-len
                const items = series.map((serie: any) => `<li><span class="msg">${serie.marker} ${serie.seriesName}:</span>`
                  // eslint-disable-next-line max-len
                  + `<span class="count">${serie.data[serie.componentIndex + 1]}${suffix[serie.componentIndex]}</span></li>`)
                  .join('');

                return `<div class="chart-tooltip">
                            ${series[0].axisValue} ${dateFormat(date.from, 'yyyy年m月')}-${dateFormat(date.to, 'yyyy年m月')}
                            <ul class="chart-item">${items}</ul>
                        </div>`;
              },
            },
            dataset: {
              source: dataset,
            },
          }, taskCountChartOptions), true);
        }
      }

      this.renderingTaskCountChart = false;
    });
  }

  renderTaskTimingChart(date: MonthDateRange) {
    this.renderingTaskTimingChart = true;
    this.taskTimingParams = date;
    this.$nextTick(async () => {
      const taskTimingRes = await Network.fetch<TaskTimingChartRes>('getTaskTimingChart', {
        fromtime: date.from,
        totime: date.to,
      });
      const monthData = taskTimingRes.data.retData.chartResult;

      /* 填充图表数据 */
      const dataset = [
        ['product', '平均任务耗时', '任务平均更新版本数'],
      ];

      monthData.forEach((month) => {
        const column: any[] = [];
        column.push(month.monthName, month.operationAvgDurTime, month.taskAvgVersionNum);
        dataset.push(column);
      });

      if (this.taskTimingChart) {
        this.taskTimingChart.setOption(merge({
          dataset: {
            source: dataset,
          },
        },
        taskTimingChartOptions), true);
      }

      this.renderingTaskTimingChart = false;
    });
  }
}
</script>
