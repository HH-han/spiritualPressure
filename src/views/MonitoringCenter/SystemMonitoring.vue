<template>
    <div class="monitor-container">
        <div class="header">
            <h1>服务器性能监测系统</h1>
            <div class="status-info">
                <span>最后更新: {{ lastUpdateTime }}</span>
                <span class="status-indicator" :class="serverStatus"></span>
                <span>状态: {{ serverStatusText }}</span>
            </div>
        </div>

        <div class="dashboard">
            <!-- 在dashboard div内添加这两个卡片 -->
            <div class="card gauge-card">
                <div class="card-header">
                    <h2>CPU 表盘</h2>
                </div>
                <div class="gauge-container">
                    <div ref="cpuGauge" class="gauge"></div>
                </div>
            </div>

            <div class="card gauge-card">
                <div class="card-header">
                    <h2>网络表盘</h2>
                </div>
                <div class="gauge-container">
                    <div ref="networkGauge" class="gauge"></div>
                </div>
            </div>

            <!-- CPU 使用率 -->
            <div class="card cpu-card">
                <div class="card-header">
                    <h2>CPU 使用率</h2>
                    <div class="card-value">{{ cpuUsage }}%</div>
                </div>
                <div class="chart-container">
                    <div ref="cpuChart" class="chart"></div>
                </div>
                <div class="card-footer">
                    <span>核心数: {{ cpuCores }}</span>
                    <span>型号: {{ cpuModel }}</span>
                </div>
            </div>

            <!-- 内存使用 -->
            <div class="card memory-card">
                <div class="card-header">
                    <h2>内存使用</h2>
                    <div class="card-value">{{ memoryUsage }}%</div>
                </div>
                <div class="chart-container">
                    <div ref="memoryChart" class="chart"></div>
                </div>
                <div class="card-footer">
                    <span>已用: {{ formatBytes(memoryUsed) }}</span>
                    <span>总计: {{ formatBytes(memoryTotal) }}</span>
                </div>
            </div>

            <!-- 磁盘使用 -->
            <div class="card disk-card">
                <div class="card-header">
                    <h2>磁盘使用</h2>
                    <div class="card-value">{{ diskUsage }}%</div>
                </div>
                <div class="chart-container">
                    <div ref="diskChart" class="chart"></div>
                </div>
                <div class="card-footer">
                    <span>已用: {{ formatBytes(diskUsed) }}</span>
                    <span>总计: {{ formatBytes(diskTotal) }}</span>
                </div>
            </div>

            <!-- 网络流量 -->
            <div class="card network-card">
                <div class="card-header">
                    <h2>网络流量</h2>
                    <div class="card-value">{{ formatBytes(networkSpeed) }}/s</div>
                </div>
                <div class="chart-container">
                    <div ref="networkChart" class="chart"></div>
                </div>
                <div class="card-footer">
                    <span>上传: {{ formatBytes(networkSent) }}</span>
                    <span>下载: {{ formatBytes(networkReceived) }}</span>
                </div>
            </div>

            <!-- 运行进程 -->
            <div class="card process-card">
                <div class="card-header">
                    <h2>运行进程</h2>
                    <div class="card-value">{{ processCount }}</div>
                </div>
                <div class="process-list">
                    <div v-for="(proc, index) in topProcesses" :key="index" class="process-item">
                        <span class="process-name">{{ proc.name }}</span>
                        <span class="process-cpu">{{ (proc.cpuUsage/100).toFixed(2) }}%</span>
                        <span class="process-memory">{{ formatBytes(proc.memoryUsage) }}</span>
                    </div>
                </div>
            </div>

            <!-- 系统信息 -->
            <div class="card system-card">
                <div class="card-header">
                    <h2>系统信息</h2>
                </div>
                <div class="system-info">
                    <div class="info-row">
                        <span class="info-label">主机名:</span>
                        <span class="info-value">{{ systemInfo.hostname }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">操作系统:</span>
                        <span class="info-value">{{ systemInfo.os }}{{ systemInfo.osVersion }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">内核版本:</span>
                        <span class="info-value">{{ systemInfo.kernel }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">运行时间:</span>
                        <span class="info-value">{{ formatUptime(systemInfo.uptime) }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">负载:</span>
                        <span class="info-value">{{ systemInfo.loadavg }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
// 图表引用
const cpuChart = ref(null)
const memoryChart = ref(null)
const diskChart = ref(null)
const networkChart = ref(null)
const cpuGauge = ref(null)
const networkGauge = ref(null)

// 图表实例
let cpuChartInstance = null
let memoryChartInstance = null
let diskChartInstance = null
let networkChartInstance = null

// 数据状态
const lastUpdateTime = ref('')
const serverStatus = ref('normal') // normal, warning, danger
const serverStatusText = ref('正常')

// CPU 数据
const cpuUsage = ref(0)
const cpuCores = ref(0)
const cpuModel = ref('')
const cpuHistory = ref([])

// 内存数据
const memoryUsage = ref(0)
const memoryUsed = ref(0)
const memoryTotal = ref(0)
const memoryHistory = ref([])

// 磁盘数据
const diskUsage = ref(0)
const diskUsed = ref(0)
const diskTotal = ref(0)
const diskHistory = ref([])

// 网络数据
const networkSpeed = ref(0)
const networkSent = ref(0)
const networkReceived = ref(0)
const networkHistory = ref([])

// 进程数据
const processCount = ref(0)
const topProcesses = ref([])

// 系统信息
const systemInfo = ref({
    hostname: '',
    os: '',
    kernel: '',
    uptime: 0,
    loadavg: ''
})

// 定时器
let fetchInterval = null
let cpuGaugeInstance = null
let networkGaugeInstance = null
// 初始化图表
const initCharts = () => {
    nextTick(() => {
        // CPU 图表
        cpuChartInstance = echarts.init(cpuChart.value)
        updateCpuChart()

        // 内存图表
        memoryChartInstance = echarts.init(memoryChart.value)
        updateMemoryChart()

        // 磁盘图表
        diskChartInstance = echarts.init(diskChart.value)
        updateDiskChart()

        // 网络图表
        networkChartInstance = echarts.init(networkChart.value)
        updateNetworkChart()
    })
}
const initGauges = () => {
    nextTick(() => {
        // CPU表盘
        cpuGaugeInstance = echarts.init(cpuGauge.value)
        updateCpuGauge()

        // 网络表盘
        networkGaugeInstance = echarts.init(networkGauge.value)
        updateNetworkGauge()
    })
}
const updateCpuGauge = () => {
    const option = {
        series: [{
            type: 'gauge',
            center: ['50%', '50%'],
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 100,
            radius: '90%',
            pointer: {
                show: false
            },
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [ {
                            offset: 0.7,
                            color: '#37a2da'
                        }]
                    }
                }
            },
            axisLine: {
                lineStyle: {
                    width: 20,
                    color: [[1, 'rgba(200, 200, 200, 0.1)']]
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            detail: {
                valueAnimation: true,
                fontSize: 28,
                fontWeight: 'bolder',
                offsetCenter: [0, 0],
                formatter: '{value}%',
                color: '#333'
            },
            title: {
                fontSize: 14,
                offsetCenter: [0, '75%'],
                color: '#666'
            },
            data: [{
                value: cpuUsage.value,
                name: 'CPU使用率'
            }]
        }]
    }
    cpuGaugeInstance.setOption(option)
}

// 更新网络表盘 - 改为360度环形设计
const updateNetworkGauge = () => {
    const maxValue = Math.max(100, Math.ceil(networkSpeed.value / 1024 * 1.2))
    const currentValue = Math.min(networkSpeed.value / 1024, maxValue)
    
    const option = {
        series: [{
            type: 'gauge',
            center: ['50%', '50%'],
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: maxValue,
            radius: '90%',
            pointer: {
                show: false
            },
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 1,
                            color: '#fa541c'
                        }]
                    }
                }
            },
            axisLine: {
                lineStyle: {
                    width: 20,
                    color: [[1, 'rgba(200, 200, 200, 0.1)']]
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            detail: {
                valueAnimation: true,
                fontSize: 22,
                fontWeight: 'bolder',
                offsetCenter: [0, 0],
            formatter: function(value) {
                var mbValue = (value * 1024) / (1024 * 1024);
                return mbValue.toFixed(5) + ' MB/s';
            },
                color: '#333'
            },
            title: {
                fontSize: 14,
                offsetCenter: [0, '75%'],
                color: '#666'
            },
            data: [{
                value: currentValue,
                name: '网络速度'
            }]
        }]
    }
    networkGaugeInstance.setOption(option)
}
// 更新 CPU 图表
const updateCpuChart = () => {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a0}: {c0}%'
        },
        grid: {
            top: '15%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: 20 }, (_, i) => i + 1).map(() => ''),
            axisLine: {
                lineStyle: {
                    color: '#6b7280'
                }
            },
            axisLabel: {
                color: '#6b7280'
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#6b7280',
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: 'CPU使用率',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#3b82f6'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(59, 130, 246, 0.5)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(59, 130, 246, 0.1)'
                        }
                    ])
                },
                data: cpuHistory.value
            }
        ]
    }
    cpuChartInstance.setOption(option)
}

// 更新内存图表
const updateMemoryChart = () => {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a0}: {c0}%'
        },
        grid: {
            top: '15%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: 20 }, (_, i) => i + 1).map(() => ''),
            axisLine: {
                lineStyle: {
                    color: '#6b7280'
                }
            },
            axisLabel: {
                color: '#6b7280'
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#6b7280',
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '内存使用率',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#10b981'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(16, 185, 129, 0.5)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(16, 185, 129, 0.1)'
                        }
                    ])
                },
                data: memoryHistory.value
            }
        ]
    }
    memoryChartInstance.setOption(option)
}

// 更新磁盘图表
const updateDiskChart = () => {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a0}: {c0}%'
        },
        grid: {
            top: '15%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: 20 }, (_, i) => i + 1).map(() => ''),
            axisLine: {
                lineStyle: {
                    color: '#6b7280'
                }
            },
            axisLabel: {
                color: '#6b7280'
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#6b7280',
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '磁盘使用率',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#f59e0b'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(245, 158, 11, 0.5)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(245, 158, 11, 0.1)'
                        }
                    ])
                },
                data: diskHistory.value
            }
        ]
    }
    diskChartInstance.setOption(option)
}

// 更新网络图表
const updateNetworkChart = () => {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a0}: {c0} KB/s'
        },
        grid: {
            top: '15%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: 20 }, (_, i) => i + 1).map(() => ''),
            axisLine: {
                lineStyle: {
                    color: '#6b7280'
                }
            },
            axisLabel: {
                color: '#6b7280'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#6b7280',
                formatter: '{value} KB/s'
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '网络速度',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#8b5cf6'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(139, 92, 246, 0.5)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(139, 92, 246, 0.1)'
                        }
                    ])
                },
                data: networkHistory.value
            }
        ]
    }
    networkChartInstance.setOption(option)
}

// 格式化字节大小
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 格式化运行时间
const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    let result = ''
    if (days > 0) result += `${days}天 `
    if (hours > 0) result += `${hours}小时 `
    if (mins > 0) result += `${mins}分钟 `
    result += `${secs}秒`

    return result
}

// 获取服务器数据
const fetchServerData = async () => {
    try {
        const response = await request.get('/api/server-monitor')
        const data = response

        // 更新时间
        lastUpdateTime.value = new Date().toLocaleTimeString()

        // 更新 CPU 数据
        cpuUsage.value = data.cpu.usage.toFixed(1)
        cpuCores.value = data.cpu.cores
        cpuModel.value = data.cpu.model
        cpuHistory.value = [...cpuHistory.value.slice(1), data.cpu.usage]

        // 更新内存数据
        memoryUsage.value = ((data.memory.used / data.memory.total) * 100).toFixed(1)
        memoryUsed.value = data.memory.used
        memoryTotal.value = data.memory.total
        memoryHistory.value = [...memoryHistory.value.slice(1), memoryUsage.value]

        // 更新磁盘数据
        diskUsage.value = ((data.disk.used / data.disk.total) * 100).toFixed(1)
        diskUsed.value = data.disk.used
        diskTotal.value = data.disk.total
        diskHistory.value = [...diskHistory.value.slice(1), diskUsage.value]

        // 更新网络数据
        networkSpeed.value = data.network.speed
        networkSent.value = data.network.sent
        networkReceived.value = data.network.received
        networkHistory.value = [...networkHistory.value.slice(1), data.network.speed / 1024]

        // 更新进程数据
        processCount.value = data.processCount || 0
        topProcesses.value = Array.isArray(data.processes) ? data.processes.slice(0, 5) : []
        // 更新系统信息
        systemInfo.value = {
            hostname: data.system.hostname,
            os: data.system.osName,
            osVersion: data.system.osVersion,
            kernel: data.system.kernelVersion,
            uptime: formatUptime(data.system.uptime),
            uptime: data.system.uptime,
            loadavg: Array.isArray(data.system.loadavg) ? data.system.loadavg.map(l => l.toFixed(2)).join(', ') : 'N/A'
        }

        // 更新服务器状态
        updateServerStatus()

        // 更新图表
        updateCpuChart()
        updateMemoryChart()
        updateDiskChart()
        updateNetworkChart()
        updateCpuGauge()
        updateNetworkGauge()
    } catch (error) {
        console.error('获取服务器数据失败:', error)
        serverStatus.value = 'danger'
        serverStatusText.value = '连接失败'
    }
}

// 更新服务器状态
const updateServerStatus = () => {
    if (cpuUsage.value > 90 || memoryUsage.value > 90 || diskUsage.value > 90) {
        serverStatus.value = 'danger'
        serverStatusText.value = '危险'
    } else if (cpuUsage.value > 70 || memoryUsage.value > 70 || diskUsage.value > 70) {
        serverStatus.value = 'warning'
        serverStatusText.value = '警告'
    } else {
        serverStatus.value = 'normal'
        serverStatusText.value = '正常'
    }
}

// 组件挂载时初始化
onMounted(() => {
    // 初始化历史数据
    cpuHistory.value = Array(20).fill(0)
    memoryHistory.value = Array(20).fill(0)
    diskHistory.value = Array(20).fill(0)
    networkHistory.value = Array(20).fill(0)

    // 初始化图表
    initCharts()
    initGauges()
    // 立即获取数据
    fetchServerData()

    // 设置定时器，每3秒获取一次数据
    fetchInterval = setInterval(fetchServerData, 3000)
})

// 组件卸载前清理
onBeforeUnmount(() => {
    if (fetchInterval) {
        clearInterval(fetchInterval)
    }

    if (cpuChartInstance) {
        cpuChartInstance.dispose()
    }
    if (memoryChartInstance) {
        memoryChartInstance.dispose()
    }
    if (diskChartInstance) {
        diskChartInstance.dispose()
    }
    if (networkChartInstance) {
        networkChartInstance.dispose()
    }
    if (cpuGaugeInstance) {
        cpuGaugeInstance.dispose()
    }
    if (networkGaugeInstance) {
        networkGaugeInstance.dispose()
    }
})
</script>

<style scoped>
.gauge-container {
    padding: 15px;
    height: 220px;
    position: relative;
}

.gauge {
    width: 100%;
    height: 100%;
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.gauge:hover {
    transform: scale(1.08);
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
}

/* 卡片样式增强 */
.gauge-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
    border: none;
    overflow: hidden;
    transition: all 0.3s ease;
}

.gauge-card:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
}

.gauge-card .card-header {
    background: linear-gradient(to right, rgba(74, 144, 226, 0.1), transparent);
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    padding: 16px 20px;
}

.gauge-card .card-header h2 {
    position: relative;
    padding-left: 16px;
    color: #2c3e50;
    font-size: 16px;
    font-weight: 600;
}

.gauge-card .card-header h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background: linear-gradient(to bottom, #4facfe, #00f2fe);
    border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .gauge-container {
        height: 180px;
        padding: 10px;
    }
    
    .gauge-card .card-header {
        padding: 12px 15px;
    }
    
    .gauge-card .card-header h2 {
        font-size: 15px;
    }
}
.monitor-container {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    padding: 20px;
    color: #e6e6e6;
    min-height: 100vh;
    padding: 20px;
}

.header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
    margin: 0;
    font-size: 2.5rem;
    background-color: #000000;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.status-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    font-size: 14px;
    color: #6b7280;
}

.status-indicator {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.status-indicator.normal {
    background-color: #10b981;
}

.status-indicator.warning {
    background-color: #f59e0b;
}

.status-indicator.danger {
    background-color: #ef4444;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

.dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
}

.card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(10px);
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #111827;
}

.card-value {
    font-size: 18px;
    font-weight: 700;
}

.cpu-card .card-value {
    color: #3b82f6;
}

.memory-card .card-value {
    color: #10b981;
}

.disk-card .card-value {
    color: #f59e0b;
}

.network-card .card-value {
    color: #8b5cf6;
}

.process-card .card-value {
    color: #ec4899;
}

.chart-container {
    padding: 10px;
    height: 150px;
}

.chart {
    width: 100%;
    height: 100%;
}

.card-footer {
    padding: 10px 20px;
    font-size: 12px;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #f3f4f6;
}

.process-list {
    padding: 10px 0;
}

.process-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;
    font-size: 13px;
    border-bottom: 1px solid #f3f4f6;
}

.process-item:last-child {
    border-bottom: none;
}

.process-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
    color: #000;
}

.process-cpu {
    width: 50px;
    text-align: right;
    color: #3b82f6;
}

.process-memory {
    width: 80px;
    text-align: right;
    color: #10b981;
}

.system-card {
    grid-column: span 1;
}

.system-info {
    padding: 15px 20px;
}

.info-row {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-label {
    font-weight: 600;
    color: #374151;
    width: 80px;
}

.info-value {
    flex: 1;
    color: #6b7280;
}

@media (max-width: 768px) {
    .dashboard {
        grid-template-columns: 1fr;
    }

    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}

</style>