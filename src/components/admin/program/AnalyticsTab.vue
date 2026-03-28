<template>
  <div class="tab-content">
    <div class="section-header">
      <h2>Analíticas del Programa</h2>
      <q-select v-model="timeRange" :options="timeOptions" dense outlined dark style="width: 150px;" />
    </div>

    <div class="analytics-grid">
      <div class="chart-card large">
        <h4>Progreso de Usuarios por Mes</h4>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div v-for="(bar, i) in progressChart" :key="i" class="bar-wrapper">
              <div class="bar" :style="{ height: bar.value + '%' }"></div>
              <span class="bar-label">{{ bar.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h4>Distribución por Nivel</h4>
        <div class="pie-placeholder">
          <div class="pie-chart" :style="pieChartStyle"></div>
          <div class="pie-legend">
            <div v-for="(slice, i) in pieData" :key="i" class="legend-item">
              <span class="dot" :style="{ background: slice.color }"></span>
              <span>Nivel {{ slice.level }}</span>
              <span class="percent">{{ slice.percent }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h4>Skills Desbloqueados</h4>
        <div class="stats-list">
          <div v-for="stat in skillStats" :key="stat.name" class="stat-row">
            <span class="stat-name">{{ stat.name }}</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: stat.value + '%' }"></div>
            </div>
            <span class="stat-value">{{ stat.count }}</span>
          </div>
        </div>
      </div>

      <div class="chart-card wide">
        <h4>Completados vs Abandonos</h4>
        <div class="completion-stats">
          <div class="completion-item success">
            <q-icon name="check_circle" size="48px" color="positive" />
            <div>
              <div class="completion-value">{{ stats.completions }}</div>
              <div class="completion-label">Completados</div>
            </div>
          </div>
          <div class="completion-item warning">
            <q-icon name="pause_circle" size="48px" color="warning" />
            <div>
              <div class="completion-value">{{ stats.paused }}</div>
              <div class="completion-label">Pausados</div>
            </div>
          </div>
          <div class="completion-item negative">
            <q-icon name="cancel" size="48px" color="negative" />
            <div>
              <div class="completion-value">{{ stats.dropped }}</div>
              <div class="completion-label">Abandonados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  stats: { type: Object, required: true },
  progressChart: { type: Array, default: () => [] },
  pieData: { type: Array, default: () => [] },
  skillStats: { type: Array, default: () => [] }
})

const timeRange = ref('Últimos 6 meses')
const timeOptions = ['Último mes', 'Últimos 3 meses', 'Últimos 6 meses', 'Último año', 'Todo']

const pieChartStyle = computed(() => {
  if (!props.pieData.length) return {}
  let gradient = 'conic-gradient('
  let currentDeg = 0
  props.pieData.forEach(slice => {
    const deg = (slice.percent / 100) * 360
    gradient += `${slice.color} ${currentDeg}deg ${currentDeg + deg}deg, `
    currentDeg += deg
  })
  gradient = gradient.slice(0, -2) + ')'
  return { background: gradient }
})
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
}

.chart-card.large {
  grid-column: span 2;
}

.chart-card.wide {
  grid-column: span 3;
}

.chart-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 30px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  gap: 16px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #ff8f38 0%, #ff6b6b 100%);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  transition: height 0.3s;
}

.bar-label {
  font-size: 12px;
  color: #8b949e;
}

.pie-placeholder {
  display: flex;
  align-items: center;
  gap: 24px;
}

.pie-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #c9d1d9;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.percent {
  margin-left: auto;
  color: #fff;
  font-weight: 600;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-name {
  font-size: 13px;
  color: #c9d1d9;
  width: 120px;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff8f38 0%, #ff6b6b 100%);
  border-radius: 4px;
}

.stat-value {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  width: 40px;
  text-align: right;
}

.completion-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.completion-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  min-width: 200px;
}

.completion-value {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
}

.completion-label {
  font-size: 14px;
  color: #8b949e;
}

@media (max-width: 1024px) {
  .analytics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-card.large,
  .chart-card.wide {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card.large,
  .chart-card.wide {
    grid-column: span 1;
  }
  
  .completion-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .completion-item {
    min-width: auto;
  }
}
</style>
