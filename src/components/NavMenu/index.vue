<template>
  <el-menu class="left-fixed-nav" :default-active="defaultActive" :default-openeds="defaultOpeneds" unique-opened>
    <template v-for="(item, key) in menu">
      <el-submenu v-if="item.subMenu" :key="`1-${key}`" :index="item.title ? item.title : ''">
        <template slot="title">{{ item.title }}</template>
        <template v-for="(minorItem, minorKey) in item.subMenu">
          <el-submenu
            v-if="minorItem.subMenu"
            :index="minorItem.title ? minorItem.title : ''"
            :key="`${key}-${minorKey}`"
            class="secondMenu">
            <template slot="title">{{ minorItem.title }}</template>
            <el-menu-item
              @click="switchMenu(thirdItem.url)"
              :key="`${key}-${minorKey}-${thirdKey}`"
              :index="thirdItem.title ? thirdItem.title: ''"
              v-for="(thirdItem, thirdKey) in minorItem.subMenu">
              {{ thirdItem.title }}
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            @click="switchMenu(minorItem.url)"
            :key="`${key}-${minorKey}`"
            :index="minorItem.title ? minorItem.title : ''"
             class="secondMenu"
            v-else>
            {{ minorItem.title }}
          </el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item @click="switchMenu(item.url)" :key="`1-${key}`" :index="item.title ? item.title : ''" v-else>
        {{ item.title }}
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts">
import './index.less';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { NavMenuItem } from '@/interface';

@Component
export default class NavMenu extends Vue {
  @Prop({ type: Array, required: true }) menu?: NavMenuItem[];

  get defaultActive() {
    const menu = JSON.parse(JSON.stringify(this.$route.meta.menu));
    return menu.pop();
  }

  get defaultOpeneds() {
    return this.$route.meta.menu;
  }

  switchMenu(url: RawLocation) {
    /* 唉，瞎鸡儿乱用SessionStorage，只能这么处理 */
    window.sessionStorage.setItem('primaryMenu', '72');
    window.sessionStorage.setItem('currMenu', '72');
    this.$router.push(url);
  }
}
</script>
