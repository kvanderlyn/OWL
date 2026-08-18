import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
import type { AuthState } from "@/store/authStore";
import logo from "../assets/OWL_Mark_v4.svg?url";

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
