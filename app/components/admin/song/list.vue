<script setup lang="ts">
// import type { SongsList } from '~/types/song'
import Pagination from '~/components/global/Pagination.vue'
import type { LangCode } from '~/types/lang'

const { open } = useCheckConfirm()

const page = ref(1)

const selectLang = ref<LangCode | 'all'>('all')

const { data, refresh } = await useFetch('/api/list/songs', {
  query: {
    language: selectLang,
    page,
  },
})

const deleteSong = async (id: string) => {
  const check = await open('確認刪除?', '將會從資料庫刪除該歌曲資料。', 'ask')

  if (!check) return

  // 打api
}

const isEditModalOpen = ref(false)

const editingId = ref<string | null>('')

const handleEditModal = (action: 'open' | 'close', songId?: string) => {
  if (action === 'open' && songId) {
    isEditModalOpen.value = true
    editingId.value = songId
  } else {
    isEditModalOpen.value = false
    editingId.value = null
  }
}

const updatePage = (newPage: number) => {
  page.value = newPage

  refresh()
}
</script>

<template>
  <div class="flex h-full flex-col rounded-3xl bg-white shadow-xl">
    <div
      class="flex items-center justify-between border-b border-gray-50 px-8 pt-5"
    >
      <h2 class="text-lg font-medium text-gray-800 md:text-xl md:font-bold">
        歌曲管理
      </h2>
      <span
        class="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#F9595F]"
      >
        {{ data?.songs?.length || 0 }} Items
      </span>
    </div>

    <div class="no-scrollbar flex-1 overflow-y-auto px-3 md:px-6">
      <div class="flex justify-center px-4 pt-3">
        <Pagination
          :total="data?.total || 0"
          :page="page"
          :total-pages="data?.totalPages || 0"
          @update-page="({ newPage }) => updatePage(newPage)"
        />
      </div>
      <div v-if="data?.songs" class="grid md:gap-3">
        <div
          v-for="song in data.songs"
          :key="song.id"
          class="flex items-center justify-between border-b-[1px] border-gray-300 bg-white px-1 py-3 shadow-sm md:px-4"
        >
          <div class="flex items-center gap-3 md:gap-4">
            <div
              class="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-xl bg-[#FFF9F9] text-[#F9595F] md:h-12 md:w-12"
            >
              <img
                v-if="song.id"
                :src="`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`"
                alt="thumbnail"
                class="h-full w-full object-cover"
              />

              <i v-else class="fa-solid fa-music"></i>
            </div>
            <div class="min-w-0">
              <div
                class="line-clamp-1 truncate text-sm font-medium text-gray-800 md:text-base"
              >
                {{ song.title }}
              </div>
              <div class="line-clamp-1 truncate text-xs text-gray-400">
                {{ song.artist }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="h-6 w-6 rounded-lg bg-gray-50 text-gray-400 transition hover:bg-[#F9595F] hover:text-white md:h-9 md:w-9"
              @click="handleEditModal('open', song.id)"
            >
              <i class="fa-solid fa-pen-to-square text-sm"></i>
            </button>
            <button
              class="h-6 w-6 rounded-lg bg-gray-50 text-gray-400 transition hover:bg-red-500 hover:text-white md:h-9 md:w-9"
              @click="deleteSong(song.id)"
            >
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AdminSongEdit
      :open="isEditModalOpen"
      :editing-id="editingId"
      @close="handleEditModal('close')"
    />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
