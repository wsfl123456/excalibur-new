<template>
  <div class="home-page">
    <div class="tips">
      <tip
        title="今日日程"
        icon="ic_date.svg"
        url="/schedule/manage"
        empty-msg="今日暂无日程安排~~"
        :visible-more="true"
        :data="scheduleData">
      </tip>
      <tip
        title="系统公告"
        icon="ic_notice.svg"
        url="/sysNotice/list/"
        empty-msg="暂无通知~~"
        :visible-more="visibleTipsMore"
        :data="noticeData">
      </tip>
      <tip
        title="知识库"
        icon="ic_knowledge.svg"
        url="new/nccBook/map"
        empty-msg="没有内容~~"
        :visible-more="true"
        :data="knowledgeData">
      </tip>
    </div>
    <work></work>
    <project-overview></project-overview>
    <task-overview></task-overview>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Vue } from 'vue-property-decorator';
import dateFormat from 'dateformat';
import Network from '@/network';
import { getNoticeType, getUserInfo } from '@/util';
import { NoticeList, KnowledgeList, ScheduleRes } from '@/interface';
import Tip from './tip.vue';
import Work from './work.vue';
import ProjectOverview from './project-overview.vue';
import TaskOverview from './task-overview.vue';

@Component({
  components: {
    Tip,
    Work,
    ProjectOverview,
    TaskOverview,
  },
})
export default class Home extends Vue {
  scheduleData: any[] = [];

  noticeData: any[] = [];

  knowledgeData: any[] = [];

  visibleTipsMore: boolean = false

  async created() {
    /* 今日日程数据 */
    const userInfo = getUserInfo();

    if (userInfo) {
      const scheduleConf = {
        id: userInfo.id,
        date_type: 'day',
        search_type: '2',
        date: dateFormat(Date.now(), 'yyyy/mm/dd'),
      };
      const scheduleRes = await Network.fetch<ScheduleRes>('getSchedule', scheduleConf);
      this.scheduleData = scheduleRes.data.retData.data.slice(0, 5).map(i => ({
        url: '/schedule/manage',
        msg: i.name,
        remark: i.time_range,
      }));
    }

    /* 系统公告数据 */
    const params = {
      page: 1,
      pageSize: 5,
      state: 1,
      orderBy: 'lastModifyTime',
    };
    const noticeRes = await Network.fetch<NoticeList>('getNoticeList', params);

    this.noticeData = noticeRes.data.retData.data.slice(0, 5).map(item => ({
      msgType: `【${getNoticeType(item.typeId)}】`,
      msg: item.title,
      isNew: item.isNew,
      remark: dateFormat(item.lastModifyTime.substring(0, 10), 'yyyy/mm/dd'),
      url: `/sysNotice/detail/${item.id}`,
    }));


    if (noticeRes.data.retData.data.length !== 0) { // 体验用户不展示系统公告的“更多”按钮
      this.visibleTipsMore = true;
    }

    /* 知识库数据 */
    const knowledgeRes = await Network.fetch<KnowledgeList>('getKnowledgeTips', params);
    this.knowledgeData = knowledgeRes.data.retData.data.slice(0, 5).map(item => (
      {
        msg: item.title,
        user: item.creatorName,
        remark: dateFormat(item.lastModifyTime.substring(0, 10), 'yyyy/mm/dd'),
        url: item.dataType === 'house' ? `/new/nccBook/house/detail/${item.id}` : (
          item.dataType === 'store' ? `/new/nccBook/store/detail/${item.id}` : (
            `/new/nccBook/map/detail/${item.id}`
          )
        ),
      }
    ));
  }
}
</script>
