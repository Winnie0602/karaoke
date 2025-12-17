<script setup lang="ts">
defineProps<{
  videoId: string
}>()
</script>

<template>
  <ClientOnly>
    <div class="aspect-video w-full bg-black md:max-w-[960px]">
      <iframe
        class="h-full w-full"
        :src="`https://www.youtube.com/embed/${videoId}?rel=0`"
        title="YouTube video player"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
        "
        allowfullscreen
      />
    </div>
  </ClientOnly>
</template>
