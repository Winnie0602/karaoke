<script setup lang="ts">
import type { SongData } from '~/types/song'
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from '@headlessui/vue'

const { currentSong, step } = defineProps<{
  currentSong: SongData
  step: 1 | 2 | 3 | 4
}>()

const plans = [
  {
    name: 'Startup',
    ram: '12GB',
    cpus: '6 CPUs',
    disk: '160 GB SSD disk',
  },
  {
    name: 'Business',
    ram: '16GB',
    cpus: '8 CPUs',
    disk: '512 GB SSD disk',
  },
  {
    name: 'Enterprise',
    ram: '32GB',
    cpus: '12 CPUs',
    disk: '1024 GB SSD disk',
  },
]

const selected = ref(plans[0])
</script>

<template>
  <div
    class="hide-scroll flex h-[calc(100vh-60px-40px-150px)] flex-col overflow-y-scroll rounded-md border-[1px] border-gray-300 bg-white md:block"
  >
    <div
      class="sticky top-0 z-10 hidden h-[30px] items-center bg-[#e6ebf1] pl-3 md:flex"
    >
      <div class="flex items-center space-x-1.5">
        <div class="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
        <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="h-3 w-3 rounded-full bg-[#28C840]"></div>
        <div class="ml-2 text-[12px] font-medium tracking-wide text-stone-500">
          {{ currentSong?.title || '未選擇歌曲' }}
        </div>
      </div>
    </div>

    <div class="flex h-full w-full flex-col md:h-[calc(100%-30px)] md:flex-row">
      <div
        class="hide-scroll flex flex-row items-center space-y-0 space-x-2 bg-[#f6f6f6]/50 px-3 py-3 md:flex-[1] md:flex-col md:items-stretch md:space-y-1 md:space-x-0 md:px-2 md:py-4"
      >
        <div
          class="shrink-0 cursor-pointer rounded-md bg-[#B58C8C] px-4 py-2 text-sm whitespace-nowrap text-white shadow-sm md:px-3 md:py-4"
        >
          速度調整
        </div>

        <div
          class="shrink-0 cursor-pointer rounded-md px-4 py-2 text-sm whitespace-nowrap text-gray-600 transition-colors hover:bg-gray-200/50 md:px-3 md:py-4"
        >
          考試類型
        </div>

        <div
          class="shrink-0 cursor-pointer rounded-md px-4 py-2 text-sm whitespace-nowrap text-gray-600 transition-colors hover:bg-gray-200/50 md:px-3 md:py-4"
        >
          作答時間
        </div>
      </div>

      <div class="hidden w-px self-stretch bg-gray-200 md:block"></div>

      <div class="flex-[3] bg-white px-4 py-6 md:px-6">
        <RadioGroup v-model="selected">
          <RadioGroupLabel
            class="mb-4 block text-xs font-bold tracking-widest text-gray-400 uppercase"
          >
            選擇合適的選項
          </RadioGroupLabel>

          <div class="space-y-3">
            <RadioGroupOption
              v-for="plan in plans"
              v-slot="{ active, checked }"
              :key="plan.name"
              as="template"
              :value="plan"
            >
              <div
                :class="[
                  checked
                    ? 'border-[#F9595F] bg-[#FFE5E5]/50 ring-1 ring-[#F9595F]'
                    : 'border-gray-200 bg-white hover:border-gray-300',
                  active ? 'ring-2 ring-[#F9595F]/50 ring-offset-1' : '',
                ]"
                class="relative flex cursor-pointer rounded-xl border-[1.5px] px-5 py-4 transition-all focus:outline-none"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center">
                    <div class="text-sm">
                      <RadioGroupLabel
                        as="p"
                        :class="
                          checked
                            ? 'font-bold text-[#F9595F]'
                            : 'font-semibold text-gray-900'
                        "
                      >
                        {{ plan.name }}
                      </RadioGroupLabel>
                      <RadioGroupDescription
                        as="span"
                        :class="checked ? 'text-[#F9595F]/70' : 'text-gray-500'"
                        class="mt-0.5 inline text-xs"
                      >
                        <span>{{ plan.ram }}</span>
                        <span class="hidden sm:inline">/ {{ plan.cpus }}</span>
                        <span aria-hidden="true" class="mx-1">&middot;</span>
                        <span>{{ plan.disk }}</span>
                      </RadioGroupDescription>
                    </div>
                  </div>

                  <div v-show="checked" class="shrink-0 text-[#F9595F]">
                    <svg
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.24z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.hide-scroll::-webkit-scrollbar {
  display: none;
}

.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
