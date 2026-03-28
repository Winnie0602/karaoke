<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import type { SongData } from '~/types/song'
import { I18N_TO_DB } from '~/types/lang'
const { locale } = useI18n()

const { show } = useToast()

const store = usePlayerStore()

const { currentSong } = defineProps<{
  currentSong: SongData
}>()

const emit = defineEmits<{
  (e: 'update', testIds: string[]): void
}>()

const testIds = ref<string[]>([])

const setTestlyric = (nanoid: string, close: () => void) => {
  // 已經選完了->return
  if (testIds.value.length >= 8) {
    show($t('up_to_5_words'), 2000)

    return
  }

  close()

  testIds.value.push(nanoid)

  emit('update', testIds.value)
}

const isSelected = (id: string) => {
  return testIds.value.includes(id)
}

const reset = (id: string, close: () => void) => {
  testIds.value = testIds.value.filter((i) => i !== id)
  close()
}
</script>

<template>
  <div class="h-full w-full md:h-[calc(100%-40px)] md:flex-row">
    <div class="mt-1 flex-[3] space-y-4 bg-white md:space-y-6 md:px-6 md:py-6">
      <Disclosure
        v-for="lyric in currentSong?.lyrics"
        :key="lyric.nanoid"
        as="div"
      >
        <div
          class="group relative flex flex-col justify-center px-4 py-2 text-sm transition-all md:flex-row md:items-center md:justify-between md:px-3 md:py-3 md:text-base"
          :class="{
            'bg-[#F9595F]/10': isSelected(lyric.nanoid),
          }"
        >
          <div class="flex w-full flex-col">
            <DisclosureButton
              class="flex flex-col text-left focus:outline-none"
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
                {{ lyric[I18N_TO_DB[locale]] }}
              </span>
            </DisclosureButton>

            <transition
              enter-active-class="transition-[max-height,opacity] duration-300 ease-out overflow-hidden"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-[200px] opacity-100"
              leave-active-class="transition-[max-height,opacity] duration-200 ease-in overflow-hidden"
              leave-from-class="max-h-[200px] opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <DisclosurePanel v-slot="{ close }" class="mt-3 flex gap-2 pb-2">
                <button
                  class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#F9595F] bg-[#F9595F]/90 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#e8484e] md:flex-none md:rounded-md md:px-4 md:text-sm"
                  @click="store.playSegmentRequest(lyric.start, lyric.end)"
                >
                  <i class="fa-solid fa-play"></i>
                  <span>試聽</span>
                </button>

                <button
                  v-if="testIds.includes(lyric.nanoid)"
                  class="flex flex-1 cursor-pointer items-center justify-center rounded-full border border-[#F9595F] bg-white px-2 py-1.5 text-xs font-bold text-[#F9595F] transition-all hover:bg-[#F9595F]/5 md:flex-none md:rounded-md md:px-4 md:text-sm"
                  @click="reset(lyric.nanoid, close)"
                >
                  <span>{{ $t('reset') }}</span>
                </button>
                <button
                  v-else
                  class="flex flex-1 cursor-pointer items-center justify-center rounded-full border border-[#F9595F] bg-white px-2 py-1.5 text-xs font-bold text-[#F9595F] transition-all hover:bg-[#F9595F]/5 md:flex-none md:rounded-md md:px-4 md:text-sm"
                  @click="setTestlyric(lyric.nanoid, close)"
                >
                  <span>選擇此歌詞</span>
                </button>
              </DisclosurePanel>
            </transition>
          </div>
        </div>
      </Disclosure>
    </div>
  </div>
</template>
