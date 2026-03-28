<template>
  <div class="stats-row">
    <div v-for="stat in stats" :key="stat.label" class="stat-card">
      <q-icon :name="stat.icon" class="stat-icon" />
      <div class="stat-content">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (stats) => stats.every(s => Object.prototype.hasOwnProperty.call(s, 'value') && Object.prototype.hasOwnProperty.call(s, 'label') && Object.prototype.hasOwnProperty.call(s, 'icon'))
  }
})
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-icon {
  font-size: 40px;
  color: #ff8f38;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #8b949e;
  margin-top: 4px;
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
