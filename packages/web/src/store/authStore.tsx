import type { User } from "@owl/api/src/utils/auth";
import { create } from "zustand";
import { authClient } from "@/lib/auth-client";

interface LoginDetails {
      username: string;
      password: string;
}

export interface AuthState {
      isLoading: boolean;
      user: User | null;
      token: string | null;
      login: (LoginDetails: LoginDetails) => void;
      logout: () => Promise<void>;
      loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
      isLoading: true,
      user: null,
      token: null,
      login: async (LoginDetails: LoginDetails) => {
            set((state) => ({ ...state, isLoading: true }));
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
                                          isLoading: false,
                                    }));
                                    console.log("logged in as", data.user.name);
                              }
                        },
                        onError: (error) => console.error(error),
                  },
            });
      },
      logout: async () => {
            set((state) => ({ ...state, isLoading: true }));
            await authClient.signOut({
                  fetchOptions: {
                        onSuccess: () => {
                              set((state) => ({ ...state, user: null, token: null, isLoading: false }));
                              console.log("logged out");
                        },
                  },
            });
      },
      loadSession: async () => {
            const { data: session } = await authClient.getSession();
            set((state) => ({
                  ...state,
                  user: session?.user ? { ...session.user, username: session.user.username ?? "" } : null,
                  token: session?.session.token,
            }));
            console.log("session loaded");
      },
}));
