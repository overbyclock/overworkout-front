<template>
  <div class="program-card" :class="{ 'inactive': !program.isActive }">
    <div class="card-gradient" :style="{ background: gradient }"></div>
    <div class="card-content">
      <div class="card-header">
        <div class="discipline-icon">{{ disciplineIcon }}</div>
        <div class="card-actions">
          <q-btn flat round dense icon="visibility" color="white" size="sm" @click.stop="$emit('view')">
            <q-tooltip>Ver detalles</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="edit" color="white" size="sm" @click.stop="$emit('edit')">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="content_copy" color="white" size="sm" @click.stop="$emit('duplicate')">
            <q-tooltip>Duplicar</q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="card-body" @click="$emit('view')">
        <h3 class="program-name">{{ program.name }}</h3>
        <p class="program-description">{{ truncateText(program.description, 100) }}</p>

        <div class="program-meta">
          <span class="meta-item">
            <q-icon name="stairs" size="14px" />
            {{ program.totalLevels }} niveles
          </span>
          <span class="meta-item">
            <q-icon name="schedule" size="14px" />
            {{ program.estimatedDurationWeeks }} semanas
          </span>
        </div>
      </div>

      <div class="card-footer">
        <div class="users-count">
          <q-icon name="people" size="14px" />
          <span>{{ program.usersCount || 0 }} usuarios</span>
        </div>
        <q-toggle
          :model-value="program.isActive"
          color="positive"
          dense
          @update:model-value="$emit('toggle-status')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  program: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'edit', 'duplicate', 'toggle-status'])

const disciplineIcons = {
  'calisthenics': '🤸',
  'crossfit': '🏋️',
  'fitness': '💪',
  'powerlifting': '🏆',
}

const disciplineGradients = {
  'calisthenics': 'linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%)',
  'crossfit': 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)',
  'fitness': 'linear-gradient(135deg, #9f7aea 0%, #ed64a6 100%)',
  'powerlifting': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

const disciplineIcon = computed(() => disciplineIcons[props.program.discipline] || '🎯')
const gradient = computed(() => disciplineGradients[props.program.discipline] || disciplineGradients.fitness)

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.program-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.program-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 143, 56, 0.3);
}

.program-card.inactive {
  opacity: 0.7;
}

.program-card.inactive .card-gradient {
  filter: grayscale(0.5);
}

.card-gradient {
  height: 100px;
  position: relative;
}

.card-content {
  padding: 20px;
  position: relative;
  margin-top: -40px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.discipline-icon {
  width: 64px;
  height: 64px;
  background: #1a1f2e;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.program-card:hover .card-actions {
  opacity: 1;
}

.card-body {
  cursor: pointer;
}

.program-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.program-description {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.program-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #c9d1d9;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.users-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #8b949e;
}
</style>
