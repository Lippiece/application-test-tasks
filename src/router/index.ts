import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes : [
    {
      component: HomeView,
      name     : "home",
      path     : "/",
    },
    {
      children: [
        {
          component: () => import("../views/DimaTech/ProgressBar.vue"),
          name     : "Bar",
          path     : "bar",
        },
        {
          component: () => import("../views/DimaTech/ColorCharts.vue"),
          name     : "Charts",
          path     : "charts",
        },
      ],
      component: () => import("../views/DimaTech/index.vue"),
      meta     : {
        children: [
          {
            name: "Прогресс бар",
            to  : "/dimatech/bar",
          },
          {
            name: "chartjs",
            to  : "/dimatech/charts",
          },
        ],
      },
      path: "/dimatech",
    },
  ],
})

export default router
