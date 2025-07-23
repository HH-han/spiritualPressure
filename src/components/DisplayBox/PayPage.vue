<template>
  <FloatingButton />
    <div class="PayPage_background">
      <div class="PayPage">
        <div class="PayPage_title">
          <div style="display: flex; flex-wrap: nowrap; margin-left: 15px;">
            <h2>订单名称：</h2>
            <span>{{ item.name }}</span>
          </div>
          <div style="display: flex; flex-wrap: nowrap; margin-left: 15px;">
            <h2>订单价格：</h2>
            <span>{{ item.price }}元</span>
          </div>
        </div>
        <div>
          <div>
            <h3>选择支付方式</h3>
          </div>
          <!-- 支付宝 -->
          <div class="PayPage_center">
            <div class="payment-option">
              <label class="container-pay">
                <input type="radio" v-model="selectedPaymentMethod" value="ALIPAY" />
                <div class="checkmark-pay"></div>
              </label>
              <div style="display: flex; flex-wrap: nowrap;">
                <svg t="1739023282990" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7093" width="45" height="45">
                  <path d="M230.404 576.536c-12.087 9.728-25.043 23.93-28.805 41.984-5.12 24.666-1.069 55.541 22.728 79.761 28.828 29.362 72.637 37.398 91.56 38.779 51.4 3.717 106.184-21.772 147.477-50.844 16.184-11.42 43.899-34.349 70.39-69.721-59.37-30.653-133.477-64.557-212.703-61.24-40.47 1.692-69.454 10.084-90.647 21.281z m752.859 135.545C1009.463 650.574 1024 582.968 1024 512 1024 229.688 794.335 0 512 0 229.665 0 0 229.688 0 512c0 282.335 229.665 512 512 512 170.385 0 321.491-83.723 414.631-212.124-87.997-43.742-233.027-115.734-322.36-159.299-42.63 48.596-105.65 97.303-176.84 118.495-44.722 13.29-85.037 18.365-127.199 9.75-41.739-8.548-72.481-28.093-90.401-47.683-9.127-9.995-19.612-22.706-27.203-37.82a71.25 71.25 0 0 0 1.202 3.049s-4.363-7.524-7.702-19.5a85.994 85.994 0 0 1-3.34-18.143 93.517 93.517 0 0 1-0.2-13.045c-0.378-7.702-0.066-15.783 1.67-24.064 4.185-20.235 12.822-43.81 35.172-65.692 49.063-48.039 114.777-50.621 148.814-50.42 50.421 0.289 138.04 22.35 211.812 48.439 20.436-43.52 33.547-90.068 42.007-121.1H305.308v-33.168h157.518v-66.337H272.139v-33.169h190.687v-66.315c0-9.105 1.803-16.584 16.584-16.584h74.619v82.899h207.293v33.169H554.029v66.337h165.82s-16.65 92.828-68.719 184.32c115.557 41.272 278.128 104.849 332.133 126.086z" fill="#1296DB" p-id="7094"></path>
                </svg>
              </div>
              <div>
                <span>支付宝</span>
              </div>
            </div>
          </div>
          <!-- 微信 -->
          <div class="PayPage_center">
            <div class="payment-option">
              <label class="container-pay">
                <input type="radio" v-model="selectedPaymentMethod" value="WECHAT" />
                <div class="checkmark-pay"></div>
              </label>
              <div style="display: flex; flex-wrap: nowrap;">
                <svg t="1739028308319" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10563" width="45" height="45">
                  <path d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z" fill="#28C445" p-id="10564"></path><path d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z" fill="#28C445" p-id="10565"></path>
                </svg>
              </div>
              <div>
                <span>微信</span>
              </div>
            </div>
          </div>
          <!-- 银联 -->
          <div class="PayPage_center">
            <div class="payment-option">
              <label class="container-pay">
                <input type="radio" v-model="selectedPaymentMethod" value="BANK" />
                <div class="checkmark-pay"></div>
              </label>
              <div style="display: flex; flex-wrap: nowrap;">
                <svg t="1739028269503" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9526" width="45" height="45">
                  <path d="M751.33952 132.98688L560.30208 956.6208c4.864-0.3584 8.2944-0.7168 8.2944-0.7168 220.59008-27.57632 391.44448-215.9104 391.44448-444.25216 0-159.49824-83.27168-299.35616-208.70144-378.65472z" fill="#006A65" p-id="9527"></path><path d="M563.54816 956.43648L751.33952 132.8128a447.19104 447.19104 0 0 0-239.1552-69.0176c-27.21792 0-53.89312 2.33472-79.84128 7.19872-1.62816 4.864-3.24608 9.728-4.33152 14.77632L252.11904 876.2368c73.34912 52.44928 163.10272 83.26144 260.23936 83.26144" fill="#082F67" p-id="9528"></path><path d="M429.63968 76.75904c0.3584-1.98656 0.90112-3.7888 1.4336-5.59104-208.6912 38.03136-366.7456 220.95872-366.7456 440.4736 0 150.48704 74.24 283.66848 188.14976 364.9536l177.152-799.83616z" fill="#ED171F" p-id="9529"></path><path d="M354.84672 488.57088h80.384l5.76512-24.68864h-80.384l-5.76512 24.68864z m8.2944-35.86048a103.41376 103.41376 0 0 1 47.74912-19.65056h37.13024l5.76512-24.50432h-80.384l-10.27072 44.15488z m244.19328-44.52352l-14.77632 63.7952a94.43328 94.43328 0 0 1 47.04256-19.8144l10.27072-44.15488-42.53696 0.17408z m-32.256 138.5984a92.30336 92.30336 0 0 1 47.21664-19.46624l10.27072-44.15488h-42.7008l-14.78656 63.62112z m-12.8 54.784h42.53696l10.09664-43.79648h-42.53696l-10.09664 43.79648z m157.16352-224.37888h48.29184a58.03008 58.03008 0 0 0 0 17.664s1.80224 9.728 18.20672 9.91232l-7.20896 31.1808h-26.84928c-12.25728 0.3584-23.42912-6.49216-29.20448-17.3056a69.2736 69.2736 0 0 1-3.23584-41.45152z m-544.8192 41.45152h13.8752s20.18304-1.4336 32.79872-41.2672h46.68416a154.83904 154.83904 0 0 1-10.09664 20.54144h58.2144l-7.20896 30.99648h-74.43456a71.00416 71.00416 0 0 1-46.4896 21.4528h-20.55168l7.20896-31.72352z m47.40096 196.44416h43.42784l-7.20896 30.8224h-67.2256a28.50816 28.50816 0 0 1-16.03584-4.5056 21.83168 21.83168 0 0 1-7.02464-23.61344l12.8-54.96832h-31.72352l7.20896-31.1808h31.71328l10.09664-43.42784h-31.72352l7.20896-30.99648h128.31744l-7.20896 30.99648h-52.62336l-9.91232 43.61216h52.6336l-7.20896 31.1808h-52.79744l-9.91232 42.16832c-1.44384 3.7888 0.53248 8.11008 4.5056 9.55392 0.90112 0.18432 1.61792 0.3584 2.70336 0.3584z m246.53824-59.648a26.44992 26.44992 0 0 1-10.0864 15.85152 38.84032 38.84032 0 0 1-24.33024 6.13376h-20.72576l0.54272 31.35488a7.55712 7.55712 0 0 0 8.11008 6.49216h32.6144l-7.20896 30.8224h-49.2032s-21.25824 1.0752-25.76384-9.37984a33.32096 33.32096 0 0 1-2.52928-14.592l-1.4336-89.93792h44.14464l0.54272 21.4528h16.04608c3.23584 0 5.9392-1.80224 7.20896-4.87424l3.7888-16.39424h33.87392l-5.59104 23.07072z m-28.65152-35.87072h-92.27264l-19.82464 85.6064c-1.25952 3.7888 0.7168 8.11008 4.5056 9.55392 0.90112 0.18432 1.61792 0.3584 2.51904 0.3584h29.02016l-7.20896 30.99648h-51.36384a31.232 31.232 0 0 1-21.8112-7.74144 22.3232 22.3232 0 0 1-2.70336-21.4528l55.69536-239.5136h44.3392l-4.68992 20.18304a103.6288 103.6288 0 0 1 49.5616-20.18304h79.83104L480.4608 484.9664a47.96416 47.96416 0 0 1-19.10784 27.7504 35.0208 35.0208 0 0 1-21.44256 6.8608z m202.20928 112.9984l-3.23584 13.5168h-44.3392l3.24608-13.5168H495.06304l7.20896-30.8224h-13.34272l-45.056 193.56672h12.97408l-7.20896 30.8224h-12.61568z m208.15872-149.4016h-55.68512l-6.85056 29.37856h55.86944l-7.20896 30.99648h-60.19072l-9.55392 15.86176h26.6752l7.75168 44.15488c0.53248 4.864 3.42016 9.3696 7.74144 11.88864h10.81344l-7.20896 31.00672h-23.6032c-9.19552 0-17.84832-3.7888-23.97184-10.28096a37.0176 37.0176 0 0 1-5.59104-17.12128l-6.48192-36.7616-22.528 37.30432a65.792 65.792 0 0 1-14.60224 18.3808c-7.5776 5.94944-16.93696 9.0112-26.49088 8.47872h-32.256l7.20896-30.8224h16.39424a17.48992 17.48992 0 0 0 13.1584-9.19552l38.38976-62.89408h-51.00544l7.20896-30.63808h55.68512l6.8608-29.37856h-55.7056l7.20896-30.63808h155.52512l-7.56736 30.63808z m1.98656-64.512a51.65056 51.65056 0 0 1-37.13024 17.29536h-26.84928l7.20896-31.1808a27.71968 27.71968 0 0 0 22.8864-9.91232 82.95424 82.95424 0 0 0 8.2944-17.664h48.30208a96.63488 96.63488 0 0 1-22.71232 41.45152z" fill="#FFFFFF" p-id="9530"></path>
                </svg>
              </div>
              <div>
                <span>银联</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button @click="confirmPayment" class="payment-details-button">确认支付</button>
        </div>
      </div>
      <div>
      <!-- 使用子组件 -->
      <PaymentSuccessModal
      :selectedPaymentMethod="selectedPaymentMethod"
      :isPaymentModalVisible="isPaymentModalVisible"
      @close-modal="closeModal"
      />
      </div>
      <!-- 自定义提示框 -->
      <div v-if="isAlertVisible" class="custom-alert">
          <div class="alert-content">
              <p>{{ alertMessage }}</p>
              <button @click="closeAlert" class="custom-alert-button">关闭</button>
          </div>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PaymentSuccessModal from '@/components/PromptComponent/PaymentSuccessModal.vue';
import request from '@/utils/request'; 
import FloatingButton from '@/components/ComponentButton/FloatingButton.vue';
import { ElMessage} from 'element-plus';

const route = useRoute();
const router = useRouter();

// 商品信息
const item = ref({});
// 订单ID
const orderId = ref('');

// 自定义提示框的状态
const isAlertVisible = ref(false);
const alertMessage = ref('');

// 选中的支付方式
const selectedPaymentMethod = ref('');

// 控制支付成功提示框的显示状态
const isPaymentModalVisible = ref(false);

// 从路由查询参数中获取商品信息和订单ID
onMounted(() => {
  if (route.query.item) {
    item.value = JSON.parse(route.query.item);
    selectedPaymentMethod.value = item.value.status;
  }
  orderId.value = route.query.orderId || '';
});

// 确认支付
const confirmPayment = async () => {
  // 检查是否有token
  const token = localStorage.getItem('token');
  if (!token) {
    ElMessage.error('请先登录');
    router.push('/login');
    return;
  }
  
  // 获取完整的用户信息
  const userInfo = JSON.parse(localStorage.getItem('user'));
  if (!userInfo || !userInfo.username) {
    ElMessage.error('用户信息获取失败');
    return;
  }

  if (!selectedPaymentMethod.value) {
    isAlertVisible.value = true;
    alertMessage.value = '请选择支付方式';
    return;
  }

  try {
    let response;
    
    if (orderId.value) {
      // 更新订单接口 - 将status作为URL参数传递
      response = await request({
        url: `/api/public/payment/${orderId.value}`,
        method: 'PUT',
        params: {
          status: 'SUCCESS',
          paymentMethod: selectedPaymentMethod.value,
          version: 0
        }
      });
    } else {
      // 新建支付接口保持不变
      const paymentData = {
        itemId: item.value.id,
        itemName: item.value.name,
        amount: item.value.price,
        paymentMethod: selectedPaymentMethod.value,
        version: 0,
        username: userInfo.username,
        quantity: item.value.quantity
      };

      response = await request({
        url: '/api/public/payment/shoping',
        method: 'POST',
        data: paymentData,
      });
    }

    if (response.code === '0') {
      isPaymentModalVisible.value = true;
    } else {
      isAlertVisible.value = true;
      alertMessage.value = response.msg || response.data?.message || '支付失败，请重试';
      
      // 如果是无效支付状态错误，显示更友好的提示
      if (response.code === '-1' && response.msg === '无效的支付状态') {
        alertMessage.value = '支付方式选择无效，请重新选择';
      }
    }
  } catch (error) {
    console.error('支付请求失败:', error);
    isAlertVisible.value = true;
    alertMessage.value = '支付请求失败，请检查网络';
  }
};

// 关闭支付成功提示框并返回上一个页面
const closeModal = () => {
  isPaymentModalVisible.value = false;
  setTimeout(() => router.back(), 1500);
};

// 关闭自定义提示框
const closeAlert = () => {
  isAlertVisible.value = false;
};
</script>
  
<style scoped>
.PayPage {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #ddd;   
  height: 100%;   
  width: 450px;   
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: rgb(0, 0, 0);
  font-size: 24px;
  text-align: center;
          
}
.PayPage_background { 
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  text-align: center;
}
.PayPage_background button {
  background: #3FA05C;
  border: none;
  color: white;
  width: 250px;
  height: 35px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;
}
.PayPage_background button:hover {
  background-color: #006317;
}
.PayPage_center{
  margin-bottom: 15px;
  margin-left: 15px;
}
.payment-option {  
  display: flex;
  align-items: center;
  gap: 10px; 
}  
.PayPage_title {
  background: rgba(195, 195, 195, 0.5); 
  backdrop-filter: blur(10px); 
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  border-radius: 10px 10px 0px 0px;
}
/* Hide the default checkbox */
.container-pay input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Container holding the custom checkbox */
.container-pay {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 20px;
  user-select: none;
}

/* The custom checkbox (3D box with gradient) */
.checkmark-pay {
  position: relative;
  top: 0;
  left: 0;
  height: 2em;
  width: 2em;
  background: linear-gradient(
    145deg,
    #ececec,
    #c8c8c8
  ); /* Soft light 3D effect */
  border-radius: 12px; /* Rounded square */
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.2),
    inset 0 -2px 5px rgba(0, 0, 0, 0.1); /* 3D shadow */
  transition:
    background-color 0.4s ease,
    transform 0.3s ease;
  overflow: hidden;
  position: relative;
}

/* 勾选后，添加鲜艳的渐变背景  */
.container-pay input:checked ~ .checkmark-pay {
  background: linear-gradient(45deg, #42e695, #3bb2b8);
  transform: scale(1.1); /* Slight pop-out effect */
  box-shadow:
    0 0px 20px rgba(66, 230, 149, 0.6),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);
}

/* 复选标记本身  */
.checkmark-pay:after {
  content: "";
  position: absolute;
  display: none;
  width: 0.5em;
  height: 1em;
  border: solid white;
  border-width: 0 0.2em 0.2em 0;
  transform: rotate(45deg);
  left: 0.65em;
  top: 0.2em;
}

/* 勾选后，用脉冲动画显示复选标记  */
.container-pay input:checked ~ .checkmark-pay:after {
  display: block;
  animation: pay 0.6s ease forwards;
}

/* 复选标记的脉冲动画  */
@keyframes pay {
  0% {
    transform: scale(0) rotate(45deg);
  }
  50% {
    transform: scale(1.2) rotate(45deg);
  }
  100% {
    transform: scale(1) rotate(45deg);
  }
}

/* 选中时添加闪烁  */
.container-pay input:checked ~ .checkmark-pay:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.5),
    transparent 80%
  );
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  border-radius: 50%;
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
  animation: sparkle 0.6s ease-out forwards;
}

@keyframes sparkle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
}

/* 悬浮时，让它感觉与发光的边界互动  */
.container-pay:hover .checkmark-pay {
  box-shadow:
    0 0 15px rgba(255, 255, 255, 0.7),
    0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 自定义提示框样式 */
.custom-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.alert-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
}

.custom-alert button {
  background: #3FA05C;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
</style>