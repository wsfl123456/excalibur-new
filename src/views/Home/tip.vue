<template>
  <div class="item">
    <div class="title">
      <div class="msg">
        <span class="icon" :style="{backgroundImage: `url(${require(`@/assets/svg/${icon}`)})`}"></span>
        <span class="font">{{ title }}</span>
      </div>
      <router-link class="more" :to="url" v-if="visibleMore">更多</router-link>
    </div>
    <ul v-if="data.length" class="content">
      <li v-for="(item, key) in data" :key="key" @click="$router.push(item.url)">
        <div class="msg">
          <span class="msg-type" v-if="item.msgType">{{ item.msgType }}</span>
          <span class="info">{{ item.msg }}</span>
          <span class="new-icon" v-if="item.isNew"></span>
        </div>
        <span class="remark">
          <span class="name" v-if="item.user">{{ item.user }}</span>
          <span class="date">{{ item.remark }}</span>
        </span>
      </li>
    </ul>
    <div class="empty-msg" v-else>
      <span>{{ emptyMsg }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface Msg {
  msg?: string,
  remark?: string,
  link?: string,
  isNew?: boolean
}

@Component
export default class Tip extends Vue {
  @Prop(String) readonly title: string | undefined;

  @Prop(String) readonly icon: string | undefined;

  @Prop(Boolean) readonly visibleMore: boolean | undefined;

  @Prop(String) readonly url: string | undefined;

  @Prop({ type: Array, required: true }) readonly data: Msg[] | undefined;

  @Prop(String) readonly emptyMsg: string | undefined;
}
</script>
