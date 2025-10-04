<template>
  <div class="personalcenter-container">
    <!-- 侧边栏 -->
    <div class="personalcenter-sidebar">
      <div class="personalcenter-sidebar-header">
        <div class="personalcenter-sidebar-title">个人中心</div>
      </div>
      <div class="personalcenter-sidebar-menu-gap">
        <div v-for="personalcenter in personalcenters" :key="personalcenter.id" class="personalcenter-menu-item" :class="{
          active: activeMenu === personalcenter.id,
          'has-submenu': personalcenter.subItems
        }" @click="toggleSubMenu(personalcenter)">
          <div class="menu-item-content">
            <span class="menu-item-icon" v-html="personalcenter.iocn"></span>
            <span class="menu-item-text">{{ personalcenter.title }}</span>
          </div>
          <span v-if="personalcenter.subItems" class="submenu-arrow"
            :class="{ 'submenu-arrow-open': showSubMenu === personalcenter.id }">
            ▼
          </span>

          <!-- 二级菜单 -->
          <div v-if="personalcenter.subItems && showSubMenu === personalcenter.id" class="submenu">
            <div v-for="subItem in personalcenter.subItems" :key="subItem.id" class="submenu-item"
              :class="{ 'active': activeSubMenu === subItem.id }" @click.stop="changeSubMenu(subItem)">
              <span class="menu-item-icon" v-html="subItem.iocn"></span>
              <span class="menu-item-text">{{ subItem.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主内容区 -->
    <main class="personalcenter-main">
      <!-- 固定背景层 -->
      <div class="accountsettings-background">
        <img src="@/assets/scenery/scenery-2.webp" alt="background" />
      </div>

      <!-- 可滚动内容区域 -->
      <div class="accountsettings-content">
        <component :is="activeComponent" v-if="activeComponent" class="accountsettings-component" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MyRelease from '@/views/MyCenter/MyRelease.vue';
import MessageNotification from '@/views/MyCenter/MessageNotification.vue';
import ChangePassword from '@/views/MyCenter/ChangePassword.vue';
import PersonalCenter from '@/views/MyCenter/PersonalCenter.vue';
import MyOrder from '@/views/MyCenter/MyOrder.vue';
import DeleteOrder from '@/views/MyCenter/DeleteOrder.vue';
import PersonalPosts from '@/views/MyCenter/PersonalPosts.vue';
import PersonalNotes from '@/views/MyCenter/PersonalNotes.vue';
import TravelCollection from '@/views/MyCenter/TravelCollection.vue';
import LoginStatus from '@/views/MyCenter/LoginStatus.vue';

const router = useRouter();
const DEFAULT_PERSONALCENTER_ID = 'personal';
const activeMenu = ref(localStorage.getItem('activeMenu') || 2);
const showSubMenu = ref(null);
const activeSubMenu = ref(null);

const personalcenters = reactive([
  { id: 'home', title: '返回首页', component: null, ishome: true, iocn: bh },
  { id: 'personal', title: '个人中心', component: PersonalCenter, iocn: pc },
  { id: 'password', title: '修改密码', component: ChangePassword, iocn: cp },
  {
    id: 'orders',
    title: '我的购物车',
    iocn: sh,
    subItems: [
      { id: 'shopping-cart', title: '购物车', component: MyOrder, iocn: mo },
      { id: 'order-history', title: '订单历史', component: DeleteOrder, iocn: deo }
    ]
  },
  { id: 'messages', title: '消息通知', component: MessageNotification, iocn: mn },
  { id: 'posts', title: '我的发布', component: MyRelease, iocn: ml },
  { id: 'postsdelete', title: '发布管理', component: PersonalPosts, iocn: pp },
  { id: 'note', title: '我的笔记', component: PersonalNotes, iocn: pn },
  { id: 'favorites', title: '我的收藏', component: TravelCollection, iocn: tc },
  { id: 'login', title: '登录状态', component: LoginStatus, iocn: ls },
]);

const activeComponent = shallowRef(PersonalCenter);

const toggleSubMenu = (personalcenter) => {
  if (!personalcenter?.id) return;

  if (personalcenter.ishome) {
    localStorage.removeItem('activeMenu');
    router.push({ name: 'systemhomeView' });
    return;
  }

  if (personalcenter.subItems) {
    showSubMenu.value = showSubMenu.value === personalcenter.id ? null : personalcenter.id;
    // 如果没有子菜单被选中，默认选中第一个
    if (showSubMenu.value && !activeSubMenu.value) {
      changeSubMenu(personalcenter.subItems[0]);
    }
  } else {
    showSubMenu.value = null;
    activeMenu.value = personalcenter.id;
    localStorage.setItem('activeMenu', personalcenter.id);
    activeComponent.value = personalcenter.component;
  }
};

const changeSubMenu = (subItem) => {
  activeSubMenu.value = subItem.id;
  activeMenu.value = subItem.id;
  localStorage.setItem('activeMenu', subItem.id);
  activeComponent.value = subItem.component;
};

onMounted(() => {
  const savedMenuId = localStorage.getItem('activeMenu') || DEFAULT_PERSONALCENTER_ID;

  // 检查是否是子菜单项
  let selectedItem = null;
  for (const item of personalcenters) {
    if (item.subItems) {
      const subItem = item.subItems.find(s => s.id === savedMenuId);
      if (subItem) {
        selectedItem = subItem;
        showSubMenu.value = item.id;
        break;
      }
    } else if (item.id === savedMenuId) {
      selectedItem = item;
      break;
    }
  }

  // 如果没有找到匹配的，使用默认
  if (!selectedItem) {
    selectedItem = personalcenters.find(p => p.id === DEFAULT_PERSONALCENTER_ID);
  }

  if (selectedItem) {
    activeMenu.value = selectedItem.id;
    activeComponent.value = selectedItem.component;

    // 如果是子菜单项，设置activeSubMenu
    if (selectedItem.id !== DEFAULT_PERSONALCENTER_ID) {
      const parentItem = personalcenters.find(p =>
        p.subItems && p.subItems.some(s => s.id === selectedItem.id)
      );
      if (parentItem) {
        showSubMenu.value = parentItem.id;
        activeSubMenu.value = selectedItem.id;
      }
    }
  }
});
// SVG图标定义
const bh = `<svg t="1749169948314" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33067" width="16" height="16"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FDEBED" p-id="33068"></path><path d="M739.84 500.48c-5.12 14.08-19.2 24.32-35.84 24.32h-12.8v153.6c0 28.16-23.04 51.2-51.2 51.2h-89.6v-102.4c0-7.68-5.12-12.8-12.8-12.8h-51.2c-7.68 0-12.8 5.12-12.8 12.8v102.4h-89.6c-28.16 0-51.2-23.04-51.2-51.2V524.8h-12.8c-15.36 0-29.44-10.24-35.84-24.32-6.4-15.36-2.56-32 10.24-42.24l192-153.6c14.08-12.8 37.12-12.8 51.2 0l192 153.6c12.8 10.24 16.64 26.88 10.24 42.24z" fill="#EC3A4E" p-id="33069"></path></svg>`;

const pc = `<svg t="1758266508202" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9753" width="32" height="32"><path d="M514.4576 512.8704m-432.3328 0a432.3328 432.3328 0 1 0 864.6656 0 432.3328 432.3328 0 1 0-864.6656 0Z" fill="#4AEDCD" p-id="9754"></path><path d="M289.4848 418.7136c-85.0432 0-160.4096 41.3696-207.104 105.0624 4.5568 182.7328 122.368 337.3056 285.952 396.032 103.2192-33.28 177.92-130.048 177.92-244.3776-0.0512-141.7216-114.9952-256.7168-256.768-256.7168z" fill="#83FFE1" p-id="9755"></path><path d="M523.3664 352.8704m-140.544 0a140.544 140.544 0 1 0 281.088 0 140.544 140.544 0 1 0-281.088 0Z" fill="#FFFFFF" p-id="9756"></path><path d="M243.3536 732.3648c65.28 73.2672 163.1744 119.9104 272.64 119.9104 118.0672 0 222.6176-54.2208 287.3856-137.6256-32.4608-116.1216-144.5376-201.7792-277.9136-201.7792-139.9808 0-256.6144 94.464-282.112 219.4944z" fill="#D7FFF7" p-id="9757"></path></svg>`;

const cp = `<svg t="1758266442151" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7761" width="32" height="32"><path d="M511.865692 1023.999052A512.007942 512.007942 0 0 1 312.631632 40.489074a511.996088 511.996088 0 0 1 398.479973 943.288572A508.676903 508.676903 0 0 1 511.865692 1023.999052zM512.328007 213.643825H512.102776a169.859275 169.859275 0 0 0-119.099458 48.151886A160.565558 160.565558 0 0 0 343.772697 377.741944a163.967722 163.967722 0 0 0 118.198537 156.357306L462.315006 771.373536a49.289892 49.289892 0 0 0 49.609957 48.851286h2.07449a49.657373 49.657373 0 0 0 46.456731-32.006424l61.642001-60.954455-58.761423-57.789376V650.23515l58.216128-58.773277L564.024308 533.70806a163.7662 163.7662 0 0 0 116.776029-156.357306A166.445256 166.445256 0 0 0 512.339861 213.643825z m-1.066881 230.873002a69.145729 69.145729 0 0 1-33.701579-8.748423 64.747809 64.747809 0 0 1 0-113.622803 69.276126 69.276126 0 0 1 67.391303 0 64.747809 64.747809 0 0 1 0 113.622803 69.098312 69.098312 0 0 1-33.689724 8.736569z" fill="#47D6EA" p-id="7762"></path></svg>`;

const mo = `<svg t="1758266362787" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5915" width="32" height="32"><path d="M346.112 806.912q19.456 0 36.864 7.168t30.208 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.208 20.48-36.864 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 37.888-7.168zM772.096 808.96q19.456 0 37.376 7.168t30.72 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.72 20.48-37.376 7.68-36.864-7.68-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 36.864-7.168zM944.128 227.328q28.672 0 44.544 7.68t22.528 18.944 6.144 24.064-3.584 22.016-13.312 37.888-22.016 62.976-23.552 68.096-18.944 53.248q-13.312 40.96-33.28 56.832t-49.664 15.872l-35.84 0-65.536 0-86.016 0-96.256 0-253.952 0 14.336 92.16 517.12 0q49.152 0 49.152 41.984 0 20.48-9.728 35.328t-38.4 14.848l-49.152 0-94.208 0-118.784 0-119.808 0-99.328 0-55.296 0q-20.48 0-34.304-9.216t-23.04-24.064-14.848-32.256-8.704-32.768q-1.024-6.144-5.632-29.696t-11.264-58.88-14.848-78.848-16.384-87.552q-19.456-103.424-44.032-230.4l-76.8 0q-15.36 0-25.6-7.68t-16.896-18.432-9.216-23.04-2.56-22.528q0-20.48 13.824-33.792t37.376-13.312l21.504 0 21.504 0 25.6 0 34.816 0q20.48 0 32.768 6.144t19.456 15.36 10.24 19.456 5.12 17.408q2.048 8.192 4.096 23.04t4.096 30.208q3.072 18.432 6.144 38.912l700.416 0zM867.328 194.56l-374.784 0 135.168-135.168q23.552-23.552 51.712-24.064t51.712 23.04z" fill="#FF3814" p-id="5916"></path></svg>`;

const sh = `<svg t="1758266254584" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="32" height="32"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FEE8EB" p-id="3555"></path><path d="M494.3 659.4c7.2 0 14.1 1.3 20.6 4 6.5 2.7 12.2 6.4 17.1 11.1 5 4.8 8.8 10.4 11.4 16.9 2.7 6.5 4 13.3 4 20.6 0 7.2-1.3 14.1-4 20.6s-6.5 12.1-11.4 16.9-10.7 8.6-17.1 11.4-13.3 4.3-20.6 4.3c-7.6 0-14.6-1.4-20.9-4.3s-11.9-6.7-16.9-11.4c-5-4.8-8.8-10.4-11.4-16.9-2.7-6.5-4-13.3-4-20.6 0-7.2 1.3-14.1 4-20.6 2.7-6.5 6.5-12.1 11.4-16.9 5-4.8 10.6-8.5 16.9-11.1 6.3-2.6 13.3-4 20.9-4zM753 339c10.7 0 19 1.4 24.9 4.3 5.9 2.9 10.1 6.4 12.6 10.6 2.5 4.2 3.6 8.7 3.4 13.4s-0.9 8.9-2 12.3c-1.1 3.4-3.5 10.5-7.1 21.1-3.6 10.7-7.7 22.4-12.3 35.1-4.6 12.8-9 25.4-13.4 38-4.4 12.6-7.7 22.5-10 29.7-5 15.2-11.2 25.8-18.9 31.7-7.6 5.9-17 8.9-28 8.9h-300l8.6 51.4s177.2 0.5 179.2 0.5c-15 13-19 36-20 51-17 0-16.9-0.1-16.9-0.1H399.9c-7.6 0-14-1.7-19.1-5.1-5.1-3.4-9.4-7.9-12.9-13.4-3.4-5.5-6.2-11.5-8.3-18-2.1-6.5-3.7-12.6-4.9-18.3-0.4-2.3-1.4-7.8-3.1-16.6-1.7-8.8-3.8-19.7-6.3-32.9-2.5-13.1-5.2-27.8-8.3-44-3-16.2-6.1-32.5-9.1-48.9-7.2-38.5-15.4-81.3-24.6-128.6h-42.9c-5.7 0-10.5-1.4-14.3-4.3-3.8-2.9-7-6.3-9.4-10.3-2.5-4-4.2-8.3-5.1-12.9-1-4.6-1.4-8.8-1.4-12.6 0-7.6 2.6-13.9 7.7-18.9 5.1-5 12.1-7.4 20.9-7.4h57.6c7.6 0 13.7 1.1 18.3 3.4 4.6 2.3 8.2 5.1 10.9 8.6 2.7 3.4 4.6 7 5.7 10.9 1.1 3.8 2.1 7 2.9 9.7 0.8 3 1.5 7.3 2.3 12.9 0.8 5.5 1.5 11.1 2.3 16.9 1.1 6.9 2.3 14.1 3.4 21.7 0 0.2 390.8 0.2 390.8 0.2z" fill="#FF6A69" p-id="3556"></path><path d="M684.8 554.8c14.7 0 28.8 2.7 42.3 8.1 13.5 5.4 25.1 12.9 34.7 22.6s17.4 21 23.2 34.2c5.8 13.1 8.7 27 8.7 41.7 0 14.7-2.9 28.6-8.7 41.7-5.8 13.1-13.5 24.5-23.2 34.2s-21.2 17.4-34.7 23.2c-13.5 5.8-27.6 8.7-42.3 8.7s-28.6-2.9-41.7-8.7-24.5-13.5-34.2-23.2-17.4-21-23.2-34.2c-5.8-13.1-8.7-27-8.7-41.7 0-14.7 2.9-28.6 8.7-41.7 5.8-13.1 13.5-24.5 23.2-34.2s21-17.2 34.2-22.6c13.2-5.4 27.1-8.1 41.7-8.1z" fill="#FFA3A5" p-id="3557"></path><path d="M699.7 651.6v-27c0-3.3-1.7-6-5-6l-18.8 0.1c-3.3 0-5.9 2.7-5.9 5.9v26.7h-14c-3.3 0-5.9 2.7-5.9 5.9 0 1.4 0.5 2.8 1.4 3.8l29.9 42.1c2.1 2.5 7.3 2.4 9 0l28.9-42.1c2.1-2.5 1.8-6.2-0.7-8.4-1.1-0.9-2.4-1.4-3.8-1.4 0 0.2-15.1 0.4-15.1 0.4z" fill="#FFFFFF" p-id="3558"></path></svg>`;

const deo = `<svg t="1758266308040" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3723" width="32" height="32"><path d="M38.04 518.35a475.12 487.33 0 1 0 950.24 0 475.12 487.33 0 1 0-950.24 0Z" fill="#07AA74" p-id="3724"></path><path d="M513.16 18.75C258.74 18.75 52.5 224.99 52.5 479.41s206.25 460.66 460.66 460.66 460.66-206.25 460.66-460.66S767.58 18.75 513.16 18.75z m0 769.72c-170.69 0-309.06-138.37-309.06-309.06s138.37-309.06 309.06-309.06 309.06 138.37 309.06 309.06-138.37 309.06-309.06 309.06z" fill="#56D8B0" p-id="3725"></path><path d="M406.63 640.18m-33.99 0a33.99 33.99 0 1 0 67.98 0 33.99 33.99 0 1 0-67.98 0Z" fill="#FFFFFF" p-id="3726"></path><path d="M573.24 640.18m-33.99 0a33.99 33.99 0 1 0 67.98 0 33.99 33.99 0 1 0-67.98 0Z" fill="#FFFFFF" p-id="3727"></path><path d="M690.62 326l-89.98 246.1c-0.31 0.84-0.64 1.65-1.02 2.45-5.13 11.03-16.18 17.76-27.88 17.76H396.23c-9.96 0-18.58-6.93-20.73-16.65l-3.36-15.22c-2.11-9.53 5.15-18.57 14.91-18.57h125.88c12.33 0 22.71-10.09 22.47-22.42-0.23-11.94-9.98-21.55-21.98-21.55H370.59c-7.17 0-13.37-4.98-14.91-11.98l-21.34-96.62c-2.93-13.25 7.16-25.81 20.73-25.81H611.4l21.43-58.62c5.83-15.97 23.51-24.17 39.47-18.34 15.95 5.84 24.16 23.51 18.32 39.47z" fill="#FFFFFF" p-id="3728"></path></svg>`;

const mn = `<svg t="1749170200000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="88001" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#E3F2FD" p-id="88002"></path><path d="M704 384H320c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h384c35.2 0 64-28.8 64-64V448c0-35.2-28.8-64-64-64z m-192 64c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128z m192 256H320v-38.4c0-35.2 57.6-64 128-64s128 28.8 128 64v38.4z" fill="#42A5F5" p-id="88003"></path></svg>`;

const ml = `<svg t="1749170250000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="99001" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#FBE9E7" p-id="99002"></path><path d="M704 320H320c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h384c35.2 0 64-28.8 64-64V384c0-35.2-28.8-64-64-64z m-192 64c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128z m192 256H320v-38.4c0-35.2 57.6-64 128-64s128 28.8 128 64v38.4z" fill="#FF5722" p-id="99003"></path></svg>`;

const pp = `<svg t="1749170300000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="110001" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#E8F5E8" p-id="110002"></path><path d="M704 320H320c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h384c35.2 0 64-28.8 64-64V384c0-35.2-28.8-64-64-64z m-192 64c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128z m192 256H320v-38.4c0-35.2 57.6-64 128-64s128 28.8 128 64v38.4z" fill="#66BB6A" p-id="110003"></path></svg>`;

const pn = `<svg t="1749170350000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="121001" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#F3E5F5" p-id="121002"></path><path d="M704 384H320c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h384c35.2 0 64-28.8 64-64V448c0-35.2-28.8-64-64-64z m-192 64c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128z m192 256H320v-38.4c0-35.2 57.6-64 128-64s128 28.8 128 64v38.4z" fill="#9C27B0" p-id="121003"></path></svg>`;

const tc = `<svg t="1749170400000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="132001" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#FFF3E0" p-id="132002"></path><path d="M704 320H320c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h384c35.2 0 64-28.8 64-64V384c0-35.2-28.8-64-64-64z m-192 64c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128z m192 256H320v-38.4c0-35.2 57.6-64 128-64s128 28.8 128 64v38.4z" fill="#FFA726" p-id="132003"></path></svg>`;

const ls = `<svg t="1749170450000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="143001" width="16" height="16"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#E8F5E8" p-id="143002"></path><path d="M704 384H320c-35.2 0-64 28.8-64 64v256c0 35.2 28.8 64 64 64h384c35.2 0 64-28.8 64-64V448c0-35.2-28.8-64-64-64z m-192 64c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128z m192 256H320v-38.4c0-35.2 57.6-64 128-64s128 28.8 128 64v38.4z" fill="#4CAF50" p-id="143003"></path></svg>`;

</script>

<style scoped>
/* 基础重置样式 */
.personalcenter-reset {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
}

/* 主容器 - 添加渐变背景 */
.personalcenter-container {
  display: flex;
  min-height: 100vh;
}

/* 玻璃拟态侧边栏 */
.personalcenter-sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 2rem 1.5rem;
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  color: #2a2a72;
  position: fixed;
  height: 100vh;
  z-index: 1;
}

.personalcenter-sidebar-header {
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.personalcenter-sidebar-title {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  color: #2a2a72;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.3);
}

/* 玻璃拟态菜单项 */
.personalcenter-sidebar-menu-gap {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.menu-item-icon svg {
  width: 100%;
  height: 100%;
}

.menu-item-text {
  flex: 1;
  font-weight: 500;
  color: #2a2a72;
}

.personalcenter-menu-item {
  padding: 0.2rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.personalcenter-menu-item:hover {
  background: rgba(255, 255, 255, 0.45);
  transform: translateY(-2px);
}

.personalcenter-menu-item.active {
  background: rgba(100, 149, 237, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 4px 16px rgba(100, 149, 237, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.has-submenu {
  position: relative;
}

.submenu-arrow {
  position: absolute;
  right: 1.5rem;
  top: .5rem;
  font-size: 0.7rem;
  transition: all 0.3s ease;
  color: #4a4a8a;
}

.submenu-arrow-open {
  transform: rotate(180deg);
}

/* 玻璃拟态子菜单 */
.submenu {
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.submenu-item {
  padding: 0.2rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
  display: flex;
  gap: 10px;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.4);
}

.submenu-item.active {
  background: rgba(100, 149, 237, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

/* 主容器 */
.personalcenter-main {
  position: relative;
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
  overflow: hidden;
  /* 防止背景溢出 */
}

/* 固定背景层 */
.accountsettings-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.accountsettings-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 内容区域 - 玻璃拟态效果 */
.accountsettings-content {
  position: relative;
  z-index: 1;
  height: 100%;
  animation: fadeInUp 0.8s ease-out;
}

/* 动态组件容器 */
.accountsettings-component {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;

}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personalcenter-container {
    flex-direction: column;
  }

  .personalcenter-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 1.5rem;
    backdrop-filter: blur(12px);
  }

  .personalcenter-sidebar-menu-gap {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 1rem;
    gap: 0.5rem;
  }

  .personalcenter-menu-item {
    white-space: nowrap;
    min-width: 120px;
    padding: 0.8rem 1rem;
  }

  .personalcenter-main {
    margin-left: 0;
    padding: 1.8rem;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }

  .submenu {
    position: absolute;
    width: auto;
    min-width: 180px;
    z-index: 20;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
}
</style>