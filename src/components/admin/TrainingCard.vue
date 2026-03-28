<template>
  <div class="training-card" :class="{ 'inactive': !training.isPublic }">
    <div class="card-color-bar" :style="{ background: training.color || '#ff8f38' }"></div>
    <div class="card-content">
      <div class="card-header-row">
        <div class="card-icon" :style="{ background: (training.color || '#ff8f38') + '20' }">
          <q-icon name="sports_gymnastics" :style="{ color: training.color || '#ff8f38' }" size="24px" />
        </div>
        <span class="card-visibility" :class="training.isPublic ? 'public' : 'private'">
          {{ training.isPublic ? 'Público' : 'Privado' }}
        </span>
      </div>

      <h3 class="card-title">{{ training.name }}</h3>
      <p class="card-description">{{ truncateText(training.description, 60) }}</p>

      <div class="card-stats">
        <span><q-icon name="fitness_center" size="14px" /> {{ training.exercises?.length || 0 }} ejercicios</span>
        <span><q-icon name="timer" size="14px" /> {{ calculateDuration }}m</span>
      </div>

      <div class="card-actions">
        <q-btn flat dense label="Editar" color="primary" no-caps @click="$emit('edit')" />
        <q-btn flat dense icon="delete" color="negative" @click="$emit('delete')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  training: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const calculateDuration = computed(() => {
  if (!props.training.exercises?.length) return 0
  const totalSeconds = props.training.exercises.reduce((sum, ex) => {
    return sum + ((ex.sets || 3) * 45) + ((ex.rest || 60) * (ex.sets || 3))
  }, 0)
  return Math.round(totalSeconds / 60)
})
</script>

<style scoped>
.training-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.training-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.training-card.inactive {
  opacity: 0.7;
}

.card-color-bar {
  height: 4px;
}

.card-content {
  padding: 20px;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-visibility {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.card-visibility.public {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
}

.card-visibility.private {
  background: rgba(139, 148, 158, 0.15);
  color: #8b949e;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.card-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #c9d1d9;
}

.card-stats span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-actions {
  display: flex;
  gap: 8px;
}
</style>
