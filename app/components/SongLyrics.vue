<script setup lang="ts">
import type { LyricData } from '~/types/song'

const { lyrics } = defineProps<{ lyrics: LyricData[] }>()
</script>

<template>
  <div class="space-y-3">
    <p
      v-for="lyric in lyrics"
      :key="lyric.start"
      class="flex flex-col rounded-md border-[1px] border-black py-2"
    >
      <span>
        <span
          v-for="(word, index) in lyric.ja"
          :key="index"
          class="mr-1 text-lg"
        >
          <!-- 有假名 -->
          <ruby v-if="word.reading">
            {{ word.surface }}
            <rt class="text-xs text-gray-600">
              {{ word.reading }}
            </rt>
          </ruby>

          <!-- 沒假名 -->
          <span v-else>
            {{ word.surface }}
          </span>
        </span>
      </span>

      <span class="text-gray-700">{{ lyric.zh }}</span>
    </p>
  </div>
</template>
