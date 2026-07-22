import "@owl/lib/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { router } from "./router";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
      <QueryClientProvider client={queryClient}>
            <StrictMode>
                  <ThemeProvider>
                        <InnerApp />
                  </ThemeProvider>
            </StrictMode>
      </QueryClientProvider>,
);

function InnerApp() {
      const auth = useAuthStore();
      return <RouterProvider router={router} context={{ auth }} />;
}
