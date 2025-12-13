import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router";

export default function NavBar() {
    const { user, loading } = useContext(AuthContext);

    return (
        <header className="bg-neutral-950">
            <nav className="flex sm:flex-row justify-between items-center p-4 gap-2 flex-col shrink-0">
                <Link
                    to="/"
                    className="inline-block text-2xl text-emerald-400 hover:text-emerald-300 hover:scale-105 transition-all duration-200 active:scale-100"
                >
                    Blog
                </Link>
                <ul className="flex gap-4 items-center">
                    {loading ? (
                        <li className="text-neutral-500 animate-pulse">Loading...</li>
                    ) : user ? (
                        <>
                            <li>
                                <Link
                                    to="/logout"
                                    className="inline-block text-neutral-400 hover:text-rose-400 transition-colors duration-200"
                                >
                                    Logout
                                </Link>
                            </li>
                            {user && user?.admin && (
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className="inline-block text-neutral-400 hover:text-emerald-300 transition-colors duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="inline-block text-neutral-400 hover:text-emerald-300 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-200 active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}
