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

const editMode = ref<'' | 'info' | 'time' | 'translation'>('')

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

              <div
                v-if="songData?.id"
                class="flex flex-col items-center space-y-5 overflow-hidden py-5"
              >
                <div class="mb-2">
                  <div class="mb-2 w-full max-w-[640px] text-center">
                    <h2
                      class="text-2xl leading-tight font-black text-[#F9595F]"
                    >
                      {{ songData.title || '未知曲名' }}
                    </h2>
                    <p
                      class="mt-1 text-lg font-medium text-[#7A3A3A] opacity-80"
                    >
                      {{ songData.artist || '未知歌手' }}
                    </p>
                  </div>

                  <img
                    :src="`https://img.youtube.com/vi/${songData.id}/mqdefault.jpg`"
                    alt="thumbnail"
                    class="w-[240px] rounded-lg border-4 border-[#FFE5E5] object-cover shadow-sm"
                  />
                </div>

                <button
                  class="w-full max-w-[640px] rounded-xl bg-[#FFE5E5] py-3 font-black text-[#F9595F] active:scale-95"
                >
                  編輯歌曲資訊
                  <div class="mt-1 text-xs text-[#7A3A3A]">
                    編輯歌曲ID、標題、歌手、語言
                  </div>
                </button>
                <button
                  class="w-full max-w-[640px] rounded-xl bg-[#FFE5E5] py-3 font-black text-[#F9595F] active:scale-95"
                >
                  編輯歌曲時間軸
                  <div class="mt-1 text-xs text-[#7A3A3A]">
                    手動對齊歌曲時間
                  </div>
                </button>
                <button
                  class="w-full max-w-[640px] rounded-xl bg-[#FFE5E5] py-3 font-black text-[#F9595F] active:scale-95"
                >
                  編輯歌曲歌詞翻譯
                  <div class="mt-1 text-xs text-[#7A3A3A]">
                    編輯歌詞各國語言翻譯
                  </div>
                </button>
                <button
                  class="w-full max-w-[640px] rounded-xl bg-[#FFE5E5] py-3 font-black text-[#F9595F] active:scale-95"
                >
                  刪除該歌曲
                  <div class="mt-1 text-xs text-[#7A3A3A]">
                    從資料庫刪除該歌曲
                  </div>
                </button>
                <a
                  :href="`https://www.youtube.com/watch?v=${songData.id}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex w-full max-w-[640px] flex-col items-center rounded-xl bg-[#FFE5E5] py-3 font-black text-[#F9595F] active:scale-95"
                >
                  <div class="flex w-full items-center justify-center">
                    前往YouTube
                    <i
                      class="fa-brands fa-youtube ml-2 text-lg text-[#F9595F]"
                    ></i>
                  </div>
                  <div class="mt-1 text-xs text-[#7A3A3A]">
                    將以新視窗打開外站
                  </div>
                </a>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
