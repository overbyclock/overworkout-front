<template>
  <div class="level-detail" v-if="levelData">
    <div class="training-header-compact">
      <div class="training-title-row">
        <h3>{{ levelData.name }}</h3>
        <div class="training-badges">
          <q-badge color="primary">{{ levelData.durationWeeks }} semanas</q-badge>
          <q-badge color="secondary">{{ levelData.sessionsPerWeek }} sesiones/semana</q-badge>
          <q-badge color="accent">{{ levelData.difficulty }}</q-badge>
        </div>
      </div>
      <p class="training-desc">{{ levelData.description }}</p>
    </div>

    <div class="weeks-container">
      <q-tabs v-model="selectedWeek" dense dark class="week-tabs-compact">
        <q-tab v-for="weekNum in availableWeeks" :key="weekNum" :name="`week${weekNum}`"
          :label="weekNum === 0 ? 'SEMANA 0' : `SEMANA ${weekNum}`" />
        <q-tab v-if="levelData.testWeek" :name="`week${levelData.durationWeeks - 1}`" label="TESTS" />
      </q-tabs>

      <q-tab-panels v-model="selectedWeek" dark animated class="week-panels-compact">
        <q-tab-panel v-for="weekNum in availableWeeks" :key="weekNum" :name="`week${weekNum}`">
          <WeekPanel :week-data="getWeekData(weekNum)" :week-num="weekNum" :level-num="level.levelNumber" />
        </q-tab-panel>

        <q-tab-panel v-if="levelData.testWeek" :name="`week${levelData.durationWeeks - 1}`">
          <div class="tests-compact">
            <h4>{{ levelData.testWeek.name }}</h4>
            <p class="tests-desc">{{ levelData.testWeek.tests?.description }}</p>
            <div class="tests-list">
              <div v-for="(test, idx) in levelData.testWeek.tests?.requirements" :key="idx" class="test-item">
                <div class="test-info">
                  <span class="test-name-compact">{{ test.name }}</span>
                  <span class="test-minimum">Mín: {{ test.minimum }} {{ test.unit }}</span>
                </div>
                <span class="test-target">Obj: {{ test.target }} {{ test.unit }}</span>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="tips-compact">
      <h5>💡 Consejos</h5>
      <ul>
        <li v-for="(tip, idx) in levelData.tips" :key="idx">{{ tip }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WeekPanel from '@/components/WeekPanel.vue'

const props = defineProps({
  level: { type: Object, required: true },
  levelData: { type: Object, default: null }
})

const selectedWeek = ref('week0')

const availableWeeks = computed(() => {
  if (!props.levelData?.weeks) return []
  const weekNums = Object.keys(props.levelData.weeks).map(Number)
  return weekNums.sort((a, b) => a - b)
})

const getWeekData = (weekNum) => {
  if (!props.levelData) return null
  const weekData = props.levelData.weeks?.[weekNum]
  if (!weekData) return null
  return {
    type: `week${weekNum}`,
    data: weekData,
    info: props.levelData.trainingWeeks?.find(w => w.week === weekNum),
    progression: props.levelData.progression?.[`week${weekNum}`]
  }
}
</script>

<style scoped>
.training-header-compact {
  margin-bottom: 20px;
}

.training-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.training-title-row h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.training-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.training-desc {
  color: #8b949e;
  margin: 0;
  line-height: 1.6;
}

.weeks-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Estilos custom para las tabs de semanas */
.week-tabs-compact :deep(.q-tabs__content) {
  gap: 6px;
  padding: 8px;
}

.week-tabs-compact :deep(.q-tab) {
  min-height: 36px;
  padding: 6px 16px;
  border-radius: 10px;
  color: #8b949e;
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.week-tabs-compact :deep(.q-tab:hover) {
  background: rgba(255, 255, 255, 0.04);
  color: #c9d1d9;
}

.week-tabs-compact :deep(.q-tab--active) {
  background: linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(255, 143, 56, 0.3);
}

.week-tabs-compact :deep(.q-tab__indicator) {
  display: none;
}

.week-tabs-compact :deep(.q-tab__content) {
  min-width: auto;
}

/* Paneles de semana */
.week-panels-compact :deep(.q-tab-panel) {
  padding: 24px;
}

@media (max-width: 768px) {
  .week-panels-compact :deep(.q-tab-panel) {
    padding: 16px;
  }
}

.tests-compact {
  padding: 20px;
}

.tests-compact h4 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.tests-desc {
  color: #8b949e;
  margin: 0 0 16px;
}

.tests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.test-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.test-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.test-name-compact {
  font-weight: 600;
  color: #fff;
}

.test-minimum {
  font-size: 13px;
  color: #8b949e;
}

.test-target {
  color: #ff8f38;
  font-weight: 600;
}

.tips-compact {
  background: rgba(255, 143, 56, 0.1);
  border: 1px solid rgba(255, 143, 56, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.tips-compact h5 {
  font-size: 16px;
  font-weight: 600;
  color: #ff8f38;
  margin: 0 0 12px;
}

.tips-compact ul {
  margin: 0;
  padding-left: 20px;
  color: #c9d1d9;
}

.tips-compact li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.tips-compact li:last-child {
  margin-bottom: 0;
}
</style>
