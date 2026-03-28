<template>
  <div class="program-header">
    <div class="header-gradient" :style="{ background: gradient }">
      <q-btn flat round icon="arrow_back" class="back-btn" @click="$emit('back')" />
      <div class="header-content">
        <div class="program-icon">{{ icon }}</div>
        <div class="program-info">
          <h1 class="program-title">{{ program.name }}</h1>
          <p class="program-subtitle">{{ program.description }}</p>
          <div class="program-badges">
            <q-badge :color="program.isActive ? 'positive' : 'grey'" class="q-mr-sm">
              {{ program.isActive ? 'Activo' : 'Inactivo' }}
            </q-badge>
            <q-badge color="primary" class="q-mr-sm">{{ program.totalLevels }} niveles</q-badge>
            <q-badge color="grey-7">~{{ program.estimatedDurationWeeks }} semanas</q-badge>
          </div>
        </div>
        <div class="header-actions">
          <q-btn flat round icon="edit" color="white" @click="$emit('edit')">
            <q-tooltip>Editar programa</q-tooltip>
          </q-btn>
          <q-btn flat round icon="more_vert" color="white">
            <q-menu dark>
              <q-list style="min-width: 200px; background: #212529;">
                <q-item clickable v-close-popup @click="$emit('duplicate')">
                  <q-item-section avatar><q-icon name="content_copy" /></q-item-section>
                  <q-item-section>Duplicar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="$emit('toggle-active')">
                  <q-item-section avatar><q-icon :name="program.isActive ? 'pause' : 'play_arrow'" /></q-item-section>
                  <q-item-section>{{ program.isActive ? 'Desactivar' : 'Activar' }}</q-item-section>
                </q-item>
                <q-separator dark />
                <q-item clickable v-close-popup @click="$emit('delete')" class="text-negative">
                  <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                  <q-item-section>Eliminar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  program: { type: Object, required: true },
  gradient: { type: String, default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  icon: { type: String, default: '🎯' }
})

defineEmits(['back', 'edit', 'duplicate', 'toggle-active', 'delete'])
</script>

<style scoped>
.program-header {
  margin: -24px -24px 24px -24px;
}

.header-gradient {
  position: relative;
  padding: 40px;
  min-height: 280px;
  display: flex;
  align-items: flex-end;
}

.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  color: white;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  align-items: flex-end;
  gap: 30px;
  width: 100%;
}

.program-icon {
  font-size: 100px;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.3));
}

.program-info {
  flex: 1;
  color: white;
}

.program-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 12px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.program-subtitle {
  font-size: 16px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 0 20px;
  line-height: 1.6;
}

.program-badges {
  display: flex;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .header-gradient {
    padding: 80px 20px 30px;
    min-height: auto;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .program-icon {
    font-size: 60px;
  }
  
  .program-title {
    font-size: 28px;
  }
}
</style>
