<template>
  <div class="data-table-container">
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" :class="{'sticky-col': col.fixed}">
              <div class="header-cell">
                {{ col.title }}
                <span v-if="col.sortable" class="sort-icon" @click="handleSort(col.key)">
                  <i class="sort-arrow" :class="{'active': sortKey === col.key && sortOrder === 'asc'}">↑</i>
                  <i class="sort-arrow" :class="{'active': sortKey === col.key && sortOrder === 'desc'}">↓</i>
                </span>
              </div>
            </th>
            <th class="sticky-col right-col">
              <div class="header-cell">操作</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(card, index) in sortedCards" :key="card.id" :class="{'striped': index % 2 === 0}">
            <td v-for="col in columns" :key="`${card.id}-${col.key}`" :class="{'sticky-col': col.fixed}">
              <div class="cell-content">
                <template v-if="col.key === 'image'">
                  <img 
                    :src="card.image" 
                    alt="攻略图片" 
                    class="table-image"
                    @click="triggerFileInput(card)"
                  >
                </template>
                <template v-else-if="col.key === 'title'">
                  {{ truncateText(card[col.key], 3) }}
                </template>
                <template v-else-if="col.key === 'description'">
                  {{ truncateText(card[col.key], 10) }}
                </template>
                <template v-else>
                  {{ card[col.key] }}
                </template>
              </div>
            </td>
            <td class="sticky-col right-col">
              <div class="action-buttons">
                <button class="btn-edit" @click="handleEdit(card)">
                  <i class="icon-edit">✏️</i>
                </button>
                <button class="btn-delete" @click="handleDelete(card)">
                  <i class="icon-delete">🗑️</i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => [
      { key: 'id', title: 'ID', sortable: true },
      { key: 'title', title: '标题', sortable: true },
      { key: 'image', title: '图片' },
      { key: 'description', title: '描述' },
      { key: 'badgeText', title: '标签', sortable: true },
      { key: 'score', title: '评分', sortable: true }
    ]
  },
  cards: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'delete', 'image-click']);

const sortKey = ref('');
const sortOrder = ref('');

const sortedCards = computed(() => {
  if (!sortKey.value) return props.cards;
  
  return [...props.cards].sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder.value === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder.value === 'asc' 
        ? valA - valB
        : valB - valA;
    }
  });
});

function handleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}

function truncateText(text, length) {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

function triggerFileInput(card) {
  emit('image-click', card);
}

function handleEdit(card) {
  emit('edit', card);
}

function handleDelete(card) {
  emit('delete', card);
}
</script>

<style scoped>
.data-table-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  overflow: hidden;
}

.data-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 10px;
  scrollbar-width: thin;
  scrollbar-color: #4e73df #f8f9fa;
}

.data-table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.data-table-wrapper::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 10px;
}

.data-table-wrapper::-webkit-scrollbar-thumb {
  background-color: #4e73df;
  border-radius: 10px;
  border: 2px solid #f8f9fa;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1000px;
  font-size: 14px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.data-table th, .data-table td {
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid #e3e6f0;
  position: relative;
}

.data-table th {
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table th .header-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-icon {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  cursor: pointer;
}

.sort-arrow {
  font-size: 10px;
  opacity: 0.5;
  transition: all 0.2s;
  line-height: 0.8;
}

.sort-arrow.active {
  opacity: 1;
  color: #f8f9fa;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
}

.sort-arrow:hover {
  opacity: 1;
}

.data-table tbody tr:hover {
  background-color: rgba(78, 115, 223, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.data-table tbody tr.striped {
  background-color: #f8f9fa;
}

.sticky-col {
  position: sticky;
  background: inherit;
  z-index: 1;
}

.sticky-col:first-child {
  left: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.right-col {
  right: 0;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
}

.table-image {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.table-image:hover {
  transform: scale(1.5);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-edit, .btn-delete {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-edit {
  color: #4e73df;
  background: rgba(78, 115, 223, 0.1);
}

.btn-delete {
  color: #e74a3b;
  background: rgba(231, 74, 59, 0.1);
}

.btn-edit:hover {
  background: rgba(78, 115, 223, 0.2);
  transform: translateY(-2px);
}

.btn-delete:hover {
  background: rgba(231, 74, 59, 0.2);
  transform: translateY(-2px);
}

.icon-edit, .icon-delete {
  font-size: 14px;
}

.cell-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-table-container {
    padding: 10px;
  }
  
  .data-table th, .data-table td {
    padding: 12px 8px;
  }
}
</style>