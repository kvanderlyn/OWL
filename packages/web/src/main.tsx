import "@owl/lib/globals.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "@tanstack/react-router"
import { createRouter } from "@tanstack/react-router";
import { routeTree } from './routeTree.gen'
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  </QueryClientProvider>
)
