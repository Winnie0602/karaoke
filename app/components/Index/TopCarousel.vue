<script setup lang="ts">
import type { SongsList } from '~/types/song'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'

const [emblaRef] = emblaCarouselVue({ loop: true, duration: 10 }, [
  Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
])

const { songs } = defineProps<{ songs: SongsList[] }>()
</script>

<template>
  <div ref="emblaRef" class="embla w-full">
    <div class="embla__container space-x-1">
      <NuxtLink
        v-for="song in songs"
        :key="song.id"
        class="embla__slide relative w-[600px]"
        :to="`song/${song.id}`"
      >
        <img
          :src="`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`"
          alt="影片封面"
          class="aspect-video w-full object-cover"
        />
        <div class="absolute bottom-0 left-0 w-full bg-black/60 px-4 py-3">
          <p class="truncate text-base font-semibold text-white">
            {{ song.artist }} - {{ song.title }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.embla {
  overflow: hidden;
}
.embla__container {
  display: flex;
}
.embla__slide {
  @apply min-w-0 flex-[0_0_100%] md:flex-[0_0_600px];
  margin-left: 4px;
}
</style>
