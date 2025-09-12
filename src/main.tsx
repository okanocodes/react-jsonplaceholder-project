import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import PostsPage from "./pages/PostsPage.tsx";
import { Toaster } from "react-hot-toast";

import "./App.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "users", Component: UsersPage },
      { path: "posts", Component: PostsPage },
      {
        path: "*",
        element: <h1>Page not found: 404</h1>,
      },
    ],
  },
]);

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
