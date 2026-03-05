<script setup lang="ts">
const { isModalOpen, title, content, confirm, cancel } = useCheckConfirm()
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Toast />

    <ConfirmModal
      :open="isModalOpen"
      :title="title"
      :content="content"
      @confirm="confirm"
      @close="cancel"
    />
  </div>
</template>
