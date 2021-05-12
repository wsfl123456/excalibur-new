import { RouteConfig } from "vue-router";

const Growth = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/index.vue");
const ProfessionLine = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/ProfessionLine/index.vue");
const StaffDaily = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/StaffDaily/index.vue");
const Weaponry = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/Weaponry/index.vue");
const GoldHouse = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/GoldHouse/index.vue");
const QA = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/Q&A/index.vue");
const QAMySubmit= () => import(/* webpackChunkName: "growth" */ "@/views/Growth/Q&A/mySubmit.vue");
const ProfessionLineDetail = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/ProfessionLine/detail.vue");
const StaffDailyDetail = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/StaffDaily/detail.vue");
const GoldHouseDetail = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/GoldHouse/detail.vue");
const WeaponryDetail = () => import(/* webpackChunkName: "growth" */ "@/views/Growth/Weaponry/detail.vue");

export default {
  path: "growth",
  name: "growth",
  component: Growth,
  meta: {
    topMenu: "成长计划"
  },
  children: [
    {
      path: "professionLine",
      name: "professionLine",
      component: ProfessionLine,
      meta: {
        menu: ["NCC小黄书", "活点地图", "专业线"]
      }
    },
    {
      path: "staffDaily",
      name: "staffDaily",
      component: StaffDaily,
      meta: {
        menu: ["NCC小黄书", "活点地图", "员工日常"]
      }
    },
    {
      path: "weaponry",
      name: "nccWeaponry",
      component: Weaponry,
      meta: {
        menu: ["NCC小黄书", "皇家兵器库"]
      }
    },
    {
      path: "goldHouse",
      name: "goldHouse",
      component: GoldHouse,
      meta: {
        menu: ["NCC小黄书", "黄金屋"]
      }
    },
    {
      path: "q&a",
      name: "Q&A",
      component: QA,
      meta: {
        menu: ["NCC小黄书", "问题悬赏榜"]
      }
    },
    {
      path: "q&a",
      name: "Q&A",
      component: QA,
      meta: {
        menu: ["NCC小黄书", "问题悬赏榜"]
      }
    },
    {
      path: "q&a/mySubmit",
      name: "Q&AMySubmit",
      component: QAMySubmit,
      meta: {
        menu: ["NCC小黄书", "问题悬赏榜"]
      }
    },
    {
      path: "professionLineDetail/:id(\\d+)",
      name: "professionLineDetail",
      component: ProfessionLineDetail,
      meta: {
        menu: ["NCC小黄书", "活点地图", "专业线"]
      }
    },
    {
      path: "staffDailyDetail/:id(\\d+)",
      name: "staffDailyDetail",
      component: StaffDailyDetail,
      meta: {
        menu: ["NCC小黄书", "活点地图", "员工日常"]
      }
    },
    {
      path: "goldHouseDetail/:id(\\d+)",
      name: "goldHouseDetail",
      component: GoldHouseDetail,
      meta: {
        menu: ["NCC小黄书", "黄金屋"]
      }
    },
    {
      path: "weaponryDetail/:id(\\d+)",
      name: "weaponryDetail",
      component: WeaponryDetail,
      meta: {
        menu: ["NCC小黄书", "皇家兵器库"]
      }
    },
  ]
} as RouteConfig;
