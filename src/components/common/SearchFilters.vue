<template>
  <div class="card-header-section">
    <div class="search-box">
      <q-icon name="search" class="search-icon" size="20px" />
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <q-btn
        v-if="modelValue"
        flat
        round
        dense
        icon="close"
        size="sm"
        class="clear-btn"
        @click="$emit('update:modelValue', '')"
      />
    </div>
    <div class="header-actions">
      <slot name="filters" />
      <q-btn
        flat
        round
        icon="refresh"
        color="grey-6"
        :loading="loading"
        @click="$emit('refresh')"
      >
        <q-tooltip>Actualizar</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Buscar...',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'refresh'])
</script>

<style scoped>
.card-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-box {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 40px 12px 48px;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #8b949e;
}

.search-input:focus {
  border-color: rgba(255, 143, 56, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

@media (max-width: 900px) {
  .card-header-section {
    flex-direction: column;
    gap: 16px;
  }

  .search-box {
    width: 100%;
  }
}
</style>
