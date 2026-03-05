<script setup lang="ts">
const { open } = useCheckConfirm()

const deleteSong = async (id: number) => {
  const check = await open('確認刪除?', '將會從資料庫刪除該歌曲資料。')

  if (!check) return

  console.log('deleted')
}
</script>

<template>
  <div class="flex h-full flex-col rounded-3xl bg-white shadow-xl">
    <div
      class="flex items-center justify-between border-b border-gray-50 px-8 py-5"
    >
      <h2 class="text-xl font-bold text-gray-800">歌曲管理</h2>
      <span
        class="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#F9595F]"
      >
        10 Items
      </span>
    </div>

    <div class="no-scrollbar flex-1 overflow-y-auto p-6">
      <div class="grid gap-3">
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-between border-b-[1px] border-gray-300 bg-white p-4 shadow-sm"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#FFF9F9] text-[#F9595F]"
            >
              <i class="fa-solid fa-music"></i>
            </div>
            <div class="min-w-0">
              <div class="truncate font-bold text-gray-800">
                titletitletitletitle
              </div>
              <div class="truncate text-xs text-gray-400">
                artistartistartistartist
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="h-9 w-9 rounded-lg bg-gray-50 text-gray-400 transition hover:bg-[#F9595F] hover:text-white"
            >
              <i class="fa-solid fa-pen-to-square text-sm"></i>
            </button>
            <button
              class="h-9 w-9 rounded-lg bg-gray-50 text-gray-400 transition hover:bg-red-500 hover:text-white"
              @click="deleteSong(123)"
            >
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- <div
        class="flex h-full flex-col items-center justify-center text-gray-300"
      >
        <i class="fa-solid fa-keyboard mb-4 text-5xl opacity-20"></i>
        <p class="font-medium">表單組件開發中...</p>
      </div> -->
    </div>
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
