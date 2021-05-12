<template>
  <div class="livemap-container">
    <div class="operat-bar">
      <el-input class="search-param" v-model="searchParam.keyword" placeholder="请输入关键字"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="serachList">搜索</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="$router.push({ name: 'livemapCreate' })"
      >添加Tips</el-button>
      <!-- <el-button
        type="primary"
        icon="el-icon-edit"
        @click="$router.push({ name: 'livemapAnswer' })"
      >写答案</el-button> -->
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
              @click="() => { $router.push({ name: 'livemapEdit', params: { id: scope.row.tipsId } }) }"
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
import { LivemapTable, LivemapTableRes } from '@/interface';
import HeaderPic from '@/components/headerPic/index.vue';

interface MapListSearchParams {
  keyword: string;
  page: number;
  pageSize: number;
}

@Component({
  components: {
    HeaderPic,
  },
})
export default class Livemap extends Vue {
  searchParam: MapListSearchParams = {
    keyword: '',
    page: 1,
    pageSize: 10,
  };

  isLoading: boolean = true;

  totalCount: number = 0;

  tableData: LivemapTable[] = [];

  tableColumns = [
    {
      label: '类别',
      prop: 'typeId',
      width: 130,
      formatter: (row: any, col: any, v: number): string => {
        switch (v) {
          case 112:
            return '专业线';
          case 111:
            return '员工日常';
          default:
            return '';
        }
      },
    },
    {
      label: '学院',
      width: 130,
      prop: 'collegeName',
    },
    {
      label: '标签',
      prop: 'tagText',
    },
    {
      label: '标题',
      minWidth: 200,
      prop: 'title',
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
    this.getMapList();
  }

  handleCurrentChange(current: number) {
    this.searchParam.page = current;
    this.getMapList();
  }

  serachList() {
    this.searchParam.page = 1;
    this.searchParam.pageSize = 10;
    this.totalCount = 0;
    this.getMapList();
  }

  async getMapList() {
    this.isLoading = true;
    const mapListRes = await Network.fetch<LivemapTableRes>(
      'getMapList',
      this.searchParam,
    );
    this.tableData = mapListRes.data.retData.tipsList;
    this.totalCount = Number(mapListRes.data.retData.count);
    this.isLoading = false;
  }

  async created() {
    this.getMapList();
  }
}
</script>
