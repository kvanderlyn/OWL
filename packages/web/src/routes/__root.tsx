import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { type AuthState, useAuthStore } from "@/store/authStore";
import logo from "../assets/OWL_Mark_v4.svg?url";
import { router } from "../router";

interface RouterContext {
      auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
      component: RootComponent,
      head: () => ({
            meta: [
                  {
                        name: "OWL",
                        content: "Over-engineered Wish List App",
                  },
                  {
                        title: "OWL",
                  },
            ],
            links: [{ rel: "icon", href: logo }],
      }),
});

function RootComponent() {
      const { loadSession } = useAuthStore();
      useEffect(() => {
            loadSession().then(() => router.invalidate());
      }, [loadSession]);

      return (
            <>
                  <HeadContent />
                  <div className="w-screen h-screen bg-accent">
                        <div>
                              <Outlet />
                        </div>
                  </div>
            </>
      );
}
