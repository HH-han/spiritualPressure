// Vue Router 配置
import { createRouter, createWebHistory } from "vue-router";
// ==================== 路由模块导入 ====================

// 认证模块
import LoginName from "@/views/LoginViews/LoginName.vue";
import QRcodeLogin from "@/views/LoginViews/QRcodeLogin.vue";
import Fanginter from "@/views/LoginViews/FanginternationalContainer.vue";
import AdminLogin from "@/views/LoginViews/AdminLogin.vue";
import EmailLogin from "@/views/LoginViews/EmailLogin.vue";
import EnrolFirst from "@/views/LoginViews/EnrolFirst.vue";
import ForgotPassword from "@/views/LoginViews/ForgotPassword.vue";

// 首页模块
import SystemHome from "@/views/HomePage/SystemHome.vue";
import HomeHeader from "@/components/NavigationComponent/HomeHeader.vue";

// 个人中心模块
import FunctionSwitching from "@/components/PersonalCenter/FunctionSwitching.vue";
import PersonalData from "@/views/ResponseMy/PersonalData.vue";
import HelpCenter from "@/views/ResponseMy/HelpCenter.vue";
import MessageCenter from "@/views/ResponseMy/MessageCenter.vue";
import SettingView from "@/views/ResponseMy/SettingView.vue";

// 订单管理模块
import OrderDetails from "@/views/MyCenter/OrderDetails.vue";
import ItemPurchase from "@/views/MyCenter/ItemPurchase.vue";
import AccountSettings from "@/views/MyCenter/AccountSettings.vue";

// 购物模块
import PayViews from "@/views/Mypage/PayViews.vue";
import ShopCartViews from "@/views/Mypage/ShopCartViews.vue";
import TavoriteBtn from "@/views/Mypage/TavoriteBtn.vue";

// 地图模块
import SearchView from "@/views/MapViews/SearchView.vue";
import GaodeMap from "@/views/MapViews/GaodeMap.vue";
import MapComponent from "@/views/MapViews/MapComponent.vue";
import MapLoading from "@/views/MapViews/MapLoading.vue";

// 管理模块
import UserGoodsmanagement from "@/views/Management/UserGoodsmanagement.vue";
import AdminLayout from "@/views/Management/AdminLayout.vue";

// 旅游模块
import TravelSidebar from "@/views/TourismCommunity/TravelSidebar.vue";
import TravelFreely from "@/views/TravelServiceoptions/TravelFreely.vue";
import HometravelGuides from "@/views/TravelServiceoptions/HometravelGuides.vue";
import TravelWorld from "@/views/TravelServiceoptions/TravelWorld.vue";
import TravelTeam from "@/views/TravelServiceoptions/TravelTeam.vue";
import TravelCruise from "@/views/TravelServiceoptions/TravelCruise.vue";

// 网站信息模块
import WebsiteIntroduction from "@/views/AboutWebsite/WebsiteIntroduction.vue";
import AboutWeb from "@/views/AboutWebsite/AboutWeb.vue";
import SettingsFocus from "@/views/SetFocus/SettingsFocus.vue";

// 提示与错误模块
import NotFoundView from "@/views/PromptViews/NotFoundView.vue";
import RecommendAtion from "@/views/TipViews/RecommendAtion.vue";
import SafetyTips from "@/views/TipViews/SafetyTips.vue";
import ErrorView404 from "@/components/ErrorPrompt/ErrorView404.vue";
import NotFindView404 from "@/components/ErrorPrompt/NotFindView404.vue";
import ErrorView500 from "@/components/ErrorPrompt/ErrorView500.vue";
import NetworkAnomaly from "@/components/ErrorPrompt/NetworkAnomaly.vue";

// 测试模块
import TestPage from "@/components/NavigationComponent/TestPage.vue";

// 即时通讯模块
import InstantMessaging from "@/views/instantMessaging/index.vue";
import IMTestPage from "@/views/instantMessaging/TestPage.vue";
import CommunicationManagement from "@/views/instantMessaging/communicationManagement/CommunicationManagement.vue";

// ==================== 路由配置 ====================
const routes = [
  // ==================== 认证路由 ====================
  { path: "/login",
    name: "login",
    component: LoginName,
    title: "用户登录" 
  },
  {
    path: "/enrolfirst",
    name: "enrolfirst",
    component: EnrolFirst,
    title: "用户注册",
  },
  {
    path: "/QRcodeLogin",
    name: "QRcodeLogin",
    component: QRcodeLogin,
    title: "二维码登录",
  },
  {
    path: "/Fanginter",
    name: "Fanginter",
    component: Fanginter,
    title: "国际版登录",
  },
  {
    path: "/adminlogin",
    name: "adminlogin",
    component: AdminLogin,
    title: "管理员登录",
  },
  {
    path: "/emaillogin",
    name: "emaillogin",
    component: EmailLogin,
    title: "邮箱登录",
  },
  {
    path: "/forgotpassword",
    name: "forgotpassword",
    component: ForgotPassword,
    title: "忘记密码",
  },

  // ==================== 首页路由 ====================
  {
    path: "/",
    name: "systemhomeView",
    component: HomeHeader,
    title: "首页导航",
  },
  {
    path: "/systemhome",
    name: "systemhome",
    component: SystemHome,
    title: "系统首页",
  },

  // ==================== 个人中心路由 ====================
  {
    path: "/personaldata",
    name: "personaldata",
    component: PersonalData,
    title: "个人资料",
  },
  {
    path: "/helpcenter",
    name: "helpcenter",
    component: HelpCenter,
    title: "帮助中心",
  },
  {
    path: "/messagecenter",
    name: "messagecenter",
    component: MessageCenter,
    title: "消息中心",
  },
  {
    path: "/setting",
    name: "setting",
    component: SettingView,
    title: "设置页面",
  },
  {
    path: "/functionswitching",
    name: "functionswitching",
    component: FunctionSwitching,
    title: "功能切换",
  },

  // ==================== 订单管理路由 ====================
  {
    path: "/orderdetails",
    name: "orderdetails",
    component: OrderDetails,
    title: "订单详情",
  },
  {
    path: "/itempurchase",
    name: "itempurchase",
    component: ItemPurchase,
    title: "商品购买",
  },
  {
    path: "/accountsettings",
    name: "accountsettings",
    component: AccountSettings,
    title: "账户设置",
  },

  // ==================== 购物路由 ====================
  {
    path: "/payviews",
    name: "payviews",
    component: PayViews,
    title: "支付页面",
  },
  {
    path: "/shopcartviews",
    name: "shopcartviews",
    component: ShopCartViews,
    title: "购物车",
  },
  {
    path: "/tavoritebtn",
    name: "tavoritebtn",
    component: TavoriteBtn,
    title: "收藏按钮",
  },

  // ==================== 地图路由 ====================
  {
    path: "/searchview",
    name: "searchview",
    component: SearchView,
    title: "搜索页面",
  },
  {
    path: "/gaodemap",
    name: "gaodemap",
    component: GaodeMap,
    title: "高德地图",
  },
  {
    path: "/mapcomponent",
    name: "mapcomponent",
    component: MapComponent,
    title: "地图组件",
  },
  {
    path: "/maploading",
    name: "maploading",
    component: MapLoading,
    title: "地图加载",
  },

  // ==================== 管理路由 ====================
  {
    path: "/usergoodsmanagement",
    name: "usergoodsmanagement",
    component: UserGoodsmanagement,
    title: "用户商品管理",
  },
  {
    path: "/AdminLayout",
    name: "AdminLayout",
    component: AdminLayout,
    title: "管理员布局",
  },

  // ==================== 旅游路由 ====================
  {
    path: "/travelstrategy",
    name: "travelstrategy",
    component: TravelSidebar,
    title: "旅游攻略",
  },
  {
    path: "/travelfreely",
    name: "travelfreely",
    component: TravelFreely,
    title: "自由行",
  },
  {
    path: "/hometravelguides",
    name: "hometravelguides",
    component: HometravelGuides,
    title: "家庭旅游指南",
  },
  {
    path: "/travelworld",
    name: "travelworld",
    component: TravelWorld,
    title: "世界旅游",
  },
  {
    path: "/travelteam",
    name: "travelteam",
    component: TravelTeam,
    title: "团队旅游",
  },
  {
    path: "/travelcruise",
    name: "travelcruise",
    component: TravelCruise,
    title: "邮轮旅游",
  },

  // ==================== 网站信息路由 ====================
  {
    path: "/websiteintroduction",
    name: "websiteintroduction",
    component: WebsiteIntroduction,
    title: "网站介绍",
  },
  {
    path: "/aboutweb",
    name: "aboutweb",
    component: AboutWeb,
    title: "关于网站",
  },
  {
    path: "/settingsfocus",
    name: "settingsfocus",
    component: SettingsFocus,
    title: "设置中心",
  },

  // ==================== 提示与错误路由 ====================
  {
    path: "/notfoundview",
    name: "notfoundview",
    component: NotFoundView,
    title: "页面未找到",
  },
  {
    path: "/recommendation",
    name: "recommendation",
    component: RecommendAtion,
    title: "推荐页面",
  },
  {
    path: "/safetytips",
    name: "safetytips",
    component: SafetyTips,
    title: "安全提示",
  },
  { path: "/404",
    name: "error404",
    component: ErrorView404,
    title: "404错误"
  },
  {
    path: "/404-view",
    name: "notFound404",
    component: NotFindView404,
    title: "404页面",
  },
  { path: "/500",
    name: "error500",
    component: ErrorView500,
    title: "500错误" 
  },
  {
    path: "/networkanomaly",
    name: "networkanomaly",
    component: NetworkAnomaly,
    title: "网络异常",
  },

  // ==================== 测试路由 ====================
  {
    path: "/testpage",
    name: "testpage",
    component: TestPage,
    props: (route) => ({ query: route.query }),
    title: "测试页面",
  },

  // ==================== 即时通讯路由 ====================
  {
    path: "/im",
    name: "instantMessaging",
    component: InstantMessaging,
    title: "即时通讯",
  },
  {
    path: "/im/test",
    name: "imTest",
    component: IMTestPage,
    title: "即时通讯测试",
  },
  {
    path: "/communication",
    name: "communicationManagement",
    component: CommunicationManagement,
    title: "即时通讯管理",
  },

  
];
// 创建路由实例
// 使用 createWebHistory 创建基于 HTML5 History 模式的路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 路由配置优化
  scrollBehavior(to, from, savedPosition) {
    // 返回顶部或保存的位置
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫 - 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else if (to.title) {
    document.title = to.title;
  }

  next();
});

// 路由守卫 - 全局后置守卫
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计等
  console.log(`路由跳转: ${from.path} -> ${to.path}`);
});
// ==================== 路由权限配置 ====================

// 需要管理员权限的路由列表
const ADMIN_ROUTES = [
  "/adminlogin",
  "/usergoodsmanagement",
  "/AdminLayout",
  "/communication",
];

// 需要登录权限的路由列表
const AUTH_REQUIRED_ROUTES = [
  "/personaldata",
  "/accountsettings",
  "/orderdetails",
  "/itempurchase",
  "/payviews",
  "/shopcartviews",
];

// 权限检查函数
const checkPermission = {
  // 检查管理员权限
  isAdmin: () => {
    // 这里应该根据实际业务逻辑检查用户权限
    // 暂时返回true，表示所有用户都有权限访问
    return true;
  },

  // 检查登录状态
  isLoggedIn: () => {
    // 这里应该检查用户是否已登录
    // 暂时返回true，表示用户已登录
    return true;
  },
};

// 路由权限检查 - 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要管理员权限
  if (ADMIN_ROUTES.includes(to.path)) {
    if (!checkPermission.isAdmin()) {
      // 如果没有管理员权限，跳转到权限不足页面
      next("/404");
      return;
    }
  }

  // 检查是否需要登录权限
  if (AUTH_REQUIRED_ROUTES.includes(to.path)) {
    if (!checkPermission.isLoggedIn()) {
      // 如果未登录，跳转到登录页面
      next("/login");
      return;
    }
  }

  next();
});

// ==================== 路由工具函数 ====================

/**
 * 获取路由名称映射表
 */
export const getRouteNames = () => {
  return routes.reduce((acc, route) => {
    if (route.name) {
      acc[route.name] = route.path;
    }
    return acc;
  }, {});
};

/**
 * 根据路径获取路由信息
 */
export const getRouteByPath = (path) => {
  return routes.find((route) => route.path === path);
};

/**
 * 获取所有路由路径
 */
export const getAllRoutes = () => {
  return routes.map((route) => route.path);
};

// ==================== 路由实例导出 ====================

export default router;

// 导出路由配置常量供其他模块使用
export { ADMIN_ROUTES, AUTH_REQUIRED_ROUTES, checkPermission };
