<template>
  <q-page class="page-container">
    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Skills Técnicos</h1>
          <p class="page-subtitle">Gestiona habilidades desbloqueables por nivel</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Skill" class="action-btn" no-caps />
      </div>

      <div class="skills-grid">
        <div v-for="skill in skills" :key="skill.id" class="skill-card">
          <div class="skill-header">
            <div class="skill-icon">{{ getFamilyIcon(skill.family) }}</div>
            <q-chip size="sm" :color="getFamilyColor(skill.family)">{{ skill.family }}</q-chip>
          </div>
          <h3 class="skill-name">{{ skill.name }}</h3>
          <p class="skill-description">{{ skill.description }}</p>
          <div class="skill-meta">
            <q-chip size="sm" icon="lock_open">Nivel {{ skill.unlockAtLevel }}</q-chip>
            <q-chip size="sm" icon="star">{{ skill.difficultyScore }}/100</q-chip>
          </div>
          <div class="skill-actions">
            <q-btn flat dense icon="edit" color="primary" label="Editar" no-caps />
            <q-btn flat dense icon="play_circle" color="grey-5" label="Video" no-caps />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const skills = [
  { id: 1, name: 'Handstand Prep', family: 'handstand', description: 'Preparacion para el pino', unlockAtLevel: 3, difficultyScore: 30 },
  { id: 2, name: 'Handstand Wall', family: 'handstand', description: 'Pino contra la pared', unlockAtLevel: 4, difficultyScore: 45 },
  { id: 3, name: 'Freestanding Handstand', family: 'handstand', description: 'Pino libre sin apoyo', unlockAtLevel: 7, difficultyScore: 70 },
  { id: 4, name: 'Muscle-up Journey', family: 'muscle_up', description: 'Camino al muscle-up', unlockAtLevel: 5, difficultyScore: 55 },
  { id: 5, name: 'Muscle-up Rings', family: 'muscle_up', description: 'Muscle-up en anillas', unlockAtLevel: 8, difficultyScore: 75 },
  { id: 6, name: 'Tuck Planche', family: 'planche', description: 'Plancha tuck básica', unlockAtLevel: 7, difficultyScore: 65 },
  { id: 7, name: 'Straddle Planche', family: 'planche', description: 'Plancha straddle', unlockAtLevel: 9, difficultyScore: 85 },
  { id: 8, name: 'Full Planche', family: 'planche', description: 'Plancha completa', unlockAtLevel: 10, difficultyScore: 95 },
  { id: 9, name: 'Front Lever Tuck', family: 'front_lever', description: 'Palanca frontal tuck', unlockAtLevel: 6, difficultyScore: 60 },
  { id: 10, name: 'Human Flag', family: 'human_flag', description: 'Bandera humana', unlockAtLevel: 9, difficultyScore: 80 },
]

const getFamilyIcon = (family) => {
  const icons = { handstand: '🤸', muscle_up: '💪', planche: '⭐', front_lever: '🏗️', human_flag: '🚩', strength: '💯' }
  return icons[family] || '🎯'
}

const getFamilyColor = (family) => {
  const colors = { handstand: 'blue', muscle_up: 'orange', planche: 'purple', front_lever: 'cyan', human_flag: 'pink', strength: 'green' }
  return colors[family] || 'grey'
}
</script>

<style scoped>
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.skill-card {
  background: linear-gradient(135deg, #1c2128 0%, #161b22 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.skill-icon {
  font-size: 36px;
}

.skill-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.skill-description {
  font-size: 14px;
  color: #8b949e;
  margin: 0 0 16px;
  line-height: 1.5;
}

.skill-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.skill-actions {
  display: flex;
  gap: 8px;
}
</style>
