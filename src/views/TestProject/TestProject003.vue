  <template>
    <div class="tooltip top-arrow">顶部箭头提示框</div><br>
    <div class="tooltip bottom-arrow">底部箭头提示框</div><br>
    <div class="tooltip left-arrow">左侧箭头提示框</div><br>
    <div class="tooltip right-arrow">右侧箭头提示框</div>
  </template>

<script setup>
import { ref } from 'vue'

</script>

<style>
.tooltip {
  position: relative;
  display: inline-block;
  padding: 10px 15px;
  background-color: #333;
  color: white;
  border-radius: 4px;
  max-width: 200px;
  margin: 50px;
}

/* 箭头共用样式 */
.tooltip::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}

/* 左侧箭头 */
.left-arrow::after {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #333;
  border-left: none;
}
</style>