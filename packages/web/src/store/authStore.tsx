import { authClient } from "@/lib/auth-client"
import { create } from "zustand"
import type { User } from "better-auth"

interface LoginDetails {
    username: string,
    password: string
}

export interface AuthState {
    user: User | null,
    token: string | null,
    signin: (LoginDetails: LoginDetails) => void,
    signout: () => void,
    loadSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    signin: async (LoginDetails: LoginDetails) => {
        await authClient.signIn.username({
            ...LoginDetails, fetchOptions: {
                onSuccess: (res) => {
                    const data = res.data
                    if (data?.user !== undefined) {
                        set((state) => ({ ...state, user: data.user, token: data.token }))
                        console.log('logged in as', data.user.name)
                    }
                },
                onError: (error) => console.error(error)
            }
        })
    },
    signout: async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    set((state) => ({ ...state, user: null, token: null }));
                    console.log('logged out')
                }
            }
        });
    },
    loadSession: async () => {
        const { data: session } = await authClient.getSession()
        set((state) => ({ ...state, user: session?.user, token: session?.session.token }))
    }
}))
