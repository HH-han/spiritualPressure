<template>
  <div class="data-management-container">
    <!-- 侧边栏 -->
    <div :class="{ 'is-collapsed': isSidebarCollapsed }" @mouseleave="closeBubble">
      <aside class="data-management">
        <div class="data-management__header">
          <div @click="toggleContent" class="data-management__toggle">
            <img src="@/assets/logo/logo.png" alt="">
            <h3 class="data-management__title" v-if="showTooltip">博览管理后台</h3>
          </div>
        </div>
        <transition name="data-slide">
          <div class="data-management__content">
            <!-- 管理模块菜单 -->
            <div>
              <!-- 使用v-for循环渲染所有菜单分类 -->
              <template v-for="category in menuCategories" :key="category.id">
                <!-- 菜单分类 -->
                <div class="menu-category">
                  <div class="menu-icon-container" @mouseenter="(e) => handleMouseEnter(category.id, e)"
                    @mouseleave="handleMouseLeave">
                    <span class="menu-icon" v-html="category.icon"></span>
                  </div>

                  <span class="category-title" @click="toggleCategory(category.id)" v-if="showTooltip">
                    <div>
                      <span>{{ category.title }}</span>
                      <span class="toggle-icon">{{ category.collapsed ? '+' : '-' }}</span>
                    </div>
                  </span>
                </div>
                <div class="menu-category-button" v-if="showTooltip">
                  <button v-for="item in category.menus" :key="item.id" class="data-management__btn"
                    :class="{ active: activeMenu === item.id }" @click="changeMenu(item)" v-show="!category.collapsed">
                    <span class="menu-icon" v-html="item.icon"></span>
                    <span class="menu-text">{{ item.title }}</span>
                  </button>
                </div>
                <!-- 气泡按钮 -->
                <div class="menu-bubble-button" v-if="showBubble && isHovering && currentCategory === category.id"
                  :style="bubblePosition">
                  <div class="bubble-container">
                    <!-- 气泡标题 -->
                    <div class="bubble-header">
                      <span class="bubble-title">{{ category.title }}</span>
                    </div>
                    <!-- 气泡内容菜单 -->
                    <div class="bubble-menu">
                      <button v-for="item in category.menus" :key="item.id" class="data-management__btn"
                        :class="{ active: activeMenu === item.id }" @click="changeMenu(item)">
                        <span class="menu-icon" v-html="item.icon"></span>
                        <span class="menu-text">{{ item.title }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </transition>
      </aside>
    </div>
    <!-- 主内容区 -->
    <div :class="{ 'is-collapsed': isSidebarCollapsed }">
      <!-- 顶部栏 -->
      <header class="data-management__top">
        <div class="data-management__top-header">
          <!-- 侧边栏开关按钮 -->
          <div class="data-management__top-left-breadcrumb-wrapper">
            <button class="data-management__top-left" @click="handleClick">
              <div class="data-management__top-svg">
                <svg t="1747977464806" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="2636">
                  <path
                    d="M867.1 141.17H156.08c-17.67 0-32 14.33-32 32s14.33 32 32 32H867.1c17.67 0 32-14.33 32-32s-14.33-32-32-32zM867.92 367.52H403.2c-17.67 0-32 14.33-32 32s14.33 32 32 32h464.73c17.67 0 32-14.33 32-32s-14.33-32-32.01-32zM867.92 573.87H403.2c-17.67 0-32 14.33-32 32s14.33 32 32 32h464.73c17.67 0 32-14.33 32-32s-14.33-32-32.01-32zM867.92 800.22H156.9c-17.67 0-32 14.33-32 32s14.33 32 32 32h711.02c17.67 0 32-14.33 32-32 0-17.68-14.32-32-32-32zM312.01 367.52v270.35L137.47 489.71z"
                    p-id="2637"></path>
                </svg>
              </div>
            </button>
            <!-- 面包屑导航模块 -->
            <div class="breadcrumb-container">
              <div class="breadcrumb-nav">
                <div class="breadcrumb-item-wrapper">
                  <!-- 显示所有相关分类 -->
                  <template v-for="(category, index) in currentCategories" :key="index">
                    <span class="current-category-wrapper">
                      {{ category }}
                      <span v-if="index < currentCategories.length - 1" class="category-separator-wrapper"></span>
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- 用户模块 -->
          <div class="data-management__top-right">
            <!-- 主题切换 -->
            <ThemeSwitching />
            <!-- 消息按钮 -->
            <button class="message-badge">消息</button>

            <!-- 全屏切换 -->
            <button class="icon-full-screen-button" @click="toggleFullScreen">
              <svg t="1751163087501" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5108">
                <path d="M704 64h256v64h-256z" p-id="5109"></path>
                <path d="M896 64h64v256h-64zM66.688 64h64v256h-64z" p-id="5110"></path>
                <path d="M66.688 64h256v64h-256zM66.688 894.976h256v64h-256z" p-id="5111"></path>
                <path d="M66.688 702.976h64v256h-64zM896 702.976h64v256h-64z" p-id="5112"></path>
                <path d="M704 894.976h256v64h-256z" p-id="5113"></path>
              </svg>
            </button>

            <div class="user-dropdown-wrapper" @mouseenter="showDropdown" @mouseleave="hideDropdown">
              <button class="user-button">
                <span class="user-name">{{ userInfo.nickname }}</span>
                <img v-if="!userInfo.hasInput" :src="defaultAvatar" alt="默认头像" class="data-management__top-avatar" />
                <img v-else :src="userInfo.image" alt="用户头像" class="data-management__top-avatar" />
              </button>
              <transition name="dropdown-fade">
                <div class="dropdown-menu" v-show="isDropdownVisible">
                  <div class="dropdown-item">
                    <button @click="showHelp">
                      请求帮助
                    </button>
                    <button class="logout" @click="logout">
                      退出登录
                    </button>
                  </div>
                </div>
              </transition>
            </div>
            <!-- 设置按钮 -->
            <button class="icon-full-screen-button" @click="openSettings">
              <svg t="1751163798426" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="6272">
                <path
                  d="M964.266667 355.555556c-39.822222 0-73.955556-19.911111-93.866667-56.888889s-19.911111-76.8 0-110.933334c17.066667-28.444444 5.688889-68.266667-22.755556-85.333333L688.355556 8.533333c-28.444444-17.066667-65.422222-5.688889-82.488889 22.755556-19.911111 34.133333-54.044444 56.888889-93.866667 56.888889s-73.955556-19.911111-93.866667-56.888889c-17.066667-28.444444-54.044444-39.822222-82.488889-22.755556L176.355556 102.4c-28.444444 17.066667-36.977778 54.044444-22.755556 85.333333 19.911111 34.133333 19.911111 76.8 0 110.933334s-54.044444 56.888889-93.866667 56.888889c-34.133333 0-59.733333 28.444444-59.733333 62.577777v190.577778c0 34.133333 25.6 62.577778 59.733333 62.577778 39.822222 0 73.955556 19.911111 93.866667 56.888889 19.911111 34.133333 19.911111 76.8 0 110.933333-8.533333 14.222222-11.377778 31.288889-5.688889 45.511111 2.844444 17.066667 14.222222 28.444444 28.444445 36.977778l159.288888 93.866667c8.533333 5.688889 19.911111 8.533333 28.444445 8.533333 19.911111 0 39.822222-11.377778 51.2-31.288889 19.911111-34.133333 54.044444-56.888889 93.866667-56.888889s73.955556 19.911111 93.866666 56.888889c17.066667 28.444444 54.044444 39.822222 82.488889 22.755556l159.288889-93.866667c28.444444-17.066667 36.977778-54.044444 22.755556-85.333333-19.911111-34.133333-19.911111-76.8 0-110.933334 19.911111-34.133333 54.044444-56.888889 93.866666-56.888889 34.133333 0 59.733333-28.444444 59.733334-62.577777v-190.577778c2.844444-31.288889-22.755556-59.733333-56.888889-59.733333z m5.688889 250.311111c0 2.844444-2.844444 5.688889-5.688889 5.688889-59.733333 0-110.933333 31.288889-142.222223 85.333333-28.444444 54.044444-28.444444 116.622222 0 167.822222 0 2.844444 0 5.688889-2.844444 5.688889L659.911111 967.111111c-2.844444 0-5.688889 0-5.688889-2.844444-28.444444-54.044444-82.488889-85.333333-142.222222-85.333334s-110.933333 31.288889-142.222222 85.333334c0 2.844444-5.688889 2.844444-5.688889 2.844444l-159.288889-93.866667-2.844444-5.688888c28.444444-54.044444 28.444444-116.622222 0-167.822223-28.444444-54.044444-82.488889-85.333333-142.222223-85.333333-2.844444 0-5.688889-2.844444-5.688889-5.688889v-190.577778c0-2.844444 2.844444-5.688889 5.688889-5.688889 59.733333 0 110.933333-31.288889 142.222223-85.333333s28.444444-116.622222 0-167.822222c0-2.844444 0-5.688889 2.844444-5.688889L364.088889 56.888889h2.844444s2.844444 0 2.844445 2.844444c28.444444 54.044444 82.488889 85.333333 142.222222 85.333334s110.933333-31.288889 142.222222-85.333334c0-2.844444 2.844444-2.844444 5.688889-2.844444l159.288889 93.866667c2.844444 0 2.844444 5.688889 2.844444 5.688888-28.444444 54.044444-28.444444 116.622222 0 167.822223 28.444444 54.044444 82.488889 85.333333 142.222223 85.333333 2.844444 0 5.688889 2.844444 5.688889 5.688889v190.577778z"
                  p-id="6273"></path>
                <path
                  d="M512 292.977778c-116.622222 0-213.333333 99.555556-213.333333 219.022222s96.711111 219.022222 213.333333 219.022222 213.333333-99.555556 213.333333-219.022222c0-122.311111-96.711111-219.022222-213.333333-219.022222z m0 381.155555c-88.177778 0-159.288889-73.955556-159.288889-162.133333s71.111111-162.133333 159.288889-162.133333 159.288889 73.955556 159.288889 162.133333-71.111111 162.133333-159.288889 162.133333z"
                  p-id="6274"></path>
              </svg>
            </button>
            <!-- 设置侧边栏 -->
            <transition name="slide">
              <div v-if="isExpanded" class="sidebar-mask">
                <AdminSetting @close="isExpanded = false" />
              </div>
            </transition>
          </div>
        </div>
        <!-- 面包屑导航 -->
        <div class="breadcrumb-navigation">
          <div class="breadcrumb-main fixed-element">
            <span v-for="(item, index) in breadcrumbList" :key="item.id" class="breadcrumb-wrapper active">
              <span class="breadcrumb-item" :class="{ 'active': activeMenu === item.id }" @click="navigateTo(item)">
                {{ item.title }}
              </span>
              <button class="breadcrumb-close" v-if="item.id !== 1" @click.stop="closeBreadcrumb(item)">
                <svg t="1755141750855" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="7421">
                  <path
                    d="M512 595.84765625l195.69757462 195.69757462a59.2473793 59.2473793 0 1 0 83.84765625-83.84765625L595.92644882 512l195.61878205-195.69757462a59.2473793 59.2473793 0 1 0-83.84765625-83.84765625L512 428.07355118 316.30242538 232.45476913a59.2473793 59.2473793 0 1 0-83.84765625 83.84765625L428.07355118 512 232.45476913 707.69757462a59.2473793 59.2473793 0 1 0 83.84765625 83.84765625L512 595.92644882z"
                    fill="#ffffff" p-id="7422"></path>
                </svg>
              </button>
            </span>
          </div>
        </div>
      </header>
      <!-- 主内容区 -->
      <main class="management-container">
        <transition name="fade" mode="out-in">
          <component :is="activeComponent" v-if="activeComponent" class="component-wrapper" />
        </transition>
      </main>
      <!-- 页脚区 -->
      <footer class="management-footer">
        <div class="footer-content">
          <div class="footer-left">
            <div class="logo-area">
              <img src="@/assets/logo/logo.png" alt="系统Logo" class="footer-logo">
              <span class="system-name">数据管理系统</span>
            </div>
            <div class="copyright">
              © 2024 数据管理平台 All Rights Reserved
            </div>
          </div>

          <div class="footer-right">
            <div class="footer-links">
              <a href="baidu.com" class="link-item">关于我们</a>
              <a href="baidu.com" class="link-item">帮助中心</a>
              <a href="baidu.com" class="link-item">隐私政策</a>
              <a href="baidu.com" class="link-item">服务条款</a>
            </div>

            <div class="footer-social">
              <a href="baidu.com" class="social-icon">
                <svg t="1752416147187" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="13392">
                  <path
                    d="M198.894933 0.648533h625.271467a199.0656 199.0656 0 0 1 198.9632 198.741334v624.64A199.0656 199.0656 0 0 1 824.1664 1022.805333H198.894933A199.0656 199.0656 0 0 1 0.017067 824.0128v-624.64A199.0656 199.0656 0 0 1 198.980267 0.631467z m0 0"
                    fill="#306CFF" p-id="13393"></path>
                  <path
                    d="M435.933867 561.0496h48.315733v255.522133h-85.333333a146.773333 146.773333 0 0 1-27.306667-1.143466 81.322667 81.322667 0 0 1-47.189333-31.232 89.9584 89.9584 0 0 1-17.066667-39.253334 128.699733 128.699733 0 0 1 0-44.373333 100.4544 100.4544 0 0 1 25.002667-43.1616 83.285333 83.285333 0 0 1 35.84-21.572267 55.808 55.808 0 0 1 16.4864-2.850133h50.5856c0.5632-24.405333 0.5632-48.264533 0.5632-72.106667z m-53.435734 115.831467a47.9232 47.9232 0 0 0-23.313066 21.572266 88.968533 88.968533 0 0 0-5.12 27.306667 56.695467 56.695467 0 0 0 9.659733 31.7952 40.3456 40.3456 0 0 0 34.133333 17.595733h38.656v-101.649066h-43.195733a24.1664 24.1664 0 0 0-10.8032 3.413333z m127.8976-40.96h48.247467v119.2448a19.421867 19.421867 0 0 0 19.899733 20.48h51.2v-139.127467h48.366934v180.565333h-117.0944a57.4976 57.4976 0 0 1-34.133334-14.199466 48.605867 48.605867 0 0 1-15.9232-38.0416c-0.5632-43.144533-0.5632-85.742933-0.5632-128.887467z m0 0"
                    fill="#306CFF" p-id="13394"></path>
                  <path
                    d="M414.907733 138.632533a57.1904 57.1904 0 0 1 42.666667 9.659734 106.837333 106.837333 0 0 1 39.799467 55.6544 158.446933 158.446933 0 0 1-2.269867 106.1888 114.773333 114.773333 0 0 1-29.559467 43.7248 60.279467 60.279467 0 0 1-79.0016 2.269866 108.356267 108.356267 0 0 1-36.386133-56.7808 162.338133 162.338133 0 0 1 2.850133-99.9424 108.544 108.544 0 0 1 35.242667-48.827733 54.766933 54.766933 0 0 1 26.709333-11.946667z m216.576 17.066667a48.622933 48.622933 0 0 1 30.72 5.12 94.481067 94.481067 0 0 1 33.536 28.398933 121.326933 121.326933 0 0 1 24.439467 56.7808 98.372267 98.372267 0 0 1-3.976533 42.666667 149.077333 149.077333 0 0 1-22.186667 47.121067 100.0448 100.0448 0 0 1-32.426667 31.232 66.816 66.816 0 0 1-40.362666 9.659733 73.130667 73.130667 0 0 1-47.172267-19.3024 87.364267 87.364267 0 0 1-23.313067-45.4144 178.688 178.688 0 0 1-1.143466-55.0912 126.549333 126.549333 0 0 1 17.066666-44.8512 150.186667 150.186667 0 0 1 32.426667-38.6048 65.024 65.024 0 0 1 32.426667-17.595733z m-389.376 154.453333a71.543467 71.543467 0 0 1 46.08 7.953067 116.053333 116.053333 0 0 1 46.609067 51.0976 78.506667 78.506667 0 0 1 7.970133 27.818667 174.08 174.08 0 0 1-5.12 72.686933 87.04 87.04 0 0 1-25.6 42.018133 89.9072 89.9072 0 0 1-56.849066 21.009067 72.4992 72.4992 0 0 1-47.189334-17.595733 108.168533 108.168533 0 0 1-32.9728-57.924267 122.043733 122.043733 0 0 1-2.850133-45.431467 162.133333 162.133333 0 0 1 25.6-71.543466 71.68 71.68 0 0 1 44.373333-30.088534z m505.9072 56.2176a88.302933 88.302933 0 0 1 55.1424 9.659734 94.6688 94.6688 0 0 1 35.84 37.546666 109.021867 109.021867 0 0 1 12.509867 42.018134 254.8736 254.8736 0 0 1-3.413333 62.464 93.098667 93.098667 0 0 1-17.6128 39.748266 68.949333 68.949333 0 0 1-34.679467 22.698667 114.005333 114.005333 0 0 1-41.489067 2.850133 86.391467 86.391467 0 0 1-46.609066-17.066666 75.639467 75.639467 0 0 1-23.893334-36.334934 200.891733 200.891733 0 0 1-6.263466-58.487466 166.536533 166.536533 0 0 1 11.3664-60.194134 76.8 76.8 0 0 1 29.013333-35.208533 74.922667 74.922667 0 0 1 30.122667-9.659733z m-251.818666 74.9568a104.448 104.448 0 0 1 55.7056 9.079467 156.706133 156.706133 0 0 1 63.146666 60.194133 634.88 634.88 0 0 0 66.56 78.916267 1001.028267 1001.028267 0 0 0 72.192 66.440533c3.976533 3.413333 8.533333 6.826667 12.509867 10.786134a121.019733 121.019733 0 0 1 32.9728 73.250133 164.9152 164.9152 0 0 1-15.906133 84.036267 98.833067 98.833067 0 0 1-42.069334 45.431466 165.7344 165.7344 0 0 1-84.1216 16.469334 314.299733 314.299733 0 0 1-82.432-14.762667 256.1536 256.1536 0 0 0-99.4816-7.3728c-15.36 1.706667-30.72 6.2464-46.08 8.533333a464.964267 464.964267 0 0 1-105.1648 5.12 104.106667 104.106667 0 0 1-75.605333-38.621866 135.8336 135.8336 0 0 1-24.439467-47.701334 131.7376 131.7376 0 0 1-6.826666-49.408 128.4608 128.4608 0 0 1 15.906133-56.2176 206.165333 206.165333 0 0 1 58.555733-64.733866 106.427733 106.427733 0 0 0 19.319467-15.906134c10.8032-10.24 22.186667-19.8656 32.9728-30.088533a359.714133 359.714133 0 0 0 53.998933-63.5904c4.539733-6.826667 7.953067-13.653333 13.073067-19.882667a131.771733 131.771733 0 0 1 85.333333-49.9712z m-60.2624 119.808v71.543467h-50.5856a52.906667 52.906667 0 0 0-16.4864 2.833067 89.224533 89.224533 0 0 0-35.84 21.589333 100.4032 100.4032 0 0 0-25.002667 43.144533 128.768 128.768 0 0 0 0 44.373334 89.890133 89.890133 0 0 0 17.066667 39.253333 83.114667 83.114667 0 0 0 47.172266 31.232 110.165333 110.165333 0 0 0 27.306667 1.1264h85.333333V560.5376c-16.4864 0.5632-32.426667 0.5632-48.896 0.5632z m74.461866 74.9568v128.324267a50.551467 50.551467 0 0 0 15.906134 38.0416 57.514667 57.514667 0 0 0 34.133333 14.199467h117.0944v-180.565334h-48.401067v139.1104h-51.2a17.8688 17.8688 0 0 1-14.779733-6.2464 21.794133 21.794133 0 0 1-5.12-14.199466v-119.2448c-15.36 0.580267-31.266133 0.580267-47.786667 0.580266z m0 0"
                    fill="#FFFFFF" p-id="13395"></path>
                  <path
                    d="M382.498133 676.932267a23.227733 23.227733 0 0 1 10.24-2.850134h43.144534v101.649067H397.226667a40.362667 40.362667 0 0 1-34.133334-17.595733 58.026667 58.026667 0 0 1-9.659733-31.7952 74.820267 74.820267 0 0 1 5.12-27.306667 47.496533 47.496533 0 0 1 23.893333-22.186667z m0 0"
                    fill="#FFFFFF" p-id="13396"></path>
                </svg>
              </a>
              <a href="bing.com" class="social-icon">
                <svg t="1752415989606" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="9378">
                  <path
                    d="M663.04 80H156.16A92.16 92.16 0 0 0 64 172.16v506.88a92.16 92.16 0 0 0 92.16 92.16h506.88a92.16 92.16 0 0 0 92.16-92.16V172.16A92.16 92.16 0 0 0 663.04 80z"
                    fill="#0065F3" p-id="9379"></path>
                  <path
                    d="M855.04 272H348.16A92.16 92.16 0 0 0 256 364.16v506.88a92.16 92.16 0 0 0 92.16 92.16h506.88a92.16 92.16 0 0 0 92.16-92.16V364.16A92.16 92.16 0 0 0 855.04 272z"
                    fill="#82B6FA" opacity=".4" p-id="9380"></path>
                  <path
                    d="M348.16 280h506.88a84.16 84.16 0 0 1 84.16 84.16v506.88a84.16 84.16 0 0 1-84.16 84.16H348.16a84.16 84.16 0 0 1-84.16-84.16V364.16a84.16 84.16 0 0 1 84.16-84.16z m607.04 84.16a100.16 100.16 0 0 0-100.16-100.16H348.16a100.16 100.16 0 0 0-100.16 100.16v506.88a100.16 100.16 0 0 0 100.16 100.16h506.88a100.16 100.16 0 0 0 100.16-100.16V364.16z"
                    fill="#FFFFFF" opacity=".4" p-id="9381"></path>
                  <path
                    d="M748.208 585.328l-177.344-67.456c-2.528-1.232-5.072 0-6.336 1.216-2.528 2.464-2.528 4.912-2.528 7.36L600 612.32l3.792 3.68 54.48 14.72-154.544 80.96 43.072-35.568c1.28-1.232 2.528-2.464 2.528-4.912V468.8a6.72 6.72 0 0 0-3.792-6.128L456.864 432c-2.528 0-5.056 0-6.336 1.232-1.264 1.216-2.528 2.448-2.528 4.896V744.8c0 1.232 0 1.232 1.28 2.448l1.248 1.232 1.28 1.232 88.656 49.056c1.28 0 2.528 1.232 2.528 1.232 1.28 0 2.544 0 3.808-1.232l202.672-122.656c1.264-1.232 2.528-3.68 2.528-4.912v-79.728a6.72 6.72 0 0 0-3.792-6.144z"
                    fill="#FFFFFF" p-id="9382"></path>
                </svg>
              </a>
              <a href="wx.com" class="social-icon">
                <svg t="1752416013681" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="10444">
                  <path
                    d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
                    fill="#28C445" p-id="10445"></path>
                  <path
                    d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
                    fill="#28C445" p-id="10446"></path>
                </svg>
              </a>
              <a href="qq.com" class="social-icon">
                <svg t="1752416050707" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="11423">
                  <path
                    d="M512 0C229.224296 0 0 229.224296 0 512s229.224296 512 512 512 512-229.224296 512-512S794.775704 0 512 0zM801.261037 668.86163c-21.731556 18.640593-49.948444-61.345185-54.006519-49.038222-9.879704 29.923556-14.506667 49.929481-43.633778 82.507852-1.554963 1.744593 33.659259 14.468741 43.633778 41.642667 9.557333 26.017185 28.141037 67.26163-93.487407 80.213333-71.35763 7.585185-122.936889-38.020741-128.075852-37.584593-9.53837 0.83437-5.290667 0-15.530667 0-8.38163 0-8.931556 0.606815-16.820148 0-2.161778-0.170667-25.884444 37.584593-131.963259 37.584593-82.223407 0-103.518815-51.749926-86.983111-80.213333 16.535704-28.463407 44.126815-36.750222 40.239407-41.263407-19.152593-22.186667-32.350815-45.909333-40.239407-67.356444-1.953185-5.347556-3.584-10.543407-4.873481-15.530667-2.996148-11.45363-25.884444 67.204741-50.460444 49.038222-24.576-18.166519-22.376296-64.417185-6.46637-108.676741 16.042667-44.619852 56.471704-87.589926 56.926815-97.071407 1.611852-35.290074-3.489185-41.14963 0-50.422519 7.755852-20.764444 17.199407-12.8 17.199407-23.570963 0-135.736889 100.864-245.76 225.28-245.76s225.28 110.042074 225.28 245.76c0 5.195852 13.520593 0 19.986963 23.570963 1.327407 4.873481 2.23763 23.665778 0.663704 50.422519-0.739556 12.856889 34.266074 28.501333 52.375704 97.071407C828.434963 628.754963 810.30637 661.105778 801.261037 668.86163z"
                    fill="#68A5E1" p-id="11424"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
// 引入依赖
import { ref, reactive, shallowRef, onMounted, computed, watchEffect, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { logout as userLogout } from '@/api/user';
// 用户管理组件
import User from '@/views/ManagementViews/UserManagement.vue';
import OrderManagement from '@/views/ManagementViews/OrderManagement.vue';
import CollectionManagement from '@/views/ManagementViews/CollectionManagement.vue';
import logininformationManagement from '@/views/ManagementViews/logininformationManagement.vue';
// 内容管理组件
import Goods from '@/views/ManagementViews/GoodsManagement.vue';
import SafetyTipsManagement from '@/views/ManagementViews/SafetyTipsManagement.vue';
import TravelNoteManagement from '@/views/ManagementViews/TravelNoteManagement.vue';
import TravelPostManagement from '@/views/ManagementViews/TravelPostManagement.vue';
// 旅游管理组件
import ScenicManagement from '@/views/ManagementViews/ScenicManagement.vue';
import HotelManagement from '@/views/ManagementViews/HotelManagement.vue';
import FoodManagement from '@/views/ManagementViews/FoodManagement.vue';
import DestinationManagement from '@/views/ManagementViews/DestinationManagement.vue';
import StrategygroupManagement from '@/views/ManagementViews/StrategygroupManagement.vue';
import RecommendationManagement from '@/views/ManagementViews/RecommendationManagement.vue';
import TravelGuide from '@/views/ManagementViews/TravelGuide.vue';
import DisplayManagement from '@/views/ManagementViews/DisplayManagement.vue';
import CarouselManagment from '@/views/ManagementViews/CarouselManagment.vue';
import DestinationworldManagement from '@/views/ManagementViews/DestinationworldManagement.vue';
import TravelNewsManagement from '@/views/ManagementViews/TravelNewsManagement.vue';
import index from '@/views/ManagementViews/DestinationManagement/index.vue';
// 个人/设置组件
import CenterManagement from '@/views/ManagementViews/CenterManagement.vue';
import AdminSetting from '@/views/Management/AdminSetting.vue';
// 系统管理组件
import AdminsystemHome from '@/views/SystemManagement/AdminsystemHome.vue';
import ManagementHomepage from '@/views/SystemManagement/ManagementHomepage.vue';
import LoginLogs from '@/views/SystemManagement/LoginLogs.vue';
import OperationLog from '@/views/SystemManagement/OperationLog.vue';
// 系统监控组件
import SystemMonitoring from '@/views/MonitoringCenter/SystemMonitoring.vue';
import CacheMonitoring from '@/views/MonitoringCenter/CacheMonitoring.vue';
import OnlineUsers from '@/views/MonitoringCenter/OnlineUsers.vue';
// 控制组件
import ThemeSwitching from '@/components/ThemeComponents/ThemeSwitching.vue';

// 导航路由
const router = useRouter();
// Pinia store
const authStore = useAuthStore();
// 折叠状态控制 - 从Pinia store获取
const systemCollapsed = ref(authStore.systemCollapsed);
const contentCollapsed = ref(authStore.contentCollapsed);
const travelCollapsed = ref(authStore.travelCollapsed);
const userCollapsed = ref(authStore.userCollapsed);
const managementCollapsed = ref(authStore.managementCollapsed);
const systemMonitoring = ref(authStore.systemMonitoring);
const isExpanded = ref(false);

// 气泡提示控制
const showBubble = ref(false);
// 侧边栏控制 - 从Pinia store获取
const isSidebarCollapsed = ref(authStore.isSidebarCollapsed);
const showTooltip = ref(true);
// 鼠标悬停状态
const isHovering = ref(false);
// 在状态变量部分添加
const currentCategory = ref('');

const bubblePosition = ref({});

const handleMouseEnter = (category, event) => {
  if (isSidebarCollapsed.value) {
    isHovering.value = true;
    currentCategory.value = category;

    // 计算气泡菜单位置
    const parentRect = event.currentTarget.getBoundingClientRect();
    bubblePosition.value = {
      top: `${parentRect.top}px`,
      left: `${parentRect.left + parentRect.width + 25}px`
    };
  }
};
const closeBubble = () => {
  isHovering.value = false;
};

const handleClick = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  authStore.isSidebarCollapsed = isSidebarCollapsed.value;
  // 根据侧边栏状态控制气泡显示
  showBubble.value = isSidebarCollapsed.value;
  // 鼠标离开时隐藏气泡
  if (!isSidebarCollapsed.value) {
    isHovering.value = false;
  }
  // 侧边栏宽度控制
  if (showTooltip.value) {
    showTooltip.value = false;
    watchEffect(() => {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        isSidebarCollapsed.value ? '64px' : '180px'
      );
    });
  } else {
    showTooltip.value = true;
  }
};

// 内容区域宽度控制
watchEffect(() => {
  document.documentElement.style.setProperty(
    '--main-width',
    isSidebarCollapsed.value ? '64px' : '180px'
  );
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  authStore.isSidebarCollapsed = isSidebarCollapsed.value;
};
// 设置侧边栏
const openSettings = () => {
  isExpanded.value = !isExpanded.value;
};
// 菜单分类
const toggleCategory = (type) => {
  const category = menuCategories.find(cat => cat.id === type);
  if (category) {
    // 检查collapsed是否是ref对象
    if (category.collapsed && typeof category.collapsed === 'object' && 'value' in category.collapsed) {
      // 如果是ref对象，访问.value属性
      category.collapsed.value = !category.collapsed.value;
      // 更新Pinia store中的状态
      authStore[`${type}Collapsed`] = category.collapsed.value;
    } else {
      // 如果是普通布尔值，直接赋值
      category.collapsed = !category.collapsed;
      // 更新Pinia store中的状态
      authStore[`${type}Collapsed`] = category.collapsed;
    }
  }
};

// 从Pinia store获取上次激活的菜单，默认为1（系统管理）
const activeMenu = ref(authStore.currentComponentPath || 1);
const menuItems = reactive([
  { id: 1, title: '系统首页', icon: homeIcon, component: AdminsystemHome },
  { id: 2, title: '控制台', icon: mh, component: ManagementHomepage },
  { id: 3, title: '用户信息', icon: urIcon, component: User },
  { id: 4, title: '商品管理', icon: gsIcon, component: Goods },
  { id: 5, title: '酒店管理', icon: hmIcon, component: HotelManagement },
  { id: 6, title: '景区管理', icon: smIcon, component: ScenicManagement },
  { id: 7, title: '推荐管理', icon: rmIcon, component: RecommendationManagement },
  { id: 8, title: '美食管理', icon: fdIcon, component: FoodManagement },
  { id: 9, title: '世界旅行', icon: dmIcon, component: DestinationManagement },
  { id: 10, title: '安全管理', icon: safety, component: SafetyTipsManagement },
  { id: 11, title: '攻略管理', icon: trgl, component: TravelGuide },
  { id: 12, title: '订单管理', icon: dd, component: OrderManagement },
  { id: 13, title: '发布管理', icon: fb, component: TravelPostManagement },
  { id: 14, title: '个人中心', icon: cm, component: CenterManagement },
  { id: 15, title: '旅行笔记', icon: tz, component: TravelNoteManagement },
  { id: 16, title: '服务监测', icon: sm, component: SystemMonitoring },
  { id: 17, title: '策略管理', icon: sg, component: StrategygroupManagement },
  { id: 18, title: '操作日志', icon: olIcon, component: OperationLog },
  { id: 19, title: '登录日志', icon: llIcon, component: LoginLogs },
  { id: 20, title: '缓存监控', icon: cmIcon, component: CacheMonitoring },
  { id: 21, title: '在线用户', icon: ouIcon, component: OnlineUsers },
  { id: 22, title: '展示管理', icon: dymIcon, component: DisplayManagement },
  { id: 23, title: '轮播管理', icon: camIcon, component: CarouselManagment },
  { id: 24, title: '世界之旅', icon: dwmIcon, component: DestinationworldManagement },
  { id: 25, title: '收藏管理', icon: comIcon, component: CollectionManagement },
  { id: 26, title: '旅行新闻', icon: trnIcon, component: TravelNewsManagement },
  { id: 27, title: '登录信息', icon: liIcon, component: logininformationManagement },
  { id: 28, title: '目的地管理', icon: indexIcon, component: index },
]);
// 计算属性分类
const systemMenus = computed(() =>
  menuItems.filter(item => [1, 2, 18, 19].includes(item.id))
)

const contentMenus = computed(() =>
  menuItems.filter(item => [4, 10, 13, 15].includes(item.id))
)

const travelMenus = computed(() =>
  menuItems.filter(item => [5, 6, 8, 9, 11, 7, 17, 22, 23, 24, 26, 28].includes(item.id))
)
const userMenus = computed(() =>
  menuItems.filter(item => [3, 12, 25, 27].includes(item.id))
)
const otherMenus = computed(() =>
  menuItems.filter(item => [14].includes(item.id))
)
const Monitoring = computed(() =>
  menuItems.filter(item => [16, 20, 21].includes(item.id))
)

// 菜单分类配置对象
const menuCategories = reactive([
  {
    id: 'system',
    title: '系统管理',
    icon: `
      <svg t="1757646914274" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4895" width="32" height="32">
        <path d="M428 548H296c-99.6 0-180 80.4-180 180s80.4 180 180 180 180-80.4 180-180v-132c0-26.4-21.6-48-48-48z" fill="#3F51B5" p-id="4896"></path><path d="M296 928c-110.4 0-200-89.6-200-200s89.6-200 200-200h132c37.6 0 68 30.4 68 68v132c0 110.4-89.6 200-200 200z m0-360c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160v-132c0-15.6-12.4-28-28-28H296zM728 548h-132c-26.4 0-48 21.6-48 48v132c0 99.6 80.4 180 180 180s180-80.4 180-180-80.4-180-180-180z" fill="#3F51B5" p-id="4897"></path><path d="M728 928c-110.4 0-200-89.6-200-200v-132c0-37.6 30.4-68 68-68h132c110.4 0 200 89.6 200 200s-89.6 200-200 200z m-132-360c-15.6 0-28 12.4-28 28v132c0 88.4 71.6 160 160 160s160-71.6 160-160-71.6-160-160-160h-132z" fill="#3F51B5" p-id="4898"></path><path d="M596 476h132c99.6 0 180-80.4 180-180s-80.4-180-180-180-180 80.4-180 180v132c0 26.4 21.6 48 48 48z" fill="#3F51B5" p-id="4899"></path><path d="M728 496h-132c-37.6 0-68-30.4-68-68V296c0-110.4 89.6-200 200-200s200 89.6 200 200-89.6 200-200 200z m0-360c-88.4 0-160 71.6-160 160v132c0 15.6 12.4 28 28 28h132c88.4 0 160-71.6 160-160s-71.6-160-160-160z" fill="#3F51B5" p-id="4900"></path><path d="M296 116c-99.6 0-180 80.4-180 180s80.4 180 180 180h132c26.4 0 48-21.6 48-48V296c0-99.6-80.4-180-180-180z" fill="#3F51B5" p-id="4901"></path><path d="M428 496H296c-110.4 0-200-89.6-200-200s89.6-200 200-200 200 89.6 200 200v132c0 37.6-30.4 68-68 68zM296 136c-88.4 0-160 71.6-160 160s71.6 160 160 160h132c15.6 0 28-12.4 28-28V296c0-88.4-71.6-160-160-160z" fill="#3F51B5" p-id="4902"></path>
      </svg>`,
    menus: systemMenus,
    collapsed: systemCollapsed
  },
  {
    id: 'user',
    title: '用户管理',
    icon: `
      <svg t="1757647325059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16521" width="32" height="32">
        <path d="M512 0L955.960133 256v512L512 1024 68.039867 768V256z" fill="#3EBDD3" p-id="16522"></path><path d="M514.864478 0L955.960133 255.523721v511.047442l-441.095655-255.523721z" fill="#1392AD" p-id="16523"></path><path d="M513.024 509.142326L955.960133 765.536957 510.969196 1024 68.039867 766.571163z" fill="#17A3BA" p-id="16524"></path><path d="M399.081037 532.279282c4.017754-0.105462 9.995056 1.394817 13.471893 3.333954 0 0 9.23301 5.259482 17.59511 8.804359 24.548784 10.416904 52.574405 16.322764 82.232983 16.322764 29.869502 0 57.901927-6.014724 82.559575-16.540492 7.504797-3.119628 15.638963-7.664691 17.054193-8.467561l0.217727-0.122472c3.476837-1.823468 9.559601-3.330551 13.468492-3.330552l11.294618 0.108864c10.927203 1.592133 22.034711 5.147216 32.761196 10.24C605.323482 559.631309 557.92691 617.155615 557.92691 685.501661c0 32.172651 10.501953 61.950299 28.338605 86.226924-22.398724 2.446033-47.20606 3.9259-74.428811 3.9259-156.097063 0-232.900465-48.760771-232.900465-48.760771-7.712319-3.973528-13.686219-13.318804-13.580757-20.728345 2.068412-56.711229 16.516678-85.600957 16.516677-85.600957 13.577355-42.746047 60.939907-82.267003 106.023123-88.176266zM512.054432 231.335548c76.041355 0 137.634445 60.899083 137.634445 136.079734 0 75.184053-61.59309 136.079734-137.634445 136.079735S374.423389 442.599336 374.423389 367.415282c0-75.180651 61.589688-136.079734 137.631043-136.079734z" fill="#FFFFFF" p-id="16525"></path><path d="M697.408638 571.534884l94.279442 54.431893v108.863788L697.408638 789.262458l-94.279442-54.431893v-108.863788L697.408638 571.534884z m0 17.009966l-79.548811 45.926911v91.85382L697.408638 772.252492l79.548811-45.926911v-91.85382L697.408638 588.54485z" fill="#FFFFFF" p-id="16526"></path>
      </svg>`,
    menus: userMenus,
    collapsed: userCollapsed
  },
  {
    id: 'content',
    title: '内容管理',
    icon: `
      <svg t="1757647174122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6788" width="32" height="32">
        <path d="M842.606019 706.795948a109.395447 109.395447 0 0 1 84.107028 0l63.425811 27.975953a54.569746 54.569746 0 0 1 0 100.692955l-399.725947 171.567076a191.864359 191.864359 0 0 1-156.977604 0l-399.802734-171.567076c-44.843431-20.502048-44.843431-83.902264 0-100.692955l63.502598-27.975953a109.395447 109.395447 0 0 1 84.107029 0l222.323082 95.087526a267.140918 267.140918 0 0 0 138.216054 20.476452c29.870025-1.79169 57.94836-11.159667 84.132624-22.344929zM97.135171 432.565058a109.395447 109.395447 0 0 1 84.107029 0l222.323082 95.164313a267.140918 267.140918 0 0 0 138.164863 20.476452c29.870025-1.79169 57.94836-11.159667 84.107029-22.344928l216.692058-93.21905a109.395447 109.395447 0 0 1 84.107028 0l63.451407 27.975953a54.569746 54.569746 0 0 1 0 100.692955l-399.674756 171.490289a191.864359 191.864359 0 0 1-156.977604 0l-399.802734-171.567076a54.569746 54.569746 0 0 1 0-100.692955zM433.512094 16.790691a191.864359 191.864359 0 0 1 156.952008 0L990.138858 188.127407a54.569746 54.569746 0 0 1 0 100.769742l-399.725947 171.643862a191.864359 191.864359 0 0 1-156.977604 0l-399.802734-171.643862c-44.843431-18.710358-44.843431-82.110574 0-102.535836z" fill="#95DF64" p-id="6789"></path>
      </svg>`,
    menus: contentMenus,
    collapsed: contentCollapsed
  },
  {
    id: 'travel',
    title: '旅行管理',
    icon: `
      <svg t="1757647270457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14196" width="32" height="32">
        <path d="M882.24 18.688a67.008 67.008 0 0 0-49.28-6.272c-6.144 2.112-10.24 4.16-14.336 6.272-59.52-20.928-123.136-25.088-184.64-8.32a318.912 318.912 0 0 0-188.8 146.368l-8.256 12.544c-2.048 2.112-2.048 4.224-4.096 6.272a44.032 44.032 0 0 0 14.4 56.512c18.432 12.544 43.072 6.272 55.36-12.544l2.112-4.224c4.096-6.272 10.24-10.432 16.384-10.432a33.152 33.152 0 0 1 20.48 2.112c6.208 4.16 12.352 27.2 4.16 48.064a44.16 44.16 0 0 0 18.432 50.24c16.448 10.432 39.04 6.272 51.328-8.32 14.336-16.768 36.928-23.04 43.072-18.88 4.096 2.112 10.24 20.928 6.144 39.68l-215.424 444.8-116.992-271.104v-2.112c-4.096-14.656-2.048-33.472 2.048-37.632 4.096-2.112 22.592 4.16 32.832 16.704a40.192 40.192 0 0 0 51.328 8.32 44.16 44.16 0 0 0 18.432-50.112c-4.096-14.72-2.048-33.472 2.048-37.696 4.16-2.048 20.544 4.224 30.784 16.768 14.4 16.704 36.992 18.816 55.424 6.272a42.944 42.944 0 0 0 12.352-54.4l-10.24-16.768a273.152 273.152 0 0 0-172.416-133.824 281.408 281.408 0 0 0-166.208 6.272c-4.096-2.112-8.192-4.224-12.352-4.224a61.824 61.824 0 0 0-77.952 58.624C-2.176 357.568-30.912 508.16 36.8 629.504l6.144 12.544c2.048 2.112 2.048 4.16 4.096 6.272 8.256 12.544 20.544 20.928 34.88 20.928 6.208 0 14.4-2.112 20.544-4.16 20.48-10.496 26.688-35.584 16.448-56.512l-2.048-4.16c-4.16-10.496 0-23.04 8.192-27.2 4.096-2.112 22.528 4.16 32.832 16.704a40.192 40.192 0 0 0 51.264 8.384 44.16 44.16 0 0 0 18.496-50.176c-4.096-14.72-2.048-33.472 2.048-37.696 4.096-2.048 16.448 2.112 28.736 10.496l106.688 254.336c-102.592 29.312-192.896 92.032-262.656 177.792a42.752 42.752 0 0 0-6.144 43.904c6.144 14.72 20.48 23.04 36.928 23.04h757.184c16.448 0 30.784-8.32 36.992-23.04a42.752 42.752 0 0 0-6.208-43.904c-94.4-117.12-229.76-188.224-375.488-198.72l184.64-390.336s2.112 0 2.112-2.048c14.336-16.768 36.928-23.04 43.072-18.816 6.144 4.16 12.288 27.136 4.096 48.064a44.16 44.16 0 0 0 18.496 50.24c16.384 10.432 38.976 6.272 51.264-8.384 14.4-16.768 36.928-23.04 43.072-18.816 6.208 4.16 10.24 27.2 4.16 46.016a43.136 43.136 0 0 0 22.528 52.288c6.208 2.112 10.24 4.16 16.448 4.16 14.336 0 28.736-8.32 34.88-20.928l10.24-18.816c78.016-138.048 47.232-307.456-65.664-405.76 0-23.04-12.288-43.968-32.832-56.512z" p-id="14197" fill="#1296db"></path>
      </svg>`,
    menus: travelMenus,
    collapsed: travelCollapsed
  },
  {
    id: 'other',
    title: '个人中心',
    icon: `
      <svg t="1757647361981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19369" width="32" height="32">
        <path d="M514.4576 512.8704m-432.3328 0a432.3328 432.3328 0 1 0 864.6656 0 432.3328 432.3328 0 1 0-864.6656 0Z" fill="#4AEDCD" p-id="19370"></path><path d="M289.4848 418.7136c-85.0432 0-160.4096 41.3696-207.104 105.0624 4.5568 182.7328 122.368 337.3056 285.952 396.032 103.2192-33.28 177.92-130.048 177.92-244.3776-0.0512-141.7216-114.9952-256.7168-256.768-256.7168z" fill="#83FFE1" p-id="19371"></path><path d="M523.3664 352.8704m-140.544 0a140.544 140.544 0 1 0 281.088 0 140.544 140.544 0 1 0-281.088 0Z" fill="#FFFFFF" p-id="19372"></path><path d="M243.3536 732.3648c65.28 73.2672 163.1744 119.9104 272.64 119.9104 118.0672 0 222.6176-54.2208 287.3856-137.6256-32.4608-116.1216-144.5376-201.7792-277.9136-201.7792-139.9808 0-256.6144 94.464-282.112 219.4944z" fill="#D7FFF7" p-id="19373"></path>
      </svg>`,
    menus: otherMenus,
    collapsed: managementCollapsed
  },
  {
    id: 'monitoring',
    title: '服务监测',
    icon: `
      <svg t="1757647434618" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29977" width="32" height="32">
        <path d="M73.152 0h877.696A73.152 73.152 0 0 1 1024 73.152v658.272a73.152 73.152 0 0 1-73.152 73.152H73.152A73.152 73.152 0 0 1 0 731.424V73.152A73.152 73.152 0 0 1 73.152 0z m564.704 469.76l-127.04-326.816-138.816 261.12-77.44-79.712-131.04 81.664 36.96 21.312L284.48 375.04l101.344 104.32 117.312-220.704 129.76 333.824 110.624-232.928 45.12 96 49.376-8.32-94.24-200.416-105.92 222.976z m-36.48 299.84v-29.728H428.48v29.76h172.96zM219.424 950.848h585.152V1024H219.424v-73.152z" fill="#5AD8A6" p-id="29978"></path>
      </svg>`,
    menus: Monitoring,
    collapsed: systemMonitoring
  }
]);

// 使用shallowRef优化性能
const activeComponent = shallowRef(null);
const showContent = ref(true);
// 初始化时设置组件和侧边栏状态
onMounted(() => {
  const savedMenuId = Number(localStorage.getItem('activeMenu')) || 1;
  const menuItem = menuItems.find(item => item.id === savedMenuId) || menuItems[1];
  activeComponent.value = menuItem.component;
  activeMenu.value = menuItem.id;
  updateBreadcrumb(menuItem);

  // 初始化时设置首页面包屑的active样式
  const breadcrumbWrappers = document.querySelectorAll('.breadcrumb-main.fixed-element .breadcrumb-wrapper');
  breadcrumbWrappers.forEach(wrapper => {
    wrapper.classList.remove('active');
    if (wrapper.querySelector('.breadcrumb-item').textContent === menuItem.title) {
      wrapper.classList.add('active');
    }
  });

  // 恢复侧边栏折叠状态
  document.documentElement.style.setProperty(
    '--sidebar-width',
    isSidebarCollapsed.value ? '64px' : '180px'
  );

  // 恢复内容区域宽度
  document.documentElement.style.setProperty(
    '--main-width',
    isSidebarCollapsed.value ? '64px' : '180px'
  );
});


const isDropdownVisible = ref(false)
const isPersonalCenterVisible = ref(false)
const issystemsetting = ref(false)
let dropdownTimer = null

const showDropdown = () => {
  clearTimeout(dropdownTimer)
  isDropdownVisible.value = true
}

const hideDropdown = () => {
  // 添加一点延迟避免鼠标移动时意外关闭
  dropdownTimer = setTimeout(() => {
    isDropdownVisible.value = false
  }, 200)
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '确认操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 获取当前用户ID
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.userId;
      
      // 调用后端退出API
      if (userId) {
        await userLogout(userId);
      }
      
      // 清除所有登录相关存储
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberedUsername');
      // 关闭下拉菜单
      isDropdownVisible.value = false;
      router.push('/AdminLogin');
      
      ElMessage.success('退出登录成功');
    } catch (error) {
      console.error('退出登录失败:', error);
      // 即使API调用失败，也执行本地退出逻辑
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberedUsername');
      isDropdownVisible.value = false;
      router.push('/AdminLogin');
      ElMessage.success('已退出登录');
    }
  }).catch(() => {
    // 用户点击"取消"，不执行任何操作
    console.log('退出操作已取消');
  });
};

const showHelp = () => {
  // 显示帮助对话框
  console.log('显示帮助信息')
}
// 默认头像
const defaultAvatar = new URL('@/assets/defaultimage/mrtx.png', import.meta.url).href
// 用户信息
const userInfo = ref({
  image: '',
  username: '',
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
      ElMessage.error('请先登录');
      router.push('/AdminLogin');
      return;
    }
    // 先从本地存储获取，优化用户体验
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    userInfo.value = { ...localUser };

    // 检查是否有用户头像
    if (!localUser.image) {
      userInfo.value.image = defaultAvatar;
    } else {
      userInfo.value.image = localUser.image;
    }

    // 设置 hasInput 的值
    userInfo.value.hasInput = !!localUser.image;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取用户信息失败');
  } finally {
    loading.value = false;
  }
};
// 放大全屏
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};
// 面包屑导航相关
const breadcrumbList = ref(authStore.breadcrumbList || [{ title: '系统首页', id: 1 }]);
// 根据当前激活的菜单更新面包屑
const updateBreadcrumb = (menuItem) => {
  // 检查是否已存在该菜单项
  const exists = breadcrumbList.value.some(item => item.id === menuItem.id);
  if (!exists) {
    // 添加新菜单项到面包屑
    breadcrumbList.value.push({
      title: menuItem.title,
      id: menuItem.id
    });
  }
};

// 修改changeMenu函数，添加面包屑更新
const changeMenu = (item) => {
  activeMenu.value = item.id;
  authStore.currentComponentPath = item.id;
  authStore.breadcrumbList = breadcrumbList.value;
  updateBreadcrumb(item);

  // 更新面包屑导航的active样式
  const breadcrumbWrappers = document.querySelectorAll('.breadcrumb-main.fixed-element .breadcrumb-wrapper');
  breadcrumbWrappers.forEach(wrapper => {
    wrapper.classList.remove('active');
    if (wrapper.querySelector('.breadcrumb-item').textContent === item.title) {
      wrapper.classList.add('active');
    }
  });

  if (item.path) {
    router.push(item.path);
    activeComponent.value = null;
    return;
  }

  activeComponent.value = item.component;
};
// 面包屑导航点击
const navigateTo = (item) => {
  const menuItem = menuItems.find(m => m.id === item.id);
  if (menuItem) {
    // 获取所有面包屑元素
    const breadcrumbWrappers = document.querySelectorAll('.breadcrumb-main.fixed-element .breadcrumb-wrapper');
    // 为每个面包屑元素添加点击事件
    breadcrumbWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', function () {
        // 移除所有元素的active类
        breadcrumbWrappers.forEach(item => {
          item.classList.remove('active');
        });
        // 为当前元素添加active类
        this.classList.add('active');
      });
    });
    changeMenu(menuItem);
    // 保存面包屑列表到Pinia
    authStore.breadcrumbList = breadcrumbList.value;
  }
};

// 关闭面包屑菜单项
const closeBreadcrumb = (item) => {
  if (!item) return;
  if (item.id === 1) return;
  breadcrumbList.value = breadcrumbList.value.filter(b => b.id !== item.id);
  // 保存面包屑列表到Pinia
  authStore.breadcrumbList = breadcrumbList.value;
};
// 面包屑菜单导航
const switchMenu = (menuItem) => {
  activeMenu.value = menuItem.id;
  authStore.currentComponentPath = menuItem.id;
};
// 获取当前菜单的所有相关分类
const currentCategories = computed(() => {
  const menuId = activeMenu.value;
  const categories = [];

  // 添加主分类
  if ([1, 2, 18, 19].includes(menuId)) categories.push('系统管理');
  if ([4, 10, 12, 13, 15].includes(menuId)) categories.push('内容管理');
  if ([5, 6, 7, 8, 9, 11, 22, 23, 24, 26, 28].includes(menuId)) categories.push('旅行管理');
  if ([3, 12, 25, 27].includes(menuId)) categories.push('用户管理');
  if ([14].includes(menuId)) categories.push('个人中心');
  if ([16, 20, 21].includes(menuId)) categories.push('服务监测');

  // 添加子分类（具体菜单名称）
  const menuItem = menuItems.find(item => item.id === menuId);
  if (menuItem) {
    categories.push(menuItem.title);
  }
  return categories.length > 0 ? categories : ['未知分类'];
});
onMounted(() => {
  fetchUserInfo();
  const savedMenuId = authStore.currentComponentPath || 1;
  const menuItem = menuItems.find(item => item.id === savedMenuId) || menuItems[0];
  activeComponent.value = menuItem.component;
  activeMenu.value = menuItem.id;
  // 如果Pinia中有保存的面包屑列表，则使用保存的列表
  if (authStore.breadcrumbList && authStore.breadcrumbList.length > 0) {
    breadcrumbList.value = authStore.breadcrumbList;
  } else {
    updateBreadcrumb(menuItem);
  }

  // 在下一个tick中更新面包屑导航的active样式
  nextTick(() => {
    const breadcrumbWrappers = document.querySelectorAll('.breadcrumb-main.fixed-element .breadcrumb-wrapper');
    breadcrumbWrappers.forEach(wrapper => {
      wrapper.classList.remove('active');
      const breadcrumbItem = wrapper.querySelector('.breadcrumb-item');
      if (breadcrumbItem && breadcrumbItem.textContent === menuItem.title) {
        wrapper.classList.add('active');
      }
    });
  });
});

//svg图标
const homeIcon = `
  <svg t="1749169948314" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33067" width="256" height="256"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FDEBED" p-id="33068"></path><path d="M739.84 500.48c-5.12 14.08-19.2 24.32-35.84 24.32h-12.8v153.6c0 28.16-23.04 51.2-51.2 51.2h-89.6v-102.4c0-7.68-5.12-12.8-12.8-12.8h-51.2c-7.68 0-12.8 5.12-12.8 12.8v102.4h-89.6c-28.16 0-51.2-23.04-51.2-51.2V524.8h-12.8c-15.36 0-29.44-10.24-35.84-24.32-6.4-15.36-2.56-32 10.24-42.24l192-153.6c14.08-12.8 37.12-12.8 51.2 0l192 153.6c12.8 10.24 16.64 26.88 10.24 42.24z" fill="#EC3A4E" p-id="33069"></path></svg>
`;

const urIcon = `
  <svg t="1749169904861" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30942" width="256" height="256"><path d="M512 62C760.53072588 62 962 263.46927412 962 512S760.53072588 962 512 962 62 760.53072588 62 512 263.46927412 62 512 62z" fill="#FF8E51" p-id="30943"></path><path d="M665.90502822 381.06257012c0 84.95195537-71.51731875 154.05586612-159.41564296 154.05586523S347.08379873 465.98435791 347.08379873 381.06257012s71.51731875-154.06592168 159.40558653-154.06592168 159.41564209 69.10391074 159.41564297 154.06592167z m86.09832334 353.79553008v10.58882694c0 51.55642441-85.76648086 51.55642441-185.09832333 51.55642442H457.0648042c-103.38435791 0-185.02793262 0-185.02793262-51.55642442v-10.58882695c0-98.54748633 83.02122862-178.75307286 185.02793262-178.75307196H566.90502822c102.07709473 0 185.09832422 80.19553096 185.09832334 178.75307196z" fill="#FFFFFF" p-id="30944"></path></svg>
`;

const gsIcon = `
  <svg t="1749169695302" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21131" width="256" height="256"><path d="M756.992 953.4976H270.7456c-107.264 0-194.2016-86.9376-194.2016-194.2016V272.9984c0-107.264 86.9376-194.2016 194.2016-194.2016h486.2464c107.264 0 194.2016 86.9376 194.2016 194.2016v486.2464c0.0512 107.264-86.9376 194.2528-194.2016 194.2528z" fill="#F6648C" p-id="21132"></path><path d="M734.72 809.216H293.0688c-24.064 0-46.5408-9.7792-63.3344-27.4944-17.2544-18.2272-26.368-43.264-24.9344-68.6592l22.6304-413.2352c2.6112-48.1792 41.4208-85.8624 88.2688-85.8624h396.3904c46.848 0 85.6576 37.7344 88.2688 85.8624l11.52 210.3296a25.60512 25.60512 0 0 1-24.1664 26.9824c-14.0288 0.9216-26.2144-10.0352-26.9824-24.1664l-11.52-210.3296c-1.1264-20.992-17.4592-37.4784-37.1712-37.4784H315.6992c-19.6608 0-35.9936 16.4864-37.1712 37.4784l-22.6304 413.2352c-0.6144 11.4176 3.3792 22.5792 11.008 30.6176 7.0144 7.424 16.2816 11.4688 26.112 11.4688h441.6512c9.8304 0 19.1488-4.096 26.112-11.4688 7.6288-8.0384 11.6224-19.2 11.008-30.6688l-3.7888-70.144a25.60512 25.60512 0 0 1 24.1664-26.9824 25.53856 25.53856 0 0 1 26.9824 24.1664l3.84 70.1952c1.3824 25.3952-7.7312 50.432-24.9856 68.6592-16.7424 17.7152-39.2704 27.4944-63.2832 27.4944z" fill="#FFFFFF" p-id="21133"></path><path d="M513.8944 507.6992c-79.3088 0-143.8208-66.7136-143.8208-148.6848 0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 53.76 41.5744 97.4848 92.6208 97.4848 51.0976 0 92.6208-43.7248 92.6208-97.4848 0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 81.9712-64.512 148.6848-143.8208 148.6848z" fill="#FFFFFF" p-id="21134"></path></svg>
`;

const hmIcon = `
  <svg t="1749169650431" class="icon" viewBox="0 0 1153 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18963" width="256" height="256"><path d="M1152.126909 649.975015v274.257915c0 54.079979-43.994977 98.074955-98.074956 98.074956H305.731245c-7.24225 0-14.822923-1.015269-23.689603-3.24886l-1.62443-0.406108H99.76707C45.687091 1018.652918 1.692114 974.657942 1.692114 920.577963V512.169211c0-54.079979 43.994977-98.074955 98.068187-98.074955h107.88922V99.76707c0-54.079979 43.994977-98.074955 98.074955-98.074956h555.690396c54.079979 0 98.074955 43.994977 98.074955 98.074956v452.065305h94.555358c54.086747 0 98.081724 43.994977 98.081724 98.14264z m-30.864169 274.257915V649.975015c0-37.091149-30.119638-67.278472-67.217555-67.278472H959.489827v341.536387c0 16.176614-4.264128 32.014806-12.657016 47.108467l-11.23564 20.10232h118.448014c37.097918 0 67.217556-30.119638 67.217555-67.210787z m-192.637081 0V99.76707c0-37.091149-30.187322-67.210787-67.210787-67.210787h-555.690396c-1.286007 0-2.572014 0.135369-3.858021 0.203053-35.33135 2.030537-63.352766 31.202591-63.352766 67.007734v824.46586c0 35.805142 28.028184 64.977196 63.352766 67.007734 1.286007 0.067685 2.572014 0.203054 3.858021 0.203053h555.690396c37.023465 0 67.210787-30.119638 67.210787-67.210787zM228.50314 987.78875l-9.949633-19.628528c-7.24225-14.349131-10.897217-29.104369-10.897218-43.927292v-479.206821H99.760301c-37.084381 0-67.210787 30.119638-67.210787 67.143102v408.408752c0 37.091149 30.119638 67.210787 67.210787 67.210787H228.50314z" fill="#1A1A1A" p-id="18964"></path><path d="M1121.26274 649.975015v274.257915c0 37.091149-30.119638 67.210787-67.217555 67.210787h-52.793972V582.696543h52.793972c37.097918 0 67.217556 30.187322 67.217555 67.278472z" fill="#97CB81" p-id="18965"></path><path d="M1001.257981 582.696543v408.747174h-65.654042l11.235641-20.10232c8.392888-15.093661 12.657016-30.931853 12.657016-47.108467V582.696543h41.761385zM928.625659 99.76707v824.46586c0 37.091149-30.187322 67.210787-67.210787 67.210787h-555.690396c-1.286007 0-2.572014-0.135369-3.858021-0.203053V32.759336c1.286007-0.067685 2.572014-0.203054 3.858021-0.203053h555.690396c37.023465 0 67.210787 30.119638 67.210787 67.210787z m-76.070698 608.484368V512.033842a15.432084 15.432084 0 0 0-15.432084-15.432084h-196.28528c-8.460572 0-15.432084 6.903827-15.432084 15.432084v196.217596c0 8.528257 6.971512 15.499769 15.432084 15.499768h196.28528c8.521489 0 15.432084-6.971512 15.432084-15.499768z m0-353.24582v-196.28528a15.432084 15.432084 0 0 0-15.432084-15.432084h-196.28528c-8.460572 0-15.432084 6.903827-15.432084 15.432084v196.28528c0 8.460572 6.971512 15.432084 15.432084 15.432084h196.28528c8.521489 0 15.432084-6.971512 15.432084-15.432084z m-309.860004 353.24582V512.033842c0-8.528257-6.971512-15.432084-15.432084-15.432084h-196.28528a15.418547 15.418547 0 0 0-15.425316 15.432084v196.217596c0 8.528257 6.903827 15.499769 15.425316 15.499768h196.28528c8.453804 0 15.432084-6.971512 15.432084-15.499768z m0-353.24582v-196.28528c0-8.528257-6.971512-15.432084-15.432084-15.432084h-196.28528a15.418547 15.418547 0 0 0-15.425316 15.432084v196.28528c0 8.460572 6.903827 15.432084 15.425316 15.432084h196.28528c8.453804 0 15.432084-6.971512 15.432084-15.432084z" fill="#67BA59" p-id="18966"></path><path d="M852.554961 512.033842v196.217596c0 8.528257-6.910596 15.499769-15.432084 15.499768h-196.28528c-8.460572 0-15.432084-6.971512-15.432084-15.499768V512.033842c0-8.528257 6.971512-15.432084 15.432084-15.432084h196.28528a15.432084 15.432084 0 0 1 15.432084 15.432084z m-30.870937 180.785512V527.465926H656.269681v165.353428h165.414343zM852.554961 158.720338v196.28528c0 8.460572-6.910596 15.432084-15.432084 15.432084h-196.28528c-8.460572 0-15.432084-6.971512-15.432084-15.432084v-196.28528c0-8.528257 6.971512-15.432084 15.432084-15.432084h196.28528a15.432084 15.432084 0 0 1 15.432084 15.432084z m-30.870937 180.785512V174.152422H656.269681v165.353428h165.414343z" fill="#1A1A1A" p-id="18967"></path><path d="M798.204244 527.465926h23.486549v165.353428h-23.486549zM798.204244 174.152422h23.486549v165.353428h-23.486549z" fill="#B4BFB4" p-id="18968"></path><path d="M656.269681 527.465926h141.934563v165.353428H656.269681zM656.269681 174.152422h141.934563v165.353428H656.269681z" fill="#E5E5E7" p-id="18969"></path><path d="M542.694957 512.033842v196.217596c0 8.528257-6.971512 15.499769-15.432084 15.499768h-196.28528a15.479463 15.479463 0 0 1-15.425316-15.499768V512.033842c0-8.528257 6.903827-15.432084 15.425316-15.432084h196.28528c8.453804 0 15.432084 6.903827 15.432084 15.432084z m-30.938621 180.785512V527.465926H346.409677v165.353428H511.756336zM542.694957 158.720338v196.28528c0 8.460572-6.971512 15.432084-15.432084 15.432084h-196.28528a15.465926 15.465926 0 0 1-15.425316-15.432084v-196.28528c0-8.528257 6.903827-15.432084 15.425316-15.432084h196.28528c8.453804 0 15.432084 6.903827 15.432084 15.432084z m-30.938621 180.785512V174.152422H346.409677v165.353428H511.756336z" fill="#1A1A1A" p-id="18970"></path><path d="M483.47095 527.465926h28.292154v165.353428h-28.292154zM483.47095 174.152422h28.292154v165.353428h-28.292154z" fill="#B4BFB4" p-id="18971"></path><path d="M346.409677 527.465926h137.061273v165.353428H346.409677zM346.409677 174.152422h137.061273v165.353428H346.409677z" fill="#E5E5E7" p-id="18972"></path><path d="M301.873224 32.759336v958.481328c-35.33135-2.030537-63.352766-31.202591-63.352767-67.007734V99.76707c-0.006768-35.805142 28.021416-64.977196 63.352767-67.007734zM218.553507 968.160222l9.949633 19.628528h-125.216472V445.026109h104.369621v479.206821c0 14.822923 3.654967 29.578161 10.897218 43.927292z" fill="#97CB81" p-id="18973"></path><path d="M103.286668 445.026109v542.762641h-3.526367c-37.084381 0-67.210787-30.119638-67.210787-67.210787V512.169211c0-37.023465 30.119638-67.143103 67.210787-67.143102h3.526367z" fill="#BEDDA6" p-id="18974"></path></svg>
`;

const rmIcon = `
  <svg t="1749169451126" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12989" width="256" height="256"><path d="M775.7312 117.9648H253.6448c-72.448 0-131.1744 58.7264-131.1744 131.1744v522.0864c0 72.448 58.7264 131.1744 131.1744 131.1744h522.0864c72.448 0 131.1744-58.7264 131.1744-131.1744V249.1392c-0.0512-72.448-58.7264-131.1744-131.1744-131.1744z m-48.64 371.5072l-72.0384 70.2464a30.88896 30.88896 0 0 0-8.9088 27.4432l16.9984 99.1744c4.352 25.2928-22.2208 44.6464-44.9536 32.6656l-89.088-46.848a30.8736 30.8736 0 0 0-28.8256 0l-89.088 46.848c-22.7328 11.9296-49.3056-7.3728-44.9536-32.6656l16.9984-99.1744c1.7408-10.0352-1.5872-20.3264-8.9088-27.4432L302.2336 489.472c-18.3808-17.92-8.2432-49.152 17.152-52.8384l99.584-14.4896a31.0016 31.0016 0 0 0 23.3472-16.9472l44.544-90.2656c11.3664-23.04 44.2368-23.04 55.6032 0l44.544 90.2656a31.0016 31.0016 0 0 0 23.3472 16.9472l99.584 14.4896c25.3952 3.6864 35.584 34.9184 17.152 52.8384z" fill="#FC7032" p-id="12990"></path><path d="M906.8544 249.1392c0-72.448-58.7264-131.1744-131.1744-131.1744H253.6448c-72.448 0-131.1744 58.7264-131.1744 131.1744v522.0864c0 72.448 58.7264 131.1744 131.1744 131.1744h204.9536c225.2288-65.6384 399.3088-251.2896 448.3072-483.1232V249.1392zM727.0912 489.472l-72.0384 70.2464a30.88896 30.88896 0 0 0-8.9088 27.4432l16.9984 99.1744c4.352 25.2928-22.2208 44.6464-44.9536 32.6656l-89.088-46.848a30.8736 30.8736 0 0 0-28.8256 0l-89.088 46.848c-22.7328 11.9296-49.3056-7.3728-44.9536-32.6656l16.9984-99.1744c1.7408-10.0352-1.5872-20.3264-8.9088-27.4432L302.2336 489.472c-18.3808-17.92-8.2432-49.152 17.152-52.8384l99.584-14.4896a31.0016 31.0016 0 0 0 23.3472-16.9472l44.544-90.2656c11.3664-23.04 44.2368-23.04 55.6032 0l44.544 90.2656a31.0016 31.0016 0 0 0 23.3472 16.9472l99.584 14.4896c25.3952 3.6864 35.584 34.9184 17.152 52.8384z" fill="#FF7E3E" p-id="12991"></path><path d="M253.6448 117.9648c-72.448 0-131.1744 58.7264-131.1744 131.1744v450.4576c89.7536-2.6624 174.848-23.7568 251.6992-59.648l9.0624-52.7872c1.7408-10.0352-1.5872-20.3264-8.9088-27.4432L302.2336 489.472c-18.3808-17.92-8.2432-49.152 17.152-52.8384l99.584-14.4896a31.0016 31.0016 0 0 0 23.3472-16.9472l44.544-90.2656c11.3664-23.04 44.2368-23.04 55.6032 0l44.544 90.2656a31.0016 31.0016 0 0 0 23.3472 16.9472l19.456 2.816a639.02208 639.02208 0 0 0 112.5376-306.9952H253.6448z" fill="#FF9552" p-id="12992"></path><path d="M122.4704 249.1392v197.632c172.1344-50.4832 314.2144-171.0592 393.3184-328.7552h-262.144c-72.448-0.0512-131.1744 58.6752-131.1744 131.1232z" fill="#FFA56A" p-id="12993"></path></svg>
`;
const smIcon = `
  <svg t="1749169528144" class="icon" viewBox="0 0 1710 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14941" width="256" height="256"><path d="M1108.581875 212.98250000000002c0 98.82375-80.0540625 178.8778125-178.63500000000002 178.8778125-98.82375 0-178.918125-80.0540625-178.918125-178.8778125 0-98.62125 80.094375-178.63500000000002 178.918125-178.63500000000002 98.5809375 0 178.63500000000002 80.01375 178.63500000000002 178.63500000000002z" fill="#7cba59" p-id="14942"></path><path d="M162.65902062499998 833.3888075C80.42069562499995 856.4462825 32 882.052214375 32 882.052214375l0 63.428279999999994 328.8723946875 0c-41.058484687500005-44.8609453125-97.73132906250001-125.19803906250002-133.53109125-249.10162406249998L162.65902062499998 833.3888075z" fill="#7cba59" p-id="14943"></path><path d="M1634.858519375 839.132950625c-53.5580625-43.6069425-119.5348003125-64.641830625-185.511538125-73.01533500000001l-50.726443125-96.0728090625-12.4591265625-23.542894687500002-207.71952562500002-393.9187425-213.82773375000002 452.856883125-54.2457421875-102.7877925-17.0706215625-32.1591084375L609.164984375 32 342.2241565625 596.908116875c41.5439053125 241.739413125 173.13331499999998 337.4481571875 174.9131896875 338.6212565625l12.095060625 9.95112 1105.6261115625 0L1634.858519375 839.132950625z" fill="#7cba59" p-id="14944"></path><path d="M308.2851725 596.908116875c-13.996290937500001-81.5506453125-17.717848125-179.6460403125-2.791168125-296.5110271875L238.10145781249997 291.6999725c-21.641664374999998 168.9263371875-6.431821875000001 301.6483940625 23.300184375 404.678896875 35.6379553125 123.8631328125 92.351251875 204.24067875 133.4097365625 249.10162406249998 26.576773125 28.922971874999998 46.519465312499996 43.6878459375 49.391536875 45.669979687499996l102.7877925 0.8899378124999999-63.792345000000005-56.5110375C481.4184875 934.3562740625 349.70772312500003 838.6879821875 308.2851725 596.908116875" fill="#7cba59" p-id="14945"></path><path d="M279.038586875 328.915544375C258.7722809375 291.05274499999996 228.91892 270.46282437499997 194.73722562499995 255.37433750000002c-34.3839525-15.412101562500002-72.8130759375-23.1788296875-113.7906571875-36.851506875 40.97758125-13.1872575 86.0003334375-11.6096409375 127.4633353125 5.703690937499999 20.2663059375 9.344344687500001 39.7640296875 22.6934090625 53.1535453125 41.4225496875C274.9529646875 283.973695625 283.2051134375 307.27387999999996 279.038586875 328.915544375" fill="#7cba59" p-id="14946"></path><path d="M289.596483125 314.7574465625C248.41664375 302.25786781249997 212.81913968749996 308.8514965625 177.86886312500002 322.281464375 142.71632750000003 335.7923346875 110.112250625 357.4339990625 71.56177156250004 376.76991593749995c19.5786271875-38.3886721875 52.384963125-69.0510675 94.0906753125-85.9598821875C186.525528125 283.00285437499997 209.7043578125 278.55316625 232.55957374999997 282.4365303125 255.01027156249995 285.8344746875 277.17780874999994 296.43282218749994 289.596483125 314.7574465625" fill="#7cba59" p-id="14947"></path><path d="M262.2511278125 317.710420625c20.347209375000002-37.862799375 50.2410225-58.5336234375 84.3822646875-73.62211031250001 34.4244046875-15.412101562500002 72.853528125-23.09792625 113.7502059375-36.6897-40.8966778125-13.349064375-86.0003334375-11.771446875-127.38243187500001 5.622787499999999C312.734860625 222.44664593750002 293.15623343749996 235.79571031249998 279.80717000000004 254.4439484375 266.417654375 272.6876684375 258.20595687499997 296.06875625 262.2511278125 317.710420625" fill="#7cba59" p-id="14948"></path><path d="M242.348886875 314.7574465625c41.0989359375-12.4995778125 76.7773434375-5.9059490625 111.6062653125 7.5240178125 35.1120834375 13.51087125 67.918419375 35.152535625 106.4688984375 54.488452499999994-19.5381759375-38.3886721875-52.54677-69.0510675-94.0906753125-85.9598821875-20.953985625-7.807180312500001-44.092363125000006-12.2568675-66.9880303125-8.3735034375C276.9755496875 285.8344746875 254.7675621875 296.43282218749994 242.348886875 314.7574465625" fill="#7cba59" p-id="14949"></path></svg>
`;
const fdIcon = `
  <svg t="1749169382009" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10995" width="256" height="256"><path d="M943.104 463.36c-1.536 14.336-3.072 28.16-5.12 42.496-11.776 81.92-44.544 154.624-98.816 217.088-70.656 81.92-159.744 132.608-267.264 146.432-146.944 18.944-272.896-25.6-375.296-133.12-64.512-67.584-100.864-149.504-112.64-242.176-2.048-14.848-2.048-29.696-2.56-44.544 0-2.048 0-3.584 0.512-6.144 3.584 0 6.144-0.512 9.216-0.512h851.968v20.48zM509.44 72.704c1.536 1.536 3.072 4.096 5.12 5.12 14.848 7.68 18.432 21.504 20.48 36.352 0.512 3.072-1.024 6.144-1.536 8.704 0 1.024-1.024 1.536-1.536 2.56-23.552 28.16-17.408 55.296 1.024 82.944 14.336 22.016 29.696 43.52 35.328 70.656 6.656 33.792-1.024 64-24.576 88.576-6.656 7.168-18.432 12.288-28.16 12.8-7.68 0.512-16.896-5.632-24.064-10.752-8.192-5.632-12.288-26.624-9.216-36.352 3.584-12.8 7.168-25.6 10.24-38.4 1.024-3.584 0-8.192-2.048-11.264-13.312-25.088-27.136-50.176-40.448-75.776-20.48-38.912-16.896-81.408 15.872-114.176 12.288-12.288 27.136-15.872 41.984-20.992h1.536z m-181.248 0c1.536 1.536 3.072 4.096 5.12 5.12 14.848 7.68 18.432 21.504 19.968 36.352 0.512 3.584-0.512 7.68-2.56 10.24-23.552 28.672-17.92 56.32 1.536 84.992 14.336 21.504 29.696 43.008 34.816 69.632 6.656 33.792-1.024 64-24.576 88.576-6.656 7.168-18.432 12.288-28.16 12.8-7.68 0.512-16.896-5.632-24.064-10.752-8.192-5.632-12.288-26.624-9.216-36.352 4.096-12.8 7.168-25.6 10.24-38.4 1.024-3.584 0-8.192-2.048-11.264-13.312-25.088-27.136-50.176-40.448-75.776-20.48-38.912-16.896-81.408 15.872-114.176 12.288-12.288 27.136-15.872 41.984-20.992h1.536z m362.496 0c1.536 1.536 3.072 4.096 5.12 5.12 14.848 7.68 18.432 21.504 20.48 36.352 0.512 3.072-0.512 6.144-1.536 8.704-0.512 1.536-1.536 3.072-2.56 4.096-22.528 27.136-16.384 52.736 1.024 79.872 14.848 22.528 30.72 44.544 36.352 72.192 6.656 33.792-1.024 64-24.576 88.576-6.656 7.168-18.432 12.288-28.16 13.312-7.68 0.512-16.896-5.632-24.576-10.24-8.192-5.632-12.8-26.624-9.216-36.352 2.56-7.168 4.608-14.848 7.168-22.016 8.192-22.016-3.072-39.936-11.776-57.856-4.608-9.216-10.752-17.408-15.872-26.112-10.752-16.896-21.504-34.816-22.528-55.296-1.024-13.824-0.512-28.16 3.072-40.96 6.144-20.48 21.504-36.352 37.888-49.664 4.096-3.072 9.728-3.584 14.848-5.12 4.096-1.536 8.704-2.56 13.312-4.096 0.512-0.512 1.024-0.512 1.536-0.512z" fill="#EB4237" p-id="10996"></path><path d="M266.752 815.104c-22.528 8.704-45.056 16.896-67.072 25.6 0 1.536 0 2.56 0.512 4.096 13.312 5.632 26.624 11.776 40.448 16.384 45.056 15.36 92.16 23.04 139.264 28.672 55.296 6.656 111.104 8.704 166.912 6.656 78.336-2.048 156.16-10.24 231.936-34.304 15.36-4.608 30.208-11.776 47.616-18.432-23.552-14.336-46.592-20.48-70.144-27.648 1.536-2.048 2.56-3.072 4.096-4.096 15.872-12.288 31.744-24.064 47.104-36.864 4.096-3.584 7.68-5.12 12.8-2.048 16.896 9.216 34.304 17.408 50.688 27.648 11.776 7.68 20.48 17.92 25.088 32.256 4.096 13.824 0.512 24.576-7.168 34.816-11.776 16.384-29.184 26.112-46.592 34.816-41.472 20.48-86.016 31.232-131.072 38.912-86.016 15.36-172.544 19.456-259.584 14.848-76.288-3.584-152.064-12.288-224.768-36.352-23.552-7.68-45.568-19.456-67.584-31.232-8.704-4.608-15.872-12.8-23.04-19.968-13.824-14.848-11.776-37.376 1.536-53.248 18.944-22.528 44.544-33.28 70.144-44.032 1.536-0.512 4.608 0 5.632 1.024 17.92 13.824 35.328 27.648 52.736 41.472 0.512 0 0.512 1.024 0.512 1.024z" fill="#EB4237" p-id="10997"></path></svg>
`;
const dmIcon = `
  <svg t="1749135982030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15810" width="256" height="256"><path d="M514.5 516.6m-484.5 0a484.5 484.5 0 1 0 969 0 484.5 484.5 0 1 0-969 0Z" fill="#44C0C6" p-id="15811"></path><path d="M514.5 1011c-66.7 0-131.5-13.1-192.5-38.9-58.9-24.9-111.8-60.6-157.2-106-45.4-45.4-81.1-98.3-106-157.2-25.8-61-38.9-125.7-38.9-192.5S33 384.9 58.8 323.9c24.9-58.9 60.6-111.8 106-157.2 45.4-45.4 98.3-81.1 157.2-106 61-25.8 125.7-38.9 192.5-38.9S646 35.2 707 61c58.9 24.9 111.8 60.6 157.2 106 45.4 45.4 81.1 98.3 106 157.2 25.8 61 38.9 125.7 38.9 192.5S996 648.2 970.2 709.2c-24.9 58.9-60.6 111.8-106 157.2-45.4 45.4-98.3 81.1-157.2 106-61 25.6-125.7 38.6-192.5 38.6z m0-968.9c-64.1 0-126.2 12.5-184.7 37.3-56.5 23.9-107.2 58.1-150.8 101.7-43.6 43.6-77.8 94.3-101.7 150.8C52.6 390.4 40 452.5 40 516.6s12.5 126.2 37.3 184.7c23.9 56.5 58.1 107.2 101.7 150.8 43.6 43.6 94.3 77.8 150.8 101.7 58.5 24.7 120.6 37.3 184.7 37.3s126.2-12.5 184.7-37.3c56.5-23.9 107.2-58.1 150.8-101.7s77.8-94.3 101.7-150.8c24.7-58.5 37.3-120.6 37.3-184.7s-12.5-126.2-37.3-184.7c-23.9-56.5-58.1-107.2-101.7-150.8-43.6-43.6-94.3-77.8-150.8-101.7-58.5-24.7-120.6-37.3-184.7-37.3z" fill="" p-id="15812"></path><path d="M528 32.8c-59.5 70.5-113.4 163.3 15.1 163.3 207.4 0 153.4 152.8-78.8 163.7-232.3 10.9-166.8 174.7-35.8 191 80.6 10.1 109.4 51.1 119.8 90.1v1.5c0 21.4 2.1 41.8 5.8 60.7v0.4c0 2.4 0.5 4.6 1.4 6.5 14.2 64.5 47.9 77.2 87.3 77.2 52.2 0 87.2-108.9 93.5-168.8 9.7-90.8 101.9-90.2 96.1-204.2-1.7-32.9 84.3-34.1 148.2-29C924.5 185.8 744 38.7 528 32.8z" fill="#60C13D" p-id="15813"></path><path d="M642.7 797.4c-36.4 0-80.2-9.6-96.9-84.1-1.1-2.8-1.7-5.9-1.8-9.1-3.8-20.2-5.8-40.9-5.8-61.7v-0.3c-13-47-49.4-73.7-111-81.4-34.9-4.4-67.4-18.9-91.4-40.9-23.8-21.8-36.8-49-35.8-74.7 0.7-18 8.4-43.8 41.4-64.6 28.4-17.9 69.6-28.2 122.4-30.7 76.5-3.6 124-21.9 150.4-36.7 30.6-17.1 48.6-38.6 48.1-57.4-0.5-22.9-32.1-49.6-119.2-49.6-45.4 0-73.7-11.6-84.3-34.4-8.3-17.9-5-41.9 9.9-71.2 11-21.6 28.4-46.6 51.7-74.2 2-2.3 4.9-3.6 7.9-3.5 54 1.5 106.9 11.6 157.2 30.1 48.7 17.9 94.1 43.4 135 75.7 40.5 32 75.6 69.9 104.4 112.7 29.2 43.5 51.2 91 65.3 141.3 0.9 3.1 0.2 6.5-1.9 9.1-2.1 2.5-5.3 3.9-8.5 3.6-69.5-5.6-121.1-0.8-134.8 12.5-2.5 2.4-2.7 4.4-2.7 6 3.4 67-26 98.2-52 125.7-20.6 21.9-40.1 42.5-44.1 80-3.7 34.9-15.7 78-30.5 110-20.5 44.4-45.7 67.8-73 67.8zM532.5 42.9c-46.2 55.5-65.9 98.2-55.6 120.4 8.8 18.8 40.8 22.8 66.2 22.8 43 0 77.2 6.3 101.6 18.7 23.7 12.1 37.1 30 37.5 50.5 0.6 26.8-20.6 54.3-58.3 75.3-28.3 15.8-78.8 35.4-159.2 39.2-89 4.2-143.1 32.6-144.8 76.1-0.8 19.8 9.9 41.4 29.3 59.2 21 19.3 49.6 32 80.4 35.8 70.2 8.8 113.4 41.6 128.2 97.5 0.2 0.8 0.3 1.7 0.3 2.6v1.5c0 19.8 1.9 39.6 5.6 58.8 0.1 0.6 0.2 1.3 0.2 1.9v0.4c0 0.9 0.2 1.7 0.5 2.4 0.3 0.6 0.5 1.3 0.7 2 12.6 57.5 40.2 69.3 77.6 69.3 25.1 0 45.2-35.2 54.9-56.1 16.9-36.6 26.1-78.8 28.7-103.7 4.7-44.2 27.5-68.3 49.4-91.6 25.5-27 49.6-52.6 46.6-111-0.4-8 2.6-15.4 8.7-21.3 11-10.6 32.2-17 65-19.4 24.1-1.8 50-1 70.8 0.2-13.6-43.2-33.2-84.1-58.6-121.9-27.6-41.1-61.3-77.5-100.2-108.2-39.2-31-82.8-55.4-129.6-72.6-46.7-17.2-95.8-26.9-145.9-28.8z" fill="" p-id="15814"></path></svg>`;
const safety = `
  <svg t="1749169742276" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23180" width="256" height="256"><path d="M1023.910943 511.999898c5.11911 317.794367-194.116663 516.825376-511.91103 511.911029-317.794367 4.914346-516.825376-194.116663-511.91103-511.911029C-4.825463 194.20553 194.205546-4.825478 511.999913 0.088868c317.794367-4.914346 516.825376 194.116663 511.91103 511.91103z" fill="#4ED89D" p-id="23181"></path><path d="M1022.477592 566.671996C1006.915497 340.40732 852.318366 201.16752 614.382119 204.85328c-254.112635-4.095288-413.624112 155.416189-409.528824 409.528824-3.890524 237.936247 135.554041 392.533378 361.613952 408.095473 268.036615-16.381153 439.629192-187.97373 456.010345-455.805581z" fill="#44D39C" p-id="23182"></path><path d="M1015.515602 629.944199C985.824762 491.523456 876.480566 407.160519 716.764325 409.617692c-190.635668-3.071466-310.218084 116.51095-307.146618 307.146618-2.457173 159.716241 81.905765 269.060437 220.121743 298.751277 211.112109-34.400421 351.375731-174.664043 385.776152-385.571388z" fill="#3ACC97" p-id="23183"></path><path d="M997.701098 705.707031C964.734028 646.734881 902.076118 613.153517 819.146531 614.382104c-127.1587-2.047644-206.812056 77.605712-204.764412 204.764412-1.433351 82.929587 32.352777 145.587497 91.120163 178.554567a431.233852 431.233852 0 0 0 292.198816-291.994052z" fill="#30C694" p-id="23184"></path><path d="M604.962956 781.674628l-81.905765 54.467334a20.476441 20.476441 0 0 1-22.728849 0l-81.905765-54.467334a373.285523 373.285523 0 0 1-163.81153-275.20337l-18.428797-193.502369a61.429324 61.429324 0 0 1 44.229113-64.910318l214.797868-61.429324a61.429324 61.429324 0 0 1 33.786128 0l214.797868 61.429324a61.429324 61.429324 0 0 1 44.229113 64.910318l-18.428797 193.502369a373.285523 373.285523 0 0 1-164.630587 275.20337z" fill="#BDEFD1" p-id="23185"></path><path d="M483.128131 593.905662a30.714662 30.714662 0 0 1-21.705028-9.009634l-86.82011-86.82011a30.714662 30.714662 0 0 1 43.410055-43.410056l65.115083 65.115083 122.858647-122.858647a30.714662 30.714662 0 0 1 43.410055 43.410055l-144.563674 145.382733a30.714662 30.714662 0 0 1-21.705028 8.190576z" fill="#FFFFFF" p-id="23186"></path></svg>
`;
const mh = `
  <svg t="1757654063875" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34092" width="32" height="32"><path d="M890.03 123.11H133.85c-33.54 0-60.96 26.22-62.9 59.27v448.59c1.94 33.06 29.35 59.27 62.9 59.27h330.39v98.87c0 5.57 1 11.1 2.94 16.32H308.59c-26.11 0-47.26 21.16-47.26 47.26 0 26.1 21.16 47.26 47.26 47.26h404.43c26.02-0.11 47.07-21.24 47.07-47.26 0-26.03-21.04-47.16-47.07-47.26H555.8c1.96-5.04 2.96-10.59 2.96-16.39v-98.8h331.27c34.81 0 63.02-28.22 63.02-63.02v-441.1c0-34.8-28.21-63.01-63.02-63.01zM685.7 382.81l-0.53 2.36c-0.97 3.19-2.95 6.16-6.05 8.43L390.75 603.65c-14.02 10.22-32.24-5.46-24.23-20.84l78.99-151.83-85.98-19.31c-9.12-2.05-14.28-11-12.49-19.42 0.41-1.94 1.2-3.86 2.39-5.66l135.81-205.06a16.428 16.428 0 0 1 17.29-6.96l144.17 32.38c11.38 2.56 16.54 15.82 9.88 25.39L579.4 343.27l93.65 21.03c9.11 2.05 13.81 10.57 12.65 18.51z" fill="#825FD2" p-id="34093"></path></svg>
`;
const trgl = `
  <svg t="1749135882295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11478" width="256" height="256"><path d="M695.04 938.7008H229.7344c-74.8032 0-135.424-59.5968-135.424-133.12V220.3648c0-73.5232 60.6208-133.12 135.424-133.12h465.3056c74.8032 0 135.424 59.5968 135.424 133.12v585.2672c0 73.472-60.6208 133.0688-135.424 133.0688z" fill="#FFAC3E" p-id="11479"></path><path d="M620.1344 328.9088h-325.12c-22.6304 0-40.96-18.3296-40.96-40.96s18.3296-40.96 40.96-40.96h325.12c22.6304 0 40.96 18.3296 40.96 40.96s-18.3296 40.96-40.96 40.96zM620.1344 491.3152h-325.12c-22.6304 0-40.96-18.3296-40.96-40.96s18.3296-40.96 40.96-40.96h325.12c22.6304 0 40.96 18.3296 40.96 40.96s-18.3296 40.96-40.96 40.96zM450.7136 653.6704h-155.648c-22.6304 0-40.96-18.3296-40.96-40.96s18.3296-40.96 40.96-40.96h155.6992c22.6304 0 40.96 18.3296 40.96 40.96s-18.3808 40.96-41.0112 40.96z" fill="#FFFFFF" p-id="11480"></path><path d="M764.0064 550.656l40.0384 81.1008a32.57856 32.57856 0 0 0 24.5248 17.8176l89.4976 13.0048c26.6752 3.8912 37.376 36.7104 18.0224 55.5008l-64.768 63.1296a32.57344 32.57344 0 0 0-9.3696 28.8256l15.3088 89.1392c4.5568 26.5728-23.3472 46.848-47.2064 34.304l-80.0256-42.0864a32.6912 32.6912 0 0 0-30.3104 0l-80.0256 42.0864c-23.8592 12.544-51.7632-7.7312-47.2064-34.304l15.3088-89.1392c1.792-10.5472-1.6896-21.3504-9.3696-28.8256l-64.768-63.1296c-19.3024-18.8416-8.6528-51.6608 18.0224-55.5008l89.4976-13.0048c10.5984-1.536 19.7632-8.192 24.5248-17.8176l40.0384-81.1008c11.8272-24.1664 46.336-24.1664 58.2656 0z" fill="#FFB357" p-id="11481"></path><path d="M830.464 649.8816l-1.9456-0.256c-10.5984-1.536-19.7632-8.192-24.5248-17.8176l-40.0384-81.1008c-11.9296-24.1664-46.4384-24.1664-58.368 0L665.6 631.7568a32.57856 32.57856 0 0 1-24.5248 17.8176l-89.4976 13.0048c-26.6752 3.8912-37.376 36.7104-18.0224 55.5008l64.768 63.1296a32.57344 32.57344 0 0 1 9.3696 28.8256l-15.3088 89.1392c-4.5568 26.5728 23.3472 46.848 47.2064 34.304l80.0256-42.0864c9.472-4.9664 20.7872-4.9664 30.3104 0l31.5904 16.64c29.8496-24.4224 48.896-61.2352 48.896-102.4v-155.7504z" fill="#FF7C0E" p-id="11482"></path></svg>
`;
const dd = `
  <svg t="1749169823989" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25415" width="256" height="256"><path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01" p-id="25416"></path><path d="M102.4 273.066667a136.533333 136.533333 0 0 1 136.533333-136.533334h546.133334a136.533333 136.533333 0 0 1 136.533333 136.533334v580.266666a136.533333 136.533333 0 0 1-136.533333 136.533334H238.933333a136.533333 136.533333 0 0 1-136.533333-136.533334V273.066667z" fill="#FF7744" p-id="25417"></path><path d="M273.066667 136.533333a102.4 102.4 0 0 1 102.4-102.4h273.066666a102.4 102.4 0 1 1 0 204.8h-273.066666a102.4 102.4 0 0 1-102.4-102.4z" fill="#FFAA44" p-id="25418"></path><path d="M256 477.866667A51.2 51.2 0 0 1 307.2 426.666667h409.6a51.2 51.2 0 0 1 0 102.4H307.2A51.2 51.2 0 0 1 256 477.866667z m0 204.8A51.2 51.2 0 0 1 307.2 631.466667h204.8a51.2 51.2 0 0 1 0 102.4H307.2A51.2 51.2 0 0 1 256 682.666667z" fill="#FFFFFF" p-id="25419"></path></svg>
`;
const fb = `
  <svg t="1749170047084" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37757" width="256" height="256"><path d="M191.6 83.4c-47.4 22.4-85.8 60.8-108.2 108.2L191.6 83.4z" fill="#4ADF9E" p-id="37758"></path><path d="M228.8 69.7C151.6 90.5 90.5 151.6 69.7 228.8L228.8 69.7z" fill="#49DF9E" p-id="37759"></path><path d="M258.2 63.9c-100.8 13-181.3 93.5-194.4 194.4L258.2 63.9z" fill="#48DF9F" p-id="37760"></path><path d="M283.6 62C162.5 63.9 63.9 162.5 62 283.6L283.6 62z" fill="#47E09F" p-id="37761"></path><path d="M307.2 62H287C163.3 62 62 163.3 62 287v20.2L307.2 62z" fill="#46E09F" p-id="37762"></path><path d="M330.7 62H287C163.3 62 62 163.3 62 287v43.7L330.7 62z" fill="#45E09F" p-id="37763"></path><path d="M354.2 62H287C163.3 62 62 163.3 62 287v67.2L354.2 62z" fill="#44E0A0" p-id="37764"></path><path d="M377.8 62H287C163.3 62 62 163.3 62 287v90.8L377.8 62z" fill="#43E0A0" p-id="37765"></path><path d="M401.3 62H287C163.3 62 62 163.3 62 287v114.3L401.3 62z" fill="#42E0A0" p-id="37766"></path><path d="M424.9 62H287C163.3 62 62 163.3 62 287v137.9L424.9 62z" fill="#41E0A0" p-id="37767"></path><path d="M448.4 62H287c-39.8 0-77.3 10.5-109.8 28.8l-86.4 86.4C72.5 209.7 62 247.2 62 287v161.4L448.4 62z" fill="#40E1A1" p-id="37768"></path><path d="M472 62H287c-23.7 0-46.5 3.7-68 10.6L72.6 219C65.7 240.5 62 263.3 62 287v185L472 62z" fill="#3FE1A1" p-id="37769"></path><path d="M495.5 62H287c-12.6 0-24.9 1.1-37 3.1l-185 185c-2 12-3.1 24.4-3.1 37v208.5L495.5 62z" fill="#3EE1A1" p-id="37770"></path><path d="M519.1 62H287c-3.6 0-7.1 0.1-10.6 0.3L62.3 276.4c-0.2 3.5-0.3 7-0.3 10.6v232.1L519.1 62z" fill="#3DE1A1" p-id="37771"></path><path d="M62 542.6L542.6 62H300.2L62 300.2z" fill="#3CE1A2" p-id="37772"></path><path d="M62 566.2L566.2 62H323.8L62 323.8z" fill="#3BE1A2" p-id="37773"></path><path d="M62 589.7L589.7 62H347.3L62 347.3z" fill="#3AE1A2" p-id="37774"></path><path d="M62 613.3L613.3 62H370.8L62 370.8z" fill="#39E2A2" p-id="37775"></path><path d="M62 636.8L636.8 62H394.4L62 394.4z" fill="#38E2A3" p-id="37776"></path><path d="M62 417.9v242.5L660.4 62H417.9z" fill="#37E2A3" p-id="37777"></path><path d="M62 441.5v242.4L683.9 62H441.5z" fill="#36E2A3" p-id="37778"></path><path d="M62 465v242.5L707.5 62H465z" fill="#35E2A3" p-id="37779"></path><path d="M62 488.6V731L731 62H488.6z" fill="#34E2A3" p-id="37780"></path><path d="M737 62H512.1L62 512.1V737c0 5.7 0.2 11.3 0.6 16.9L753.9 62.6c-5.6-0.4-11.2-0.6-16.9-0.6z" fill="#33E2A4" p-id="37781"></path><path d="M737 62H535.7L62 535.7V737c0 12.9 1.1 25.5 3.2 37.9L774.9 65.2c-12.4-2.1-25-3.2-37.9-3.2z" fill="#32E3A4" p-id="37782"></path><path d="M737 62H559.2L62 559.2V737c0 19.8 2.6 38.9 7.4 57.2L794.2 69.4C775.9 64.6 756.8 62 737 62z" fill="#31E3A4" p-id="37783"></path><path d="M737 62H582.8L62 582.8V737c0 26.3 4.6 51.6 13 75.2L812.2 75c-23.6-8.4-48.9-13-75.2-13z" fill="#30E3A4" p-id="37784"></path><path d="M737 62H606.3L62 606.3V737c0 32.7 7.1 63.8 19.8 92L829 81.8C800.8 69.1 769.7 62 737 62z" fill="#2FE3A5" p-id="37785"></path><path d="M844.7 89.6C812.6 72 775.9 62 737 62H629.9L62 629.9V737c0 38.9 10 75.6 27.6 107.7L844.7 89.6z" fill="#2EE3A5" p-id="37786"></path><path d="M859.4 98.5C824.1 75.4 782 62 737 62h-83.6L62 653.4V737c0 45 13.4 87.1 36.5 122.4L859.4 98.5z" fill="#2DE3A5" p-id="37787"></path><path d="M873.2 108.2C835.3 79.3 788.1 62 737 62h-60L62 677v60c0 51.1 17.3 98.3 46.2 136.2l765-765z" fill="#2CE3A5" p-id="37788"></path><path d="M886.1 118.8C846.3 83.5 794 62 737 62h-36.5L62 700.5V737c0 57 21.5 109.3 56.8 149.1l767.3-767.3z" fill="#2BE4A6" p-id="37789"></path><path d="M737 62h-12.9L62 724.1V737c0 63 26.3 120.2 68.4 161.1l767.8-767.8C857.2 88.3 800 62 737 62z" fill="#2AE4A6" p-id="37790"></path><path d="M62.2 747.4c3 64.8 33.7 122.7 80.5 161.9l766.6-766.6C870 95.9 812.2 65.2 747.4 62.2L62.2 747.4z" fill="#29E4A6" p-id="37791"></path><path d="M64.3 768.9c8.9 61.8 43.1 115.7 91.7 150.7L919.6 156c-35-48.6-88.9-82.8-150.7-91.7L64.3 768.9z" fill="#28E4A6" p-id="37792"></path><path d="M68 788.7c14 59.1 51.5 109.4 102.1 140.4l758.9-759c-30.9-50.5-81.2-88-140.4-102.1L68 788.7z" fill="#27E4A7" p-id="37793"></path><path d="M73.2 807c18.7 56.7 59.4 103.6 111.9 130.5l752.3-752.3c-26.8-52.5-73.7-93.3-130.4-112L73.2 807z" fill="#26E4A7" p-id="37794"></path><path d="M79.7 824.1c23.1 54.4 67 98.1 121.6 120.8l743.6-743.6c-22.7-54.6-66.3-98.6-120.8-121.6L79.7 824.1z" fill="#25E5A7" p-id="37795"></path><path d="M87.2 840.1c27.2 52.3 74.4 92.8 131.3 111.1l732.8-732.8C933 161.5 892.5 114.3 840.2 87.1l-753 753z" fill="#25E5A7" p-id="37796"></path><path d="M95.8 855.1c31.3 50.3 81.9 87.6 141.2 101.2L956.3 237c-13.6-59.4-50.8-110-101.2-141.2L95.8 855.1z" fill="#24E5A7" p-id="37797"></path><path d="M256.9 960L960 256.9c-8.4-62-42.3-116.3-90.8-151.6l-764 764c35.4 48.3 89.6 82.3 151.7 90.7z" fill="#23E5A8" p-id="37798"></path><path d="M278.6 961.8l683.3-683.3c-2.4-65.1-32.8-123.3-79.5-162.9L115.6 882.4c39.7 46.6 97.9 77 163 79.4z" fill="#22E5A8" p-id="37799"></path><path d="M962 287c0-62.5-25.8-119.3-67.3-160.1L126.9 894.7C167.7 936.2 224.5 962 287 962h14.9L962 301.9V287z" fill="#21E5A8" p-id="37800"></path><path d="M962 287c0-56.5-21.1-108.4-55.9-148L139 906.1c39.6 34.8 91.5 55.9 148 55.9h38.5L962 325.5V287z" fill="#20E5A8" p-id="37801"></path><path d="M962 287c0-50.6-16.9-97.4-45.3-135L152 916.7c37.7 28.4 84.5 45.3 135 45.3h62l613-613v-62z" fill="#1FE6A9" p-id="37802"></path><path d="M962 287c0-44.5-13.1-86.1-35.7-121.2L165.8 926.3c35 22.5 76.6 35.7 121.2 35.7h85.6L962 372.6V287z" fill="#1EE6A9" p-id="37803"></path><path d="M962 287c0-38.4-9.8-74.6-26.9-106.4L180.6 935.1c31.7 17.2 68 26.9 106.4 26.9h109.1L962 396.1V287z" fill="#1DE6A9" p-id="37804"></path><path d="M287 962h132.7L962 419.7V287c0-32.2-6.9-62.8-19.2-90.6L196.4 942.8c27.8 12.3 58.4 19.2 90.6 19.2z" fill="#1CE6A9" p-id="37805"></path><path d="M287 962h156.2L962 443.2V287c0-25.8-4.4-50.6-12.5-73.7L213.3 949.5c23.1 8.1 47.9 12.5 73.7 12.5z" fill="#1BE6AA" p-id="37806"></path><path d="M287 962h179.8L962 466.8V287c0-19.2-2.4-37.8-7-55.6L231.4 955c17.8 4.6 36.4 7 55.6 7z" fill="#1AE6AA" p-id="37807"></path><path d="M287 962h203.3L962 490.3V287c0-12.3-1-24.4-2.9-36.2L250.8 959.1c11.8 1.9 23.9 2.9 36.2 2.9z" fill="#19E6AA" p-id="37808"></path><path d="M287 962h226.9L962 513.9V287c0-5.1-0.2-10.1-0.5-15L272 961.5c4.9 0.3 9.9 0.5 15 0.5z" fill="#18E7AA" p-id="37809"></path><path d="M537.4 962L962 537.4V295L295 962z" fill="#17E7AB" p-id="37810"></path><path d="M561 962l401-401V318.5L318.5 962z" fill="#16E7AB" p-id="37811"></path><path d="M584.5 962L962 584.5V342.1L342.1 962z" fill="#15E7AB" p-id="37812"></path><path d="M608.1 962L962 608.1V365.6L365.6 962z" fill="#14E7AB" p-id="37813"></path><path d="M631.6 962L962 631.6V389.2L389.2 962z" fill="#13E7AB" p-id="37814"></path><path d="M655.2 962L962 655.2V412.7L412.7 962z" fill="#12E7AC" p-id="37815"></path><path d="M678.7 962L962 678.7V436.3L436.3 962z" fill="#11E8AC" p-id="37816"></path><path d="M702.2 962L962 702.2V459.8L459.8 962z" fill="#10E8AC" p-id="37817"></path><path d="M725.8 962L962 725.8V483.4L483.4 962z" fill="#0FE8AC" p-id="37818"></path><path d="M962 737V506.9L506.9 962H737c4.3 0 8.5-0.1 12.7-0.4l211.9-211.9c0.3-4.2 0.4-8.4 0.4-12.7z" fill="#0EE8AD" p-id="37819"></path><path d="M962 737V530.5L530.5 962H737c13.4 0 26.6-1.2 39.4-3.5l182.2-182.2c2.2-12.7 3.4-25.9 3.4-39.3z" fill="#0DE8AD" p-id="37820"></path><path d="M962 737V554L554 962h183c24.8 0 48.6-4.1 71-11.6L950.4 808c7.5-22.4 11.6-46.2 11.6-71z" fill="#0CE8AD" p-id="37821"></path><path d="M962 737V577.6L577.6 962H737c41.8 0 80.9-11.5 114.6-31.6l78.9-78.9c20-33.6 31.5-72.7 31.5-114.5z" fill="#0BE8AD" p-id="37822"></path><path d="M962 601.1L601.1 962H737c123.8 0 225-101.3 225-225V601.1z" fill="#0AE9AE" p-id="37823"></path><path d="M962 624.7L624.7 962H737c123.8 0 225-101.3 225-225V624.7z" fill="#09E9AE" p-id="37824"></path><path d="M962 648.2L648.2 962H737c123.8 0 225-101.3 225-225v-88.8z" fill="#08E9AE" p-id="37825"></path><path d="M962 671.8L671.8 962H737c123.8 0 225-101.3 225-225v-65.2z" fill="#07E9AE" p-id="37826"></path><path d="M962 695.3L695.3 962H737c123.8 0 225-101.3 225-225v-41.7z" fill="#06E9AF" p-id="37827"></path><path d="M962 718.8L718.8 962H737c123.8 0 225-101.3 225-225v-18.2z" fill="#05E9AF" p-id="37828"></path><path d="M961.9 742.5L742.5 961.9c119.4-2.9 216.5-100 219.4-219.4z" fill="#04E9AF" p-id="37829"></path><path d="M959.8 768.1L768.1 959.8c99-13.8 177.9-92.7 191.7-191.7z" fill="#03EAAF" p-id="37830"></path><path d="M953.6 797.9L797.9 953.6c75-21.3 134.4-80.7 155.7-155.7z" fill="#02EAB0" p-id="37831"></path><path d="M938.7 836.3L836.3 938.7c44.3-21.9 80.5-58.1 102.4-102.4z" fill="#01EAB0" p-id="37832"></path><path d="M682.5 737.1H340.2c-19.8 0-35.9-16.1-35.9-35.9V323c0-19.8 16.1-35.9 35.9-35.9H550c4.4 0 8.7 1.6 12 4.6l150.3 143.1c3.8 3.4 6 8.3 6 13.4v253.1c0 19.8-16 35.8-35.8 35.8z" fill="#CAF6E1" p-id="37833"></path><path d="M628.3 656.1h-234c-9.9 0-18-8.1-18-18s8.1-18 18-18h234c9.9 0 18 8.1 18 18s-8.1 18-18 18zM456.5 539.8l13.1-87.3c0.5-3.5 2.2-6.8 4.7-9.3L621 296.4c13.3-13.3 35.6-12.6 49.6 1.4l38.2 38.2c14 14 14.6 36.3 1.4 49.6L563.4 532.3c-2.5 2.5-5.8 4.2-9.3 4.7l-87.4 13c-6 0.9-11.1-4.2-10.2-10.2z" fill="#F6FDFA" p-id="37834"></path></svg>
`;
const cm = `
  <svg t="1751164976389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11876" width="256" height="256"><path d="M20.8896 173.2608c9.8304-54.272 69.3248-90.0096 122.7776-81.408 242.3808 0.8192 484.7616 0 727.1424 0.3072 43.8272-1.3312 85.2992 31.8464 100.7616 70.9632 2.048 157.3888 2.1504 314.9824-0.1024 472.2688-17.21344 30.93504-49.4592 71.79264-89.71264 57.4464a150.95808 150.95808 0 0 1-4.70016-35.21536c23.33696-13.5168 49.75616-32.06144 47.7184-62.67904 0.82944-130.048 0.2048-260.096 0.3072-390.144 2.56-22.9376-14.73536-39.6288-26.3168-57.1392-267.88864-2.2528-535.7568-1.536-803.6352-0.4096-13.9264 16.384-31.4368 33.5872-27.8528 57.2416 0.3072 129.9456-0.2048 259.8912 0.2048 389.8368-1.1264 29.2864 23.6544 60.8256 54.8864 56.832 137.1136 0.3072 274.2272 0 411.22816 0-62.04416-52.3264-91.12576-137.8304-71.05536-216.9856-15.0528-0.6144-30.0032-1.1264-45.056-1.536-5.5296-3.072-16.5888-9.216-22.1184-12.3904v-33.5872c30.208-7.8848 61.2352-11.264 92.4672-11.264 8.3968-11.5712 16.7936-23.1424 25.2928-34.7136-83.0464-1.3312-166.0928 1.7408-249.0368-1.1264-17.5104-0.6144-23.9616-20.1728-34.7136-30.8224 8.3968-8.4992 16.6912-16.9984 24.9856-25.4976 99.4304-0.1024 198.8608-0.1024 298.30144 0.1024 60.91776 0.9216 123.0848-17.6128 183.08096 0.4096 65.44384 27.136 120.2176 84.0704 136.91904 153.9072 23.04 88.25856-20.89984 186.35776-98.62144 232.5504 42.0864 25.38496 88.576 45.04576 123.5968 80.5888C966.8608 814.70464 1015.6032 907.0592 1003.7248 1003.52H326.97344c-7.8848-120.7296 66.4576-228.352 160.1536-297.0624-121.55904-3.9936-243.21024 0.2048-364.65664-1.9456-52.3264-1.3312-108.1344-44.8512-102.1952-101.0688 0.8192-143.36-0.6144-286.8224 0.6144-430.1824z" fill="#79d785" p-id="11877"></path></svg>
`;
const tz = `
  <svg t="1751724008708" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7374" width="256" height="256"><path d="M813.09 238.24H200.855s-35.86 11.324-35.86 79.27 35.86 81.157 35.86 81.157H813.09s-30.833-13.212-30.833-80.214 30.833-80.213 30.833-80.213z" fill="#FCE3C3" p-id="7375"></path><path d="M836.11 411.167H198.626l-2.092-0.771c-1.798-0.662-44.039-17.096-44.039-92.887 0-76.229 42.775-90.614 44.597-91.189l1.837-0.58H836.11v25H203.434c-5.723 2.987-25.938 17.064-25.938 66.77 0 49.62 20.176 65.117 26.251 68.657H836.11v25z" fill="#300604" p-id="7376"></path><path d="M256.75 275.988h231.233v18.873H256.75zM390.334 310.933h344.649v23.043H390.334zM262.52 349.398h150.736v23.043H262.52z" fill="#ED8F27" p-id="7377"></path><path d="M907.017 433.246H294.782s-35.86 11.324-35.86 79.27 35.86 81.157 35.86 81.157h612.235s-30.833-13.212-30.833-80.214 30.833-80.213 30.833-80.213z" fill="#FCE3C3" p-id="7378"></path><path d="M930.037 606.173H292.553l-2.092-0.771c-1.798-0.662-44.039-17.096-44.039-92.887 0-76.229 42.775-90.614 44.597-91.189l1.837-0.58h637.182v25H297.36c-5.723 2.987-25.938 17.064-25.938 66.77 0 49.62 20.176 65.117 26.251 68.657h632.364v25z" fill="#300604" p-id="7379"></path><path d="M354.857 541.566h431.325v23.043H354.857z" fill="#ED8F27" p-id="7380"></path><path d="M792.055 627.604H179.82s-35.86 11.324-35.86 79.27 35.86 81.157 35.86 81.157h612.235s-30.833-13.212-30.833-80.214 30.833-80.213 30.833-80.213z" fill="#FCE3C3" p-id="7381"></path><path d="M815.075 800.531H177.59l-2.092-0.771c-1.799-0.663-44.038-17.097-44.038-92.887 0-76.229 42.774-90.614 44.595-91.189l1.838-0.58h637.183v25H182.397c-5.723 2.987-25.938 17.064-25.938 66.77 0 49.619 20.175 65.117 26.25 68.657h632.365v25z" fill="#300604" p-id="7382"></path><path d="M265.709 708.718l-50.263 147.29 153.236-57.634z" fill="#FCE3C3" p-id="7383"></path><path d="M314.22 744.184l54.462 54.19L697.02 470.635l-51.623-47.93z" fill="#B12800" p-id="7384"></path><path d="M268.266 699.017l54.461 54.19 328.339-327.739-51.623-47.93z" fill="#ED8F27" p-id="7385"></path><path d="M645.397 329.934l58.74-57.215 41.085-3.024 52.717 53.485 3.061 42-66.183 67.658z" fill="#228E9D" p-id="7386"></path><path d="M362.732 805.746l-97.023-97.028a8.645 8.645 0 0 1 0-12.226l422.24-422.237c11.268-11.271 26.55-17.075 42.624-16.073 13.979 0.871 26.973 7.542 36.878 17.445l29.748 29.746c21.576 21.574 21.578 56.555 0.002 78.131L374.957 805.746a8.644 8.644 0 0 1-12.225 0z m-77.039-103.141l83.152 83.158 415.308-415.308c14.343-14.341 14.34-37.686-0.003-52.032l-31.123-31.12c-6.948-6.951-16.187-10.778-26.013-10.778s-19.065 3.827-26.016 10.778L285.693 702.605z" fill="#300604" p-id="7387"></path><path d="M697.02 470.642l-96.201-96.201 40.744-40.745 96.201 96.201z" fill="#300604" p-id="7388"></path><path d="M697.02 483.681L587.766 374.432l53.798-53.793 109.249 109.249-53.793 53.793z m-83.151-109.249l83.152 83.152 27.695-27.695-83.152-83.152-27.695 27.695z" fill="#300604" p-id="7389"></path><path d="M745.703 381.239l-13.049-13.049 18.11-18.107c3.265-3.268 3.265-8.585-0.003-11.853l-8.768-8.771 13.049-13.049 8.771 8.771c10.459 10.465 10.459 27.485 0.003 37.951l-18.113 18.107zM638.998 419.4l13.05 13.048L327.27 757.224l-13.049-13.049z" fill="#300604" p-id="7390"></path><path d="M199.742 871.713L264 699.379l17.289 6.452-50.139 134.475 134.471-50.14 6.447 17.29z" fill="#300604" p-id="7391"></path><path d="M215.446 856.008l57.278-25.908-31.37-31.371z" fill="#300604" p-id="7392"></path><path d="M196.954 874.501l41.489-91.736 50.242 50.241-91.731 41.495z m47.311-59.812l-10.328 22.829 22.829-10.327-12.501-12.502z" fill="#300604" p-id="7393"></path></svg>
`;
const sm = `
  <svg t="1752253210774" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12256" width="256" height="256"><path d="M332.159958 913.285015a6.863471 6.863471 0 0 1-3.431735-0.940959L86.65249 775.960243A7.2786 7.2786 0 0 1 83.027027 769.677953V207.565204c0-2.601477 1.300738-4.87085 3.431736-6.199264L408.820502 1.024539A6.697419 6.697419 0 0 1 412.445965 0.000554c1.217713 0 2.435425 0.304428 3.431735 0.940959l244.704886 141.226988c2.214023 1.245388 3.625463 3.708488 3.625462 6.309966v570.332309a7.2786 7.2786 0 0 1-3.625462 6.28229l-324.907866 187.25099a7.22325 7.22325 0 0 1-3.514762 0.940959z" fill="#B5D6FB" p-id="12257"></path><path d="M427.169217 14.668455l250.267618 143.247285v578.468843L345.056642 926.2924 97.473527 787.971317v-570.110906L427.169217 14.668455m0-14.640226a15.166057 15.166057 0 0 0-7.527678 2.103322L89.945849 205.323506a14.612551 14.612551 0 0 0-6.918822 12.536905v570.110906c0 5.34133 2.87823 10.239856 7.527678 12.869008l247.583115 138.348759a14.50185 14.50185 0 0 0 14.114396-0.110701l332.297168-189.935493a14.778603 14.778603 0 0 0 7.333951-12.758307V157.91574c0-5.34133-2.767529-10.15683-7.333951-12.785983L434.281766 1.882473A14.225097 14.225097 0 0 0 427.169217 0.000554z" fill="#0276F7" p-id="12258"></path><path d="M441.089887 27.67584L110.702314 226.301373 358.811259 359.779281 691.883335 167.712791z" fill="#FFFFFF" p-id="12259"></path><path d="M332.104608 913.285015V359.779281" fill="#B5D6FB" p-id="12260"></path><path d="M345.942251 885.609729c-7.721405 0-13.837643-3.238009-13.837643-7.333951v-538.837833c0-4.095942 6.116238-7.333951 13.837643-7.333951s13.837643 3.238009 13.837643 7.333951v538.754807c0 4.068267-6.116238 7.416977-13.837643 7.416977z" fill="#0276F7" p-id="12261"></path><path d="M636.532762 166.052274L332.104608 359.779281" fill="#B5D6FB" p-id="12262"></path><path d="M339.300182 359.779281a7.057198 7.057198 0 0 1-6.254615-3.791514 7.942807 7.942807 0 0 1 2.573802-10.350558L625.7394 167.103935c3.487086-2.158672 7.74908-0.857934 9.824727 2.712178 1.93727 3.542437 0.830259 8.191885-2.573802 10.350557l-290.037005 178.643976A7.527678 7.527678 0 0 1 339.300182 359.779281z" fill="#0276F7" p-id="12263"></path><path d="M110.702314 249.078134l221.402294 110.701147" fill="#B5D6FB" p-id="12264"></path><path d="M351.892438 359.779281a8.717715 8.717715 0 0 1-3.680814-0.857934L114.798256 235.627945a7.416977 7.416977 0 0 1-3.127307-10.295207 7.970483 7.970483 0 0 1 10.599635-3.044282l233.413368 123.321078c3.791514 1.93727 5.258304 6.586718 3.127307 10.267532a7.942807 7.942807 0 0 1-6.918821 3.902215z" fill="#0276F7" p-id="12265"></path><path d="M138.3776 719.558008l166.051721 110.701147" fill="#B5D6FB" p-id="12266"></path><path d="M297.344447 802.583869a7.195575 7.195575 0 0 1-3.45941-0.88561l-179.529585-97.00188a6.669744 6.669744 0 0 1-2.739854-9.298896 7.195575 7.195575 0 0 1 9.631-2.629152l179.529585 97.029555a6.669744 6.669744 0 0 1 2.739853 9.271221 7.195575 7.195575 0 0 1-6.171589 3.514762z" fill="#0276F7" p-id="12267"></path><path d="M138.3776 664.207435l166.051721 110.701147" fill="#B5D6FB" p-id="12268"></path><path d="M297.344447 774.908582a7.195575 7.195575 0 0 1-3.45941-0.885609l-179.529585-97.00188a6.669744 6.669744 0 0 1-2.739854-9.298897 7.195575 7.195575 0 0 1 9.631-2.629152l179.529585 97.029555a6.669744 6.669744 0 0 1 2.739853 9.271221 7.195575 7.195575 0 0 1-6.171589 3.514762z" fill="#0276F7" p-id="12269"></path><path d="M138.3776 608.856861l166.051721 110.701147" fill="#B5D6FB" p-id="12270"></path><path d="M297.344447 719.558008a7.195575 7.195575 0 0 1-3.45941-0.885609l-179.529585-97.00188a6.669744 6.669744 0 0 1-2.739854-9.298896 7.195575 7.195575 0 0 1 9.631-2.629152l179.529585 97.029555a6.669744 6.669744 0 0 1 2.739853 9.271221 7.195575 7.195575 0 0 1-6.171589 3.514761z" fill="#0276F7" p-id="12271"></path><path d="M83.027027 498.155715l249.077581 138.376433" fill="#B5D6FB" p-id="12272"></path><path d="M83.027027 484.290396L89.58607 470.480428 332.104608 622.72218 325.545565 636.532148z" fill="#0276F7" p-id="12273"></path><path d="M276.754034 387.454568l27.675287 27.675286" fill="#B5D6FB" p-id="12274"></path><path d="M297.233746 415.129854a8.302586 8.302586 0 0 1-3.182658-0.553505l-41.014775-16.32842c-3.570112-1.383764-4.981552-4.787825-3.154982-7.638379 1.715868-2.850555 6.088563-3.985241 9.575649-2.490775l41.014775 16.300743c3.570112 1.383764 4.981552 4.787825 3.154983 7.63838A7.804431 7.804431 0 0 1 297.233746 415.129854z" fill="#0276F7" p-id="12275"></path><path d="M660.305833 996.310876a5.092253 5.092253 0 0 1-2.629152-0.719558L473.24857 888.100505a5.75646 5.75646 0 0 1-2.767529-4.981552V440.314365c0-2.047971 0.99631-3.81919 2.601477-4.898525l245.61817-157.859836a4.981552 4.981552 0 0 1 2.767529-0.802583c0.913284 0 1.854244 0.249078 2.601476 0.719557l186.448407 111.282328c1.688192 0.99631 2.767529 2.93358 2.767529 4.981552v449.335955a5.75646 5.75646 0 0 1-2.767529 4.981552l-247.527764 147.509278a5.369006 5.369006 0 0 1-2.684503 0.747233z" fill="#B5D6FB" p-id="12276"></path><path d="M736.412871 288.377041l193.394904 113.773104V861.532229l-256.826661 150.830313-191.346932-109.870888V449.779313l254.778689-161.402272m0-11.62362a11.485244 11.485244 0 0 0-5.81181 1.660517l-254.778689 161.374597a11.678971 11.678971 0 0 0-5.341331 9.963103v452.767691c0 4.206644 2.214023 8.108859 5.81181 10.184505l191.319258 109.870889a10.959414 10.959414 0 0 0 10.931738-0.083026l256.743635-150.830313A11.789672 11.789672 0 0 0 940.960916 861.532229V402.12247a11.678971 11.678971 0 0 0-5.673434-10.129155l-193.367229-113.773104a10.765687 10.765687 0 0 0-5.535057-1.494466z" fill="#0276F7" p-id="12277"></path><path d="M749.890736 304.428707L498.156328 469.926922 687.178536 581.181575 940.960916 421.107716z" fill="#FFFFFF" p-id="12278"></path><path d="M664.208048 996.310876V553.506288" fill="#B5D6FB" p-id="12279"></path><path d="M678.045692 968.635589c-7.721405 0-13.837643-2.601477-13.837644-5.867161V531.698162c0-3.265684 6.116238-5.867161 13.837644-5.867161s13.837643 2.601477 13.837643 5.867161v430.98724c0 3.265684-6.116238 5.950187-13.837643 5.950187z" fill="#0276F7" p-id="12280"></path><path d="M913.285629 415.129854l-249.077581 166.051721" fill="#B5D6FB" p-id="12281"></path><path d="M670.102884 581.181575a5.728784 5.728784 0 0 1-5.119928-3.238009 7.001848 7.001848 0 0 1 2.103322-8.883767l237.39861-153.044335c2.822879-1.826569 6.365316-0.719557 8.025833 2.324724a7.001848 7.001848 0 0 1-2.103322 8.883767l-237.315584 153.127361a5.950187 5.950187 0 0 1-2.988931 0.830259z" fill="#0276F7" p-id="12282"></path><path d="M498.156328 470.480428l166.05172 83.02586" fill="#B5D6FB" p-id="12283"></path><path d="M685.739421 553.506288a6.642069 6.642069 0 0 1-2.850554-0.691882l-181.549881-98.634722a6.005537 6.005537 0 0 1-2.435425-8.21956 6.116238 6.116238 0 0 1 8.247235-2.435425l181.549881 98.634721a6.005537 6.005537 0 0 1-2.961256 11.346868z" fill="#0276F7" p-id="12284"></path><path d="M498.156328 857.934442l138.376434 83.02586" fill="#B5D6FB" p-id="12285"></path><path d="M631.468184 913.285015a4.981552 4.981552 0 0 1-2.490776-0.664206l-128.219603-72.786005a5.119928 5.119928 0 0 1-1.93727-6.918821 4.981552 4.981552 0 0 1 6.863471-1.992621l128.247279 72.786004a5.119928 5.119928 0 0 1-2.490776 9.575649z" fill="#0276F7" p-id="12286"></path><path d="M498.156328 802.583869l138.376434 83.02586" fill="#B5D6FB" p-id="12287"></path><path d="M631.468184 885.609729a4.981552 4.981552 0 0 1-2.490776-0.664207l-128.219603-72.786004a5.119928 5.119928 0 0 1-1.93727-6.918822 4.981552 4.981552 0 0 1 6.863471-1.992621l128.247279 72.786005a5.119928 5.119928 0 0 1-2.490776 9.575649z" fill="#0276F7" p-id="12288"></path><path d="M498.156328 774.908582l138.376434 83.02586" fill="#B5D6FB" p-id="12289"></path><path d="M631.468184 857.934442a4.981552 4.981552 0 0 1-2.490776-0.664207l-128.219603-72.786004a5.119928 5.119928 0 0 1-1.93727-6.918822 4.981552 4.981552 0 0 1 6.863471-1.99262l128.247279 72.786004a5.119928 5.119928 0 0 1-2.490776 9.575649z" fill="#0276F7" p-id="12290"></path><path d="M470.481041 664.207435l193.727007 110.701147" fill="#B5D6FB" p-id="12291"></path><path d="M470.481041 648.045067l5.092253-11.512919L664.208048 763.395663l-5.092252 11.512919z" fill="#0276F7" p-id="12292"></path><path d="M608.857475 581.181575l27.675287 27.675286" fill="#B5D6FB" p-id="12293"></path><path d="M629.337187 608.856861a8.302586 8.302586 0 0 1-3.182658-0.553505l-41.014775-16.328419c-3.570112-1.383764-4.981552-4.787825-3.154983-7.63838 1.715868-2.850555 6.088563-3.985241 9.57565-2.490775l41.014775 16.300744c3.570112 1.383764 4.981552 4.787825 3.154982 7.638379a7.804431 7.804431 0 0 1-6.420666 3.071956z" fill="#0276F7" p-id="12294"></path></svg>
`;
const sg = `
  <svg t="1753088929198" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6804" width="256" height="256"><path d="M830.039379 1024h-52.414898V16.414968h52.414898c28.926944 0 52.381898 23.334954 52.381898 52.117898v903.322236c-0.005 28.796944-23.454954 52.144898-52.381898 52.144898z m-716.056602-52.145898v-52.088898h87.30983c57.887887 0 104.791795-46.701909 104.791795-104.229797 0-57.561888-46.903908-104.252796-104.792795-104.252796h-87.30983v-86.849831h87.30983c57.889887 0 104.792795-46.672909 104.792795-104.234796S259.180494 415.964188 201.290607 415.964188h-87.30983v-86.849831h87.30983c57.889887 0 104.792795-46.671909 104.792795-104.229796 0-57.559888-46.903908-104.232796-104.792795-104.232797h-87.30983V68.533866c0-28.777944 23.449954-52.117898 52.409898-52.117898h558.820909v1007.584032H166.391675c-28.960943 0-52.409898-23.347954-52.409898-52.145898z m139.719727-746.969541c0 28.776944-23.482954 52.096898-52.409897 52.096898H61.57088c-28.933943 0-52.381898-23.319954-52.381898-52.096898 0-28.783944 23.449954-52.117898 52.381898-52.117898h139.720727c28.927944 0 52.409898 23.333954 52.409897 52.117898zM61.57188 468.085086h139.720727c28.927944 0 52.410898 23.333954 52.410897 52.112898 0 28.783944-23.482954 52.118898-52.409897 52.118898H61.57088c-28.933943 0-52.381898-23.334954-52.381898-52.119898 0-28.776944 23.447954-52.111898 52.381898-52.111898z m0 295.300423h139.720727c28.927944 0 52.410898 23.352954 52.410897 52.149898 0 28.797944-23.482954 52.084898-52.409897 52.084898H61.57088c-28.933943 0-52.381898-23.286955-52.381898-52.083898 0-28.797944 23.447954-52.149898 52.381898-52.149898z m0 0" fill="#29AB93" p-id="6805"></path></svg>
`;
const olIcon = `
  <svg t="1753255203939" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3314" width="256" height="256"><path d="M427.906696 668.952761c0-128.466759 104.142974-232.609733 232.609733-232.609733 44.167898 0 85.460438 12.310283 120.634933 33.686947V279.532576c0-32.5947-26.455979-59.016622-59.092034-59.016623H238.692504c-32.636055 0-59.092033 26.423138-59.092034 59.016623v506.306448c0 32.5947 26.455979 59.017838 59.092034 59.017839h269.718162c-49.28127-42.652375-80.503971-105.612277-80.50397-175.904102z" fill="#FCBD4C" p-id="3315"></path><path d="M569.799095 816.763729zM562.847878 812.249999zM549.571844 802.208136zM556.08154 807.381107zM540.889817 794.530782c0.812496 0.773574 1.659048 1.498495 2.483707 2.25504a172.747775 172.747775 0 0 1-4.974712-4.743612c0.833173 0.827091 1.638371 1.676076 2.491005 2.488572zM537.53888 791.184711zM532.044804 785.406017a173.742717 173.742717 0 0 1-34.297535-56.534131c7.622621 20.752697 19.2019 39.919324 34.297535 56.534131zM576.897485 820.905268zM605.958802 833.615717c-1.154279-0.383138-2.309774-0.761411-3.453106-1.168875 1.145765 0.406248 2.298828 0.786953 3.453106 1.168875zM613.115576 835.820889c-0.782088-0.222585-1.569041-0.433007-2.346264-0.666539 0.778439 0.232315 1.56296 0.44517 2.346264 0.666539zM598.681614 831.02011zM591.381316 828.037715zM584.107777 824.666101zM619.978002 837.631976c-0.260291-0.063248-0.52423-0.116766-0.784521-0.181231 0.260291 0.064464 0.523014 0.119198 0.784521 0.181231zM487.878122 685.559054c-0.060816-0.6264-0.090007-1.261314-0.143525-1.890147 0.053518 0.630049 0.083925 1.262531 0.143525 1.890147zM494.71014 719.868752zM488.927798 694.203376c-0.155688-1.063056-0.271237-2.139491-0.407464-3.208628 0.135011 1.069137 0.251776 2.14314 0.407464 3.208628zM490.41413 702.816073c-0.278535-1.398758-0.509634-2.814543-0.755329-4.225464 0.243262 1.412137 0.479227 2.824274 0.755329 4.225464zM492.340767 711.37647zM497.512521 728.238188z" fill="" p-id="3316"></path><path d="M871.939241 659.19065c-5.237435-113.445319-98.854454-201.896666-211.259827-201.893017-3.288905 0-6.602136 0.075411-9.923881 0.229882-116.768281 5.391906-207.05504 104.420292-201.663134 221.183709 5.237435 113.446536 98.854454 201.896666 211.258611 201.896665 3.288905 0 6.608217-0.075411 9.925097-0.228666 116.767065-5.391906 207.053824-104.421509 201.663134-221.188573zM660.813208 842.504517c-95.964499 0-173.759745-77.795246-173.759745-173.759745s77.795246-173.759745 173.759745-173.759745 173.759745 77.795246 173.759746 173.759745-77.795246 173.759745-173.759746 173.759745z" fill="#272828" p-id="3317"></path><path d="M660.813208 668.952761m-172.549516 0a172.549516 172.549516 0 1 0 345.099032 0 172.549516 172.549516 0 1 0-345.099032 0Z" fill="#4AC4CE" p-id="3318"></path><path d="M778.696846 468.619055V268.573614c0-38.966953-31.588811-70.553331-70.552115-70.553331H237.207388c-38.966953 0-70.552115 31.590027-70.552115 70.553331v503.266888c0 38.963304 31.586378 70.548466 70.552115 70.548466h268.355895a233.953756 233.953756 0 0 1-34.254965-38.21284H237.207388c-17.829902 0-32.339275-14.504508-32.339275-32.335626V268.573614c0-17.829902 14.509373-32.339275 32.339275-32.339275h470.936127c17.831118 0 32.335626 14.509373 32.335626 32.339275v181.878621c10.605015 3.882464 20.812296 8.56891 30.62306 13.898785 0.270021 0.145957 0.531528 0.302861 0.801549 0.450035 2.27815 1.249151 4.558733 2.497086 6.793096 3.818z" fill="#272828" p-id="3319"></path><path d="M673.052945 567.460129h-38.214056v172.590871h141.335329v-38.212841h-103.121273z" fill="#272828" p-id="3320"></path><path d="M550.148376 464.239119H287.239122c-15.370521 0-27.83041 12.459889-27.830411 27.83041s12.459889 27.83041 27.830411 27.83041h194.890714c18.869848-22.591759 41.933535-41.554046 68.01854-55.66082zM287.239122 569.495017c-15.370521 0-27.83041 12.459889-27.830411 27.83041s12.459889 27.83041 27.830411 27.83041h145.06697a230.673366 230.673366 0 0 1 18.098707-55.66082H287.239122zM287.239122 674.752132c-15.370521 0-27.83041 12.459889-27.830411 27.83041s12.459889 27.83041 27.830411 27.83041h148.934839c-4.864027-17.795845-7.649379-36.437026-8.121308-55.66082H287.239122zM354.103382 268.405763c0 11.947822-9.6867 21.634522-21.634523 21.634523-11.947822 0-21.634522-9.6867-21.634522-21.634523v-103.37913c0-11.947822 9.6867-21.634522 21.634522-21.634522 11.947822 0 21.634522 9.6867 21.634523 21.634522v103.37913zM636.242511 268.405763c0 11.947822-9.6867 21.634522-21.634522 21.634523-11.947822 0-21.634522-9.6867-21.634522-21.634523v-103.37913c0-11.947822 9.6867-21.634522 21.634522-21.634522 11.947822 0 21.634522 9.6867 21.634522 21.634522v103.37913z" fill="#272828" p-id="3321"></path></svg>
`;
const llIcon = `
  <svg t="1753255245858" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6898" width="256" height="256"><path d="M0.847053 0m511.232983 0l0.01334 0q511.232984 0 511.232984 511.232984l0 1.534032q0 511.232984-511.232984 511.232984l-0.01334 0q-511.232984 0-511.232983-511.232984l0-1.534032q0-511.232984 511.232983-511.232984Z" fill="#FA75AA" opacity=".5" p-id="6899"></path><path d="M0.67364 511.513111c0 282.288647 228.837621 511.139608 511.126269 511.139608s511.139608-228.850961 511.139608-511.139608S794.101895 0.386843 511.799909 0.386843 0.67364 229.224464 0.67364 511.513111z" fill="#FA75AA" opacity=".5" p-id="6900"></path><path d="M233.046206 771.631655A468.600221 468.600221 0 0 0 274.131596 964.146056a508.81855 508.81855 0 0 0 237.654973 58.506663c282.301987 0 511.139608-228.850961 511.139608-511.139608a514.341067 514.341067 0 0 0-8.297114-92.17534A468.386791 468.386791 0 0 0 703.247157 301.470722C443.542135 301.470722 233.046206 511.953312 233.046206 771.631655z" fill="#E84F94" p-id="6901"></path><path d="M827.277014 334.112265v-98.711653a24.010942 24.010942 0 0 0-24.010942-24.010942h-40.65853v146.733537h40.618512a24.010942 24.010942 0 0 0 24.05096-24.010942zM789.032919 708.40284l60.61429 27.212401v-85.172148a23.277275 23.277275 0 0 0-23.090523-23.157221v0.066698h-17.621364c0 1.147189 0.066697 2.28104 0.066697 3.441568A157.698534 157.698534 0 0 1 789.032919 708.40284zM793.474943 561.789357a22.330177 22.330177 0 0 0 13.939686-20.689429v-102.046505A22.410213 22.410213 0 0 0 785.031095 416.709907h-22.543607v102.593421a144.612571 144.612571 0 0 1 30.987455 42.486029zM471.741653 792.361102a62.175002 62.175002 0 0 1 36.670045-56.53243l61.027812-27.399153a151.869211 151.869211 0 0 1-10.391402-22.570286H397.147658a13.192679 13.192679 0 0 1-13.192679-13.192679v-27.519208a13.192679 13.192679 0 0 1 13.192679-13.192679H549.45707v-1.160529c0-36.896815 12.285599-70.698886 32.654882-96.430613H397.281053a13.339412 13.339412 0 0 1-13.339413-13.339412V493.558262a13.339412 13.339412 0 0 1 13.339413-13.339412h230.771836a13.339412 13.339412 0 0 1 12.272259 8.150381 3.521605 3.521605 0 0 0 4.348649 1.867518l8.070344-2.321058 23.303954-3.374872h5.335765c0.280128 0 16.540871 1.053814 16.540871 1.053814l15.767186 4.655455A124.363343 124.363343 0 0 1 739.677092 501.962092V167.249554H229.524601a76.301439 76.301439 0 0 0-54.971719 53.877887v563.523481a72.032827 72.032827 0 0 0 72.032828 72.032827h232.852784a61.801498 61.801498 0 0 1-7.750199-30.173751z m-87.786674-443.615502a15.260288 15.260288 0 0 1 15.113555-15.393682h226.916746a15.260288 15.260288 0 0 1 15.260288 15.260288V372.169609a15.260288 15.260288 0 0 1-15.260288 15.260287h-226.770013A15.260288 15.260288 0 0 1 383.954979 372.169609z m-82.39755 341.822445A33.348531 33.348531 0 0 1 270.129773 658.206631a32.654882 32.654882 0 0 1 32.361414-31.481014v-0.066697a32.01459 32.01459 0 1 1-0.880401 63.909125z m0-149.054595A33.348531 33.348531 0 0 1 270.129773 509.152035a32.641542 32.641542 0 0 1 32.361414-31.481013 32.01459 32.01459 0 1 1-0.880401 63.909125z m0-149.054595A33.348531 33.348531 0 0 1 270.129773 360.084101a32.641542 32.641542 0 0 1 32.361414-31.534371 32.01459 32.01459 0 1 1-0.880401 63.909125z" fill="#FFFFFF" p-id="6902"></path><path d="M785.031095 563.443444a22.236801 22.236801 0 0 0 8.39049-1.654087 144.612571 144.612571 0 0 0-30.934097-42.486029v44.140116z" fill="#FFFFFF" p-id="6903"></path><path d="M854.676168 792.361102a30.067036 30.067036 0 0 0-17.754759-27.385814l-94.296306-42.312616a29.199974 29.199974 0 0 0-4.388667-1.574051c23.570742-20.876181 38.791012-53.557741 38.791011-90.307822 0-61.2946-42.245919-111.304058-95.270084-114.118674v-0.120055h-5.002279v0.120055c-53.024165 2.814616-95.270084 52.824073-95.270084 114.118674 0 36.750081 15.180251 69.364945 38.764332 90.334501a28.186179 28.186179 0 0 0-4.388666 1.574051l-94.309647 42.312616A30.093715 30.093715 0 0 0 503.756243 792.361102v34.242272a30.080375 30.080375 0 0 0 30.067036 30.120393h290.85255a30.067036 30.067036 0 0 0 30.053696-30.120393z" fill="#FFFFFF" p-id="6904"></path></svg>
`;
const cmIcon = `
  <svg t="1753255530668" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9945" width="256" height="256"><path d="M512 153.6c-197.12 0-358.4 73.984-358.4 168.3584v380.0832C153.6 793.8688 314.88 870.4 512 870.4s358.4-73.984 358.4-168.3584V319.4112C870.4 227.5712 709.12 153.6 512 153.6zM271.36 776.0128c-15.36 0-28.16-12.7488-28.16-28.0576 0-15.3088 12.8-28.0576 28.16-28.0576 15.36 0 28.16 12.7488 28.16 28.0576 0 17.856-12.8 28.0576-28.16 28.0576z m552.96-130.0864c-12.8 7.6416-25.6 15.296-40.96 22.9504-74.24 33.1648-171.52 53.568-271.36 53.568-99.84 0-199.68-17.856-271.36-53.568-15.36-7.6544-28.16-15.3088-40.96-22.9504v-56.128c61.44 51.0208 179.2 86.7328 314.88 86.7328 135.68 0 253.44-35.712 314.88-86.7328v56.128h-5.12zM243.2 559.1936c0-15.3088 12.8-28.0576 28.16-28.0576 15.36 0 28.16 12.7488 28.16 28.0576 0 15.3088-12.8 28.0576-28.16 28.0576-15.36 0-28.16-12.7488-28.16-28.0576z m581.12-102.0416c-12.8 7.6544-25.6 15.3088-40.96 22.9632-74.24 33.152-171.52 53.568-271.36 53.568-99.84 0-199.68-17.856-271.36-53.568-15.36-7.6544-28.16-15.3088-40.96-22.9632v-56.1152c61.44 51.0208 179.2 86.7328 314.88 86.7328 135.68 0 253.44-35.712 314.88-86.7328-5.12 0-5.12 56.1152-5.12 56.1152z" fill="#d81e06" p-id="9946"></path></svg>
`;
const ouIcon = `
  <svg t="1753255757154" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12001" width="256" height="256"><path d="M731.428571 487.619048c134.656 0 243.809524 109.153524 243.809524 243.809523s-109.153524 243.809524-243.809524 243.809524-243.809524-109.153524-243.809523-243.809524 109.153524-243.809524 243.809523-243.809523z m-218.063238 48.761904l-0.658285 0.731429A291.474286 291.474286 0 0 0 438.857143 731.428571c0 87.30819 38.253714 165.692952 98.913524 219.306667h-1.804191L512 950.857143c-152.624762 0-290.767238-12.190476-414.47619-36.571429C81.261714 662.357333 219.428571 536.380952 512 536.380952h1.365333zM731.428571 536.380952a195.047619 195.047619 0 1 0 0 390.095238 195.047619 195.047619 0 0 0 0-390.095238z m47.957334 219.452953c-2.194286 33.304381-8.777143 63.634286-18.651429 86.674285C750.518857 866.328381 738.986667 877.714286 731.428571 877.714286c-7.558095 0-19.090286-11.385905-29.305904-35.206096-9.874286-23.04-16.481524-53.369905-18.651429-86.674285z m-192.219429 0h47.420953c2.121143 37.61981 9.118476 72.167619 20.187428 100.205714a146.383238 146.383238 0 0 1-67.608381-100.205714z m288.524191 0a146.285714 146.285714 0 0 1-67.608381 100.205714c11.068952-28.038095 18.066286-62.585905 20.187428-100.205714z m-220.891429-148.992c-11.093333 28.038095-18.090667 62.561524-20.23619 100.205714h-47.396572a146.358857 146.358857 0 0 1 64.609524-98.328381z m153.283048-0.024381A146.383238 146.383238 0 0 1 875.690667 707.047619h-47.420953c-1.999238-35.57181-8.362667-68.388571-18.407619-95.548952zM731.428571 585.142857c7.558095 0 19.090286 11.385905 29.305905 35.206095 9.874286 23.064381 16.481524 53.394286 18.67581 86.698667h-95.963429c2.194286-33.328762 8.777143-63.634286 18.67581-86.698667C712.338286 596.528762 723.870476 585.142857 731.428571 585.142857zM512 48.761905a219.428571 219.428571 0 1 1 0 438.857143 219.428571 219.428571 0 0 1 0-438.857143z" fill="#78D750" p-id="12002"></path></svg>
`;
const dymIcon = `
  <svg t="1754664691682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16262" width="256" height="256"><path d="M672.914286 325.485714H345.6c-16.457143 0-31.085714 14.628571-31.085714 31.085715v224.914285c0 16.457143 12.8 31.085714 31.085714 31.085715h327.314286c16.457143 0 31.085714-14.628571 31.085714-31.085715V356.571429c0-16.457143-12.8-31.085714-31.085714-31.085715z m-115.2 153.6l-80.457143 56.685715c-9.142857 5.485714-21.942857 1.828571-21.942857-10.971429v-120.685714c0-12.8 14.628571-16.457143 21.942857-10.971429l80.457143 56.685714c9.142857 7.314286 9.142857 23.771429 0 29.257143z" fill="#FF4957" fill-opacity=".5" p-id="16263"></path><path d="M506.514286 7.314286C230.4 7.314286 7.314286 230.4 7.314286 506.514286s224.914286 501.028571 501.028571 501.028571 501.028571-224.914286 501.028572-501.028571S784.457143 7.314286 506.514286 7.314286z m80.457143 731.428571h-155.428572c-12.8 0-21.942857-9.142857-21.942857-21.942857s9.142857-21.942857 21.942857-21.942857h155.428572c12.8 0 21.942857 9.142857 21.942857 21.942857s-9.142857 21.942857-21.942857 21.942857z m160.914285-157.257143c0 42.057143-32.914286 74.971429-73.142857 74.971429h-329.142857c-40.228571 0-73.142857-32.914286-73.142857-74.971429V356.571429c0-42.057143 32.914286-74.971429 73.142857-74.971429h327.314286c40.228571 0 73.142857 32.914286 73.142857 74.971429v224.914285z" fill="#FF4957" fill-opacity=".5" p-id="16264"></path></svg>
`;
const camIcon = `
  <svg t="1754664577903" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14027" width="256" height="256"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#429DFF" p-id="14028"></path><path d="M651.636364 325.818182a69.818182 69.818182 0 0 1 69.818181 69.818182v232.727272a69.818182 69.818182 0 0 1-69.818181 69.818182H372.363636a69.818182 69.818182 0 0 1-69.818181-69.818182V395.636364a69.818182 69.818182 0 0 1 69.818181-69.818182z m0 25.064727H372.363636a46.545455 46.545455 0 0 0-46.545454 46.545455v229.143272a46.545455 46.545455 0 0 0 46.545454 46.545455h279.272728a46.545455 46.545455 0 0 0 46.545454-46.545455v-229.143272a46.545455 46.545455 0 0 0-46.545454-46.545455z m-232.424728 83.828364a7.773091 7.773091 0 0 1 10.705455 0.232727l122.577454 122.228364c3.025455 3.025455 7.936 3.025455 10.961455-0.023273l0.512-0.558546 36.840727-44.916363a7.749818 7.749818 0 0 1 10.030546-1.698909l60.346182 50.967272c2.327273 1.396364 3.723636 3.909818 3.723636 6.609455V628.363636a23.272727 23.272727 0 0 1-23.272727 23.272728H372.363636a23.272727 23.272727 0 0 1-23.272727-23.272728v-105.192727c0-2.164364 0.930909-4.258909 2.56-5.725091zM628.363636 387.886545a31.022545 31.022545 0 1 1 0 62.068364 31.022545 31.022545 0 0 1 0-62.068364zM768 372.363636a46.545455 46.545455 0 0 1 46.545455 46.545455v186.181818a46.545455 46.545455 0 0 1-46.545455 46.545455h-23.272727v-23.272728h23.272727a23.272727 23.272727 0 0 0 23.272727-23.272727v-186.181818a23.272727 23.272727 0 0 0-23.272727-23.272727h-23.272727v-23.272728z m-488.727273 0v23.272728h-23.272727a23.272727 23.272727 0 0 0-23.272727 23.272727v186.181818a23.272727 23.272727 0 0 0 23.272727 23.272727h23.272727v23.272728h-23.272727a46.545455 46.545455 0 0 1-46.545455-46.545455v-186.181818a46.545455 46.545455 0 0 1 46.545455-46.545455h23.272727z" fill="#FFFFFF" p-id="14029"></path></svg>
`;
const dwmIcon = `
  <svg t="1754836042824" class="icon" viewBox="0 0 1077 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8577" width="256" height="256"><path d="M534.686008 507.700263m-481.811498 0a481.811498 481.811498 0 1 0 963.622997 0 481.811498 481.811498 0 1 0-963.622997 0Z" fill="#91BFCC" p-id="8578"></path><path d="M534.686008 47.398206c122.952272 0 238.539711 47.880018 325.480875 134.81688 86.941164 86.941164 134.821182 202.532905 134.821182 325.485177 0 122.94797-47.880018 238.539711-134.821182 325.480874-86.941164 86.945466-202.532905 134.821182-325.480875 134.821182-253.811414 0-460.302056-206.490642-460.302056-460.302056s206.490642-460.302056 460.302056-460.302057z m-503.32094 460.302057c0 277.532027 225.788913 503.32094 503.32094 503.32094 134.442616 0 260.836398-52.353982 355.895226-147.425715 95.067431-95.071733 147.425715-221.456912 147.425715-355.895225 0-134.438314-52.353982-260.836398-147.425715-355.899528-95.067431-95.067431-221.456912-147.421413-355.895226-147.421413-277.532027 0-503.32094 225.784612-503.32094 503.320941z" fill="#6E6E96" p-id="8579"></path><path d="M492.746899 68.907648c219.172609 0 386.808595 155.805793 386.808595 374.982704 0 40.764694-21.565366 47.583187-32.982578 84.605239-4.000756 12.978797-300.379356-316.464117-311.151285-308.441095-84.622446 63.074287 71.751196 167.846779 98.999358 195.090638 12.385137 12.389439-39.943034 59.150965-34.840994 66.601836 4.929964 7.192757 11.688231 14.768383 19.681139 22.640839 8.023022 7.906871 59.680097-31.674804 69.613158-23.251707 59.473607 50.452547 168.363005 134.558767 147.929035 182.542029-53.765001 126.277631-196.953356 198.94513-344.06073 198.94513-55.098586 0-107.573021-11.227929-155.259454-31.524238-11.847401-5.041813 187.46339-218.230496 193.666713-229.411103 18.932611-34.131182 0.70551-43.104922-8.599475-49.25232-13.133665-8.689815-274.116327 226.485819-286.097086 216.341966-85.977541-72.800857-140.564203-181.531086-140.564203-303.012111 0.004302-219.181213 177.680896-396.857807 396.857807-396.857807z" fill="#9ED0DF" p-id="8580"></path><path d="M713.485395 425.00076l68.176327 68.154818c22.356914 22.36982 50.495566 30.840238 62.519344 18.825064 12.015174-12.010872 21.844989-47.738055 21.844989-79.378445v-61.430966c0-31.636087 18.308837-75.83799 40.682958-98.212112l87.56924-87.569239c22.36982-22.36982 24.847707-47.733753 24.847707-75.70033 0-27.962274-22.877442-50.844019-50.839716-50.844019-27.970878 0-53.326208 2.473586-75.704632 24.847707l-78.324482 78.328784c-22.365518 22.374121-66.571723 40.678657-98.194904 40.678656h-78.247048c-31.636087 0-67.543949 10.0234-79.800029 22.270877-12.264684 12.25608-3.966341 40.584015 18.40778 62.953834l137.062466 137.075371" fill="#F0F0FF" p-id="8581"></path><path d="M712.951961 328.913782l-118.57295 118.568647a21.509442 21.509442 0 1 0 30.410049 30.418653L743.366312 359.332434a21.509442 21.509442 0 1 0-30.414351-30.418652zM492.131729 552.418392c-152.179301 152.170698-351.71379 260.419115-444.789447 241.310127a21.509442 21.509442 0 0 0-8.6554 42.136997c119.863516 24.615405 340.14171-109.315286 483.859197-253.015565a21.509442 21.509442 0 0 0 0-30.418653 21.496536 21.496536 0 0 0-30.41435-0.012906z" fill="#6E6E96" p-id="8582"></path><path d="M727.195513 773.34187m-50.547188 0a50.547188 50.547188 0 1 0 101.094377 0 50.547188 50.547188 0 1 0-101.094377 0Z" fill="#91BFCC" p-id="8583"></path><path d="M678.799269 567.9267m-25.81133 0a25.81133 25.81133 0 1 0 51.62266 0 25.81133 25.81133 0 1 0-51.62266 0Z" fill="#91BFCC" p-id="8584"></path><path d="M221.723629 431.341744m-50.547189 0a50.547188 50.547188 0 1 0 101.094377 0 50.547188 50.547188 0 1 0-101.094377 0Z" fill="#91BFCC" p-id="8585"></path><path d="M455.101073 395.851165m-25.81133 0a25.81133 25.81133 0 1 0 51.622661 0 25.81133 25.81133 0 1 0-51.622661 0Z" fill="#91BFCC" p-id="8586"></path><path d="M432.516159 179.681274m-26.886802 0a26.886802 26.886802 0 1 0 53.773605 0 26.886802 26.886802 0 1 0-53.773605 0Z" fill="#91BFCC" p-id="8587"></path><path d="M766.441641 477.948403l-174.807234-205.225887 199.01396 142.487146s-19.715554-131.784049 62.037532-179.087613c215.184759-124.513857 115.600344-177.272216 115.600345-177.272216s66.141534 36.587561 51.799038 71.002668-114.718457 134.791069-114.718458 134.791068-32.797597 49.583565-39.345071 106.527662c-6.547474 56.944096 1.682038 208.047926-99.580112 106.777172z" fill="#6E6E96" opacity=".15" p-id="8588"></path><path d="M615.69917 334.269633c-22.374121-22.36982-30.672464-50.697755-18.40778-62.953835 12.260382-12.247476 48.15964-22.270876 79.804331-22.270876l78.242746-12.905665c31.631785 0 62.923721-18.304535 85.289239-40.678657l78.324482-78.328783c22.36982-22.374121 60.639419-41.805751 88.610297-11.942042 0.778642 0.825963 2.241284 0.094642 3.342567 0.172075-1.746567-26.409293-23.836764-47.492848-50.667642-47.492848-27.970878 0-53.326208 2.473586-75.704631 24.847708l-78.324482 78.328783c-22.365518 22.374121-66.571723 40.678657-98.194904 40.678657h-78.247048c-31.636087 0-67.543949 10.0234-79.800029 22.270876-12.264684 12.25608-3.966341 40.584015 18.40778 62.953834l137.058164 137.07107 12.854042 12.854042-102.587132-102.604339z" fill="#FFFFFF" p-id="8589"></path><path d="M698.273918 440.212238l68.172025 68.154817c31.84688 31.855483 71.798517 39.951637 92.937996 18.825064 18.476611-18.472309 28.147256-61.572928 28.147256-94.594224V371.166929c0-25.90167 16.063251-64.687496 34.380692-83.000634L1009.481127 200.597055c28.745218-28.745218 31.149974-61.994513 31.149973-90.907505 0-39.895713-32.457748-72.353461-72.349158-72.353461-28.921596 0-62.170891 2.409057-90.911807 31.149974l-78.324482 78.328784c-18.317441 18.313139-57.090361 34.380692-82.987729 34.380691h-78.247047c-33.00839 0-76.238066 9.812607-95.002903 28.564539-7.833739 7.829437-11.976457 18.485214-11.976458 30.810125 0 20.158649 11.356985 43.548016 30.384238 62.566664-0.004302 0.004302 137.04956 137.071069 137.058164 137.075372a21.509442 21.509442 0 0 0 30.414351-30.418653l-137.053862-137.071069c-15.374949-15.370647-18.799252-30.108917-17.637743-33.662277a3.346869 3.346869 0 0 1-0.787245 1.131397c6.362493-6.358191 35.37873-15.972912 64.601458-15.972912h78.242745c37.250051 0 87.065919-20.636159 113.406382-46.980923-0.008604 0 78.315878-78.328784 78.315878-78.328783 15.684685-15.680383 32.681446-18.549743 60.497456-18.549743 16.1751 0 29.325973 13.159477 29.325973 29.334577 0 27.81601-2.865058 44.808469-18.549743 60.488852L891.480329 257.751944c-26.349066 26.344764-46.985225 76.164934-46.985225 113.419287v61.430966c0 31.464012-10.268608 58.892852-15.542723 64.166967a3.94053 3.94053 0 0 1 1.411019-0.946415c-3.561964 1.041057-18.274422-2.628454-33.516012-17.874346l-68.176327-68.15912a21.50514 21.50514 0 1 0-30.397143 30.422955z" fill="#6E6E96" p-id="8590"></path><path d="M876.686134 213.020909a21.509442 21.509442 0 0 1-15.207175-36.716618l43.018884-43.018883a21.509442 21.509442 0 0 1 30.414351 30.418652l-43.018884 43.018884a21.43631 21.43631 0 0 1-15.207176 6.297965z" fill="#6E6E96" p-id="8591"></path></svg>
`;
const comIcon = `
  <svg t="1756123393511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6466" width="256" height="256"><path d="M433.11407408 53.97617778z" fill="#db639b" p-id="6467"></path><path d="M943.68805925 308.95976297l-227.31282962-33.01072594c-9.46631111-1.33499259-17.71899259-7.28177778-21.9666963-15.89854814l-101.5808-205.95294814c-15.17037037-30.70482963-45.75383703-49.63745185-79.85682963-49.63745186-34.22435555 0-64.80782222 19.05398518-79.85682962 49.63745186l-101.5808 205.95294814c-4.2477037 8.61677037-12.50038518 14.56355555-21.9666963 15.89854814l-227.31282963 33.01072594c-19.29671111 2.79134815-37.37979259 12.01493333-50.97244445 25.97167406l-3.2768 3.51952594-0.36408888 0.36408888c-30.82619259 35.55934815-28.5202963 89.20177778 5.2186074 122.09114074L197.30583703 621.22666667c6.91768889 6.67496297 9.95176297 16.384 8.37404445 25.72894815l-38.83614815 226.46328888c-3.2768 19.17534815-0.12136297 39.3216 8.98085926 56.55514075l2.18453333 4.00497777 0.24272593 0.36408889c16.62672592 27.67075555 46.11792592 43.20521482 76.45866667 43.20521481 13.95674075 0 28.15620741-3.2768 41.38477037-10.19448889l203.28296296-106.92077036c8.49540741-4.49042963 18.56853333-4.49042963 27.06394074 0l203.28296296 106.92077036c17.23354075 9.10222222 37.37979259 12.25765925 56.55514075 8.98085927l4.36906667-0.84954075 0.36408888-0.12136296c46.11792592-10.55857778 75.97321482-55.34151111 67.96325926-101.94488889l-38.83614814-226.34192592c-1.57771852-9.46631111 1.45635555-19.05398518 8.37404444-25.72894815L992.96142222 461.02755555c13.95674075-13.59265185 23.18032592-31.67573333 25.97167408-50.97244444l0.48545185-4.36906666v-0.48545186c4.49042963-47.21019259-28.88438518-89.4445037-75.7304889-96.24082962zM646.47016297 602.17268148c-32.28254815 32.52527408-76.94411852 51.21517037-122.69795556 51.21517037h-0.48545186c-45.51111111 0-89.92995555-18.44717037-122.09114073-50.72971852-18.44717037-18.44717037-18.44717037-48.30245925 0-66.74962963s48.30245925-18.44717037 66.74962963 0c14.56355555 14.68491852 34.70980741 23.05896297 55.3415111 23.05896297h0.24272593c20.75306667 0 41.02068148-8.37404445 55.58423704-23.18032592 11.77220741-12.25765925 29.24847408-17.23354075 45.75383703-12.98583705 16.50536297 4.2477037 29.4912 17.11217778 33.86026667 33.49617778s-0.36408889 33.98162963-12.25765925 45.8752z" fill="#db639b" p-id="6468"></path></svg>
`;
const trnIcon = `
  <svg t="1757246576348" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7980" width="32" height="32"><path d="M445.952 428.032c-0.512 52.736 0 105.472-0.512 158.208-27.136-51.712-55.296-102.4-82.944-153.088-14.336 1.024-29.184 1.536-44.032 2.56 0.512 72.192 0.512 144.896 0 217.088 12.8 1.024 26.112 1.536 38.912 2.56 0-52.736 0.512-105.472-0.512-158.208 27.648 54.784 57.856 108.032 86.528 162.816 15.36 1.024 30.72 1.536 46.08 2.56v-235.52c-14.848 0-29.184 0.512-43.52 1.024zM721.92 603.136v91.648c7.168-0.512 14.848-1.024 22.016-1.536 1.024-29.696 1.024-59.392 0-89.088-7.168 0-14.848-0.512-22.016-1.024z" fill="#77BC53" p-id="7981"></path><path d="M743.936 388.608c-12.8-0.512-26.112-1.024-39.424-1.024v-22.528H557.056v39.936h108.032v22.528h-108.032v28.672h108.032v22.528h-108.032v28.672h108.032v22.528h-107.52v28.672H665.6v22.528h-108.032v28.672H665.6v22.528h-108.032v28.672H665.6v22.528h-108.032v45.568H705.024V479.232c12.8 0 26.112-0.512 38.912-0.512 1.024-30.208 1.024-59.904 0-90.112z" fill="#77BC53" p-id="7982"></path><path d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m247.808 693.76c-2.56 17.408-23.552 16.384-36.864 18.944-2.048 9.216-1.536 19.456-6.656 27.648-10.24 6.144-23.04 4.608-34.304 5.12-19.968 0-39.936-0.512-59.904-0.512h-64.512v45.568H522.24c-86.528-15.872-259.584-45.568-259.584-45.568V348.16s174.08-30.208 261.12-45.568h33.792V348.16c8.192 0.512 16.896 0.512 25.088 0.512 23.04 0 46.08-1.024 69.12-1.024 22.016 0 43.52 1.024 65.536 4.096 2.048 6.144 4.096 11.776 6.144 17.92 13.312 2.56 34.816 0.512 36.864 18.944 4.096 33.28 1.536 67.072-0.512 100.352 3.072 35.328 5.12 71.168-1.024 106.496 4.096 32.256 4.096 66.048 1.024 98.304z" fill="#77BC53" p-id="7983"></path><path d="M721.92 495.616v91.648c7.168-0.512 14.336-0.512 22.016-1.024 1.536-29.696 1.024-59.392 0-89.6-7.168-0.512-14.848-0.512-22.016-1.024z" fill="#77BC53" p-id="7984"></path></svg>
`;
const liIcon = `
  <svg t="1758463339868" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5621" width="32" height="32"><path d="M170.666667 706.389333V274.944c0-16.341333 7.210667-32 20.010666-43.52C203.477333 219.776 220.842667 213.333333 238.933333 213.333333h546.133334c18.090667 0 35.456 6.485333 48.256 18.048 12.8 11.562667 20.010667 27.221333 20.010666 43.562667v431.445333c0 16.341333-7.210667 32-20.010666 43.52-12.8 11.605333-30.165333 18.090667-48.256 18.090667H238.933333c-18.090667 0-35.456-6.485333-48.256-18.048-12.8-11.562667-20.010667-27.221333-20.010666-43.562667z" fill="#71D896" p-id="5622"></path><path d="M533.333333 437.333333a21.333333 21.333333 0 0 1 21.333334-21.333333h170.666666a21.333333 21.333333 0 0 1 0 42.666667h-170.666666a21.333333 21.333333 0 0 1-21.333334-21.333334zM533.333333 544a21.333333 21.333333 0 0 1 21.333334-21.333333h85.333333a21.333333 21.333333 0 0 1 0 42.666666h-85.333333a21.333333 21.333333 0 0 1-21.333334-21.333333z" fill="#FFFFFF" p-id="5623"></path><path d="M363.776 481.024a59.178667 59.178667 0 1 0 0-118.357333 59.178667 59.178667 0 0 0 0 118.357333z" fill="#FFFFFF" p-id="5624"></path><path d="M363.776 618.666667C311.850667 618.666667 256 619.008 256 588.330667a107.776 107.776 0 0 1 99.712-107.477334l14.421333-0.085333a107.818667 107.818667 0 0 1 101.418667 107.52c0 30.72-55.893333 30.378667-107.776 30.378667z" fill="#FFFFFF" p-id="5625"></path></svg>
`;
const indexIcon =`
  <svg t="1759289614931" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4747" width="32" height="32"><path d="M411.7 403.9a172.1 171.4 0 1 0 344.2 0 172.1 171.4 0 1 0-344.2 0Z" fill="#80F688" p-id="4748"></path><path d="M863.6 409.5c-19.1-45.1-46.4-85.7-81.2-120.5s-75.3-62.1-120.5-81.2C615.2 188 565.6 178 514.4 178s-100.8 10-147.5 29.8c-45.1 19.1-85.7 46.4-120.5 81.2s-62.1 75.3-81.2 120.5c-19.8 46.7-29.8 96.4-29.8 147.5s10 100.8 29.8 147.5c19.1 45.1 46.4 85.7 81.2 120.5s75.3 62.1 120.5 81.2C413.6 926 463.2 936 514.4 936s100.8-10 147.5-29.8c45.1-19.1 85.7-46.4 120.5-81.2s62.1-75.3 81.2-120.5c19.8-46.7 29.8-96.4 29.8-147.5s-10-100.8-29.8-147.5z m-106.7 390C692.1 864.3 606 900 514.4 900h-0.8c-1.9-10.4-2.9-21-2.9-31.8 0-94.3 76-170.9 169.8-170.9 40.9 0 91 17.7 120.5 42.1 0.9 0.7 1.9 1.4 2.8 1.9-13.3 20.8-29 40.4-46.9 58.2z m65.7-91.6C786.2 678.8 729 659 680.4 659c-114.7 0-207.7 93.6-207.7 209.2 0 10 0.7 19.8 2.1 29.6-76.6-8.8-147.6-42.8-202.9-98.2-64.8-64.8-100.5-151-100.5-242.6s35.7-177.8 100.5-242.5S422.8 214 514.4 214s177.8 35.7 242.5 100.5S857.4 465.4 857.4 557c0 53.2-12 104.5-34.8 150.9z" fill="#00D8FF" p-id="4749"></path><path d="M545.2 283.6c-5.9-16.9-9.1-35-9.1-53.9 0-90 72.7-163 162.4-163s162.4 73 162.4 163c0 29.2-7.6 56.6-21 80.2-3.1 8.7-6.4 17.1-9.8 25.1-8.1 19.3-41.4 82.9-99.9 190.6-9.5 17.6-31.5 24.1-49.1 14.6-6.1-3.3-11.2-8.3-14.5-14.4C606 415.1 570.5 347.7 560 323.5c-6.8-15.4-11.7-28.7-14.8-39.9z" fill="#00A5FF" p-id="4750"></path><path d="M615.2 238.7a81.3 81.6 0 1 0 162.6 0 81.3 81.6 0 1 0-162.6 0Z" fill="#FEFFFF" p-id="4751"></path><path d="M113.5 517.6a110.8 110.4 0 1 0 221.6 0 110.8 110.4 0 1 0-221.6 0Z" fill="#F1F2F2" p-id="4752"></path></svg>
`;
</script>

<style scoped>
@import '@/css/Admin/AdminLayout';
@import '@/css/Switchthemes/theme-switch.css';
</style>