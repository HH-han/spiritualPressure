<template>
  <div class="operation-log-container">
    <div class="header">
      <h2>操作日志</h2>
      <div class="search-bar">
        <el-input
          v-model="searchParams.keyword"
          placeholder="请输入操作内容或用户名"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-date-picker
          v-model="searchParams.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleSearch"
          class="date-picker"
        />
        
        <el-select
          v-model="searchParams.operationType"
          placeholder="操作类型"
          clearable
          @change="handleSearch"
          class="type-select"
        >
          <el-option
            v-for="item in operationTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        
        <el-button type="primary" @click="handleSearch" class="search-button">
          <el-icon><Search /></el-icon>
          <span>搜索</span>
        </el-button>
        
        <el-button @click="resetSearch" class="reset-button">
          <el-icon><Refresh /></el-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    
    <div class="log-table">
      <el-table
        :data="logData"
        border
        stripe
        v-loading="loading"
        style="width: 100%"
        height="calc(100vh - 220px)"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="120" align="center" />
        <el-table-column prop="operation" label="操作类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getOperationTypeTag(row.operationType)">
              {{ row.operation }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationContent" label="操作内容" min-width="200" />
        <el-table-column prop="ipAddress" label="IP地址" width="150" align="center" />
        <el-table-column prop="operationTime" label="操作时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.operationTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              @click="showDetail(row)"
              circle
            >
              <el-icon><View /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="操作日志详情"
      width="50%"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="日志ID">{{ currentLog.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentLog.username }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperationTypeTag(currentLog.operationType)">
            {{ currentLog.operation }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作内容">{{ currentLog.operationContent }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ currentLog.method }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">{{ currentLog.params }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog.ipAddress }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ formatDateTime(currentLog.operationTime) }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentLog.timeCost }}ms</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentLog.status === 1 ? 'success' : 'danger'">
            {{ currentLog.status === 1 ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="错误信息" v-if="currentLog.status === 0">
          {{ currentLog.errorMsg }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Refresh, View } from '@element-plus/icons-vue'
import { formatDateTime } from '@/utils/date'
import { getOperationLogs, getOperationLogDetail } from '@/api/log'

// 搜索参数
const searchParams = ref({
  keyword: '',
  dateRange: [],
  operationType: ''
})

// 操作类型选项
const operationTypes = ref([
  { value: '1', label: '登录' },
  { value: '2', label: '新增' },
  { value: '3', label: '修改' },
  { value: '4', label: '删除' },
  { value: '5', label: '查询' },
  { value: '6', label: '导出' },
  { value: '7', label: '导入' }
])

// 分页参数
const pagination = ref({
  current: 1,
  size: 20,
  total: 0
})

// 表格数据
const logData = ref([])
const loading = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentLog = ref({})

// 获取操作类型标签样式
const getOperationTypeTag = (type) => {
  const typeMap = {
    '1': 'success',
    '2': '',
    '3': 'warning',
    '4': 'danger',
    '5': 'info',
    '6': '',
    '7': ''
  }
  return typeMap[type] || ''
}

// 获取日志列表
const fetchLogs = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: pagination.value.current,
      pageSize: pagination.value.size,
      keyword: searchParams.value.keyword,
      operationType: searchParams.value.operationType,
      startTime: searchParams.value.dateRange?.[0],
      endTime: searchParams.value.dateRange?.[1]
    }
    
    const res = await getOperationLogs(params)
    logData.value = res.data.list
    pagination.value.total = res.data.total
  } catch (error) {
    console.error('获取操作日志失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.current = 1
  fetchLogs()
}

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    keyword: '',
    dateRange: [],
    operationType: ''
  }
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.value.size = size
  fetchLogs()
}

// 当前页改变
const handleCurrentChange = (current) => {
  pagination.value.current = current
  fetchLogs()
}

// 查看详情
const showDetail = async (row) => {
  try {
    const res = await getOperationLogDetail(row.id)
    currentLog.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取日志详情失败:', error)
  }
}

// 初始化加载数据
onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.operation-log-container {
  padding: 20px;
  background-color: #f5f7fa;
  height: 100%;
  box-sizing: border-box;
}

.header {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header h2 {
  margin: 0 0 20px 0;
  color: #303133;
}

.search-bar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.date-picker {
  width: 350px;
}

.type-select {
  width: 150px;
}

.log-table {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-table {
  font-size: 14px;
}

.el-table :deep(.el-table__cell) {
  padding: 12px 0;
}

.el-tag {
  font-size: 12px;
}

.el-descriptions {
  margin-top: 20px;
}

.el-descriptions :deep(.el-descriptions__label) {
  width: 120px;
  font-weight: bold;
  color: #606266;
}

.el-descriptions :deep(.el-descriptions__content) {
  color: #909399;
}
</style>