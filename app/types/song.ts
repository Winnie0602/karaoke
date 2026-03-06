import type { LangCode } from '~/types/lang'

export interface SongData {
  id: string
  title: string
  artist: string
  language: LangCode
  vocabularies: VocabularyData[]
  lyrics: LyricData[]
}

export interface VocabularyData {
  vocabulary: string
  zh: string
  en: string
  kr: string
}

export interface LyricData {
  start: number
  end: number
  ja?: string
  kr?: string
  en?: string
  tw?: string
  hk?: string
  zh: string
  ruby?: string
}

export interface SongsList {
  id: string
  language: string
  title: string
  artist: string
  hasLyrics: boolean
}
