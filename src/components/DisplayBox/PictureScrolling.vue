<template>
    <div class="picture-scrolling">
        <!-- From Uiverse.io by kamehame-ha --> 
        <div class="scroll-snap-card">
            <div class="slide red">
                <p class="tip">Scroll On Me</p>
            </div>
            <div class="slide blue">
                <p class="tip">Scroll On Me</p>
            </div>
            <div class="slide green">
                <p class="tip">Scroll On Me</p>
            </div>
            <div class="slide red">
                <p class="tip">Scroll On Me</p>
            </div>
        </div>
    </div>
</template>
<script>

</script>
<style scoped>
.picture-scrolling {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
/* From Uiverse.io by kamehame-ha */ 
.red {
  background-color: #f43f5e;
}

.blue {
  background-color: #3b82f6;
}

.green {
  background-color: #22c55e;
}

.scroll-snap-card {
  height: 350px;
  width: 550px;
  scroll-snap-type: y mandatory;
  overflow: auto;
  border-radius: 10px;
}

.scroll-snap-card .slide {
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-snap-card .slide p {
  font-size: 1em;
  color: white;
  font-weight: 700;
}
</style>