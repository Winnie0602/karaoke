<template>
  <div class="fixed bottom-0 h-[75px] w-full bg-[#ffe5e5]">
    <div class="flex h-full w-full items-center justify-center py-2">
      <div
        class="flex h-full w-full max-w-[1024px] items-center justify-between rounded-xl bg-gradient-to-b from-white to-[#fff0f0] px-3 shadow-lg"
      >
        <!-- 播放鍵 -->
        <button
          class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-200 bg-white shadow-md transition-transform duration-150 hover:scale-110 active:scale-95"
        >
          <i class="fa-solid fa-play text-lg text-[#F9595F]"></i>
        </button>

        <!-- 進度條 -->
        <input
          type="range"
          min="0"
          :max="100"
          :value="40"
          class="time-bar mx-4 w-[calc(100%-150px)] cursor-pointer appearance-none rounded-full"
          :style="{ '--progress': `${40}%` }"
        />

        <!-- 右側 icon -->
        <div class="flex items-center space-x-3">
          <i
            class="fa-solid fa-volume-low text-xl text-[#F9595F] transition-transform duration-150 hover:rotate-[10deg] hover:scale-125"
          ></i>
          <i
            class="fa-solid fa-gauge text-xl text-[#F9595F] transition-transform duration-150 hover:rotate-[-10deg] hover:scale-125"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.time-bar {
  height: 6px;
  background: linear-gradient(
    to right,
    #f9595f 0%,
    #f9595f var(--progress),
    #ffe5e5 var(--progress),
    #ffe5e5 100%
  );
  box-shadow: inset 0 1px 3px rgba(249, 89, 95, 0.15);
  border-radius: 9999px;
}

.time-bar::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
}

.time-bar::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 3px solid #f9595f;
  border-radius: 50%;
  margin-top: -6px;
  box-shadow: 0 3px 6px rgba(249, 89, 95, 0.4);
  transition: transform 0.15s ease;
}

.time-bar::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.time-bar:hover {
  height: 8px;
}
</style>
