<script setup lang="ts">
import type { SongData } from '~/types/song'

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const { open, editingId } = defineProps<{
  open: boolean
  editingId: string | null
}>()

const emit = defineEmits<{
  (e: 'close' | 'confirm'): void
}>()

function closeModal() {
  songData.value = null
  emit('close')
}

const songData = ref<SongData | null>()

const getSongData = async () => {
  songData.value = await $fetch<SongData | null>(`/api/song/${editingId}`)
}

watch(
  () => editingId,
  async () => {
    if (editingId) {
      await getSongData()
    }
  },
)
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-white" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 translate-y-4"
            enter-to="opacity-100 translate-y-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 translate-y-0"
            leave-to="opacity-0 translate-y-4"
          >
            <DialogPanel
              class="flex h-screen w-full transform flex-col bg-white p-6 text-left align-middle transition-all md:p-10"
            >
              <div
                class="flex items-center justify-between border-b border-[#FFE5E5] pb-4"
              >
                <DialogTitle
                  as="h3"
                  class="text-xl font-black text-[#7A3A3A] md:text-2xl"
                >
                  編輯歌曲資訊
                </DialogTitle>
                <button
                  class="text-[#A66B6B] hover:text-[#F9595F]"
                  @click="closeModal"
                >
                  <i class="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>

              <div class="flex flex-1 flex-col overflow-hidden">
                <div
                  class="mx-auto mt-4 aspect-video max-h-[20vh] shrink-0 overflow-hidden rounded-2xl bg-black"
                >
                  <iframe
                    v-if="songData?.id"
                    class="h-full w-full"
                    :src="`https://www.youtube.com/embed/${songData.id}`"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                  ></iframe>
                </div>

                <div class="mt-6 flex-1 overflow-y-auto pr-2">
                  <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="space-y-1">
                      <label class="text-xs font-black text-[#A66B6B]">
                        歌曲標題
                      </label>
                      <input
                        type="text"
                        class="w-full rounded-xl border-none bg-[#FFE5E5]/30 px-4 py-2 text-[#7A3A3A] focus:ring-2 focus:ring-[#F9595F]"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-black text-[#A66B6B]">
                        歌手
                      </label>
                      <input
                        type="text"
                        class="w-full rounded-xl border-none bg-[#FFE5E5]/30 px-4 py-2 text-[#7A3A3A] focus:ring-2 focus:ring-[#F9595F]"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-black text-[#A66B6B]">
                        影片 ID
                      </label>
                      <input
                        type="text"
                        class="w-full rounded-xl border-none bg-[#FFE5E5]/30 px-4 py-2 text-[#7A3A3A] focus:ring-2 focus:ring-[#F9595F]"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-black text-[#A66B6B]">
                        語言 (ja/en/ko)
                      </label>
                      <input
                        type="text"
                        class="w-full rounded-xl border-none bg-[#FFE5E5]/30 px-4 py-2 text-[#7A3A3A] focus:ring-2 focus:ring-[#F9595F]"
                      />
                    </div>
                  </section>

                  <div v-if="songData" class="mt-10 space-y-3">
                    <h4
                      class="flex items-center gap-2 font-black text-[#7A3A3A]"
                    >
                      <i class="fa-solid fa-lines-leaning"></i>
                      歌詞列表
                    </h4>

                    <div
                      v-for="(lyric, index) in songData.lyrics"
                      :key="index"
                      class="overflow-hidden rounded-2xl border border-[#FFE5E5] bg-white"
                    >
                      <button
                        class="flex w-full items-center justify-between bg-[#FFF9F9] px-4 py-3 text-left hover:bg-[#FFE5E5]/20"
                      >
                        <div class="flex items-center gap-3">
                          <span
                            class="rounded-full bg-[#FFE5E5] px-2 py-0.5 text-[10px] font-bold text-[#F9595F]"
                          >
                            {{ lyric.start }}s - {{ lyric.end }}s
                          </span>
                          <span
                            class="truncate text-sm font-bold text-[#7A3A3A]"
                          >
                            {{ lyric.ja }}
                          </span>
                        </div>
                        <i
                          class="fa-solid fa-chevron-down text-[#A66B6B] transition-transform"
                          :class="{ 'rotate-180': false }"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex gap-3 border-t border-[#FFE5E5] pt-6">
                  <button
                    class="flex-1 rounded-xl bg-[#F9595F] py-3 font-black text-white shadow-lg shadow-[#F9595F]/20 active:scale-95"
                    @click="emit('confirm')"
                  >
                    儲存變更
                  </button>
                  <button
                    class="flex-1 rounded-xl bg-[#FFE5E5] py-3 font-black text-[#F9595F] active:scale-95"
                    @click="closeModal"
                  >
                    取消
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
