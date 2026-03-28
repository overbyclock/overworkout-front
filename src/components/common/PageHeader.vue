<template>
  <div class="page-header">
    <div>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <q-btn
      v-if="showAction"
      color="primary"
      :icon="actionIcon"
      :label="actionLabel"
      class="action-btn"
      no-caps
      @click="$emit('action')"
    />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  showAction: {
    type: Boolean,
    default: true,
  },
  actionLabel: {
    type: String,
    default: 'Nuevo',
  },
  actionIcon: {
    type: String,
    default: 'add',
  },
})

defineEmits(['action'])
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #8b949e;
  margin: 0;
}

.action-btn {
  background: linear-gradient(135deg, #ff8f38 0%, #e67e2e 100%);
  border-radius: 12px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
