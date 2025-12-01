import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import Logout from "./pages/Logout";
import SignupPage from "./pages/SignupPage";
import CreateCommentPage from "./pages/CreateCommentPage";
// admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreatePost from "./pages/admin/CreatePost";

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
      path: "/post/:id/comments/new",
      element: <CreateCommentPage />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    // admin protected routes
    {
      path: "/dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/posts/new",
      element: <CreatePost />,
    },
    {
      path: "/post/:id/edit",
    },
    {
      path: "/post/:id/delete",
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRoutes;
