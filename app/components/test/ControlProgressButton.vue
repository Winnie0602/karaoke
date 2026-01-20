<script setup lang="ts">
defineProps<{
  canPrev?: boolean
  canNext?: boolean
  nextLabel?: string
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="fixed inset-x-0 bottom-6 z-50 flex justify-center">
    <div class="flex gap-3">
      <!-- 上一步 -->
      <button
        :disabled="!canPrev"
        class="h-10 min-w-[96px] rounded-lg border text-sm font-medium transition-colors duration-150"
        :class="
          canPrev
            ? 'border-[#F9595F]/40 text-[#A66B6B] hover:bg-[#FFECEC]'
            : 'cursor-not-allowed border-[#E8CFCF] text-[#C9A3A3]'
        "
        @click="emit('prev')"
      >
        上一步
      </button>

      <!-- 下一步 -->
      <button
        :disabled="!canNext"
        class="h-10 min-w-[96px] rounded-lg text-sm font-semibold transition-colors duration-150"
        :class="
          canNext
            ? 'bg-[#F9595F] text-white hover:bg-[#E94A50]'
            : 'cursor-not-allowed bg-[#FFD6D6] text-[#B48C8C]'
        "
        @click="emit('next')"
      >
        {{ nextLabel ?? '下一步' }}
      </button>
    </div>
  </div>
</template>
