export default defineNuxtRouteMiddleware((to) => {
  const store = usePlayerStore()

  const path = to.path

  if (path.startsWith('/song/test')) {
    console.log(1)
    store.setMode('test')

    const id = to.params.id as string
    store.setTestVideoId(id)

    store.setPlaybackRate(1)
  } else if (path.startsWith('/admin')) {
    store.setMode('admin')
  } else {
    store.setMode('normal')
  }
})
