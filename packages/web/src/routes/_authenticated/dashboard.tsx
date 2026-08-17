import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchWrapper } from "@/api/fetchWrapper";

export const Route = createFileRoute("/_authenticated/dashboard")({
      component: RouteComponent,
});

function RouteComponent() {
      useQuery({
            queryKey: ["health"],
            queryFn: async () => {
                  const res = await fetchWrapper("/me");
                  if (res.status !== 200) {
                        return { error: "data not found" };
                  }
                  return res.json();
            },
      });
      return (
            <div>
                  <title>OWL - Dashboard</title>
                  Hello "/_authenticated/dashboard"!
            </div>
      );
}
