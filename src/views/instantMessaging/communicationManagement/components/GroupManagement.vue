<template>
  <div class="group-management">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">群组管理</span>
          <div class="card-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索群组名称或描述"
              style="width: 300px; margin-right: 12px;"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleCreateGroup">
              <el-icon><Plus /></el-icon>
              创建群组
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="filteredGroups"
        v-loading="loading"
        style="width: 100%"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="avatar" label="群组头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" :alt="row.name">
              {{ row.name?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="群组名称" min-width="150" />
        <el-table-column prop="description" label="群组描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="memberCount" label="成员数量" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.memberCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="onlineCount" label="在线人数" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.onlineCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="群组类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 'public' ? 'success' : 'warning'">
              {{ row.type === 'public' ? '公开群' : '私有群' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" sortable>
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastActivityTime" label="最后活跃" width="160">
          <template #default="{ row }">
            {{ formatTime(row.lastActivityTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="warning" @click="handleViewMembers(row)">成员</el-button>
            <el-button size="small" type="info" @click="handleViewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 群组详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedGroup ? selectedGroup.name + ' - 群组详情' : '群组详情'"
      width="700px"
    >
      <GroupDetail :group="selectedGroup" v-if="detailDialogVisible" />
    </el-dialog>

    <!-- 成员管理对话框 -->
    <el-dialog
      v-model="membersDialogVisible"
      :title="selectedGroup ? selectedGroup.name + ' - 成员管理' : '成员管理'"
      width="800px"
    >
      <GroupMembers :group="selectedGroup" v-if="membersDialogVisible" />
    </el-dialog>

    <!-- 创建/编辑群组对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑群组' : '创建群组'"
      width="500px"
    >
      <GroupForm 
        :group="selectedGroup" 
        :is-edit="isEdit"
        @submit="handleFormSubmit"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GroupDetail from './GroupDetail.vue'
import GroupForm from './GroupForm.vue'
import GroupMembers from './GroupMembers.vue'

// 模拟数据
const mockGroups = [
  {
    id: 1,
    name: '前端开发交流群',
    description: '专注于前端技术交流和学习的群组',
    avatar: '',
    memberCount: 156,
    onlineCount: 42,
    type: 'public',
    status: 'active',
    createTime: new Date('2023-03-15').getTime(),
    lastActivityTime: new Date().getTime()
  },
  {
    id: 2,
    name: '项目管理小组',
    description: '项目管理和协作讨论的私有群组',
    avatar: '',
    memberCount: 23,
    onlineCount: 8,
    type: 'private',
    status: 'active',
    createTime: new Date('2023-05-20').getTime(),
    lastActivityTime: new Date('2024-01-14').getTime()
  },
  {
    id: 3,
    name: '技术分享群',
    description: '每周技术分享和讨论的公开群组',
    avatar: '',
    memberCount: 89,
    onlineCount: 25,
    type: 'public',
    status: 'inactive',
    createTime: new Date('2023-07-10').getTime(),
    lastActivityTime: new Date('2024-01-12').getTime()
  }
]

const groups = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const membersDialogVisible = ref(false)
const editDialogVisible = ref(false)
const selectedGroup = ref(null)
const isEdit = ref(false)

// 计算属性
const filteredGroups = computed(() => {
  let filtered = groups.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(group => 
      group.name.toLowerCase().includes(keyword) ||
      group.description.toLowerCase().includes(keyword)
    )
  }
  
  total.value = filtered.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 方法
const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleCreateGroup = () => {
  selectedGroup.value = null
  isEdit.value = false
  editDialogVisible.value = true
}

const handleEdit = (group) => {
  selectedGroup.value = { ...group }
  isEdit.value = true
  editDialogVisible.value = true
}

const handleToggleStatus = async (group) => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const groupIndex = groups.value.findIndex(g => g.id === group.id)
    if (groupIndex !== -1) {
      groups.value[groupIndex].status = group.status === 'active' ? 'inactive' : 'active'
    }
  } catch (error) {
    console.error('切换群组状态失败:', error)
  } finally {
    loading.value = false
  }
}

const handleViewDetail = (group) => {
  selectedGroup.value = group
  detailDialogVisible.value = true
}

const handleViewMembers = (group) => {
  selectedGroup.value = group
  membersDialogVisible.value = true
}

const handleFormSubmit = async (formData) => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (isEdit.value) {
      // 编辑群组
      const index = groups.value.findIndex(g => g.id === selectedGroup.value.id)
      if (index !== -1) {
        groups.value[index] = { ...groups.value[index], ...formData }
      }
    } else {
      // 创建群组
      const newGroup = {
        id: Math.max(...groups.value.map(g => g.id)) + 1,
        ...formData,
        memberCount: 1,
        onlineCount: 1,
        createTime: new Date().getTime(),
        lastActivityTime: new Date().getTime()
      }
      groups.value.unshift(newGroup)
    }
    
    editDialogVisible.value = false
  } catch (error) {
    console.error('保存群组失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loading.value = true
  // 模拟数据加载
  setTimeout(() => {
    groups.value = mockGroups
    total.value = mockGroups.length
    loading.value = false
  }, 800)
})
</script>

<style scoped>
.group-management {
  width: 100%;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .card-actions {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  
  .card-actions .el-input {
    width: 100% !important;
    margin-right: 0 !important;
  }
}
</style>