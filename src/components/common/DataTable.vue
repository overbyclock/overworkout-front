<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="column.align || 'text-left'">
            {{ column.label }}
          </th>
          <th v-if="showActions" class="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loading State -->
        <template v-if="loading">
        <tr v-for="i in skeletonRows" :key="`skeleton-${i}`">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="skeleton-row">
            <q-skeleton type="text" class="bg-grey-8" />
          </td>
        </tr>
        </template>

        <!-- Error State -->
        <tr v-else-if="error">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="empty-cell">
            <div class="empty-table-state">
              <q-icon name="error" size="48px" color="negative" />
              <p>{{ error }}</p>
              <q-btn color="primary" label="Reintentar" no-caps @click="$emit('refresh')" />
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!items.length">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="empty-cell">
            <div class="empty-table-state">
              <q-icon :name="emptyIcon" size="48px" color="grey-6" />
              <p>{{ emptyText }}</p>
            </div>
          </td>
        </tr>

        <!-- Data Rows -->
        <tr v-for="item in items" :key="getItemKey(item)" class="table-row">
          <td v-for="column in columns" :key="column.key" :class="column.align || 'text-left'">
            <slot :name="`cell-${column.key}`" :item="item" :value="getItemValue(item, column)">
              {{ getItemValue(item, column) }}
            </slot>
          </td>
          <td v-if="showActions" class="text-right">
            <slot name="actions" :item="item">
              <q-btn
                flat
                round
                size="sm"
                icon="edit"
                color="primary"
                @click="$emit('edit', item)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                icon="delete"
                color="negative"
                @click="$emit('delete', item)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div v-if="showPagination && total > 0" class="pagination-section">
    <span class="pagination-info">
      Mostrando {{ items.length }} de {{ total }} {{ itemName }}
    </span>
    <div class="pagination-controls">
      <q-btn
        flat
        dense
        icon="chevron_left"
        :disable="page <= 1"
        color="grey-6"
        @click="$emit('update:page', page - 1)"
      />
      <q-btn
        v-for="p in displayedPages"
        :key="p"
        flat
        dense
        :label="p"
        :color="page === p ? 'primary' : 'grey-6'"
        :class="['pagination-btn', { active: page === p }]"
        @click="$emit('update:page', p)"
      />
      <q-btn
        flat
        dense
        icon="chevron_right"
        :disable="page >= totalPages"
        color="grey-6"
        @click="$emit('update:page', page + 1)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  emptyIcon: {
    type: String,
    default: 'inbox',
  },
  emptyText: {
    type: String,
    default: 'No hay datos',
  },
  itemName: {
    type: String,
    default: 'elementos',
  },
  skeletonRows: {
    type: Number,
    default: 5,
  },
  // Pagination props
  showPagination: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
})

defineEmits(['edit', 'delete', 'refresh', 'update:page'])

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getItemKey = (item) => item.id || item.uuid || JSON.stringify(item)

const getItemValue = (item, column) => {
  if (column.format) {
    return column.format(item[column.key], item)
  }
  return item[column.key]
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 16px 24px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.skeleton-row {
  padding: 20px 24px;
}

.empty-cell {
  padding: 60px 24px;
}

.empty-table-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #8b949e;
}

.empty-table-state p {
  margin: 0;
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pagination-info {
  color: #8b949e;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.pagination-btn.active {
  background: rgba(255, 143, 56, 0.2);
}

@media (max-width: 768px) {
  .pagination-section {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
