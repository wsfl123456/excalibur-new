import { Component, Prop, Vue } from "vue-property-decorator";
import { UserNoticeMsg } from "@/interface";
import Network from "@/network";

@Component
export default class Notice extends Vue {
  @Prop(Object) noticeMsg!: any;
  @Prop(String) curId!: string;

  async jump(url: string, id: number, type: number) {
    this.$emit("reduceCount", this.curId);
    location.href = url;
  }

  render() {
    /* 不明所以的写法， 反正就是这样的 */
    const { noticeMsg } = this;
    const state = +noticeMsg.state;
    const type = +noticeMsg.type;
    const id = +noticeMsg.id;

    let redirectUrl: string;
    let linkContent: string | undefined;

    switch (type) {
      case 2:
        redirectUrl = `/projects/list/${noticeMsg.customerId}?id=${noticeMsg.content.projectId}`;
        break;
      case 9:
        redirectUrl = "/myReimburse/list/";
        break;
      case 10:
        redirectUrl = "/vacation/out/";
        break;
      case 1:
        // eslint-disable-next-line no-case-declarations
        const toolkitId = noticeMsg.content.productId;

        if (toolkitId === 19 || toolkitId === 20) {
          // eslint-disable-next-line max-len
          redirectUrl = `/tasks/list/${noticeMsg.customerId}/${noticeMsg.content.projectId}?id=${
            noticeMsg.taskId
          }&toolkitId=0`;
        } else {
          // eslint-disable-next-line max-len
          redirectUrl = `/tasks/list/${noticeMsg.customerId}/${noticeMsg.content.projectId}?id=${
            noticeMsg.taskId
          }&toolkitId=${toolkitId}`;
        }
        break;
      case 5:
        redirectUrl = `/v2/resource/brand/${noticeMsg.content.customerId}`;
        break;
      case 7:
        redirectUrl = "/vacation/audit";
        linkContent = noticeMsg.content.type;
        break;
      case 6:
        redirectUrl = "/myDevice/apply";
        linkContent = noticeMsg.content.assetNo;
        break;
      case 8:
        redirectUrl = `/v2/resource/supplier/${noticeMsg.content.supplierId}`;
        break;
      case 11:
        switch (noticeMsg.content.qaType) {
          case "question":
            redirectUrl = `/v2/growth/q&a/mySubmit?type=MyQuestion&id=${noticeMsg.content.questionId}`;
            return (
              <div>
                <span>您在NCC小黄书的提问</span>
                <a
                  class="link"
                  onClick={() => {
                    this.jump(redirectUrl, id, type);
                  }}
                >
                  {noticeMsg.content.questionContent}
                </a>
                <span>{noticeMsg.name}</span>
                <span>,理由是：</span>
                <span>{noticeMsg.content.auditorReason}</span>
              </div>
            );
          case "answer":
            redirectUrl = `/v2/growth/q&a/mySubmit?type=MyAnswer&id=${noticeMsg.content.answerId}`;
            return (
              <div>
                <span>您在问题悬赏榜对于问题</span>
                <a
                  class="link"
                  onClick={() => {
                    this.jump(redirectUrl, id, type);
                  }}
                >
                  {noticeMsg.content.questionContent}
                </a>
                <span>的回答</span>
                <span>{noticeMsg.name}</span>
                <span>,理由是：</span>
                <span>{noticeMsg.content.auditorReason}</span>
              </div>
            );
          case "solution":
            redirectUrl = `/v2/growth/q&a/mySubmit?type=MySolution&id=${noticeMsg.content.solutionId}`;
            return (
              <div>
                <span>您在NCC小黄书发布的答案</span>
                <a
                  class="link"
                  onClick={() => {
                    this.jump(redirectUrl, id, type);
                  }}
                >
                  {noticeMsg.content.solutionTitle}
                </a>
                <span>{noticeMsg.name}</span>
                <span>,理由是：</span>
                <span>{noticeMsg.content.auditorReason}</span>
              </div>
            );
          default:
            return;
        }
      case 12:
        redirectUrl = `/schedule/meeting`;
        return (
          <div>
            <a class="link">{noticeMsg.content.meetingName}</a>
            <span>会议已结束 </span>
            <a
              class="link"
              onClick={() => {
                this.jump(redirectUrl, id, type);
              }}
            >
              {noticeMsg.name}
            </a>
          </div>
        );
      case 13:
        redirectUrl = `/dri/detail/${noticeMsg.content.driUserId}`;
        return (
          <div>
            <a class="link">{noticeMsg.userInfo.name}</a>
            <span>{+noticeMsg.uid === +noticeMsg.content.driUserId ? " 拒绝了 " : " 创建了 "}</span>
            <a
              class="link"
              href="javascript:;"
              onClick={() => {
                this.jump(redirectUrl, id, type);
              }}
            >
              DRI
            </a>
            <span>{+noticeMsg.uid === +noticeMsg.content.driUserId ? " 审核 " : " 待审核 "}</span>
          </div>
        );
      case 14:
        redirectUrl = `/new/nccBook/question/detail/${noticeMsg.content.tiwenId}`;
        return (
          <div>
            <a class="link">{noticeMsg.userInfo.name}</a>
            <span>{noticeMsg.name}</span>
            <a
              class="link"
              href="javascript:;"
              onClick={() => {
                this.jump(redirectUrl, id, type);
              }}
            >
              {noticeMsg.content.tiwenContent}
            </a>
          </div>
        );
      default:
        redirectUrl = "";
        // 特殊返回
        return (
          <div>
            <a class="link">{noticeMsg.userInfo.name}</a>
            <span>创建了{noticeMsg.name} 并完成了审批，休假时间自：</span>
            <a class="link">{noticeMsg.content.name}</a>
            <a class="link">{noticeMsg.content.time}</a>
          </div>
        );
    }

    return (
      <div>
        <a class="link">{noticeMsg.userInfo.name}</a>
        <span>{noticeMsg.name}</span>
        <a
          class="link"
          href="javascript:;"
          onClick={() => {
            this.jump(redirectUrl, id, type);
          }}
        >
          {linkContent || noticeMsg.content.name}
        </a>
      </div>
    );
  }
}
