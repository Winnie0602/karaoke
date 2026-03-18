<script setup lang="ts">
import type { SongsList } from '~/types/song'
import type { Tab } from '~/types/lang'
import { languageMapCode } from '~/types/lang'

const showType = ref<'list' | 'grid'>('list')

const { songs } = defineProps<{ songs: SongsList[] }>()

const tabs = Object.keys(languageMapCode) as Tab[]
const nowTab = ref<Tab>('日本語')

const tabSongs = computed(() => {
  const lang = languageMapCode[nowTab.value]
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

    <div class="mt-2 flex w-full justify-end md:px-3">
      <div class="grid grid-cols-2 rounded-xl border-[4px] border-[#FFE5E5]">
        <div
          class="cursor-pointer px-1 md:px-2"
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
          class="cursor-pointer px-1 md:px-2"
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
    <div class="mt-3">
      <!-- 條列式 -->
      <div v-if="showType === 'list'" class="space-y-3">
        <div
          v-for="song in tabSongs"
          :key="song.id"
          class="group flex items-center justify-between rounded-xl border border-[#F9595F]/20 bg-white px-2 py-3 shadow-sm transition hover:bg-[#FFF3F3] md:px-4"
        >
          <!-- Left -->
          <div class="flex items-center space-x-2 md:space-x-4">
            <!-- Thumbnail -->
            <NuxtLink
              :to="`/song/${song.id}`"
              class="relative h-[56px] w-[56px] flex-none overflow-hidden rounded-lg"
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
              <span
                class="line-clamp-1 text-sm font-medium text-[#5A3E3E] md:text-lg"
              >
                {{ song.title }}
              </span>
              <span class="mt-1 text-xs text-[#A66B6B] md:text-sm">
                {{ song.artist }}
              </span>
            </NuxtLink>
          </div>

          <!-- Right -->
          <div class="flex items-center space-x-1.5">
            <NuxtLink
              :to="`/song/test/${song.id}`"
              class="flex h-[28px] items-center justify-center rounded-full border border-[#F9595F]/10 bg-[#FFE5E5] px-1.5 text-[10px] font-bold text-[#F9595F] shadow-sm transition hover:bg-[#F9595F] hover:text-white md:px-2.5"
            >
              TEST!
            </NuxtLink>

            <a
              :href="`https://www.youtube.com/watch?v=${song.id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-[28px] items-center justify-center rounded-full bg-[#FFE5E5] px-2 shadow-sm transition hover:bg-[#F9595F]/10 md:px-3"
            >
              <i class="fa-brands fa-youtube text-lg text-[#F9595F]"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- 卡片式 -->
      <div
        v-else
        class="grid grid-cols-2 gap-4 px-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        <div
          v-for="song in tabSongs"
          :key="song.id"
          class="group flex flex-col overflow-hidden rounded-2xl border border-[#F9595F]/10 bg-white shadow-sm transition hover:shadow-md"
        >
          <NuxtLink
            :to="`/song/${song.id}`"
            class="relative aspect-video w-full overflow-hidden"
          >
            <img
              :src="`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#F9595F] shadow-lg"
              >
                ▶
              </div>
            </div>
          </NuxtLink>

          <div class="flex flex-1 flex-col p-3">
            <NuxtLink
              :to="`/song/${song.id}`"
              class="line-clamp-1 text-sm font-medium text-[#5A3E3E] group-hover:text-[#F9595F] md:text-lg"
            >
              {{ song.title }}
            </NuxtLink>
            <span class="mt-1 text-xs text-[#A66B6B] md:text-sm">
              {{ song.artist }}
            </span>

            <div class="mt-3 flex items-center border-t border-gray-50 pt-3">
              <NuxtLink
                :to="`/song/test/${song.id}`"
                class="flex h-6 items-center justify-center rounded-full border border-[#F9595F]/10 bg-[#FFE5E5] px-1.5 text-[10px] font-bold text-[#F9595F] shadow-sm transition hover:bg-[#F9595F] hover:text-white md:px-2.5"
              >
                TEST!
              </NuxtLink>

              <a
                :href="`https://www.youtube.com/watch?v=${song.id}`"
                target="_blank"
                class="ml-auto text-[#F9595F] transition hover:scale-110"
              >
                <i class="fa-brands fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
