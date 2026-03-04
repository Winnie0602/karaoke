<script setup lang="ts">
const { showFullPlayer } = defineProps<{ showFullPlayer: boolean }>()

const emit = defineEmits(['closeFullScreen'])
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="showFullPlayer"
        class="fixed inset-0 z-[100] flex h-dvh touch-none items-center justify-center bg-black/80"
      >
        <button
          class="absolute top-5 right-5 z-[110] text-3xl text-white"
          @click="emit('closeFullScreen')"
        >
          ✕
        </button>

        <div class="h-full w-full max-w-[900px] text-white">123</div>
      </div>
    </transition>
  </Teleport>
</template>
