<template>
  <div v-if="hasSkills" class="skill-tracker">
    <h5 class="skill-tracker__title">
      <q-icon name="route" size="18px" class="q-mr-sm" />
      Roadmap de Skills
    </h5>

    <div class="skill-roadmap">
      <div
        v-for="(level, index) in levelsWithSkills"
        :key="level.levelNumber"
        class="skill-node"
        :class="{
          'skill-node--current': level.levelNumber === currentLevel,
          'skill-node--completed': level.levelNumber < currentLevel,
          'skill-node--future': level.levelNumber > currentLevel,
        }">
        <div class="skill-node__connector" v-if="index > 0"></div>
        <div class="skill-node__dot">
          <span class="skill-node__level">{{ level.levelNumber }}</span>
        </div>
        <div class="skill-node__label">
          <span class="skill-node__name">{{ level.skillFocus }}</span>
        </div>
      </div>
    </div>

    <div v-if="currentSkill" class="skill-current">
      <q-icon name="stars" size="20px" color="primary" />
      <div class="skill-current__info">
        <span class="skill-current__label">Skill actual (Nivel {{ currentLevel }})</span>
        <span class="skill-current__name">{{ currentSkill }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  levels: { type: Array, required: true },
  currentLevel: { type: Number, default: 1 }
})

const levelsWithSkills = computed(() => {
  return props.levels
    .filter((l) => !!l.skillFocus)
    .sort((a, b) => a.levelNumber - b.levelNumber)
})

const hasSkills = computed(() => levelsWithSkills.value.length > 0)

const currentSkill = computed(() => {
  const level = props.levels.find((l) => l.levelNumber === props.currentLevel)
  return level?.skillFocus || null
})
</script>

<style scoped>
.skill-tracker {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.skill-tracker__title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
}

.skill-roadmap {
  display: flex;
  align-items: flex-start;
  gap: 0;
  overflow-x: auto;
  padding-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 143, 56, 0.3) transparent;
}

.skill-roadmap::-webkit-scrollbar {
  height: 4px;
}

.skill-roadmap::-webkit-scrollbar-thumb {
  background: rgba(255, 143, 56, 0.3);
  border-radius: 4px;
}

.skill-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 80px;
  flex-shrink: 0;
}

.skill-node__connector {
  position: absolute;
  top: 16px;
  left: -50%;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.skill-node--completed .skill-node__connector {
  background: linear-gradient(90deg, #21ba45, #21ba45);
}

.skill-node__dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid rgba(255, 255, 255, 0.15);
  background: #1a1f2e;
  color: #8b949e;
  z-index: 1;
  transition: all 0.3s ease;
}

.skill-node--completed .skill-node__dot {
  background: #21ba45;
  border-color: #21ba45;
  color: #fff;
}

.skill-node--current .skill-node__dot {
  background: #ff8f38;
  border-color: #ff8f38;
  color: #fff;
  box-shadow: 0 0 16px rgba(255, 143, 56, 0.4);
  transform: scale(1.15);
}

.skill-node__label {
  margin-top: 8px;
  text-align: center;
  max-width: 90px;
}

.skill-node__name {
  font-size: 11px;
  color: #8b949e;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-node--current .skill-node__name {
  color: #ff8f38;
  font-weight: 600;
}

.skill-node--completed .skill-node__name {
  color: #4ade80;
}

.skill-current {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 16px;
  background: rgba(255, 143, 56, 0.08);
  border: 1px solid rgba(255, 143, 56, 0.2);
  border-radius: 12px;
}

.skill-current__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.skill-current__label {
  font-size: 12px;
  color: #ff8f38;
  font-weight: 500;
}

.skill-current__name {
  font-size: 15px;
  color: #fff;
  font-weight: 600;
}

@media (max-width: 768px) {
  .skill-roadmap {
    gap: 8px;
  }

  .skill-node {
    min-width: 60px;
  }

  .skill-node__label {
    max-width: 70px;
  }
}
</style>
