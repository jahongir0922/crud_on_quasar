const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/sign_in",
    component: () => import("pages/SignIn.vue"),
  },
  {
    path: "/sign_up",
    component: () => import("pages/SignUp.vue"),
  },
  {
    path: "/modal",
    component: () => import("pages/Modal.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
