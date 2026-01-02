import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL, // This corresponds to the Auth URL
});

export const { signIn, signUp, useSession, signOut } = authClient;
