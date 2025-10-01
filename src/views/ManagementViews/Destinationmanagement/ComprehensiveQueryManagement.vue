<template>
  <div class="management-page-background">
    <div class="container-management">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else>
        <!-- 查询条件栏 -->
        <div class="query-conditions">
          <div class="condition-row">
            <div class="condition-group">
              <label>目的地名称:</label>
              <input type="text" v-model="queryParams.destinationName" placeholder="输入目的地名称" />
            </div>
            <div class="condition-group">
              <label>城市名称:</label>
              <input type="text" v-model="queryParams.cityName" placeholder="输入城市名称" />
            </div>
            <div class="condition-group">
              <label>地区标签:</label>
              <input type="text" v-model="queryParams.regionTag" placeholder="输入地区标签" />
            </div>
          </div>
          <div class="condition-row">
            <div class="condition-group">
              <label>状态:</label>
              <select v-model="queryParams.status">
                <option value="">全部</option>
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
            <div class="condition-group">
              <label>排序方式:</label>
              <select v-model="queryParams.sortBy">
                <option value="name">按名称</option>
                <option value="createdAt">按创建时间</option>
                <option value="updatedAt">按更新时间</option>
              </select>
            </div>
            <div class="condition-group">
              <label>排序方向:</label>
              <select v-model="queryParams.sortOrder">
                <option value="asc">升序</option>
                <option value="desc">降序</option>
              </select>
            </div>
          </div>
          <div class="query-buttons">
            <button class="btn search-btn" @click="handleSearch">查询</button>
            <button class="btn reset-btn" @click="handleReset">重置</button>
            <button class="btn export-btn" @click="handleExport">导出数据</button>
          </div>
        </div>

        <!-- 数据表格 -->
        <div class="data-table-container">
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>目的地名称</th>
                  <th>城市名称</th>
                  <th>地区标签</th>
                  <th>描述</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody v-if="filteredItems.length > 0">
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.provinceName || item.destinationName || item.destination }}</td>
                  <td>{{ item.cityName || item.city }}</td>
                  <td>{{ item.regionName || item.regionTag || item.region }}</td>
                  <td>{{ item.description ? item.description.substring(0, 25) + '...' : '' }}</td>
                  <td>
                    <span :class="['status-badge', item.status === 'active' ? 'active' : 'inactive']">
                      {{ item.status === 'active' ? '启用' : '禁用' }}
                    </span>
                  </td>
                  <td>{{ formatDate(item.createdAt || item.created_at) }}</td>
                  <td>{{ formatDate(item.updatedAt || item.updated_at) }}</td>
                  <td class="table-btn-display">
                    <button class="btn details-btn" @click="showDetailsDialog(item)">详情</button>
                    <button class="btn edit-btn" @click="handleEdit(item)">编辑</button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="9" class="no-data">未找到相关数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 分页器 -->
        <div class="block">
          <el-pagination 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange"
            :current-page="currentPage" 
            :page-sizes="[10, 20, 50, 100]" 
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total" />
        </div>

        <!-- 详情弹窗 -->
        <div v-if="showDetailsDialog" class="dialog-overlay" @click.self="closeDetailsDialog">
          <div class="dialog" @click.stop style="max-width: 700px;">
            <h2>综合查询详情</h2>
            <div class="details-container">
              <div class="detail-section">
                <h3>基本信息</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>ID:</label>
                    <span>{{ selectedItem.id }}</span>
                  </div>
                  <div class="detail-item">
                    <label>目的地名称:</label>
                    <span>{{ selectedItem.provinceName || selectedItem.destinationName || selectedItem.destination }}</span>
                  </div>
                  <div class="detail-item">
                    <label>城市名称:</label>
                    <span>{{ selectedItem.cityName || selectedItem.city }}</span>
                  </div>
                  <div class="detail-item">
                    <label>地区标签:</label>
                    <span>{{ selectedItem.regionName || selectedItem.regionTag || selectedItem.region }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3>详细信息</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>描述:</label>
                    <span>{{ selectedItem.description }}</span>
                  </div>
                  <div class="detail-item">
                    <label>状态:</label>
                    <span :class="['status-badge', selectedItem.status === 'active' ? 'active' : 'inactive']">
                      {{ selectedItem.status === 'active' ? '启用' : '禁用' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>排序:</label>
                    <span>{{ selectedItem.sortOrder || 0 }}</span>
                  </div>
                  <div class="detail-item">
                    <label>创建时间:</label>
                    <span>{{ formatDate(selectedItem.createdAt || selectedItem.created_at) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>更新时间:</label>
                    <span>{{ formatDate(selectedItem.updatedAt || selectedItem.updated_at) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedItem.images && selectedItem.images.length > 0" class="detail-section">
                <h3>相关图片</h3>
                <div class="image-gallery">
                  <div 
                    v-for="(image, index) in selectedItem.images.slice(0, 3)" 
                    :key="index" 
                    class="image-item"
                  >
                    <img :src="image" :alt="`图片 ${index + 1}`" />
                  </div>
                </div>
              </div>
            </div>
            <div class="dialog-buttons">
              <button type="button" class="btn cancel-btn" @click="closeDetailsDialog">关闭</button>
            </div>
          </div>
        </div>

        <!-- 自定义提示框组件 -->
        <ToastType v-if="showToast" :toastMessage="toastMessage" :toastType="toastType" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getTravelDestinations } from '@/api/destination';
import ToastType from '@/components/PromptComponent/ToastType.vue';

// 数据相关
const items = ref([]);
const loading = ref(true);
const showDetailsDialog = ref(false);
const selectedItem = ref({});

// 查询参数
const queryParams = ref({
  destinationName: '',
  cityName: '',
  regionTag: '',
  status: '',
  sortBy: 'name',
  sortOrder: 'asc'
});

// 提示框相关
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 搜索功能
const filteredItems = computed(() => {
  if (!items.value) return [];
  
  let filtered = items.value;
  
  // 目的地名称筛选
  if (queryParams.value.destinationName) {
    const keyword = queryParams.value.destinationName.toLowerCase();
    filtered = filtered.filter(item => 
      (item.provinceName && item.provinceName.toLowerCase().includes(keyword)) ||
      (item.destinationName && item.destinationName.toLowerCase().includes(keyword))
    );
  }
  
  // 城市名称筛选
  if (queryParams.value.cityName) {
    const keyword = queryParams.value.cityName.toLowerCase();
    filtered = filtered.filter(item => 
      (item.cityName && item.cityName.toLowerCase().includes(keyword)) ||
      (item.city && item.city.toLowerCase().includes(keyword))
    );
  }
  
  // 地区标签筛选
  if (queryParams.value.regionTag) {
    const keyword = queryParams.value.regionTag.toLowerCase();
    filtered = filtered.filter(item => 
      (item.regionName && item.regionName.toLowerCase().includes(keyword)) ||
      (item.region && item.region.toLowerCase().includes(keyword))
    );
  }
  
  // 状态筛选
  if (queryParams.value.status) {
    filtered = filtered.filter(item => item.status === queryParams.value.status);
  }
  
  // 排序
  filtered.sort((a, b) => {
    const aValue = a[queryParams.value.sortBy] || '';
    const bValue = b[queryParams.value.sortBy] || '';
    
    if (queryParams.value.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  return filtered;
});

// 获取数据
const fetchItems = async () => {
  try {
    loading.value = true;
    
    // 获取所有数据
    const response = await getTravelDestinations();
    
    if (response.code === "0") {
      // 将省份-城市层级数据转换为扁平化数据
      const flattenedData = [];
      response.data?.forEach(province => {
        // 添加省份级别的数据
        flattenedData.push({
          id: province.id,
          provinceName: province.provinceName,
          regionName: province.region?.name || '',
          regionTag: province.region?.name || '',
          description: `${province.provinceName}旅游目的地`,
          status: 'active',
          createdAt: province.createdAt,
          updatedAt: province.createdAt,
          type: 'province'
        });
        
        // 添加城市级别的数据
        province.cities?.forEach(city => {
          flattenedData.push({
            id: city.id,
            cityName: city.cityName,
            provinceName: province.provinceName,
            regionName: province.region?.name || '',
            regionTag: province.region?.name || '',
            description: `${city.cityName}旅游景点`,
            status: 'active',
            createdAt: city.createdAt,
            updatedAt: city.createdAt,
            type: 'city'
          });
        });
      });
      
      items.value = flattenedData;
      total.value = items.value.length;
    } else {
      console.error('获取数据失败:', response.message);
      items.value = [];
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

// 显示详情对话框
const openDetailsDialog = (item) => {
  selectedItem.value = item;
  showDetailsDialog.value = true;
};

// 关闭详情对话框
const closeDetailsDialog = () => {
  showDetailsDialog.value = false;
  selectedItem.value = {};
};

// 编辑处理
const handleEdit = (item) => {
  // 根据数据类型跳转到相应的管理页面
  if (item.destinationName) {
    // 跳转到目的地管理页面
    showToastMessage('请前往目的地管理页面进行编辑', 'info');
  } else if (item.cityName) {
    // 跳转到城市管理页面
    showToastMessage('请前往城市管理页面进行编辑', 'info');
  } else {
    showToastMessage('该数据不支持直接编辑', 'warning');
  }
};

// 查询处理
const handleSearch = () => {
  currentPage.value = 1;
  fetchItems();
};

// 重置查询条件
const handleReset = () => {
  queryParams.value = {
    destinationName: '',
    cityName: '',
    regionTag: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  };
  currentPage.value = 1;
  fetchItems();
};

// 导出数据
const handleExport = () => {
  if (filteredItems.value.length === 0) {
    showToastMessage('没有数据可导出', 'warning');
    return;
  }
  
  try {
    const exportData = filteredItems.value.map(item => ({
      ID: item.id,
      目的地名称: item.destinationName || item.destination,
      城市名称: item.cityName || item.city,
      地区标签: item.regionTag || item.region,
      描述: item.description || '',
      状态: item.status === 'active' ? '启用' : '禁用',
      创建时间: formatDate(item.createdAt || item.created_at),
      更新时间: formatDate(item.updatedAt || item.updated_at)
    }));
    
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(item => Object.values(item).map(value => `"${value}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `综合查询数据_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToastMessage('数据导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    showToastMessage('数据导出失败', 'error');
  }
};

// 显示提示消息
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  fetchItems();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchItems();
};

// 初始化加载数据
onMounted(fetchItems);
</script>

<style scoped>
@import '@/css/Management/BackgroundManagement.css';

.loading-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #999;
}

.query-conditions {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.condition-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.condition-group {
  flex: 1;
}

.condition-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.condition-group input,
.condition-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.query-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.export-btn {
  background-color: #52c41a;
  color: white;
}

.export-btn:hover {
  background-color: #389e0d;
}

.reset-btn {
  background-color: #faad14;
  color: white;
}

.reset-btn:hover {
  background-color: #d48806;
}

.details-container {
  max-height: 500px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  margin-bottom: 15px;
  color: #1890ff;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-item label {
  font-weight: bold;
  min-width: 100px;
  margin-right: 10px;
  color: #666;
}

.detail-item span {
  flex: 1;
  word-break: break-word;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.active {
  background-color: #f0f9ff;
  color: #1890ff;
}

.status-badge.inactive {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.image-gallery {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.image-item {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>