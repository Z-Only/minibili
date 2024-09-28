import { createMemoryHistory, createRouter } from "vue-router";
import Home from "@/components/Home.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  { path: "/home", redirect: "/" },
  {
    path: "/setting",
    component: () => import("@/components/Setting.vue"),
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
