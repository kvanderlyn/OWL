import { faHeartCrack, faPeople } from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from "@owl/lib/components/empty";
import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/friends/")({
      component: RouteComponent,
});

function RouteComponent() {
      return (
            <Empty className="max-w-2xl ">
                  <EmptyMedia variant={"icon"}>
                        <FontAwesomeIcon icon={faHeartCrack} />
                  </EmptyMedia>
                  <EmptyHeader>No friends yet :(</EmptyHeader>
                  <EmptyDescription>
                        It's so lonely in here. You haven't added any friends yet. Get started by adding your first
                        friend!
                  </EmptyDescription>
                  <EmptyContent className="flex-row justify-center gap-2">
                        <Button nativeButton={false} render={<Link to="/find-friends" className="no-underline" />}>
                              Find friends
                        </Button>
                  </EmptyContent>
            </Empty>
      );
}
