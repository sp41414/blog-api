import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import Spinner from "../components/ui/LoadingSpinner";
import Footer from "../components/Footer";
import { Link } from "react-router";
import ErrorAlert from "../components/ui/ErrorAlert";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Failed to login");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 overflow-x-hidden">
      <NavBar />
      {loading && (
        <main className="flex-1 flex flex-col items-center justify-center">
          <Spinner size="xl" />
        </main>
      )}
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}
      {!loading && (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md bg-neutral-800 border border-neutral-800/50 rounded-xl shadow-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-emerald-500 mb-2">
                Welcome Back
              </h2>
              <p className="text-neutral-400 text-sm">
                Enter your information to access your account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-neutral-600 mb-8"
                  placeholder="johndoe"
                />
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-2oo placeholder-neutral-600"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-100 disabled:hover:scale-100 flex justify-center items-center cursor-pointer"
              >
                {isSubmitting ? (
                  <Spinner size="sm" color="text-white" />
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="mt-6 text-center text-sm text-neutral-400">
                Don't have an account?
                <Link
                  to="/signup"
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors hover:underline duration-200 ml-2"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
