import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends")({
      component: RouteComponent,
      loader: () => {
            return {
                  crumb: "Friends",
            };
      },
});

function RouteComponent() {
      return (
            <>
                  <title>OWL - Friends</title>
                  <Outlet />
            </>
      );
}
