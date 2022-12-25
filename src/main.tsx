import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Home from './components/Home';
import Menu from './components/Menu';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }, {
    path: "menu",
    element: <Menu />,
  }
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
