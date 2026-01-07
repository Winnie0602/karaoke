<script setup lang="ts">
import type { SongsList } from '~/types/song'
import type { Tab, LangCode } from '~/types/lang'

const showType = ref<'list' | 'grid'>('list')

const languageMap: Record<Tab, LangCode> = {
  日本語: 'ja',
  臺語: 'tw',
  English: 'en',
  한국어: 'kr',
  廣東話: 'hk',
}
const { songs } = defineProps<{ songs: SongsList[] }>()

const tabs = Object.keys(languageMap) as Tab[]
const nowTab = ref<Tab>('日本語')

const tabSongs = computed(() => {
  const lang = languageMap[nowTab.value]
  return songs.filter((song) => song.language === lang)
})
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

    <div class="mt-2 flex w-full justify-end px-3">
      <div class="grid grid-cols-2 rounded-xl border-[4px] border-[#FFE5E5]">
        <div
          class="cursor-pointer px-2"
          :class="{ 'bg-[#FFE5E5]': showType === 'list' }"
          @click="showType = 'list'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-[#F9595F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>

        <div
          class="cursor-pointer px-2"
          :class="{ 'bg-[#FFE5E5]': showType === 'grid' }"
          @click="showType = 'grid'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-[#F9595F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Song List -->
    <div class="mt-3 space-y-3">
      <div
        v-for="song in tabSongs"
        :key="song.id"
        class="group flex items-center justify-between rounded-xl border border-[#F9595F]/20 bg-white px-4 py-3 shadow-sm transition hover:bg-[#FFF3F3]"
      >
        <!-- Left -->
        <div class="flex items-center space-x-4">
          <!-- Thumbnail -->
          <NuxtLink
            :to="`/song/${song.id}`"
            class="relative h-[56px] w-[56px] overflow-hidden rounded-lg"
          >
            <img
              :src="`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`"
              alt="thumbnail"
              class="h-full w-full object-cover"
            />

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
          </NuxtLink>

          <!-- Song Info -->
          <NuxtLink
            :to="`/song/${song.id}`"
            class="flex cursor-pointer flex-col"
          >
            <span class="text-lg font-medium text-[#5A3E3E]">
              {{ song.title }}
            </span>
            <span class="mt-1 text-sm text-[#A66B6B]">{{ song.artist }}</span>
          </NuxtLink>
        </div>

        <!-- Right -->
        <a
          :href="`https://www.youtube.com/watch?v=${song.id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center rounded-full bg-[#FFE5E5] px-3 py-1 text-xs"
        >
          <i class="fa-brands fa-youtube text-lg text-[#F9595F]"></i>
        </a>
      </div>
    </div>
  </div>
</template>
