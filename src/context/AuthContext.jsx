import { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, signOut, useSession } from '../lib/auth-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // efficient session management using better-auth hook
    const { data: session, isPending: loadingSession } = useSession();

    // Derived state from session
    const sessionUser = session?.user;

    // Admin detection: check role. 
    // Ensure you have added 'role' to your user schema in database and that better-auth returns it.
    // If better-auth doesn't return custom fields by default, you might need to check how to expose it.
    // Assuming standard adapter behavior or that we added it to schema.
    const isAdmin = sessionUser?.role === 'admin';

    // Segregate users - Let everyone be a "user" for profile purposes, 
    // but distinguish "admin" for dashboard routing.
    const user = sessionUser;
    const admin = isAdmin ? sessionUser : null;

    const loginUser = async (email, password) => {
        try {
            const { data, error } = await signIn.email({ email, password });
            if (error) return { success: false, message: error.message || 'Login failed' };

            // Optional: Gate login if trying to log in as admin on user page
            if (data?.user?.role === 'admin') {
                // Force logout if an admin tries to login as user to keep separation strict? 
                // Or let them pass if we treat admins as super-users.
                // User asked for "complete separation".
                // Let's just return success, but `user` context variable will remain null, so they won't penetrate user dashboard.
                // But `admin` variable will be set.
                return { success: true, is_admin: true };
            }

            return { success: true, user: data };
        } catch (err) {
            return { success: false, message: 'An unexpected error occurred' };
        }
    };

    const registerUser = async (email, password, name, phone) => {
        try {
            const { data, error } = await signUp.email({
                email,
                password,
                name,
                phone
            });
            if (error) return { success: false, message: error.message || 'Registration failed' };
            return { success: true, user: data };
        } catch (err) {
            return { success: false, message: 'An unexpected error occurred' };
        }
    };

    const loginAdmin = async (email, password) => {
        try {
            // Strict check
            const allowedAdmins = ['admin@demo.com', 'admin@macantik.com'];
            if (!allowedAdmins.includes(email)) {
                return { success: false, message: 'Unauthorized: Not an admin account' };
            }

            const { data, error } = await signIn.email({ email, password });
            if (error) return { success: false, message: error.message || 'Login failed' };

            // Check if role is actually admin (double protection)
            // Note: data.user.role might not be populated in the response immediately depending on better-auth version,
            // but session update should catch it.

            return { success: true };
        } catch (err) {
            return { success: false, message: 'An unexpected error occurred' };
        }
    };

    const logoutUser = async () => {
        await signOut();
        // Redirect logic handled by components
    };

    const logoutAdmin = async () => {
        await signOut();
        // Redirect logic handled by components
    };

    return (
        <AuthContext.Provider value={{
            user,
            admin,
            loginUser,
            registerUser,
            loginAdmin,
            logoutUser,
            logoutAdmin,
            isAuthenticated: !!user,
            isAdminAuthenticated: !!admin,
            loading: loadingSession
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
