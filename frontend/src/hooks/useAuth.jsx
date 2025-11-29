import { useState, useEffect } from "react";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function checkUser() {
            try {
                const status = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
                    {
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    },
                );
                if (!status.ok) {
                    throw new Error("Not authenticated");
                }
                const data = await status.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
                setError(err);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        checkUser();
    }, []);
    return { user, error, loading };
}
