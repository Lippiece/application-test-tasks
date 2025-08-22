<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef } from "vue"

import IconError from "./icons/IconError.vue"
import IconSuccess from "./icons/IconSuccess.vue"
import IconWarning from "./icons/IconWarning.vue"

export type ProgressStatus = "error" | "progress" | "success" | "warning"

const {
  dynamicHue = false,
  status = "progress",
  type = "default",
} = defineProps<{
  dynamicHue?: boolean
  status?    : ProgressStatus
  type?      : "dashboard" | "default"
}>()

const colors = {
  error   : "#ff4747",
  progress: "#20a0ff",
  success : "#12ce66",
  warning : "#e7a23d",
} as const

const statusIcons = shallowRef({
  error  : IconError,
  success: IconSuccess,
  warning: IconWarning,
})

const progress        = defineModel<string>({ default: "0" })
const progressPercent = computed(() => Number(progress.value) / 100)
const progressStroke  = computed(() => {
  if (dynamicHue) {
    const hue = progressPercent.value * 120

    return `hsl(${hue}, 100%, 50%)`
  }

  return colors[status]
})
const defaultBackground = useTemplateRef<SVGCircleElement>("default-background")
const radius            = ref(90)
const gapAngle          = ref(60)
const circumference     = computed(
  () => defaultBackground.value?.getTotalLength() || 0,
)
const visible           = computed(
  () => circumference.value - (gapAngle.value / 360) * circumference.value,
)
const gap = computed(() => (gapAngle.value / 360) * circumference.value)
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
      :class="{
        '-rotate-90': type === 'default',
      }"
      width="200"
      height="200"
      viewBox="-25 -25 250 250"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >

      <circle
        ref="default-background"
        :class="{
          'stroke-zinc-200 dark:stroke-zinc-800': type === 'default',
          'translate-y-[200px] -rotate-90 stroke-zinc-200 dark:stroke-zinc-800':
            type === 'dashboard',
        }"
        :r="radius"
        cx="100"
        cy="100"
        fill="transparent"
        stroke-width="16px"
        stroke-linecap="round"
        :stroke-dasharray="type === 'dashboard' ? `${visible} ${gap}` : ''"
        :stroke-dashoffset="
          type === 'dashboard' ? circumference / 2 - gap / 2 : ''
        "
      />

      <circle
        v-if="type === 'default'"
        class="transition-all"
        cx="100"
        cy="100"
        stroke-width="16px"
        stroke-linecap="round"
        fill="transparent"
        :r="radius"
        :stroke="progressStroke"
        :stroke-dashoffset="circumference * (1 - progressPercent)"
        :stroke-dasharray="circumference"
      />

    </svg>

    <svg
      v-if="type === 'dashboard'"
      class="absolute top-0 left-0 rotate-120"
      width="200"
      height="200"
      viewBox="-25 -25 250 250"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >

      <circle
        class="transition-all"
        :r="radius"
        cx="100"
        cy="100"
        :stroke="progressStroke"
        stroke-width="16px"
        stroke-linecap="round"
        :stroke-dashoffset="
          circumference * (1 - progressPercent * (1 - gapAngle / 360))
        "
        :stroke-dasharray="circumference"
        fill="transparent"
      />

    </svg>
  </div>
</template>

