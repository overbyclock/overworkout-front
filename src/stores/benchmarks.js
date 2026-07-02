import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { benchmarkService } from '@/services'
import { extractItems, extractErrorMessage } from '@/utils/api-helpers'

export const useBenchmarksStore = defineStore('benchmarks', () => {
  const benchmarks = ref([])
  const loading = ref(false)
  const error = ref(null)

  const allBenchmarks = computed(() => benchmarks.value)
  const totalBenchmarks = computed(() => benchmarks.value.length)
  const isEmpty = computed(() => benchmarks.value.length === 0)
  const hasError = computed(() => !!error.value)

  const benchmarksByType = computed(() => {
    const grouped = {}
    benchmarks.value.forEach((benchmark) => {
      const type = benchmark.type || 'benchmark'
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(benchmark)
    })
    return grouped
  })

  const fetchBenchmarks = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await benchmarkService.getAll()
      benchmarks.value = extractItems(response)
      return benchmarks.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    benchmarks.value = []
    loading.value = false
    error.value = null
  }

  return {
    benchmarks,
    loading,
    error,
    allBenchmarks,
    totalBenchmarks,
    isEmpty,
    hasError,
    benchmarksByType,
    fetchBenchmarks,
    reset,
  }
})
