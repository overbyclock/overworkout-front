<template>
  <div class="stats-row">
    <div v-for="(stat, index) in stats" :key="index" class="stat-mini">
      <div class="stat-mini-icon" :style="{ background: stat.bgColor || getDefaultBg(index) }">
        <q-icon :name="stat.icon" :color="stat.iconColor || getDefaultColor(index)" size="20px" />
      </div>
      <div class="stat-mini-content">
        <div class="stat-mini-value">{{ stat.value }}</div>
        <div class="stat-mini-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (stats) => stats.every(stat => 
      Object.prototype.hasOwnProperty.call(stat, 'value') && 
      Object.prototype.hasOwnProperty.call(stat, 'label') && 
      Object.prototype.hasOwnProperty.call(stat, 'icon')
    ),
  },
})

const colorSchemes = [
  { bg: 'rgba(255, 143, 56, 0.2)', color: 'primary' },
  { bg: 'rgba(63, 185, 80, 0.2)', color: 'positive' },
  { bg: 'rgba(147, 112, 219, 0.2)', color: 'accent' },
  { bg: 'rgba(255, 107, 107, 0.2)', color: 'negative' },
  { bg: 'rgba(56, 178, 172, 0.2)', color: 'teal' },
  { bg: 'rgba(245, 158, 11, 0.2)', color: 'warning' },
]

const getDefaultBg = (index) => colorSchemes[index % colorSchemes.length].bg
const getDefaultColor = (index) => colorSchemes[index % colorSchemes.length].color
</script>

<style scoped>
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  flex: 1;
}

.stat-mini-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-mini-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-mini-label {
  font-size: 0.85rem;
  color: #8b949e;
}

@media (max-width: 900px) {
  .stats-row {
    flex-direction: column;
  }
}
</style>
