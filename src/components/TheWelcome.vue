<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue"
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>

    <template #heading>
      Тестовые задания
    </template>
  </WelcomeItem>
</template>

