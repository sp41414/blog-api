import { createBrowserRouter, RouterProvider } from "react-router";

const AppRoutes = () => {
    const routes = createBrowserRouter([
        {
            path: "/",
        },
    ]);

    return <RouterProvider router={routes} />;
};

export default AppRoutes;
