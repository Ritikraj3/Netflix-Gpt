import React from "react";
import Login from "./Login";
import Browse from "./Browse";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const appRouter = createBrowserRouter([
  { path: "/",               element: <Login /> },
  { path: "/browse",         element: <Browse /> },
  { path: "/reset-password", element: <ResetPassword /> },
]);

const Body = () => {



  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
