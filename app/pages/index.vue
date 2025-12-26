<script setup lang="ts">
const { data: songs } = await useFetch('/api/list/songs')
</script>

<template>
  <div class="w-full">
    <!-- 輪播區塊 -->
    <IndexTopCarousel :songs="songs" />
    <div
      class="mx-auto my-4 w-full space-y-8 px-4 md:my-8 md:max-w-[1280px] md:px-8"
    >
      <!-- 歌曲清單(語種Tab) -->
      <IndexSongsList :songs="songs" />
    </div>
  </div>
</template>
