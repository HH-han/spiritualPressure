<template>
  <div class="dashboard-card" style="grid-column: 1 / -1;">
    <div class="transactions-header">
      <h3 class="dashboard-card-title">近期交易</h3>
      <button class="view-all">查看所有交易 </button>
    </div>

    <div class="transactions-list">
      <div v-for="(transaction, index) in transactions" :key="index" class="transaction-item"
        :style="`animation-delay: ${index * 0.1}s`">
        <div class="transaction-icon" :style="{ backgroundColor: transaction.color }">
          <span>{{ transaction.icon }}</span>
        </div>
        <div class="transaction-details">
          <div class="transaction-title">{{ transaction.title }}</div>
          <div class="transaction-date">{{ transaction.date }}</div>
        </div>
        <div class="transaction-amount" :class="transaction.amountClass">
          {{ transaction.amount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const transactions = [
  {
    icon: '🛒',
    title: '购物支付',
    date: '2023-05-01 14:30',
    amount: '-￥120.00',
    amountClass: 'negative',
    color: 'rgba(108, 92, 231, 0.1)'
  },
  {
    icon: '💰',
    title: '工资收入',
    date: '2023-05-01 10:00',
    amount: '+￥2,500.00',
    amountClass: 'positive',
    color: 'rgba(0, 184, 148, 0.1)'
  },
  {
    icon: '↗️',
    title: '转账收入',
    date: '2023-04-30 16:45',
    amount: '+￥800.00',
    amountClass: 'positive',
    color: 'rgba(253, 203, 110, 0.1)'
  },
  {
    icon: '🍽️',
    title: '餐厅消费',
    date: '2023-04-30 12:30',
    amount: '-￥65.50',
    amountClass: 'negative',
    color: 'rgba(214, 48, 49, 0.1)'
  }
]
</script>

<style scoped>
.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-all {
  background: none;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 8px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}

.view-all:hover {
  background: var(--primary);
  color: white;
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  transition: var(--transition);
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.transaction-item:hover {
  transform: translateX(10px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.transaction-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
  transition: var(--transition);
}

.transaction-item:hover .transaction-icon {
  transform: rotate(15deg) scale(1.1);
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  font-weight: 500;
  color: var(--dark);
  margin-bottom: 0.3rem;
}

.transaction-date {
  font-size: 0.8rem;
  color: var(--dark);
  opacity: 0.6;
}

.transaction-amount {
  font-weight: 600;
}

.positive {
  color: var(--success);
}

.negative {
  color: var(--danger);
}
</style>