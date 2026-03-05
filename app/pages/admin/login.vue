<script setup lang="ts">
definePageMeta({
  layout: 'no-player',
})

const username = ref('')
const password = ref('')
const rememberMe = ref(false)

// 模擬登入
const handleLogin = () => {
  console.log('Login:', {
    username: username.value,
    password: password.value,
    remember: rememberMe.value,
  })
  // 這裡之後接你的 API 邏輯
}

onMounted(() => {
  // 檢查是否有記住過的帳號
  const savedAccount = localStorage.getItem('admin_account')
  if (savedAccount) {
    username.value = savedAccount
    rememberMe.value = true
  }
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
    <div
      class="w-full max-w-md rounded-3xl border border-pink-50 bg-white p-8 shadow-xl shadow-pink-100/50"
    >
      <div class="mb-10 text-center">
        <div
          class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFE5E5] text-[#F9595F]"
        >
          <i class="fa-solid fa-user-shield text-3xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-[#A66B6B]">管理員登入</h1>
        <p class="mt-1 text-sm text-[#A66B6B]/60">
          請輸入您的帳號密碼以進入後台
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label class="mb-2 ml-1 block text-sm font-medium text-[#A66B6B]">
            帳號
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="Admin Username"
            class="w-full rounded-2xl border-none bg-[#FFF9F9] px-5 py-3 text-[#A66B6B] transition-all outline-none placeholder:text-[#A66B6B]/30 focus:ring-2 focus:ring-[#F9595F]/20"
          />
        </div>

        <div>
          <label class="mb-2 ml-1 block text-sm font-medium text-[#A66B6B]">
            密碼
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full rounded-2xl border-none bg-[#FFF9F9] px-5 py-3 text-[#A66B6B] transition-all outline-none placeholder:text-[#A66B6B]/30 focus:ring-2 focus:ring-[#F9595F]/20"
          />
        </div>

        <div class="flex items-center px-1">
          <label class="group flex cursor-pointer items-center">
            <div class="relative flex items-center justify-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-pink-200 bg-white transition-all checked:border-[#F9595F] checked:bg-[#F9595F] hover:border-[#F9595F]"
              />
              <i
                class="fa-solid fa-check pointer-events-none absolute text-xs text-white opacity-0 transition-opacity peer-checked:opacity-100"
              ></i>
            </div>
            <span
              class="ml-3 text-sm font-bold text-[#A66B6B] transition-colors group-hover:text-[#F9595F]"
            >
              記住帳號
            </span>
          </label>
        </div>

        <button
          type="submit"
          class="w-full rounded-2xl bg-[#F9595F] py-4 font-bold text-white shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95"
        >
          登入管理後台
        </button>
      </form>

      <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="text-sm text-[#A66B6B]/50 transition-colors hover:text-[#F9595F]"
        >
          <i class="fa-solid fa-arrow-left mr-1"></i>
          返回首頁
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
