<template>
  <div class="tab-content">
    <div class="section-header">
      <h2>Niveles del Programa</h2>
      <q-btn color="primary" icon="add" label="Añadir Nivel" @click="$emit('add')" />
    </div>

    <div class="levels-list">
      <div v-for="level in levels" :key="level.id" class="level-wrapper"
        :class="{ 'expanded': expandedLevel === level.id }">
        <div class="level-card-compact" :class="{ 'locked': level.isLockedByDefault }" @click="toggleLevel(level)">
          <div class="level-main">
            <div class="level-num">{{ level.levelNumber }}</div>
            <div class="level-content">
              <h4>{{ level.name }}</h4>
              <div class="level-badges">
                <q-badge v-if="level.requirements?.length" color="grey-8" class="q-mr-sm">
                  <q-icon name="checklist" size="12px" class="q-mr-xs" />
                  {{ level.requirements.length }} requisitos
                </q-badge>
                <q-badge v-if="level.isLockedByDefault" color="orange" class="q-mr-sm">
                  <q-icon name="lock" size="12px" class="q-mr-xs" /> Bloqueado
                </q-badge>
              </div>
            </div>
          </div>
          <div class="level-actions-compact">
            <q-btn flat round dense :icon="expandedLevel === level.id ? 'expand_less' : 'expand_more'" color="grey-5" />
            <q-btn flat round dense icon="edit" color="primary" @click.stop="$emit('edit', level)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Expanded content -->
        <div v-if="expandedLevel === level.id && level.hasDetailedTraining" class="training-expanded">
          <slot name="level-detail" :level="level" />
        </div>

        <div v-else-if="expandedLevel === level.id" class="level-simple-detail">
          <p>{{ level.description || 'Sin descripción detallada' }}</p>
          <q-btn flat color="primary" icon="edit" label="Editar nivel" @click="$emit('edit', level)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  levels: { type: Array, required: true }
})

defineEmits(['add', 'edit'])

const expandedLevel = ref(null)

const toggleLevel = (level) => {
  expandedLevel.value = expandedLevel.value === level.id ? null : level.id
}
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

.levels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-wrapper {
  border-radius: 16px;
  overflow: hidden;
}

.level-card-compact {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.level-card-compact:hover {
  border-color: rgba(255, 143, 56, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.level-card-compact.locked {
  opacity: 0.7;
}

.level-main {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.level-num {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff8f38 0%, #ff6b6b 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.level-card-compact.locked .level-num {
  background: #21262d;
  color: #8b949e;
}

.level-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.level-badges {
  display: flex;
  gap: 8px;
}

.level-actions-compact {
  display: flex;
  gap: 8px;
}

.training-expanded,
.level-simple-detail {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: none;
  border-radius: 0 0 16px 16px;
  padding: 24px;
}

.level-simple-detail {
  text-align: center;
  color: #8b949e;
}
</style>
