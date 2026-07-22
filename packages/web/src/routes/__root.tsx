import { useAuthStore, type AuthState } from '@/store/authStore'
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useEffect } from 'react'
import { router } from "../router"
import logo from "../assets/OWL_Mark_v4.svg?url"

interface RouterContext {
    auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
    head: () => ({
        meta: [
            {
                name: "OWL",
                content: "Over-engineered Wish List App"
            },
            {
                title: "OWL"
            }
        ],
        links: [
            { rel: 'icon', href: logo }
        ]
    })
})

function RootComponent() {
    const { loadSession } = useAuthStore()
    useEffect(() => {
        loadSession().then(() => router.invalidate())
    }, [])
    return (
        <>
            <HeadContent />
            <div className='w-screen h-screen bg-accent'>
                <div>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

