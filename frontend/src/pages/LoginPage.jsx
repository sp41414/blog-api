import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import Spinner from "../components/ui/LoadingSpinner";
import Footer from "../components/Footer";
import { Link } from "react-router";
import ErrorAlert from "../components/ui/ErrorAlert";
import Form from "../components/Form";

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
      if (Array.isArray(result.error)) {
        setError(result.error.map((error) => error.msg).join(", "));
        setIsSubmitting(false);
      } else {
        setError(result.error || "Failed to login");
        setIsSubmitting(false);
      }
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
          <Form
            title="Welcome Back"
            description="Enter your information to access your account"
            onSubmit={handleSubmit}
            submitButtonText="Sign In"
            isSubmitting={isSubmitting}
            fields={[
              {
                name: "username",
                label: "Username",
                type: "text",
                value: formData.username,
                onChange: handleChange,
                placeholder: "johndoe",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                value: formData.password,
                onChange: handleChange,
                placeholder: "••••••••",
              },
            ]}
            footer={
              <>
                Don't have an account?
                <Link
                  to="/signup"
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors hover:underline duration-200 ml-2"
                >
                  Sign Up
                </Link>
              </>
            }
          />
        </main>
      )}
      <Footer />
    </div>
  );
}
