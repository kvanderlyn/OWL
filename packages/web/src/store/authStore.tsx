import type { User } from "@owl/api/src/utils/auth";
import { create } from "zustand";
import { authClient } from "@/lib/auth-client";
import { router } from "@/router";

interface LoginDetails {
      username: string;
      password: string;
}

export interface AuthState {
      user: User | null;
      token: string | null;
      login: (LoginDetails: LoginDetails) => void;
      logout: () => Promise<void>;
      getIsAuthenticated: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
      user: null,
      token: null,

      login: async (LoginDetails: LoginDetails) => {
            set((state) => ({ ...state }));
            await authClient.signIn.username({
                  ...LoginDetails,
                  fetchOptions: {
                        onSuccess: (res) => {
                              const data = res.data;
                              if (data?.user !== undefined) {
                                    set((state) => ({
                                          ...state,
                                          user: data.user,
                                          token: data.token,
                                    }));
                                    console.log("logged in as", data.user.name);
                              }
                        },
                        onError: (error) => console.error(error),
                  },
            });
      },
      logout: async () => {
            set((state) => ({ ...state }));
            await authClient.signOut({
                  fetchOptions: {
                        onSuccess: () => {
                              set((state) => ({ ...state, user: null, token: null }));
                              console.log("logged out");
                        },
                  },
            });
      },
      getIsAuthenticated: async () => {
            const token = get().token;
            if (token) {
                  return true;
            }
            const { data: session } = await authClient.getSession();
            set((state) => ({
                  ...state,
                  user: session?.user ? { ...session.user, username: session.user.username ?? "" } : null,
                  token: session?.session.token,
            }));
            router.invalidate();
            if (session?.session.token) {
                  return true;
            }
            return false;
      },
}));
