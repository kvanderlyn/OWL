import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context, location }) => {
        const token = context.authentication.getToken();
        if (!token) {
            throw redirect({
                to: "/signin",
                search: { redirect: location.href }
            })
        }
    }
});

