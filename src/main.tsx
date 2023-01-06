import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter, Outlet, RouterProvider
} from "react-router-dom";
import AddDeck from './components/AddDeck';
import DeleteDeck from './components/DeleteDeck';
import ErrorPage from './components/ErrorPage';
import Home from './components/Home';
import Menu from './components/Menu';
import NoMatch from './components/NoMatch';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
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
            path: "delete-deck",
            element: <DeleteDeck />
          },
          {
            path: "*",
            element: <NoMatch />
          }
        ]
      },
      {
        path: "*",
        element: <NoMatch />
      }
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
