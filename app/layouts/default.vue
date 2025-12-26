<template>
  <div>
    <Header />

    <SongPlayer>
      <!-- 頁面內容插進 SongPlayer 中間 -->
      <div class="mb-[75px] flex flex-col items-center">
        <slot />
      </div>
    </SongPlayer>
  </div>
</template>
