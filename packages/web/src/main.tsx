import "@owl/lib/globals.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "@tanstack/react-router"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useAuthStore } from "./store/authStore";
import { router } from "./router"

const queryClient = new QueryClient()
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </StrictMode>
  </QueryClientProvider>
)

function InnerApp() {
  const auth = useAuthStore()
  return <RouterProvider router={router} context={{ auth }} />
}