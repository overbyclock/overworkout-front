<template>
  <div class="week-panel">
    <div class="week-info-compact">
      <h4>
        <span v-if="weekNum === 0">🌱</span>
        <span v-else-if="weekNum === 1">📚</span>
        <span v-else-if="weekNum === 2">📈</span>
        <span v-else-if="weekNum === 3">🔥</span>
        <span v-else>💪</span>
        {{ weekData?.info?.name }}
      </h4>
      <p class="week-tip">{{ weekData?.progression }}</p>
      <q-banner v-if="weekNum === 0" class="bg-amber-9 text-white q-mt-sm" dense rounded>
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        {{ weekData?.info?.note }}
      </q-banner>
      <q-banner v-else-if="weekNum === 2" class="bg-blue-9 text-white q-mt-sm" dense rounded>
        <template v-slot:avatar>
          <q-icon name="trending_up" />
        </template>
        {{ weekData?.info?.note }}
      </q-banner>
      <q-banner v-else-if="weekNum === 3 || weekNum === 4" class="bg-red-9 text-white q-mt-sm" dense rounded>
        <template v-slot:avatar>
          <q-icon name="local_fire_department" />
        </template>
        {{ weekData?.info?.note }}
      </q-banner>
    </div>
    
    <div class="sessions-compact">
      <div v-for="sessionKey in sessionKeys" :key="sessionKey" class="session-box">
        <div class="session-header-compact">
          <span class="session-name">
            {{ weekData?.data?.[sessionKey]?.name }}
            <span v-if="weekNum === 0" class="text-caption text-amber">→ 50% reps</span>
          </span>
          <span class="session-time">{{ weekData?.data?.[sessionKey]?.duration }}</span>
        </div>
        <div class="muscle-tags">
          <span v-for="mg in weekData?.data?.[sessionKey]?.muscleGroups" :key="mg" class="muscle-tag">{{ mg }}</span>
        </div>
        
        <!-- Meta del día -->
        <div class="session-goal q-mb-sm">
          <q-chip size="sm" :color="chipColor" text-color="white" icon="sports">
            {{ weekData?.data?.[sessionKey]?.goal }}
          </q-chip>
        </div>
        
        <!-- CIRCUIT FORMAT: Rondas -->
        <div v-if="weekData?.data?.[sessionKey]?.isCircuit" class="circuit-info">
          <div class="circuit-badge">
            <q-icon name="repeat" size="18px" class="q-mr-sm" />
            {{ weekData?.data?.[sessionKey]?.circuitConfig?.rounds }} RONDAS
          </div>
          <div class="circuit-rest">
            <span>⏱️ {{ weekData?.data?.[sessionKey]?.circuitConfig?.restBetweenExercises }} entre ejercicios</span>
            <span>• {{ weekData?.data?.[sessionKey]?.circuitConfig?.restBetweenRounds }} entre rondas</span>
          </div>
        </div>
        
        <div class="exercises-compact" :class="{ 'circuit-flow': weekData?.data?.[sessionKey]?.isCircuit }">
          <div v-for="(ex, exIdx) in weekData?.data?.[sessionKey]?.exercises" :key="exIdx" class="exercise-row" :class="{ 'circuit-item': weekData?.data?.[sessionKey]?.isCircuit }">
            <div class="exercise-info">
              <div class="exercise-header-row">
                <q-icon v-if="weekData?.data?.[sessionKey]?.isCircuit && exIdx > 0" name="arrow_downward" size="14px" color="primary" class="flow-arrow" />
                <span class="exercise-number" v-if="weekData?.data?.[sessionKey]?.isCircuit">{{ exIdx + 1 }}.</span>
                <span class="exercise-name-compact">{{ ex.name }}</span>
                <span class="difficulty-flames" :class="'difficulty-' + (ex.difficulty || 1)">
                  <q-icon v-for="n in (ex.difficulty || 1)" :key="n" name="local_fire_department" size="12px" />
                </span>
                <q-badge v-if="ex.id" color="grey-8" size="xs" class="q-ml-sm">ID:{{ ex.id }}</q-badge>
              </div>
              <span class="exercise-stats circuit-stats">{{ ex.reps }}</span>
            </div>
            <q-btn flat round dense icon="play_circle" size="xs" color="grey-6" @click="searchVideo(ex.videoSearch)">
              <q-tooltip>Ver video</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  weekData: Object,
  weekNum: Number,
  levelNum: Number
})

const sessionKeys = ['day1_push', 'day2_pull', 'day3_legs', 'day4_core']

const chipColor = computed(() => {
  if (props.weekNum === 0 || props.weekNum === 1) return 'primary'
  if (props.weekNum === 2) return 'blue'
  return 'red'
})

const searchVideo = (query) => {
  if (!query) return
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  window.open(url, '_blank')
}
</script>
