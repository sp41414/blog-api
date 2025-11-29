import { useState, useEffect } from "react";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkLogin() {
            try {
                setLoading(true);
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
                    {
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(token)}`,
                        },
                    },
                );
                const data = await response.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
    }, []);
    return { user, loading, setUser };
}
