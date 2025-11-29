import { createContext } from "react";
import useAuth from "../hooks/useAuth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { user, setUser, loading } = useAuth();

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
