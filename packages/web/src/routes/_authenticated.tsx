import { createFileRoute, Link, Outlet, redirect, type LinkOptions } from '@tanstack/react-router'
import Logo from "../assets/OWL_Mark_v4.svg"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, useSidebar } from "@owl/lib/components/sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faGear, faPaperPlane, faSidebar } from "@awesome.me/kit-25b3efc452/icons/classic/light"
import { Button } from '@owl/lib/components/button';
import { Separator } from '@owl/lib/components/separator';
import { Breadcrumb, BreadcrumbList, BreadcrumbPage } from "@owl/lib/components/breadcrumb"
import { useAuthStore } from '@/store/authStore';
import { faCircleUser } from '@awesome.me/kit-25b3efc452/icons/vellum/solid';
import { faGrid2 } from '@awesome.me/kit-25b3efc452/icons/utility/semibold';
import { faList, faUserGroup, faArrowLeftFromBracket, faAnglesUpDown } from "@awesome.me/kit-25b3efc452/icons/classic/solid"
import type { ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@owl/lib/components/collapsible'
import { router } from "../router"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@owl/lib/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@owl/lib/components/avatar"
import owl_img from "../assets/owls/owl_avatar_2.png";

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context, location }) => {
        const token = context.auth.token
        if (!token) {
            throw redirect({
                to: "/login",
                search: { redirect: location.href }
            })
        }
    },
    component: AuthWrapper
});

function AuthWrapper() {
    return (
        <SidebarProvider>
            <div>
                <AuthSideNav />
            </div>
            <SidebarInset className='m-4 ml-0 rounded-lg shadow'>
                <main>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <CustomSidebarTrigger />
                            <div><Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' /></div>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbPage className="hidden md:block">
                                        Dashboard
                                    </BreadcrumbPage>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    main content
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

function CustomSidebarTrigger() {
    const { toggleSidebar } = useSidebar()
    return <Button type='button' variant={'ghost'} size={'icon'} aria-label='Toggle sidebar' className='rounded-lg' onClick={toggleSidebar}>
        <FontAwesomeIcon size='lg' icon={faSidebar} aria-hidden />
    </Button>
}

interface NavLinkI {
    title: string,
    url: LinkOptions["to"],
    icon: typeof faCircleUser,
    isActive: boolean,
    items?: {
        title: string,
        url: LinkOptions["to"]
    }[]
}
interface NavUser {
    name: string,
    email: string,
    avatar: ReactNode
}
function AuthSideNav() {
    const { user } = useAuthStore()
    const defaultAvatar = <FontAwesomeIcon icon={faCircleUser} size='2xl' />
    const data: { user: NavUser, navMain: NavLinkI[], navSecondary: NavLinkI[] } = {
        user: {
            name: user?.name!,
            email: user?.email!,
            avatar: defaultAvatar
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
                        title: "Bob",
                        url: "/dashboard"
                    }, {
                        title: "Sam",
                        url: "/dashboard"
                    }, {
                        title: "Molly",
                        url: "/dashboard"
                    }, {
                        title: "Kat",
                        url: "/dashboard"
                    }, {
                        title: "Aryan",
                        url: "/dashboard"
                    },
                ]
            },
            {
                title: "My List",
                url: "/dashboard",
                icon: faList,
                isActive: false,
            }
        ],
        navSecondary: [
            {
                title: "Settings",
                url: "/dashboard",
                icon: faGear,
                isActive: false
            }
        ]
    }
    return (
        <Sidebar variant='inset' collapsible='icon'>
            <SidebarHeader>
                <LogoLink link="/dashboard" />
            </SidebarHeader>
            <SidebarContent>
                <Navlinks data={data.navMain} />
                {/* <SecondaryNavLinks items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <UserDropdown />
            </SidebarFooter>
        </Sidebar>
    )
}

function LogoLink(props: { link?: LinkOptions['to'] }) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    render={<Link to={props.link} />}
                    size="lg"
                >
                    <img src={Logo} className='size-10 opacity-66' />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-bold">OWL Wishlist</span>
                        <span className="truncate text-xs">v0.0.1</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>

        </SidebarMenu>
    )
}

function Navlinks(props: { data: NavLinkI[] }) {
    const items = props.data
    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    if (item.items) {
                        return (
                            <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible" render={<SidebarMenuItem>
                                <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} className='group'>
                                    {item.icon && <FontAwesomeIcon icon={item.icon} />}
                                    <span>{item.title}</span>
                                    <FontAwesomeIcon icon={faChevronRight} className='ml-auto transition-transform duration-200 group-data-panel-open:rotate-90' />
                                </SidebarMenuButton>} />
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton render={<Link to={subItem.url}><span>{subItem.title}</span></Link>} />
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                            } />
                        )
                    }
                    return (
                        <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <FontAwesomeIcon icon={item.icon} />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

function SecondaryNavLinks({ items, ...props }: { items: NavLinkI[] } & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const { logout } = useAuthStore()
    function handleLogout() {
        logout().then(() => {
            router.invalidate()
        })
    }
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton render={<Link to={item.url}> <FontAwesomeIcon icon={item.icon} /> <span>{item.title}</span> </Link>} />
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
    )
}

function UserDropdown() {
    const { logout } = useAuthStore()
    const { isMobile } = useSidebar()
    const { user } = useAuthStore()
    function handleLogout() {
        logout().then(() => {
            router.invalidate()
        })
    }
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={owl_img} alt={user?.name} className={"rounded-lg"} />
                                <AvatarFallback className={"rounded-lg border"}>
                                    <span className='text-2xl'><FontAwesomeIcon icon={faCircleUser} /></span>
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-medium'>{user?.name}</span>
                                <span className='truncate text-xs'>{user?.email}</span>
                            </div>
                            <FontAwesomeIcon icon={faAnglesUpDown} />
                        </SidebarMenuButton>
                    } />
                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={owl_img} alt={user?.name} className={"rounded-lg"} />
                                        <AvatarFallback className={"rounded-lg border"}>
                                            <span className='text-2xl'><FontAwesomeIcon icon={faCircleUser} /></span>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-left text-sm leading-tight'>
                                        <span className='truncate font-medium'>{user?.name}</span>
                                        <span className='truncate text-xs'>{user?.email}</span>
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
    )
}