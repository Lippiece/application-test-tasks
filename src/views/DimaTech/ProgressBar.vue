<script setup lang="ts">
import { ref } from "vue"

import type { ProgressStatus } from "@/components/ProgressBar.vue"

import ProgressBar from "@/components/ProgressBar.vue"

const progress = ref("0")
const status   = ref<ProgressStatus>("progress")

const isDashboard = ref(false)
const dynamicHue  = ref(false)
</script>

<template>
  <div class="flex flex-col items-center p-4">
    <h1 class="text-lg">
      Круговой бар
    </h1>

    <article class="flex flex-col items-center gap-4">
      <ProgressBar
        v-model="progress"
        :status="status"
        :type="isDashboard ? 'dashboard' : 'default'"
        :dynamic-hue="dynamicHue"
      />

      <label class="flex flex-col items-center gap-2">
        Заполненность
        <input
          v-model="progress"
          type="range"
        >

      </label>

      <label class="flex flex-col items-center gap-2 *:dark:bg-zinc-900">
        Статус
        <select
          v-model="status"
          class=""
        >

          <option value="progress">progress</option>

          <option value="error">error</option>

          <option value="success">success</option>

          <option value="warning">warning</option>

        </select>

      </label>

      <label class="flex items-center gap-2">
        dashboard тип
        <input
          v-model="isDashboard"
          type="checkbox"
        >

      </label>

      <section class="flex flex-col gap-2">
        <div class="flex flex-col">
          <blockquote>
            "По мере увеличения значения прогресс бара цвет заполненного
            сектора окружности меняется от красного к зеленому."
          </blockquote>

          <p class="self-end text-sm dark:text-zinc-700">
            - Альберт Эйнштейн
          </p>
        </div>

        <p>
          Это непонятное условие, ведь цвет меняется в зависимости от статуса.
        </p>

        <label class="flex items-center gap-2">
          Вариант реализации
          <input
            v-model="dynamicHue"
            type="checkbox"
          >

        </label>
      </section>
    </article>
  </div>
</template>

