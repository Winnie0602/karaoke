export type Tab = '한국어' | '日本語' | '臺語' | 'English' | '廣東話' | '中文'

export type LangCode = 'kr' | 'ja' | 'tw' | 'en' | 'hk' | 'zh'

export const languageMapCode: Record<Tab, LangCode> = {
  日本語: 'ja',
  臺語: 'tw',
  English: 'en',
  한국어: 'kr',
  廣東話: 'hk',
  中文: 'zh',
}

// 反轉
export const languageMapCodeLabel: Record<LangCode, Tab> = Object.fromEntries(
  Object.entries(languageMapCode).map(([key, value]) => [value, key]),
) as Record<LangCode, Tab>

// Tatoeba API & Web Speech API 對照表
export const LANG_CONFIG_MAP: Record<
  LangCode,
  { api: string; speech: string }
> = {
  kr: { api: 'kor', speech: 'ko-KR' },
  ja: { api: 'jpn', speech: 'ja-JP' },
  en: { api: 'eng', speech: 'en-US' },
  tw: { api: 'cmn', speech: 'zh-TW' },
  zh: { api: 'cmn', speech: 'zh-TW' },
  hk: { api: 'yue', speech: 'zh-HK' },
}
