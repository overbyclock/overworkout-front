<template>
  <div class="filter-pills-container">
    <div class="filter-category">
      <span v-if="label" class="filter-category-label">
        <q-icon v-if="icon" :name="icon" size="16px" />
        {{ label }}
      </span>
      <div class="filter-pills">
        <button
          v-for="option in options"
          :key="option.value"
          class="filter-pill"
          :class="{ 
            'active': modelValue === option.value,
            [option.color]: modelValue === option.value 
          }"
          @click="$emit('update:modelValue', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'all',
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.filter-pills-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-category {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-category-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.filter-category-label .q-icon {
  opacity: 0.7;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-pill {
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #c9d1d9;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.filter-pill:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.filter-pill.active {
  background: linear-gradient(135deg, #ff8f38 0%, #ff6b35 100%);
  color: #000000;
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(255, 143, 56, 0.5);
}

/* Category colors */
.filter-pill.blue.active { background: linear-gradient(135deg, #58a6ff 0%, #1f6feb 100%); box-shadow: 0 6px 20px rgba(88, 166, 255, 0.5); }
.filter-pill.orange.active { background: linear-gradient(135deg, #ff8f38 0%, #ff6b35 100%); box-shadow: 0 6px 20px rgba(255, 143, 56, 0.5); }
.filter-pill.brown.active { background: linear-gradient(135deg, #a1886f 0%, #8d6e63 100%); box-shadow: 0 6px 20px rgba(161, 136, 111, 0.5); }
.filter-pill.yellow.active { background: linear-gradient(135deg, #ffd700 0%, #ffc107 100%); box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5); }
.filter-pill.green.active { background: linear-gradient(135deg, #3fb950 0%, #2ea043 100%); box-shadow: 0 6px 20px rgba(63, 185, 80, 0.5); }
.filter-pill.red.active { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5); }
.filter-pill.purple.active { background: linear-gradient(135deg, #9370db 0%, #7c3aed 100%); box-shadow: 0 6px 20px rgba(147, 112, 219, 0.5); }
.filter-pill.teal.active { background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); box-shadow: 0 6px 20px rgba(56, 178, 172, 0.5); }
</style>
