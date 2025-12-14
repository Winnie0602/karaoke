<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <!-- 背景遮罩 -->
  <div
    class="fixed inset-0 bg-black/50 transition-opacity duration-300 z-40"
    :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    @click="emit('close')"
  />

  <!-- Drawer -->
  <aside
    class="fixed top-14 left-0 w-64 h-[calc(100vh-3.5rem)] bg-black text-white p-6 z-50 transition-transform duration-300 ease-out"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <nav class="space-y-6">
      <a href="#" class="block" @click="emit('close')">Songs</a>
      <a href="#" class="block" @click="emit('close')">About</a>
    </nav>
  </aside>
</template>
