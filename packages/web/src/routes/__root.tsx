import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <div className='w-screen h-screen bg-accent'>
            <div className='flex space-x-4'>
                <Link
                    to="/signin"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Sign In </Link>
                <Link
                    to="/signup"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Sign Up </Link>
            </div>
            <div className='w-full max-w-4xl mx-auto'>
                <Outlet />
            </div>
        </div>
    )
}
