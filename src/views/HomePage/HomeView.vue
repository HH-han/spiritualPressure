<template>
  <div class="">
    <!-- 顶部导航栏 -->
    <header>
      <Home_2 />
    </header>
    <!-- 轮播图 -->
    <div class="banner">
      <div class="banner-content-SeamlessCarousel">
        <transition-group>
          <SeamlessCarousel :items="slides" :interval="5000" :transitionDuration="700" aspectRatio="16/9" />
        </transition-group>
      </div>
      <!-- 搜索栏 -->
      <div class="homeview-hero-content">
        <h1 class="homeview-hero-title">探索世界的奇迹</h1>
        <p class="homeview-hero-subtitle">发现地球上最令人惊叹的地方，创造终生难忘的回忆</p>
        <div class="search_input">
          <input v-model="searchKeyword" type="text" placeholder="🔍 输入关键词" @keyup.enter="search">
          <button class="search_button-home-5" @click="search">搜索</button>
        </div>
      </div>
    </div>
    <!-- 景点展示框 -->
    <main class="backgroundgradient">
      <!-- 推荐景点展示框 -->
      <AttractionsDisplay />
      <!-- 推荐按钮 -->
      <div class="header_center">
        <div class="header">
          <button class="header_button_home-5" @click="navigateTo('/hometravelguides')">
            <svg t="1750170581389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="4419">
              <path
                d="M682.035 111.258H244.992c-68.096 0-123.34 55.193-123.34 123.34v538.266c0 68.096 55.193 123.34 123.34 123.34h291.02a95.084 95.084 0 0 1-3.89-47.462l10.29-60.057-43.622-42.496c-26.163-25.498-35.379-62.874-24.115-97.587 11.264-34.714 40.755-59.546 76.851-64.82l60.263-8.755 26.931-54.63c16.18-32.717 48.896-53.095 85.402-53.095 33.587 0 63.897 17.255 81.152 45.466v-278.22c0.102-68.097-55.092-123.29-123.239-123.29zM393.216 655.002h-86.733c-26.112 0-47.309-21.197-47.309-47.31s21.197-47.308 47.31-47.308h86.732c26.112 0 47.309 21.197 47.309 47.309s-21.197 47.309-47.309 47.309z m183.706-155.853H306.483c-26.112 0-47.309-21.197-47.309-47.309s21.197-47.309 47.31-47.309h270.489c26.112 0 47.309 21.197 47.309 47.309s-21.197 47.309-47.36 47.309z m36.454-155.853H306.483c-26.112 0-47.309-21.197-47.309-47.309s21.197-47.309 47.31-47.309h306.892c26.112 0 47.309 21.197 47.309 47.31s-21.197 47.308-47.309 47.308z"
                fill="#1296db" p-id="4420"></path>
              <path
                d="M757.453 546.1l31.897 64.614a37.171 37.171 0 0 0 27.853 20.275l71.322 10.342c30.361 4.403 42.496 41.728 20.531 63.13l-51.61 50.278a37.09 37.09 0 0 0-10.65 32.768l12.186 71.015c5.172 30.259-26.572 53.299-53.708 39.014L741.53 864a36.951 36.951 0 0 0-34.458 0l-63.744 33.536c-27.136 14.285-58.88-8.806-53.709-39.014l12.186-71.015a37.087 37.087 0 0 0-10.65-32.768l-51.61-50.278c-21.964-21.402-9.83-58.727 20.532-63.13l71.321-10.342a36.93 36.93 0 0 0 27.853-20.275l31.898-64.615c13.465-27.545 52.685-27.545 66.304 0z"
                fill="#1296db" p-id="4421"></path>
              <path
                d="M724.224 467.251c33.587 0 63.898 17.255 81.152 45.466v-278.17c0-68.096-55.194-123.34-123.34-123.34H244.991c-68.096 0-123.34 55.193-123.34 123.34v538.266c0 68.096 55.193 123.34 123.34 123.34h66.048c79.258-5.324 154.47-25.497 222.874-57.753l8.55-49.715-43.622-42.496c-26.164-25.498-35.38-62.874-24.116-97.587 11.264-34.714 40.756-59.546 76.852-64.82l60.262-8.755 26.931-54.63c16.23-32.82 48.947-53.146 85.453-53.146z m-331.008 187.75h-86.733c-26.112 0-47.309-21.196-47.309-47.308s21.197-47.309 47.31-47.309h86.732c26.112 0 47.309 21.197 47.309 47.309 0 26.163-21.197 47.309-47.309 47.309zM576.922 499.15H306.483c-26.112 0-47.309-21.197-47.309-47.309s21.197-47.309 47.31-47.309h270.489c26.112 0 47.309 21.197 47.309 47.309s-21.197 47.309-47.36 47.309z m36.454-155.853H306.483c-26.112 0-47.309-21.197-47.309-47.309s21.197-47.309 47.31-47.309h306.892c26.112 0 47.309 21.197 47.309 47.31s-21.197 47.308-47.309 47.308z"
                fill="#1296db" p-id="4422"></path>
              <path
                d="M599.091 802.662a625.08 625.08 0 0 0 191.847-189.184c-0.564-0.921-1.127-1.843-1.639-2.816l-31.897-64.614c-13.568-27.494-52.839-27.494-66.407 0l-31.897 64.614a37.171 37.171 0 0 1-27.853 20.276l-71.322 10.342c-30.361 4.403-42.496 41.728-20.531 63.13l51.61 50.278a37.09 37.09 0 0 1 10.65 32.768l-2.56 15.206zM682.035 111.258H244.992c-68.096 0-123.34 55.193-123.34 123.34v441.805c56.114-2.048 110.335-11.469 161.689-27.392a47.227 47.227 0 0 1-24.218-41.267c0-26.112 21.197-47.309 47.309-47.309h86.784c15.872 0 29.9 7.834 38.451 19.815 36.915-23.45 71.117-50.688 102.195-81.101H306.483c-26.112 0-47.309-21.197-47.309-47.309s21.197-47.309 47.31-47.309h270.489c11.008 0 21.094 3.789 29.081 10.087a618.291 618.291 0 0 0 111.412-298.19c-11.213-3.327-23.092-5.17-35.43-5.17z m-68.659 232.038H306.483c-26.112 0-47.309-21.197-47.309-47.309s21.197-47.309 47.31-47.309h306.892c26.112 0 47.309 21.197 47.309 47.31s-21.197 47.308-47.309 47.308z"
                fill="#1296db" p-id="4423"></path>
              <path
                d="M301.158 342.989c-23.603-2.663-41.984-22.63-41.984-46.95 0-26.113 21.197-47.31 47.31-47.31h100.095a621.914 621.914 0 0 0 92.98-137.471H244.991c-68.096 0-123.34 55.193-123.34 123.34v195.994c64.972-19.507 125.44-49.357 179.506-87.603z"
                fill="#1296db" p-id="4424"></path>
            </svg>
            <span>攻略群</span>
          </button>
          <button class="header_button_home-5" @click="navigateTo('/travelfreely')">
            <svg t="1744295791957" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="4337">
              <path
                d="M667.707645 709.00028l-5.304957 59.214786c119.719966 17.061887 214.779053 52.762812 214.779053 94.342201 0 58.067768-185.816858 105.095491-365.181742 105.095491-179.364884 0-365.181742-47.027723-365.181742-105.095491 0-41.005881 92.908429-76.42005 210.477737-93.768692l-5.304957-59.358163C154.704004 731.08037 12.33044 791.298796 12.33044 862.41389c0 89.323999 223.66844 161.58611 499.66956 161.58611C788.00112 1024 1011.66956 951.737889 1011.66956 862.41389 1011.66956 790.868664 867.288715 730.076729 667.707645 709.00028L667.707645 709.00028zM667.707645 709.00028"
                fill="#1296db" p-id="4338"></path>
              <path
                d="M487.625875 610.356763l68.104173 0 0 271.126295L487.625875 881.483058 487.625875 610.356763 487.625875 610.356763zM487.625875 610.356763"
                fill="#1296db" p-id="4339"></path>
              <path
                d="M876.608233 481.173901 710.00392 379.089331l-425.543545 0L284.460375 583.401848l423.536264 0L876.608233 481.173901zM876.608233 481.173901"
                fill="#1296db" p-id="4340"></path>
              <path
                d="M881.91319 339.230468l0-218.363484-649.49874 0-166.604313 109.110053 168.611593 109.25343L881.91319 339.230468zM881.91319 339.230468"
                fill="#1296db" p-id="4341"></path>
              <path
                d="M487.625875 0l68.104173 0 0 93.912069L487.625875 93.912069 487.625875 0 487.625875 0zM487.625875 0"
                fill="#1296db" p-id="4342"></path>
            </svg>
            <span>当地游</span>

          </button>
          <button class="header_button_home-5" @click="navigateTo('/travelworld')">
            <svg t="1744295897404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="5445">
              <path
                d="M676.538182 609.745455m-345.832727 0a345.832727 345.832727 0 1 0 691.665454 0 345.832727 345.832727 0 1 0-691.665454 0Z"
                fill="#599BE6" opacity=".4" p-id="5446"></path>
              <path
                d="M950.690909 112.174545a111.010909 111.010909 0 0 0-145.687273-28.16l-193.629091 111.709091a32.116364 32.116364 0 0 1-24.436363 3.025455L192.930909 84.247273a31.418182 31.418182 0 0 0-23.272727 2.56A31.650909 31.650909 0 0 0 162.909091 137.309091l159.650909 154.065454a44.683636 44.683636 0 0 1-8.610909 70.981819l-77.963636 45.149091a34.909091 34.909091 0 0 1-20.945455 4.654545l-148.712727-10.938182a37.469091 37.469091 0 0 0-20.48 4.654546l-24.901818 14.196363a36.072727 36.072727 0 0 0-6.516364 58.414546l186.181818 167.563636a44.683636 44.683636 0 0 0 52.130909 5.352727l103.563637-59.345454 8.378181-4.189091L916.945455 268.567273a107.985455 107.985455 0 0 0 33.745454-156.392728zM651.636364 957.44a319.534545 319.534545 0 0 1-318.370909-313.250909v-4.887273a29.090909 29.090909 0 0 1 58.181818 0v3.956364a260.189091 260.189091 0 1 0 389.352727-229.701818 29.090909 29.090909 0 0 1 29.090909-50.501819A318.370909 318.370909 0 0 1 651.636364 957.44z"
                fill="#5BA5EF" p-id="5447"></path>
              <path
                d="M651.636364 957.44c-89.832727 0-136.843636-160.116364-136.843637-318.138182a760.32 760.32 0 0 1 8.378182-114.734545 29.090909 29.090909 0 0 1 57.483636 8.843636 704 704 0 0 0-7.68 105.890909c0 168.029091 51.898182 259.956364 78.661819 259.956364s78.894545-93.090909 78.894545-259.956364A572.509091 572.509091 0 0 0 698.181818 439.621818a29.090909 29.090909 0 0 1 54.458182-20.712727 625.803636 625.803636 0 0 1 35.84 221.090909c0 157.323636-47.010909 317.44-136.843636 317.44z"
                fill="#5BA5EF" p-id="5448"></path>
              <path
                d="M930.909091 669.090909H361.890909a29.556364 29.556364 0 0 1-29.090909-29.323636 28.858182 28.858182 0 0 1 29.090909-28.858182H930.909091a29.090909 29.090909 0 1 1 0 58.181818z"
                fill="#5BA5EF" p-id="5449"></path>
            </svg>
            <span>自由行</span>

          </button>
          <button class="header_button_home-5" @click="navigateTo('/travelteam')">
            <svg t="1744296054936" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="6834">
              <path
                d="M435.2 153.6m102.4 0l307.2 0q102.4 0 102.4 102.4l0 409.6q0 102.4-102.4 102.4l-307.2 0q-102.4 0-102.4-102.4l0-409.6q0-102.4 102.4-102.4Z"
                fill="#1ED7FF" opacity=".5" p-id="6835"></path>
              <path
                d="M179.2 51.2a102.4 102.4 0 0 0-102.4 102.4v742.4a76.8 76.8 0 1 0 153.6 0v-230.4h409.6a102.4 102.4 0 0 0 102.4-102.4V153.6a102.4 102.4 0 0 0-102.4-102.4H179.2z"
                fill="#1EA8FF" opacity=".5" p-id="6836"></path>
            </svg>
            <span>跟团游</span>

          </button>
          <button class="header_button_home-5" @click="navigateTo('/travelcruise')">
            <svg t="1744296104274" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="8938">
              <path
                d="M1.3056 604.03712l86.0672 199.31648h774.60992l158.54592-199.31648H1.3056z m842.56256 131.36384a31.70816 31.70816 0 1 1 0-63.42144 31.70816 31.70816 0 0 1 0 63.42144z"
                fill="#6AADFF" p-id="8939"></path>
              <path
                d="M724.72064 191.81568h87.43936v262.7328h-87.43936V191.81568zM575.232 191.81568h87.43936v262.7328H575.232V191.81568z"
                fill="#FF9B0B" p-id="8940"></path>
              <path
                d="M510.91968 477.19936V422.84032h-400.896v147.92704h765.55264V477.19936H510.91968z m-317.29152 49.82784a31.70816 31.70816 0 1 1 0-63.42144 31.70816 31.70816 0 0 1 0 63.42144z m117.78048 1.4848a31.70816 31.70816 0 1 1 0-63.42144 31.70816 31.70816 0 0 1 0 63.42144z m111.50336 0.4864a31.70816 31.70816 0 1 1 0-63.42144 31.70816 31.70816 0 0 1 0 63.42144z"
                fill="#6AADFF" p-id="8941"></path>
            </svg>
            <span>邮轮</span>
          </button>
        </div>
      </div>
      <div class="content_5">
        <!-- 安全提示 -->
        <div class="recommend-left">
          <div class="recommend-left_button">
            <button @click="navigateTo('/SafetyTips')">
              <span>旅游知识安全提示</span>
              <svg t="1754492983638" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="53974">
                <path
                  d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m187.733333-546.133333l-256-256C435.2 213.333333 426.666667 213.333333 409.6 213.333333c-8.533333 0-25.6 0-34.133333 8.533334-17.066667 17.066667-17.066667 42.666667 0 59.733333l230.4 230.4-230.4 230.4c-17.066667 17.066667-17.066667 42.666667 0 59.733333 17.066667 17.066667 42.666667 17.066667 59.733333 0l256-264.533333c25.6-17.066667 25.6-42.666667 8.533333-59.733333z"
                  fill="#1296db" p-id="53975"></path>
              </svg>
            </button>
          </div>
          <!-- 攻略/当地游推荐 -->
          <div class="recommend-left_boxshadow">
            <div class="recommend-left_tj">
              <h3>攻略推荐</h3>
              <button @click="navigateTo('/RecommendAtion')">更多</button>
            </div>
            <div class="recommend-left_list">
              <div class="recommend-left_imga">
                <img src="@/assets/scenery/风景1.webp" alt="旅游攻略推荐">
              </div>
              <div class="recommend-left_js">
                <div>
                  <h3>第一次去夏威夷欧胡岛玩什么？</h3>
                </div>
                <div>
                  <p>2024-12-1</p>
                  <p>自古繁华地·今朝更胜昔 浙江，一片被上天眷顾的土地。</p>
                </div>
              </div>
              <div class="recommend-left_zx">
                <h3>旅游网最新资讯</h3>
                <p>
                  <span>2024-12-1</span>
                  <button>
                    <span>“云上战疫</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 旅游展示 -->
        <div class="blog-post-container">
          <!-- 博客文章容器，居中显示 -->
          <div class="blog-post-container-center">
            <!-- 左侧按钮组：热门/筛选/最新 -->
            <div class="blog-post-container-left">
              <div class="blog-post-container-left-button">
                <button>热门景点</button>
                <button>
                  <svg t="1754490897197" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="31304" width="16" height="16">
                    <path
                      d="M794.102 819.99C759.68 852.247 713.397 872 662.5 872 556.185 872 470 785.815 470 679.5S556.185 487 662.5 487 855 573.185 855 679.5c0 23.663-4.27 46.328-12.08 67.268l99.814 67.842c20.098 13.66 25.316 41.026 11.656 61.124-13.66 20.098-41.026 25.316-61.124 11.656l-99.164-67.4zM84 147c-24.3 0-44-19.7-44-44s19.7-44 44-44h834c24.3 0 44 19.7 44 44s-19.7 44-44 44H84z m0 498.5c-24.3 0-44-19.7-44-44s19.7-44 44-44h251c24.3 0 44 19.7 44 44s-19.7 44-44 44H84z m0-249c-24.3 0-44-19.7-44-44s19.7-44 44-44h834c24.3 0 44 19.7 44 44s-19.7 44-44 44H84z m0 499c-24.3 0-44-19.7-44-44s19.7-44 44-44h251c24.3 0 44 19.7 44 44s-19.7 44-44 44H84zM662.5 784c57.714 0 104.5-46.786 104.5-104.5S720.214 575 662.5 575 558 621.786 558 679.5 604.786 784 662.5 784z"
                      fill="#000000" p-id="31305"></path>
                  </svg>
                  <span>筛选</span>
                </button>
              </div>
              <button>最新景点</button>
              <button @click="isshowComponent = true">
                <span>更多</span>
              </button>
              <!-- 更多 -->
              <MoreRecommend v-if="isshowComponent" @close="NoMore" />
            </div>
            <!-- 右侧按钮：写游记 -->
            <div class="blog-post-container-right">
              <button @click="showNote = true">写游记</button>
            </div>
            <!-- 笔记 -->
            <MyNote v-if="showNote" @close="handleClose" />
          </div>
          <div class="blog-post" v-for="blog in blogs" :key="blog.id">
            <div>
              <div class="flex-align_right">
                <div class="blog-post-image">
                  <img :src="blog.coverImage" :alt="blog.title" @error="handleImageError">
                </div>
                <div class="blog-post_text">
                  <h3>{{ blog.title }}</h3>
                  <p>{{ blog.content }}</p>
                </div>
              </div>
              <div class="blog-post_mb">
                <div class="blog-post_math">
                  <!-- <p>{{ blog.location }}</p> -->
                  <button @click="showLocation(blog.location)">
                    <svg t="1739800788491" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="7237" width="16" height="16">
                      <path
                        d="M124.488778 870.784112a383.039719 153.215888 0 1 0 766.079439 0 383.039719 153.215888 0 1 0-766.079439 0Z"
                        fill="#AFFCFE" p-id="7238"></path>
                      <path
                        d="M516.466091 0.00715c210.671846-1.276799 381.76292 167.260677 383.039719 377.932523 0 208.118248-383.039719 515.826822-383.039719 515.826822S133.426372 586.057921 133.426372 377.939673C134.703171 167.267828 305.794245-1.269649 516.466091 0.00715z"
                        fill="#2F77F1" p-id="7239"></path>
                    </svg>
                    <span>定位</span>
                  </button>
                  <!-- <p>收藏 {{ blog.favorites }}</p> -->
                  <button @click="toggleFavorite(blog.id)">
                    <svg t="1739800833940" class="home-icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="11672" width="16" height="16">
                      <path
                        d="M899.76 295.37l-170.72-24.81a24.622 24.622 0 0 1-18.55-13.48l-76.35-154.7C611.03 55.56 564.23 26.46 512 26.46c-52.22 0-99.03 29.1-122.14 75.93l-76.35 154.7a24.645 24.645 0 0 1-18.55 13.48l-170.72 24.81c-34.19 4.97-64.19 22.2-85.26 47.67h946.03c-21.07-25.48-51.07-42.71-85.25-47.68z"
                        fill="#FFFBF2" p-id="11673"></path>
                      <path
                        d="M48.76 527.69L172.29 648.1a24.631 24.631 0 0 1 7.09 21.81l-2.61 15.21h670.47l-2.61-15.21a24.661 24.661 0 0 1 7.08-21.81l123.53-120.42c37.4-36.45 50.6-89.95 34.47-139.62-5.46-16.81-13.91-32-24.7-45.03H38.99c-10.78 13.03-19.23 28.22-24.7 45.03-16.14 49.68-2.93 103.18 34.47 139.63z"
                        fill="#FEF5DB" p-id="11674"></path>
                      <path
                        d="M150.21 839.94c-8.83 51.47 11.93 102.52 54.19 133.22 23.88 17.35 51.8 26.16 79.93 26.16 21.64 0 43.41-5.22 63.51-15.79l152.7-80.28a24.658 24.658 0 0 1 22.93 0l152.7 80.28c20.11 10.57 41.86 15.79 63.51 15.79 28.12 0 56.06-8.81 79.93-26.16 42.25-30.7 63.01-81.74 54.19-133.22l-26.55-154.81H176.77l-26.56 154.81z"
                        fill="#FCE9B5" p-id="11675"></path>
                      <path
                        d="M975.24 527.69c37.4-36.45 50.6-89.95 34.47-139.62-16.14-49.67-58.27-85.19-109.95-92.7l-170.72-24.81a24.622 24.622 0 0 1-18.55-13.48l-76.35-154.7C611.03 55.56 564.23 26.46 512 26.46c-52.22 0-99.03 29.1-122.14 75.93l-76.35 154.7a24.645 24.645 0 0 1-18.55 13.48l-170.72 24.81c-51.68 7.51-93.81 43.03-109.95 92.7S11.36 491.25 48.76 527.7l123.53 120.41a24.631 24.631 0 0 1 7.09 21.81l-29.16 170.03c-8.83 51.47 11.93 102.52 54.19 133.22 23.88 17.35 51.8 26.16 79.93 26.16 21.64 0 43.41-5.22 63.51-15.79l152.7-80.28a24.658 24.658 0 0 1 22.93 0l152.7 80.28c20.11 10.57 41.86 15.79 63.51 15.79 28.12 0 56.06-8.81 79.93-26.16 42.25-30.7 63.01-81.74 54.19-133.22l-29.16-170.03a24.661 24.661 0 0 1 7.08-21.81l123.51-120.42z m-151.45 91.77a64.632 64.632 0 0 0-18.59 57.21l29.16 170.03c6.33 36.91-7.98 72.08-38.27 94.09-30.29 22.01-68.17 24.75-101.32 7.32l-152.7-80.28a64.636 64.636 0 0 0-30.08-7.43c-10.33 0-20.66 2.48-30.08 7.43l-152.7 80.28c-33.15 17.42-71.02 14.69-101.32-7.32-30.29-22.01-44.6-57.19-38.27-94.09l29.16-170.03a64.605 64.605 0 0 0-18.59-57.21L76.68 499.05c-26.81-26.14-35.92-63.01-24.34-98.62 11.57-35.61 40.6-60.09 77.66-65.48l170.72-24.81a64.634 64.634 0 0 0 48.67-35.36l76.35-154.7C442.3 86.51 474.55 66.46 512 66.46s69.7 20.05 86.27 53.63l76.35 154.7a64.634 64.634 0 0 0 48.67 35.36L894 334.95c37.06 5.39 66.09 29.86 77.66 65.48 11.57 35.61 2.47 72.48-24.34 98.62L823.79 619.46z"
                        fill="#333333" p-id="11676"></path>
                      <path
                        d="M720.89 459.34c-34.71 16.2-64.12 41.78-85.04 73.97C614.36 566.38 603 604.79 603 644.39c0 26.47 5 52.23 14.85 76.57 3.15 7.78 10.64 12.5 18.54 12.5 2.5 0 5.04-0.47 7.5-1.47 10.24-4.15 15.18-15.81 11.03-26.04-7.9-19.55-11.92-40.26-11.92-61.56 0-63.52 37.21-121.93 94.8-148.8 10.01-4.67 14.34-16.57 9.67-26.58-4.67-10.01-16.58-14.34-26.58-9.67z"
                        fill="#333333" p-id="11677"></path>
                    </svg>
                    <span>收藏</span>
                  </button>
                  <!-- <p>点赞 {{ blog.likes }}</p> -->
                  <button @click="addLike(blog.id)">
                    <svg t="1739800868629" class="home-icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="12796" width="16" height="16">
                      <path
                        d="M102.4 880.64c-57.344 0-102.4-45.056-102.4-102.4V409.6c0-57.344 45.056-102.4 102.4-102.4s102.4 45.056 102.4 102.4v368.64c0 57.344-45.056 102.4-102.4 102.4z m0-491.52c-10.24 0-20.48 10.24-20.48 20.48v368.64c0 10.24 10.24 20.48 20.48 20.48s20.48-10.24 20.48-20.48V409.6c0-10.24-10.24-20.48-20.48-20.48z"
                        fill="#E5BD41" p-id="12797"></path>
                      <path
                        d="M829.44 921.6H450.56c-90.112 0-163.84-73.728-163.84-163.84V512c0-90.112 73.728-163.84 163.84-163.84h30.72c22.528 0 40.96 18.432 40.96 40.96s-18.432 40.96-40.96 40.96H450.56c-45.056 0-81.92 36.864-81.92 81.92v245.76c0 45.056 36.864 81.92 81.92 81.92h378.88c45.056 0 81.92-36.864 81.92-81.92v-4.096L942.08 468.992c0-18.432-4.096-38.912-81.92-38.912h-153.6c-22.528 0-40.96-18.432-40.96-40.96s18.432-40.96 40.96-40.96H860.16c108.544 0 163.84 40.96 163.84 122.88v4.096l-30.72 284.672c-2.048 90.112-73.728 161.792-163.84 161.792z"
                        fill="#333333" p-id="12798"></path>
                      <path
                        d="M696.32 430.08c-18.432 0-34.816-12.288-38.912-30.72l-34.816-143.36v-2.048c-8.192-40.96-40.96-69.632-81.92-69.632-6.144 0-10.24 2.048-12.288 6.144-2.048 2.048-4.096 6.144-6.144 8.192l10.24 188.416c2.048 22.528-16.384 40.96-38.912 43.008-22.528 2.048-40.96-16.384-43.008-38.912l-12.288-202.752c0-10.24 2.048-20.48 10.24-28.672 4.096-6.144 10.24-18.432 20.48-28.672 20.48-18.432 45.056-28.672 71.68-28.672 79.872 0 147.456 57.344 161.792 135.168l34.816 141.312c6.144 22.528-8.192 45.056-30.72 49.152-4.096 2.048-6.144 2.048-10.24 2.048zM479.232 145.408h8.192-10.24 2.048z"
                        fill="#333333" p-id="12799"></path>
                    </svg>
                    <span>{{ blog.likes }}</span>
                  </button>
                  <button @click="showDetail(blog)">
                    <svg t="1746974057452" class="home-icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="2660" width="16" height="16">
                      <path
                        d="M1024 512C1024 229.230209 794.769796 0 512 0 229.230204 0 0 229.230209 0 512 0 794.769791 229.230204 1024 512 1024 794.769796 1024 1024 794.769791 1024 512ZM70.62069 512C70.62069 268.232939 268.232934 70.62069 512 70.62069 755.767066 70.62069 953.37931 268.232939 953.37931 512 953.37931 755.767061 755.767066 953.37931 512 953.37931 268.232934 953.37931 70.62069 755.767061 70.62069 512ZM512 317.793103C541.252043 317.793103 564.965517 294.079633 564.965517 264.827586 564.965517 235.57554 541.252043 211.862069 512 211.862069 482.747957 211.862069 459.034483 235.57554 459.034483 264.827586 459.034483 294.079633 482.747957 317.793103 512 317.793103ZM476.689655 794.482759C476.689655 813.984124 492.498644 829.793103 512 829.793103 531.501356 829.793103 547.310345 813.984124 547.310345 794.482759L547.310345 406.068966C547.310345 386.567601 531.501356 370.758621 512 370.758621 492.498644 370.758621 476.689655 386.567601 476.689655 406.068966L476.689655 794.482759Z"
                        fill="#389BFF" p-id="2661"></path>
                    </svg>
                    <span>详情</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 分页 -->
          <div class="block">
            <div class="paging-container">
              <div class="paging-info">共 <span class="paging-total">{{ total }}</span> 条</div>

              <div class="paging-size-selector">
                <span>每页显示</span>
                <select class="paging-size-select" @change="handleSizeChange($event.target.value)" :value="pageSize">
                  <option value="10">10条</option>
                  <option value="20">20条</option>
                  <option value="50">50条</option>
                  <option value="100">100条</option>
                </select>
              </div>

              <ul class="paging-pages">
                <li class="paging-item paging-prev" @click="currentPage > 1 && handleCurrentChange(currentPage - 1)"
                  :class="{ disabled: currentPage === 1 }">
                  <i class="paging-icon">‹</i>
                </li>

                <template v-for="page in computedVisiblePages" :key="page">
                  <li v-if="page === '...'" class="paging-item paging-ellipsis">...</li>
                  <li v-else class="paging-item" :class="{ active: page === currentPage }"
                    @click="handleCurrentChange(page)">
                    {{ page }}
                  </li>
                </template>

                <li class="paging-item paging-next"
                  @click="currentPage < totalPages && handleCurrentChange(currentPage + 1)"
                  :class="{ disabled: currentPage === totalPages }">
                  <i class="paging-icon">›</i>
                </li>
              </ul>

              <div class="paging-jumper">
                <span>前往</span>
                <input type="number" class="paging-jumper-input" v-model.number="jumperPage" @keyup.enter="jumpToPage"
                  @input="validatePageInput" min="1" :max="totalPages">
                <span v-if="!jumperError">页</span>
                <span v-else class="error-text">{{ jumperError }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 详情模态框 -->
        <div v-if="isDetailVisible" class="attractions-modal-overlay" @click.self="closeDetail">
          <div class="attractions-modal-content" @click.stop>
            <div class="attractions-modal-content-text">
              <div class="attractions-modal-content-img">
                <img :src="selectedBlog.coverImage" :alt="selectedBlog.title" @error="handleImageError">
              </div>
              <div class="selectedBlog-modal-content-text">
                <h2>{{ selectedBlog.title }}</h2>
                <div class="selectedBlog-container">
                  <p>{{ selectedBlog.content }}</p>
                  <p>
                    <strong>地点:{{ selectedBlog.location }}</strong>
                  </p>
                  <p>
                    <strong>收藏数:{{ selectedBlog.favorites }}</strong>
                  </p>
                  <p>
                    <strong>点赞数:{{ selectedBlog.likes }}</strong>
                  </p>
                  <p>
                    <strong class="price">价格:{{ selectedBlog.price }}￥</strong>
                  </p>
                </div>

              </div>
            </div>
            <div class="btn-container-collection">
              <!-- 按钮 -->
              <button @click="OrderDetails(selectedBlog.id)" class="btn pay">前往购买</button>
              <TavoriteBtn @Dataforwarding="Dataforwarding" />
            </div>
          </div>
        </div>
        <div>
          <!-- 引入自定义收藏提示框 -->
          <CollectionTips ref="collectiontips" />
        </div>
      </div>
      <!-- 底部文字 -->
      <div>
        <p>© 2025 旅游网</p>
        <div>
          <h1>Welcome to the Home Page</h1>
          <p>This is the Home page.</p>
          <p>Here you can find information about our products and services.</p>
        </div>
      </div>
    </main>
    <!-- 底部栏 -->
    <footer>
      <BottomPage />
    </footer>
  </div>
  <!-- 移动端适配 -->
  <div class="navbar_move">
    <NavigationBar />
  </div>
</template>
<script setup>
import { getAttractionBlogs, likeAttraction, collectAttraction, getSlideshow } from '@/api/travel'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import Home_2 from '@/components/NavigationComponent/HomeHeader.vue'
import MyNote from '@/components/DisplayBox/MyNote.vue'
import MoreRecommend from '@/components/DisplayBox/MoreRecommend.vue'
import BottomPage from '@/components/DisplayBox/BottomPage.vue'
import CollectionTips from '@/components/PromptComponent/CollectionTips.vue'
import AttractionsDisplay from '@/views/HomePage/AttractionsDisplay.vue'
import SeamlessCarousel from '@/views/HomePage/SeamlessCarousel.vue'
import NavigationBar from '@/components/ResponseComponent/NavigationBar.vue';
import TavoriteBtn from '@/views/Mypage/TavoriteBtn.vue'
import { ElMessage } from "element-plus";
import { fa, lo } from 'element-plus/es/locales.mjs'

// 轮播图数据
const slides = ref([
  {
    image: '',
    title: '',
    location: '',
    description: ''
  },
])

// 获取轮播图数据
const fetchSlideshow = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    }
    const result = await getSlideshow(params)
    if (result.data && result.data.list) {
      slides.value = result.data.list.map((item) => ({
        image: item.image || '默认图片链接',
        title: item.title || '默认标题',
        location: item.location || '默认位置',
        description: item.description || '默认描述'
      }))
    }
  } catch (error) {
    console.error('获取轮播图数据失败：', error)
  }
}

// 路由
const router = useRouter()

// 控制显示状态
const showNote = ref(false)
const isshowComponent = ref(false)

// 轮播图相关数据
const currentIndex = ref(0)
const interval = ref(null)
const startX = ref(0)
// 搜索相关
const searchKeyword = ref('')

// 组件引用
const collectiontips = ref(null)
// 页面跳转
const navigateTo = (path) => {
  router.push(path);
};
// 跳转购物车页面
const OrderDetails = (blogsId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }
  const selectedBlog = blogs.value.find((b) => b.id === blogsId)
  if (selectedBlog) {
    router.push({
      name: 'orderdetails',
      query: {
        item: JSON.stringify({
          id: selectedBlog.id,
          name: selectedBlog.title,
          price: selectedBlog.price,
          image: selectedBlog.coverImage,
          details: selectedBlog.content,
          location: selectedBlog.location,
          rating: selectedBlog.favorites,
        })
      }
    })
  }
}

// 搜索方法
const search = () => {
  if (searchKeyword.value.trim()) {
    currentPage.value = 1
    fetchBlogs()
  }
}

// 弹窗控制
const handleClose = () => {
  showNote.value = false
}

const NoMore = () => {
  isshowComponent.value = false
}

// 定位功能
const showLocation = (location) => {
  router.push({ 
    name: 'maploading', 
    query: {
      location,
      message: `正在打开地图：${location}`
    }
  });
  console.log('正在打开地图...', location)
}

// 博客数据
const blogs = ref([])


// 默认图片
const defaultImage = new URL('@/assets/defaultimage/moren.webp', import.meta.url).href

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = defaultImage
}

// 获取数据
const fetchBlogs = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    };
    const response = await getAttractionBlogs(params);
    if (response.code === "0") {
      blogs.value = response.data.list
      total.value = response.data.total
    } else {
      console.error('无法获取博客:', response.msg)
    }
  } catch (error) {
    console.error('获取博客时出错:', error)
  }
}

// 点赞功能
const addLike = async (id) => {
  try {
    const res = await likeAttraction(id)
    if (res.code === "0") {
      const blog = blogs.value.find((b) => b.id === id)
      if (blog) blog.likes++
      ElMessage.success("点赞成功");
    } else {
      console.error('Failed to like blog:', res.msg)
    }
  } catch (error) {
    console.error('Error liking blog:', error)
  }
}

// 收藏功能
const toggleFavorite = async (id) => {
  try {
    const res = await collectAttraction(id)
    if (res.code === "0") {
      const blog = blogs.value.find((b) => b.id === id)
      if (blog) blog.favorites++
      ElMessage.success("已收藏");
    } else {
      console.error('Failed to favorite blog:', res.msg)
      ElMessage.success("取消收藏");
    }
  } catch (error) {
    console.error('Error favoriting blog:', error)
  }
}

// 详情模态框相关
const isDetailVisible = ref(false) // 控制模态框显示
const selectedBlog = ref(null) // 当前选中的博客

// 显示详情
const showDetail = (blog) => {
  selectedBlog.value = blog
  isDetailVisible.value = true
}

// 关闭详情
const closeDetail = () => {
  isDetailVisible.value = false
}
// 分页相关数据
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const jumperPage = ref(1)
const jumperError = ref('')

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 计算可见页码
const computedVisiblePages = computed(() => {
  const pages = []
  const maxVisible = 5 // 最多显示5个页码

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, currentPage.value + 2)

    if (start > 1) pages.push(1)
    if (start > 2) pages.push('...')

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages.value - 1) pages.push('...')
    if (end < totalPages.value) pages.push(totalPages.value)
  }

  return pages
})

// 分页方法
const handleSizeChange = (size) => {
  pageSize.value = Number(size)
  currentPage.value = 1
  fetchBlogs()
}

const handleCurrentChange = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  fetchBlogs()
}

const jumpToPage = () => {
  if (!jumperPage.value || jumperPage.value < 1 || jumperPage.value > totalPages.value) {
    jumperError.value = '请输入有效页码'
    return
  }
  jumperError.value = ''
  handleCurrentChange(jumperPage.value)
}

const validatePageInput = () => {
  if (jumperPage.value < 1 || jumperPage.value > totalPages.value) {
    jumperError.value = `请输入1-${totalPages.value}之间的数字`
  } else {
    jumperError.value = ''
  }
}

// 数据转发
const Dataforwarding = (blog) => {
  const collection = blogs.value.find((b) => b.id === blog.id)
  if (collection) {
    router.push({
      name: 'tavoritebtn',
      query: {
        item: JSON.stringify({
          id: collection.id,
          characteristics: collection.title,
          collection: collection.collection,
          image: collection.coverImage,
          collectionname: collection.collectionname,
          location: collection.location,
          profile: collection.profile,
          sales: collection.sales,
          score: collection.score,
          price: collection.price,
          username: collection.username
        })
      }
    })
  }
}

// 生命周期钩子
onMounted(() => {
  fetchBlogs();
  fetchSlideshow()
  
})

onBeforeUnmount(() => {
  if (interval.value) clearInterval(interval.value)
})
</script>
<style scoped>
/* 导入全局样式HomeViews */
@import "@/css/Home/HomeViews.css";
@import "@/css/Home/paging.css";
@import "@/css/Btn/btn.css";
</style>
