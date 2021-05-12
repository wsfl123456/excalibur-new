import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MemberMsg, MemberMsgRes } from '@/interface';
import Network from '@/network';

@Component
export default class MemberSelect extends Vue {
  @Prop(Boolean) readonly readonly!: boolean;

  @Prop(Boolean) readonly multiple!: boolean;

  @Prop(String) readonly tooltip!: string;

  @Prop(Number) readonly projectId!: number;

  @Prop({
    type: Array,
    required: true,
  }) readonly value!: MemberMsg[];

  searchVal: string = '';

  showMemberPopover: boolean = false;

  memberList: MemberMsg[] = [];

  render() {
    const plusIcon = <i class="el-icon-circle-plus"/>;
    const showPlus = !this.readonly && (this.multiple || this.value.length === 0);

    if (showPlus && !this.memberList.length) this.getMemberList();

    return (
      <div class="member-select-wrapper">
        {
          this.value.map((i, k) => (
              <el-popover placement="top" trigger="hover" key={k}>
                <div class="member-person-popover">
                  <div class="container">
                    <el-avatar slot="reference" src={i.headPic}>{i.name.substr(0, 2)}</el-avatar>
                    <div class="person">
                      <p class="name">{i.name}</p>
                      <p class="department">{i.positionName}</p>
                    </div>
                  </div>
                  {this.readonly || (
                    <div class="exit"><span onclick={() => { this.value.splice(k, 1); }}>退出任务</span></div>
                  )}
                </div>
                <el-avatar slot="reference" src={i.headPic}>{i.name.substr(0, 2)}</el-avatar>
              </el-popover>
          ))
        }
        {
          showPlus && (
            <el-popover
              width={350}
              popper-class="member-popover"
              placement="right"
              value={this.showMemberPopover}
              onInput={(v: boolean) => { this.showMemberPopover = v; }}>
              {
                this.tooltip
                  ? <span slot="reference">
                      <el-tooltip content={this.tooltip} placement="bottom">{ plusIcon }</el-tooltip>
                    </span>
                  : <span slot="reference">{ plusIcon }</span>
              }
              <div class="member-popover">
                <el-input
                  clearable={true}
                  placeholder="输入项目成员姓名"
                  value={this.searchVal}
                  onInput={(v: string) => {
                    this.searchVal = v;
                  }} />
                <ul class="member-list">
                  {
                    this.filterMemberList.map((i, k) => (
                      <li key={k} onclick={() => this.addMember(i, k)}>
                        <el-avatar src={i.headPic}>{i.name.substr(0, 2)}</el-avatar>
                        <span>{i.name}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </el-popover>
          )
        }
      </div>
    );
  }

  get filterMemberList() {
    return this.memberList.filter(
      i => i.name.toLocaleLowerCase().indexOf(this.searchVal.toLocaleLowerCase()) !== -1,
    );
  }

  /*
   * 添加成员, 同时避免重复添加
   * */
  addMember(member: MemberMsg, index: number) {
    const added = this.value.find(i => i.id === member.id);

    if (!added) this.value.push(member);
    this.showMemberPopover = false;
  }

  async getMemberList() {
    const memberListRes = await Network.fetch<MemberMsgRes>('getMemberList', { projectId: this.projectId });
    this.memberList = memberListRes.data.retData.data.map(i => ({
      ...i,
      userName: String(i.name),
    }));
  }
}
