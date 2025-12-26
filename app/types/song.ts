export interface SongData {
  id: string
  title: string
  artist: string
  lyrics: LyricData[]
}

export interface LyricData {
  start: number
  end: number
  ja: WordData[]
  zh: string
}

export interface WordData {
  surface: string
  reading?: string
  meaning?: string
  origin?: string
}

export interface SongsList {
  id: number
  language: string
  title: string
  artist: string
}
