const routes = [
  {
    path: "/",
    component: () => import("layouts/Layout.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/main/Main.vue")
      },
      {
        path: "/login",
        component: () => import("pages/auth/Login.vue")
      },
      {
        path: "/territory/:id",
        component: () => import("pages/territory/Territory.vue")
      },
      {
        path: "/project-profile/:id",
        component: () => import("pages/project/ProjectProfile.vue")
      },
      { path: "/graph", component: () => import("pages/graph/Graph.vue") },
      { path: "/graph/:id", component: () => import("pages/graph/Graph.vue") },
      {
        path: "/territory-results",
        component: () => import("pages/results/territory/TerritoryResults.vue")
      },
      {
        path: "/project-results",
        component: () => import("pages/results/project/ProjectResults.vue")
      },
      //ToDo: add different component for projet results
      { path: "/communaute", component: () => import("pages/Communaute.vue") },
      {
        path: "/indicatheque",
        component: () => import("pages/Indicatheque.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
