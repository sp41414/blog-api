import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import Logout from "./pages/Logout";
import SignupPage from "./pages/SignupPage";

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
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/:id/comments/new",
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/dashboard",
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRoutes;
