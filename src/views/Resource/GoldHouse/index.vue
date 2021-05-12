<template>
  <div class="goldhouse-container">
    <div class="operat-bar">
      <el-input class="search-param" v-model="searchParam.keyword" placeholder="请输入关键字"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="serachList">搜索</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="$router.push({ name: 'goldhouseCreate' })"
      >添加Tips</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" border style="width: 100%" v-loading="isLoading">
        <el-table-column
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          :formatter="col.formatter"
          :key="key"
          v-for="(col, key) in tableColumns"
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              @click="() => { $router.push({ name: 'goldhouseEdit', params: { id: scope.row.houseId } }) }"
              type="text"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import Network from '@/network';
import { GoldHouseTable, GoldHouseTableRes } from '@/interface';
import HeaderPic from '@/components/headerPic/index.vue';

interface GoldHouseListSearchParams {
  keyword: string;
  page: number;
  pageSize: number;
}

@Component({
  components: {
    HeaderPic,
  },
})
export default class GoldHouse extends Vue {
  searchParam: GoldHouseListSearchParams = {
    keyword: '',
    page: 1,
    pageSize: 10,
  };

  isLoading: boolean = true;

  totalCount: number = 0;

  tableData: GoldHouseTable[] = [];

  tableColumns = [
    {
      label: '标题',
      minWidth: 200,
      prop: 'title',
    },
    {
      label: '学院',
      width: 130,
      prop: 'collegeName',
    },
    {
      label: '专业',
      width: 130,
      prop: 'studyName',
    },
    {
      label: '标签',
      width: 100,
      prop: 'tagText',
    },
    {
      label: '创建者',
      width: 100,
      prop: 'creatorName',
      formatter: (row: any, col: any, v: number) => this.$createElement('header-pic', {
        props: {
          paramInfo: {
            id: row.creatorId,
            enName: row.creatorName,
            headerPic: row.creatorHeadPic,
            size: 35,
          },
        },
      }),
    },
    {
      label: '更新时间',
      width: 180,
      prop: 'lastModifyTime',
    },
    {
      label: '状态',
      width: 100,
      prop: 'stateName',
      formatter: (row: any, col: any, v: string) => this.$createElement(
        'span',
        {
          class: {
            'switch-open': v === '开启',
            'switch-close': v === '关闭',
          },
        },
        v,
      ),
    },
  ];

  handleSizeChange(pageSize: number) {
    this.searchParam.pageSize = pageSize;
    this.getHouseList();
  }

  handleCurrentChange(current: number) {
    this.searchParam.page = current;
    this.getHouseList();
  }

  serachList() {
    this.searchParam.page = 1;
    this.searchParam.pageSize = 10;
    this.totalCount = 0;
    this.getHouseList();
  }

  async getHouseList() {
    this.isLoading = true;
    const goldHouseTableRes = await Network.fetch<GoldHouseTableRes>(
      'gethouselist',
      this.searchParam,
    );
    this.tableData = goldHouseTableRes.data.retData.tipsList;
    this.totalCount = Number(goldHouseTableRes.data.retData.count);
    this.isLoading = false;
  }

  async created() {
    this.getHouseList();
  }
}
</script>
