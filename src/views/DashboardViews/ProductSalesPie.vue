<template>
  <div class="dashboard-card">
    <h3 class="dashboard-card-title">产品销售</h3>
    <div class="pie-container">
      <canvas ref="pieCanvas"></canvas>
      <div class="pie-center">
        <div class="total-sales">8,364</div>
        <div class="total-label">销售总额</div>
      </div>
    </div>
    <div class="pie-legend">
      <div v-for="(item, index) in legendData" :key="index" class="legend-item">
        <div class="legend-color" :style="{ backgroundColor: colors[index] }"></div>
        <div class="legend-text">
          <span class="percentage">{{ item.percentage }}%</span>
          <span class="label">{{ item.label }}</span>
        </div>
      </div>
    </div>
    <div class="pie-footer">
      这是 material 面板本月的销售数据
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart as ChartJS, registerables } from 'chart.js/auto'

ChartJS.register(...registerables)

const pieCanvas = ref(null)
const colors = ['#6c5ce7', '#00b894', '#fdcb6e', '#0984e3', '#d63031']
const legendData = [
  { percentage: 36, label: '实现现代化' },
  { percentage: 17, label: '峰值' },
  { percentage: 10, label: '充足' },
  { percentage: 16, label: '材料 M' },
  { percentage: 22, label: '其他' }
]

onMounted(() => {
  const ctx = pieCanvas.value.getContext('2d')

  new ChartJS(ctx, {
    type: 'doughnut',
    data: {
      labels: legendData.map(item => item.label),
      datasets: [{
        data: legendData.map(item => item.percentage),
        backgroundColor: colors,
        borderWidth: 0,
        cutout: '70%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  })
})
</script>

<style scoped>
.pie-container {
  position: relative;
  height: 250px;
  margin: 1rem 0;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.total-sales {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.total-label {
  font-size: 0.8rem;
  color: var(--dark);
  opacity: 0.7;
}

.pie-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 10px;
}

.legend-text {
  display: flex;
  flex-direction: column;
}

.percentage {
  font-weight: 600;
  font-size: 0.9rem;
}

.label {
  font-size: 0.8rem;
  color: var(--dark);
  opacity: 0.7;
}

.pie-footer {
  text-align: center;
  font-size: 0.8rem;
  color: var(--dark);
  opacity: 0.6;
  margin-top: 1rem;
}
</style>