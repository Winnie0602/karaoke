export function useCheckComfirm() {
  const isModalOpen = ref(false)

  const title = ref('')
  const content = ref('')

  let resolver: ((boo: boolean) => void) | null = null

  const open = (t: string, c: string) => {
    title.value = t
    content.value = c
    isModalOpen.value = true

    return new Promise<boolean>((resolve) => {
      resolver = resolve
    })
  }

  const confirm = () => {
    isModalOpen.value = false
    resolver?.(true)
    resolver = null
  }

  const cancel = () => {
    isModalOpen.value = false
    resolver?.(false)
    resolver = null
  }

  return { isModalOpen, title, content, open, confirm, cancel }
}
