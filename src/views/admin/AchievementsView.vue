<template>
  <q-page class="page-container">
    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Logros e Insignias</h1>
          <p class="page-subtitle">Gamificación del sistema</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Logro" class="action-btn" no-caps />
      </div>

      <div class="achievements-grid">
        <div v-for="ach in achievements" :key="ach.id" class="achievement-card" :class="{ 'secret': ach.isSecret }">
          <div class="achievement-icon">{{ ach.icon }}</div>
          <h3 class="achievement-name">{{ ach.name }}</h3>
          <p class="achievement-description">{{ ach.description }}</p>
          <div class="achievement-reward">
            <q-chip color="orange" size="sm">+{{ ach.xpReward }} XP</q-chip>
            <q-chip :color="getCategoryColor(ach.category)" size="sm">{{ ach.category }}</q-chip>
          </div>
          <div v-if="ach.isSecret" class="secret-badge">🔒 SECRETO</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const achievements = [
  { id: 1, name: 'Primeros Pasos', description: 'Completar primer entrenamiento', icon: '🏃', xpReward: 50, category: 'progress', isSecret: false },
  { id: 2, name: 'Guerrero Semanal', description: '7 días seguidos entrenando', icon: '🔥', xpReward: 100, category: 'progress', isSecret: false },
  { id: 3, name: 'Primera Dominada', description: 'Lograr tu primera pull-up', icon: '💪', xpReward: 150, category: 'skills', isSecret: false },
  { id: 4, name: 'Cazador de Muscle-ups', description: 'Completar 10 muscle-ups', icon: '🎯', xpReward: 200, category: 'skills', isSecret: false },
  { id: 5, name: 'Héroe del Pino', description: '10s handstand libre', icon: '🤸', xpReward: 300, category: 'skills', isSecret: false },
  { id: 6, name: 'Maestro Mensual', description: '30 días de racha', icon: '⚡', xpReward: 300, category: 'progress', isSecret: false },
  { id: 7, name: 'Centenario', description: '100 repeticiones totales', icon: '💯', xpReward: 50, category: 'volume', isSecret: false },
  { id: 8, name: 'El Regreso', description: 'Volver tras 30 días sin entrenar', icon: '🔄', xpReward: 200, category: 'secret', isSecret: true },
]

const getCategoryColor = (cat) => {
  const colors = { progress: 'blue', skills: 'purple', volume: 'green', social: 'pink', secret: 'grey' }
  return colors[cat] || 'grey'
}
</script>

<style scoped>
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  transition: all 0.3s ease;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.achievement-card.secret {
  opacity: 0.7;
  border-style: dashed;
}

.achievement-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.achievement-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.achievement-description {
  font-size: 14px;
  color: #8b949e;
  margin: 0 0 16px;
}

.achievement-reward {
  display: flex;
  gap: 8px;
}

.secret-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 11px;
  color: #8b949e;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
