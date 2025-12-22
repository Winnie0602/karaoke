<template>
  <div>
    <Header />

    <SongPlayer>
      <!-- 頁面內容插進 SongPlayer 中間 -->
      <div class="flex justify-center px-4 py-4 md:px-8">
        <div class="w-full max-w-[1280px]">
          <slot />
        </div>
      </div>
    </SongPlayer>
  </div>
</template>
