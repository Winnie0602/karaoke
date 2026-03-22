// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
  ],
  runtimeConfig: {
    mongoURI: process.env.MONGODB_URI || '',
  },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        },
      ],
    },
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      // code 專案識別, language 瀏覽器識別, name UI識別
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json',
        flag: '🇺🇸',
      },
      {
        code: 'zh',
        language: 'zh-TW',
        name: '中文',
        file: 'zh.json',
        flag: '🇹🇼',
      },
      {
        code: 'ja',
        language: 'ja-JP',
        name: '日本語',
        file: 'ja.json',
        flag: '🇯🇵',
      },
      {
        code: 'ko',
        language: 'ko-KR',
        name: '한국어',
        file: 'ko.json',
        flag: '🇰🇷',
      },
    ],
    defaultLocale: 'en',
  },
})
