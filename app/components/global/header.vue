<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <nav class="bg-black text-white h-14 flex items-center px-4 relative z-50">
      <!-- Logo -->
      <div class="text-lg font-semibold">
        カラオケ
      </div>

      <!-- 漢堡 / X -->
      <button
        class="ml-auto md:hidden relative w-6 h-6"
        aria-label="Toggle menu"
        @click="isOpen = !isOpen"
      >
        <span
          class="absolute left-0 top-1/2 w-6 h-0.5 bg-white transition-all duration-300"
          :class="isOpen ? 'rotate-45' : '-translate-y-2'"
        />
        <span
          class="absolute left-0 top-1/2 w-6 h-0.5 bg-white transition-all duration-300"
          :class="isOpen ? 'opacity-0' : 'opacity-100'"
        />
        <span
          class="absolute left-0 top-1/2 w-6 h-0.5 bg-white transition-all duration-300"
          :class="isOpen ? '-rotate-45' : 'translate-y-2'"
        />
      </button>

      <!-- 桌機選單 -->
      <div class="ml-auto hidden md:flex gap-6">
        <a href="#">Songs</a>
        <a href="#">About</a>
      </div>
    </nav>

  <!-- Mobile menu -->
  <MobileNavbar :open="isOpen" @close="isOpen = false" />
  </div>
</template>
