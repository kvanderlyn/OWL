import LogoutButton from '@/components/logoutButton';
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import Logo from "../assets/OWL_Mark_dark_v3.svg?react"
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@owl/lib/components/sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSidebar } from "@awesome.me/kit-25b3efc452/icons/classic/light"
import { Button } from '@owl/lib/components/button';
import { Separator } from '@owl/lib/components/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@owl/lib/components/breadcrumb"

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
                Sidebar
            </div>
            <SidebarInset>
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
    return <Button type='button' variant={'ghost'} size={'icon'} aria-label='Toggle sidebar' className='rounded' onClick={toggleSidebar}>
        <FontAwesomeIcon size='xl' icon={faSidebar} aria-hidden />
    </Button>
}
