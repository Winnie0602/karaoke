import type { LangCode } from '~/types/lang'

export interface SongData {
  id: string
  title: string
  artist: string
  language: LangCode
  lyrics: LyricData[]
}

export interface LyricData {
  start: number
  end: number
  ja?: WordData[]
  kr?: WordData[]
  en?: WordData[]
  tw?: WordData[]
  hk?: WordData[]
  zh: string
  ori: string
}

export interface WordData {
  surface: string
  reading?: string
  meaning?: string
  origin?: string
}

export interface SongsList {
  id: string
  language: string
  title: string
  artist: string
  hasLyrics: boolean
}
