import { faSidebar } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Separator } from "@owl/lib/components/separator";
import { SidebarInset, SidebarProvider, useSidebar } from "@owl/lib/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthSideNav } from "../components/AuthSideNav";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/_authenticated")({
      beforeLoad: async ({ context, location }) => {
            if (context.auth.isLoading) {
                  return;
            }
            const token = context.auth.token;
            if (!token) {
                  throw redirect({
                        to: "/login",
                        search: { redirect: location.href },
                  });
            }
      },
      component: AuthWrapper,
});

function AuthWrapper() {
      return (
            <SidebarProvider>
                  <div>
                        <AuthSideNav />
                  </div>
                  <SidebarInset className="m-4 ml-0 rounded-lg shadow">
                        <main className="px-4">
                              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                                    <div className="flex items-center gap-2">
                                          <CustomSidebarTrigger />
                                          <div>
                                                <Separator
                                                      orientation="vertical"
                                                      className="mr-2 data-[orientation=vertical]:h-4"
                                                />
                                          </div>
                                          <Breadcrumbs />
                                    </div>
                              </header>
                              <Outlet />
                        </main>
                  </SidebarInset>
            </SidebarProvider>
      );
}

function CustomSidebarTrigger() {
      const { toggleSidebar } = useSidebar();
      return (
            <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  aria-label="Toggle sidebar"
                  className="rounded-lg"
                  onClick={toggleSidebar}
            >
                  <FontAwesomeIcon size="lg" icon={faSidebar} aria-hidden />
            </Button>
      );
}
