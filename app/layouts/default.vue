<template>
  <div>
    <Header />

    <SongPlayer>
      <!-- 頁面內容插進 SongPlayer 中間 -->
      <div class="flex flex-col items-center">
        <slot />
      </div>
    </SongPlayer>
  </div>
</template>
