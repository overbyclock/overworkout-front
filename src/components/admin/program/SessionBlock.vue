<template>
  <div class="session-block">
    <!-- Info de descansos / banner de tipo de sesión -->
    <div v-if="block?.isCircuit" class="circuit-banner">
      <div class="circuit-banner__main">
        <q-icon name="repeat" size="18px" />
        <strong>{{ block.circuitConfig?.rounds }} RONDAS</strong>
      </div>
      <div class="circuit-banner__rest">
        <span class="rest-pill">
          <q-icon name="timer" size="12px" />
          {{ block.circuitConfig?.restBetweenExercises }} entre ejercicios
        </span>
        <span class="rest-pill">
          <q-icon name="hourglass_top" size="12px" />
          {{ block.circuitConfig?.restBetweenRounds }} entre rondas
        </span>
      </div>
    </div>
    <div v-else-if="block?.circuitConfig?.restBetweenExercises" class="strength-banner">
      <div class="strength-banner__rest">
        <span class="rest-pill">
          <q-icon name="timer" size="12px" />
          {{ block.circuitConfig?.restBetweenExercises }} entre ejercicios
        </span>
      </div>
    </div>

    <!-- Lista de ejercicios -->
    <div class="exercises-list" :class="{ 'exercises-list--circuit': block?.isCircuit }">
      <div
        v-for="(ex, exIdx) in block?.exercises"
        :key="exIdx"
        class="exercise-item">

        <div class="exercise-item__left">
          <div class="exercise-number">{{ exIdx + 1 }}</div>
          <div v-if="block?.isCircuit && exIdx < (block.exercises.length - 1)" class="circuit-connector">
            <q-icon name="arrow_downward" size="14px" />
          </div>
        </div>

        <div class="exercise-item__body">
          <div class="exercise-main">
            <div class="exercise-title">
              <span class="exercise-name">{{ ex.name }}</span>
              <span v-if="ex.id" class="exercise-id">#{{ ex.id }}</span>
            </div>
            <div class="exercise-badges">
              <span class="difficulty-flames" :class="'difficulty-' + (ex.difficulty || 1)">
                <q-icon
                  v-for="n in (ex.difficulty || 1)"
                  :key="n"
                  name="local_fire_department"
                  size="12px" />
              </span>
              <q-btn
                v-if="ex.videoSearch"
                flat
                round
                dense
                icon="play_circle"
                size="sm"
                class="video-btn"
                @click="searchVideo(ex.videoSearch)">
                <q-tooltip>Ver video</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="exercise-sub">
            <span class="exercise-reps">
              <span v-if="ex.sets && ex.sets > 1" class="exercise-sets">{{ ex.sets }} sets × </span>
              {{ ex.reps }}
            </span>
            <span v-if="ex.restBetweenSets && !block?.isCircuit" class="exercise-rest">
              <q-icon name="hourglass_top" size="12px" />
              {{ ex.restBetweenSets }} descanso
            </span>
            <span v-if="ex.notes" class="exercise-note">{{ ex.notes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Descanso entre bloques / rondas -->
    <div v-if="block.restAfterBlock" class="block-rest-footer">
      <q-icon name="pause" size="16px" />
      <span>
        Descanso entre rondas
        <span class="block-rest-time">({{ block.restAfterBlock }})</span>
      </span>
      <q-icon name="pause" size="16px" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  block: { type: Object, required: true },
})

const searchVideo = (query) => {
  if (!query) return
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  window.open(url, '_blank')
}
</script>

<style scoped>
/* ===== Banners de tipo de sesión ===== */
.circuit-banner {
  background: rgba(0, 0, 0, 0.25);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.circuit-banner__main {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #fff;
}

.circuit-banner__main strong {
  color: #ff8f38;
  font-weight: 700;
}

.circuit-banner__rest {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.strength-banner {
  background: rgba(96, 165, 250, 0.08);
  border: 1px dashed rgba(96, 165, 250, 0.25);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.strength-banner__rest {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rest-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  font-size: 12px;
  color: #8b949e;
}

/* ===== Lista de ejercicios ===== */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exercise-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: background 0.2s ease;
}

.exercise-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.exercise-item__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.exercise-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff8f38, #ff6b6b);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.circuit-connector {
  color: #ff8f38;
  opacity: 0.6;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exercise-item__body {
  flex: 1;
  min-width: 0;
}

.exercise-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.exercise-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.exercise-name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}

.exercise-id {
  font-size: 11px;
  font-weight: 500;
  color: #555;
  font-family: 'SF Mono', Monaco, monospace;
  letter-spacing: 0.3px;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
}

.exercise-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.difficulty-flames {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

.difficulty-flames :deep(.q-icon) {
  color: #555;
}

.difficulty-1 :deep(.q-icon:nth-child(-n+1)) { color: #ff8f38; }
.difficulty-2 :deep(.q-icon:nth-child(-n+2)) { color: #ff8f38; }
.difficulty-3 :deep(.q-icon:nth-child(-n+3)) { color: #ff8f38; }
.difficulty-4 :deep(.q-icon:nth-child(-n+4)) { color: #ff8f38; }
.difficulty-5 :deep(.q-icon:nth-child(-n+5)) { color: #ff8f38; }

.video-btn {
  color: #8b949e;
  transition: color 0.2s;
}

.video-btn:hover {
  color: #ff8f38;
}

.exercise-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.exercise-reps {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(255, 143, 56, 0.12);
  color: #ff8f38;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
}

.exercise-note {
  font-size: 12px;
  color: #6e7681;
  line-height: 1.4;
}

.exercise-rest {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
}

/* ===== Descanso entre rondas ===== */
.block-rest-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 0;
  margin-top: 8px;
  color: #555;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.block-rest-time {
  color: #ff8f38;
  font-weight: 700;
  margin-left: 4px;
}

/* Responsive tweaks */
@media (max-width: 480px) {
  .circuit-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .exercise-main {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
