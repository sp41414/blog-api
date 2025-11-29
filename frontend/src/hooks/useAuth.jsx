import { useState, useEffect } from "react";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkLogin() {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
                    {
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const data = await response.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: "include",
                },
            );

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                const status = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
                    {
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${data.token}`,
                        },
                    },
                );
                const statusData = await status.json();
                if (statusData.user) {
                    setUser(statusData.user);
                }
                return { success: true };
            } else {
                return {
                    success: false,
                    error: data.error?.message || "Login failed",
                };
            }
        } catch (err) {
            console.error(err);
            return { success: false, error: err };
        }
    };

    const signup = async (username, password) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: "include",
                },
            );

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: data.error?.message || "Signup failed",
                };
            }
        } catch (err) {
            console.error(err);
            return { success: false, error: err };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return { user, loading, setUser, login, signup, logout };
}
