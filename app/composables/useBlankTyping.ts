import type { LangCode } from '~/types/lang'
import type { LyricData } from '~/types/song'

interface UseTypingModeOptions {
  answer: string
  mode: 'allBlank' | 'partial'
  blankCount?: number // 只給 partialBlank 用
  language: LangCode
}

export function useTypingMode(options: UseTypingModeOptions) {
  const { answer, mode, blankCount = 3 } = options

  const chars = answer.split('') // 正確答案陣列
  const length = chars.length

  const userInput = ref<string>('') // 使用者輸入
  const resultStates = ref<('correct' | 'wrong')[] | null>(null)

  // 哪些index要顯示答案
  const revealedIndexes = ref<number[]>([])

  const generateRevealedIndexes = () => {
    if (mode === 'allBlank') {
      revealedIndexes.value = []
      return
    }

    // 每個字的index [0,1,2,3,4]
    const all = Array.from({ length }, (_, i) => i)

    // 哪些要給空白的index(排重)
    const blanks = new Set<number>()

    while (blanks.size < Math.min(blankCount, length)) {
      const r = Math.floor(Math.random() * length)
      blanks.add(r)
    }

    revealedIndexes.value = all.filter((i) => !blanks.has(i))
  }

  generateRevealedIndexes()

  // 顯示在畫面的字
  const displayChars = computed(() => {
    return chars.map((char, i) => {
      // 顯示答案 格子
      if (revealedIndexes.value.includes(i)) return userInput.value[i] || char

      // 挖空 格子
      return userInput.value[i] || ''
    })
  })

  // 這格可不可以輸入
  const isLockedIndex = (i: number) => {
    return revealedIndexes.value.includes(i)
  }

  // 判斷答案
  const checkAnswer = () => {
    resultStates.value = chars.map((char, i) => {
      return userInput.value[i] === char ? 'correct' : 'wrong'
    })
  }

  // 外部傳入輸入
  const handleInput = (e: Event | CompositionEvent) => {
    const target = e.target as HTMLInputElement
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
    userInput, // 使用者傳來的字
    blankIndexes,
  }
}
