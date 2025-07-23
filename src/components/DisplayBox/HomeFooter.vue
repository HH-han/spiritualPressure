<template>
    <div>
        <footer class="homefooter-footer">
            <div class="homefooter-footer-content">
            <div class="homefooter-footer-section">
                <h3 class="homefooter-footer-title">关于我们</h3>
                <p class="homefooter-footer-text">
                我们致力于为用户提供丰富的旅行资源。
                </p>
            </div>
            <div class="homefooter-footer-section">
                <h3 class="homefooter-footer-title">联系方式</h3>
                <p class="homefooter-footer-text">
                邮箱: contact@businesssystem.com<br>
                电话: 400-123-4567
                </p>
            </div>
            </div>
            <div class="homefooter-footer-copyright">
            © 2024 博览旅行 版权所有
            </div>
        </footer>
    </div>
</template>
<script setup>

</script>
<style scoped>
/* 页脚 */
.homefooter-footer {
  background: #2c3e50;
  color: white;
  padding: 60px 0 0;
  margin-top: 20px;
}

.homefooter-footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}

.homefooter-footer-section {
  flex: 1;
  min-width: 250px;
}

.homefooter-footer-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.homefooter-footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 2px;
  width: 70px;
  height: 4px;
  background: linear-gradient(90deg, #0b90e8, #f719ce);
}

.homefooter-footer-text {
  opacity: 0.8;
  line-height: 1.8;
  color: aliceblue;
}

.homefooter-footer-copyright {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>