<template>
  <div class="tab-content">
    <div class="section-header">
      <h2>Logros del Programa</h2>
      <q-btn color="primary" icon="add" label="Crear Logro" @click="$emit('add')" />
    </div>

    <div class="achievements-grid">
      <div v-for="achievement in achievements" :key="achievement.id" class="achievement-card"
        :class="achievement.category">
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <div class="achievement-info">
          <h4>{{ achievement.name }}</h4>
          <p>{{ achievement.description }}</p>
          <div class="achievement-meta">
            <q-badge :color="getCategoryColor(achievement.category)">{{ achievement.category }}</q-badge>
            <span class="xp-badge">+{{ achievement.xpReward }} XP</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  achievements: { type: Array, required: true }
})

defineEmits(['add'])

const getCategoryColor = (category) => {
  const colors = {
    progress: 'positive', skill: 'primary', consistency: 'warning',
    volume: 'accent', social: 'info'
  }
  return colors[category] || 'grey'
}
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

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.achievement-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.3s;
}

.achievement-card:hover {
  border-color: rgba(255, 143, 56, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.achievement-icon {
  font-size: 40px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 6px;
}

.achievement-info p {
  font-size: 13px;
  color: #8b949e;
  margin: 0 0 12px;
  line-height: 1.5;
}

.achievement-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.xp-badge {
  font-size: 13px;
  color: #ffd700;
  font-weight: 600;
}
</style>
