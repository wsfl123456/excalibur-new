<template>
  <div class="date-range-picker">
    <span class="time">{{ label }}</span>
    <el-date-picker
      :value="value.from"
      @input="changeMonthFrom"
      :picker-options="fromPickerOptions"
      type="month">
    </el-date-picker>
    <span class="line"></span>
    <el-date-picker
      :value="value.to"
      @input="changeMonthTo"
      type="month"
      :picker-options="toPickerOptions"></el-date-picker>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import dateFormat from 'dateformat';
import { MonthDateRange } from '@/interface';

@Component
export default class DateRangePicker extends Vue {
  @Prop({ type: String, default: () => '时间段' }) readonly label!: string;

  @Prop({ type: Number, default: () => 12 }) readonly disableInterval!: number; // 可选最大时间区域间隔，最小为1，以月份为单位

  @Prop({ type: Object, required: true }) readonly value!: MonthDateRange;

  fromPickerOptions = {
    disabledDate: (date: Date) => {
      const d = new Date(this.value.to);
      const to = new Date(d.getFullYear(), d.getMonth() - 1).getTime();

      return date.getTime() > to || Math.abs(to - date.getTime()) >= (this.disableInterval - 1) * 30 * 3600 * 24 * 1000;
    },
  };

  toPickerOptions = {
    disabledDate: (date: Date) => {
      const d = new Date(this.value.from);
      const from = new Date(d.getFullYear(), d.getMonth() + 1).getTime();
      // eslint-disable-next-line max-len
      return date.getTime() < from || Math.abs(from - date.getTime()) >= (this.disableInterval - 1) * 30 * 3600 * 24 * 1000;
    },
  };

  created() {
    this.changeMonthRange();
  }

  changeMonthFrom(date: Date) {
    if (this.value) this.value.from = date;
    this.changeMonthRange();
  }

  changeMonthTo(date: Date) {
    if (this.value) this.value.to = date;
    this.changeMonthRange();
  }

  changeMonthRange() {
    this.$emit('input', {
      from: dateFormat(this.value.from, 'yyyy-mm'),
      to: dateFormat(this.value.to, 'yyyy-mm'),
    });
  }
}
</script>
