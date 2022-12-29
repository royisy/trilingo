import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter, Outlet, RouterProvider
} from "react-router-dom";
import AddDeck from './components/AddDeck';
import ErrorPage from './components/ErrorPage';
import Home from './components/Home';
import Menu from './components/Menu';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "menu/*",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Menu />
          },
          {
            path: "add-deck",
            element: <AddDeck />
          },
          {
            path: "*",
            element: <ErrorPage />
          }
        ]
      },
      {
        path: "*",
        element: <ErrorPage />
      }
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
