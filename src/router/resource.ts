import { RouteConfig } from 'vue-router';

const Resource = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/index.vue');
const Brand = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Brand/index.vue');
const BrandHome = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Brand/home.vue');
const BrandCreate = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Brand/create.vue');
const Supplier = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Supplier/index.vue');
const SupplierCreate = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Supplier/create.vue');
const SupplierHome = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Supplier/home.vue');
const Livemap = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/LiveMap/index.vue');
const LivemapCreate = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/LiveMap/create.vue');
const LivemapAnswer = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/LiveMap/answer.vue');
const Weaponry = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Weaponry/index.vue');
const WeaponryCreate = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Weaponry/create.vue');
const GoldHouse = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/GoldHouse/index.vue');
const GoldHouseCreate = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/GoldHouse/create.vue');
const AuditQuestion = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/AuditQuestion/index.vue');
const AnswerQuestion = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/AnswerQuestion/index.vue');
const Solution = () => import(/* webpackChunkName: "resource" */ '@/views/Resource/Solution/index.vue');



export default {
  path: 'resource',
  name: 'resource',
  component: Resource,
  meta: {
    topMenu: '资源管理'
  },
  children: [
    {
      path: 'brand',
      name: 'brand',
      component: Brand,
      meta: {
        menu: ['我的品牌']
      }
    },
    {
      path: 'brand/:id(\\d+)',
      name: 'brandHome',
      component: BrandHome,
      meta: {
        menu: ['我的品牌']
      }
    },
    {
      path: 'brand/create',
      name: 'brandCreate',
      component: BrandCreate,
      meta: {
        menu: ['我的品牌']
      }
    },
    {
      path: 'brand/create/:id(\\d+)',
      name: 'brandEdit',
      component: BrandCreate,
      meta: {
        menu: ['我的品牌']
      }
    },
    {
      path: 'supplier',
      name: 'supplier',
      component: Supplier,
      meta: {
        menu: ['我的供应商']
      }
    },
    {
      path: 'supplier/create',
      name: 'supplierCreate',
      component: SupplierCreate,
      meta: {
        menu: ['我的供应商']
      }
    },
    {
      path: 'supplier/:id(\\d+)',
      name: 'supplierHome',
      component: SupplierHome,
      meta: {
        menu: ['我的供应商']
      }
    },
    {
      path: 'supplier/create/:id(\\d+)',
      name: 'supplierEdit',
      component: SupplierCreate,
      meta: {
        menu: ['我的供应商']
      }
    },
    {
      path: 'livemap',
      name: 'livemap',
      component: Livemap,
      meta: {
        menu: ['系统设置', '功能配置管理', '活点地图']
      }
    },
    {
      path: 'livemap/create',
      name: 'livemapCreate',
      component: LivemapCreate,
      meta: {
        menu: ['系统设置', '功能配置管理', '活点地图']
      }
    },
    {
      path: 'livemap/create/:id(\\d+)',
      name: 'livemapEdit',
      component: LivemapCreate,
      meta: {
        menu: ['系统设置', '功能配置管理', '活点地图']
      }
    },
    {
      path: 'livemap/answer',
      name: 'livemapAnswer',
      component: LivemapAnswer,
      meta: {
        menu: ['系统设置', '功能配置管理', '活点地图']
      }
    },
    {
      path: 'weaponry',
      name: 'weaponry',
      component: Weaponry,
      meta: {
        menu: ['系统设置', '功能配置管理', '皇家兵器库']
      }
    },
    {
      path: 'weaponry/create',
      name: 'weaponryCreate',
      component: WeaponryCreate,
      meta: {
        menu: ['系统设置', '功能配置管理', '皇家兵器库']
      }
    },
    {
      path: 'weaponry/create/:id(\\d+)',
      name: 'weaponryEdit',
      component: WeaponryCreate,
      meta: {
        menu: ['系统设置', '功能配置管理', '皇家兵器库']
      }
    },
    {
      path: 'goldhouse',
      name: 'goldhouse',
      component: GoldHouse,
      meta: {
        menu: ['系统设置', '功能配置管理', '黄金屋']
      }
    },
    {
      path: 'goldhouse/create',
      name: 'goldhouseCreate',
      component: GoldHouseCreate,
      meta: {
        menu: ['系统设置', '功能配置管理', '黄金屋']
      }
    },
    {
      path: 'goldhouse/create/:id(\\d+)',
      name: 'goldhouseEdit',
      component: GoldHouseCreate,
      meta: {
        menu: ['系统设置', '功能配置管理', '黄金屋']
      }
    },
    {
      path: 'auditquestion',
      name: 'auditQuestion',
      component: AuditQuestion,
      meta: {
        menu: ['系统设置', '功能配置管理', '提问审核']
      }
    },
    {
      path: 'answerquestion',
      name: 'answerQuestion',
      component: AnswerQuestion,
      meta: {
        menu: ['系统设置', '功能配置管理', '回答审核']
      }
    },
    {
      path: 'solution',
      name: 'solution',
      component: Solution,
      meta: {
        menu: ['系统设置', '功能配置管理', '解决方案审核']
      }
    },

  ],
} as RouteConfig;
