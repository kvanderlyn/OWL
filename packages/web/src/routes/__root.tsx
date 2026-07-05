import { useAuthStore, type AuthState } from '@/store/authStore'
import { Button, buttonVariants } from '@owl/lib/components/button'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useEffect } from 'react'
import { router } from "../router"
import LogoutButton from '@/components/logoutButton'

interface RouterContext {
    auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
})

function RootComponent() {
    const { loadSession } = useAuthStore()
    useEffect(() => {
        loadSession().then(() => router.invalidate())
    }, [])
    return (
        <div className='w-screen h-screen bg-accent'>
            {/* <div className='flex space-x-4'>
                <Link
                    className="text-sm text-primary hover:underline py-1.5"
                    to="/"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Home </Link>
                <Link
                    className="text-sm text-primary hover:underline py-1.5"
                    to="/dashboard"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Dashboard </Link>
                {token !== null ? <LogoutButton /> : <Link
                    className="text-sm text-primary hover:underline py-1.5"
                    to="/dashboard"
                    activeProps={{
                        className: 'font-bold',
                    }}
                >
                    Log In </Link>}
            </div> */}
            <div>
                <Outlet />
            </div>
        </div>
    )
}

