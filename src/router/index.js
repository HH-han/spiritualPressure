// 引入Vue路由库和创建路由历史的方法
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
//Element Plus
import { ElMessage} from 'element-plus';
// 引入各个组件
import Load_1 from '@/components/TransitionalComponents/LoadOne.vue'
import Load_2 from '@/components/TransitionalComponents/LoadTow.vue'
import Home_2 from '@/components/NavigationComponent/HomeHeader.vue'
import ClearingHouse from '@/components/NavigationComponent/ClearingHouse.vue'

//页面路由
import HomeView from '@/views/HomePage/HomeView.vue'
import SystemHome from '@/views/HomePage/SystemHome.vue'
import UserManagement_1 from '@/components/NavigationComponent/UserManagement_1.vue'
import ForgotPassword from '@/views/LoginViews/ForgotPassword.vue'

// 个人中心页面路由
import FunctionSwitching from '@/components/PersonalCenter/FunctionSwitching.vue'

// 我的页面路由
import BrowseAttractions from '@/views/Mypage/BrowseAttractions.vue'
import HotelRecommendations from '@/views/Mypage/HotelRecommendations.vue'
import CommunityCenter from '@/views/Mypage/CommunityCenter.vue'
import FavoritePage from '@/views/Mypage/FavoritePage.vue'
import PayViews from '@/views/Mypage/PayViews.vue'
import FoodRecommendation from '@/views/Mypage/FoodRecommendation.vue'
import ShopCartViews from '@/views/Mypage/ShopCartViews.vue'
import MyDestination from '@/views/Mypage/MyDestination.vue'
import CharacteristicCommodities from '@/views/Mypage/CharacteristicCommodities.vue'
import StrategyGroup from '@/views/Mypage/StrategyGroup.vue'

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
import NavigationBar from '@/components/ResponseComponent/NavigationBar.vue'
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


// 定义路由数组，每个对象代表一个路由
const routes = [
  // 登录/加载/注册页面路由
  {path: '/login',name: 'login',component: LoginName},
  {path: '/enrolfirst',name: 'enrolfirst',component: EnrolFirst},
  {path: '/load_1',name: 'load_1',component: Load_1},
  {path: '/QRcodeLogin',name: 'QRcodeLogin',component: QRcodeLogin},
  {path: '/Fanginter',name: 'Fanginter',component: Fanginter},
  {path: '/adminlogin',name: 'adminlogin',component: AdminLogin},
  {path: '/emaillogin',name: 'emaillogin',component: EmailLogin},
  {path: '/',name: 'load_2',component: Load_2},
  // 主页路由
  {path: '/home_2',name: 'home_2',component: Home_2,title: '首页顶部导航'},
  // 结算中心页面路由
  {path: '/clearinghouse',name: 'clearinghouse',component: ClearingHouse},
  // 主页路由
  {path: '/systemhome',name: 'systemhome',component: SystemHome},
  {path: '/systemhomeView',name: 'systemhomeView',component: HomeView,title: '首页'},
  // 用户页面路由
  {path: '/usermanagement_1',name: 'usermanagement_1',component: UserManagement_1},
  {path: '/browseattractions',name: 'browseattractions',component: BrowseAttractions},
  {path: '/hotelrecommendations',name: 'hotelrecommendations',component: HotelRecommendations},
  {path: '/communitycenter',name: 'communitycenter',component: CommunityCenter},
  {path: '/strategygroup',name: 'strategygroup',component: StrategyGroup},
  // 忘记密码页面路由
  {path: '/forgotpassword',name: 'forgotpassword',component: ForgotPassword},
  // 支付页面路由
  {path: '/payviews',name: 'payviews',component: PayViews},
  // 测试项目页面路由
  {path: '/testpage',name: 'testpage',component: TestPage},
  // 注册第二步页面路由
  {path: '/favoritepage',name: 'favoritepage',component: FavoritePage},
  // 个人中心页面路由
  {path: '/functionswitching',name: 'functionswitching',component: FunctionSwitching},
  // 修改个人信息页面路由
  {path: '/MyDestination',name: 'MyDestination',component: MyDestination},
  {path: '/shopcartviews',name: 'shopcartviews',component: ShopCartViews},
  {path: '/foodrecommendation',name: 'foodrecommendation',component: FoodRecommendation},
  {path: '/CharacteristicCommodities',name: 'CharacteristicCommodities',component: CharacteristicCommodities},
  // 提示
  {path: '/notfoundview',name: 'notfoundview',component: NotFoundView},
  {path: '/recommendation',name: 'recommendation',component: RecommendAtion},
  {path: '/safetytips',name: 'safetytips',component: SafetyTips},
  //设置中心
  {path: '/settingsfocus',name: 'settingsfocus',component: SettingsFocus},
  // 网站介绍
  {path: '/websiteintroduction',name: 'websiteintroduction',component: WebsiteIntroduction},
  {path: '/aboutweb',name: 'aboutweb',component: AboutWeb},
  //地图页面路由
  {path: '/searchview',name: 'searchview',component: SearchView},
  {path: '/gaodemap',name: 'gaodemap',component: GaodeMap},
  {path: '/mapcomponent',name: 'mapcomponent',component: MapComponent},
  //管理页面路由
  {path: '/usergoodsmanagement',name: 'usergoodsmanagement',component: UserGoodsmanagement},
  {path: '/AdminLayout', name: 'AdminLayout',component: AdminLayout},
  //旅游攻略页面路由
  {path: '/travelstrategy',name: 'travelstrategy',component: TravelSidebar},
  //404页面路由
  {path: '/404',name: '404',component: ErrorView404},
  {path: '/404-view',name: '/404-view',component: NotFindView404},
  {path: '/500',name: '500',component: ErrorView500},
  {path: '/networkanomaly',name: 'networkanomaly',component: NetworkAnomaly},
  // 订单页面路由
  {path: '/orderdetails',name: 'orderdetails',component: OrderDetails},
  {path: '/itempurchase',name: 'itempurchase',component: ItemPurchase},
  // 账户管理
  {path: '/accountsettings',name: 'accountsettings',component: AccountSettings},
  // 响应页面
  {path: '/navigationbar',name: 'navigationbar',component: NavigationBar},
  {path: '/viewmore',name: 'viewmore',component: ViewMore},
  {path: '/vieworder',name: 'vieworder',component: ViewOrder},
  {path: '/viewdiscover',name: 'viewdiscover',component: ViewDiscover},
  {path: '/viewprofile',name: 'viewprofile',component: ViewProfile},
  {path: '/vieworderlist',name: 'viewmorderlist',component: ViewOrderlist},
  // 我的
  {path: '/helpcenter',name: 'helpcenter',component: HelpCenter},
  {path: '/messagecenter',name: 'messagecenter',component: MessageCenter},
  {path: '/setting',name: 'setting',component: SettingView},
  {path: '/personaldata',name: 'personaldata',component: PersonalData},

  // 旅游选项页面路由
  {path: '/travelfreely',name: 'travelfreely',component: TravelFreely},
  {path: '/hometravelguides',name: 'hometravelguides',component: HometravelGuides},
  {path: '/travelworld',name: 'travelworld',component: TravelWorld},
  {path: '/travelteam',name: 'travelteam',component: TravelTeam},
  {path: '/travelcruise',name: 'travelcruise',component: TravelCruise},


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
    if (!userInfo || userInfo.username !== 'admin') {
      // 非管理员用户重定向到登录页面
      ElMessage.error('您没有管理员权限，无法访问，请先登录');
      return { path: '/adminlogin' };
    }
  }
  
  return true;
});

// 导出路由实例
export default router

