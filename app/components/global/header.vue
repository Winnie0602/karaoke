<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div class="font-medium tracking-wide">
    <nav
      class="relative z-50 flex h-14 items-center border-b border-gray-200 bg-white px-4"
    >
      <!-- Logo -->
      <div class="text-lg font-semibold tracking-wide text-gray-900">
        カラオケ 〜 歌を歌お-
        <span class="ml-1 text-[#F9595F]">♪</span>
      </div>

      <!-- 漢堡 / X -->
      <button
        class="relative ml-auto h-6 w-6 md:hidden"
        aria-label="Toggle menu"
        @click="isOpen = !isOpen"
      >
        <span
          class="absolute left-0 top-1/2 h-0.5 w-6 bg-gray-800 transition-all duration-300"
          :class="isOpen ? 'rotate-45' : '-translate-y-2'"
        />
        <span
          class="absolute left-0 top-1/2 h-0.5 w-6 bg-gray-800 transition-all duration-300"
          :class="isOpen ? 'opacity-0' : 'opacity-100'"
        />
        <span
          class="absolute left-0 top-1/2 h-0.5 w-6 bg-gray-800 transition-all duration-300"
          :class="isOpen ? '-rotate-45' : 'translate-y-2'"
        />
      </button>

      <!-- 桌機選單 -->
      <div class="ml-auto hidden gap-6 md:flex">
        <NuxtLink
          to="/"
          class="relative rounded px-2 py-1 text-gray-700 transition hover:bg-[#F9595F]/10 hover:text-[#F9595F]"
        >
          Home
          <span
            class="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#F9595F] transition-all group-hover:w-full"
          />
        </NuxtLink>
        <a
          href="#"
          class="relative rounded px-2 py-1 text-gray-700 transition hover:bg-[#F9595F]/10 hover:text-[#F9595F]"
        >
          About
        </a>
      </div>
    </nav>

    <!-- Mobile menu -->
    <MobileNavbar :open="isOpen" @close="isOpen = false" />
  </div>
</template>
