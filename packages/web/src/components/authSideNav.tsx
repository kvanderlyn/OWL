import { faChevronRight, faGear, faPaperPlane } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import {
      faAnglesUpDown,
      faArrowLeftFromBracket,
      faList,
      faUserGroup,
} from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { faGrid2 } from "@awesome.me/kit-25b3efc452/icons/utility/semibold";
import { faCircleUser } from "@awesome.me/kit-25b3efc452/icons/vellum/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, AvatarFallback, AvatarImage } from "@owl/lib/components/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@owl/lib/components/collapsible";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuGroup,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "@owl/lib/components/dropdown-menu";
import {
      Sidebar,
      SidebarContent,
      SidebarFooter,
      SidebarGroup,
      SidebarGroupContent,
      SidebarGroupLabel,
      SidebarHeader,
      SidebarMenu,
      SidebarMenuButton,
      SidebarMenuItem,
      SidebarMenuSub,
      SidebarMenuSubButton,
      SidebarMenuSubItem,
      useSidebar,
} from "@owl/lib/components/sidebar";
import { Link, type LinkOptions } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import Logo from "../assets/OWL_Mark_v4.svg?react";
import owl_img from "../assets/owls/owl_avatar_2.png";
import { router } from "../router";

interface NavLinkI {
      title: string;
      url: LinkOptions["to"];
      icon: typeof faCircleUser;
      isActive: boolean;
      items?: {
            title: string;
            url: LinkOptions["to"];
      }[];
}
interface NavUser {
      name: string;
      email: string;
      avatar: ReactNode;
}

function AuthSideNav() {
      const { user } = useAuthStore();
      const defaultAvatar = <FontAwesomeIcon icon={faCircleUser} size="2xl" />;
      const data: { user: NavUser; navMain: NavLinkI[] } = {
            user: {
                  name: user?.name || "",
                  email: user?.email || "",
                  avatar: defaultAvatar,
            },
            navMain: [
                  {
                        title: "Dashboard",
                        url: "/dashboard",
                        icon: faGrid2,
                        isActive: true,
                  },
                  {
                        title: "Friends",
                        url: "/dashboard",
                        icon: faUserGroup,
                        isActive: false,
                        items: [
                              {
                                    title: "Bobby",
                                    url: "/dashboard",
                              },
                              {
                                    title: "Sam",
                                    url: "/dashboard",
                              },
                              {
                                    title: "Molly",
                                    url: "/dashboard",
                              },
                              {
                                    title: "Kat",
                                    url: "/dashboard",
                              },
                              {
                                    title: "Aryan",
                                    url: "/dashboard",
                              },
                        ],
                  },
                  {
                        title: "My Lists",
                        url: "/my-lists",
                        icon: faList,
                        isActive: false,
                  },
            ],
      };
      return (
            <Sidebar variant="inset" collapsible="icon">
                  <SidebarHeader>
                        <LogoLink link="/dashboard" />
                  </SidebarHeader>
                  <SidebarContent>
                        <Navlinks data={data.navMain} />
                  </SidebarContent>
                  <SidebarFooter>
                        <UserDropdown />
                  </SidebarFooter>
            </Sidebar>
      );
}

function LogoLink(props: { link?: LinkOptions["to"] }) {
      return (
            <SidebarMenu>
                  <SidebarMenuItem>
                        <SidebarMenuButton render={<Link to={props.link} />} size="lg" className="[&_svg]:size-10">
                              {/* <img src={Logo} className="size-10 opacity-66" alt="OWL Logo" /> */}
                              <Logo className="fill-indigo-700" />
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold">OWL Wishlist</span>
                                    <span className="truncate text-xs">v0.0.1</span>
                              </div>
                        </SidebarMenuButton>
                  </SidebarMenuItem>
            </SidebarMenu>
      );
}

function Navlinks(props: { data: NavLinkI[] }) {
      const items = props.data;
      return (
            <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarMenu>
                        {items.map((item) => {
                              if (item.items) {
                                    return (
                                          <Collapsible
                                                key={item.title}
                                                defaultOpen={item.isActive}
                                                className="group/collapsible"
                                                render={
                                                      <SidebarMenuItem>
                                                            <CollapsibleTrigger
                                                                  render={
                                                                        <SidebarMenuButton
                                                                              tooltip={item.title}
                                                                              className="group"
                                                                        >
                                                                              {item.icon && (
                                                                                    <FontAwesomeIcon icon={item.icon} />
                                                                              )}
                                                                              <span>{item.title}</span>
                                                                              <FontAwesomeIcon
                                                                                    icon={faChevronRight}
                                                                                    className="ml-auto transition-transform duration-200 group-data-panel-open:rotate-90"
                                                                              />
                                                                        </SidebarMenuButton>
                                                                  }
                                                            />
                                                            <CollapsibleContent>
                                                                  <SidebarMenuSub>
                                                                        {item.items?.map((subItem) => (
                                                                              <SidebarMenuSubItem key={subItem.title}>
                                                                                    <SidebarMenuSubButton
                                                                                          render={
                                                                                                <Link to={subItem.url}>
                                                                                                      <span>
                                                                                                            {
                                                                                                                  subItem.title
                                                                                                            }
                                                                                                      </span>
                                                                                                </Link>
                                                                                          }
                                                                                    />
                                                                              </SidebarMenuSubItem>
                                                                        ))}
                                                                  </SidebarMenuSub>
                                                            </CollapsibleContent>
                                                      </SidebarMenuItem>
                                                }
                                          />
                                    );
                              }
                              return (
                                    <SidebarMenuButton
                                          tooltip={item.title}
                                          key={item.title}
                                          render={<Link to={item.url} />}
                                    >
                                          {item.icon && <FontAwesomeIcon icon={item.icon} />}
                                          <span>{item.title}</span>
                                    </SidebarMenuButton>
                              );
                        })}
                  </SidebarMenu>
            </SidebarGroup>
      );
}

function SecondaryNavLinks({
      items,
      ...props
}: { items: NavLinkI[] } & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
      const { logout } = useAuthStore();
      function handleLogout() {
            logout().then(() => {
                  router.invalidate();
            });
      }
      return (
            <SidebarGroup {...props}>
                  <SidebarGroupContent>
                        <SidebarMenu>
                              {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                          <SidebarMenuButton
                                                render={
                                                      <Link to={item.url}>
                                                            {" "}
                                                            <FontAwesomeIcon icon={item.icon} />{" "}
                                                            <span>{item.title}</span>{" "}
                                                      </Link>
                                                }
                                          />
                                    </SidebarMenuItem>
                              ))}
                              <SidebarMenuItem>
                                    <SidebarMenuButton onClick={handleLogout}>
                                          <FontAwesomeIcon icon={faArrowLeftFromBracket} aria-hidden /> Logout
                                    </SidebarMenuButton>
                              </SidebarMenuItem>
                        </SidebarMenu>
                  </SidebarGroupContent>
            </SidebarGroup>
      );
}

function UserDropdown() {
      const { logout } = useAuthStore();
      const { isMobile } = useSidebar();
      const { user } = useAuthStore();
      function handleLogout() {
            logout().then(() => {
                  router.invalidate();
            });
      }
      return (
            <SidebarMenu>
                  <SidebarMenuItem>
                        <DropdownMenu>
                              <DropdownMenuTrigger
                                    render={
                                          <SidebarMenuButton
                                                size="lg"
                                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                          >
                                                <Avatar className="h-8 w-8 rounded-lg">
                                                      <AvatarImage
                                                            src={owl_img}
                                                            alt={user?.name}
                                                            className={"rounded-lg"}
                                                      />
                                                      <AvatarFallback className={"rounded-lg border"}>
                                                            <span className="text-2xl">
                                                                  <FontAwesomeIcon icon={faCircleUser} />
                                                            </span>
                                                      </AvatarFallback>
                                                </Avatar>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                      <span className="truncate font-medium">{user?.name}</span>
                                                      <span className="truncate text-xs">{user?.email}</span>
                                                </div>
                                                <FontAwesomeIcon icon={faAnglesUpDown} />
                                          </SidebarMenuButton>
                                    }
                              />
                              <DropdownMenuContent
                                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                              >
                                    <DropdownMenuGroup>
                                          <DropdownMenuLabel className="p-0 font-normal">
                                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                      <Avatar className="h-8 w-8 rounded-lg">
                                                            <AvatarImage
                                                                  src={owl_img}
                                                                  alt={user?.name}
                                                                  className={"rounded-lg"}
                                                            />
                                                            <AvatarFallback className={"rounded-lg border"}>
                                                                  <span className="text-2xl">
                                                                        <FontAwesomeIcon icon={faCircleUser} />
                                                                  </span>
                                                            </AvatarFallback>
                                                      </Avatar>
                                                      <div className="grid flex-1 text-left text-sm leading-tight">
                                                            <span className="truncate font-medium">{user?.name}</span>
                                                            <span className="truncate text-xs">{user?.email}</span>
                                                      </div>
                                                </div>
                                          </DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuGroup>
                                                <DropdownMenuItem render={<Link to="/dashboard" />}>
                                                      <FontAwesomeIcon icon={faGear} /> Account
                                                </DropdownMenuItem>
                                                <DropdownMenuItem render={<Link to="/dashboard" />}>
                                                      <FontAwesomeIcon icon={faPaperPlane} /> Feedback
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={handleLogout}>
                                                      <FontAwesomeIcon icon={faArrowLeftFromBracket} /> Log Out
                                                </DropdownMenuItem>
                                          </DropdownMenuGroup>
                                    </DropdownMenuGroup>
                              </DropdownMenuContent>
                        </DropdownMenu>
                  </SidebarMenuItem>
            </SidebarMenu>
      );
}

export { AuthSideNav, LogoLink, type NavLinkI, Navlinks, type NavUser, SecondaryNavLinks, UserDropdown };
