<template>
  <div class="options-grid">
    <EmojiOption @select="handleOptionSelect" />
    <AlbumOption @select="handleOptionSelect" />
    <MusicOption @select="handleOptionSelect" />
    <FileOption @select="handleOptionSelect" />
    <LocationOption @select="handleOptionSelect" />
    <CardOption @select="handleOptionSelect" />
  </div>
</template>

<script setup>
import EmojiOption from './EmojiOption.vue'
import AlbumOption from './AlbumOption.vue'
import MusicOption from './MusicOption.vue'
import FileOption from './FileOption.vue'
import LocationOption from './LocationOption.vue'
import CardOption from './CardOption.vue'

const emit = defineEmits(['select'])

const handleOptionSelect = (optionType, data) => {
  emit('select', optionType, data)
}
</script>

<style scoped>
.options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}
</style>