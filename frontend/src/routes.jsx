import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";

const AppRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/post/:id",
      element: <PostPage />,
    },
    {
      path: "/login",
    },
    {
      path: "/signup",
    },
    {
      path: "/:id/comments/new",
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRoutes;
