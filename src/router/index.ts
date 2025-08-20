import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes : [
		{
			component: HomeView,
			name     : "home",
			path     : "/",
		},
		{
			component: () => import("../views/DimaTech.vue"),
			name     : "DimaTech",
			path     : "/DimaTech",
		},
	],
});

export default router;
