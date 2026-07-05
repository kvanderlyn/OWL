import LogoutButton from '@/components/logoutButton';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Logo from "../assets/OWL_Mark_dark_v3.svg?react"

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
        <div>
            <BrandBar />
            <Outlet />
        </div>
    )
}

function BrandBar() {
    return (
        <div className='w-screen py-4 bg-primary'>
            <div className='w-full max-w-6xl px-4 py-2 mx-auto flex items-center justify-between'>
                <LogoLink />
                <LogoutButton />
            </div>
        </div>
    )
}

function LogoLink() {
    return (
        <div>
            <Logo className='size-10 fill-white' aria-hidden />
        </div>
    )
}