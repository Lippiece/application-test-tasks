<script setup lang="ts">
import type { ChartData, ChartDataset } from "chart.js"

import { Sketch } from "@ckpack/vue-color"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { reactive, ref, useTemplateRef, watch } from "vue"
import { Pie } from "vue-chartjs"

import IconBin from "@/components/icons/IconBin.vue"
import IconPencil from "@/components/icons/IconPencil.vue"

const chartData    = reactive<
  ChartData<"pie"> & {
    datasets: Array<ChartDataset<"pie", number[]> & { backgroundColor: string[] }>
    labels  : string[]
  }
>({
  datasets: [
    {
      backgroundColor: ["#ff0000aa", "#00ff00aa", "#0000ffaa"],
      data           : [40, 20, 120],
    },
  ],
  labels: ["January", "February", "March"],
})
const currentIndex = ref<number>()
const editData     = reactive<{
  color?: string
  label?: string
  value?: number
}>({
  color: "#000",
})

ChartJS.register(ArcElement, Tooltip, Legend)

const editModal = useTemplateRef<HTMLDialogElement>("edit-modal")

watch(currentIndex, current => {
  const [dataset] = chartData.datasets

  Object.assign(
    editData,
    typeof current === "number"
      ? {
          color: dataset.backgroundColor[current] || "",
          label: chartData.labels[current],
          value: dataset.data[current],
        }
      : {
          color: "#eee",
          label: undefined,
          value: undefined,
        },
  )
})

const deleteItem = (index: number) => {
  const clone = { ...chartData }

  const [dataset] = clone.datasets

  dataset.data = [
    ...dataset.data.slice(0, index),
    ...dataset.data.slice(index + 1),
  ]
  dataset.backgroundColor.splice(index, 1)
  clone.labels.splice(index, 1)

  Object.assign(chartData, clone)
}
</script>

<template>
  <main class="container flex flex-col items-center gap-4 py-8">
    <h1 class="text-xl">
      Круговая диаграмма
    </h1>

    <section class="flex w-full flex-col items-stretch gap-2 lg:w-1/2">
      <ol class="flex flex-col items-stretch gap-2">
        <li
          v-for="(sector, index) in chartData.datasets[0].data"
          :key="(chartData.labels?.[index] as string) || index"
          class="flex justify-between rounded-[10px] bg-[#DBDFE933] px-5 py-4.5"
        >
          <div class="flex min-w-1/2 items-center justify-evenly gap-6">
            <span class="min-w-20">{{ chartData.labels?.[index] }}</span>

            <hr class="h-full border-x border-[#DBDFE9] dark:border-zinc-500">

            <span>{{ sector }}</span>

            <hr class="h-full border-x border-[#DBDFE9] dark:border-zinc-500">

            <span
              :style="{
                background: (
                  chartData.datasets[0].backgroundColor?.[index] as {
                    hex8?: string
                  }
                )?.hex8,
              }"
              class="size-4 rounded-full"
            />
          </div>

          <div class="flex items-center gap-5">
            <button
              type="button"
              class="cursor-pointer"
              @click="
                () => {
                  editModal?.showModal()
                  currentIndex = index
                }
              "
            >
              <IconPencil />
            </button>

            <button
              type="button"
              class="cursor-pointer"
              @click="deleteItem(index)"
            >
              <IconBin />
            </button>
          </div>
        </li>
      </ol>

      <button
        type="button"
        class="w-full cursor-pointer rounded-[10px] bg-[#1B84FF] px-9 py-4.5 text-white"
        @click="editModal?.showModal()"
      >
        Добавить сектор
      </button>

      <dialog
        ref="edit-modal"
        closedby="any"
        class="m-auto! max-w-5/6 flex-col gap-4 rounded-2xl p-5 outline-none backdrop:bg-black/80 open:flex lg:max-w-1/3 dark:bg-zinc-800 dark:text-white"
        @close="currentIndex = undefined"
      >
        <p class="text-center text-xl">
          {{
            typeof currentIndex === "number"
              ? `Редактирование сектора
${chartData.labels?.[currentIndex]}`
              : "Добавление сектора"
          }}
        </p>

        <form
          method="dialog"
          class="flex flex-col items-stretch gap-5"
        >
          <label
            class="flex flex-col rounded-[10px] border border-[#DBDFE9] px-5 py-2.5 text-xs text-[#99A1B7] dark:border-zinc-600"
          >
            Наименование
            <input
              v-model="editData.label"
              required
              type="text"
              class="border-none text-base text-[#252F4A] outline-none dark:text-white"
            >

          </label>

          <label
            class="flex flex-col rounded-[10px] border border-[#DBDFE9] px-5 py-2.5 text-xs text-[#99A1B7] dark:border-zinc-600"
          >
            Значение
            <input
              v-model="editData.value"
              required
              type="text"
              class="border-none text-base text-[#252F4A] outline-none dark:text-white"
            >

          </label>

          <Sketch
            v-model="editData.color"
            class="w-full! self-center lg:w-7/8! dark:bg-zinc-800! dark:text-white"
          />

          <button
            class="w-full cursor-pointer rounded-[10px] bg-[#1B84FF] px-9 py-4.5 text-white"
            type="submit"
            @click="
              () => {
                const [dataset] = chartData.datasets

                if (typeof currentIndex === 'number') {
                  chartData.labels[currentIndex] = editData.label!
                  dataset.data[currentIndex] = editData.value!
                  dataset.backgroundColor[currentIndex] =
                    (editData.color as unknown as { hex8: string }).hex8 ||
                    editData.color ||
                    ''

                  return
                }

                dataset.data = [...dataset.data, editData.value!]
                dataset.backgroundColor.push(
                  (editData.color as unknown as { hex8: string }).hex8 ||
                    editData.color ||
                    '',
                )
                chartData.labels.push(editData.label!)
              }
            "
          >
            {{
              typeof currentIndex === "number"
                ? `Сохранить сектор`
                : "Добавить сектор"
            }}
          </button>
        </form>
      </dialog>
    </section>

    <div class="lg:w-1/2">
      <Pie
        :key="JSON.stringify(chartData)"
        :options="{
          responsive: true,
          borderColor: '#194D33A8',
          // color: 'red',
          // backgroundColor: 'green',
          layout: {
            autoPadding: true,
          },
        }"
        :data="chartData"
      />
    </div>
  </main>
</template>

<style>
.vc-saturation {
  pointer-events: stroke !important;
  * {
    pointer-events: none !important;
  }
}
</style>

