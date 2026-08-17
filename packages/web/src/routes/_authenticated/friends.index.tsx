import { faHeartCrack } from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from "@owl/lib/components/empty";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@owl/lib/components/item";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getFriends } from "@/api/friends";
import UserAvatar from "@/components/UserAvatar";
export const Route = createFileRoute("/_authenticated/friends/")({
      component: RouteComponent,
      loader: async () => {
            const friendList = (await getFriends()).rows;
            return { friendList };
      },
});

function RouteComponent() {
      const { friendList } = Route.useLoaderData();
      if (friendList.length > 0) {
            return (
                  <div className="flex flex-wrap space-x-4 space-y-2">
                        {friendList.map((friend) => (
                              <Item
                                    render={<Link to="/friends/$username" params={{ username: friend.username }} />}
                                    key={friend.username}
                                    variant={"outline"}
                                    className="w-full md:w-sm"
                              >
                                    <ItemMedia>
                                          <UserAvatar size="lg" userId={friend.id} userName={friend.name} />
                                    </ItemMedia>
                                    <ItemContent>
                                          <ItemTitle>{friend.name}</ItemTitle>
                                          <ItemDescription className="mt-0">@{friend.username}</ItemDescription>
                                    </ItemContent>
                                    {/* <ItemActions>{friendButton(result)}</ItemActions> */}
                              </Item>
                        ))}
                  </div>
            );
      }
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
