<template>
    <header>
        <Header />
    </header>
    <main class="main-content-discover">
        <ViewMore />
    </main>
    <footer>
        <Footer />
    </footer>

</template>

<script setup>
import Header from '@/components/ResponseComponent/NavigationHeader.vue'
import Footer from '@/components/ResponseComponent/NavigationFooter.vue'
import ViewMore from '@/views/ResponseView/ViewMore.vue'

</script>

<style scoped>
@import "@/css/Response/ResponseCss.css";
</style>