// 引入Vue路由库和创建路由历史的方法
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
//Element Plus
import { ElMessage} from 'element-plus';
// 引入各个组件
import Load_1 from '@/components/TransitionalComponents/LoadOne.vue'
import Load_2 from '@/components/TransitionalComponents/LoadTow.vue'
import Home_2 from '@/components/NavigationComponent/HomeHeader.vue'
import ClearingHouse from '@/components/NavigationComponent/ClearingHouse.vue'
import CommunityCenter from '@/views/Mypage/CommunityCenter.vue'
import FavoritePage from '@/views/Mypage/FavoritePage.vue'
import UserManagement_1 from '@/components/NavigationComponent/UserManagement_1.vue'

//页面路由
import SystemHome from '@/views/HomePage/SystemHome.vue'
import HomeHeader from '@/components/NavigationComponent/HomeHeader.vue'
import ForgotPassword from '@/views/LoginViews/ForgotPassword.vue'

// 个人中心页面路由
import FunctionSwitching from '@/components/PersonalCenter/FunctionSwitching.vue'

// 我的页面路由
import PayViews from '@/views/Mypage/PayViews.vue'
import ShopCartViews from '@/views/Mypage/ShopCartViews.vue'
import TavoriteBtn from '@/views/Mypage/TavoriteBtn.vue'

// 测试项目页面路由
import TestPage from '@/components/NavigationComponent/TestPage.vue';

// 提示页面
import NotFoundView from '@/views/PromptViews/NotFoundView.vue'
import RecommendAtion from '@/views/TipViews/RecommendAtion.vue'
import SafetyTips from '@/views/TipViews/SafetyTips.vue'

// 登录
import LoginName from '@/views/LoginViews/LoginName.vue'
import QRcodeLogin from '@/views/LoginViews/QRcodeLogin.vue'
import Fanginter from '@/views/LoginViews/FanginternationalContainer.vue'
import AdminLogin from '@/views/LoginViews/AdminLogin.vue'
import EmailLogin from '@/views/LoginViews/EmailLogin.vue'

// 注册
import EnrolFirst from '@/views/LoginViews/EnrolFirst.vue'

// 设置中心
import SettingsFocus from '@/views/SetFocus/SettingsFocus.vue'

//网站介绍
import WebsiteIntroduction from '@/views/AboutWebsite/WebsiteIntroduction.vue'
import AboutWeb from '@/views/AboutWebsite/AboutWeb.vue'

//地图
import SearchView from '@/views/MapViews/SearchView.vue'
import GaodeMap from '@/views/MapViews/GaodeMap.vue'
import MapComponent from '@/views/MapViews/MapComponent.vue'
import MapLoading from '@/views/mapViews/MapLoading.vue'

//管理页面路由
import UserGoodsmanagement from '@/views/Management/UserGoodsmanagement.vue'
import AdminLayout from '@/views/Management/AdminLayout.vue'

//旅游攻略
import TravelSidebar from '@/views/TourismCommunity/TravelSidebar.vue'

//404/500
import ErrorView404 from '@/components/ErrorPrompt/ErrorView404.vue'
import NotFindView404 from '@/components/ErrorPrompt/NotFindView404.vue'
import ErrorView500 from '@/components/ErrorPrompt/ErrorView500.vue'
import NetworkAnomaly from '@/components/ErrorPrompt/NetworkAnomaly.vue'

//订单管理
import OrderDetails from '@/views/MyCenter/OrderDetails.vue'
import ItemPurchase from '@/views/MyCenter/ItemPurchase.vue'
import AccountSettings from '@/views/MyCenter/AccountSettings.vue'
// 响应页面
import ViewMore from '@/views/ResponseView/ViewMore.vue'
import ViewOrder from '@/views/ResponseView/ViewOrder.vue'
import ViewDiscover from '@/views/ResponseView/ViewDiscover.vue'
import ViewProfile from '@/views/ResponseView/ViewProfile.vue'
import ViewOrderlist from '@/views/ResponseView/ViewOrderlist.vue'
// 我的页
import PersonalData from '@/views/ResponseMy/PersonalData.vue'
import HelpCenter from '@/views/ResponseMy/HelpCenter.vue'
import MessageCenter from '@/views/ResponseMy/MessageCenter.vue'
import SettingView from '@/views/ResponseMy/SettingView.vue'

// 旅游服务选项
import TravelFreely from '@/views/TravelServiceoptions/TravelFreely.vue'
import HometravelGuides from '@/views/TravelServiceoptions/HometravelGuides.vue'
import TravelWorld from '@/views/TravelServiceoptions/TravelWorld.vue'
import TravelTeam from '@/views/TravelServiceoptions/TravelTeam.vue'
import TravelCruise from '@/views/TravelServiceoptions/TravelCruise.vue'

// 即时通讯页面路由
import InstantMessaging from '@/views/instantMessaging/index.vue'
import IMTestPage from '@/views/instantMessaging/TestPage.vue'

// 定义路由数组，每个对象代表一个路由
const routes = [
  // 登录/加载/注册页面路由
  {path: '/login',name: 'login',component: LoginName,title: "用户登录"},
  {path: '/enrolfirst',name: 'enrolfirst',component: EnrolFirst,title: "用户注册"},
  {path: '/QRcodeLogin',name: 'QRcodeLogin',component: QRcodeLogin,title: "二维码登录"},
  {path: '/Fanginter',name: 'Fanginter',component: Fanginter,title: "国际版登录"},
  {path: '/adminlogin',name: '极速赛车开奖直播历史记录adminlogin',component: AdminLogin,title: "管理员登录"},
  {path: '/emaillogin',name: 'emaillogin',component: EmailLogin,title: "邮箱登录"},
  // 主页路由
  {path: '/systemhome',name: 'systemhome',component: SystemHome,title: "系统首页"},
  {path: '/',name: 'systemhomeView',component: HomeHeader,title: '首页导航'},
  // 用户页面路由
  {path: '/tavoritebtn',name: 'tavoritebtn',component: TavoriteBtn,title: "收藏按钮"},
  // 忘记密码页面路由
  {path: '/forgotpassword',name: 'forgotpassword',component: ForgotPassword,title: "忘记密码"},
  // 支付页面路由
  {path: '/payviews',name: 'payviews',component: PayViews,title: "支付页面"},
  // 测试项目页面路由
  {path: '/testpage',name: 'testpage',component: TestPage, props: (route) => ({ query: route.query }),title: "测试页面"},
  // 个人中心页面路由
  {path: '/functionswitching',name: 'functionswitching',component: FunctionSwitching,title: "功能切换"},
  // 修改个人信息页面路由
  {path: '/shopcartviews',name: 'shopcartviews',component: ShopCartViews,title: "购物车"},
  // 提示
  {path: '/notfoundview',name: 'notfoundview',component: NotFoundView,title: "页面未找到"},
  {path: '/recommendation',name: 'recommendation',component: RecommendAtion,title: "推荐页面"},
  {path: '/safetytips',name: 'safetytips',component: SafetyTips,title: "安全提示"},
  //设置中心
  {path: '/settingsfocus',name: 'settingsfocus',component: SettingsFocus,title: "设置中心"},
  // 网站介绍
  {path: '/websiteintroduction',name: 'websiteintroduction',component: WebsiteIntroduction,title: "网站介绍"},
  {path: '/aboutweb',name: 'aboutweb',component: AboutWeb,title: "关于网站"},
  //地图页面路由
  {path: '/searchview',name: 'searchview',component: SearchView,title: "搜索页面"},
  {path: '/gaodemap',name: 'gaodemap',component: GaodeMap,title: "高德地图"},
  {path: '/mapcomponent',name: 'mapcomponent',component: MapComponent,title: "地图组件"},
  {path: '/maploading',name: 'maploading',component: MapLoading,title: "地图加载"},
  //管理页面路由
  {path: '/usergoodsmanagement',name: 'usergoodsmanagement',component: UserGoodsmanagement,title: "用户商品管理"},
  {path: '/AdminLayout', name: 'AdminLayout',component: AdminLayout,title: "管理员布局"},
  //旅游攻略页面路由
  {path: '/travelstrategy',name: 'travelstrategy',component: TravelSidebar,title: "旅游攻略"},
  //404页面路由
  {path: '/404',name: '极速赛车开奖直播历史记录404',component: ErrorView404,title: "404错误"},
  {path: '/404-view',name: '/404-view',component: NotFindView404,title: "404页面"},
  {path: '/500',name: '500',component: ErrorView500,title: "500错误"},
  {path: '/networkanomaly',name: 'networkanomaly',component: NetworkAnomaly,title: "网络异常"},
  // 订单页面路由
  {path: '/orderdetails',name: 'orderdetails',component: OrderDetails,title: "订单详情"},
  {path: '/itempurchase',name: 'itempurchase',component: ItemPurchase,title: "商品购买"},
  // 账户管理
  {path: '/accountsettings',name: 'accountsettings',component: AccountSettings,title: "账户设置"},
  // 响应页面
  {path: '/viewmore',name: 'viewmore',component: ViewMore,title: "查看更多"},
  {path: '/vieworder',name: 'vieworder',component: ViewOrder,title: "查看订单"},
  {path: '/viewdiscover',name: 'viewdiscover',component: ViewDiscover,title: "发现页面"},
  {path: '/viewprofile',name: 'viewprofile',component: ViewProfile,title: "个人资料"},
  {path: '/vieworderlist',name: 'viewmorderlist',component: ViewOrderlist,title: "订单列表"},
  // 我的
  {path: '/helpcenter',name: 'helpcenter',component: HelpCenter,title: "帮助中心"},
  {path: '/messagecenter',name: 'messagecenter',component: MessageCenter,title: "消息中心"},
  {path: '/setting',name: 'setting',component: SettingView,title: "设置页面"},
  {path: '/personaldata',name: 'personaldata',component: PersonalData,title: "个人资料"},

  // 旅游选项页面路由
  {path: '/travelfreely',name: 'travelfreely',component: TravelFreely,title: "自由行"},
  {path: '/hometravelguides',name: 'hometravelguides',component: HometravelGuides,title: "家庭旅游指南"},
  {path: '/travelworld',name: 'travelworld',component: TravelWorld,title: "世界旅游"},
  {path: '/travelteam',name: 'travelteam',component: TravelTeam,title: "团队旅游"},
  {path: '/travelcruise',name: 'travelcruise',component: TravelCruise,title: "邮轮旅游"},

  // 即时通讯页面路由
  {path: '/im',name: 'instantMessaging',component: InstantMessaging,title: "即时通讯"},
  {path: '/im/test',name: 'imTest',component: IMTestPage,title: "即时通讯测试"},

]
// 创建路由实例
// 使用 createWebHistory 创建基于 HTML5 History 模式的路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
// 需要管理员权限的路由列表
const adminRoutes = [
  'AdminLayout',
];

router.beforeEach((to) => {
  // 如果路由不存在，跳转到 404 页面
  if (!router.hasRoute(to.name)) {
    ElMessage.error('该页面正在开发中，请稍后再试');
    return { path: '/404-view' };
  }
  
  // 检查是否需要管理员权限
  if (adminRoutes.includes(to.name)) {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || userInfo.permissions !== 1) {
      // 非管理员用户重定向到登录页面
      ElMessage.error('您没有管理员权限，无法访问，请先登录');
      return { path: '/adminlogin' };
    }
  }
  
  return true;
});

// 导出路由实例
export default router

