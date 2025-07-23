<template>
  <div class="PersonalCenter">
    <div class="PersonalCenterBackground">
      <div class="PersonalCenter-head">
        <h2>个人信息</h2>
      </div>
      <div class="PersonalCenter-center">
        <div class="PersonalCenter-center-right-border">
          <!-- 文件选择区域 -->
          <div class="avatar-upload-container">
            <div class="avatar-upload-wrapper">
              <div class="avatar-preview-container">
                <!-- 头像预览区域 -->
                <div class="avatar-preview" @click="triggerFileInput">
                  <div class="avatar-mask">
                    <i class="fas fa-camera"></i>
                    <span>更换头像</span>
                  </div>
                  <img v-if="!userInfo.image" :src="defaultAvatar" class="avatar-image" alt="默认头像" />
                  <img v-else :src="userInfo.image" class="avatar-image" alt="用户头像" />
                </div>

                <!-- 上传提示信息 -->
                <div class="upload-actions">
                  <p class="upload-hint">支持 JPG/PNG 格式，大小不超过 5MB</p>
                </div>
              </div>

              <!-- 隐藏的文件输入 -->
              <input type="file" @change="handleFileUpload" accept="image/*" style="display: none" ref="fileInput" />
            </div>
          </div>
          <div class="span-container-text">
            <span>
              <svg t="1746090782706" class="icon-personalcenter" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2627">
                <path
                  d="M512 993.962667C245.802667 993.962667 30.037333 778.197333 30.037333 512 30.037333 245.802667 245.802667 30.037333 512 30.037333 778.197333 30.037333 993.962667 245.802667 993.962667 512c-0.170667 266.112-215.893333 481.792-481.962667 481.962667z"
                  fill="#909090" p-id="2628"></path>
                <path
                  d="M794.282667 755.029333a145.749333 145.749333 0 0 0-10.922667-13.653333 87.04 87.04 0 0 0-11.946667-11.264l-10.581333-8.192a34.133333 34.133333 0 0 0-8.192-4.778667l-1.706667-0.341333-58.368-38.229333a247.466667 247.466667 0 0 0-27.306666-15.36l-78.848-38.229334v-37.546666a151.552 151.552 0 0 0 52.906666-53.248c11.946667-22.826667 18.816-48 20.138667-73.728v-28.672c0.853333-17.109333 0-34.261333-2.730667-51.2l-2.389333-16.384a166.229333 166.229333 0 0 0-46.762667-113.664 140.288 140.288 0 0 0-116.053333-44.032 119.125333 119.125333 0 0 0-80.213333 45.397333c-25.6 31.573333-41.6 69.845333-46.08 110.250667 0 0-3.072 52.565333-2.730667 59.050666l2.730667 36.864c2.773333 25.429333 9.472 50.346667 19.797333 73.728 12.117333 22.613333 30.634667 41.130667 53.248 53.248v37.546667l-78.506667 38.912c-5.930667 2.986667-11.733333 6.272-17.408 9.898667L273.066667 716.8l-5.802667 3.413333c-4.693333 2.986667-9.130667 6.272-13.312 9.898667a136.533333 136.533333 0 0 0-16.725333 16.042667 95.232 95.232 0 0 0-13.312 20.138666c-8.149333 17.194667-6.314667 37.461333 4.778666 52.906667 22.485333 19.413333 47.36 35.84 74.069334 48.810667a427.349333 427.349333 0 0 0 467.626666-25.6c9.216-6.570667 17.493333-14.378667 24.576-23.210667a52.266667 52.266667 0 0 0 7.509334-49.152 68.266667 68.266667 0 0 0-8.192-15.018667z"
                  fill="#FFFFFF" p-id="2629"></path>
              </svg>
              用户名：{{ userInfo.username }}
            </span>
            <span>
              <svg t="1746091061473" class="icon-personalcenter" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="3624">
                <path
                  d="M622.180791 560.644666l-36.405728 36.405729-171.096259 91.049874c-18.202864 10.914608-25.491121 29.135249-14.558737 47.338113l83.726066 171.114035 14.558736 76.43781h-149.320371c-174.740387 0-309.448694 0-309.448694-94.65845v-18.220641C39.689133 691.655516 178.023791 546.08593 349.137826 546.08593h182.028644c32.761601 0 61.896849 3.555247 91.014321 14.558736zM421.878179 0c131.064178 0 236.637236 112.861314 236.637236 254.840101S553.013462 509.680201 421.878179 509.680201 185.312047 396.818887 185.312047 254.840101 290.885105 0 421.878179 0z"
                  fill="#909090" p-id="3625"></path>
                <path
                  d="M523.878213 760.876174l76.43781 80.099714c7.288256 7.27048 10.914608 18.202864 10.914608 29.117472l-18.167312 112.861314c-3.644128 29.117472 21.846992 47.338113 47.338113 36.405729l94.65845-50.964465c10.914608-3.644128 21.846992-3.644128 29.117472 0l94.65845 50.964465c25.491121 14.558736 50.964465-7.288256 47.338113-36.405729l-18.202864-112.861314c-3.555247-10.914608 0-21.846992 10.914608-29.117472l76.437809-80.099714c18.202864-18.202864 7.288256-54.608593-18.202864-58.252721l-105.590835-14.523184c-10.914608 0-18.202864-7.27048-25.49112-18.202864l-47.320337-101.964483c-3.555247-10.932384-18.202864-18.202864-29.117472-18.202864S724.074169 557.018314 720.518922 567.932922l-47.320337 101.92893A27.375401 27.375401 0 0 1 647.636359 688.100269l-105.573058 14.576513c-29.135249 3.555247-40.049857 36.405729-18.202864 58.252721z m0 0"
                  fill="#909090" p-id="3626"></path>
              </svg>
              昵称：{{ userInfo.nickname }}
            </span>
            <span>
              <svg t="1746091204422" class="icon-personalcenter" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="4768">
                <path
                  d="M938.13361 831c-42.4 35.5-110 52.5-189.2 52.5-119.5 0-265.6-38.6-391.7-109.8C140.03361 651-21.96639 429.2 2.43361 290.8c10.2-57.9 62.1-137.4 86.1-149.2 14.7-7.2 29.4-7.9 29.4-7.9 1.1-0.1 2.2-0.1 3.2-0.1 23.5 0 41.4 12 48.8 17.7l128.4 84.6 24.6 16.2c5.2 4.4 14.3 12.8 22.6 25.5 45.6 70-11.9 153.5-3.7 221.6 4 33.4 25.4 75.1 94.8 119.6h0.1c44.2 22.9 78.8 31.1 106.1 31.1 17.9 0 32.6-3.5 44.9-8.8C649.33361 614.8 692.23361 527 771.93361 527c1.9 0 3.9 0.1 5.9 0.2 15.1 0.8 26.9 4.5 33.3 6.8l26.4 13.2c45.8 23 91.7 46 137.5 68.9 9 3.8 29.7 13.9 41.2 36.2 0 0 6.8 13.1 7.9 29.4 4.9 70.8-63 130-86 149.3z"
                  p-id="4769" fill="#909090"></path>
              </svg>
              联系方式：{{ userInfo.phone }}
            </span>
            <span>
              <svg t="1746091268543" class="icon-personalcenter" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5936">
                <path
                  d="M512 62.584C263.8 62.584 62.584 263.8 62.584 512S263.8 961.416 512 961.416 961.416 760.2 961.416 512 760.2 62.584 512 62.584z m232.022 584.767c0 24.81-20.876 45.112-46.4 45.112H326.377c-25.523 0-46.4-20.301-46.4-45.112l0.213-222.877 226.25 119.983a11.907 11.907 0 0 0 11.12 0l226.462-120.096v222.99z m-231.91-145.259L280.216 376.237c0.225-24.624 20.788-44.7 46.162-44.7h371.246c25.336 0 46.1 20.001 46.4 44.575l-231.91 125.98z"
                  p-id="5937" fill="#909090"></path>
              </svg>
              邮箱：{{ userInfo.email }}
            </span>
            <span>
              <svg t="1746091326879" class="icon-personalcenter" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="7902">
                <path
                  d="M512 64C264 64 64 264 64 512s200 448 448 448 448-200 448-448S760 64 512 64z m-94.4 312l99.2-171.2c3.2-11.2 24-16 35.2-8s16 24 8 35.2l-96 171.2c-8 11.2-24 16-40 8-11.2-8-16-24-6.4-35.2zM464 718.4c-12.8 19.2-68.8 75.2-104 83.2l-11.2 19.2c-4.8 8-12.8 8-16 8 0 0-8 0-8-1.6-3.2-3.2-6.4-11.2-3.2-19.2l11.2-19.2c-12.8-32 11.2-115.2 19.2-131.2l136-230.4 112 59.2L464 718.4zM715.2 288l-99.2 171.2-107.2-62.4L608 228.8c12.8-24 52.8-32 80-16 27.2 16 43.2 51.2 27.2 75.2z"
                  fill="#909090" p-id="7903"></path>
              </svg>
              签名：{{ userInfo.signature }}
            </span>
            <span>
              <svg t="1746091743311" class="icon-personalcenter" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="17598">
                <path
                  d="M909.974588 454.595765v439.115294a120.470588 120.470588 0 0 1-120.470588 120.470588h-567.416471a120.470588 120.470588 0 0 1-120.470588-120.470588v-439.115294h808.357647z m-248.711529 341.955764H350.388706l-5.601882 0.481883a31.081412 31.081412 0 0 0 5.601882 61.680941h310.874353l5.601882-0.481882a31.081412 31.081412 0 0 0-5.601882-61.680942z m0-186.548705H350.388706l-5.601882 0.542117a31.081412 31.081412 0 0 0 5.601882 61.680941h310.874353l5.601882-0.542117a31.081412 31.081412 0 0 0-5.601882-61.680941zM630.181647 50.416941c15.239529 0 27.949176 11.023059 30.599529 25.47953l0.481883 5.601882v61.741176h128.301176a120.470588 120.470588 0 0 1 120.470589 120.470589v128.662588H101.616941V263.710118a120.470588 120.470588 0 0 1 120.470588-120.470589h128.240942V81.498353A31.081412 31.081412 0 0 1 412.009412 75.896471l0.481882 5.601882v61.741176h186.548706V81.498353c0-17.167059 13.854118-31.081412 31.081412-31.081412z"
                  fill="#909090" p-id="17599"></path>
              </svg>
              创建时间：{{ userInfo.createTime }}
            </span>
          </div>
        </div>
        <div class="PersonalCenter-center-left-border">
          <!-- 其他输入框 -->
          <div class="input-container-personalcenter">
            <span>昵称：</span>
            <input type="text" v-model="userInfo.nickname" />
          </div>
          <div class="input-container-personalcenter">
            <span>联系方式：</span>
            <input type="text" v-model="userInfo.phone" />
          </div>
          <div class="input-container-personalcenter">
            <span>邮箱：</span>
            <input type="email" v-model="userInfo.email" />
          </div>
          <div class="input-container-personalcenter">
            <span>签名：</span>
            <input type="text" v-model="userInfo.signature" maxlength="15" />
          </div>
          <div class="input-container-personalcenter">
            <span>旅行经历：</span>
            <textarea v-model="userInfo.experience" placeholder="编写我的笔记 ..." class="input-note-content-input"
              ref="editor" @input="updatePreview"></textarea>
          </div>
        </div>
      </div>

      <!-- 按钮区域 -->
      <div class="input-container-button">
        <button @click="saveChanges">保存更改</button>
        <button @click="cancelChanges">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserInfo, updateUserInfo, uploadAvatar } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
// 响应式数据
const defaultAvatar = new URL('../../assets/defaultimage/mrtx.png', import.meta.url).href
const fileInput = ref(null);
const loading = ref(false);
const avatarLoading = ref(false);

// 原始用户信息备份
const originalUserInfo = ref({});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true;
    // 检查是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('请先登录');
      router.push('/login');
      return;
    }
    // 先从本地存储获取，优化用户体验
    const localUser = JSON.parse(localStorage.getItem('user') || {});
    userInfo.value = { ...localUser };

    //从服务器获取最新数据
    const response = await getUserInfo();

    if (response.code === '0') {
      userInfo.value = response.data;
      originalUserInfo.value = { ...response.data };
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
// 用户信息
const userInfo = ref({
  username: '',
  nickname: '',
  experience: '',
  signature: '',
  phone: '',
  createTime: '',
  email: '',
  image: ''
});

// 保存修改
const saveChanges = async () => {
  try {
    loading.value = true;

    // 检查是否有修改
    const hasChanges = Object.keys(userInfo.value).some(
      key => userInfo.value[key] !== originalUserInfo.value[key]
    );

    if (!hasChanges) {
      ElMessage.warning('没有修改任何信息');
      loading.value = false;
      return;
    }

    // 构造更新数据 - 与后端User实体完全匹配
    const updateData = {
      nickname: userInfo.value.nickname?.trim(),
      phone: userInfo.value.phone,
      email: userInfo.value.email,
      signature: userInfo.value.signature || '',
      experience: userInfo.value.experience || '',
      image: userInfo.value.image,
      password: userInfo.value.password
    };

    // 前端验证（与后端校验保持一致）
    if (!updateData.nickname) {
      ElMessage.error('昵称不能为空');
      loading.value = false;
      return;
    }

    if (updateData.signature && updateData.signature.length > 15) {
      ElMessage.error('签名最多15个字符');
      loading.value = false;
      return;
    }

    if (updateData.email && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(updateData.email)) {
      ElMessage.error('邮箱格式不正确');
      loading.value = false;
      return;
    }

    if (updateData.phone && !/^1[3-9]\d{9}$/.test(updateData.phone)) {
      ElMessage.error('手机号格式不正确');
      loading.value = false;
      return;
    }

    // 获取当前用户token（与后端login接口返回结构匹配）
    const token = localStorage.getItem('token');
    if (!token) {
      ElMessage.error('请先登录');
      loading.value = false;
      router.push('/login');
      return;
    }

    // 获取用户信息用于更新
    const authData = JSON.parse(localStorage.getItem('user') || 'null');

    // 发送请求（注意端点与后端@PutMapping("/update")匹配）
    const response = await updateUserInfo(updateData, {
      headers: {
        'Authorization': `Bearer ${authData.token}`
      }
    }).catch(error => {
      // 统一处理401错误
      if (error.response?.status === 401) {
        ElMessage.error('登录已过期，请重新登录');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
      throw error;
    });

    // 处理响应（与后端Result结构匹配）
    if (response.code === '0') {
      ElMessage.success('更新成功');

      // 更新本地数据（保持与后端返回结构一致）
      originalUserInfo.value = { ...userInfo.value };

      // 更新本地存储的用户信息（注意保留token）
      const updatedUser = {
        ...authData,
        user: {
          ...authData.user,
          ...updateData
        }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      // 处理后端返回的错误信息
      const errorMsg = response.msg || '更新失败';
      ElMessage.error(errorMsg);

      // 特殊处理认证失败情况
      if (errorMsg.includes('未登录') || errorMsg.includes('401')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
      }

      // 恢复表单数据
      userInfo.value = { ...originalUserInfo.value };
    }
  } catch (error) {
    console.error('更新失败:', error);

    // 处理HTTP错误状态码
    if (error.response?.status === 401) {
      // 已在上面的catch中处理
    } else if (error.response?.data?.msg) {
      ElMessage.error(error.response.data.msg);
    } else {
      ElMessage.error('网络错误，请稍后重试');
    }

    // 恢复表单数据
    userInfo.value = { ...originalUserInfo.value };
  } finally {
    loading.value = false;
  }
};

// 头像上传处理
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('仅支持JPEG、PNG、GIF或WEBP格式的图片');
    return;
  }

  // 验证文件大小 (限制5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error(`图片大小不能超过${maxSize / 1024 / 1024}MB`);
    return;
  }

  try {
    avatarLoading.value = true;

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      userInfo.value.image = e.target.result;
    };
    reader.readAsDataURL(file);

    // 获取当前用户ID
    const authData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = authData?.id || authData?.user?.id;
    const username = authData?.username || authData?.user?.username;

    if (!userId || (typeof userId !== 'number' && typeof userId !== 'string')) {
      ElMessage.error('无法获取有效用户ID');
      console.error('无效的用户ID:', userId);
      return;
    }

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadAvatar(username, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.code === '0') {
      userInfo.value.image = response.data.url;
      // 更新本地存储
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localUser.image = response.data.url;
      localStorage.setItem('user', JSON.stringify(localUser));
      ElMessage.success('头像上传成功');
      // 更新成功重新获取数据
      await fetchUserInfo();
    } else {
      ElMessage.error(response.msg || '头像上传失败');
    }
  } catch (error) {
    console.error('头像上传失败:', error);
    ElMessage.error('头像上传失败，请稍后重试');
  } finally {
    avatarLoading.value = false;
    // 清空文件输入，允许重复选择同一文件
    event.target.value = '';
  }
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>
<style scoped>
.PersonalCenter {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}


.PersonalCenterBackground {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.PersonalCenterBackground::before {
  content: "";
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
}

.PersonalCenterBackground:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.PersonalCenter-head {
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
}

.PersonalCenter-head h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  padding-bottom: 1rem;
}

.PersonalCenter-head h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  border-radius: 2px;
}

.PersonalCenter-center {
  display: flex;
  gap: 2rem;
  position: relative;
  flex-wrap: wrap;
  z-index: 1;
}

.PersonalCenter-center-right-border,
.PersonalCenter-center-left-border {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.PersonalCenter-center-right-border:hover,
.PersonalCenter-center-left-border:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.PersonalCenter-center-right-border {
  border-left: 3px solid #3498db;
}

.PersonalCenter-center-left-border {
  border-left: 3px solid #9b59b6;
}

/* 头像上传区域 */
.avatar-upload-container {
  max-width: 500px;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.avatar-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  border: 5px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.avatar-preview:hover {
  transform: scale(1.05);
  border: 5px solid rgb(106, 189, 233);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-preview:hover .avatar-mask {
  opacity: 1;
}

.avatar-mask i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-actions {
  text-align: center;
  width: 100%;
}
.upload-hint {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.span-container-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.span-container-text span {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  color: #555;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.span-container-text span:hover {
  background: rgba(52, 152, 219, 0.1);
  transform: translateX(5px);
}

.icon-personalcenter {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.input-container-personalcenter {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.input-container-personalcenter span {
  width: 150px;
  font-weight: 600;
  color: #2c3e50;
}

.input-container-personalcenter input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
}

.input-container-personalcenter input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(34, 154, 234, 0.553);
}

.input-note-content-input {
  width: 100%;
  height: 100%;
  min-height: 280px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(197, 197, 197, 0.2) 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.input-note-content-input::-webkit-scrollbar {
  display: none;
}

.input-note-content-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(34, 154, 234, 0.553);
}


.input-container-button {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.input-container-button button {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.input-container-button button:first-child {
  background: linear-gradient(135deg, #3498db, #9b59b6);
  color: white;
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.input-container-button button:first-child:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.6);
}

.input-container-button button:last-child {
  background: white;
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.input-container-button button:last-child:hover {
  background: #fef0f0;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.2);
}

@media (max-width: 768px) {
  .PersonalCenter-center {
    flex-direction: column;
  }

  .PersonalCenter-center-right-border,
  .PersonalCenter-center-left-border {
    border: none;
    border-bottom: 3px solid #3498db;
  }

  .PersonalCenter-center-left-border {
    border-bottom: 3px solid #9b59b6;
  }
}
</style>