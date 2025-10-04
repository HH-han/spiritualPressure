<template>
  <!-- 导航栏 -->
  <div class="navbar-background">
    <div class="navbar-background-container">
      <div class="navbar-home">
        <div class="logo" style="display: flex; align-items: center; gap: 10px;">
          <img src="@/assets/logo/m-logo.png" alt="" style="width: 50px;height: 50px;border-radius: 10px;">
          <span>博览旅行</span>
        </div>
        <div class="nav-items">
          <div class="center-items">
            <button v-for="navItem in navItems" :key="navItem.path" class="action-btn"
              @click="handleClick(navItem.path)">
              {{ navItem.label }}
            </button>
          </div>
          <div class="dropdown">
            <button class="action-btn dropdown-toggle">更多</button>
            <div class="dropdown-menu_Home_2">
              <button class="dropdown-item_action-btn" style="border-radius: 0 0 10px 10px"
                @click="navigateTo('/SettingsFocus')">设置中心</button>
              <button class="dropdown-item_action-btn" @click="navigateTo('/WebsiteIntroduction')">关于我们</button>
              <button class="dropdown-item_action-btn" v-if="userInfo.permissions === 1"
                @click="navigateTo('/testpage')">测试页面</button>
              <button class="dropdown-item_action-btn" style="border-radius: 10px 10px 0 0"
                @click="navigateTo('aboutweb')">网站介绍</button>
              <button class="dropdown-item_action-btn" @click="navigateTo('/travelstrategy')">社区</button>
            </div>
          </div>
        </div>
        <div class="actions">
          <ThemeSwitching />
          <!-- 微信 -->
          <button class="action-btn-iocn">
            <svg t="1737552806004" class="action-btn-iocn-size" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="6242">
              <path
                d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
                fill="#28C445" p-id="6243"></path>
              <path
                d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
                fill="#28C445" p-id="6244"></path>
            </svg>
          </button>
          <!-- QQ -->
          <button class="action-btn-iocn">
            <svg t="1737552871738" class="action-btn-iocn-size" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="7246">
              <path
                d="M512 0C229.003636 0 0 229.003636 0 512s229.003636 512 512 512 512-229.003636 512-512S794.996364 0 512 0z m210.385455 641.396364c-7.447273 9.309091-26.996364-1.861818-41.89091-32.581819-3.723636 13.963636-13.032727 36.305455-34.443636 64.232728 35.374545 8.378182 44.683636 42.821818 33.512727 61.44-8.378182 13.032727-26.996364 24.203636-59.578181 24.203636-58.647273 0-83.781818-15.825455-95.883637-26.996364-1.861818-2.792727-5.585455-3.723636-10.24-3.723636-4.654545 0-7.447273 0.930909-10.24 3.723636-11.170909 11.170909-37.236364 26.996364-95.883636 26.996364-32.581818 0-52.130909-11.170909-59.578182-24.203636-12.101818-18.618182-1.861818-53.061818 33.512727-61.44-20.48-27.927273-29.789091-50.269091-34.443636-64.232728-13.963636 30.72-34.443636 42.821818-41.890909 32.581819-5.585455-8.378182-8.378182-26.065455-7.447273-38.167273 3.723636-46.545455 34.443636-85.643636 53.061818-106.123636-2.792727-5.585455-8.378182-40.029091 14.894546-63.301819v-1.861818c0-92.16 65.163636-158.254545 148.014545-158.254545 81.92 0 148.014545 66.094545 148.014546 158.254545v1.861818c23.272727 23.272727 17.687273 57.716364 14.894545 63.301819 17.687273 20.48 49.338182 59.578182 53.061818 106.123636 0.930909 12.101818-0.930909 29.789091-7.447272 38.167273z"
                fill="#30A5DD" p-id="7247"></path>
            </svg>
          </button>
          <!--微博  -->
          <button class="action-btn-iocn">
            <svg t="1737552907646" class="action-btn-iocn-size" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="8263">
              <path
                d="M448.698182 482.210909c-96.814545 4.654545-175.010909 56.785455-175.010909 121.949091s78.196364 114.501818 175.010909 109.847273S623.709091 647.912727 623.709091 582.749091c-0.930909-64.232727-79.127273-105.192727-175.010909-100.538182z m65.163636 164.770909c-29.789091 39.098182-88.436364 57.716364-145.221818 26.065455-26.996364-14.894545-26.065455-43.752727-26.065455-43.752728s-11.170909-92.16 85.643637-103.330909c97.745455-12.101818 115.432727 81.92 85.643636 121.018182z"
                fill="#EA5D5C" p-id="8264"></path>
              <path
                d="M448.698182 584.610909c-6.516364 4.654545-7.447273 13.032727-3.723637 18.618182 2.792727 5.585455 11.170909 6.516364 16.756364 1.861818 5.585455-4.654545 8.378182-13.032727 4.654546-18.618182-2.792727-5.585455-10.24-6.516364-17.687273-1.861818zM403.083636 597.643636c-18.618182 1.861818-30.72 17.687273-30.72 33.512728 0 14.894545 14.894545 26.065455 32.581819 24.203636 17.687273-1.861818 32.581818-15.825455 32.581818-31.650909s-13.963636-27.927273-34.443637-26.065455z"
                fill="#EA5D5C" p-id="8265"></path>
              <path
                d="M512 0C229.003636 0 0 229.003636 0 512s229.003636 512 512 512 512-229.003636 512-512S794.996364 0 512 0z m197.352727 626.501818C669.323636 712.145455 538.065455 754.036364 441.250909 746.589091c-92.16-7.447273-211.316364-38.167273-223.418182-151.738182 0 0-6.516364-51.2 42.821818-117.294545 0 0 70.749091-99.607273 152.669091-128.465455 82.850909-27.927273 92.16 19.549091 92.16 48.407273-4.654545 24.203636-12.101818 38.167273 18.618182 28.858182 0 0 80.989091-38.167273 114.501818-4.654546 26.996364 26.996364 4.654545 65.163636 4.654546 65.163637s-11.170909 12.101818 12.101818 16.756363c21.410909 3.723636 94.021818 37.236364 53.992727 122.88z m-80.058182-236.450909c-8.378182 0-15.825455-7.447273-15.825454-15.825454 0-9.309091 7.447273-15.825455 15.825454-15.825455 0 0 99.607273-18.618182 87.505455 89.367273v1.861818c-0.930909 7.447273-7.447273 13.963636-15.825455 13.963636-9.309091 0-15.825455-7.447273-15.825454-15.825454 0-1.861818 15.825455-73.541818-55.854546-57.716364zM797.789091 493.381818c-2.792727 18.618182-12.101818 11.170909-22.341818 11.170909-13.032727 0-23.272727-16.756364-23.272728-29.789091 0-11.170909 4.654545-22.341818 4.654546-22.341818 0.930909-4.654545 12.101818-34.443636-7.447273-78.196363-35.374545-60.509091-106.123636-60.509091-114.501818-57.716364-8.378182 3.723636-21.410909 5.585455-21.410909 5.585454-13.032727 0-23.272727-10.24-23.272727-23.272727 0-11.170909 7.447273-19.549091 16.756363-22.341818 0 0 0 0.930909 0.930909 0.930909s1.861818 0.930909 1.861819 0.930909c10.24-1.861818 45.614545-4.654545 79.127272 3.723637 62.370909 14.894545 146.152727 83.781818 108.916364 211.316363z"
                fill="#EA5D5C" p-id="8266"></path>
            </svg>
          </button>
          <!-- 登录和注册按钮（未登录时显示） -->
          <template v-if="!isLoggedIn">
            <button class="action-btn" @click="LoginName">
              <svg t="1741965110034" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="10018" width="20" height="20" style="vertical-align: middle;">
                <path
                  d="M65.843 512.919c0 246.179 199.576 445.755 445.76 445.755 246.179 0 445.755-199.576 445.755-445.755 0-246.185-199.576-445.76-445.755-445.76-246.184 0-445.76 199.575-445.76 445.76z m0 0"
                  fill="#EDEEF5" p-id="10019"></path>
                <path
                  d="M411.306 468.342v111.437s3.898 72.549-44.577 83.581c0 0-1.559 117.01 156.015 117.01V468.342H411.306z m222.876 0v111.437s-3.898 72.549 44.577 83.581c0 0 1.561 117.01-156.014 117.01V468.342h111.437z m0 0"
                  fill="#EDE7E6" p-id="10020"></path>
                <path
                  d="M400.16 546.349s100.296 138.075 267.457 111.439c-54.159-15.934-33.435-133.726-33.435-133.726L400.16 546.349z m0 0"
                  fill="#E3DCDB" p-id="10021"></path>
                <path
                  d="M508.46 958.674c-151.279-0.025-292.22-76.766-374.329-203.822a408.723 408.723 0 0 1 240.598-97.064c22.012 60.866 80.154 101.116 144.872 100.296 93.719 0 133.726-100.296 133.726-100.296s156.014 16.494 236.7 85.586c-80.714 133.632-225.454 215.3-381.567 215.3z m0 0"
                  fill="#3A8BCE" p-id="10022"></path>
                <path
                  d="M656.471 421.201s26.637-49.367 40.453-22.956c13.82 26.412-1.561 93.163-51.596 114.674l11.143-91.718z m0 0"
                  fill="#EFE7E6" p-id="10023"></path>
                <path
                  d="M517.172 278.893c33.434 0 128.157 11.146 128.157 11.146s11.143 106.982 11.143 156.014c0 92.27-68.536 167.162-139.299 167.162-70.764 0-139.299-74.892-139.299-167.162 0-57.951 11.146-156.014 11.146-156.014s101.855-11.146 128.152-11.146z m0 0"
                  fill="#F7EDEB" p-id="10024"></path>
                <path
                  d="M389.019 390.334s-59.732-63.856 0-167.162c30.089-52.041 93.162-55.719 122.585-55.719 104.861 0 170.055 34.323 178.302 122.585 7.687 82.908-17.276 112.887-22.288 111.437 0 0-33.435-53.602-33.435-89.15 0 0-122.579 45.912-200.587-44.577-35.663 9.027-44.577 100.297-44.577 122.586z m0 0"
                  fill="#3A8BCE" p-id="10025"></path>
              </svg>
              <span style="vertical-align: middle;">登录</span>
            </button>
            <button class="action-btn" @click="EnrolFirst">
              <svg t="1741965357577" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="15726" width="20" height="20" style="vertical-align: middle;">
                <path
                  d="M476.86656 537.6c151.97696 0 274.40128-119.46496 274.40128-268.8S628.84352 0 476.86656 0C324.89472 0 198.2464 119.46496 198.2464 268.8c4.224 149.33504 126.64832 268.8 278.62016 268.8z m-105.53344 51.2C177.14176 588.8 33.60768 712.53504 33.60768 900.26496V921.6c0 98.13504 156.19584 98.13504 350.3872 98.13504h194.19136c-84.4288-51.2-139.3152-140.8-139.3152-243.2C438.87616 704 464.20992 640 510.64832 588.8h-139.3152z"
                  fill="#727BB2" p-id="15727"></path>
                <path
                  d="M738.60096 1024c33.77664 0 63.32416-4.26496 97.09568-17.06496 29.55264-12.8 54.88128-29.87008 80.20992-51.2 21.10976-21.33504 37.9904-46.93504 50.65728-76.8 12.66688-29.87008 21.10976-59.73504 21.10976-93.87008 0-34.12992-4.224-64-21.10976-93.86496-12.66176-29.86496-29.54752-55.46496-50.65728-76.8s-50.65728-38.4-80.20992-51.2c-29.54752-12.8-63.31904-17.06496-97.09568-17.06496-33.77152 0-67.54304 4.26496-97.09056 17.06496-29.55264 12.8-54.8864 29.86496-80.20992 51.2-21.10976 21.33504-42.2144 46.93504-54.88128 76.8-12.66176 25.6-21.10464 59.73504-21.10464 93.86496 0 34.13504 4.21888 64 21.10464 93.87008 12.66688 29.86496 29.55264 55.46496 54.88128 76.8 21.10464 21.32992 50.65728 38.4 80.20992 51.2 29.54752 12.8 63.31904 17.06496 97.09056 17.06496z m122.42432-281.6c21.10976 0 42.21952 17.06496 42.21952 38.4 0 8.53504-4.224 21.33504-12.66688 25.6-8.448 4.26496-16.88576 8.53504-29.55264 8.53504h-88.64768V896c0 12.8-4.224 21.33504-8.448 29.86496-8.44288 8.53504-16.88576 12.8-29.54752 12.8-12.66688 0-21.10976-4.26496-25.32864-12.8-4.224-8.52992-8.448-17.06496-8.448-29.86496v-81.06496h-80.2048c-12.66688 0-21.10976 0-29.55264-8.53504-8.44288-4.26496-12.66176-12.8-12.66176-25.6 0-8.53504 4.21888-21.33504 12.66176-25.6 8.448-8.53504 16.88576-12.8 29.55264-12.8h80.20992v-81.06496c0-8.53504 4.21888-21.33504 8.44288-25.6 4.21888-8.53504 16.88576-12.8 25.32864-12.8 12.66176 0 21.10464 4.26496 29.55264 12.8 8.44288 8.52992 8.44288 17.06496 8.44288 25.6V742.4h88.64768z"
                  fill="#727BB2" p-id="15728"></path>
              </svg>
              <span style="vertical-align: middle;">注册</span>
            </button>
          </template>

          <!-- 用户头像（登录后显示） -->
          <div class="user-actions" v-else>
            <div class="profilepicture">
              <button class="profilepicture_button" @click="toggleDropdown">
                <div class="profilepicture_img">
                  <img v-if="!userInfo.image" :src="defaultAvatar" alt="默认头像" class="img1">
                  <img v-else :src="userInfo.image" alt="用户头像" class="img1" />
                </div>
              </button>
              <div class="profilepicture-inner" v-show="isDropdownVisible">
                <button style="border-radius: 10px 10px 0 0;" @click="navigateTo('/functionswitching')">个人中心</button>
                <button v-if="userInfo.permissions === 1" @click="AdminLayout" class="admin-button">博览旅行管理后台</button>
                <button v-if="userInfo.permissions === 1" @click="navigateTo('/communication')">即时通讯管理后台</button>
                <button style="border-radius: 0 0 10px 10px;" @click="navigateTo('/accountsettings')">账户设置</button>
                <button @click="navigateTo('/im')" class="im-button">好友聊天</button>
                <button @click="localLogout" class="logout-button">退出登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 渲染器区域 -->
  <div class="content-area">
    <component :is="currentComponent" v-if="currentComponent" />
  </div>
  <!-- 退出登录确认对话框 -->
  <div>
    <Launchlogin v-if="showLogoutConfirm" @confirm="confirmLogout" @cancel="cancelLogout" />
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, shallowRef } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
// 页面组件
import ThemeSwitching from '@/components/ThemeComponents/ThemeSwitching.vue';
import HomeView from '@/views/HomePage/HomeView.vue';
import BrowseAttractions from '@/views/Mypage/BrowseAttractions.vue';
import HotelRecommendations from '@/views/Mypage/HotelRecommendations.vue';
import FoodRecommendation from '@/views/Mypage/FoodRecommendation.vue';
import MyDestination from '@/views/Mypage/MyDestination.vue';
import CharacteristicCommodities from '@/views/Mypage/CharacteristicCommodities.vue';
import StrategyGroup from '@/views/Mypage/StrategyGroup.vue';
import Launchlogin from '@/components/PromptComponent/Launchlogin.vue';
// 接口
import { getUserInfo, logout } from '@/api/user';
import { useAuthStore } from '@/stores/auth';

const defaultAvatar = new URL('@/assets/defaultimage/mrtx.png', import.meta.url).href
const currentComponent = shallowRef(null);
const authStore = useAuthStore();

// 导航项数据
const navItems = [
  { path: 'HomeView', label: '首页' },
  { path: 'MyDestination', label: '目的地' },
  { path: 'BrowseAttractions', label: '景点' },
  { path: 'HotelRecommendations', label: '酒店' },
  { path: 'FoodRecommendation', label: '美食' },
  { path: 'CharacteristicCommodities', label: '小物件' },
  { path: 'StrategyGroup', label: '攻略群' },
];

const handleClick = (path) => {
  const componentMap = {
    'HomeView': HomeView,
    'BrowseAttractions': BrowseAttractions,
    'HotelRecommendations': HotelRecommendations,
    'FoodRecommendation': FoodRecommendation,
    'MyDestination': MyDestination,
    'CharacteristicCommodities': CharacteristicCommodities,
    'StrategyGroup': StrategyGroup
  };
  currentComponent.value = componentMap[path];
  // 保存当前组件路径到Pinia store
  authStore.currentComponentPath = path;
};

const navigateTo = (path) => {
  router.push(path);
};
// 默认头像

const router = useRouter();
// 页面跳转
const LoginName = () => {
  router.push('/login');
  ElMessage.success('返回登录！');
};
const EnrolFirst = () => {
  router.push('/EnrolFirst');
  ElMessage.success('前往注册！');
};
const AdminLayout = () => {
  if (userInfo.value.permissions === 1) {
    ElMessage.success('欢迎管理员！');
    router.push('/AdminLayout');
  } else {
    ElMessage.error('您没有访问权限');
  }
};
const isLoggedIn = ref(false);
const isDropdownVisible = ref(false);
const showLogoutConfirm = ref(false);
const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};
const localLogout = () => {
  // 检查是否有token，没有则直接退出登录状态
  const token = localStorage.getItem('token');
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  // 检查token是否存在或是否超过24小时
  const isTokenExpired = tokenTimestamp && (Date.now() - parseInt(tokenTimestamp) > 24 * 60 * 60 * 1000);
  if (!token || isTokenExpired) {
    // 清除所有登录相关存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedUsername');
    localStorage.removeItem('tokenTimestamp');
    isLoggedIn.value = false;
    return;
  }

  // 显示退出确认对话框
  showLogoutConfirm.value = true;
};

// 确认退出登录
const confirmLogout = async () => {
  try {
    // 获取用户ID
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.id;
    
    // 调用API退出登录
    if (userId) {
      await logout(userId);
    }
    
    // 清除所有登录相关存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedUsername');
    localStorage.removeItem('tokenTimestamp');
    
    // 更新登录状态
    isLoggedIn.value = false;
    // 关闭下拉菜单
    isDropdownVisible.value = false;
    // 关闭确认对话框
    showLogoutConfirm.value = false;
    
    ElMessage.success('退出登录成功');
  } catch (error) {
    console.error('退出登录失败:', error);
    // 即使API调用失败，也清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedUsername');
    localStorage.removeItem('tokenTimestamp');
    isLoggedIn.value = false;
    isDropdownVisible.value = false;
    showLogoutConfirm.value = false;
    ElMessage.success('已退出登录');
  }
};

// 取消退出登录
const cancelLogout = () => {
  // 关闭确认对话框
  showLogoutConfirm.value = false;
  console.log('退出操作已取消');
};

// 用户信息
const userInfo = ref({
  image: '',
  username: '',
  permissions: '',
  hasInput: false
});

const loading = ref(false);

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true;
    //检查是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.warning('登录后享受完整服务');
      return;
    }
    // 先从本地存储获取，优化用户体验
    const localUser = JSON.parse(localStorage.getItem('user') || {});
    userInfo.value = { ...localUser };

    //从服务器获取最新数据
    const response = await getUserInfo();

    if (response.code === '0') {
      userInfo.value = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
    } else {
      ElMessage.error(response.msg || '获取用户信息失败');
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败，请检查网络');
    console.error('获取用户信息失败:', error);
  } finally {
    loading.value = false;
  }
};
// 初始化检查登录状态
onMounted(() => {
  // 从Pinia store恢复当前组件状态，如果没有则默认显示首页
  const savedPath = authStore.currentComponentPath;
  const componentMap = {
    'HomeView': HomeView,
    'BrowseAttractions': BrowseAttractions,
    'HotelRecommendations': HotelRecommendations,
    'FoodRecommendation': FoodRecommendation,
    'MyDestination': MyDestination,
    'CharacteristicCommodities': CharacteristicCommodities,
    'StrategyGroup': StrategyGroup
  };
  currentComponent.value = savedPath ? componentMap[savedPath] : HomeView;

  isLoggedIn.value = !!localStorage.getItem('token');
  fetchUserInfo();
});
</script>

<style scoped>
@import "@/css/Home/HomeViews.css";
</style>