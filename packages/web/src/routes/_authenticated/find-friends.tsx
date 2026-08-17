import { faHeart } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import { faHeart as faHeartFilled, faHeartSlash, faSearch } from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, AvatarFallback, AvatarImage } from "@owl/lib/components/avatar";
import { Button } from "@owl/lib/components/button";
import { FieldError } from "@owl/lib/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@owl/lib/components/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@owl/lib/components/item";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@owl/lib/components/select";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { addFriend, approveFriend, removeFriend, searchUsers } from "@/api/friends";
import type { dbFriend, friendResult } from "@/api/types";
import AlertError from "@/components/AlertError";
import { useAuthStore } from "@/store/authStore";
export const Route = createFileRoute("/_authenticated/find-friends")({
      component: RouteComponent,
      loader: () => {
            return {
                  crumb: "Find Friends",
            };
      },
});

function RouteComponent() {
      const { user } = useAuthStore();

      const friendSearchOptions = [
            { label: "Name", value: "name" },
            { label: "Username", value: "username" },
      ];
      interface searchForm {
            keyword: string;
            type: string;
      }
      const {
            mutate: search,
            error,
            data: searchResults,
      } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (formData: searchForm) => searchUsers({ ...formData }),
      });
      const { mutate: addFriendMutation, error: friendError } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (id: string): Promise<{ rows: dbFriend[] }> => addFriend(id),
            onSuccess: () => search(getValues()),
      });
      const { mutate: removeFriendMutation, error: removeFriendError } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (id: string): Promise<{ rows: dbFriend[] }> => removeFriend(id),
            onSuccess: () => search(getValues()),
      });
      const { mutate: acceptFriendMutation, error: acceptFriendError } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (id: string): Promise<{ rows: dbFriend[] }> => approveFriend(id),
            onSuccess: () => search(getValues()),
      });

      const {
            control,
            handleSubmit,
            formState: { errors, isValid },
            getValues,
      } = useForm<searchForm>({
            defaultValues: {
                  type: friendSearchOptions[0].value,
                  keyword: "",
            },
      });
      const onSubmit: SubmitHandler<searchForm> = (data) => {
            if (isValid) {
                  search(data);
            } else {
                  console.log(errors);
            }
      };
      const friendButton = (result: friendResult) => {
            if (result.id === user?.id) {
                  return (
                        <Button disabled variant={"outline"}>
                              <FontAwesomeIcon icon={faHeart} />
                              <span className="my-2">This is you!</span>
                        </Button>
                  );
            } else if (result.friendRequest === null) {
                  return (
                        <Button variant={"outline"} onClick={() => addFriendMutation(result.id)}>
                              <FontAwesomeIcon icon={faHeart} />
                              <span className="my-2">Add Friend</span>
                        </Button>
                  );
            } else if (result.isApproved === false && result.requesterId === user?.id) {
                  return (
                        <Button disabled variant={"outline"}>
                              <FontAwesomeIcon icon={faHeartFilled} />
                              <span className="my-2">Request Pending</span>
                        </Button>
                  );
            } else if (result.isApproved === false && result.requesterId !== user?.id) {
                  return (
                        <div className="flex flex-row space-x-2">
                              <Button variant={"outline"} onClick={() => acceptFriendMutation(result.id)}>
                                    <FontAwesomeIcon icon={faHeart} />
                                    <span className="my-2">Accept Friend Request</span>
                              </Button>
                              <Button variant={"destructive"} onClick={() => removeFriend(result.id)}>
                                    <FontAwesomeIcon icon={faHeartSlash} />
                                    <span className="my-2">Reject Friend Request</span>
                              </Button>
                        </div>
                  );
            } else {
                  return (
                        <Button variant={"destructive"} onClick={() => removeFriendMutation(result.id)}>
                              <FontAwesomeIcon icon={faHeartSlash} />
                              <span className="my-2">Remove Friend</span>
                        </Button>
                  );
            }
      };
      return (
            <div>
                  <title>OWL - Find Friends</title>
                  <div className="max-w-4xl typeset typeset-docs px-2">
                        <h2>Find Friends</h2>
                        <p className="text-slate-600">
                              Search for users by name or username. Please select what field you wish to search by and
                              enter a search term.
                        </p>
                        <form className="flex flex-row space-x-2 my-8" onSubmit={handleSubmit(onSubmit)}>
                              <div className="max-w-2xl min-w-1/2">
                                    <InputGroup aria-label="User Search">
                                          <Controller
                                                name="keyword"
                                                control={control}
                                                rules={{ required: "Please enter a search term." }}
                                                render={({ field }) => (
                                                      <InputGroupInput
                                                            aria-invalid={errors.type ? "true" : "false"}
                                                            placeholder="Search friends..."
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                      />
                                                )}
                                          />
                                          <InputGroupAddon>
                                                <FontAwesomeIcon icon={faSearch} />
                                          </InputGroupAddon>
                                          <InputGroupAddon align="inline-end">
                                                <Controller
                                                      name="type"
                                                      control={control}
                                                      render={({ field }) => (
                                                            <Select
                                                                  items={friendSearchOptions}
                                                                  aria-label="keyword"
                                                                  value={field.value}
                                                                  onValueChange={field.onChange}
                                                            >
                                                                  <SelectTrigger className="border-none">
                                                                        <SelectValue />
                                                                  </SelectTrigger>
                                                                  <SelectContent>
                                                                        <SelectGroup>
                                                                              {friendSearchOptions.map((type) => (
                                                                                    <SelectItem
                                                                                          value={type.value}
                                                                                          key={type.label}
                                                                                    >
                                                                                          {type.value}
                                                                                    </SelectItem>
                                                                              ))}
                                                                        </SelectGroup>
                                                                  </SelectContent>
                                                            </Select>
                                                      )}
                                                />
                                          </InputGroupAddon>
                                    </InputGroup>
                                    {errors.keyword && <FieldError>{errors.keyword.message}</FieldError>}
                              </div>
                              <Button variant="default" type="submit">
                                    <FontAwesomeIcon icon={faSearch} /> Search
                              </Button>
                        </form>
                        {error && <AlertError error={error} />}
                        {searchResults && (
                              <div className="flex flex-col space-y-4 max-w-4xl min-x-1/2">
                                    <div>
                                          <span className="font-bold">Results:</span> {searchResults.rows.length ?? 0}
                                    </div>
                                    {friendError && <AlertError error={friendError} />}
                                    {removeFriendError && <AlertError error={removeFriendError} />}
                                    {acceptFriendError && <AlertError error={acceptFriendError} />}

                                    {searchResults.rows.map((result) => (
                                          <Item key={result.username} variant={"outline"}>
                                                <ItemMedia>
                                                      <Avatar size="lg" className="after:border-none">
                                                            <AvatarImage
                                                                  src={`https://api.dicebear.com/10.x/critters/svg?scale=1.59&rotate=20,-20&seed=${result.id}`}
                                                                  className={"rounded-lg mt-0"}
                                                            />
                                                            <AvatarFallback>{result.name[0]}</AvatarFallback>
                                                      </Avatar>
                                                </ItemMedia>
                                                <ItemContent>
                                                      <ItemTitle>{result.name}</ItemTitle>
                                                      <ItemDescription className="mt-0">
                                                            @{result.username}
                                                      </ItemDescription>
                                                </ItemContent>
                                                <ItemActions>{friendButton(result)}</ItemActions>
                                          </Item>
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
}
