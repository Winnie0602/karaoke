import type { LangCode } from '~/types/lang'
import type { LyricData } from '~/types/song'

interface UseTypingModeOptions {
  lyricData: LyricData
  mode: 'allBlank' | 'partial'
  blankCountPercent?: number // 只給 partialBlank 用
  language: LangCode
}

function handleLanguageData(lyricData: LyricData, language: LangCode) {
  const arr: string[] = []

  if (language === 'en') {
    lyricData.en?.forEach((e) => {
      arr.push(e.surface)
    })

    return arr.join(' ')
  }

  if (language === 'ja') {
    lyricData.ja?.forEach((e) => {
      if (e.reading) {
        arr.push(e.reading)
      } else {
        arr.push(e.surface)
      }
    })

    return arr.join('')
  }
  return arr.join('')
}

export function useTypingMode(options: UseTypingModeOptions) {
  const { mode, blankCountPercent = 50, language, lyricData } = options
  const answer = handleLanguageData(lyricData, language)

  const chars = answer.split('') // 正確答案陣列
  const length = chars.length

  const blankCount = blankCountPercent * 0.01 * length

  const userInput = ref<string>('') // 使用者輸入
  const resultStates = ref<('correct' | 'wrong')[] | null>(null)

  // 哪些index要顯示答案
  const revealedIndexes = ref<number[]>([])

  const generateRevealedIndexes = () => {
    if (mode === 'allBlank') {
      revealedIndexes.value = []
      return
    }

    // 只取「字母」index（排除空白及符號）
    const letterIndexes = chars
      .map((char, i) => ([' ', '?', ',', ':', "'"].includes(char) ? null : i))
      .filter((i): i is number => i !== null)

    if (letterIndexes.length === 0) {
      revealedIndexes.value = []
      return
    }

    // 要被挖空的 index
    const blanks = new Set<number>()

    while (blanks.size < Math.min(blankCount, letterIndexes.length)) {
      const r = letterIndexes[Math.floor(Math.random() * letterIndexes.length)]!
      blanks.add(r)
    }

    // 要顯示的字母 index
    revealedIndexes.value = letterIndexes.filter((i) => !blanks.has(i))
  }

  generateRevealedIndexes()

  // 顯示在畫面的字
  const displayChars = computed(() => {
    return chars.map((char, i) => {
      // 顯示答案 格子
      if (revealedIndexes.value.includes(i)) return userInput.value[i] || char

      // if (isOriBlank(i)) return 'blk'

      // 挖空 格子
      return userInput.value[i] || ''
    })
  })

  // 這格可不可以輸入
  const isLockedIndex = (i: number) => {
    return revealedIndexes.value.includes(i)
  }

  // 這格是不是單字與單字間的空白
  const isOriBlank = (i: number) => {
    return chars[i] === ' '
  }

  // 判斷答案
  const checkAnswer = () => {
    resultStates.value = chars.map((char, i) => {
      return isOriBlank(i)
        ? 'correct'
        : userInput.value[i] === char
          ? 'correct'
          : 'wrong'
    })
  }

  // 外部傳入輸入
  const handleInput = (target: HTMLInputElement) => {
    userInput.value = target.value.slice(0, length)

    if (userInput.value.length === length) {
      checkAnswer()
    } else {
      resultStates.value = null
    }
  }

  const blankIndexes = computed(() => {
    const arr: number[] = []
    for (let i = 0; i < length; i++) {
      if (!isLockedIndex(i)) arr.push(i)
    }
    return arr
  })

  return {
    length, // 答案長度
    displayChars, // 顯示在畫面上 [_,_,A,_,B]
    resultStates, // 檢查答案結果 [correct,correct,wrong,correct]
    handleInput,
    isLockedIndex, // 判斷這格能不能輸入
    isOriBlank, // 這格是不是單字與單字間的空白
    userInput, // 使用者傳來的字
    blankIndexes,
    answer,
  }
}
