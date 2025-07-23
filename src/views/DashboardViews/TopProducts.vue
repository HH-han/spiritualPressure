<template>
  <div class="dashboard-card" style="grid-column: 1 / -1;">
    <h3 class="dashboard-card-title">表现最佳的产品</h3>
    <div class="products-table">
      <div class="table-header">
        <div>产品名称</div>
        <div>类别</div>
        <div>销售</div>
        <div>收益</div>
        <div>科技</div>
      </div>

      <div v-for="(product, index) in products" :key="index" class="table-row"
        :style="`animation-delay: ${index * 0.1}s`">
        <div class="product-info">
          <!-- <div class="product-avatar">
              <img :src="product.image" :alt="product.name">
            </div> -->
          <div class="product-name">{{ product.name }}</div>
        </div>
        <div>
          <span class="product-category" :style="{ backgroundColor: product.categoryColor }">
            {{ product.category }}
          </span>
        </div>
        <div class="product-sales">{{ product.sales }}</div>
        <div class="product-revenue">{{ product.revenue }}</div>
        <div class="product-tech">
          <span v-for="(tech, techIndex) in product.tech" :key="techIndex" class="tech-icon">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const products = [
  {
    name: '黄山',
    category: '旅游景区',
    categoryColor: 'rgba(0, 184, 148, 0.1)',
    sales: 234,
    revenue: '￥45,200',
    tech: ['📱', '⚡']
  },
  {
    name: '北京烤鸭',
    category: '美食',
    categoryColor: 'rgba(253, 203, 110, 0.1)',
    sales: 189,
    revenue: '￥32,150',
    tech: ['📺', '🔄']
  },
  {
    name: '巴黎铁塔',
    category: '海外',
    categoryColor: 'rgba(108, 92, 231, 0.1)',
    sales: 156,
    revenue: '￥28,750',
    tech: ['🎧', '🔋']
  },
  {
    name: '普洱茶',
    // image: 'https://via.placeholder.com/40',
    category: '小物件',
    categoryColor: 'rgba(9, 132, 227, 0.1)',
    sales: 132,
    revenue: '￥24,890',
    tech: ['⌚', '❤️']
  }
]
</script>

<style scoped>
.products-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-weight: 600;
  color: var(--dark);
  opacity: 0.7;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: var(--transition);
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.table-row:hover {
  background: rgba(108, 92, 231, 0.03);
  transform: translateX(5px);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.product-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-weight: 500;
}

.product-category {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.product-sales,
.product-revenue {
  font-weight: 500;
  color: var(--dark);
}

.product-revenue {
  color: var(--primary);
  font-weight: 600;
}

.product-tech {
  display: flex;
  gap: 0.5rem;
}

.tech-icon {
  font-size: 1.1rem;
  transition: var(--transition);
}

.tech-icon:hover {
  transform: scale(1.5);
}
</style>