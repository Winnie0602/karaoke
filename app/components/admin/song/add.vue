<script setup lang="ts">
import { nanoid } from 'nanoid'

// 表單資料狀態
const songForm = ref({
  title: '',
  videoId: '',
  language: 'ja', // 預設日文
  artist: '',
  rawLyrics: '', // 存放使用者貼入的文字 (日文：どこかで鐘(かね)が鳴(な)って)
})

const handleLyrics = () => {
  // 分行
  const lines = songForm.value.rawLyrics
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '')

  return lines.map((line) => {
    const obj = {
      nanoid: nanoid(),
      [songForm.value.language]: line,
    }

    return obj
  })
}
const { open } = useCheckConfirm()

// 提交處理
const handleSubmit = async () => {
  // 1. 簡易必填檢查
  const { title, videoId, artist, rawLyrics } = songForm.value
  if (!title || !videoId || !artist || !rawLyrics) {
    alert('所有欄位皆為必填！')
    return
  }

  const payload = {
    ...songForm.value,
    lyrics: handleLyrics(),
  }

  await $fetch('/api/song/add', {
    method: 'POST',
    body: { payload },
  })

  await open('新增成功', '')
}
</script>

<template>
  <div class="flex h-full flex-col rounded-3xl bg-white shadow-xl">
    <div
      class="flex items-center justify-between border-b border-gray-50 px-8 py-5"
    >
      <h2 class="text-xl font-bold text-gray-800">新增歌曲資料</h2>
      <span
        class="rounded-full bg-pink-50 px-3 py-1 text-sm font-bold text-[#F9595F]"
      >
        均為必填
      </span>
    </div>

    <div class="no-scrollbar flex-1 overflow-y-auto p-6">
      <div class="mx-auto max-w-3xl space-y-6">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div class="space-y-2">
            <label
              class="ml-1 text-sm font-bold tracking-wider text-[#A66B6B] uppercase"
            >
              YouTube Video ID *
            </label>
            <input
              v-model="songForm.videoId"
              type="text"
              class="w-full rounded-xl bg-[#FFF9F9] px-4 py-3 text-gray-700 ring-2 ring-red-300/50 outline-none"
              placeholder="請輸入YT影片ID"
            />
          </div>
          <div class="space-y-2">
            <label
              class="ml-1 text-sm font-bold tracking-wider text-[#A66B6B] uppercase"
            >
              Song Title *
            </label>
            <input
              v-model="songForm.title"
              type="text"
              class="w-full rounded-xl bg-[#FFF9F9] px-4 py-3 text-gray-700 ring-2 ring-red-300/50 outline-none"
              placeholder="輸入歌曲名稱"
            />
          </div>

          <div class="space-y-2">
            <label
              class="ml-1 text-sm font-bold tracking-wider text-[#A66B6B] uppercase"
            >
              Artist *
            </label>
            <input
              v-model="songForm.artist"
              type="text"
              class="w-full rounded-xl bg-[#FFF9F9] px-4 py-3 text-gray-700 ring-2 ring-red-300/50 outline-none"
              placeholder="輸入歌手名稱"
            />
          </div>

          <div class="space-y-2">
            <label
              class="ml-1 text-sm font-bold tracking-wider text-[#A66B6B] uppercase"
            >
              Language *
            </label>
            <select
              v-model="songForm.language"
              class="w-full appearance-none rounded-xl bg-[#FFF9F9] px-4 py-3 text-gray-700 ring-2 ring-red-300/50 outline-none"
            >
              <option value="ja">日本語 (JA)</option>
              <option value="en">English (EN)</option>
              <option value="zh">中文 (ZH)</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <div class="ml-1 flex items-center justify-between">
            <label
              class="text-sm font-bold tracking-wider text-[#A66B6B] uppercase"
            >
              Lyrics Content *
            </label>
            <span class="text-sm text-gray-500">需使用Enter手動斷行</span>
          </div>
          <textarea
            v-model="songForm.rawLyrics"
            rows="8"
            class="no-scrollbar w-full rounded-2xl bg-[#FFF9F9] p-4 text-sm leading-relaxed text-gray-700 ring-2 ring-red-300/50 outline-none"
            placeholder="在此貼上整段歌詞...&#10;日文平假名格式：どこかで鐘(かね)が鳴(な)って"
          ></textarea>
        </div>

        <div class="pt-2">
          <button
            class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F9595F] py-4 font-bold text-white shadow-lg shadow-red-100 transition-all hover:brightness-110 active:scale-[0.98]"
            @click="handleSubmit"
          >
            <i class="fa-solid fa-cloud-arrow-up"></i>
            儲存並新增歌曲
          </button>
        </div>
      </div>
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
