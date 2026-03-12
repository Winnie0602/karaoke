export type Tab = '한국어' | '日本語' | '臺語' | 'English' | '廣東話'

export type LangCode = 'kr' | 'ja' | 'tw' | 'en' | 'hk' | 'zh'

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
