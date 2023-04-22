import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AddDeck } from './components/AddDeck'
import { DeleteDeck } from './components/DeleteDeck'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ErrorPage } from './components/ErrorPage'
import { Home } from './components/Home'
import { Menu } from './components/Menu'
import { NoMatch } from './components/NoMatch'
import { Practice } from './components/Practice'
import { appConfig } from './config'
import './index.css'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'menu/*',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Menu />,
            },
            {
              path: 'add-deck',
              element: <AddDeck />,
            },
            {
              path: 'delete-deck',
              element: <DeleteDeck />,
            },
            {
              path: '*',
              element: <NoMatch />,
            },
          ],
        },
        {
          path: 'practice',
          element: <Practice />,
        },
        {
          path: '*',
          element: <NoMatch />,
        },
      ],
    },
  ],
  { basename: appConfig.BASE_URL }
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
