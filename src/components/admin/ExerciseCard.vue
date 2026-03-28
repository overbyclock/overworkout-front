<template>
  <div class="exercise-card" :class="{ 'inactive': exercise.isArchived }">
    <div class="card-header" :class="exercise.level">
      <h3 class="exercise-name">{{ normalizeName(exercise.name) }}</h3>
      <p v-if="exercise.description" class="exercise-description">{{ truncateText(exercise.description, 60) }}</p>
    </div>

    <div class="card-actions">
      <q-btn flat dense icon="play_circle" label="YouTube" color="grey-5" size="sm" no-caps
        @click="searchOn('youtube')" />
      <q-btn flat dense icon="search" label="Google" color="grey-5" size="sm" no-caps
        @click="searchOn('google')" />
      <q-btn flat dense icon="edit" label="Editar" color="primary" size="sm" no-caps @click="$emit('edit')" />
      <q-btn flat dense icon="delete" label="Eliminar" color="negative" size="sm" no-caps @click="$emit('delete')" />
    </div>

    <div class="exercise-difficulty">
      <div class="fire-row">
        <q-icon v-for="n in 3" :key="n" name="local_fire_department"
          :color="n <= (exercise.difficultyRating || 1) ? getFireColor(exercise.level, true) : 'grey-7'" size="20px" />
      </div>
      <span class="level-badge" :class="exercise.level">{{ getLevelLabel(exercise.level) }}</span>
    </div>

    <div class="exercise-muscles">
      <div class="muscle-tag primary">
        <span>{{ getMuscleGroupLabel(exercise.primaryMuscleGroup) }}</span>
      </div>
      <div v-if="exercise.secondaryMuscleGroup" class="muscle-tag secondary">
        <span>{{ getMuscleGroupLabel(exercise.secondaryMuscleGroup) }}</span>
      </div>
    </div>

    <div v-if="exercise.disciplines?.length" class="exercise-disciplines">
      <div v-for="discipline in exercise.disciplines" :key="discipline" class="discipline-tag" :class="discipline">
        {{ getDisciplineLabel(discipline) }}
      </div>
    </div>

    <div class="exercise-equipment">
      <q-icon :name="exercise.equipment ? 'sports_gymnastics' : 'block'" size="14px" color="grey-5" />
      <span>{{ exercise.equipment ? exercise.equipment.name : 'Sin equipamiento' }}</span>
    </div>
  </div>
</template>

<script setup>
import { useHelpers } from '@/composables/useHelpers'
import { 
  getMuscleGroupLabel,
  getLevelLabel,
  getDisciplineLabel,
  getLevelColor,
} from '@/constants'

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const { normalizeName, truncateText } = useHelpers()

const getFireColor = (level, isActive) => {
  if (!isActive) return 'grey-6'
  return getLevelColor(level, isActive)
}

const searchOn = (platform) => {
  const query = encodeURIComponent(`${props.exercise.name} exercise tutorial`)
  const url = platform === 'youtube'
    ? `https://www.youtube.com/results?search_query=${query}`
    : `https://www.google.com/search?q=${query}&tbm=vid`
  window.open(url, '_blank')
}
</script>

<style scoped>
.exercise-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 280px;
}

.exercise-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 143, 56, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.05);
}

.card-header {
  position: relative;
  padding-top: 12px;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #3fb950, #2ea043);
  transition: all 0.3s ease;
}

.card-header.beginner::before { background: linear-gradient(90deg, #3fb950, #2ea043); }
.card-header.intermediate::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.card-header.expert::before { background: linear-gradient(90deg, #ff6b6b, #ee5a5a); }

.exercise-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.exercise-description {
  font-size: 0.9rem;
  color: #8b949e;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.exercise-card:hover .card-actions {
  opacity: 1;
}

.card-actions .q-btn {
  font-size: 0.75rem;
  font-weight: 500;
}

.exercise-difficulty {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.fire-row {
  display: flex;
  gap: 4px;
}

.level-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.level-badge.beginner { background: rgba(63, 185, 80, 0.2); color: #3fb950; }
.level-badge.intermediate { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.level-badge.expert { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }

.exercise-muscles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muscle-tag {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.muscle-tag.primary {
  background: rgba(88, 166, 255, 0.15);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.3);
}

.muscle-tag.secondary {
  background: rgba(139, 148, 158, 0.1);
  color: #8b949e;
  border: 1px solid rgba(139, 148, 158, 0.2);
}

.exercise-disciplines {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.discipline-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.discipline-tag.calisthenics { background: rgba(255, 143, 56, 0.15); color: #ff8f38; }
.discipline-tag.crossfit { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; }
.discipline-tag.fitness { background: rgba(88, 166, 255, 0.15); color: #58a6ff; }

.exercise-equipment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
  color: #8b949e;
  margin-top: auto;
}
</style>
