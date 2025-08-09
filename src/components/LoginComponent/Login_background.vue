<template>
	<div class="area-login">
		<ul class="circles-login">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<!-- 主题切换组件 -->
			<div class="theme-switch-login">
				<ThemeSwitching/>
			</div>
		</ul>
	</div>
</template>
<script setup>

import ThemeSwitching from '@/components/ThemeComponents/ThemeSwitching.vue'

</script>
<style>
@import '@/css/Login/login_backgroundstyle.css';
</style>