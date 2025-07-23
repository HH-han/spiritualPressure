<template>
    <div>
        <Home_2 />
        <ClearingHouse />
        <div class="container_CommunityCenter">
            <!-- 首页 -->
            <section id="home" class="section_CommunityCenter">
                <h2>首页</h2>
                <p>欢迎来到我们的社区讨论中心！这里是一个分享和交流的平台，欢迎参与讨论。</p>
                <h3>最新公告</h3>
                <p>即将举行的活动：社区聚会将在2月25日举行，欢迎大家参加！</p>
                <h3>热门讨论主题</h3>
                <ul>
                    <li><a href="#topic1">科技新品讨论</a></li>
                    <li><a href="#topic2">健康生活分享</a></li>
                    <li><a href="#topic3">旅行经验交流</a></li>
                </ul>
            </section>
            <!-- 论坛/讨论区 -->
            <section id="forum" class="section_CommunityCenter">
                <h2>论坛/讨论区</h2>
                <h3>主题分类</h3>
                <ul>
                    <li><a href="#life">生活</a></li>
                    <li><a href="#tech">科技</a></li>
                    <li><a href="#entertainment">娱乐</a></li>
                    <li><a href="#health">健康</a></li>
                </ul>
                <h3>帖子列表</h3>
                <ul>
                    <li>【科技】新手机发布讨论 - 作者：小明 - 时间：2025-01-30 - 回复：10</li>
                    <li>【生活】如何提高生活质量 - 作者：小红 - 时间：2025-01-29 - 回复：5</li>
                    <li>【健康】最佳锻炼方法 - 作者：小刚 - 时间：2025-01-28 - 回复：8</li>
                </ul>
                <h3>搜索功能</h3>
                <input type="text" placeholder="搜索主题或关键词...">
            </section>
            <!-- 用户个人资料 -->
            <section id="profile" class="section_CommunityCenter">
                <h2>用户个人资料</h2>
                <div class="CommunityCenter_IMG">
                    <img src="" alt="用户头像">
                </div>
                <div class="user-profile_CommunityCenter">
                    <div>
                        <h3>用户名：小明</h3>
                        <p>个人简介：热爱科技与旅行，喜欢分享经验。</p>
                        <h4>帖子记录</h4>
                        <ul>
                            <li>如何选择合适的手机</li>
                            <li>旅行中的美食推荐</li>
                        </ul>
                        <h4>关注主题</h4>
                        <ul>
                            <li>科技</li>
                            <li>旅行</li>
                        </ul>
                        <ul>
                            <li>
                                <router-link to="/PersonalCenter">
                                    <button>个人中心</button>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <!-- 社区规则 -->
            <section id="rules" class="section_CommunityCenter">
                <h2>社区规则</h2>
                <p>请遵守以下行为规范：不发布不当言论，尊重其他用户，保持讨论的友好氛围。</p>
            </section>
            <!-- 管理团队 -->
            <section id="team" class="section_CommunityCenter">
                <h2>管理团队</h2>
                <p>管理员：小华</p>
                <p>版主：小李、小张</p>
            </section>
            <!-- 消息通知 -->
            <section id="notifications" class="section_CommunityCenter">
                <h2>消息通知</h2>
                <ul>
                    <li>您有新的回复！</li>
                    <li>小红点赞了您的帖子。</li>
                    <li>您收到了一条私信。</li>
                </ul>
            </section>
            <!-- 排行榜 -->
            <section id="leaderboard" class="section_CommunityCenter">
                <h2>排行榜</h2>
                <h3>活跃用户</h3>
                <ul>
                    <li>小明 - 100积分</li>
                    <li>小红 - 80积分</li>
                    <li>小刚 - 60积分</li>
                </ul>
                <h3>热帖</h3>
                <ul>
                    <li>新手机发布讨论 - 50回复</li>
                    <li>最佳锻炼方法 - 30回复</li>
                </ul>
            </section>
            <!-- 常见问题（FAQ） -->
            <section id="faq" class="section_CommunityCenter">
                <h2>常见问题（FAQ）</h2>
                <h3>如何注册？</h3>
                <p>点击右上角的注册按钮，填写相关信息即可。</p>
                <h3>如何修改个人资料？</h3>
                <p>登录后，进入个人资料页面进行修改。</p>
            </section>
        </div>
    </div>
</template>
<script>
import ClearingHouse from "../../components/NavigationComponent/ClearingHouse.vue";
import Home_2 from "../../components/NavigationComponent/HomeHeader.vue";
export default {
    name: "CommunityCenter",
    components: {
        ClearingHouse,
        Home_2
    }
}
</script>
<style scoped>
.container_CommunityCenter {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    margin-bottom: 50px;
    background: linear-gradient(to right, #f8f8f8, #e9e9e9);
    /* 添加渐变背景 */
}

.container_CommunityCenter li {
    list-style: none;
    margin-bottom: 10px;

}

.container_CommunityCenter li:hover {
    background-color: #c4c3c3;
}

.container_CommunityCenter li button {
    background: none;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.container_CommunityCenter li button:hover {
    border-bottom: 2px solid rgb(177, 177, 177);
}

h2 {
    color: #333;
    font-size: 24px;
    /* 调整字体大小 */
}

.section_CommunityCenter {
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加卡片阴影 */
}

.section_CommunityCenter input {
    width: 250px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding-left: 10px;
}

.section_CommunityCenter:hover {
    background-color: #e9e9e9;
}

.CommunityCenter_IMG {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 10px;
}

.CommunityCenter_IMG img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.user-profile_CommunityCenter {
    display: flex;
    align-items: center;
}

.user-profile_CommunityCenter img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
</style>
