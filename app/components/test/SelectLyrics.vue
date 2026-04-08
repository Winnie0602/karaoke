<script setup lang="ts">
import type { SongData } from '~/types/song'
import type { LangCode } from '~/types/lang'
import { I18N_TO_DB } from '~/types/lang'
const { locale } = useI18n()

const { show } = useToast()

const store = usePlayerStore()

const { currentSong, translationGameLang } = defineProps<{
  currentSong: SongData
  translationGameLang: LangCode | null
  selectedQuizType: 'partial' | 'allBlank' | 'translation'
}>()

const emit = defineEmits<{
  (e: 'update', testIds: string[]): void
}>()

const testIds = ref<string[]>([])
const openDisclosureId = ref<string | null>(null)

const setTestlyric = (nanoid: string) => {
  // 已經選完了->return
  if (testIds.value.length >= 8) {
    show($t('up_to_5_words'), 2000)

    return
  }

  openDisclosureId.value = null
  testIds.value.push(nanoid)

  emit('update', testIds.value)
}

const isSelected = (id: string) => {
  return testIds.value.includes(id)
}

const isOpen = (id: string) => {
  return openDisclosureId.value === id
}

const reset = (id: string) => {
  testIds.value = testIds.value.filter((i) => i !== id)

  if (openDisclosureId.value === id) {
    openDisclosureId.value = null
  }
}

const toggleDisclosure = (id: string) => {
  openDisclosureId.value = openDisclosureId.value === id ? null : id
}
</script>

<template>
  <div class="h-full w-full md:h-[calc(100%-40px)] md:flex-row">
    <div class="mt-1 flex-[3] space-y-4 bg-white md:space-y-6 md:px-6 md:py-6">
      <div v-for="lyric in currentSong?.lyrics" :key="lyric.nanoid">
        <div
          class="group relative flex flex-col justify-center px-4 py-2 pr-10 text-sm transition-all md:flex-row md:items-center md:justify-between md:px-3 md:py-3 md:pr-10 md:text-base"
          :class="{
            'bg-[#F9595F]/10': isSelected(lyric.nanoid),
          }"
        >
          <i
            v-if="isSelected(lyric.nanoid)"
            class="fa-solid fa-circle-check absolute right-3 top-1/2 -translate-y-1/2 text-lg text-[#22C55E]"
          />

          <div class="flex w-full flex-col">
            <button
              type="button"
              class="flex flex-col text-left focus:outline-none"
              @click="toggleDisclosure(lyric.nanoid)"
            >
              <div
                v-if="currentSong.language === 'ja'"
                class="text-[#8F5F5F]"
                v-html="lyric.ruby"
              />

              <div v-else class="flex flex-wrap text-[#8F5F5F]">
                {{ lyric[currentSong.language] }}
              </div>

              <span class="mt-1 text-[12px] text-gray-500 md:text-[13px]">
                {{
                  selectedQuizType === 'translation'
                    ? lyric[translationGameLang ?? I18N_TO_DB[locale]]
                    : lyric[I18N_TO_DB[locale]]
                }}
              </span>
            </button>

            <transition
              enter-active-class="transition-[max-height,opacity] duration-300 ease-out overflow-hidden"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-[200px] opacity-100"
              leave-active-class="transition-[max-height,opacity] duration-200 ease-in overflow-hidden"
              leave-from-class="max-h-[200px] opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-if="isOpen(lyric.nanoid)" class="mt-1 flex gap-2">
                <button
                  class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#F9595F] bg-[#F9595F]/90 px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-[#e8484e] md:flex-none md:rounded-md md:px-4 md:text-sm"
                  @click="store.playSegmentRequest(lyric.start, lyric.end)"
                >
                  <i class="fa-solid fa-play"></i>
                  <span>{{ $t('preview') }}</span>
                </button>

                <button
                  v-if="testIds.includes(lyric.nanoid)"
                  class="flex flex-1 cursor-pointer items-center justify-center rounded-full border border-[#F9595F] bg-white px-2 py-1.5 text-xs font-medium text-[#F9595F] transition-all hover:bg-[#F9595F]/5 md:flex-none md:rounded-md md:px-4 md:text-sm"
                  @click="reset(lyric.nanoid)"
                >
                  <span>{{ $t('reset') }}</span>
                </button>
                <button
                  v-else
                  class="flex flex-1 cursor-pointer items-center justify-center rounded-full border border-[#F9595F] bg-white px-2 py-1.5 text-xs font-medium text-[#F9595F] transition-all hover:bg-[#F9595F]/5 md:flex-none md:rounded-md md:px-4 md:text-sm"
                  @click="setTestlyric(lyric.nanoid)"
                >
                  <span>{{ $t('select_this_lyric') }}</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
