import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";

const AppRoutes = () => {
    const routes = createBrowserRouter([
        {
            path: "/",
            element: <HomePage />,
        },
    ]);

    return <RouterProvider router={routes} />;
};

export default AppRoutes;
