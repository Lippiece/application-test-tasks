<script setup lang="ts">
import { computed, ref, shallowRef } from "vue"

import IconError from "./icons/IconError.vue"
import IconSuccess from "./icons/IconSuccess.vue"
import IconWarning from "./icons/IconWarning.vue"

export type ProgressStatus = "error" | "progress" | "success" | "warning"

const { status = "progress", type = "default" } = defineProps<{
  status?: ProgressStatus
  type?  : "dashboard" | "default"
}>()

const colors         = {
  error   : "#ff4747",
  progress: "#20a0ff",
  success : "#12ce66",
  warning : "#e7a23d",
} as const
const progressStroke = computed(() => colors[status])

const statusIcons = shallowRef({
  error  : IconError,
  success: IconSuccess,
  warning: IconWarning,
})

const progress = defineModel<string>({ default: "0" })

const radius        = ref("90")
const circumference = computed(() => 2 * Math.PI * Number(radius.value))
const visible       = computed(
  () => circumference.value - (60 / 360) * circumference.value,
)
const gap           = computed(() => (60 / 360) * circumference.value)
</script>

<template>
  <div class="relative dark:text-white">
    <span
      v-if="status === 'progress'"
      class="absolute inset-0 flex items-center justify-center text-xl"
    >
      {{ progress }} %
    </span>

    <component
      :is="statusIcons[status]"
      v-else
      class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 dark:text-white"
      width="24"
      height="24"
    />

    <svg
      class="-rotate-90"
      width="200"
      height="200"
      viewBox="-25 -25 250 250"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >

      <circle
        class="stroke-zinc-200 dark:stroke-zinc-800"
        :r="radius"
        cx="100"
        cy="100"
        fill="transparent"
        stroke-width="16px"
      />

      <circle
        v-if="type === 'default'"
        class="transition-all"
        r="90"
        cx="100"
        cy="100"
        :stroke="progressStroke"
        stroke-width="16px"
        stroke-linecap="round"
        :stroke-dashoffset="2 * Math.PI * 90 * (1 - Number(progress) / 100)"
        fill="transparent"
        :stroke-dasharray="circumference"
      />

    </svg>
  </div>
</template>

