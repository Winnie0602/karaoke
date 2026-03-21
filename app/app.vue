<script setup lang="ts">
const { isModalOpen, title, content, type, confirm, cancel } = useCheckConfirm()
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>

    <Toast />

    <ConfirmModal
      :open="isModalOpen"
      :title="title"
      :content="content"
      :type="type"
      @confirm="confirm"
      @close="cancel"
    />
  </div>
</template>
