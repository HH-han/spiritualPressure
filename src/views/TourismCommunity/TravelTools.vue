<template>
  <div class="container">
    <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">旅游工具</h2>

    <!-- 旅行计划制定 -->
    <div class="traveltools-plan">
      <div class="traveltools-section-title">制定旅行计划</div>
      <form class="traveltools-form" @submit.prevent="generatePlan">
        <div class="traveltools-form-group">
          <label class="traveltools-label">目的地</label>
          <input type="text" class="traveltools-input" v-model="travelPlan.destination" placeholder="请输入目的地">
        </div>

        <div class="traveltools-form-group">
          <label class="traveltools-label">出发日期</label>
          <input type="date" class="traveltools-input" v-model="travelPlan.startDate">
        </div>

        <div class="traveltools-form-group">
          <label class="traveltools-label">返回日期</label>
          <input type="date" class="traveltools-input" v-model="travelPlan.endDate">
        </div>

        <div class="traveltools-form-group">
          <label class="traveltools-label">预算（元）</label>
          <input type="number" class="traveltools-input" v-model="travelPlan.budget" placeholder="请输入预算金额">
        </div>

        <div class="traveltools-form-group">
          <label class="traveltools-label">旅行偏好</label>
          <select class="traveltools-select" v-model="travelPlan.preference">
            <option value="">请选择</option>
            <option value="culture">文化体验</option>
            <option value="nature">自然风光</option>
            <option value="food">美食之旅</option>
            <option value="shopping">购物天堂</option>
            <option value="relax">休闲度假</option>
          </select>
        </div>

        <div class="traveltools-form-group">
          <label class="traveltools-label">住宿偏好</label>
          <select class="traveltools-select" v-model="travelPlan.accommodation">
            <option value="">请选择</option>
            <option value="luxury">豪华酒店</option>
            <option value="mid-range">中档酒店</option>
            <option value="budget">经济型酒店</option>
            <option value="hostel">青年旅舍</option>
          </select>
        </div>

        <div class="traveltools-form-group" style="grid-column: span 2;">
          <label class="traveltools-label">备注</label>
          <textarea class="traveltools-textarea" v-model="travelPlan.notes" placeholder="请输入其他需求或备注信息"></textarea>
        </div>

        <button type="submit" class="traveltools-button" style="grid-column: span 2;">生成旅行计划</button>
      </form>
    </div>

    <!-- 旅行笔记记录 -->
    <div class="traveltools-notes">
      <div class="traveltools-section-title">旅行笔记</div>
      <div class="traveltools-notes-container">
        <div class="traveltools-note" v-for="(note, index) in travelNotes" :key="index">
          <div class="traveltools-note-title">{{ note.title }} - {{ note.date }}</div>
          <div class="traveltools-note-content">{{ note.content }}</div>
        </div>
      </div>

      <form class="traveltools-form" @submit.prevent="saveNote">
        <div class="traveltools-form-group">
          <label class="traveltools-label">旅行标题</label>
          <input type="text" class="traveltools-input" v-model="newNote.title" placeholder="请输入旅行标题">
        </div>

        <div class="traveltools-form-group">
          <label class="traveltools-label">旅行日期</label>
          <input type="date" class="traveltools-input" v-model="newNote.date">
        </div>

        <div class="traveltools-form-group" style="grid-column: span 2;">
          <label class="traveltools-label">旅行笔记</label>
          <textarea class="traveltools-textarea" v-model="newNote.content" placeholder="记录你的旅行见闻、感受和花费..."
            rows="4"></textarea>
        </div>

        <button type="submit" class="traveltools-button" style="grid-column: span 2;">保存笔记</button>
      </form>
    </div>

    <!-- 实用工具 -->
    <div class="traveltools-tools">
      <!-- 货币换算 -->
      <div class="traveltools-currency">
        <div class="traveltools-section-title">货币换算</div>
        <form class="traveltools-currency-form" @submit.prevent="convertCurrency">
          <div class="traveltools-form-group">
            <label class="traveltools-label">金额</label>
            <input type="number" class="traveltools-input" v-model="currency.amount" placeholder="输入金额">
          </div>

          <div class="traveltools-form-group">
            <label class="traveltools-label">原始货币</label>
            <select class="traveltools-select" v-model="currency.from">
              <option value="CNY">人民币 (CNY)</option>
              <option value="USD">美元 (USD)</option>
              <option value="EUR">欧元 (EUR)</option>
              <option value="JPY">日元 (JPY)</option>
              <option value="GBP">英镑 (GBP)</option>
            </select>
          </div>

          <div class="traveltools-form-group">
            <label class="traveltools-label">目标货币</label>
            <select class="traveltools-select" v-model="currency.to">
              <option value="USD">美元 (USD)</option>
              <option value="CNY">人民币 (CNY)</option>
              <option value="EUR">欧元 (EUR)</option>
              <option value="JPY">日元 (JPY)</option>
              <option value="GBP">英镑 (GBP)</option>
            </select>
          </div>

          <div class="traveltools-form-group"
            style="grid-column: span 2; display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;">
            <button type="button" class="traveltools-button" @click="convertCurrency">🔁换算</button>
            <button type="button" class="traveltools-button" @click="swapCurrencies">🔄交换</button>
          </div>

          <div class="traveltools-form-group">
            <label class="traveltools-label">结果</label>
            <input type="text" class="traveltools-input" :value="currency.result" readonly>
          </div>
        </form>
      </div>

      <!-- 天气查询 -->
      <div class="traveltools-weather">
        <div class="traveltools-section-title">⛅天气查询</div>
        <form class="traveltools-weather-form" @submit.prevent="checkWeather">
          <div class="traveltools-form-group">
            <label class="traveltools-label">城市</label>
            <input type="text" class="traveltools-input" v-model="weather.city" placeholder="输入城市名称">
          </div>

          <div class="traveltools-form-group">
            <label class="traveltools-label">日期</label>
            <input type="date" class="traveltools-input" v-model="weather.date">
          </div>

          <button type="submit" class="traveltools-button" style="grid-column: span 2;">🔍查询天气</button>

          <div v-if="weather.result" class="traveltools-note">
            <div class="traveltools-note-title">{{ weather.city }} - {{ weather.date }}</div>
            <div class="traveltools-note-content">
              天气：{{ weather.result.condition }}<br>
              温度：{{ weather.result.temp }}<br>
              湿度：{{ weather.result.humidity }}<br>
              风力：{{ weather.result.wind }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'

// 旅行计划功能
const travelPlan = reactive({
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  preference: '',
  accommodation: '',
  notes: ''
})

const generatePlan = () => {
  alert(`旅行计划生成中...\n
目的地: ${travelPlan.destination}
日期: ${travelPlan.startDate} 至 ${travelPlan.endDate}
预算: ${travelPlan.budget} 元
偏好: ${travelPlan.preference || '无'}
住宿: ${travelPlan.accommodation || '无'}
备注: ${travelPlan.notes || '无'}`)
}

// 旅行笔记功能
const travelNotes = ref([])
const newNote = reactive({
  title: '',
  date: '',
  content: ''
})

const saveNote = () => {
  if (!newNote.title || !newNote.content) {
    alert('请填写标题和内容')
    return
  }

  travelNotes.value.push({
    title: newNote.title,
    date: newNote.date || new Date().toISOString().split('T')[0],
    content: newNote.content
  })

  localStorage.setItem('travelNotes', JSON.stringify(travelNotes.value))
  Object.assign(newNote, { title: '', date: '', content: '' })
}

// 货币换算功能
const currency = reactive({
  amount: 0,
  from: 'CNY',
  to: 'USD',
  result: 0
})

const exchangeRates = {
  CNY: { USD: 0.14, EUR: 0.13, JPY: 20.3, GBP: 0.11 },
  USD: { CNY: 7.0, EUR: 0.92, JPY: 145.3, GBP: 0.79 },
  EUR: { CNY: 7.8, USD: 1.09, JPY: 158.0, GBP: 0.86 },
  JPY: { CNY: 0.049, USD: 0.0069, EUR: 0.0063, GBP: 0.0055 },
  GBP: { CNY: 9.1, USD: 1.27, EUR: 1.16, JPY: 183.0 }
}

const convertCurrency = () => {
  if (!currency.amount) {
    currency.result = 0
    return
  }

  if (currency.from === currency.to) {
    currency.result = currency.amount
    return
  }

  const rate = exchangeRates[currency.from]?.[currency.to]
  if (rate) {
    currency.result = (currency.amount * rate).toFixed(2)
  } else {
    alert('暂不支持此货币兑换')
  }
}

const swapCurrencies = () => {
  [currency.from, currency.to] = [currency.to, currency.from]
  convertCurrency()
}

// 天气查询功能
const weather = reactive({
  city: '杭州',
  date: new Date().toISOString().split('T')[0],
  result: null
})

const mockWeatherData = {
  '北京': {
    '2023-10-15': { temp: '18°C', humidity: '45%', wind: '2级北风', condition: '晴' },
    '2023-10-16': { temp: '20°C', humidity: '50%', wind: '1级南风', condition: '多云' }
  },
  '上海': {
    '2023-10-15': { temp: '22°C', humidity: '70%', wind: '3级东南风', condition: '阴' },
    '2023-10-16': { temp: '24°C', humidity: '75%', wind: '2级东风', condition: '小雨' }
  },
  '杭州': {
    '2023-10-15': { temp: '21°C', humidity: '65%', wind: '2级东风', condition: '多云' },
    '2023-10-16': { temp: '23°C', humidity: '70%', wind: '3级南风', condition: '晴' }
  }
}

const checkWeather = () => {
  if (!weather.city) {
    alert('请输入城市名称')
    return
  }

  weather.result = mockWeatherData[weather.city]?.[weather.date] || null

  if (!weather.result) {
    alert(`暂无 ${weather.city} 在 ${weather.date} 的天气数据`)
  }
}

// 初始化加载本地存储的笔记
onMounted(() => {
  const savedNotes = localStorage.getItem('travelNotes')
  if (savedNotes) {
    try {
      travelNotes.value = JSON.parse(savedNotes)
    } catch (e) {
      console.error('读取笔记失败:', e)
    }
  }

  // 设置默认天气查询日期为今天
  weather.date = new Date().toISOString().split('T')[0]
})
</script>
<style scoped>
:root {
  --primaryt-color: #3e77f3;
  --secondary-color: #34d2ea;
  --accent-color: #ff7675;
  --gradient-bg: linear-gradient(135deg, #40a8f3 0%, #34d2ea 100%);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  padding: 2rem;
}

.traveltools-section-title {
  font-size: 1.5rem;
  color: white;
  margin: 1.5rem 0;
  padding: 0.8rem 1.5rem;
  background: var(--gradient-bg);
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.traveltools-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.traveltools-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.traveltools-input,
.traveltools-select,
.traveltools-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.traveltools-input:focus,
.traveltools-select:focus,
.traveltools-textarea:focus {
  border-color: var(--primaryt-color);
  box-shadow: 0 0 8px rgba(108, 92, 231, 0.2);
  outline: none;
}

.traveltools-button {
  background: var(--gradient-bg);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.traveltools-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
}

.traveltools-notes-container {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.traveltools-note {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.traveltools-note:hover {
  transform: translateY(-3px);
}

.traveltools-tools {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.traveltools-currency-form,
.traveltools-weather-form {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 15px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container>div {
  animation: fadeIn 0.6s ease forwards;
}

@media (max-width: 768px) {

  .traveltools-form,
  .traveltools-tools {
    grid-template-columns: 1fr;
  }

  .traveltools-form-group[style*="grid-column: span 2"] {
    grid-column: span 1;
  }
}
</style>