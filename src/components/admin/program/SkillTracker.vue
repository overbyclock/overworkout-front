<template>
  <div v-if="hasLevels" class="skill-tracker">
    <div class="skill-tracker__header">
      <div class="skill-tracker__title-group">
        <q-icon name="route" size="20px" color="primary" class="q-mr-sm" />
        <span class="skill-tracker__title">Skills por nivel</span>
      </div>
      <q-badge color="dark" text-color="grey-5" class="skill-tracker__badge">
        {{ levelsWithSkillCount }} / {{ sortedLevels.length }} definidos
      </q-badge>
    </div>

    <div class="skill-levels">
      <div
        v-for="level in sortedLevels"
        :key="level.levelNumber"
        class="skill-level-card"
        :class="{ 'skill-level-card--empty': !level.skillFocus }"
      >
        <div class="skill-level-card__dot">{{ level.levelNumber }}</div>

        <div class="skill-level-card__content">
          <div v-if="level.skillFocus" class="skill-level-card__value">
            {{ level.skillFocus }}
          </div>
          <div v-else class="skill-level-card__empty">Sin skill definido</div>
        </div>

        <q-icon
          v-if="level.skillFocus"
          name="check_circle"
          size="18px"
          color="positive"
          class="skill-level-card__status"
        />
        <q-icon
          v-else
          name="error_outline"
          size="18px"
          color="grey-6"
          class="skill-level-card__status"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  levels: { type: Array, required: true },
  currentLevel: { type: Number, default: 1 },
})

const sortedLevels = computed(() => {
  return [...props.levels].sort((a, b) => a.levelNumber - b.levelNumber)
})

const hasLevels = computed(() => sortedLevels.value.length > 0)

const levelsWithSkillCount = computed(() => {
  return sortedLevels.value.filter((l) => !!l.skillFocus).length
})
</script>

<style scoped>
.skill-tracker {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.skill-tracker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.skill-tracker__title-group {
  display: flex;
  align-items: center;
}

.skill-tracker__title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.skill-tracker__badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Grid responsive */
.skill-levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* Tarjeta de cada nivel */
.skill-level-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.skill-level-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 143, 56, 0.2);
  transform: translateY(-1px);
}

.skill-level-card--empty {
  background: rgba(255, 255, 255, 0.015);
  border-color: rgba(255, 255, 255, 0.04);
}

.skill-level-card--empty:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

/* Número de nivel */
.skill-level-card__dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  border: 2px solid #ff8f38;
  background: rgba(255, 143, 56, 0.1);
  color: #ff8f38;
}

.skill-level-card--empty .skill-level-card__dot {
  border-color: rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #6e7681;
}

/* Contenido del skill */
.skill-level-card__content {
  flex: 1;
  min-width: 0;
}

.skill-level-card__value {
  font-size: 13px;
  font-weight: 600;
  color: #e6edf3;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skill-level-card__empty {
  font-size: 13px;
  font-style: italic;
  color: #6e7681;
  font-weight: 500;
}

.skill-level-card__status {
  flex-shrink: 0;
  opacity: 0.9;
}

/* Breakpoints: 3 → 2 → 1 */
@media (max-width: 1519px) {
  .skill-levels {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1151px) {
  .skill-levels {
    grid-template-columns: 1fr;
  }

  .skill-tracker {
    padding: 16px;
  }
}
</style>
