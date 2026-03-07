<script setup lang="ts">

definePageMeta({
  layout: 'no-player', // 確保使用了你提供的這個 Layout
})

const currentTab = ref<'songList' | 'addSong'>('songList')



</script>

<template>
  <div class="flex h-[calc(100vh-56px)] w-full overflow-hidden p-4 lg:p-6">
    <div
      class="mx-auto flex w-full max-w-[1280px] flex-col gap-4 md:flex-row lg:gap-6"
    >
      <aside class="w-full flex-none md:w-1/5">
        <div class="flex h-full flex-col rounded-3xl bg-white p-5 shadow-xl">
          <div
            class="mb-6 hidden px-2 text-xs font-black tracking-[0.2em] text-[#F9595F] md:block"
          >
            ADMIN PANEL
          </div>

          <nav class="flex flex-row gap-2 md:flex-col">
            <button
              :class="[
                currentTab === 'songList'
                  ? 'bg-[#F9595F] text-white shadow-md shadow-red-100'
                  : 'text-[#A66B6B] hover:bg-[#FFE5E5]',
              ]"
              class="flex flex-1 items-center justify-center gap-3 rounded-2xl py-3 font-bold transition-all md:justify-start md:px-5"
              @click="currentTab = 'songList'"
            >
              <i class="fa-solid fa-layer-group text-sm"></i>
              <span class="text-sm md:text-base">歌曲列表</span>
            </button>

            <button
              :class="[
                currentTab === 'addSong'
                  ? 'bg-[#F9595F] text-white shadow-md shadow-red-100'
                  : 'text-[#A66B6B] hover:bg-[#FFE5E5]',
              ]"
              class="flex flex-1 items-center justify-center gap-3 rounded-2xl py-3 font-bold transition-all md:justify-start md:px-5"
              @click="currentTab = 'addSong'"
            >
              <i class="fa-solid fa-plus-circle text-sm"></i>
              <span class="text-sm md:text-base">新增歌曲</span>
            </button>
          </nav>

          <div class="mt-auto hidden border-t border-gray-50 pt-4 md:block">
            <NuxtLink
              to="/"
              class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-400 hover:text-[#F9595F]"
            >
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              登出
            </NuxtLink>
          </div>
        </div>
      </aside>

      <main class="min-h-0 flex-1">
        <AdminSongList v-if="currentTab === 'songList'" />
        <AdminSongAdd v-if="currentTab === 'addSong'" />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 針對右側捲動區隱藏捲軸 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
