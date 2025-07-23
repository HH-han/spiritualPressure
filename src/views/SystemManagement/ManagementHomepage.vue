<template>
  <div class="dashboard">
    <HeaderInfo />
    <div class="display-container">
      <div class="display-container-gap">
        <ProductSalesPie />
        <PaymentsModule />
        <AnnualProfit />
      </div>
      <div class="display-container-gap">
        <SalesProfitChart />
        <MarketingReport />
      </div>
    </div>
    <div class="display-container">
      <TopProducts />
      <RecentTransactions />
    </div>
  </div>
</template>

<script setup>
import HeaderInfo from '@/views/DashboardViews/HeaderInfo.vue'
import ProductSalesPie from '@/views/DashboardViews/ProductSalesPie.vue'
import SalesProfitChart from '@/views/DashboardViews/SalesProfitChart.vue'
import MarketingReport from '@/views/DashboardViews/MarketingReport.vue'
import PaymentsModule from '@/views/DashboardViews/PaymentsModule.vue'
import AnnualProfit from '@/views/DashboardViews/AnnualProfit.vue'
import TopProducts from '@/views/DashboardViews/TopProducts.vue'
import RecentTransactions from '@/views/DashboardViews/RecentTransactions.vue'
</script>

<style scoped>
@import '@/css/Management/main.css';
</style>