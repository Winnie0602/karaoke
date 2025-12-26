<script setup lang="ts">
import type { SongsList } from '~/types/song'

type Tab = '中文' | '한국어' | '日本語' | '臺語' | 'English' | '廣東話'

const { songs } = defineProps<{ songs: SongsList[] }>()

const tabs: Tab[] = ['中文', '한국어', '日本語', '臺語', 'English', '廣東話']
const nowTab = ref<Tab>('中文')
</script>

<template>
  <div class="w-full">
    <!-- Tab -->
    <div
      class="flex flex-col justify-between border-b-2 border-[#F9595F]/40 md:flex-row md:items-end"
    >
      <!-- Title -->
      <div
        class="mb-2 text-3xl font-semibold tracking-wide text-[#A66B6B] md:mb-0 md:text-[36px]"
      >
        Song List
      </div>

      <!-- Language Tabs -->
      <div class="md:text-md flex items-end space-x-1 text-[13px]">
        <div v-for="tab in tabs" :key="tab">
          <!-- Active -->
          <div
            v-if="nowTab === tab"
            class="relative -mb-[2px] rounded-t-lg border-2 border-b-0 border-[#F9595F] bg-white px-2 py-2 font-medium text-[#F9595F] shadow-sm md:px-4"
          >
            {{ tab }}
          </div>

          <!-- Inactive -->
          <div
            v-else
            class="cursor-pointer rounded-t-lg px-2 py-2 text-[#A66B6B] transition-all duration-150 hover:bg-[#FFE5E5]/60 hover:text-[#F9595F] md:px-4"
            @click="nowTab = tab"
          >
            {{ tab }}
          </div>
        </div>
      </div>
    </div>

    <!-- Song List -->
    <div class="mt-6 space-y-3">
      <div
        v-for="song in songs"
        :key="song.id"
        class="group flex items-center justify-between rounded-xl border border-[#F9595F]/20 bg-white px-4 py-3 shadow-sm transition hover:bg-[#FFF3F3]"
      >
        <!-- Left -->
        <div class="flex items-center space-x-4">
          <!-- Thumbnail -->
          <div class="relative h-[56px] w-[56px] overflow-hidden rounded-lg">
            <!-- <img
              :src="song.thumbnail"
              alt="thumbnail"
              class="h-full w-full object-cover"
            /> -->

            <!-- Play Icon -->
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#F9595F]"
              >
                ▶
              </div>
            </div>
          </div>

          <!-- Song Info -->
          <div class="flex flex-col">
            <span class="text-lg font-medium text-[#5A3E3E]">
              {{ song.title }}
            </span>
            <span class="mt-1 text-sm text-[#A66B6B]">{{ song.artist }}</span>
          </div>
        </div>

        <!-- Right -->
        <div class="flex items-center space-x-4 text-sm text-[#A66B6B]">
          <span>3333</span>
          <span>4444</span>
          <span class="rounded-full bg-[#FFE5E5] px-3 py-1 text-xs">1111</span>
        </div>
      </div>
    </div>
  </div>
</template>
