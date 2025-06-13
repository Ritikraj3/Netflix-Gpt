import React, { useState } from "react";
import Login from "./Login";
import Browse from "./Browse";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const Body = () => {
  

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <Login />
      ),
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ]);



  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
