import { useAuthStore } from '@/store/authStore'
import { Button, buttonVariants } from '@owl/lib/components/button'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useEffect } from 'react'
import { router } from "../router"

interface RouterContext {
    authentication: { getToken: () => string | null }
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
})

function RootComponent() {
    const { loadSession, signout, token } = useAuthStore()
    useEffect(() => {
        loadSession()
    }, [])
    return (
        <div className='w-screen h-screen bg-accent'>
            <div className='flex space-x-4'>
                <Link
                    className={buttonVariants({ variant: "link" })}
                    to="/"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Home </Link>
                <Link
                    className={buttonVariants({ variant: "link" })}
                    to="/dashboard"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Dashboard </Link>
                {token !== null ? <Button type='button' variant={"link"} onClick={() => signout()} children="Sign Out" /> : <Link
                    className={buttonVariants({ variant: "link" })}
                    to="/dashboard"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Dashboard </Link>}
            </div>
            <div className='w-full max-w-4xl mx-auto'>
                <Outlet />
            </div>
        </div>
    )
}

function LogoutButton() {
    const { signout } = useAuthStore()
    function handleLogout() {
        signout();
        router.invalidate()
    }
    return (
        <Button>Log Out</Button>
    )
}
