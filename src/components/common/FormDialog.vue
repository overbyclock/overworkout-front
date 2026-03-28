<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="dialog-card" :class="{ 'delete-dialog': isDelete }">
      <q-card-section class="dialog-header">
        <template v-if="isDelete">
          <div class="delete-icon">
            <q-icon name="warning" color="negative" size="32px" />
          </div>
          <h3 class="dialog-title">{{ title }}</h3>
          <p v-if="subtitle" class="dialog-subtitle" v-html="subtitle" />
        </template>
        <template v-else>
          <h3 class="dialog-title">{{ title }}</h3>
          <q-btn flat round icon="close" color="grey-6" v-close-popup />
        </template>
      </q-card-section>

      <q-card-section v-if="!isDelete" class="dialog-body">
        <slot />
      </q-card-section>

      <q-card-section class="dialog-footer">
        <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
        <q-btn
          :label="confirmLabel"
          :color="confirmColor"
          :loading="loading"
          @click="$emit('confirm')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  confirmLabel: {
    type: String,
    default: 'Guardar',
  },
  confirmColor: {
    type: String,
    default: 'primary',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.dialog-card {
  background: #1a1f2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  min-width: 480px;
  max-width: 90vw;
}

.delete-dialog {
  text-align: center;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.delete-dialog .dialog-header {
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.delete-icon {
  width: 64px;
  height: 64px;
  background: rgba(248, 81, 73, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.dialog-subtitle {
  color: #8b949e;
  margin: 0;
}

.dialog-subtitle :deep(strong) {
  color: #ffffff;
}

.dialog-body {
  padding: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 600px) {
  .dialog-card {
    min-width: auto;
    width: 90vw;
  }
}
</style>
