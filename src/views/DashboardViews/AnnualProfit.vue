<template>
  <div class="dashboard-card">
    <h3 class="dashboard-card-title">年利润</h3>
    <div class="profit-header">
      <div>
        <div class="profit-label">转化率</div>
        <div class="profit-rate">18.4%</div>
      </div>
      <div class="profit-chart">
        <canvas ref="lineCanvas"></canvas>
      </div>
    </div>
    
    <div class="profit-stats">
      <div class="profit-stat">
        <div class="stat-header">
          <span>已加入购物车</span>
          <span class="stat-amount">￥21,120.70</span>
        </div>
        <div class="stat-change positive">比去年 +13.2%</div>
      </div>
      
      <div class="profit-stat">
        <div class="stat-header">
          <span>已购买</span>
          <span class="stat-amount">￥16,100.00</span>
        </div>
        <div class="stat-change negative">比去年 -7.4%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart as ChartJS, registerables } from 'chart.js/auto'

ChartJS.register(...registerables)

const lineCanvas = ref(null)

onMounted(() => {
  const ctx = lineCanvas.value.getContext('2d')
  
  new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        data: [15000, 18000, 21000, 24000],
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#6c5ce7',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  })
})
</script>

<style scoped>
.profit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profit-label {
  font-size: 0.9rem;
  color: var(--dark);
  opacity: 0.7;
  margin-bottom: 0.3rem;
}

.profit-rate {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
}

.profit-chart {
  width: 150px;
  height: 80px;
}

.profit-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profit-stat {
  background: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 10px;
  transition: var(--transition);
}

.profit-stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-amount {
  font-weight: 700;
  color: var(--dark);
}

.stat-change {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>