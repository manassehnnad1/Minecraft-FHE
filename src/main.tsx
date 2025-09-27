import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage.tsx'
import Providers from './providers/PrivyProvider.tsx'
import World1 from './pages/World1.tsx'




const router = createBrowserRouter([
  {path:'/',
    element: <App />
  },
  {path:'*',
    element: <NotFoundPage />

  },
  {
    path:'/world1',
    element: <World1 />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
