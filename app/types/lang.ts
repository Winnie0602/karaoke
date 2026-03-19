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

// Tatoeba API & TTS API 對照表
export const LANG_CONFIG_MAP: Record<
  LangCode,
  {
    tatoeba: string
    ttsCode: string
    ttsName: string
  }
> = {
  kr: { tatoeba: 'kor', ttsCode: 'ko-KR', ttsName: 'ko-KR-Wavenet-A' },
  ja: { tatoeba: 'jpn', ttsCode: 'ja-JP', ttsName: 'ja-JP-Wavenet-A' },
  en: { tatoeba: 'eng', ttsCode: 'en-US', ttsName: 'en-US-Wavenet-D' },
  tw: { tatoeba: 'cmn', ttsCode: 'zh-TW', ttsName: 'cmn-TW-Wavenet-A' },
  zh: { tatoeba: 'cmn', ttsCode: 'zh-TW', ttsName: 'cmn-TW-Wavenet-A' },
  hk: { tatoeba: 'cmn', ttsCode: 'zh-TW', ttsName: 'cmn-TW-Wavenet-A' },
}
