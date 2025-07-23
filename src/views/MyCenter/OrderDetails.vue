<template>
  <div class="orderdetails-product-container">
    <div class="orderdetails-product-detail">
      <!-- 商品图片展示区 -->
      <div class="orderdetails-product-images">
        <div class="orderdetails-main-image">
          <img :src="currentImage" :alt="product.name">
        </div>
        <div class="orderdetails-thumbnail-container">
          <div v-for="(image, index) in product.images" :key="index" class="orderdetails-thumbnail"
            :class="{ active: currentImageIndex === index }" @click="changeImage(index)">
            <img :src="image" :alt="'商品图' + (index + 1)">
          </div>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <div class="orderdetails-close-button">
        <button @click="closeDialog">返回</button>
      </div>
      <!-- 商品信息区 -->
      <div class="orderdetails-product-info">
        <h1 class="orderdetails-product-name">{{ product.name }}</h1>
        <div class="orderdetails-product-meta">
          <span class="orderdetails-sales">月销{{ product.sales || '-暂无月销-' }}件</span>
          <span class="orderdetails-reviews">{{ product.reviews || '-暂无评价-' }}条评价</span>
          <span class="orderdetails-rating">评分{{ product.rating || '-暂无评分-' }}</span>
        </div>

        <div class="orderdetails-price-section">
          <span class="orderdetails-current-price">¥{{ totalPrice }}</span>
          <span class="orderdetails-original-price">¥{{ product.originalPrice }}</span>
          <span class="orderdetails-discount">{{ product.discount || '-暂无折扣-' }}折 </span>
        </div>

        <div class="orderdetails-spec-section">
          <h3>规格</h3>
          <div class="orderdetails-spec-options">
            <button v-for="(spec, index) in product.specs" :key="index" :class="{ active: selectedSpec === spec }"
              @click="selectSpec(spec)">
              {{ spec }}
            </button>
          </div>
        </div>

        <div class="orderdetails-quantity-section">
          <h3>数量</h3>
          <div class="orderdetails-quantity-control">
            <button @click="decreaseQuantity">-</button>
            <input type="number" v-model="quantity" min="1">
            <button @click="increaseQuantity">+</button>
          </div>
        </div>

        <div class="orderdetails-action-buttons">
          <button class="orderdetails-add-to-cart" @click="shoppinCart">加入购物车</button>
          <button class="orderdetails-buy-now" @click="payCard">立即购买</button>
        </div>
      </div>

      <!-- 商品详情区 -->
      <div class="orderdetails-product-details">
        <h2>商品详情</h2>
        <div class="orderdetails-detail-content">
          <p v-for="(detail, index) in product.details" :key="index">{{ detail }}</p>
          <img v-for="(image, index) in product.detailImages" :key="'detail-' + index" :src="image"
            :alt="'详情图' + (index + 1)">
        </div>
      </div>

      <!-- 加入购物车提示 -->
      <div v-if="showNotification" class="orderdetails-notification">
        商品已成功加入购物车！
      </div>
    </div>
  </div>
  <div>
    <!-- 背景样式 -->
    <BackgroundStyle />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BackgroundStyle from '@/components/ThemeComponents/BackgroundStyle.vue';

const route = useRoute();
const router = useRouter();

const product = reactive({
  name: "",
  images: [],
  price: 0,
  specs: [],
  details: [],
  detailImages: [],
  rating: 0,
  sales: 0,
});
// 返回上一页
const closeDialog = () => {
  router.back();
};
const currentImageIndex = ref(0);
const selectedSpec = ref("");
const quantity = ref(1);
const showNotification = ref(false);

const currentImage = computed(() => product.images[currentImageIndex.value]);
const totalPrice = computed(() => (Number(product.price) * quantity.value).toFixed(2));

onMounted(() => {
  if (route.query.item) {
    const item = JSON.parse(route.query.item);
    Object.assign(product, {
      id: item.id,
      name: item.name,
      images: [item.image],
      price: item.price,
      specs: ["默认规格"],
      details: [item.details],
      detailImages: [item.image],
      rating: item.rating,
      sales: item.sales,
    });
  }
});

const changeImage = (index) => {
  currentImageIndex.value = index;
};

const selectSpec = (spec) => {
  selectedSpec.value = spec;
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
// 跳转购物车页面
const shoppinCart = () => {
  router.push({
    name: 'shopcartviews',
    query: {
      item: JSON.stringify({
        id: product.id,
        name: product.name,
        price: Number(totalPrice.value),
        image: product.images[0],
        quantity: quantity.value
      }),
    },
  });
};

//跳转支付页面
const payCard = () => {
  router.push({
    name: 'payviews',
    query: {
      item: JSON.stringify({
        id: product.id,
        name: product.name,
        price: Number(totalPrice.value),
        quantity: quantity.value
      }),
    },
  });
};


</script>

<style scoped>
/* 基础样式 */
.orderdetails-product-container {
  position: absolute;
  width: 100%;
  z-index: 1000;
}

.orderdetails-product-detail {
  max-width: 1000px;
  margin: 20px auto;
  background-color: rgba(255, 255, 255, 1);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(38, 38, 38, 0.252);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 30px;

}

/* 商品图片区域 */
.orderdetails-product-images {
  display: flex;
  flex-direction: column;
}

.orderdetails-main-image {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.263);
}

.orderdetails-main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.orderdetails-main-image:hover img {
  transform: scale(1.03);
}

.orderdetails-thumbnail-container {
  display: flex;
  gap: 10px;
}

.orderdetails-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.orderdetails-thumbnail:hover {
  border-color: #ff6b6b;
}

.orderdetails-thumbnail.active {
  border-color: #ff6b6b;
  transform: scale(1.05);
}

.orderdetails-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 关闭按钮 */
.orderdetails-close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
}

.orderdetails-close-button button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orderdetails-close-button button:hover {
  background: rgba(255, 107, 107, 0.9);
  transform: rotate(-35deg);
}

/* 商品信息区域 */
.orderdetails-product-info {
  padding: 10px;
}

.orderdetails-product-name {
  font-size: 28px;
  margin: 0 0 15px 0;
  color: #333;
  position: relative;
  padding-bottom: 10px;
}

.orderdetails-product-name:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #ff6b6b;
}

.orderdetails-product-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.orderdetails-price-section,
.orderdetails-spec-section,
.orderdetails-quantity-section {
  margin: 25px 0;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.orderdetails-current-price {
  font-size: 32px;
  color: #ff6b6b;
  font-weight: bold;
}

.orderdetails-original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
  margin: 0 10px;
}

.orderdetails-discount {
  background: #ff6b6b;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.orderdetails-spec-section h3 {
  font-size: 18px;
}

.orderdetails-spec-options {
  display: flex;
  gap: 10px;
}

.orderdetails-spec-options button {
  padding: 8px 15px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.orderdetails-spec-options button:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.orderdetails-spec-options button.active {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.orderdetails-quantity-section h3 {
  font-size: 18px;
}
/* 累加器 */
.orderdetails-quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.orderdetails-quantity-control button {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  color: rgb(154, 154, 154);
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: stretch;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(82, 82, 82, 0.3);
  position: relative;
  overflow: hidden;
}

.orderdetails-quantity-control button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: all 0.5s ease;
}

.orderdetails-quantity-control button:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(155, 89, 182, 0.4);
}

.orderdetails-quantity-control button:hover::before {
  left: 100%;
}

.orderdetails-quantity-control button:active {
  transform: scale(0.95);
}

.orderdetails-quantity-control input {
  width: 100px;
  height: 40px;
  margin: 0 15px;
  text-align: center;
  font-size: 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

.orderdetails-quantity-control input:focus {
  outline: none;
  border-color: #9b59b6;
  box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .orderdetails-quantity-control {
    margin: 15px 0;
  }
  
  .orderdetails-quantity-control button {
    width: 36px;
    height: 36px;
    font-size: 1.3rem;
  }
  
  .orderdetails-quantity-control input {
    width: 50px;
    height: 36px;
    margin: 0 10px;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .orderdetails-quantity-control button {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
  
  .orderdetails-quantity-control input {
    width: 45px;
    height: 32px;
    margin: 0 8px;
    font-size: 1rem;
  }
}

.orderdetails-action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.orderdetails-add-to-cart,
.orderdetails-buy-now {
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.orderdetails-add-to-cart {
  background: #ff9e4f;
  color: white;
}

.orderdetails-add-to-cart:hover {
  background: #ff8a3d;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(255, 158, 79, 0.3);
}

.orderdetails-buy-now {
  background: #ff6b6b;
  color: white;
}

.orderdetails-buy-now:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(255, 107, 107, 0.3);
}

/* 商品详情区域 */
.orderdetails-product-details {
  grid-column: 1 / -1;
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(41, 41, 41, 0.295);
}

.orderdetails-product-details h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  position: relative;
  padding-bottom: 10px;
}

.orderdetails-product-details h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #ff6b6b;
}

.orderdetails-detail-content {
  line-height: 1.8;
}

.orderdetails-detail-content p {
  margin-bottom: 10px;
}

.orderdetails-detail-content img {
  max-width: 150px;
  height: auto;
  margin: 15px 0;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* 通知样式 */
.orderdetails-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.5s, fadeOut 0.5s 1.5s forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .orderdetails-product-detail {
    grid-template-columns: 1fr;
    padding: 15px;
  }

  .orderdetails-main-image {
    height: 350px;
  }

  .orderdetails-action-buttons {
    flex-direction: column;
  }
}
</style>