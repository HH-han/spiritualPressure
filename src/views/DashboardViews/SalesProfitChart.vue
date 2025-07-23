<template>
  <div class="dashboard-card">
    <div class="dashboard-chart-header">
      <h3 class="dashboard-card-title">销售利润</h3>
      <div class="chart-tabs">
        <button v-for="tab in tabs" :key="tab" :class="{ active: activeTab === tab }" @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>
    </div>

    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="chart-footer">
      <div class="chart-stats">
        <div class="stat">
          <div class="amount">￥63,489.50</div>
          <div class="change positive">比去年 +8%</div>
        </div>
        <div class="stat">
          <div class="amount">￥38,496.00</div>
          <div class="change negative">比去年 -6%</div>
        </div>
      </div>
      <button class="view-details">查看详情</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart as ChartJS, registerables } from 'chart.js/auto'

ChartJS.register(...registerables)

const chartCanvas = ref(null)
const activeTab = ref('利润')
const tabs = ['利润', '成本']
let chartInstance = null

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月'],
      datasets: [{
        label: activeTab.value,
        data: [45000, 42000, 48000, 51000, 58000, 63000, 62000, 65000],
        borderColor: activeTab.value === '利润' ? '#00b894' : '#d63031',
        backgroundColor: activeTab.value === '利润' ? 'rgba(0, 184, 148, 0.1)' : 'rgba(214, 48, 49, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: activeTab.value === '利润' ? '#00b894' : '#d63031',
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
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          grid: { display: false }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  })
}

onMounted(initChart)
watch(activeTab, initChart)
</script>

<style scoped>
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-tabs {
  display: flex;
  background: rgba(108, 92, 231, 0.1);
  border-radius: 50px;
  padding: 5px;
}

.chart-tabs button {
  border: none;
  background: none;
  padding: 8px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.chart-tabs button.active {
  background: var(--primary);
  color: white;
}

.chart-container {
  height: 250px;
  margin: 1rem 0;
}

.chart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.chart-stats {
  display: flex;
  gap: 2rem;
}

.stat .amount {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.stat .change {
  font-size: 0.9rem;
  font-weight: 500;
}

.view-details {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
}

.view-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 92, 231, 0.4);
}
</style>