<script setup lang="ts">
const { isModalOpen, title, content, type, confirm, cancel } = useCheckConfirm()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Teleport to="body">
    <Toast />
    <ConfirmModal
      :open="isModalOpen"
      :title="title"
      :content="content"
      :type="type"
      @confirm="confirm"
      @close="cancel"
    />
  </Teleport>
</template>
