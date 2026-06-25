<template>
  <ContentCard
    :title="item.name"
    :description="item.description"
    :icon="getDisciplineIcon(item.discipline)"
    :level="getLevelLabel(item.level || item.difficulty)"
    :badge="badge"
    show-favorite
    :is-favorite="isFavorite"
    @click="emit('click')"
    @toggle-favorite="emit('toggle-favorite')"
  />
</template>

<script setup>
import ContentCard from '@/components/mobile/ContentCard.vue'
import { getDisciplineIcon } from '@/constants/disciplines'
import { getLevelLabel } from '@/constants/levels'

defineProps({
  item: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  badge: { type: String, default: '' },
})

const emit = defineEmits(['click', 'toggle-favorite'])
</script>
