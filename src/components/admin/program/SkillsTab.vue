<template>
  <div class="tab-content">
    <div class="section-header">
      <h2>Skills del Programa</h2>
      <q-btn color="primary" icon="add" label="Añadir Skill" @click="$emit('add')" />
    </div>

    <div class="skills-grid">
      <div v-for="family in families" :key="family.name" class="skill-family">
        <h3 class="family-title">{{ family.label }}</h3>
        <div class="family-skills">
          <div v-for="skill in family.skills" :key="skill.id" class="skill-card"
            :class="{ 'locked': skill.levelRequired > 1 }" @click="$emit('view', skill)">
            <div class="skill-icon">{{ skill.icon || '🎯' }}</div>
            <div class="skill-info">
              <h4>{{ skill.name }}</h4>
              <p>Nivel {{ skill.levelRequired }} requerido</p>
            </div>
            <q-icon :name="skill.levelRequired > 1 ? 'lock' : 'check_circle'"
              :color="skill.levelRequired > 1 ? 'grey' : 'positive'" size="20px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  families: { type: Array, required: true }
})

defineEmits(['add', 'view'])
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.skill-family {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
}

.family-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
}

.family-skills {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.skill-card:hover {
  border-color: rgba(255, 143, 56, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.skill-card.locked {
  opacity: 0.6;
}

.skill-icon {
  font-size: 32px;
}

.skill-info {
  flex: 1;
}

.skill-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.skill-info p {
  font-size: 13px;
  color: #8b949e;
  margin: 0;
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
