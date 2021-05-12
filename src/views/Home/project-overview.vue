<template>
  <div class="project-overview">
    <div class="title">
      <div class="msg">
        <span class="icon" :style="{backgroundImage: `url(${require(`@/assets/svg/ic_survey.svg`)})`}"></span>
        <span class="font">项目概况</span>
      </div>
    </div>
    <div class="content">
      <el-tabs type="border-card" @tab-click="reRenderChart">
        <el-tab-pane label="项目执行">
          <date-range-picker
            :value="projectExecuteParams"
            :disable-interval="12"
            @input="renderExecuteChart"></date-range-picker>
          <div class="chart" ref="executeChart" v-loading="renderingExecuteChart"></div>
        </el-tab-pane>
<!--   暂时隐藏项目创收模块     -->
<!--        <el-tab-pane label="项目创收">-->
<!--          <date-range-picker-->
<!--            :value="projectProfitParams"-->
<!--            :disable-interval="12"-->
<!--            @input="renderProjectProfit"></date-range-picker>-->
<!--          <div class="chart" ref="profitChart" v-loading="renderingProfitChart"></div>-->
<!--        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import echarts, { EChartOption, ECharts } from 'echarts';
import merge from 'deepmerge';
import { Component, Vue } from 'vue-property-decorator';
import DateRangePicker from '@/components/DateRangePicker/index.vue';
import { EchartsBasicOptions, toFixed } from '@/util';
import Network from '@/network';
import { MonthDateRange, ProjectExecuteChartRes, ProfitChartRes } from '@/interface';

/* 项目执行图表 */
const executeChartOptions = merge({
  tooltip: {
    formatter: (series: any[]) => {
      const date = `<div>${series[0].axisValue}</div>`;

      let count = 0;
      series.forEach((i) => { if (i.data > 0) count += 1; });
      const title = `<div class="title">全部客户数量: ${count}个</div>`;

      const items = series.map((serie: any) => (serie.data > 0
        ? `<li><span class="msg">${serie.marker} ${serie.seriesName}的项目数量:</span>`
        + `<span class="count">${serie.data.toFixed()}个</span></li>` : '')).join('');

      return `<div class="chart-tooltip">${date}${title}<ul class="chart-item">${items}</ul></div>`;
    },
  },
  legend: {
    type: 'scroll',
  },
  title: {
    text: '项目数量（个）',
    subtext: '(点击柱条切换选中项目图例)',
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [],
}, EchartsBasicOptions) as EChartOption<EChartOption.Series>;

/* 项目创收图表 */
const profitChartOptions = merge({
  tooltip: {
    formatter(series: any) {
      const items = series.map((serie: any) => (serie.data[serie.componentIndex + 1] > 0
        ? `<li><span class="msg">${serie.marker} ${serie.seriesName}:</span>`
          + `<span class="count">${serie.data[serie.componentIndex + 1]}万</span></li>` : '')).join('');
      return `<div class="chart-tooltip">项目创收：单位(万)<ul class="chart-item">${items}</ul></div>`;
    },
  },
  title: {
    text: '项目创收（万）',
    subtext: '(点击柱条切换选中项目图例)',
  },
  legend: {
    type: 'scroll',
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [],
}, EchartsBasicOptions) as EChartOption<EChartOption.Series>;

@Component({
  components: {
    DateRangePicker,
  },
})
export default class ProjectOverview extends Vue {
  projectExecuteParams: MonthDateRange = {
    from: new Date(new Date().getFullYear(), 0, new Date().getDate()),
    to: new Date(),
  };

  projectProfitParams: {to: Date, from: Date} = {
    from: new Date(new Date().getFullYear(), 0, new Date().getDate()),
    to: new Date(),
  };

  executeChart?: ECharts = undefined;

  profitChart?: ECharts = undefined;

  renderingExecuteChart = false;

  renderingProfitChart = false;

  mounted() {
    this.renderChart();
  }

  renderChart() {
    this.$nextTick(() => {
      /* 项目执行图表 */
      this.executeChart = echarts.init(this.$refs.executeChart as HTMLDivElement);
      this.executeChart.setOption(executeChartOptions);
      window.addEventListener('resize', () => this.executeChart && this.executeChart.resize());

      /* 项目创收图表 */
      // this.profitChart = echarts.init(this.$refs.profitChart as HTMLDivElement);
      // this.profitChart.setOption(profitChartOptions);
      // window.addEventListener('resize', () => this.profitChart && this.profitChart.resize());
    });
  }

  reRenderChart() {
    this.$nextTick(() => {
      if (this.executeChart) this.executeChart.resize();
      if (this.profitChart) this.profitChart.resize();
    });
  }

  renderExecuteChart(date: MonthDateRange) {
    this.renderingExecuteChart = true;
    this.$nextTick(async () => {
      const executeChartRes = await Network.fetch<ProjectExecuteChartRes>('getProjectExecuteChart', {
        fromtime: date.from,
        totime: date.to,
      });
      const executeChartData = executeChartRes.data.retData;

      /* 设置项目执行图表数据选项 */
      const series: any[] = [];

      /* 初始化系列 */
      executeChartData.customerList.forEach((brand) => {
        series.push({
          type: 'bar',
          barMaxWidth: 40,
          name: brand.customerName,
          stack: 'executeChart',
          data: [],
        });
      });

      /* 设置图例、设置X轴，填充系列数据 */
      const legends: any[] = [];
      const xAxisData: any[] = [];

      executeChartData.chartResult.forEach((monthData, index) => {
        const brands = monthData.projectNumEachCustomer;

        /* 默认显示第一列的图例 */
        if (index === 0) {
          brands.forEach(brand => brand.projectNum > 0 && legends.push({ name: brand.customerName }));
        }

        xAxisData.push(monthData.monthName);
        series.forEach((serie) => {
          const r = brands.find((brand) => {
            if (serie.name === brand.customerName) {
              serie.data.push(brand.projectNum);
              return true;
            }
            return false;
          });

          if (!r) serie.data.push(0);
        });
      });

      if (this.executeChart) {
        this.executeChart.setOption(merge(
          {
            xAxis: {
              data: xAxisData,
            },
            legend: {
              icon: 'rect',
              data: legends,
            },
            series,
          }, executeChartOptions,
        ), true);

        /* 默认第一列高亮, 并显示第一列图例, 点击切换当前显示图例 */
        this.executeChart.dispatchAction({
          type: 'highlight',
          dataIndex: 0,
        });
        this.executeChart.off('click');
        this.executeChart.on('click', (params: any) => {
          if (this.executeChart) {
            const newLegends: any[] = [];

            executeChartData.chartResult[params.dataIndex].projectNumEachCustomer.forEach(
              brand => brand.projectNum > 0 && newLegends.push({ name: brand.customerName }),
            );

            this.executeChart.setOption(merge(
              {
                xAxis: {
                  data: xAxisData,
                },
                legend: {
                  icon: 'rect',
                  data: newLegends,
                },
                series,
              }, executeChartOptions,
            ), true);
          }
        });
      }

      this.renderingExecuteChart = false;
    });
  }

  renderProjectProfit(date: MonthDateRange) {
    this.renderingProfitChart = true;
    this.$nextTick(async () => {
      const profitChartRes = await Network.fetch<ProfitChartRes>('getProjectProfitChart', {
        fromtime: date.from,
        totime: date.to,
      });
      const profitChartData = profitChartRes.data.retData;
      const brandData = profitChartData.chartResult;
      const projectList = profitChartData.chartResultProject;

      /* 生成图表数据 */
      const dataset = [
        ['product'],
      ];
      const legends: any[] = [];
      const series = projectList.map((i) => {
        dataset[0].push(i.projectName); // 向DateSet集中推入系列名称

        return {
          name: i.projectName,
          type: 'bar',
          stack: 'profitChart',
          barMaxWidth: 200,
        };
      });

      brandData.forEach((brand, index) => {
        const column: any[] = [];

        column.push(brand.customerName);
        projectList.forEach((project) => {
          const r = brand.projectList.find(i => i.projectName === project.projectName);

          column.push(r ? toFixed(r.income) : 0);
        });
        dataset.push(column); // 向DateSet集中推入系列数据

        /* 初始化图例为第一列图例 */
        if (index === 0) {
          brand.projectList.forEach((i) => {
            if (i.income) {
              legends.push(i.projectName);
            }
          });
        }
      });

      if (this.profitChart) {
        this.profitChart.setOption(merge({
          series,
          legend: {
            type: 'rect',
            data: legends,
          },
          dataset: {
            source: dataset,
          },
        }, profitChartOptions), true);

        /* 默认第一列高亮, 并显示第一列图例, 点击切换当前显示图例 */
        this.profitChart.dispatchAction({
          type: 'highlight',
          dataIndex: 0,
        });
        this.profitChart.off('click');
        this.profitChart.on('click', (params: any) => {
          const legendsCurrent: any[] = [];
          brandData[params.dataIndex].projectList.forEach((i) => {
            if (i.income) {
              legendsCurrent.push(i.projectName);
            }
          });

          if (this.profitChart) {
            this.profitChart.setOption(merge({
              series,
              legend: {
                type: 'rect',
                data: legendsCurrent,
              },
              dataset: {
                source: dataset,
              },
            }, profitChartOptions), true);
          }
        });
      }

      this.renderingProfitChart = false;
    });
  }
}
</script>
