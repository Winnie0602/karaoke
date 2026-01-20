<script setup lang="ts">
const { step } = defineProps<{ step: 1 | 2 | 3 | 4 }>()

const steps = [1, 2, 3, 4] as const

const stepConfig = {
  1: {
    title: '選取開始歌詞',
  },
  2: {
    title: '選取結束歌詞',
  },
  3: {
    title: '選擇題目型態',
  },
  4: {
    title: '調整播放速度',
  },
} as const
</script>

<template>
  <div class="mx-auto w-full max-w-3xl">
    <div class="flex items-center justify-between gap-4 text-sm">
      <template v-for="(s, index) in steps" :key="s">
        <!-- step + title -->
        <div class="flex items-center gap-2 whitespace-nowrap">
          <!-- 數字 -->
          <div
            class="relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150"
            :class="
              s <= step
                ? 'bg-[#F9595F] text-white'
                : 'bg-[#FFE5E5] text-[#A66B6B]'
            "
          >
            {{ s }}

            <!-- 光圈 -->
            <span
              v-if="s === step"
              class="absolute inset-0 rounded-full shadow-[0_0_0_6px_rgba(249,89,95,0.18)]"
            />
          </div>

          <!-- 標題 -->
          <span
            class="font-medium transition-colors duration-150"
            :class="s === step ? 'text-[#7A3A3A]' : 'text-[#B58C8C]'"
          >
            {{ stepConfig[s].title }}
          </span>
        </div>

        <!-- 分隔線 -->
        <span v-if="index !== 3" class="mx-2 select-none text-[#E4BABA]">
          —
        </span>
      </template>
    </div>
  </div>
</template>
